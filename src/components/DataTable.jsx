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
        <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h12.769q.69 0 1.153.463T20 5.616v12.769q0 .69-.462 1.153T18.384 20zm5.884-5.596H5v3.98q0 .27.173.443t.443.173H11.5zm1 0V19h5.885q.269 0 .442-.173t.173-.442v-3.981zm-1-1V8.769H5v4.635zm1 0H19V8.769h-6.5zM5 7.769h14V5.615q0-.269-.173-.442T18.385 5H5.615q-.269 0-.442.173T5 5.616z"></path></svg>
            <h2 className="text-xl font-semibold dark:text-white">Tabela Interativa</h2>
        </div>
        <div className="flex">
            
            <button
            onClick={() => downloadCSV(filtered)}
            className="px-3 py-1 rounded border bg-[#DA4167] text-white flex"
            >
            Exportar 
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={1.5}>
                        <path d="M7.5 17.22C7.445 16.03 6.622 16 5.505 16c-1.72 0-2.005.406-2.005 2v2c0 1.594.285 2 2.005 2c1.117 0 1.94-.03 1.995-1.22m13-4.78l-1.777 4.695c-.33.87-.494 1.305-.755 1.305c-.26 0-.426-.435-.755-1.305L15.436 16m-2.56 0h-1.18c-.473 0-.709 0-.895.076c-.634.26-.625.869-.625 1.424s-.009 1.165.625 1.424c.186.076.422.076.894.076s.708 0 .894.076c.634.26.625.869.625 1.424s.009 1.165-.625 1.424c-.186.076-.422.076-.894.076H10.41"></path>
                        <path strokeLinejoin="round" d="M20 13v-2.343c0-.818 0-1.226-.152-1.594c-.152-.367-.441-.657-1.02-1.235l-4.736-4.736c-.499-.499-.748-.748-1.058-.896a2 2 0 0 0-.197-.082C12.514 2 12.161 2 11.456 2c-3.245 0-4.868 0-5.967.886a4 4 0 0 0-.603.603C4 4.59 4 6.211 4 9.456V13m9-10.5V3c0 2.828 0 4.243.879 5.121C14.757 9 16.172 9 19 9h.5"></path>
                    </g>
                </svg>
            </button>
        </div>
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
          className="px-3 py-1 border rounded text-white bg-[#145C9E] flex"
        >
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
            <path fill="currentColor" d="M10 21.308L.692 12L10 2.692l1.064 1.064L2.819 12l8.244 8.244z"></path>
        </svg>
          Anterior
        </button>

        <span className="text-black dark:text-white">
          Página {page + 1} de {pageCount}
        </span>

        <button
          disabled={page === pageCount - 1}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded flex text-white bg-[#145C9E]"
        >
          Próxima
          <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
            <path fill="currentColor" d="M15.187 12L7.47 4.285q-.221-.221-.218-.532q.003-.31.224-.532Q7.698 3 8.009 3q.31 0 .532.221l7.636 7.643q.242.242.354.54t.111.596t-.111.596t-.354.54L8.535 20.78q-.222.221-.53.218q-.307-.003-.528-.224t-.221-.532t.221-.531z"></path>
        </svg>
        </button>
      </div>
    </div>
  );
}
