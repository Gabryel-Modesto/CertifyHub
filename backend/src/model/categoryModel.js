import { connect } from "../config/database.js";

async function selectCategoriesByUser(id_user) {
  const client = await connect();

  try {
    const result = await client.query(
      `
      SELECT
        id_category,
        id_user,
        name_category
      FROM categories
      WHERE id_user = $1
      ORDER BY name_category ASC
      `,
      [id_user],
    );

    return result.rows;
  } finally {
    client.release();
  }
}

async function selectCategoryByIdAndUser(id_category, id_user) {
  const client = await connect();

  try {
    const result = await client.query(
      `
      SELECT
        id_category,
        id_user,
        name_category
      FROM categories
      WHERE id_category = $1
        AND id_user = $2
      `,
      [id_category, id_user],
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}


async function selectCategoryByName(id_user, name_category) {
  const client = await connect();

  try {
    const result = await client.query(
      `
      SELECT
        id_category,
        id_user,
        name_category
      FROM categories
      WHERE id_user = $1
        AND LOWER(name_category) = LOWER($2)
      `,
      [id_user, name_category],
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}


async function insertCategory(id_user, name_category) {
  const client = await connect();

  try {
    const result = await client.query(
      `
      INSERT INTO categories (
        id_user,
        name_category
      )
      VALUES ($1, $2)
      RETURNING
        id_category,
        id_user,
        name_category
      `,
      [id_user, name_category],
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}


async function updateCategoryByUser(id_category, id_user, name_category) {
  const client = await connect();

  try {
    const result = await client.query(
      `
      UPDATE categories
      SET name_category = $1
      WHERE id_category = $2
        AND id_user = $3
      RETURNING
        id_category,
        id_user,
        name_category
      `,
      [name_category, id_category, id_user],
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}


async function deleteCategoryByUser(id_category, id_user) {
  const client = await connect();

  try {
    const result = await client.query(
      `
      DELETE FROM categories
      WHERE id_category = $1
        AND id_user = $2
      RETURNING
        id_category,
        id_user,
        name_category
      `,
      [id_category, id_user],
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}

export {
  selectCategoriesByUser,
  selectCategoryByIdAndUser,
  selectCategoryByName,
  insertCategory,
  updateCategoryByUser,
  deleteCategoryByUser,
};
