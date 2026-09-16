import {
  selectUsers,
  selectedUserByid,
  insertUser,
  selectUserByEmail,
  incrementLoginAttempts,
  resetLoginAttempts,
  blockUser,
  saveResetToken,
  selectUserByResetToken,
  updatePassword,
  updateUser,
  getLoginAttemptByEmail,
  incrementLoginAttemptsByEmail,
  blockLoginAttemptsByEmail,
  resetLoginAttemptsByEmail,
} from "../model/userModel.js";

import bcrypt from "bcrypt";
import crypto from "crypto";
import transporter from "../config/mail.js";
import jwt from "jsonwebtoken";

// ==========================================
// VALIDAR E-MAIL
// ==========================================

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
};

// ==========================================
// CRIAR USUÁRIO
// ==========================================

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ==========================================
    // VALIDAÇÕES
    // ==========================================

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Nome, e-mail e senha são obrigatórios.",
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      return res.status(400).json({
        message: "Informe seu nome.",
      });
    }

    if (normalizedName.length < 3) {
      return res.status(400).json({
        message: "O nome deve possuir pelo menos 3 caracteres.",
      });
    }

    if (normalizedName.length > 150) {
      return res.status(400).json({
        message: "O nome deve possuir no máximo 150 caracteres.",
      });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        message: "Informe um e-mail válido.",
      });
    }

    if (normalizedEmail.length > 250) {
      return res.status(400).json({
        message: "O e-mail deve possuir no máximo 250 caracteres.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "A senha deve possuir pelo menos 6 caracteres.",
      });
    }

    // ==========================================
    // VERIFICAR E-MAIL DUPLICADO
    // ==========================================

    const existingUser = await selectUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        message: "Este e-mail já está sendo utilizado.",
      });
    }

    // ==========================================
    // CRIPTOGRAFAR SENHA
    // ==========================================

    const hashPassword = await bcrypt.hash(password, 10);

    // ==========================================
    // CRIAR USUÁRIO
    // ==========================================

    const user = await insertUser(
      normalizedName,
      normalizedEmail,
      hashPassword,
    );

    return res.status(201).json({
      message: "Usuário criado com sucesso!",
      user: {
        id: user.id_user,
        name: user.name_user,
        email: user.email_user,
      },
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);

    return res.status(500).json({
      message: "Erro ao criar usuário.",
    });
  }
};

// ==========================================
// BUSCAR TODOS OS USUÁRIOS
// ==========================================

const getUsers = async (req, res) => {
  try {
    const users = await selectUsers();

    const formattedUsers = users.map((user) => ({
      id: user.id_user,
      name: user.name_user,
      email: user.email_user,
    }));

    return res.status(200).json({
      users: formattedUsers,
    });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);

    return res.status(500).json({
      message: "Erro ao buscar usuários.",
    });
  }
};

// ==========================================
// BUSCAR USUÁRIO POR ID
// ==========================================

const getUserById = async (req, res) => {
  try {
    // ID vem do JWT
    const userId = req.user.id;

    const user = await selectedUserByid(userId);

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado.",
      });
    }

    return res.status(200).json({
      user: {
        id: user.id_user,
        name: user.name_user,
        email: user.email_user,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);

    return res.status(500).json({
      message: "Erro ao buscar usuário.",
    });
  }
};

