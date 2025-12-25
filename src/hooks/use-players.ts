import { useState, useEffect, useCallback } from 'react';
import { Jogador } from '../types';
import { playerService, PlayerFilters, PlayerStats } from '../services/playerService';
import { logger } from '../utils/logger';
import { data } from '../services/data';

export const usePlayers = () => {
  const [players, setPlayers] = useState<Jogador[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Jogador[]>([]);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<PlayerFilters>({
    searchTerm: '',
    position: 'todos',
    sortBy: 'nome'
  });

  // Carregar jogadores iniciais
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setLoading(true);
        const allPlayers = await data.getPlayers();
        // cache sync para playerService/hook legado
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).__dvfoot_players_cache__ = allPlayers;
        const playerStats = playerService.getPlayerStats();
        
        setPlayers(allPlayers);
        setStats(playerStats);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar jogadores');
        logger.error('Erro ao carregar jogadores:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, []);

  // Filtrar jogadores quando filtros mudarem
  useEffect(() => {
    const filtered = playerService.getFilteredPlayers(filters);
    setFilteredPlayers(filtered);
  }, [filters, players]);

  // Atualizar filtros
  const updateFilters = useCallback((newFilters: Partial<PlayerFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Buscar jogador por ID
  const getPlayerById = useCallback((id: string): Jogador | undefined => {
    return playerService.getPlayerById(id);
  }, []);

  // Criar jogador
  const createPlayer = useCallback(async (playerData: Omit<Jogador, 'id'>): Promise<Jogador | null> => {
    try {
      setLoading(true);
      const newPlayer = await playerService.createPlayer(playerData);
      setPlayers(prev => [...prev, newPlayer]);
      
      // Atualizar estatísticas
      const newStats = playerService.getPlayerStats();
      setStats(newStats);
      
      return newPlayer;
    } catch (err) {
      setError('Erro ao criar jogador');
      logger.error('Erro ao criar jogador:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar jogador
  const updatePlayer = useCallback(async (id: string, playerData: Partial<Jogador>): Promise<boolean> => {
    try {
      setLoading(true);
      const updatedPlayer = await playerService.updatePlayer(id, playerData);
      
      if (updatedPlayer) {
        setPlayers(prev => 
          prev.map(player => 
            player.id === id ? updatedPlayer : player
          )
        );
        
        // Atualizar estatísticas
        const newStats = playerService.getPlayerStats();
        setStats(newStats);
        
        return true;
      }
      return false;
    } catch (err) {
      setError('Erro ao atualizar jogador');
      logger.error('Erro ao atualizar jogador:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Excluir jogador
  const deletePlayer = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      const success = await playerService.deletePlayer(id);
      
      if (success) {
        setPlayers(prev => prev.filter(player => player.id !== id));
        
        // Atualizar estatísticas
        const newStats = playerService.getPlayerStats();
        setStats(newStats);
        
        return true;
      }
      return false;
    } catch (err) {
      setError('Erro ao excluir jogador');
      logger.error('Erro ao excluir jogador:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obter posições disponíveis
  const getAvailablePositions = useCallback(() => {
    return playerService.getAvailablePositions();
  }, []);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estado
    players,
    filteredPlayers,
    stats,
    loading,
    error,
    filters,
    
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