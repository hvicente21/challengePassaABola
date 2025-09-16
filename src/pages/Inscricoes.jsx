import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ========= Storage Helpers ========= */
function getInscricoesFromStorage() {
  try {
    return JSON.parse(localStorage.getItem("inscricoes") || "[]");
  } catch {
    return [];
  }
}
function setInscricoesToStorage(list) {
  localStorage.setItem("inscricoes", JSON.stringify(list));
}

/* ========= Utils ========= */
function parsePtBrDateTime(str) {
  if (!str) return NaN;
  const m = String(str).match(
    /(\d{2})\/(\d{2})\/(\d{4})[,\s]+(\d{2}):(\d{2})(?::(\d{2}))?/
  );
  if (!m) return NaN;
  const [, dd, mm, yyyy, HH, MM, SS] = m;
  const d = new Date(+yyyy, +mm - 1, +dd, +HH, +MM, +(SS || 0));
  return d.getTime();
}
function getTimestamp(item) {
  if (typeof item?.createdAt === "number") return item.createdAt;
  if (item?.dataHora) return parsePtBrDateTime(item.dataHora);
  return NaN;
}
function keyOf(item) {
  return item.id ?? `${item.email}-${getTimestamp(item)}`;
}
function labelDia(ts) {
  const hoje = new Date();
  const d = new Date(ts);
  const ontem = new Date(hoje);
  ontem.setDate(hoje.getDate() - 1);
  if (d.toDateString() === hoje.toDateString()) return "Hoje";
  if (d.toDateString() === ontem.toDateString()) return "Ontem";
  return d.toLocaleDateString("pt-BR");
}

