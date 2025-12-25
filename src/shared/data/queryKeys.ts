export const queryKeys = {
  players: {
    all: ["players"] as const,
    list: () => ["players", "list"] as const,
  },
  games: {
    all: ["games"] as const,
    list: (status?: string) => ["games", "list", status ?? "all"] as const,
  },
  events: {
    all: ["events"] as const,
    list: (tipo?: string) => ["events", "list", tipo ?? "all"] as const,
  },
};



