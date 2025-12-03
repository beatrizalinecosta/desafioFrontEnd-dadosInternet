import React, { useMemo, useState } from "react";
import { Label } from '@heroui/react';

{/** BOTÃO DE EXPORTAR CSV */}
function downloadCSV(rows) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [
    keys.join(","),
    ...rows.map((r) => keys.map((k) => JSON.stringify(r[k] ?? "")).join(",")),
  ].join("");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "export.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function DataTable({ data }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [filters, setFilters] = useState({
    tecnologia: "All",
    dependencia: "All",
    localizacao: "All",
  });

  {/** FILTROS TABELA */}
  const filtered = useMemo(() => {
    return data.filter((r) => {
      if (filters.tecnologia !== "All" && r.Tipo_Tecnologia !== filters.tecnologia)
        return false;
      if (filters.dependencia !== "All" && r.Dependencia_Adm !== filters.dependencia)
        return false;
      if (filters.localizacao !== "All" && r.Localizacao !== filters.localizacao)
        return false;

      return Object.values(r)
        .some((v) =>
          v?.toString().toLowerCase().includes(search.toLowerCase())
        );
    });
  }, [data, search, filters]);

  {/* PAGINAÇÃO */}
  const pageCount = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className="bg-gray-100 dark:bg-[#212529] p-4 rounded shadow">
      {/* CABEÇALHO DA SEÇÃO */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold dark:text-white">Tabela Interativa</h2>
        <button
          onClick={() => downloadCSV(filtered)}
          className="px-3 py-1 rounded border bg-[#DA4167] text-white"
        >
          Exportar CSV
        </button>
      </div>

      {/* FILTROS INTERNOS TABELA  */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 dark:text-white">
        <div className="flex flex-col">
            <Label>Tecnologia</Label>
        <select
          value={filters.tecnologia}
          onChange={(e) => setFilters({ ...filters, tecnologia: e.target.value })}
          className="p-2 border rounded shadow-lg bg-white dark:bg-[#3c434a]"
        >
          <option>All</option>
          {[...new Set(data.map((d) => d.Tipo_Tecnologia))].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        </div>

        <div className="flex flex-col">
            <Label>Localização</Label>
        <select
          value={filters.localizacao}
          onChange={(e) => setFilters({ ...filters, localizacao: e.target.value })}
          className="p-2 border rounded shadow-lg bg-white dark:bg-[#3c434a]"
        >
          <option>All</option>
          {[...new Set(data.map((d) => d.Localizacao))].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        </div>

        <div className="flex flex-col">
            <Label>Administração</Label>
        <select
          value={filters.dependencia}
          onChange={(e) => setFilters({ ...filters, dependencia: e.target.value })}
          className="p-2 border rounded shadow-lg bg-white dark:bg-[#3c434a]"
        >
          <option>All</option>
          {[...new Set(data.map((d) => d.Dependencia_Adm))].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        </div>
      </div>

      {/*  FILTRO CAMPO DE BUSCA */}
      <input
        placeholder="Filtrar registros..."
        className="w-full mb-3 p-2 border rounded shadow-lg bg-white dark:bg-[#3c434a] dark:text-white"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABELA */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-left bg-white dark:text-white dark:bg-[#18181a]">
          <thead>
            <tr>
              {Object.keys(data[0]).map((col) => (
                <th key={col} className="px-3 py-2 border-b border-black dark:border-white">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginated.map((r) => (
              <tr key={r.ID} className="border-b border-black dark:border-white">
                {Object.keys(r).map((col) => (
                  <td key={col} className="px-3 py-2">
                    {r[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINAÇÃO */}
      <div className="flex justify-between mt-3">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded text-white bg-[#145C9E]"
        >
          Anterior
        </button>

        <span className="text-black dark:text-white">
          Página {page + 1} de {pageCount}
        </span>

        <button
          disabled={page === pageCount - 1}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded text-white bg-[#145C9E]"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
