import type { Evento, Jogo, Jogador, Noticia, Usuario } from '../../types';
import { env } from '../../config/env';
import type { JogadorDTO, UsuarioDTO } from '../../types/api';
import { http } from '../api/http';
import { loadMockStore, saveMockStore } from './mock-store';

// --- Mappers (DTO <-> UI) ---
function mapUsuarioDTO(dto: UsuarioDTO): Usuario {
  return dto;
}

function mapJogadorDTO(dto: JogadorDTO): Jogador {
  return dto;
}

// --- Public data API (single data source) ---
export const data = {
  // Auth/users
  async findUserByEmail(email: string): Promise<Usuario | null> {
    if (env.DATA_SOURCE === 'api') {
      const dto = await http.get<UsuarioDTO>(`/users/by-email?email=${encodeURIComponent(email)}`);
      return mapUsuarioDTO(dto);
    }
    const store = loadMockStore();
    return store.usuarios.find((u) => u.email === email) || null;
  },

  // Players
  async getPlayers(): Promise<Jogador[]> {
    if (env.DATA_SOURCE === 'api') {
      const dtos = await http.get<JogadorDTO[]>('/players');
      return dtos.map(mapJogadorDTO);
    }
    const store = loadMockStore();
    return store.jogadores;
  },

  async setPlayers(next: Jogador[]): Promise<void> {
    if (env.DATA_SOURCE === 'api') return;
    const store = loadMockStore();
    saveMockStore({ ...store, jogadores: next });
  },

  // Games
  async getGames(): Promise<Jogo[]> {
    if (env.DATA_SOURCE === 'api') {
      return http.get<Jogo[]>('/games');
    }
    const store = loadMockStore();
    return store.jogos;
  },

  async setGames(next: Jogo[]): Promise<void> {
    if (env.DATA_SOURCE === 'api') return;
    const store = loadMockStore();
    saveMockStore({ ...store, jogos: next });
  },

  // Events
  async getEvents(): Promise<Evento[]> {
    if (env.DATA_SOURCE === 'api') {
      return http.get<Evento[]>('/events');
    }
    const store = loadMockStore();
    return store.eventos;
  },

  async setEvents(next: Evento[]): Promise<void> {
    if (env.DATA_SOURCE === 'api') return;
    const store = loadMockStore();
    saveMockStore({ ...store, eventos: next });
  },

  // News (kept for future; page will be removed from UI)
  async getNews(): Promise<Noticia[]> {
    if (env.DATA_SOURCE === 'api') {
      return http.get<Noticia[]>('/news');
    }
    const store = loadMockStore();
    return store.noticias;
  },
};


