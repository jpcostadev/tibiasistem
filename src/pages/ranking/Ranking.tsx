import React from "react";
import style from "./Ranking.module.css";

const URL_API_GUILDA = "https://api.tibiadata.com/v4/guild/New%20Coorporative";

type Membros = {
  name: string;
  title?: string;
  rank: string;
  vocation: string;
  level: number;
  joined?: string;
  status: string;
};

const Ranking = () => {
  const [membros, setMembros] = React.useState<Membros[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filtroNome, setFiltroNome] = React.useState("");
  const membersPerPage = 15;

  React.useEffect(() => {
    async function buscarPlayers() {
      try {
        const response = await fetch(URL_API_GUILDA);
        const json = await response.json();
        const membrosData: Membros[] = json.guild.members;
        setMembros(membrosData);
      } catch (error) {
        console.error("Erro ao buscar membros:", error);
      }
    }

    buscarPlayers();
  }, []);

  const membrosFiltrados = membros.filter((membro) =>
    membro.name.toLowerCase().includes(filtroNome.toLowerCase()),
  );

  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = membrosFiltrados.slice(
    indexOfFirstMember,
    indexOfLastMember,
  );

  const totalPages = Math.ceil(membrosFiltrados.length / membersPerPage);

  React.useEffect(() => {
    setCurrentPage(1);
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
            <th>Level</th>
            <th>Vocação</th>
            <th>Status</th>
            <th>Rank</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {currentMembers.map((membro, index) => (
            <tr key={index} className={style.cardMembros}>
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
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages || 1}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default Ranking;
