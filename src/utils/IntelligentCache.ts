// ===== CACHE INTELIGENTE UNIFICADO =====
// Sistema de cache para otimizar requisições e melhorar performance

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  invalidations: number;
  errors: number;
  lastCleanup: number;
}

interface CacheItem {
  value: unknown;
  timestamp: number;
  ttl: number;
  dataType: string;
  identifier: string;
  context: Record<string, unknown>;
  accessCount: number;
  lastAccess: number;
}

class IntelligentCache {
  private maxCacheSize: number;
  private defaultTTL: number;
  private cacheStats: CacheStats;

  constructor() {
    this.maxCacheSize = 50;
    this.defaultTTL = 24 * 60 * 60 * 1000; // 24 horas
    this.cacheStats = {
      hits: 0,
      misses: 0,
      sets: 0,
      invalidations: 0,
      errors: 0,
      lastCleanup: Date.now(),
    };

    // Inicializar limpeza automática
    this.initAutoCleanup();
  }

  // ===== CONFIGURAÇÕES DE TTL POR TIPO =====
  getTTLForType(dataType: string): number {
    const ttlConfig: Record<string, number> = {
      // Dados da guilda - cache mais longo
      guild: 5 * 60 * 1000, // 5 minutos (para dados de online)
      guildMembers: 15 * 60 * 1000, // 15 minutos

      // Dados de personagem - cache médio
      character: 10 * 60 * 1000, // 10 minutos
      characterDetails: 5 * 60 * 1000, // 5 minutos

      // Dados do usuário - cache curto
      user: 5 * 60 * 1000, // 5 minutos
      userProfile: 2 * 60 * 1000, // 2 minutos

      // Dados estáticos - cache longo
      static: 7 * 24 * 60 * 60 * 1000, // 7 dias
      config: 24 * 60 * 60 * 1000, // 24 horas

      // Default
      default: 24 * 60 * 60 * 1000, // 24 horas
    };

    return ttlConfig[dataType] || this.defaultTTL;
  }

  // ===== GERAÇÃO DE CHAVES =====
  generateKey(
    dataType: string,
    identifier: string = "",
    context: Record<string, unknown> = {},
  ): string {
    // Chave simples para compatibilidade
    if (!dataType || dataType === "default") {
      return identifier || "default_key";
    }

    // Chave estruturada para cache inteligente
    const contextStr =
      Object.keys(context).length > 0 ? "_" + JSON.stringify(context) : "";
    return `guild_cache_${dataType}_${identifier}${contextStr}`;
  }

  // ===== API PRINCIPAL =====
  setItem(
    dataType: string,
    identifier: string,
    value: unknown,
    context: Record<string, unknown> = {},
  ): void {
    try {
      const key = this.generateKey(dataType, identifier, context);
      const ttl = this.getTTLForType(dataType);

      const cacheItem = {
        value,
        timestamp: Date.now(),
        ttl,
        dataType,
        identifier,
        context,
        accessCount: 0,
        lastAccess: Date.now(),
      };

      sessionStorage.setItem(key, JSON.stringify(cacheItem));
      this.cacheStats.sets++;
      this.cleanupCache();
    } catch (error) {
      console.warn("Erro ao salvar no cache:", error);
      this.cacheStats.errors++;
      this.clearExpiredCache();

      // Tentar novamente após limpeza
      try {
        const key = this.generateKey(dataType, identifier, context);
        const ttl = this.getTTLForType(dataType);

        const cacheItem = {
          value,
          timestamp: Date.now(),
          ttl,
          dataType,
          identifier,
          context,
          accessCount: 0,
          lastAccess: Date.now(),
        };

        sessionStorage.setItem(key, JSON.stringify(cacheItem));
        this.cacheStats.sets++;
      } catch (retryError) {
        console.error("Falha ao salvar no cache após limpeza:", retryError);
        this.cacheStats.errors++;
      }
    }
  }

