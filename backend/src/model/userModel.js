import { connect } from "../config/database.js";

async function selectUsers() {
  const client = await connect();

  try {
    const res = await client.query("SELECT * FROM users");

    return res.rows;
  } finally {
    client.release();
  }
};

async function selectedUserByid(id) {
  const client = await connect();

  try {
    const res = await client.query("SELECT * FROM users WHERE id_user = $1", [
      id,
    ]);

    return res.rows[0];
  } finally {
    client.release();
  }
};

async function insertUser(name, email, password) {
  const client = await connect();

  try {
    const res = await client.query(
      `
      INSERT INTO users(
        name_user,
        email_user,
        password_user
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [name, email, password],
    );

    return res.rows[0];
  } finally {
    client.release();
  }
};

async function selectUserByEmail(email) {
  const client = await connect();

  try {
    const res = await client.query(
      "SELECT * FROM users WHERE email_user = $1",
      [email],
    );

    return res.rows[0];
  } finally {
    client.release();
  }
};

async function incrementLoginAttempts(id) {
  const client = await connect();

  try {
    const res = await client.query(
      `
      UPDATE users
      SET login_attempts = login_attempts + 1
      WHERE id_user = $1
      RETURNING *
      `,
      [id],
    );

    return res.rows[0];
  } finally {
    client.release();
  }
};

async function resetLoginAttempts(id) {
  const client = await connect();

  try {
    const res = await client.query(
      `
      UPDATE users
      SET
        login_attempts = 0,
        blocked_until = NULL
      WHERE id_user = $1
      RETURNING *
      `,
      [id],
    );

    return res.rows[0];
  } finally {
    client.release();
  }
};

async function blockUser(id) {
  const client = await connect();

  try {
    const res = await client.query(
      `
      UPDATE users
      SET
        blocked_until = NOW() + INTERVAL '2 minutes',
        login_attempts = 0
      WHERE id_user = $1
      RETURNING *
      `,
      [id],
    );

    return res.rows[0];
  } finally {
    client.release();
  }
};

async function saveResetToken(id, token) {
  const client = await connect();

  try {
    const res = await client.query(
      `
      UPDATE users
      SET
        reset_token = $1,
        reset_token_expires = NOW() + INTERVAL '5 minutes'
      WHERE id_user = $2
      RETURNING *
      `,
      [token, id],
    );

    return res.rows[0];
  } finally {
    client.release();
  }
};

async function selectUserByResetToken(token) {
  const client = await connect();

  try {
    const res = await client.query(
      `
      SELECT *
      FROM users
      WHERE reset_token = $1
      AND reset_token_expires > NOW()
      `,
      [token],
    );

    return res.rows[0];
  } finally {
    client.release();
  }
};

async function updatePassword(id, password) {
  const client = await connect();

  try {
    const res = await client.query(
      `
      UPDATE users
      SET
        password_user = $1,
        reset_token = NULL,
        reset_token_expires = NULL
      WHERE id_user = $2
      RETURNING *
      `,
      [password, id],
    );

    return res.rows[0];
  } finally {
    client.release();
  }
};

async function updateUser(id, name, email) {
  const client = await connect();

  try {
    const res = await client.query(
      `
      UPDATE users
      SET
        name_user = $1,
        email_user = $2
      WHERE id_user = $3
      RETURNING *
      `,
      [name, email, id],
    );

    return res.rows[0];
  } finally {
    client.release();
  }
};

async function getLoginAttemptByEmail(email) {
  const client = await connect();

  try {
    const res = await client.query(
      `
      SELECT *
      FROM login_attempts
      WHERE email = $1
      `,
      [email]
    );

    return res.rows[0];
  } finally {
    client.release();
  }
}

async function incrementLoginAttemptsByEmail(email) {
  const client = await connect();

  try {
    const res = await client.query(
      `
      INSERT INTO login_attempts (email, attempts)
      VALUES ($1, 1)

      ON CONFLICT (email)
      DO UPDATE SET
        attempts = login_attempts.attempts + 1

      RETURNING *
      `,
      [email]
    );

    return res.rows[0];
  } finally {
    client.release();
  }
}

async function blockLoginAttemptsByEmail(email) {
  const client = await connect();

  try {
    const res = await client.query(
      `
      UPDATE login_attempts
      SET blocked_until = NOW() + INTERVAL '2 minutes'
      WHERE email = $1
      RETURNING *
      `,
      [email]
    );

    return res.rows[0];
  } finally {
    client.release();
  }
}

async function resetLoginAttemptsByEmail(email) {
  const client = await connect();

  try {
    const res = await client.query(
      `
      DELETE FROM login_attempts
      WHERE email = $1
      `,
      [email]
    );

    return res.rowCount;
  } finally {
    client.release();
  }
}

export {
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
  resetLoginAttemptsByEmail
};
