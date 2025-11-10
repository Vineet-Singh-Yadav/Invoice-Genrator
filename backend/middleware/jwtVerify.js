import jwt from"jsonwebtoken"

export default function authVerify(req, res, next){
const token = req.header('auth-token');
if(!token){return res.status(401).json({ error: "Auth token not found" })};

try {
  const data = jwt.verify(token, process.env.JWT_SECRET);
  req.user = data.user;
  next();
} catch (error) {
  res.status(401).json({ error: "Invalid auth token" }); 
}
};