import React from "react";
import style from "./Ranking.module.css";
import {
  UserIcon,
  TrophyIcon,
  SwordIcon,
  ShieldIcon,
  EyeIcon,
  RefreshIcon,
} from "../../assets/icons";
import intelligentCache from "../../utils/IntelligentCache";
import Loading from "../../components/ui/Loading";
import Modal from "../../components/ui/Modal";

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
  const [refreshing, setRefreshing] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | "online" | "offline"
  >("all");
  const membrosPorPagina = 10;

  React.useEffect(() => {
    buscarMembros();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const buscarMembros = async (forceRefresh = false) => {
    try {
      setLoading(true);

      // Verificar cache primeiro (se não for refresh forçado)
      if (!forceRefresh) {
        const cachedMembers = intelligentCache.getItem(
          "guildMembers",
          "members",
        );
        if (cachedMembers && Array.isArray(cachedMembers)) {
          setMembros(cachedMembers as Membro[]);
          setLoading(false);
          return;
        }
      }

      // Buscar da API
      const resposta = await fetch(URL_API_GUILDA);
      const dados = await resposta.json();
      const membrosDaGuilda: Membro[] = dados.guild.members;

      // Salvar no cache
      intelligentCache.setItem("guildMembers", "members", membrosDaGuilda);

      setMembros(membrosDaGuilda);

      // Forçar re-render se necessário
      setTimeout(() => {
        // Estado atualizado
      }, 100);
    } catch (erro) {
      console.error("Erro ao buscar membros:", erro);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);

      // Limpar cache do ranking
      intelligentCache.clearCacheByType("guildMembers");
      intelligentCache.clearCacheByType("character");

      // Buscar membros forçando refresh
      await buscarMembros(true);
    } catch (error) {
      console.error("Erro durante refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const buscarDetalhesPersonagem = async (nome: string) => {
    try {
      setLoading(true);

      // Verificar cache primeiro
      const cachedCharacter = intelligentCache.getItem(
        "characterDetails",
        nome,
      );
      if (
        cachedCharacter &&
        typeof cachedCharacter === "object" &&
        cachedCharacter !== null
      ) {
        setSelectedCharacter(cachedCharacter as CharacterDetails);
        setIsModalOpen(true);
        setLoading(false);
        return;
      }

      // Buscar da API
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

        // Salvar no cache
        intelligentCache.setItem("characterDetails", nome, characterDetails);

        setSelectedCharacter(characterDetails);
        setIsModalOpen(true);
      }
    } catch (erro) {
      console.error("Erro ao buscar detalhes do personagem:", erro);
    } finally {
      setLoading(false);
    }
  };

  const membrosFiltrados = membros.filter((membro) => {
    const nomeMatch = membro.name
      .toLowerCase()
      .includes(filtroNome.toLowerCase());
    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "online" && membro.status === "online") ||
      (statusFilter === "offline" && membro.status === "offline");

    return nomeMatch && statusMatch;
  });

  const indiceUltimoMembro = paginaAtual * membrosPorPagina;
  const indicePrimeiroMembro = indiceUltimoMembro - membrosPorPagina;
  const membrosDaPagina = membrosFiltrados.slice(
    indicePrimeiroMembro,
    indiceUltimoMembro,
  );

  const totalPaginas = Math.ceil(membrosFiltrados.length / membrosPorPagina);

  // Sempre volta para a página 1 ao digitar no filtro ou mudar status
  React.useEffect(() => {
    setPaginaAtual(1);
  }, [filtroNome, statusFilter]);

  // Scroll para o topo ao trocar de página
  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [paginaAtual]);

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
        <div className={style.headerContent}>
          <div className={style.headerText}>
            <h1 className={style.title}>Ranking da Guilda</h1>
            <p className={style.subtitle}>Lista de membros da guilda</p>
          </div>
          <button
            className={style.refreshButton}
            onClick={handleRefresh}
            disabled={refreshing || loading}
          >
            <RefreshIcon size={20} />
            <span>
              {refreshing
                ? "Atualizando..."
                : loading
                ? "Carregando..."
                : "Atualizar"}
            </span>
          </button>
        </div>
      </div>

      <div className={style.filtroContainer}>
        <div className={style.filtroWrapper}>
          <input
            type="text"
            placeholder="Filtrar por nome..."
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
            className={style.inputFiltro}
          />

          <div className={style.statusFilters}>
            <button
              className={`${style.statusFilter} ${
                statusFilter === "all" ? style.statusFilterActive : ""
              }`}
              onClick={() => setStatusFilter("all")}
              data-mobile-text="Todos"
            >
              <span>Todos</span>
            </button>
            <button
              className={`${style.statusFilter} ${
                statusFilter === "online" ? style.statusFilterActive : ""
              }`}
              onClick={() => setStatusFilter("online")}
              data-mobile-text="Online"
            >
              <div
                className={style.statusDot}
                style={{ backgroundColor: "#4ade80" }}
              ></div>
              <span>Online</span>
            </button>
            <button
              className={`${style.statusFilter} ${
                statusFilter === "offline" ? style.statusFilterActive : ""
              }`}
              onClick={() => setStatusFilter("offline")}
              data-mobile-text="Offline"
            >
              <div
                className={style.statusDot}
                style={{ backgroundColor: "#6b7280" }}
              ></div>
              <span>Offline</span>
            </button>
          </div>
        </div>
      </div>

      {loading && membros.length === 0 ? (
        <Loading size="large" text="Carregando membros..." />
      ) : (
        <>
          <div className={style.resultsInfo}>
            <p className={style.resultsText}>
              Mostrando {membrosFiltrados.length} de {membros.length} membros
              {statusFilter !== "all" &&
                ` (${statusFilter === "online" ? "Online" : "Offline"})`}
            </p>
          </div>
          {refreshing ? (
            <div className={style.loadingContainer}>
              <Loading size="large" text="Atualizando membros..." />
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
                        <div className={style.memberRankContainer}>
                          <TrophyIcon size={14} />
                          <span className={style.memberRank}>
                            {membro.rank}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className={style.statusDot}
                      style={{
                        backgroundColor: getStatusColor(membro.status),
                      }}
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
        </>
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
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCharacter?.name || ""}
        size="medium"
      >
        {selectedCharacter && (
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
                  {new Date(selectedCharacter.last_login).toLocaleDateString()}
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
        )}
      </Modal>
    </div>
  );
};

export default Ranking;
