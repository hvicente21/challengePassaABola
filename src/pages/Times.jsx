// src/pages/Times.jsx
import React from "react";
import { Link } from "react-router-dom";

/* ===== Varredura de TODOS os assets (minúsculas e MAIÚSCULAS) ===== */
const assetsLower = import.meta.glob("../assets/**/*.{png,jpg,jpeg,svg,webp}", {
  eager: true,
  import: "default",
});
const assetsUpper = import.meta.glob("../assets/**/*.{PNG,JPG,JPEG,SVG,WEBP}", {
  eager: true,
  import: "default",
});
const allAssets = { ...assetsLower, ...assetsUpper };

/* Normalizador e util p/ tirar TODAS as extensões (ex: .svg.png) */
const norm = (s = "") =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-");

const baseName = (path = "") => {
  const file = path.split("/").pop() || "";
  // remove TODAS as extensões conhecidas (se tiver .svg.png, some com as duas)
  return file.replace(/\.(png|jpe?g|svg|webp)/gi, "");
};

/** Busca EXATA pelo nome do arquivo (sem extensão) */
const getAssetExact = (keyOrKeys) => {
  const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
  for (const key of keys) {
    if (!key) continue;
    const want = norm(key);
    for (const [path, src] of Object.entries(allAssets)) {
      const base = baseName(path);
      if (norm(base) === want) return src;
    }
  }
  return null;
};

/** Foto grande do card */
const getTeamPhoto = (clubName, photoKeys = []) => {
  const exata = getAssetExact(photoKeys);
  if (exata) return exata;

  const club = norm(clubName);
  let candidato = null;

  for (const [path, src] of Object.entries(allAssets)) {
    const b = norm(baseName(path));
    const hasClub = b.includes(club);
    const isCrestLike =
      b.includes("escudo") || b.includes("logo") || b.includes("badge") || b.includes("brasao");
    if (hasClub && !isCrestLike) {
      const hasHint = b.includes("time") || b.includes("tima") || b.includes("team");
      if (hasHint) return src;
      candidato = candidato || src;
    }
  }
  return candidato;
};

/** Escudo do clube */
const getCrest = (clubName, crestKeys = []) => {
  const byKeys = getAssetExact(crestKeys);
  if (byKeys) return byKeys;

  const club = norm(clubName);
  for (const [path, src] of Object.entries(allAssets)) {
    const b = norm(baseName(path));
    const hasClub = b.includes(club);
    const isCrestLike =
      b.includes("escudo") || b.includes("logo") || b.includes("badge") || b.includes("brasao");
    if (hasClub && isCrestLike) return src;
  }
  // fallback: tentar nome do clube puro
  return getAssetExact([clubName]);
};

/* ===== Dados dos cards ===== */
const TOP = [
  {
    slug: "flamengo",
    nome: "Flamengo",
    cidade: "Rio de Janeiro",
    fundacao: 1995,
    fotoKey: ["TimeFlamengo", "Flamengo"],
    crestKey: ["EscudoFlamengo", "Flamengo-escudo", "Flamengo-logo", "Flamengo"],
  },
  {
    slug: "santos",
    nome: "Santos",
    cidade: "Santos",
    fundacao: 1997,
    fotoKey: ["TimeSantos", "SantosTime"],
    crestKey: ["EscudoSantos", "Santos-escudo", "Santos-logo", "Santos"],
  },
  {
    slug: "palmeiras",
    nome: "Palmeiras",
    cidade: "São Paulo",
    fundacao: 2019,
    fotoKey: ["TimePalmeira", "TimePalmeiras", "TimaPalmeira", "TimaPalmeiras", "PalmeirasFeminino"],
    crestKey: ["EscudoPalmeiras", "Palmeiras-escudo", "Palmeiras-logo", "Palmeiras"],
  },
];

