import { TIBIA_API_URL } from "./config";

// Interfaces para tipagem da API do Tibia v4
interface TibiaCharacter {
  name: string;
  sex: string;
  vocation: string;
  level: number;
  achievement_points: number;
  world: string;
  residence: string;
  houses: Array<{
    houseid: number;
    name: string;
    paid: string;
    town: string;
  }>;
  guild: {
    name: string;
    rank: string;
  } | null;
  last_login: string;
  account_status: string;
  comment: string;
  position: string;
  title: string;
  traded: boolean;
  unlocked_titles: number;
  married_to: string;
  deletion_date: string;
  former_names: string[];
  former_worlds: string[];
}

interface TibiaApiResponse {
  character: {
    character: TibiaCharacter;
  };
  information: {
    api: {
      commit: string;
      release: string;
      version: number;
    };
    status: {
      http_code: number;
    };
    tibia_urls: string[];
    timestamp: string;
  };
}

interface ApiRequest {
  url: string;
  options: {
    method: string;
    headers: {
      "Content-Type"?: string;
    };
  };
}

// Função para buscar dados de um personagem no Tibia
export function TIBIA_GET_CHARACTER(characterName: string): ApiRequest {
  return {
    url: `${TIBIA_API_URL}/character/${characterName}`,
    options: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  };
}

// Função para verificar se o personagem está na guilda "New Coorporative"
export async function verifyGuildMembership(characterName: string): Promise<{
  success: boolean;
  isInGuild: boolean;
  character?: TibiaCharacter;
  error?: string;
}> {
  try {
    const request = TIBIA_GET_CHARACTER(characterName);
    const response = await fetch(request.url, request.options);

    if (!response.ok) {
      return {
        success: false,
        isInGuild: false,
        error: `Erro ao buscar personagem: ${response.status}`,
      };
    }

    const data: TibiaApiResponse = await response.json();

    // Verificar se há erro na resposta da API
    if (data.information.status.http_code !== 200) {
      return {
        success: false,
        isInGuild: false,
        error: `Erro da API: HTTP ${data.information.status.http_code}`,
      };
    }

    // Verificar se o personagem existe
    if (!data.character || !data.character.character) {
      return {
        success: false,
        isInGuild: false,
        error: "Personagem não encontrado",
      };
    }

    const character = data.character.character;
    const isInGuild = character.guild?.name === "New Coorporative";

    return {
      success: true,
      isInGuild,
      character,
    };
  } catch (error) {
    return {
      success: false,
      isInGuild: false,
      error: `Erro na requisição: ${error}`,
    };
  }
}

// Função para verificar se o token está no comentário do personagem
export async function verifyTokenInComment(
  characterName: string,
  token: string,
): Promise<{
  success: boolean;
  tokenMatches: boolean;
  error?: string;
}> {
  try {
    const request = TIBIA_GET_CHARACTER(characterName);
    const response = await fetch(request.url, request.options);

    if (!response.ok) {
      return {
        success: false,
        tokenMatches: false,
        error: `Erro ao buscar personagem: ${response.status}`,
      };
    }

    const data: TibiaApiResponse = await response.json();

    // Verificar se há erro na resposta da API
    if (data.information.status.http_code !== 200) {
      return {
        success: false,
        tokenMatches: false,
        error: `Erro da API: HTTP ${data.information.status.http_code}`,
      };
    }

    // Verificar se o personagem existe
    if (!data.character || !data.character.character) {
      return {
        success: false,
        tokenMatches: false,
        error: "Personagem não encontrado",
      };
    }

    const character = data.character.character;

    // Limpar espaços e converter para maiúsculo para comparação
    const cleanToken = token.trim().toUpperCase();
    const cleanComment = character.comment.trim().toUpperCase();

    const tokenMatches = cleanComment.includes(cleanToken);

    return {
      success: true,
      tokenMatches,
    };
  } catch (error) {
    return {
      success: false,
      tokenMatches: false,
      error: `Erro na requisição: ${error}`,
    };
  }
}

// Função para verificar personagem e obter rank atual
export async function verifyCharacterAndGetRank(
  characterName: string,
): Promise<{
  success: boolean;
  isInGuild: boolean;
  currentRank?: string;
  character?: TibiaCharacter;
  error?: string;
}> {
  try {
    const request = TIBIA_GET_CHARACTER(characterName);
    const response = await fetch(request.url, request.options);

    if (!response.ok) {
      return {
        success: false,
        isInGuild: false,
        error: `Erro ao buscar personagem: ${response.status}`,
      };
    }

    const data: TibiaApiResponse = await response.json();

    // Verificar se há erro na resposta da API
    if (data.information.status.http_code !== 200) {
      return {
        success: false,
        isInGuild: false,
        error: `Erro da API: HTTP ${data.information.status.http_code}`,
      };
    }

    // Verificar se o personagem existe
    if (!data.character || !data.character.character) {
      return {
        success: false,
        isInGuild: false,
        error: "Personagem não encontrado",
      };
    }

    const character = data.character.character;
    const isInGuild = character.guild?.name === "New Coorporative";
    const currentRank = character.guild?.rank || "";

    return {
      success: true,
      isInGuild,
      currentRank,
      character,
    };
  } catch (error) {
    return {
      success: false,
      isInGuild: false,
      error: `Erro na requisição: ${error}`,
    };
  }
}

// Função para gerar token aleatório no formato GUILD-XXXXXX
export function generateGuildToken(): string {
  const randomNumber = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return `GUILD-${randomNumber}`;
}
