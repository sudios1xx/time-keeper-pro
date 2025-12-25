import type { Evento, Jogo, Jogador, Noticia, Usuario } from '../../types';
import { storage } from '../../utils/helpers';
import { eventos as mockEventos, jogos as mockJogos, jogadores as mockJogadores, noticias as mockNoticias, usuarios as mockUsuarios } from '../../data/mockData';

type StoreShape = {
  usuarios: Usuario[];
  jogadores: Jogador[];
  jogos: Jogo[];
  eventos: Evento[];
  noticias: Noticia[];
};

const STORAGE_KEY = 'dvfoot_mock_store_v1';

function getDefaultStore(): StoreShape {
  return {
    usuarios: mockUsuarios,
    jogadores: mockJogadores,
    jogos: mockJogos,
    eventos: mockEventos,
    noticias: mockNoticias,
  };
}

export function loadMockStore(): StoreShape {
  const stored = storage.get<StoreShape | null>(STORAGE_KEY, null);
  return stored || getDefaultStore();
}

export function saveMockStore(next: StoreShape) {
  storage.set(STORAGE_KEY, next);
}

export function resetMockStore() {
  storage.remove(STORAGE_KEY);
}


