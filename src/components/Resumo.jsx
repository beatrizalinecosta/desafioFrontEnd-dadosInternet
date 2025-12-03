import React, { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@heroui/react";
import { Label } from '@heroui/react';

const PIECOLORS = ["#951414ff","rgba(204, 106, 31, 1)","#41379cff","rgba(38, 104, 38, 1)"]
const COLORS = ["#5B8266", "#AF7A6D", "#ffc658", "#9BA0BC", "#8dd1e1", "#EAF9D9"];

export default function SummarySection({ data }) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    tecnologia: "All",
    dependencia: "All",
    localizacao: "All",
  });

  {/** FILTROS DE CAMPOS */}
  const filtered = useMemo(() => {
    return data.filter((r) => {
      if (filters.tecnologia !== "All" && r.Tipo_Tecnologia !== filters.tecnologia)
        return false;
      if (filters.dependencia !== "All" && r.Dependencia_Adm !== filters.dependencia)
        return false;
      if (filters.localizacao !== "All" && r.Localizacao !== filters.localizacao)
        return false;
      return true;
    });
  }, [data, filters]);

  {/** MÉDIAS - DOWNLOAD E UPLOAD */}
  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
  const avgDownload = avg(filtered.map((d) => d.Download));
  const avgUpload = avg(filtered.map((d) => d.Upload));

  {/** CONTAGEM DOS REGISTROS */}
  const countBy = (key) => {
    const out = {};
    filtered.forEach((r) => (out[r[key]] = (out[r[key]] || 0) + 1));
    return Object.entries(out).map(([k, v]) => ({ name: k, value: v }));
  };

  {/** PERFORMANCE DE UPLOAD */}
  const perfUploadBy = (key) => {
    const acc = {};
    filtered.forEach((r) => {
      if (!acc[r[key]]) acc[r[key]] = { sum: 0, count: 0 };
      acc[r[key]].sum += r.Upload;
      acc[r[key]].count++;
    });
    return Object.entries(acc).map(([k, v]) => ({ group: k, avgUpload: v.sum / v.count }));
  };

  return (
    <div className="bg-gray-100 dark:bg-[#212529] p-4 rounded shadow">
      {/** BOTÃO DE ABRIR/FECHAR SEÇÃO RESUMO */}
      <button
        className="w-full text-left text-lg flex font-semibold dark:bg-[#212529] dark:text-white" 
        onClick={() => setOpen((o) => !o)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="currentColor" d="M3 8V7h17v1zm17 4v1H3v-1zM3 17h17v1H3z"></path></svg>
        Resumo dos Registros
      </button>

      {open && (
        <div className="mt-4 space-y-6">
          {/** FILTROS */}
          <Label className="dark:text-white">Filtros</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 dark:text-white">
            {Object.entries({
              tecnologia: "Tipo_Tecnologia",
              dependencia: "Dependencia_Adm",
              localizacao: "Localizacao",
            }).map(([key, field]) => (
              <select
                key={key}
                value={filters[key]}
                onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                className="p-2 border rounded shadow-lg bg-white dark:bg-[#3c434a]"
              >
                <option>All</option>
                {[...new Set(data.map((d) => d[field]))].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            ))}
          </div>

          {/* CARDS - Média Download/Upload */}
            <div className="flex justify-around">
                <Card className="w-[40%]">
                    <Card.Header>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" className="dark:text-white"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 20h12M12 4v12m0 0l3.5-3.5M12 16l-3.5-3.5"></path></svg>
                    <Card.Title>Média Download</Card.Title>
                    <Card.Description>
                    <strong>{avgDownload.toFixed(2)} Mbps</strong>
                    </Card.Description>
                </Card.Header>
                </Card>
                <Card className="w-[40%]">
                    <Card.Header>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" className="dark:text-white"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m17 9l-5-5m0 0L7 9m5-5v13m-6 3h12"></path></svg>
                    <Card.Title>Média Upload</Card.Title>
                    <Card.Description>
                    <strong>{avgUpload.toFixed(2)} Mbps</strong>
                    </Card.Description>
                </Card.Header>
                </Card>
            </div>  

          {/*PIECHARTS - Quantidade de Registros */}
          <Card className="grid grid-cols-1 lg:grid-cols-3 gap-4 dark:text-white">
            {[
              { title: "Quantidade de Registros por Tecnologia", data: countBy("Tipo_Tecnologia") },
              { title: "Quantidade de Registros por Localização", data: countBy("Localizacao") },
              { title: "Quantidade de Registros por Administração", data: countBy("Dependencia_Adm") },
            ].map((g, i) => (
              <div key={i} className="p-3 bg-white/60 dark:bg-[#18181a] rounded">
                <h3 className="font-semibold mb-2">{g.title}</h3>
                <div style={{ width: "100%", height: 220 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie dataKey="value" data={g.data} outerRadius={70} label>
                        {g.data.map((entry, idx) => (
                          <Cell fill={PIECOLORS[idx % PIECOLORS.length]} key={idx} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </Card>

          {/* BARCHART - Performance Upload por Tecnologia / Localização */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 dark:text-white">
            {[
              {
                title: "Performance Upload por Tecnologia",
                data: perfUploadBy("Tipo_Tecnologia"),
              },
              {
                title: "Performance Upload por Localização",
                data: perfUploadBy("Localizacao"),
              },
            ].map((g, i) => (
              <Card key={i} className="p-3 bg-white/60 dark:bg-[#18181a]">
                <h3 className="font-semibold mb-2">{g.title}</h3>
                <div style={{ width: "100%", height: 250 }}>
                  <ResponsiveContainer>
                    <BarChart data={g.data}>
                      <XAxis dataKey="group" />
                      <YAxis />
                      <Tooltip />
                        <Bar dataKey="avgUpload">
                            {g.data.map((entry, idx) => (
                            <Cell fill={COLORS[idx % COLORS.length]} key={idx} />
                            ))}
                        </Bar>                    
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            ))}
          </div>

          {/* BARCHART - Comparativo Média Download/Upload por Tecnologia */}
          <Card className="p-3 bg-white/60 dark:bg-[#18181a] dark:text-white ">
            <h3 className="font-semibold mb-2">Comparativo Download/Upload por Tecnologia</h3>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart
                  data={[
                    ...Object.entries(
                      filtered.reduce((acc, r) => {
                        if (!acc[r.Tipo_Tecnologia]) acc[r.Tipo_Tecnologia] = { d: 0, u: 0, c: 0 };
                        acc[r.Tipo_Tecnologia].d += r.Download;
                        acc[r.Tipo_Tecnologia].u += r.Upload;
                        acc[r.Tipo_Tecnologia].c++;
                        return acc;
                      }, {})
                    ).map(([k, v]) => ({
                      tecnologia: k,
                      avgD: v.d / v.c,
                      avgU: v.u / v.c,
                    })),
                  ]}
                >
                  <XAxis dataKey="tecnologia" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgD" fill="#0c5986ff" name="Média Download"/>
                  <Bar dataKey="avgU" fill="#14eb8aff" name="Média Upload"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
