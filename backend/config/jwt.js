const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'freelancer_board_super_secret_key_2026';
const JWT_EXPIRES_IN = '7d';

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = {
  JWT_SECRET,
  generateToken,
  verifyToken,
};
