import { useState, useEffect } from "react";
import intelligentCache from "../utils/IntelligentCache";

interface Membro {
  name: string;
  title?: string;
  rank: string;
  vocation: string;
  level: number;
  joined?: string;
  status: string;
}

interface GuildData {
  members: Membro[];
  players_online: number;
  players_offline: number;
}

export const useGuildMembers = () => {
  const [guildData, setGuildData] = useState<GuildData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchGuildData = async () => {
    try {
      setLoading(true);

      // Verificar cache primeiro
      const cachedData = intelligentCache.getItem("guild", "members");
      if (cachedData && typeof cachedData === "object" && cachedData !== null) {
        setGuildData(cachedData as GuildData);
        setLoading(false);
        return;
      }

      // Buscar da API
      const response = await fetch(
        "https://api.tibiadata.com/v4/guild/New Coorporative",
      );
      const data = await response.json();

      if (data.guild) {
        const guildInfo: GuildData = {
          members: data.guild.members || [],
          players_online: data.guild.players_online || 0,
          players_offline: data.guild.players_offline || 0,
        };

        // Salvar no cache (TTL de 5 minutos para dados de online)
        intelligentCache.setItem("guild", "members", guildInfo);

        setGuildData(guildInfo);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da guilda:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuildData();

    // Atualizar a cada 2 minutos
    const interval = setInterval(fetchGuildData, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    guildData,
    loading,
    refetch: fetchGuildData,
  };
};
