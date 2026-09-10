import { connect } from "../config/database.js";

async function selectUsers() {
    const client = await connect();
    const res = await client.query("SELECT * FROM users");
    return res.rows;
}

async function selectedUserByid(id) {
    const client = await connect();
    const res = await client.query("SELECT * FROM users WHERE id = $1", [id]);
    return res.rows[0];
}

export  {
    selectUsers,
    selectedUserByid
}