// ==========================================
// LOGIN
// ==========================================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ==========================================
    // VALIDAÇÕES BÁSICAS
    // ==========================================

    if (!email || !password) {
      return res.status(400).json({
        message: "Informe o e-mail e a senha.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        message: "Informe um e-mail válido.",
      });
    }

    // ==========================================
    // BUSCAR USUÁRIO
    // ==========================================

    const user = await selectUserByEmail(normalizedEmail);

    // ==========================================
    // E-MAIL NÃO EXISTE
    // ==========================================

    if (!user) {
      const attempt = await getLoginAttemptByEmail(normalizedEmail);

      // Verificar bloqueio
      if (
        attempt?.blocked_until &&
        new Date(attempt.blocked_until) > new Date()
      ) {
        return res.status(403).json({
          message: "Muitas tentativas incorretas. Tente novamente mais tarde.",
          blockedUntil: attempt.blocked_until,
        });
      }

      // Incrementar tentativa
      const updatedAttempt =
        await incrementLoginAttemptsByEmail(normalizedEmail);

      // Bloquear após 5 tentativas
      if (updatedAttempt.attempts >= 5) {
        const blockedAttempt = await blockLoginAttemptsByEmail(normalizedEmail);

        return res.status(403).json({
          message:
            "Muitas tentativas incorretas. Sua tentativa foi bloqueada por 2 minutos.",
          blockedUntil: blockedAttempt.blocked_until,
        });
      }

      return res.status(401).json({
        message: "Usuário ou senha inválidos.",
      });
    }

    // ==========================================
    // CONTA BLOQUEADA
    // ==========================================

    if (user.blocked_until && new Date(user.blocked_until) > new Date()) {
      return res.status(403).json({
        message:
          "Sua conta está temporariamente bloqueada. Tente novamente mais tarde.",
        blockedUntil: user.blocked_until,
      });
    }

    // ==========================================
    // VERIFICAR SENHA
    // ==========================================

    const passwordMatch = await bcrypt.compare(password, user.password_user);

    // ==========================================
    // SENHA INCORRETA
    // ==========================================

    if (!passwordMatch) {
      const updatedUser = await incrementLoginAttempts(user.id_user);

      // Bloquear após 5 tentativas
      if (updatedUser.login_attempts >= 5) {
        const blockedUser = await blockUser(user.id_user);

        return res.status(403).json({
          message:
            "Sua conta foi bloqueada temporariamente após 5 tentativas incorretas. Aguarde 2 minutos.",
          blockedUntil: blockedUser.blocked_until,
        });
      }

      return res.status(401).json({
        message: "Usuário ou senha inválidos.",
      });
    }

    // ==========================================
    // LOGIN CORRETO
    // ==========================================

    await resetLoginAttempts(user.id_user);

    await resetLoginAttemptsByEmail(normalizedEmail);

    // ==========================================
    // GERAR JWT
    // ==========================================

    const token = jwt.sign(
      {
        id: user.id_user,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    return res.status(200).json({
      message: "Login realizado com sucesso!",

      token,

      user: {
        id: user.id_user,
        name: user.name_user,
        email: user.email_user,
      },
    });
  } catch (error) {
    console.error("Erro ao realizar login:", error);

    return res.status(500).json({
      message: "Erro ao realizar login.",
    });
  }
};

// ==========================================
// SOLICITAR RECUPERAÇÃO DE SENHA
// ==========================================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Informe seu e-mail.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        message: "Informe um e-mail válido.",
      });
    }

    const user = await selectUserByEmail(normalizedEmail);

    // Resposta genérica
    if (!user) {
      return res.status(200).json({
        message:
          "Se o e-mail estiver cadastrado, você receberá um link de recuperação.",
      });
    }

    // ==========================================
    // GERAR TOKEN
    // ==========================================

    const token = crypto.randomBytes(32).toString("hex");

    await saveResetToken(user.id_user, token);

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    // ==========================================
    // ENVIAR E-MAIL
    // ==========================================

    await transporter.sendMail({
      from: `"CertifyHub" <${process.env.EMAIL_USER}>`,
      to: user.email_user,
      subject: "Recuperação de senha - CertifyHub",

      html: `
        <h2>Recuperação de senha</h2>

        <p>Olá, ${user.name_user}!</p>

        <p>
          Recebemos uma solicitação para redefinir sua senha.
        </p>

        <p>
          <a href="${resetLink}">
            Clique aqui para redefinir sua senha
          </a>
        </p>

        <p>
          Este link expira em 5 minutos.
        </p>

        <p>
          Caso você não tenha solicitado essa alteração,
          ignore este e-mail.
        </p>
      `,
    });

    return res.status(200).json({
      message:
        "Se o e-mail estiver cadastrado, você receberá um link de recuperação.",
    });
  } catch (error) {
    console.error("Erro ao recuperar senha:", error);

    return res.status(500).json({
      message: "Erro ao solicitar recuperação de senha.",
    });
  }
};

