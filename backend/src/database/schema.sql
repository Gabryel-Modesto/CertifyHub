CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    name_user VARCHAR(150) NOT NULL,
    email_user VARCHAR(250) NOT NULL UNIQUE,
    password_user TEXT NOT NULL
);

CREATE TABLE certificates (
    id_certificate SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL,
    name_certificate VARCHAR(250) NOT NULL,
    institution_certificate VARCHAR(250) NOT NULL,
    category_certificate VARCHAR(250) NOT NULL,
    date_conclusion DATE NOT NULL,
    date_validity DATE,
    hours_certificate INTEGER NOT NULL,
    certification_code VARCHAR(250),
    validation_link VARCHAR(500),
    description TEXT,
    file_path VARCHAR(500),

    FOREIGN KEY (id_user) REFERENCES users(id_user)
);

CREATE TABLE login_attempts (
    email VARCHAR(250) PRIMARY KEY,
    attempts INTEGER NOT NULL DEFAULT 0,
    blocked_until TIMESTAMP
);

CREATE TABLE categories (
    id_category SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL,
    name_category VARCHAR(100) NOT NULL,

    CONSTRAINT fk_category_user
        FOREIGN KEY (id_user)
        REFERENCES users(id_user),

    CONSTRAINT unique_category_per_user
        UNIQUE (id_user, name_category)
);

ALTER TABLE users
ADD COLUMN login_attempts INTEGER DEFAULT 0,
ADD COLUMN blocked_until TIMESTAMP;

ALTER TABLE users
ADD COLUMN reset_token VARCHAR(255),
ADD COLUMN reset_token_expires TIMESTAMP;

SELECT * FROM users;

SELECT * FROM certificates;

SELECT * FROM login_attempts;

SELECT * FROM categories;

UPDATE users
SET email_user = LOWER(email_user);


SELECT id_certificate, name_certificate, file_path
FROM certificates
ORDER BY id_certificate DESC;

SELECT
    id_user,
    name_user,
    email_user,
    login_attempts,
    blocked_until
FROM users
ORDER BY id_user;

SELECT
    id_user,
    name_user,
    email_user,
    password_user
FROM users
ORDER BY id_user DESC
LIMIT 1;

SELECT id_user, name_user, email_user
FROM users;

BEGIN;

-- ==========================================
-- 1. CRIAR REFERÊNCIA DA CATEGORIA
-- ==========================================

ALTER TABLE certificates
ADD COLUMN id_category INTEGER;


-- ==========================================
-- 2. CRIAR CATEGORIAS A PARTIR DOS
--    CERTIFICADOS EXISTENTES
-- ==========================================

INSERT INTO categories (id_user, name_category)
SELECT DISTINCT
    id_user,
    TRIM(category_certificate)
FROM certificates
WHERE category_certificate IS NOT NULL
  AND TRIM(category_certificate) <> ''
ON CONFLICT (id_user, name_category)
DO NOTHING;


-- ==========================================
-- 3. PREENCHER id_category DOS CERTIFICADOS
-- ==========================================

UPDATE certificates c
SET id_category = cat.id_category
FROM categories cat
WHERE cat.id_user = c.id_user
  AND TRIM(cat.name_category) = TRIM(c.category_certificate);


-- ==========================================
-- 4. CRIAR FOREIGN KEY
-- ==========================================

ALTER TABLE certificates
ADD CONSTRAINT fk_certificate_category
FOREIGN KEY (id_category)
REFERENCES categories(id_category);


-- ==========================================
-- 5. GARANTIR QUE TODO CERTIFICADO
--    TENHA UMA CATEGORIA
-- ==========================================

ALTER TABLE certificates
ALTER COLUMN id_category SET NOT NULL;


-- ==========================================
-- 6. REMOVER CAMPO ANTIGO
-- ==========================================

ALTER TABLE certificates
DROP COLUMN category_certificate;


COMMIT;


SELECT
    c.id_certificate,
    c.name_certificate,
    c.id_user,
    cat.id_category,
    cat.name_category
FROM certificates c
INNER JOIN categories cat
    ON cat.id_category = c.id_category
ORDER BY c.id_certificate;