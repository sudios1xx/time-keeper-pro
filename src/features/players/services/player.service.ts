import { data } from "@/services/data";
import { playerService as legacyPlayerService, PlayerFilters, PlayerStats } from "@/services/playerService";
import type { Jogador } from "@/types";

// Query keys centralizados para React Query (evita strings soltas)
export const playerQueryKeys = {
  all: ["players"] as const,
  list: () => [...playerQueryKeys.all, "list"] as const,
};

// Serviço pronto para troca de backend (api/mocks) mantendo typings
export const playerService = {
  async list(): Promise<Jogador[]> {
    return data.getPlayers();
  },

  async saveAll(next: Jogador[]): Promise<void> {
    return data.setPlayers(next);
  },

  async create(player: Omit<Jogador, "id">) {
    return legacyPlayerService.createPlayer(player);
  },

  async update(id: string, partial: Partial<Jogador>) {
    return legacyPlayerService.updatePlayer(id, partial);
  },

  async remove(id: string) {
    return legacyPlayerService.deletePlayer(id);
  },

  // Helpers mantidos para compatibilidade de UI
  filter(list: Jogador[], filters: PlayerFilters) {
    // reutiliza lógica existente
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).__dvfoot_players_cache__ = list;
    return legacyPlayerService.getFilteredPlayers(filters);
  },

  stats(list: Jogador[]): PlayerStats {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).__dvfoot_players_cache__ = list;
    return legacyPlayerService.getPlayerStats();
  },

  availablePositions(list: Jogador[]): string[] {
    const positions = list.map((j) => j.posicao);
    return ["todos", ...Array.from(new Set(positions))];
  },
};

