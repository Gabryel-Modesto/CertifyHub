const createUser = (req, res) => {
    res.json({
        message: "Usuário criado!"
    });
};

const getUsers = (req, res) => {
    res.json({
        message: "Lista de usuários"
    });
};

export default {
    createUser,
    getUsers
};