import styles from "./CertificateFilters.module.css";

function CertificateFilters({
  search,
  setSearch,
  category,
  setCategory,
  sort,
  setSort,
}) {
  return (
    <section className={styles.filters}>
      {/* BUSCA */}
      <input
        type="text"
        placeholder="🔍 Buscar certificado..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {/* CATEGORIA */}
      <select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value="Todas">Todas as categorias</option>
        <option value="Tecnologia">Tecnologia</option>
        <option value="Banco de Dados">Banco de Dados</option>
        <option value="Gestão">Gestão</option>
        <option value="Idiomas">Idiomas</option>
      </select>

      {/* ORDENAÇÃO */}
      <select value={sort} onChange={(event) => setSort(event.target.value)}>
        <option value="recentes">Mais recentes</option>
        <option value="antigos">Mais antigos</option>
        <option value="az">Nome A-Z</option>
        <option value="za">Nome Z-A</option>
      </select>
    </section>
  );
}

export default CertificateFilters;
