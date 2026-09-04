CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    name_user VARCHAR(150) NOT NULL,
    email_user VARCHAR(250) NOT NULL UNIQUE,
    cpf_user VARCHAR(15) NOT NULL UNIQUE,
    phone_user VARCHAR(20) NOT NULL UNIQUE,
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


