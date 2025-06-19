
import jwt from 'jsonwebtoken';
// verify and sign jwt token
const SECRET = 'your-secret-key'; 

export const authMiddleware = (req, res, next) => {
  //extracting authorization header
  const authHeader = req.headers['authorization'];
  //header not provided ==> deny access
  if ((!authHeader)){
    return res.status(401).json({ error: 'Missing Authorization header' });
  }
  //extracting token from header
  const token = authHeader.split(' ')[1]; 
  //no token ==> deny access
  if ((!token)){
    return res.status(401).json({ error: 'Missing token' });
  }
  try{
    //verifying token esing secret key
    const decoded = jwt.verify(token, SECRET);
    //attaching user id to request
    req.userId = decoded.id; 
    next();
  }catch (err){
    //verificatin failure ==> dent accees
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
