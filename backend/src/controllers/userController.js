import { selectUsers } from "../model/userModel.js";

const createUser = (req, res) => {
  res.json({
    message: "Usuário criado!",
  });
};

const getUsers = (req, res) => {
  selectUsers().then((users) => {
    res.json({
      users,
    });
  });
};

const getUserById = (req, res) => {
  const userId = req.params.id;
  selectedUserByid(userId).then((user) => {
    if (user) {
      res.json({
        user,
      });
    } else {
      res.status(404).json({
        message: "Usuário não encontrado",
      });
    }
  });
};

export default {
  createUser,
  getUsers,
  getUserById,
};
