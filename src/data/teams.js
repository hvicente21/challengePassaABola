// Ajuste caminhos/nomes dos arquivos de imagem conforme sua pasta src/assets
import fotoFla from "../assets/TimeFlamengo.jpg";
import fotoPal from "../assets/TimePalmeiras.jpg";
import fotoSan from "../assets/TimeSantos.jpg";
import fotoCor from "../assets/TimeCorinthians.jpg";
import fotoSao from "../assets/TimeSaoPaulo.jpg";
import fotoCru from "../assets/TimeCruzeiro.jpg";

import escFla from "../assets/Flamengo.png";
import escPal from "../assets/Palmeiras.png";
import escSan from "../assets/Santos.png";
import escCor from "../assets/Corinthians.png";
import escSao from "../assets/SaoPaulo.png";
import escCru from "../assets/Cruzeiro.png";

const TEAMS = [
  {
    slug: "flamengo",
    nome: "Flamengo",
    cidade: "Rio de Janeiro, RJ",
    cor: "#E64545",
    foto: fotoFla,
    escudo: escFla,
    descricao:
      "Atual líder do Brasileirão, com elenco estrelado e tradição no futebol feminino.",
  },
  {
    slug: "palmeiras",
    nome: "Palmeiras",
    cidade: "São Paulo, SP",
    cor: "#2E7D32",
    foto: fotoPal,
    escudo: escPal,
    descricao:
      "Projeto consistente no futebol feminino, com bom desempenho nas últimas temporadas.",
  },
  {
    slug: "santos",
    nome: "Santos",
    cidade: "Santos, SP",
    cor: "#111",
    foto: fotoSan,
    escudo: escSan,
    descricao:
      "As Sereias da Vila: tradição, base forte e talento revelado ano após ano.",
  },
  {
    slug: "corinthians",
    nome: "Corinthians",
    cidade: "São Paulo, SP",
    cor: "#7B3AF5",
    foto: fotoCor,
    escudo: escCor,
    descricao:
      "Um dos elencos mais competitivos do país, com títulos e regularidade.",
  },
  {
    slug: "sao-paulo",
    nome: "São Paulo",
    cidade: "São Paulo, SP",
    cor: "#D33B32",
    foto: fotoSao,
    escudo: escSao,
    descricao:
      "Elenco em ascensão, com bom trabalho de base e resultados recentes.",
  },
  {
    slug: "cruzeiro",
    nome: "Cruzeiro",
    cidade: "Belo Horizonte, MG",
    cor: "#1D6FA3",
    foto: fotoCru,
    escudo: escCru,
    descricao:
      "Campanha sólida e torcida apoiando forte; momento de alta no feminino.",
  },
];

export default TEAMS;
