import { connect } from "../config/database.js";

async function selectCertificates() {
  const client = await connect();

  try {
    const result = await client.query(`
      SELECT
        c.*,
        cat.name_category
      FROM certificates c
      INNER JOIN categories cat
        ON c.id_category = cat.id_category
      ORDER BY c.id_certificate DESC
    `);

    return result.rows;
  } finally {
    client.release();
  }
}

async function selectCertificatesByUser(id_user) {
  const client = await connect();

  try {
    const result = await client.query(
      `
      SELECT
        c.*,
        cat.name_category
      FROM certificates c
      INNER JOIN categories cat
        ON c.id_category = cat.id_category
      WHERE c.id_user = $1
      ORDER BY c.id_certificate DESC
      `,
      [id_user],
    );

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
      SELECT
        c.*,
        cat.name_category
      FROM certificates c
      INNER JOIN categories cat
        ON c.id_category = cat.id_category
      WHERE c.id_certificate = $1
      `,
      [id],
    );

    return result.rows[0];
  } finally {
    client.release();
  }
}

async function selectCertificateByIdAndUser(id_certificate, id_user) {
  const client = await connect();

  try {
    const result = await client.query(
      `
      SELECT
        c.*,
        cat.name_category
      FROM certificates c
      INNER JOIN categories cat
        ON c.id_category = cat.id_category
      WHERE c.id_certificate = $1
        AND c.id_user = $2
      `,
      [id_certificate, id_user],
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
      id_category,
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
        id_category,
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
        id_category,
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

async function updateCertificate(id, certificate) {
  const client = await connect();

  try {
    const {
      name_certificate,
      institution_certificate,
      id_category,
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
        id_category = $3,
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
        id_category,
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

async function updateCertificateByUser(id_certificate, id_user, certificate) {
  const client = await connect();

  try {
    const {
      name_certificate,
      institution_certificate,
      id_category,
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
        id_category = $3,
        date_conclusion = $4,
        date_validity = $5,
        hours_certificate = $6,
        certification_code = $7,
        validation_link = $8,
        description = $9,
        file_path = $10
      WHERE id_certificate = $11
        AND id_user = $12
      RETURNING *
      `,
      [
        name_certificate,
        institution_certificate,
        id_category,
        date_conclusion,
        date_validity || null,
        hours_certificate,
        certification_code || null,
        validation_link || null,
        description || null,
        file_path || null,
        id_certificate,
        id_user,
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

async function deleteCertificateByUser(id_certificate, id_user) {
  const client = await connect();

  try {
    const result = await client.query(
      `
      DELETE FROM certificates
      WHERE id_certificate = $1
        AND id_user = $2
      RETURNING *
      `,
      [id_certificate, id_user],
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
  selectCertificateByIdAndUser,
  insertCertificate,
  updateCertificate,
  updateCertificateByUser,
  deleteCertificate,
  deleteCertificateByUser,
};
