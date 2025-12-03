import React, { useState, useMemo } from "react";
import dataJson from "../data/sample.json";
import Resumo from "./Resumo";
import DataTable from "./DataTable";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";


export default function Dashboard() {
  const [dark, setDark] = useState(false);

  return (
    <div className="w-screen">
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-white-100 dark:bg-[#3c434a] p-4 space-y-6">
        {/**HEADER - TITULO E DARK MODE */}
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#DA4167]">Desafio FrontEnd</h1>
          <button
            onClick={() => setDark((d) => !d)}
            className="p-2 rounded dark:text-white"
          >
            {dark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>
        </header>

        <Resumo data={dataJson} />
        <DataTable data={dataJson} />
      </div>
    </div>
    </div>
  );
}
