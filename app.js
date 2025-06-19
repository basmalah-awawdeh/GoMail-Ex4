import express from 'express';
import bodyParser from 'body-parser';

import usersRouter from './backend/src/routes/users.js';
import mailRoutes from './backend/src/routes/mails.js';
import labelRoutes from './backend/src/routes/labels.js';
import blacklistRoutes from './backend/src/routes/blacklist.js';


const app = express();
app.use(bodyParser.json());

// project routes
app.use('/api/users', usersRouter);
app.use('/api/mails', mailRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/blacklist', blacklistRoutes);
app.use('/uploads', express.static('uploads'));

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(3003, () => {
  console.log('Node.js API listening on port 3003');
});
//lsof -i :3003
//kill -9 pid