const BOTTOM = [
  {
    slug: "corinthians",
    nome: "Corinthians",
    cidade: "São Paulo",
    fundacao: 2016,
    fotoKey: ["TimeCorinthians", "CorinthiansTime"],
    crestKey: ["EscudoCorinthians", "Corinthians-escudo", "Corinthians-logo", "Corinthians"],
  },
  {
    slug: "sao-paulo",
    nome: "São Paulo",
    cidade: "São Paulo",
    fundacao: 1997,
    fotoKey: ["TimeSaoPaulo", "SaoPaulo", "SPFC"],
    // Inclui o nome real do arquivo que você mencionou como base (sem extensão)
    crestKey: [
      "Brasao_do_Sao_Paulo_Futebol_Clube",
      "EscudoSaoPaulo",
      "SPFC-escudo",
      "SaoPaulo-logo",
      "Sao Paulo",
      "SPFC",
    ],
  },
  {
    slug: "cruzeiro",
    nome: "Cruzeiro",
    cidade: "Belo Horizonte",
    fundacao: 2019,
    fotoKey: ["TimeCruzeiro", "CruzeiroTime"],
    crestKey: ["EscudoCruzeiro", "Cruzeiro-escudo", "Cruzeiro-logo", "Cruzeiro"],
  },
];

function TeamCard({ item }) {
  const foto = getTeamPhoto(item.nome, item.fotoKey);
  const logo = getCrest(item.nome, item.crestKey);

  return (
    <article className="bg-white rounded-2xl shadow-[0_10px_24px_rgba(10,10,20,.06)] overflow-hidden flex flex-col">
      {/* Foto grande */}
      <div className="w-full h-[280px] md:h-[320px] lg:h-[360px] overflow-hidden">
        {foto ? (
          <img src={foto} alt={`Foto do ${item.nome}`} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-gray-200 grid place-items-center text-gray-500 text-center px-4">
            (adicione uma imagem com nome EXATO como:{" "}
            <span className="font-semibold">
              {Array.isArray(item.fotoKey) ? item.fotoKey.join(", ") : item.fotoKey}
            </span>{" "}
            em /src/assets)
          </div>
        )}
      </div>

      {/* Faixa branca */}
      <div className="p-5 md:p-6">
        <div className="flex items-start gap-3">
          {logo && <img src={logo} alt={`${item.nome} logo`} className="w-10 h-10 object-contain" loading="lazy" />}
          <div>
            <h3
              className="text-[32px] leading-8 md:text-[36px] md:leading-9 font-black"
              style={{ fontFamily: '"Bebas Neue", Inter, ui-sans-serif' }}
            >
              {item.nome}:
            </h3>
            <div className="text-[13px] md:text-[14px] font-black tracking-wide uppercase text-[#111]">
              {item.cidade} · Fundado em {item.fundacao}
            </div>
          </div>
        </div>

        {/* Botão -> Perfil */}
        <div className="mt-6">
          <Link
            to={`/time/${item.slug}`}
            className="w-full inline-flex justify-center bg-white text-[#7B3AF5] border border-[#E8E8EF] rounded-xl py-3 font-extrabold hover:shadow-md transition no-underline"
          >
            Ver Perfil Completo
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Times() {
  return (
    <main className="bg-[#F5F6FF]">
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="text-center mb-8">
          <h1
            className="text-[44px] md:text-[56px] leading-[0.9] font-black"
            style={{ fontFamily: '"Bebas Neue", Inter, ui-sans-serif' }}
          >
            Times em Destaque
          </h1>
          <p className="text-gray-600 mt-2">Conheça os principais times do futebol feminino</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {TOP.map((t) => (
            <TeamCard key={t.slug} item={t} />
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {BOTTOM.map((t) => (
            <TeamCard key={t.slug} item={t} />
          ))}
        </div>

        {/* CTA — no final, com TEXTO BRANCO forçado */}
        <div className="flex justify-center">
          <Link
            to="/times"
            className="mt-10 bg-[#7B3AF5] rounded-2xl px-6 py-3 font-extrabold tracking-wide hover:brightness-95 no-underline"
            style={{ color: "#fff" }}   // <- mata o a{color:var(--purple)}
          >
            Ver Todos os Times →
          </Link>
        </div>
      </section>
    </main>
  );
}
