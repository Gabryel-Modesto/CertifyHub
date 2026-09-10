import dotenv from "dotenv";
dotenv.config();

process.env.DB_HOST
process.env.DB_PORT
process.env.DB_USER
process.env.DB_PASSWORD
process.env.DB_NAME

async function connect(){
    if(global.connection){
        return global.connection.connect();
    }

    const {Pool} = await import('pg');
    const pool = new Pool({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    const client = await pool.connect();
    console.log("Criou o pool de conexões com o banco de dados");

    const res = await client.query('SELECT NOW()');
    console.log(res.rows[0]);
    client.release();

    global.connection = pool;
    return  pool.connect();

};

connect();

export { connect };