  getItem(
    dataType: string,
    identifier: string = "",
    context: Record<string, unknown> = {},
  ): unknown | null {
    try {
      const key = this.generateKey(dataType, identifier, context);
      const cached = sessionStorage.getItem(key);

      if (!cached) {
        this.cacheStats.misses++;
        return null;
      }

      const cacheItem = JSON.parse(cached);
      const now = Date.now();

      // Verificar se o cache expirou
      if (now - cacheItem.timestamp > cacheItem.ttl) {
        sessionStorage.removeItem(key);
        this.cacheStats.misses++;
        return null;
      }

      // Atualizar estatísticas de acesso
      cacheItem.accessCount++;
      cacheItem.lastAccess = now;
      sessionStorage.setItem(key, JSON.stringify(cacheItem));

      this.cacheStats.hits++;
      return cacheItem.value;
    } catch (error) {
      console.warn("Erro ao ler cache:", error);
      this.cacheStats.errors++;
      this.cacheStats.misses++;
      return null;
    }
  }

  removeItem(dataType: string, identifier: string = ""): void {
    try {
      const key = this.generateKey(dataType, identifier);
      sessionStorage.removeItem(key);
      this.cacheStats.invalidations++;
    } catch (error) {
      console.warn("Erro ao remover do cache:", error);
      this.cacheStats.errors++;
    }
  }

  // ===== MÉTODOS DE LIMPEZA =====
  clearCacheByType(dataType: string): void {
    try {
      const keys = Object.keys(sessionStorage);
      const guildCacheKeys = keys.filter((key) =>
        key.startsWith("guild_cache_"),
      );
      const typeKeys = guildCacheKeys.filter((key) =>
        key.includes(`guild_cache_${dataType}`),
      );

      console.log(`Limpando cache do tipo: ${dataType}`);
      console.log(`Chaves encontradas:`, typeKeys);

      typeKeys.forEach((key) => {
        sessionStorage.removeItem(key);
        this.cacheStats.invalidations++;
      });

      console.log(`Cache limpo: ${typeKeys.length} itens removidos`);
    } catch (error) {
      console.warn("Erro ao limpar cache por tipo:", error);
      this.cacheStats.errors++;
    }
  }

  clearExpiredCache(): void {
    try {
      const keys = Object.keys(sessionStorage);
      const now = Date.now();
      let cleaned = 0;

      keys.forEach((key) => {
        try {
          const cached = sessionStorage.getItem(key);
          if (cached) {
            const cacheItem = JSON.parse(cached);
            if (
              now - cacheItem.timestamp >
              (cacheItem.ttl || this.defaultTTL)
            ) {
              sessionStorage.removeItem(key);
              cleaned++;
            }
          }
        } catch (error) {
          // Se não conseguir parsear, remover o item
          sessionStorage.removeItem(key);
          cleaned++;
        }
      });

      this.cacheStats.invalidations += cleaned;
      this.cacheStats.lastCleanup = Date.now();
    } catch (error) {
      console.warn("Erro ao limpar cache expirado:", error);
      this.cacheStats.errors++;
    }
  }

