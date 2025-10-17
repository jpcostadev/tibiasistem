import React from "react";
import style from "./Ranking.module.css";
import {
  UserIcon,
  TrophyIcon,
  SwordIcon,
  ShieldIcon,
  EyeIcon,
} from "../../assets/icons";

const URL_API_GUILDA = "https://api.tibiadata.com/v4/guild/New Coorporative";
const URL_API_CHARACTER = "https://api.tibiadata.com/v4/character";

type Membro = {
  name: string;
  title?: string;
  rank: string;
  vocation: string;
  level: number;
  joined?: string;
  status: string;
};

type CharacterDetails = {
  name: string;
  level: number;
  vocation: string;
  world: string;
  residence: string;
  last_login: string;
  achievement_points: number;
  comment: string;
  title: string;
  sex: string;
  married_to: string;
  guild: {
    name: string;
    rank: string;
  };
  houses: Array<{
    name: string;
    town: string;
    paid: string;
  }>;
  deaths: Array<{
    level: number;
    reason: string;
    time: string;
  }>;
  achievements: Array<{
    name: string;
    grade: number;
    secret: boolean;
  }>;
};

const Ranking = () => {
  const [membros, setMembros] = React.useState<Membro[]>([]);
  const [paginaAtual, setPaginaAtual] = React.useState(1);
  const [filtroNome, setFiltroNome] = React.useState("");
  const [selectedCharacter, setSelectedCharacter] =
    React.useState<CharacterDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const membrosPorPagina = 12;

  React.useEffect(() => {
    async function buscarMembros() {
      try {
        setLoading(true);
        const resposta = await fetch(URL_API_GUILDA);
        const dados = await resposta.json();
        const membrosDaGuilda: Membro[] = dados.guild.members;
        setMembros(membrosDaGuilda);
      } catch (erro) {
        console.error("Erro ao buscar membros:", erro);
      } finally {
        setLoading(false);
      }
    }

    buscarMembros();
  }, []);

  const buscarDetalhesPersonagem = async (nome: string) => {
    try {
      setLoading(true);
      const resposta = await fetch(`${URL_API_CHARACTER}/${nome}`);
      const dados = await resposta.json();

      if (dados.character && dados.character.character) {
        const character = dados.character.character;
        const characterDetails: CharacterDetails = {
          name: character.name,
          level: character.level,
          vocation: character.vocation,
          world: character.world,
          residence: character.residence,
          last_login: character.last_login,
          achievement_points: character.achievement_points,
          comment: character.comment,
          title: character.title,
          sex: character.sex,
          married_to: character.married_to,
          guild: character.guild,
          houses: character.houses || [],
          deaths: dados.character.deaths || [],
          achievements: dados.character.achievements || [],
        };

        setSelectedCharacter(characterDetails);
        setIsModalOpen(true);
      }
    } catch (erro) {
      console.error("Erro ao buscar detalhes do personagem:", erro);
    } finally {
      setLoading(false);
    }
  };

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

  const getVocationIcon = (vocation: string) => {
    switch (vocation.toLowerCase()) {
      case "knight":
        return <ShieldIcon size={20} />;
      case "paladin":
        return <SwordIcon size={20} />;
      case "sorcerer":
      case "druid":
        return <TrophyIcon size={20} />;
      default:
        return <UserIcon size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    return status === "online" ? "#4ade80" : "#6b7280";
  };

  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1 className={style.title}>Ranking da Guilda</h1>
        <p className={style.subtitle}>Lista de membros da guilda</p>
      </div>

      <div className={style.filtroContainer}>
        <input
          type="text"
          placeholder="Filtrar por nome..."
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
          className={style.inputFiltro}
        />
      </div>

      {loading && membros.length === 0 ? (
        <div className={style.loading}>
          <div className={style.spinner}></div>
          <p>Carregando membros...</p>
        </div>
      ) : (
        <div className={style.cardsGrid}>
          {membrosDaPagina.map((membro, indice) => (
            <div key={indice} className={style.memberCard}>
              <div className={style.cardHeader}>
                <div className={style.memberInfo}>
                  <div className={style.avatar}>
                    <UserIcon size={24} />
                  </div>
                  <div className={style.memberDetails}>
                    <h3 className={style.memberName}>{membro.name}</h3>
                    <p className={style.memberRank}>{membro.rank}</p>
                  </div>
                </div>
                <div
                  className={style.statusDot}
                  style={{ backgroundColor: getStatusColor(membro.status) }}
                ></div>
              </div>

              <div className={style.cardContent}>
                <div className={style.statItem}>
                  <TrophyIcon size={16} />
                  <span className={style.statLabel}>Level</span>
                  <span className={style.statValue}>{membro.level}</span>
                </div>

                <div className={style.statItem}>
                  {getVocationIcon(membro.vocation)}
                  <span className={style.statLabel}>Vocation</span>
                  <span className={style.statValue}>{membro.vocation}</span>
                </div>
              </div>

              <button
                className={style.viewButton}
                onClick={() => buscarDetalhesPersonagem(membro.name)}
                disabled={loading}
              >
                <EyeIcon size={16} />
                <span>Ver Detalhes</span>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={style.pagination}>
        {paginaAtual !== 1 && (
          <button
            onClick={() =>
              setPaginaAtual((anterior) => Math.max(anterior - 1, 1))
            }
            disabled={paginaAtual === 1}
            className={style.paginationButton}
          >
            Anterior
          </button>
        )}

        <span className={style.paginationInfo}>
          Página {paginaAtual} de {totalPaginas || 1}
        </span>

        <button
          onClick={() =>
            setPaginaAtual((anterior) => Math.min(anterior + 1, totalPaginas))
          }
          disabled={paginaAtual === totalPaginas}
          className={style.paginationButton}
        >
          Próxima
        </button>
      </div>

      {/* Modal de Detalhes */}
      {isModalOpen && selectedCharacter && (
        <div
          className={style.modalOverlay}
          onClick={() => setIsModalOpen(false)}
        >
          <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <div className={style.modalHeader}>
              <h2 className={style.modalTitle}>{selectedCharacter.name}</h2>
              <button
                className={style.closeButton}
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className={style.modalContent}>
              <div className={style.characterInfo}>
                <div className={style.infoGrid}>
                  <div className={style.infoItem}>
                    <span className={style.infoLabel}>Level</span>
                    <span className={style.infoValue}>
                      {selectedCharacter.level}
                    </span>
                  </div>
                  <div className={style.infoItem}>
                    <span className={style.infoLabel}>Vocation</span>
                    <span className={style.infoValue}>
                      {selectedCharacter.vocation}
                    </span>
                  </div>
                  <div className={style.infoItem}>
                    <span className={style.infoLabel}>World</span>
                    <span className={style.infoValue}>
                      {selectedCharacter.world}
                    </span>
                  </div>
                  <div className={style.infoItem}>
                    <span className={style.infoLabel}>Residence</span>
                    <span className={style.infoValue}>
                      {selectedCharacter.residence}
                    </span>
                  </div>
                  <div className={style.infoItem}>
                    <span className={style.infoLabel}>Last Login</span>
                    <span className={style.infoValue}>
                      {new Date(
                        selectedCharacter.last_login,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className={style.infoItem}>
                    <span className={style.infoLabel}>Achievement Points</span>
                    <span className={style.infoValue}>
                      {selectedCharacter.achievement_points}
                    </span>
                  </div>
                </div>

                {selectedCharacter.comment && (
                  <div className={style.commentSection}>
                    <h3>Comment</h3>
                    <p>{selectedCharacter.comment}</p>
                  </div>
                )}

                {selectedCharacter.houses.length > 0 && (
                  <div className={style.housesSection}>
                    <h3>Houses</h3>
                    {selectedCharacter.houses.map((house, index) => (
                      <div key={index} className={style.houseItem}>
                        <span className={style.houseName}>{house.name}</span>
                        <span className={style.houseTown}>{house.town}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ranking;
