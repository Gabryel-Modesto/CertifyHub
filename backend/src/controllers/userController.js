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

// Criar usuário
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await insertUser(name, normalizedEmail, hashPassword);

    res.status(201).json({
      message: "Usuário criado com sucesso!",
      user: {
        id: user.id_user,
        name: user.name_user,
        email: user.email_user,
      },
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);

    res.status(500).json({
      message: "Erro ao criar usuário",
    });
  }
};

// Buscar todos os usuários
const getUsers = async (req, res) => {
  try {
    const users = await selectUsers();

    const formattedUsers = users.map((user) => ({
      id: user.id_user,
      name: user.name_user,
      email: user.email_user,
    }));

    res.status(200).json({
      users: formattedUsers,
    });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);

    res.status(500).json({
      message: "Erro ao buscar usuários",
    });
  }
};

// Buscar usuário por ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await selectedUserByid(userId);

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado!",
      });
    }

    res.status(200).json({
      user: {
        id: user.id_user,
        name: user.name_user,
        email: user.email_user,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);

    res.status(500).json({
      message: "Erro ao buscar usuário",
    });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const user = await selectUserByEmail(normalizedEmail);

    // =====================================================
    // E-MAIL NÃO EXISTE
    // =====================================================

    if (!user) {
      const attempt = await getLoginAttemptByEmail(normalizedEmail);

      // Verifica se o e-mail está bloqueado
      if (
        attempt?.blocked_until &&
        new Date(attempt.blocked_until) > new Date()
      ) {
        return res.status(403).json({
          message: "Muitas tentativas incorretas. Tente novamente mais tarde.",
        });
      }

      // Incrementa tentativa
      const updatedAttempt =
        await incrementLoginAttemptsByEmail(normalizedEmail);

      // Bloqueia após 5 tentativas
      if (updatedAttempt.attempts >= 5) {
        await blockLoginAttemptsByEmail(normalizedEmail);

        return res.status(403).json({
          message: "Muitas tentativas incorretas. Tente novamente mais tarde.",
        });
      }

      return res.status(401).json({
        message: "Usuário ou senha inválidos",
      });
    }

    // =====================================================
    // CONTA BLOQUEADA
    // =====================================================

    if (user.blocked_until && new Date(user.blocked_until) > new Date()) {
      return res.status(403).json({
        message:
          "Sua conta está temporariamente bloqueada. Tente novamente mais tarde.",
      });
    }

    // =====================================================
    // VERIFICA SENHA
    // =====================================================

    const passwordMatch = await bcrypt.compare(password, user.password_user);

    // =====================================================
    // SENHA INCORRETA
    // =====================================================

    if (!passwordMatch) {
      const updatedUser = await incrementLoginAttempts(user.id_user);

      // Bloqueia após 5 tentativas
      if (updatedUser.login_attempts >= 5) {
        await blockUser(user.id_user);

        return res.status(403).json({
          message:
            "Sua conta foi bloqueada temporariamente após 5 tentativas incorretas.",
        });
      }

      return res.status(401).json({
        message: "Usuário ou senha inválidos",
      });
    }

    // =====================================================
    // LOGIN CORRETO
    // =====================================================

    await resetLoginAttempts(user.id_user);

    await resetLoginAttemptsByEmail(normalizedEmail);

    // =====================================================
    // GERA JWT
    // =====================================================

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
      message: "Erro ao realizar login",
    });
  }
};

// Solicitar recuperação de senha
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const normalizedEmail = email.trim().toLowerCase();

    const user = await selectUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(200).json({
        message:
          "Se o e-mail estiver cadastrado, você receberá um link de recuperação.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await saveResetToken(user.id_user, token);

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

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

// Redefinir senha
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await selectUserByResetToken(token);

    if (!user) {
      return res.status(400).json({
        message: "Token inválido ou expirado",
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
      message: "Erro ao redefinir senha",
    });
  }
};

// Atualizar usuário
const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Nome e e-mail são obrigatórios.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await selectedUserByid(id);

    if (!existingUser) {
      return res.status(404).json({
        message: "Usuário não encontrado.",
      });
    }

    const emailUser = await selectUserByEmail(normalizedEmail);

    if (emailUser && emailUser.id_user !== Number(id)) {
      return res.status(409).json({
        message: "Este e-mail já está sendo utilizado.",
      });
    }

    const user = await updateUser(id, name, normalizedEmail);

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

// Alterar senha
const changePasswordController = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

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

    const user = await selectedUserByid(id);

    if (!user) {
      return res.status(404).json({
        message: "Usuário não encontrado.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      user.password_user,
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "A senha atual está incorreta.",
      });
    }

    const samePassword = await bcrypt.compare(newPassword, user.password_user);

    if (samePassword) {
      return res.status(400).json({
        message: "A nova senha deve ser diferente da senha atual.",
      });
    }

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