// ==========================================
// REDEFINIR SENHA
// ==========================================

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Token de recuperação não informado.",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Informe a nova senha.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "A senha deve possuir pelo menos 6 caracteres.",
      });
    }

    const user = await selectUserByResetToken(token);

    if (!user) {
      return res.status(400).json({
        message: "Token inválido ou expirado.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await updatePassword(user.id_user, hashPassword);

    return res.status(200).json({
      message: "Senha alterada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);

    return res.status(500).json({
      message: "Erro ao redefinir senha.",
    });
  }
};

// ==========================================
// ATUALIZAR USUÁRIO
// ==========================================

const updateUserController = async (req, res) => {
  try {
    // ID vem do JWT
    const userId = req.user.id;

    const { name, email } = req.body;

    // ==========================================
    // VALIDAÇÕES
    // ==========================================

    if (!name || !email) {
      return res.status(400).json({
        message: "Nome e e-mail são obrigatórios.",
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      return res.status(400).json({
        message: "Informe seu nome.",
      });
    }

    if (normalizedName.length < 3) {
      return res.status(400).json({
        message: "O nome deve possuir pelo menos 3 caracteres.",
      });
    }

    if (normalizedName.length > 150) {
      return res.status(400).json({
        message: "O nome deve possuir no máximo 150 caracteres.",
      });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        message: "Informe um e-mail válido.",
      });
    }

    if (normalizedEmail.length > 250) {
      return res.status(400).json({
        message: "O e-mail deve possuir no máximo 250 caracteres.",
      });
    }

    // ==========================================
    // VERIFICAR USUÁRIO
    // ==========================================

    const existingUser = await selectedUserByid(userId);

    if (!existingUser) {
      return res.status(404).json({
        message: "Usuário não encontrado.",
      });
    }

    // ==========================================
    // VERIFICAR E-MAIL
    // ==========================================

    const emailUser = await selectUserByEmail(normalizedEmail);

    if (emailUser && emailUser.id_user !== Number(userId)) {
      return res.status(409).json({
        message: "Este e-mail já está sendo utilizado.",
      });
    }

    // ==========================================
    // ATUALIZAR
    // ==========================================

    const user = await updateUser(userId, normalizedName, normalizedEmail);

    return res.status(200).json({
      message: "Usuário atualizado com sucesso!",

      user: {
        id: user.id_user,
        name: user.name_user,
        email: user.email_user,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);

    return res.status(500).json({
      message: "Erro ao atualizar usuário.",
    });
  }
};

// ==========================================
// ALTERAR SENHA
// ==========================================

const changePasswordController = async (req, res) => {
  try {
    // ID vem do JWT
    const userId = req.user.id;

    const { currentPassword, newPassword } = req.body;

    // ==========================================
    // VALIDAÇÕES
    // ==========================================

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Informe a senha atual e a nova senha.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "A nova senha deve possuir pelo menos 6 caracteres.",
      });
    }

    // ==========================================
    // BUSCAR USUÁRIO
    // ==========================================

    const user = await selectedUserByid(userId);

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado.",
      });
    }

    // ==========================================
    // VERIFICAR SENHA ATUAL
    // ==========================================

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password_user,
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "A senha atual está incorreta.",
      });
    }

    // ==========================================
    // VERIFICAR SE A NOVA É IGUAL
    // ==========================================

    const samePassword = await bcrypt.compare(newPassword, user.password_user);

    if (samePassword) {
      return res.status(400).json({
        message: "A nova senha deve ser diferente da senha atual.",
      });
    }

    // ==========================================
    // ATUALIZAR SENHA
    // ==========================================

    const hashPassword = await bcrypt.hash(newPassword, 10);

    await updatePassword(user.id_user, hashPassword);

    return res.status(200).json({
      message: "Senha alterada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);

    return res.status(500).json({
      message: "Erro ao alterar senha.",
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

export default {
  createUser,
  getUsers,
  getUserById,
  loginUser,
  forgotPassword,
  resetPassword,
  updateUserController,
  changePasswordController,
};
