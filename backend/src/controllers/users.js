import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { users } from '../../sharedData.js';
//signing jwt tokne
const SECRET = 'your-secret-key';

export const registerUser = (req, res) => {
  const { username, password, name } = req.body;
  const imageFile = req.file;
  //if username or password or image is missing, return an error
  if (!username || !password || !imageFile) {
    return res.status(400).json({ error: 'Missing username, password, or image' });
  }
  //checking if someone else have same usename
  const existingUser = users.find(u => u.username === username);
  if (existingUser){
    return res.status(409).json({ error: 'Username already taken' });
  }
  //new user with all details and image from upload folder
  const newUser = { id: uuidv4(), username, password, name: name || '', image: `/uploads/${imageFile.filename}` };
  //saving the user in memory array
  users.push(newUser);
  // making jwt for 2 hours
  const token = jwt.sign({ id: newUser.id }, SECRET, { expiresIn: '2h' });
  //respond with data without password
  res.status(201).json({ token, user: {
    id: newUser.id,
    username: newUser.username,
    name: newUser.name,
    image: newUser.image
  }
});
};

export const getUser = (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  //no user ==> 404 not fuond
  if ((!user)){
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
};

export const loginUser = (req, res) => {
  const { username, password } = req.body;
  //looking for matching user
  const user = users.find(u => u.username === username && u.password === password);
  //no user matches ==> there is soemthing incalid
  if ((!user)){
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  // making jwt for 2 hours
  const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '2h' });
  //respond with data without password
  res.json({ token, user: {
    id: user.id,
    username: user.username,
    name: user.name,
    image: user.image
  }
});
};
