const Usuario = require("../models").Usuario;
const Empresa = require("../models").Empresa;
const Ict = require("../models").Ict;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Responsavel = require("../models").Responsavel;
require("dotenv").config();

// Login
const Login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verifica se o usuário existe
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Verifica se a senha está correta
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    // Busca as informações de empresa_id ou ict_id no modelo de Responsavel
    const responsavel = await Responsavel.findOne({
      where: { usuario_id: usuario.id },
    });

    if (!responsavel) {
      return res.status(403).json({ message: "Responsável não encontrado." });
    }

    const { empresa_id, ict_id } = responsavel;

    const empresa = await Empresa.findByPk(empresa_id);
    const ict = await Ict.findByPk(ict_id);
    
    // Gera o token JWT, incluindo empresa_id ou ict_id
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        tipo: usuario.tipo,
        empresa_id,
        empresa,
        ict_id,
        ict
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" } // Opcional: define um tempo de expiração para o token
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Retorna as informações no login
    res.status(200).json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        empresa_id,
        ict_id,
        empresa,
        ict,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ message: "Erro ao fazer login." });
  }
};

// Logout
const Logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  res.status(200).end();
};

// Verificar Token
const VerificarToken = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acesso negado, token não fornecido." });
  }

  try {
    // Decodifica o token e verifica se é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const empresa = await Empresa.findByPk(decoded.empresa_id);
    const ict = await Ict.findByPk(decoded.ict_id);

    // Retorna as informações do usuário e o status do token
    res.status(200).json({
      message: "Token válido.",
      usuario: { ...decoded, empresa, ict },
    });
  } catch (err) {
    res.status(401).json({ message: "Token inválido ou expirado." });
  }
};

const GetUser = async (req, res) => {
  res.status(200).json({ usuario: req.user });
};

module.exports = {
  Login,
  Logout,
  VerificarToken,
  GetUser
};
