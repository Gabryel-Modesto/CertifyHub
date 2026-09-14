import {
  selectUsers,
  selectedUserByid,
  insertUser,
  selectUserByEmail,
  incrementLoginAttempts,
  resetLoginAttempts,
  blockUser,
} from "../model/userModel.js";
import bcrypt from "bcrypt";
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await insertUser(name, email, hashPassword);

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
    res.status(500).json({
      message: "Erro ao buscar usuários",
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await selectedUserByid(userId);
    if (user) {
      res.json({
        user: {
          id: user.id_user,
          name: user.name_user,
          email: user.email_user,
        },
      });
    } else {
      res.status(404).json({
        message: "Usuário não encontrado!",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar usuários",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca o usuário pelo email
    const user = await selectUserByEmail(email);

    // Verifica se o usuário existe
    if (!user) {
      return res.status(401).json({
        message: "Usuário ou senha inválidos",
      });
    }

    // Verifica se o usuário está bloqueado
    if (user.blocked_until && new Date(user.blocked_until) > new Date()) {
      return res.status(403).json({
        message:
          "Sua conta está temporariamente bloqueada. Tente novamente mais tarde.",
      });
    }

    // Compara a senha digitada com a senha criptografada
    const passwordMatch = await bcrypt.compare(password, user.password_user);

    // Se a senha estiver incorreta
    if (!passwordMatch) {
      // Incrementa as tentativas
      const updatedUser = await incrementLoginAttempts(user.id_user);

      // Se chegou a 5 tentativas
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

    // Senha correta → reseta tentativas
    await resetLoginAttempts(user.id_user);

    return res.status(200).json({
      message: "Login realizado com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao realizar login",
    });
  }
};

export default {
  createUser,
  getUsers,
  getUserById,
  loginUser,
};
