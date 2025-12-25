import { useEffect, useState, useCallback, useMemo } from 'react';
import { Jogador } from "../types";
import { playerService as playerDataService, PlayerFilters, PlayerStats } from "@/services/playerService";
import { playerService } from "@/features/players/services/player.service";
import { logger } from "../utils/logger";
import { data } from "../services/data";

interface LoadingState {
  header: boolean;
  filters: boolean;
  stats: boolean;
  players: boolean;
}

export const usePlayersOptimized = () => {
  const [players, setPlayers] = useState<Jogador[]>([]);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    header: false,
    filters: false,
    stats: false,
    players: false
  });
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<PlayerFilters>({
    searchTerm: '',
    position: 'todos',
    sortBy: 'nome'
  });

  // Carregar dados do data source único (mock store por enquanto)
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingState(prev => ({ ...prev, players: true, stats: true }));
        const allPlayers = await data.getPlayers();
        // cache sync para playerService/hook legado
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).__dvfoot_players_cache__ = allPlayers;
        if (!active) return;
        setPlayers(allPlayers);
        setStats(playerDataService.getPlayerStats());
      } catch (err) {
        logger.error('Erro ao carregar jogadores:', err);
        if (active) setError('Erro ao carregar jogadores');
      } finally {
        if (active) setLoadingState(prev => ({ ...prev, players: false, stats: false }));
      }
    })();
    return () => { active = false; };
  }, []);

  // Filtrar jogadores quando filtros mudarem (otimizado)
  const filteredPlayersMemo = useMemo(() => {
    if (!players.length) return [];
    
    let filtered = [...players];

    // Filtrar por termo de busca
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(player =>
        player.nome.toLowerCase().includes(searchTerm) ||
        player.posicao.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrar por posição
    if (filters.position && filters.position !== 'todos') {
      filtered = filtered.filter(player => player.posicao === filters.position);
    }

    // Ordenar
    switch (filters.sortBy) {
      case 'nome':
        filtered.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'presenca':
        filtered.sort((a, b) => b.percentualPresenca - a.percentualPresenca);
        break;
      case 'idade':
        filtered.sort((a, b) => a.idade - b.idade);
        break;
    }

    return filtered;
  }, [players, filters]);

  // Atualizar filtros (debounced)
  const updateFilters = useCallback((newFilters: Partial<PlayerFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Buscar jogador por ID
  const getPlayerById = useCallback((id: string): Jogador | undefined => {
    return players.find(player => player.id === id);
  }, [players]);

  // Criar jogador
  const createPlayer = useCallback(async (playerData: Omit<Jogador, 'id'>): Promise<Jogador | null> => {
    try {
      setLoadingState(prev => ({ ...prev, players: true }));
      const newPlayer = await playerService.create(playerData);
      setPlayers(prev => [...prev, newPlayer]);
      
      // Atualizar estatísticas
      const newStats = playerDataService.getPlayerStats();
      setStats(newStats);
      
      return newPlayer;
    } catch (err) {
      setError('Erro ao criar jogador');
      logger.error('Erro ao criar jogador:', err);
      return null;
    } finally {
      setLoadingState(prev => ({ ...prev, players: false }));
    }
  }, []);

  // Atualizar jogador
  const updatePlayer = useCallback(async (id: string, playerData: Partial<Jogador>): Promise<boolean> => {
    try {
      setLoadingState(prev => ({ ...prev, players: true }));
      const updatedPlayer = await playerService.update(id, playerData);
      
      if (updatedPlayer) {
        setPlayers(prev => 
          prev.map(player => 
            player.id === id ? updatedPlayer : player
          )
        );
        
        // Atualizar estatísticas
        const newStats = playerDataService.getPlayerStats();
        setStats(newStats);
        
        return true;
      }
      return false;
    } catch (err) {
      setError('Erro ao atualizar jogador');
      logger.error('Erro ao atualizar jogador:', err);
      return false;
    } finally {
      setLoadingState(prev => ({ ...prev, players: false }));
    }
  }, []);

  // Excluir jogador
  const deletePlayer = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoadingState(prev => ({ ...prev, players: true }));
      const success = await playerService.remove(id);
      
      if (success) {
        setPlayers(prev => prev.filter(player => player.id !== id));
        
        // Atualizar estatísticas
        const newStats = playerDataService.getPlayerStats();
        setStats(newStats);
        
        return true;
      }
      return false;
    } catch (err) {
      setError('Erro ao excluir jogador');
      logger.error('Erro ao excluir jogador:', err);
      return false;
    } finally {
      setLoadingState(prev => ({ ...prev, players: false }));
    }
  }, []);

  // Obter posições disponíveis
  const getAvailablePositions = useCallback(() => {
    return playerService.availablePositions(players);
  }, [players]);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Estados de loading específicos
  const isLoading = loadingState.header || loadingState.filters || loadingState.stats || loadingState.players;
  const isHeaderLoading = loadingState.header;
  const isFiltersLoading = loadingState.filters;
  const isStatsLoading = loadingState.stats;
  const isPlayersLoading = loadingState.players;
  
  // Verificar se os dados estão prontos
  const isDataReady = !isLoading && stats !== null;

  return {
    // Estado
    players,
    filteredPlayers: filteredPlayersMemo,
    stats,
    loading: isLoading,
    error,
    filters,
    
    // Estados de loading específicos
    isHeaderLoading,
    isFiltersLoading,
    isStatsLoading,
    isPlayersLoading,
    isDataReady,
    
    // Ações
    updateFilters,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer,
    getAvailablePositions,
    clearError
  };
}; 