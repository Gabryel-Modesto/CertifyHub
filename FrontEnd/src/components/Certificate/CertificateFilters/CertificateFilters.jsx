import styles from "./CertificateFilters.module.css";

function CertificateFilters({
  search,
  setSearch,
  category,
  setCategory,
  sort,
  setSort,
  categories = [],
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

        {categories.map((item) => (
          <option key={item.id_category} value={item.name_category}>
            {item.name_category}
          </option>
        ))}
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
