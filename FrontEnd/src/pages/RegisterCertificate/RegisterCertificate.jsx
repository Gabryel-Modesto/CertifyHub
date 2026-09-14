import styles from "./RegisterCertificate.module.css";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterCertificate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name_certificate: "",
    institution_certificate: "",
    date_conclusion: "",
    date_validity: "",
    hours_certificate: "",
    category_certificate: "",
    certification_code: "",
    validation_link: "",
    description: "",
    file_path: "",
  });

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Alterar campos
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Selecionar arquivo
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    setFile(selectedFile || null);
  };

  // Cadastrar certificado
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const certificate = {
        id_user: 1,

        name_certificate: formData.name_certificate,

        institution_certificate: formData.institution_certificate,

        category_certificate: formData.category_certificate,

        date_conclusion: formData.date_conclusion,

        date_validity: formData.date_validity || null,

        hours_certificate: Number(formData.hours_certificate),

        certification_code: formData.certification_code || null,

        validation_link: formData.validation_link || null,

        description: formData.description || null,

        file_path: formData.file_path || null,
      };

      const response = await axios.post(
        "http://localhost:3000/certificates",
        certificate,
      );

      console.log(response.data);

      setSuccess("Certificado cadastrado com sucesso!");

      setFormData({
        name_certificate: "",
        institution_certificate: "",
        date_conclusion: "",
        date_validity: "",
        hours_certificate: "",
        category_certificate: "",
        certification_code: "",
        validation_link: "",
        description: "",
        file_path: "",
      });

      setFile(null);

      setTimeout(() => {
        navigate("/certificates");
      }, 1000);
    } catch (error) {
      console.error(error);

      setError("Erro ao cadastrar certificado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />

      <main className={styles.content}>
        {/* HEADER */}

        <div className={styles.header}>
          <h1>Cadastrar certificado</h1>

          <p>Adicione um novo certificado à sua conta.</p>
        </div>

        {/* CARD */}

        <div className={styles.card}>
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* NOME */}

            <div className={styles.inputGroup}>
              <label>Nome do certificado</label>

              <input
                type="text"
                name="name_certificate"
                placeholder="Ex: Java Completo"
                value={formData.name_certificate}
                onChange={handleChange}
                required
              />
            </div>

            {/* INSTITUIÇÃO */}

            <div className={styles.inputGroup}>
              <label>Instituição</label>

              <input
                type="text"
                name="institution_certificate"
                placeholder="Ex: Rocketseat"
                value={formData.institution_certificate}
                onChange={handleChange}
                required
              />
            </div>

            {/* DATAS */}

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Data de emissão</label>

                <input
                  type="date"
                  name="date_conclusion"
                  value={formData.date_conclusion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Data de validade</label>

                <input
                  type="date"
                  name="date_validity"
                  value={formData.date_validity}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* CARGA + CATEGORIA */}

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Carga horária</label>

                <input
                  type="number"
                  name="hours_certificate"
                  placeholder="Ex: 40"
                  value={formData.hours_certificate}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Categoria</label>

                <select
                  name="category_certificate"
                  value={formData.category_certificate}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione uma categoria</option>

                  <option value="Tecnologia">Tecnologia</option>

                  <option value="Idiomas">Idiomas</option>

                  <option value="Gestão">Gestão</option>

                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>

            {/* CÓDIGO DE CERTIFICAÇÃO */}

            <div className={styles.inputGroup}>
              <label>Código de certificação</label>

              <input
                type="text"
                name="certification_code"
                placeholder="Ex: CERT-2026-001"
                value={formData.certification_code}
                onChange={handleChange}
              />
            </div>

            {/* LINK DE VALIDAÇÃO */}

            <div className={styles.inputGroup}>
              <label>Link de validação</label>

              <input
                type="url"
                name="validation_link"
                placeholder="https://exemplo.com/validar"
                value={formData.validation_link}
                onChange={handleChange}
              />
            </div>

            {/* DESCRIÇÃO */}

            <div className={styles.inputGroup}>
              <label>Descrição</label>

              <textarea
                name="description"
                placeholder="Descreva o certificado..."
                value={formData.description}
                onChange={handleChange}
                rows="5"
              />
            </div>

            {/* LINK DO ARQUIVO */}

            <div className={styles.inputGroup}>
              <label>Link do certificado</label>

              <input
                type="url"
                name="file_path"
                placeholder="https://exemplo.com/certificado.pdf"
                value={formData.file_path}
                onChange={handleChange}
              />
            </div>

            {/* ARQUIVO */}

            <div className={styles.inputGroup}>
              <label>Arquivo do certificado</label>

              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
              />
            </div>

            {/* ARQUIVO SELECIONADO */}

            {file && <p>Arquivo selecionado: {file.name}</p>}

            {/* ERRO */}

            {error && <p>{error}</p>}

            {/* SUCESSO */}

            {success && <p>{success}</p>}

            {/* BOTÃO */}

            <button type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar certificado"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegisterCertificate;
