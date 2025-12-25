import { Jogador } from '../types';
import { data } from './data';

export interface PlayerFilters {
  searchTerm: string;
  position: string;
  sortBy: 'nome' | 'presenca' | 'idade';
}

export interface PlayerStats {
  totalJogadores: number;
  presencaMedia: number;
  totalTrofeus: number;
  totalMedalhas: number;
}

class PlayerService {
  // Buscar todos os jogadores
  getAllPlayers(): Jogador[] {
    // Mantido síncrono para não quebrar hooks antigos:
    // a fonte real é services/data (mock store em memória/localStorage).
    // Se DATA_SOURCE=api, os hooks devem migrar para async.
    // Por ora, seguimos usando mock/localStorage.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (globalThis as any).__dvfoot_players_cache__ || [];
  }

  // Filtrar e ordenar jogadores
  getFilteredPlayers(filters: PlayerFilters): Jogador[] {
    const all = this.getAllPlayers();
    const filtered = all.filter(jogador => {
      const matchSearch = jogador.nome.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         jogador.posicao.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchPosition = filters.position === 'todos' || jogador.posicao.toLowerCase() === filters.position;
      return matchSearch && matchPosition;
    });

    // Ordenação
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'nome':
          return a.nome.localeCompare(b.nome);
        case 'presenca':
          return b.percentualPresenca - a.percentualPresenca;
        case 'idade':
          return b.idade - a.idade;
        default:
          return 0;
      }
    });

    return filtered;
  }

  // Buscar jogador por ID
  getPlayerById(id: string): Jogador | undefined {
    return this.getAllPlayers().find(jogador => jogador.id === id);
  }

  // Buscar jogadores por posição
  getPlayersByPosition(position: string): Jogador[] {
    return this.getAllPlayers().filter(jogador => 
      jogador.posicao.toLowerCase() === position.toLowerCase()
    );
  }

  // Obter estatísticas gerais
  getPlayerStats(): PlayerStats {
    const all = this.getAllPlayers();
    const totalJogadores = all.length || 1;
    const presencaMedia = Math.round(
      all.reduce((acc, j) => acc + j.percentualPresenca, 0) / totalJogadores
    );
    const totalTrofeus = all.reduce((acc, j) => acc + j.trofeus.length, 0);
    const totalMedalhas = all.reduce((acc, j) => acc + j.medalhas.length, 0);

    return {
      totalJogadores,
      presencaMedia,
      totalTrofeus,
      totalMedalhas
    };
  }

  // Obter posições disponíveis
  getAvailablePositions(): string[] {
    const positions = this.getAllPlayers().map(j => j.posicao);
    return ['todos', ...Array.from(new Set(positions))];
  }

  // Simular criação de jogador
  async createPlayer(playerData: Omit<Jogador, 'id'>): Promise<Jogador> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPlayer: Jogador = {
      id: crypto.randomUUID(),
      ...playerData
    };

    // Persistir no mock store (sem backend)
    const current = await data.getPlayers();
    const next = [...current, newPlayer];
    // cache sync para hooks antigos
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).__dvfoot_players_cache__ = next;
    await data.setPlayers(next);
    
    return newPlayer;
  }

  // Simular atualização de jogador
  async updatePlayer(id: string, playerData: Partial<Jogador>): Promise<Jogador | null> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const current = await data.getPlayers();
    const playerIndex = current.findIndex(j => j.id === id);
    if (playerIndex === -1) return null;

    const updatedPlayer = { ...current[playerIndex], ...playerData };
    const next = current.map((p) => (p.id === id ? updatedPlayer : p));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).__dvfoot_players_cache__ = next;
    await data.setPlayers(next);
    
    return updatedPlayer;
  }

  // Simular exclusão de jogador
  async deletePlayer(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const current = await data.getPlayers();
    const playerIndex = current.findIndex(j => j.id === id);
    if (playerIndex === -1) return false;

    const next = current.filter((p) => p.id !== id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).__dvfoot_players_cache__ = next;
    await data.setPlayers(next);
    return true;
  }
}

export const playerService = new PlayerService(); 