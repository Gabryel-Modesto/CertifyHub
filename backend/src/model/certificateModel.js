import { connect } from "../config/database.js";

// Buscar todos os certificados
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

// Buscar certificados de um usuário
async function selectCertificatesByUser(id_user) {
  const client = await connect();

  try {
    const result = await client.query(
      `
      SELECT *
      FROM certificates
      WHERE id_user = $1
      ORDER BY id_certificate DESC
      `,
      [id_user],
    );

    return result.rows;
  } finally {
    client.release();
  }
}

// Buscar certificado por ID
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

// Inserir certificado
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
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10, $11
      )
      RETURNING *
      `,
      [
        id_user,
        name_certificate,
        institution_certificate,
        category_certificate,
        date_conclusion,
        date_validity || null,
        hours_certificate,
        certification_code || null,
        validation_link || null,
        description || null,
        file_path || null,
      ],
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}

// Atualizar certificado
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
        date_validity || null,
        hours_certificate,
        certification_code || null,
        validation_link || null,
        description || null,
        file_path || null,
        id,
      ],
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}

// Excluir certificado
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
  selectCertificatesByUser,
  selectCertificateById,
  insertCertificate,
  updateCertificate,
  deleteCertificate,
};
