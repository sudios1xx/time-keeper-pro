import { data } from "@/services/data";
import type { Jogo } from "@/types";

export const gameQueryKeys = {
  all: ["games"] as const,
  list: (status?: string) => [...gameQueryKeys.all, "list", status ?? "all"] as const,
};

export const gamesService = {
  async list(): Promise<Jogo[]> {
    return data.getGames();
  },

  async saveAll(next: Jogo[]) {
    return data.setGames(next);
  },
};