  clearAllCache(): void {
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach((key) => {
        if (key.startsWith("guild_cache_")) {
          sessionStorage.removeItem(key);
        }
      });
      this.cacheStats.invalidations += keys.length;
      console.log("Cache limpo completamente. Chaves removidas:", keys.length);
    } catch (error) {
      console.warn("Erro ao limpar todo o cache:", error);
      this.cacheStats.errors++;
    }
  }

  cleanupCache(): void {
    try {
      const keys = Object.keys(sessionStorage);
      const guildCacheKeys = keys.filter((key) =>
        key.startsWith("guild_cache_"),
      );

      if (guildCacheKeys.length <= this.maxCacheSize) return;

      // Ordenar por score (frequência de acesso + tempo)
      const cacheItems: Array<{
        key: string;
        accessCount: number;
        timestamp: number;
        lastAccess: number;
        score?: number;
      }> = [];

      guildCacheKeys.forEach((key) => {
        try {
          const cached = sessionStorage.getItem(key);
          if (cached) {
            const item = JSON.parse(cached);
            cacheItems.push({ key, ...item });
          }
        } catch (error) {
          // Item inválido, remover
          sessionStorage.removeItem(key);
        }
      });

      // Calcular score para cada item
      cacheItems.forEach((item) => {
        item.score = this.calculateCacheScore(item);
      });

      // Ordenar por score (menor primeiro)
      cacheItems.sort((a, b) => (a.score || 0) - (b.score || 0));

      // Remover itens com menor score até atingir o tamanho máximo
      const itemsToRemove = cacheItems.slice(
        0,
        cacheItems.length - this.maxCacheSize,
      );
      itemsToRemove.forEach((item) => {
        sessionStorage.removeItem(item.key);
        this.cacheStats.invalidations++;
      });
    } catch (error) {
      console.warn("Erro ao fazer cleanup do cache:", error);
      this.cacheStats.errors++;
    }
  }

  // ===== ESTATÍSTICAS =====
  getCacheStats(): {
    hits: number;
    misses: number;
    sets: number;
    invalidations: number;
    errors: number;
    lastCleanup: number;
    totalItems: number;
    totalSize: string;
    hitRate: string;
    types: Record<string, { count: number; size: string }>;
  } {
    try {
      const keys = Object.keys(sessionStorage);
      const cacheItems: Array<{ dataType: string; value: unknown }> = [];

      keys.forEach((key) => {
        if (key.startsWith("guild_cache_")) {
          try {
            const cached = sessionStorage.getItem(key);
            if (cached) {
              const item = JSON.parse(cached);
              cacheItems.push(item);
            }
          } catch (error) {
            // Ignorar itens inválidos
          }
        }
      });

      const totalSize = cacheItems.reduce((total, item) => {
        return total + JSON.stringify(item.value).length;
      }, 0);

      return {
        ...this.cacheStats,
        totalItems: cacheItems.length,
        totalSize: this.formatBytes(totalSize),
        hitRate:
          this.cacheStats.hits + this.cacheStats.misses > 0
            ? (
                (this.cacheStats.hits /
                  (this.cacheStats.hits + this.cacheStats.misses)) *
                100
              ).toFixed(2) + "%"
            : "0%",
        types: this.getTypeStats(cacheItems),
      };
    } catch (error) {
      console.warn("Erro ao obter estatísticas do cache:", error);
      return {
        ...this.cacheStats,
        totalItems: 0,
        totalSize: "0 Bytes",
        hitRate: "0%",
        types: {},
      };
    }
  }

  // ===== MÉTODOS AUXILIARES =====
  private calculateCacheScore(cacheItem: {
    accessCount: number;
    timestamp: number;
    lastAccess: number;
  }): number {
    const now = Date.now();
    const age = now - cacheItem.timestamp;
    const accessFrequency =
      cacheItem.accessCount / Math.max(age / (60 * 1000), 1); // acessos por minuto
    return age / (24 * 60 * 60 * 1000) - accessFrequency; // Quanto maior a idade e menor o acesso, menor o score
  }

  private getTypeStats(
    cacheItems: Array<{ dataType: string; value: unknown }>,
  ): Record<string, { count: number; size: string }> {
    const typeStats: Record<string, { count: number; size: number }> = {};

    cacheItems.forEach((item) => {
      const type = item.dataType || "default";
      if (!typeStats[type]) {
        typeStats[type] = { count: 0, size: 0 };
      }
      typeStats[type]!.count++;
      typeStats[type]!.size += JSON.stringify(item.value).length;
    });

    // Converter tamanhos para formato legível
    const result: Record<string, { count: number; size: string }> = {};
    Object.keys(typeStats).forEach((type) => {
      const stats = typeStats[type];
      if (stats) {
        result[type] = {
          count: stats.count,
          size: this.formatBytes(stats.size),
        };
      }
    });

    return result;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  private initAutoCleanup(): void {
    // Limpeza automática a cada 30 minutos
    setInterval(() => {
      this.clearExpiredCache();
    }, 30 * 60 * 1000);
  }
}

// ===== INSTÂNCIA SINGLETON =====
const intelligentCache = new IntelligentCache();

// ===== EXPORT =====
export default intelligentCache;
