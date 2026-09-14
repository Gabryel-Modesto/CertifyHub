import { connect } from "../config/database.js";

async function selectUsers() {
    const client = await connect();
    const res = await client.query("SELECT * FROM users");
    return res.rows;
};

async function selectedUserByid(id) {
    const client = await connect();
    const res = await client.query("SELECT * FROM users WHERE id_user = $1", [id]);
    return res.rows[0];
};

async function insertUser(name, email, password) {
    const client = await connect();
    const res = await client.query("INSERT INTO users(name_user, email_user, password_user) VALUES ($1, $2, $3) RETURNING *", [name, email, password]);
    return res.rows[0];
};

async function selectUserByEmail(email) {
    const client = await connect();
    const res = await client.query("SELECT * FROM users WHERE email_user = $1", [email]);
    return res.rows[0];
};

async function incrementLoginAttempts(id) {
    const client = await connect();
    const res = await client.query("UPDATE users SET login_attempts = login_attempts + 1 WHERE id_user = $1 RETURNING *", [id]);
    return res.rows[0]
};

async function resetLoginAttempts(id) {
    const client = await connect();
    const res = await client.query("UPDATE users SET login_attempts = 0, blocked_until = NULL WHERE id_user = $1 RETURNING *", [id]);
    return res.rows[0]
};

async function blockUser(id) {
    const client = await connect();
    const res = await client.query("UPDATE users SET blocked_until = NOW() + INTERVAL '15 minutes', login_attempts = 0 WHERE id_user = $1 RETURNING *", [id]);
    return res.rows[0]    
};

async function saveResetToken(id, token) {
    const client = await connect();

    const res = await client.query("UPDATE users SET reset_token = $1, reset_token_expires = NOW() + INTERVAL '120 seconds' WHERE id_user = $2 RETURNING *", [token, id]);
    return res.rows[0]
}

async function selectUserByResetToken(token) {

    const client = await connect();
    const res = await client.query("SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()",[token]);
    return res.rows[0];

}

async function updatePassword(id, password){
    const client = await connect();

    const res = await client.query("UPDATE users SET password_user = $1, reset_token = NULL, reset_token_expires = NULL WHERE id_user = $2 RETURNING *", [password, id]);
    return res.rows[0]
};

export  {
    selectUsers,
    selectedUserByid,
    insertUser,
    selectUserByEmail,
    incrementLoginAttempts,
    resetLoginAttempts,
    blockUser,
    saveResetToken,
    selectUserByResetToken,
    updatePassword
}

