import React from "react";
import style from "./Ranking.module.css";

const URL_API_GUILDA = "https://api.tibiadata.com/v4/guild/New Coorporative";

type Membro = {
  name: string;
  title?: string;
  rank: string;
  vocation: string;
  level: number;
  joined?: string;
  status: string;
};

const Ranking = () => {
  const [membros, setMembros] = React.useState<Membro[]>([]);
  const [paginaAtual, setPaginaAtual] = React.useState(1);
  const [filtroNome, setFiltroNome] = React.useState("");
  const membrosPorPagina = 15;

  React.useEffect(() => {
    async function buscarMembros() {
      try {
        const resposta = await fetch(URL_API_GUILDA);
        const dados = await resposta.json();
        const membrosDaGuilda: Membro[] = dados.guild.members;
        setMembros(membrosDaGuilda);
      } catch (erro) {
        console.error("Erro ao buscar membros:", erro);
      }
    }

    buscarMembros();
  }, []);

  const membrosFiltrados = membros.filter((membro) =>
    membro.name.toLowerCase().includes(filtroNome.toLowerCase()),
  );

  const indiceUltimoMembro = paginaAtual * membrosPorPagina;
  const indicePrimeiroMembro = indiceUltimoMembro - membrosPorPagina;
  const membrosDaPagina = membrosFiltrados.slice(
    indicePrimeiroMembro,
    indiceUltimoMembro,
  );

  const totalPaginas = Math.ceil(membrosFiltrados.length / membrosPorPagina);

  // Sempre volta para a página 1 ao digitar no filtro
  React.useEffect(() => {
    setPaginaAtual(1);
  }, [filtroNome]);

  return (
    <div className={style.container}>
      <div className={style.filtroContainer}>
        <input
          type="text"
          placeholder="Filtrar por nome..."
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
          className={style.inputFiltro}
        />
      </div>

      <table className={style.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Nível</th>
            <th>Vocação</th>
            <th>Status</th>
            <th>Patente</th>
            <th>Título</th>
          </tr>
        </thead>
        <tbody>
          {membrosDaPagina.map((membro, indice) => (
            <tr key={indice} className={style.cardMembros}>
              <td>{membro.name}</td>
              <td>{membro.level}</td>
              <td>{membro.vocation}</td>
              <td>{membro.status}</td>
              <td>{membro.rank}</td>
              <td>{membro.title || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={style.pagination}>
        {paginaAtual !== 1 && (
          <button
            onClick={() =>
              setPaginaAtual((anterior) => Math.max(anterior - 1, 1))
            }
            disabled={paginaAtual === 1}
          >
            Anterior
          </button>
        )}

        <span>
          Página {paginaAtual} de {totalPaginas || 1}
        </span>
        <button
          onClick={() =>
            setPaginaAtual((anterior) => Math.min(anterior + 1, totalPaginas))
          }
          disabled={paginaAtual === totalPaginas}
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default Ranking;