/* ========= CSV helpers ========= */
function toCSVRow(cols) {
  return cols
    .map((c) => {
      const v = String(c ?? "");
      const needsQuotes = /[;"\n\r]/.test(v);
      const esc = v.replace(/"/g, '""');
      return needsQuotes ? `"${esc}"` : esc;
    })
    .join(";");
}
function buildCSV(list) {
  const header = [
    "Nome",
    "Email",
    "Posição",
    "Experiência",
    "Observações",
    "Data/Hora",
  ];
  const rows = list.map((it) => [
    it.nome ?? "",
    it.email ?? "",
    it.posicao ?? "",
    it.experiencia ?? "",
    it.observacoes ?? "",
    it.dataHora ??
      (it.createdAt ? new Date(it.createdAt).toLocaleString("pt-BR") : ""),
  ]);
  return [toCSVRow(header), ...rows.map(toCSVRow)].join("\n");
}
function download(filename, text) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ========= Página ========= */
export default function Inscricoes() {
  const navigate = useNavigate();

  const [inscricoes, setInscricoes] = useState([]);
  const [toDelete, setToDelete] = useState(null);

  // controles
  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState("");
  const [expFilter, setExpFilter] = useState("");

  useEffect(() => {
    const data = getInscricoesFromStorage();

    let changed = false;
    data.forEach((it) => {
      if (typeof it.createdAt !== "number") {
        const ts = getTimestamp(it);
        it.createdAt = Number.isNaN(ts) ? Date.now() : ts;
        changed = true;
      }
    });
    if (changed) setInscricoesToStorage(data);

    data.sort((a, b) => (getTimestamp(b) || 0) - (getTimestamp(a) || 0));
    setInscricoes(data);
  }, []);

  // filtro e busca
  const filtradas = useMemo(() => {
    const s = search.trim().toLowerCase();
    return inscricoes.filter((it) => {
      const matchSearch =
        !s ||
        (it.nome ?? "").toLowerCase().includes(s) ||
        (it.email ?? "").toLowerCase().includes(s);
      const matchPos = !posFilter || it.posicao === posFilter;
      const matchExp = !expFilter || it.experiencia === expFilter;
      return matchSearch && matchPos && matchExp;
    });
  }, [inscricoes, search, posFilter, expFilter]);

  // agrupa por dia
  const grupos = useMemo(() => {
    const map = new Map();
    filtradas.forEach((item) => {
      const ts = getTimestamp(item) || Date.now();
      const dayKey = new Date(ts).toDateString();
      if (!map.has(dayKey)) map.set(dayKey, []);
      map.get(dayKey).push(item);
    });
    return Array.from(map.entries()).sort(
      (a, b) => new Date(b[0]) - new Date(a[0])
    );
  }, [filtradas]);

  const exportCSV = () => {
    const csv = buildCSV(filtradas);
    download(
      `inscricoes_${new Date().toISOString().slice(0, 10)}.csv`,
      csv
    );
  };

  const confirmarExclusao = () => {
    if (!toDelete) return;
    const idKey = keyOf(toDelete);
    const novaLista = inscricoes.filter((it) => keyOf(it) !== idKey);
    setInscricoes(novaLista);
    setInscricoesToStorage(novaLista);
    setToDelete(null);
  };

  return (
    <div className="pb-16">
      {/* HERO */}
      <section
        className="hero-inscricoes relative text-center py-16 w-full"
        style={{
          background:
            "linear-gradient(90deg, rgba(123,58,245,0.9) 0%, rgba(250,223,99,0.85) 100%)",
        }}
      >
        <h1 className="text-5xl font-extrabold text-white">Inscrições</h1>
        <p className="text-white mt-3">
          Faça parte da história do futebol feminino brasileiro. Inscreva-se agora!
        </p>

        {/* CTA ROXO — blindado */}
        <button
          type="button"
          className="btn-purple mt-6"
          style={{
            backgroundColor: "#7B3AF5",
            color: "#fff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => navigate("/inscricao")}
          aria-label="Abrir formulário de inscrição"
        >
          Fazer Inscrição
        </button>
      </section>

      {/* Título + descrição */}
      <div className="max-w-3xl mx-auto px-4 mt-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center">
          Inscrições Realizadas ({filtradas.length})
        </h2>
        <p className="text-center text-gray-600 mt-1">
          Lista de todas as inscrições em ordem de chegada
        </p>
      </div>

      {/* Controles */}
      <div className="max-w-3xl mx-auto px-4 mt-6 mb-5">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm"
            aria-label="Buscar por nome ou e-mail"
          />

          <select
            value={posFilter}
            onChange={(e) => setPosFilter(e.target.value)}
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
            aria-label="Filtrar por posição"
          >
            <option value="">Todas as posições</option>
            <option>Goleira</option>
            <option>Zagueira</option>
            <option>Lateral</option>
            <option>Volante</option>
            <option>Meia</option>
            <option>Atacante</option>
          </select>

          <select
            value={expFilter}
            onChange={(e) => setExpFilter(e.target.value)}
            className="rounded-xl border border-gray-300 px-3 py-2 text-sm"
            aria-label="Filtrar por experiência"
          >
            <option value="">Todas as experiências</option>
            <option>Iniciante</option>
            <option>Amadora</option>
            <option>Semiprofissional</option>
            <option>Profissional</option>
          </select>

          <button
            onClick={exportCSV}
            className="px-3 py-2 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-sm"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Lista agrupada */}
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        {grupos.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            Nenhuma inscrição encontrada.
          </div>
        )}

        {grupos.map(([dayKey, items]) => {
          const anyTs = getTimestamp(items[0]) || Date.now();
          return (
            <section key={dayKey} className="space-y-3">
              <h3 className="text-xs font-semibold text-gray-600">
                {labelDia(anyTs)}
              </h3>

              <div className="space-y-3">
                {items.map((item) => {
                  const dataMostrada =
                    item?.dataHora ??
                    (item?.createdAt
                      ? new Date(item.createdAt).toLocaleString("pt-BR")
                      : "—");
                  return (
                    <article
                      key={keyOf(item)}
                      className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-[15px] leading-tight">
                            {item.nome}
                          </h3>
                          <p className="text-xs text-gray-600 leading-tight">
                            {item.email}
                          </p>
                        </div>

                        <button
                          onClick={() => setToDelete(item)}
                          className="shrink-0 px-2.5 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-medium"
                          title="Excluir inscrição"
                          aria-label={`Excluir inscrição de ${item.nome}`}
                        >
                          Excluir
                        </button>
                      </div>

                      <p className="mt-2 text-xs">
                        <span className="font-medium">Posição:</span>{" "}
                        {item.posicao}{" "}
                        <span className="mx-2 text-gray-300">|</span>
                        <span className="font-medium">Experiência:</span>{" "}
                        {item.experiencia}
                      </p>

                      {item.observacoes && (
                        <p className="mt-1.5 text-xs">
                          <span className="font-medium">Observações:</span>{" "}
                          {item.observacoes}
                        </p>
                      )}

                      <p className="mt-1.5 text-[11px] text-gray-500">
                        <span className="font-medium">Data:</span>{" "}
                        {dataMostrada}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Modal Confirmar exclusão */}
      {toDelete && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-xl p-5 max-w-md w-[92%] shadow-xl">
            <h4 className="text-base font-bold mb-2.5">
              Excluir inscrição de {toDelete.nome}?
            </h4>
            <p className="text-gray-600 mb-5 text-sm">
              Esta ação não pode ser desfeita. Tem certeza que deseja excluir?
            </p>

            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => setToDelete(null)}
                className="px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusao}
                className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
