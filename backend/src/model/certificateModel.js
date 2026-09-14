import { connect } from "../config/database.js";

async function selectCertificates() {
  const client = await connect();

  try {
    const result = await client.query(`
      SELECT *
      FROM certificates
      ORDER BY id_certificate DESC
    `);

    return result.rows;
  } finally {
    client.release();
  }
}

async function selectCertificateById(id) {
  const client = await connect();

  try {
    const result = await client.query(
      `
      SELECT *
      FROM certificates
      WHERE id_certificate = $1
      `,
      [id],
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}

async function insertCertificate(certificate) {
  const client = await connect();

  try {
    const {
      id_user,
      name_certificate,
      institution_certificate,
      category_certificate,
      date_conclusion,
      date_validity,
      hours_certificate,
      certification_code,
      validation_link,
      description,
      file_path,
    } = certificate;

    const result = await client.query(
      `
      INSERT INTO certificates (
        id_user,
        name_certificate,
        institution_certificate,
        category_certificate,
        date_conclusion,
        date_validity,
        hours_certificate,
        certification_code,
        validation_link,
        description,
        file_path
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
      `,
      [
        id_user,
        name_certificate,
        institution_certificate,
        category_certificate,
        date_conclusion,
        date_validity,
        hours_certificate,
        certification_code,
        validation_link,
        description,
        file_path,
      ],
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}

async function updateCertificate(id, certificate) {
  const client = await connect();

  try {
    const {
      name_certificate,
      institution_certificate,
      category_certificate,
      date_conclusion,
      date_validity,
      hours_certificate,
      certification_code,
      validation_link,
      description,
      file_path,
    } = certificate;

    const result = await client.query(
      `
      UPDATE certificates
      SET
        name_certificate = $1,
        institution_certificate = $2,
        category_certificate = $3,
        date_conclusion = $4,
        date_validity = $5,
        hours_certificate = $6,
        certification_code = $7,
        validation_link = $8,
        description = $9,
        file_path = $10
      WHERE id_certificate = $11
      RETURNING *
      `,
      [
        name_certificate,
        institution_certificate,
        category_certificate,
        date_conclusion,
        date_validity,
        hours_certificate,
        certification_code,
        validation_link,
        description,
        file_path,
        id,
      ],
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}

async function deleteCertificate(id) {
  const client = await connect();

  try {
    const result = await client.query(
      `
      DELETE FROM certificates
      WHERE id_certificate = $1
      RETURNING *
      `,
      [id],
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}

export {
  selectCertificates,
  selectCertificateById,
  insertCertificate,
  updateCertificate,
  deleteCertificate,
};
