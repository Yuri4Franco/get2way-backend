const jwt = require('jsonwebtoken');

const AutenticarToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado, token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica o token
    req.user = decoded; // Armazena os dados do usuário no request
    next(); // Continua para a próxima função
  } catch (err) {
    res.status(401).json({ message: 'Token inválido.' });
  }
};

module.exports = AutenticarToken;
