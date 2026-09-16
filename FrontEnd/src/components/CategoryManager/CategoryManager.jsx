import { useState } from "react";
import api from "../../services/api";
import styles from "./CategoryManager.module.css";

function CategoryManager({ onCategoryCreated }) {
  const [showForm, setShowForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateCategory = async () => {
    const name = categoryName.trim();

    if (!name) {
      setError("Digite o nome da categoria.");
      return;
    }

    if (name.length > 100) {
      setError("O nome da categoria deve possuir no máximo 100 caracteres.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/categories", {
        name_category: name,
      });

      console.log("Categoria cadastrada:", response.data);

      const newCategory = response.data.category || response.data;

      if (
        !newCategory ||
        !newCategory.id_category ||
        !newCategory.name_category
      ) {
        setError("A API não retornou os dados da categoria corretamente.");
        return;
      }

      // Atualiza a lista de categorias no componente pai
      if (onCategoryCreated) {
        onCategoryCreated(newCategory);
      }

      setCategoryName("");
      setShowForm(false);
    } catch (error) {
      console.error(
        "Erro ao cadastrar categoria:",
        error.response?.data || error.message,
      );

      setError(error.response?.data?.message || "Erro ao cadastrar categoria.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label htmlFor="id_category">Categoria do certificado</label>

        <button
          type="button"
          className={styles.newButton}
          onClick={() => {
            setShowForm((previous) => !previous);
            setError("");
          }}
          disabled={loading}
        >
          {showForm ? "Cancelar" : "+ Nova categoria"}
        </button>
      </div>

      {showForm && (
        <div className={styles.form}>
          <input
            type="text"
            value={categoryName}
            onChange={(event) => setCategoryName(event.target.value)}
            placeholder="Ex: Tecnologia"
            maxLength={100}
            disabled={loading}
          />

          <button
            type="button"
            onClick={handleCreateCategory}
            disabled={loading}
            className={styles.saveButton}
          >
            {loading ? "Salvando..." : "Salvar categoria"}
          </button>

          {error && <p className={styles.error}>{error}</p>}
        </div>
      )}
    </div>
  );
}

export default CategoryManager;
