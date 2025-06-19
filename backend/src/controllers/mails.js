import { v4 as uuidv4 } from 'uuid';
import { mails } from '../../sharedData.js';
import { users } from '../../sharedData.js';
import { sendToCppServer } from './blacklist.js';
import net from 'net';
//spam blacklist from cpp server
let blacklistUrls = [];
const CPP_SERVER_PORT = process.env.CPP_SERVER_PORT || 8081;

export const _injectBlacklist = (bl) =>{
  blacklistUrls = bl;
};
//returning last 50 not deleted mails - newest fisrt
export const getMails = (req, res) =>{
  const result = mails.filter(m => (m.to === req.userId || m.from === req.userId)).filter(m => !m.deletedBy.includes(req.userId));
  res.json(result.slice(-50).reverse());
};

//sending mail or saving drfat
export const sendMail = async (req, res) =>{
  const { to, subject, body, links, sent, timestamp } = req.body;

  if (!to || !body){
    return res.status(400).json({ error: 'Missing recipient or body' });
  }

  const recipient = users.find(u => u.username === to);
  if ((!recipient)){
    return res.status(400).json({ error: 'Recipient not found' });
  }

  const sender = users.find(u => u.id === req.userId);
  if ((!sender)){
    return res.status(403).json({ error: 'Invalid sender' });
  }
  //checking spam
  let spamLabel = false;
  if (sent){
    try {
      for (const link of links || []){
        const result = await checkWithCppServer(link);
        if (result === 'BLACKLISTED'){
          spamLabel = true;
          break;
        }
      }
    }catch (err){
      console.error('C++ server error:', err.message);
      return res.status(500).json({ error: 'Spam check failed' });
    }
  }
  //constructing mail obj
  const mail = {
    id: uuidv4(),
    from: sender.id,
    fromName: sender.username,
    to: recipient.id,
    toName: recipient.username,
    subject,
    body,
    links,
    sent: !!sent,
    labels: spamLabel ? ['spam'] : [],
    deletedBy: [],
    timestamp: timestamp || new Date().toISOString()
  };
  mails.push(mail);
  res.status(201).end();
};
//getting a mail by its id for sender or recipeint
export const getMailById = (req, res) =>{
  const mail = mails.find(m => m.id === req.params.id);
  if (!mail || (mail.from !== req.userId && mail.to !== req.userId)){
    return res.status(403).json({ error: 'Unauthorized or mail not found' });
  }
  res.json(mail);
};
//update drafted mail
export const updateMail = async (req, res) =>{
  const mail = mails.find(m => m.id === req.params.id);
  if ((!mail)){
    return res.status(404).json({ error: 'Mail not found' });
  }
  const isSender = mail.from === req.userId;
  const isRecipient = mail.to === req.userId;
  //sender and recipient can label a toggle
  if (req.body.label){
    if (!isSender && !isRecipient){
      return res.status(403).json({ error: 'Unauthorized' });
    }
    if (!Array.isArray(mail.labels)){
      mail.labels = [];
    }
    const label = req.body.label;
    if (mail.labels.includes(label)){
      //remove label
      mail.labels = mail.labels.filter(l => l !== label);
      //remove url from blacklist if mail unmarked spam
      if (label === 'spam'){
        for (const link of mail.links || []){
          try{
            await sendToCppServer(link, 'REMOVE');
          }catch (err){
            console.error(`Failed to remove link from blacklist: ${link}`, err.message);
          }
        }
      }
    }else{
      //add label
      mail.labels.push(label);
      //mail is spam, add url to blacklist
      if (label === 'spam'){
        for (const link of mail.links || []){
          try{
            await sendToCppServer(link, 'ADD');
          }catch (err){
            console.error(`Failed to add link to blacklist: ${link}`, err.message);
          }
        }
      }
    }
    return res.status(204).end();
  }
  //check that just sender can edit his mail
  if ((!isSender)){
    return res.status(403).json({ error: 'Only the sender can edit this mail' });
  }
  // only drafted mails can be edit
  if (mail.sent && ('subject' in req.body || 'body' in req.body || 'to' in req.body)){
    return res.status(403).json({ error: 'Cannot edit a sent mail' });
  }
  //fields that can be updated
  const allowedFields = ['subject', 'body', 'links'];
  for (const key of allowedFields){
    if (key in req.body){
      mail[key] = req.body[key];
    }
  }
  //sending draft
  if (req.body.sent === true && !mail.sent){
    const recipientUsername = (req.body.to || '').trim();
    const recipient = users.find(u => u.username === recipientUsername);
    if ((!recipient)){
      return res.status(400).json({ error: `Recipient '${recipientUsername}' not found` });
    }
    mail.to = recipient.id;
    mail.toName = recipient.username;
    try{
      let isSpam = false;
      for (const link of mail.links || []){
        const result = await checkWithCppServer(link);
        if (result === 'BLACKLISTED'){
          isSpam = true;
          break;
        }
      }
      if (isSpam){
        if (!mail.labels) mail.labels = [];
        if (!mail.labels.includes('spam')) mail.labels.push('spam');
      }
    }catch (err){
      console.error('C++ server error:', err.message);
      return res.status(500).json({ error: 'Spam check failed' });
    }
    mail.sent = true;
  }
  return res.status(204).end();
};
//deleting mail for the user
export const deleteMail = (req, res) =>{
  const mail = mails.find(m => m.id === req.params.id);
  if ((!mail)){
    return res.status(404).json({ error: 'Mail not found' });
  }
  if (mail.from !== req.userId && mail.to !== req.userId){
    return res.status(403).json({ error: 'Unauthorized' });
  }
  if ((!Array.isArray(mail.deletedBy))){
    mail.deletedBy = [];
  }
  if ((!mail.deletedBy.includes(req.userId))){
    mail.deletedBy.push(req.userId);
  }
  //both sides deleted the mail ==> deleting
  const fromDeleted = mail.deletedBy.includes(mail.from);
  const toDeleted = mail.deletedBy.includes(mail.to);
  const isSelfSent = mail.from === mail.to;
  if ((fromDeleted && toDeleted) || (isSelfSent && fromDeleted)){
    const index = mails.findIndex(m => m.id === mail.id);
    if (index !== -1){
      mails.splice(index, 1);
      console.log(`Mail ${mail.id} permanently deleted`);
    }
  }
  res.status(204).end();
};
//search by fields subject, to , form, body
export const searchMails = (req, res) =>{
  const query = req.params.query.toLowerCase();
  const result = mails.filter(m =>
    [m.subject, m.body, m.to, m.from].some(field =>
      field?.toLowerCase().includes(query)
    )
  );
  res.json(result);
};
//communicating with cpp server
function checkWithCppServer(url){
  return new Promise((resolve, reject) =>{
    const client = net.createConnection({ host: 'cpp-server', port: parseInt(CPP_SERVER_PORT) }, () => {
      client.write(`GET ${url}\n`);
    });
    client.on('data', (data) =>{
      const response = data.toString().trim();
      client.end();
      if (response.includes('true')){
        resolve("BLACKLISTED");
      }else{
        resolve("OK");
      }
    });
    client.on('error', (err) =>{
      reject(err);
    });
  });
}
