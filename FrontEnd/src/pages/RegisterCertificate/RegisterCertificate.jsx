import styles from "./RegisterCertificate.module.css";

import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Alert from "../../components/Alert/Alert.jsx";
import Loading from "../../components/Loading/Loading.jsx";

import { useState } from "react";

import { useNavigate } from "react-router-dom";

import api from "../../services/api.js";

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
  });

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState(null);

  // =========================================
  // ALTERAR CAMPOS
  // =========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // =========================================
  // SELECIONAR ARQUIVO
  // =========================================

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Tipos permitidos
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];

    if (!allowedTypes.includes(selectedFile.type)) {
      setAlert({
        message: "Arquivo inválido. Selecione um PDF, PNG, JPG ou JPEG.",
        type: "warning",
      });

      event.target.value = "";
      setFile(null);

      return;
    }

    // Limite de 5 MB
    const maxSize = 5 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      setAlert({
        message: "O arquivo deve possuir no máximo 5 MB.",
        type: "warning",
      });

      event.target.value = "";
      setFile(null);

      return;
    }

    setAlert(null);
    setFile(selectedFile);
  };

  // =========================================
  // CADASTRAR CERTIFICADO
  // =========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setAlert(null);

    // =========================================
    // VERIFICAR SESSÃO
    // =========================================

    const token = localStorage.getItem("token");

    if (!token) {
      setAlert({
        message: "Sua sessão não foi encontrada. Faça login novamente.",
        type: "error",
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);

      return;
    }

    // =========================================
    // NORMALIZAÇÃO
    // =========================================

    const name = formData.name_certificate.trim();

    const institution = formData.institution_certificate.trim();

    const category = formData.category_certificate.trim();

    const certificationCode = formData.certification_code.trim();

    const validationLink = formData.validation_link.trim();

    const description = formData.description.trim();

    // =========================================
    // VALIDAÇÕES
    // =========================================

    // Nome
    if (!name) {
      setAlert({
        message: "Informe o nome do certificado.",
        type: "warning",
      });

      return;
    }

    if (name.length > 250) {
      setAlert({
        message: "O nome do certificado deve possuir no máximo 250 caracteres.",
        type: "warning",
      });

      return;
    }

    // Instituição
    if (!institution) {
      setAlert({
        message: "Informe a instituição.",
        type: "warning",
      });

      return;
    }

    if (institution.length > 250) {
      setAlert({
        message: "A instituição deve possuir no máximo 250 caracteres.",
        type: "warning",
      });

      return;
    }

    // Categoria
    if (!category) {
      setAlert({
        message: "Selecione uma categoria.",
        type: "warning",
      });

      return;
    }

    // Data de emissão
    if (!formData.date_conclusion) {
      setAlert({
        message: "Informe a data de emissão.",
        type: "warning",
      });

      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const conclusionDate = new Date(`${formData.date_conclusion}T00:00:00`);

    if (conclusionDate > today) {
      setAlert({
        message: "A data de emissão não pode ser futura.",
        type: "warning",
      });

      return;
    }

    // Data de validade
    if (formData.date_validity) {
      const validityDate = new Date(`${formData.date_validity}T00:00:00`);

      if (validityDate < conclusionDate) {
        setAlert({
          message:
            "A data de validade não pode ser anterior à data de emissão.",
          type: "warning",
        });

        return;
      }
    }

    // Carga horária
    if (!formData.hours_certificate) {
      setAlert({
        message: "Informe a carga horária.",
        type: "warning",
      });

      return;
    }

    const hours = Number(formData.hours_certificate);

    if (!Number.isInteger(hours) || hours <= 0) {
      setAlert({
        message: "A carga horária deve ser um número inteiro maior que zero.",
        type: "warning",
      });

      return;
    }

    // Código
    if (certificationCode.length > 250) {
      setAlert({
        message:
          "O código de certificação deve possuir no máximo 250 caracteres.",
        type: "warning",
      });

      return;
    }

    // Link
    if (validationLink) {
      try {
        new URL(validationLink);
      } catch {
        setAlert({
          message: "Informe um link de validação válido.",
          type: "warning",
        });

        return;
      }
    }

    // =========================================
    // ENVIO
    // =========================================

    setLoading(true);

    try {
      const data = new FormData();

      data.append("name_certificate", name);

      data.append("institution_certificate", institution);

      data.append("category_certificate", category);

      data.append("date_conclusion", formData.date_conclusion);

      if (formData.date_validity) {
        data.append("date_validity", formData.date_validity);
      }

      data.append("hours_certificate", hours);

      if (certificationCode) {
        data.append("certification_code", certificationCode);
      }

      if (validationLink) {
        data.append("validation_link", validationLink);
      }

      if (description) {
        data.append("description", description);
      }

      if (file) {
        data.append("file", file);
      }

      await api.post("/certificates", data, {
        timeout: 10000,
      });

      // =========================================
      // SUCESSO
      // =========================================

      setAlert({
        message: "Certificado cadastrado com sucesso!",
        type: "success",
      });

      // Limpar formulário
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
      });

      setFile(null);

      // Redirecionar
      setTimeout(() => {
        navigate("/certificates");
      }, 1500);
    } catch (error) {
      console.error(
        "Erro ao cadastrar certificado:",
        error.response?.data || error.message,
      );

      // Sessão expirada
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setAlert({
          message: "Sua sessão expirou. Faça login novamente.",
          type: "error",
        });

        setTimeout(() => {
          navigate("/");
        }, 1500);

        return;
      }

      // Timeout
      if (error.code === "ECONNABORTED") {
        setAlert({
          message: "O servidor demorou para responder. Verifique o backend.",
          type: "error",
        });

        return;
      }

      // Outros erros
      setAlert({
        message:
          error.response?.data?.message || "Erro ao cadastrar certificado.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* LOADING */}
      {loading && <Loading message="Cadastrando certificado..." />}

      {/* ALERT */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

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
                maxLength={250}
                required
                disabled={loading}
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
                maxLength={250}
                required
                disabled={loading}
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
                  disabled={loading}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Data de validade</label>

                <input
                  type="date"
                  name="date_validity"
                  value={formData.date_validity}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* CARGA HORÁRIA + CATEGORIA */}
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
                  step="1"
                  required
                  disabled={loading}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Categoria</label>

                <select
                  name="category_certificate"
                  value={formData.category_certificate}
                  onChange={handleChange}
                  required
                  disabled={loading}
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
                maxLength={250}
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              />
            </div>

            {/* ARQUIVO */}
            <div className={styles.inputGroup}>
              <label>Arquivo do certificado</label>

              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                disabled={loading}
              />
            </div>

            {/* ARQUIVO SELECIONADO */}
            {file && <p>Arquivo selecionado: {file.name}</p>}

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
