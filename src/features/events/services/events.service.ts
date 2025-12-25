import { data } from "@/services/data";
import type { Evento } from "@/types";

export const eventQueryKeys = {
  all: ["events"] as const,
  list: (tipo?: string) => [...eventQueryKeys.all, "list", tipo ?? "all"] as const,
};

export const eventsService = {
  async list(): Promise<Evento[]> {
    return data.getEvents();
  },

  async saveAll(next: Evento[]) {
    return data.setEvents(next);
  },
};



