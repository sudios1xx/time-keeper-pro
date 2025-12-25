// Gestão completa de jogadores para administradores
import React, { useState, useEffect, useRef } from 'react';
import { Users, Plus, Trophy, Star, TrendUp, SoccerBall } from 'phosphor-react';
import { usePlayersOptimized } from '../../hooks/use-players-optimized';
import SearchFilters from '../common/SearchFilters';
import PlayerCard from '../common/PlayerCard';
import EmptyState from '../common/EmptyState';
import { Jogador } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { UserPlus } from 'phosphor-react';
import { Card, CardContent } from '../ui/card';
import { showToast, confirmAction } from '../../utils/toast-helpers';
import { logger } from '../../utils/logger';
import { validateRequired, validateName, validateCPF, validateAge, validatePhone, validateFileSize, validateFileType } from '../../utils/validation';
import EscalacaoModal from './components/EscalacaoModal';

const GestaoJogadores: React.FC = () => {
  const {
    filteredPlayers,
    stats,
    error,
    filters,
    updateFilters,
    deletePlayer,
    isDataReady
  } = usePlayersOptimized();

  const [isCriarJogadorOpen, setIsCriarJogadorOpen] = useState(false);
  const [isEscalacaoOpen, setIsEscalacaoOpen] = useState(false);
  const [novoJogador, setNovoJogador] = useState({
    nome: '',
    posicao: 'atacante',
    idade: '',
    telefone: '',
    cpf: '',
    imagem: null as File | null
  });
  
  // Ref para armazenar URL do objeto para cleanup
  const imageUrlRef = useRef<string | null>(null);
  
  // Cleanup do URL.createObjectURL quando componente desmontar ou imagem mudar
  useEffect(() => {
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
        imageUrlRef.current = null;
      }
    };
  }, []);
  
  // Cleanup quando imagem mudar
  useEffect(() => {
    if (novoJogador.imagem) {
      // Revogar URL anterior se existir
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
      // Criar novo URL
      imageUrlRef.current = URL.createObjectURL(novoJogador.imagem);
    } else {
      // Revogar se imagem foi removida
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
        imageUrlRef.current = null;
      }
    }
    
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
        imageUrlRef.current = null;
      }
    };
  }, [novoJogador.imagem]);

  const handleSearchChange = (value: string) => {
    updateFilters({ searchTerm: value });
  };

  const handlePositionChange = (value: string) => {
    updateFilters({ position: value });
  };

  const handleSortChange = (value: string) => {
    updateFilters({ sortBy: value as 'nome' | 'presenca' | 'idade' });
  };

  const handleEditPlayer = (jogador: Jogador) => {
    // Implementar edição
    logger.log('Editar jogador:', jogador);
    showToast.info(`Editando jogador: ${jogador.nome}`);
  };

  const handleDeletePlayer = async (jogador: Jogador) => {
    await confirmAction(
      `Tem certeza que deseja excluir ${jogador.nome}?`,
      async () => {
        await deletePlayer(jogador.id);
        showToast.success(`${jogador.nome} excluído com sucesso!`);
      }
    );
  };

  const handleNewPlayer = () => {
    setIsCriarJogadorOpen(true);
  };

  const handleSubmitNovoJogador = () => {
    // Validar campos obrigatórios
    if (!validateRequired(novoJogador.nome)) {
      showToast.error('Por favor, preencha o nome');
      return;
    }
    
    if (!validateName(novoJogador.nome)) {
      showToast.error('Nome deve ter entre 2 e 50 caracteres');
      return;
    }
    
    if (!validateRequired(novoJogador.cpf)) {
      showToast.error('Por favor, preencha o CPF');
      return;
    }
    
    if (!validateCPF(novoJogador.cpf)) {
      showToast.error('CPF inválido');
      return;
    }
    
    if (!validateRequired(novoJogador.idade)) {
      showToast.error('Por favor, preencha a idade');
      return;
    }
    
    const idadeNum = parseInt(novoJogador.idade, 10);
    if (isNaN(idadeNum) || !validateAge(idadeNum)) {
      showToast.error('Idade deve ser um número entre 16 e 50');
      return;
    }
    
    // Validar telefone se preenchido
    if (novoJogador.telefone && !validatePhone(novoJogador.telefone)) {
      showToast.error('Telefone inválido');
      return;
    }
    
    // Validar imagem se fornecida
    if (novoJogador.imagem) {
      if (!validateFileType(novoJogador.imagem)) {
        showToast.error('Tipo de arquivo inválido. Use apenas imagens (JPEG, PNG, WebP)');
        return;
      }
      
      if (!validateFileSize(novoJogador.imagem, 5)) {
        showToast.error('Imagem muito grande. Tamanho máximo: 5MB');
        return;
      }
    }

    // Criar novo jogador
    const jogadorId = crypto.randomUUID();
    // Usar URL já criado no useEffect ou URL padrão
    const fotoUrl = imageUrlRef.current || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face';
    
    const novoJogadorCompleto = {
      id: jogadorId,
      nome: novoJogador.nome.trim(),
      posicao: novoJogador.posicao as 'goleiro' | 'zagueiro' | 'lateral' | 'meio-campo' | 'atacante' | 'tecnico',
      idade: idadeNum,
      telefone: novoJogador.telefone.trim() || undefined,
      cpf: novoJogador.cpf.replace(/\D/g, ''),
      imagem: novoJogador.imagem,
      presenca: 0,
      jogos: 0,
      trofeus: 0,
      medalhas: 0,
      foto: fotoUrl
    };

    // Em uma aplicação real, isso seria uma chamada para API
    logger.log('Novo jogador criado:', novoJogadorCompleto);
    
    // Limpar formulário e fechar modal
    setNovoJogador({
      nome: '',
      posicao: 'atacante',
      idade: '',
      telefone: '',
      cpf: '',
      imagem: null
    });
    setIsCriarJogadorOpen(false);
    
    // Mostrar mensagem de sucesso
    showToast.success('Jogador adicionado com sucesso!');
  };

  const handleCancelarCriacao = () => {
    setNovoJogador({
      nome: '',
      posicao: 'atacante',
      idade: '',
      telefone: '',
      cpf: '',
      imagem: null
    });
    setIsCriarJogadorOpen(false);
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo
      if (!validateFileType(file)) {
        showToast.error('Tipo de arquivo inválido. Use apenas imagens (JPEG, PNG, WebP)');
        e.target.value = ''; // Limpar input
        return;
      }
      
      // Validar tamanho
      if (!validateFileSize(file, 5)) {
        showToast.error('Imagem muito grande. Tamanho máximo: 5MB');
        e.target.value = ''; // Limpar input
        return;
      }
      
      setNovoJogador({ ...novoJogador, imagem: file });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary">
        <div className="text-white text-center">
          <p className="text-red-200 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
          <div className="min-h-screen px-1 space-y-3 sm:space-y-6 animate-fade-in">
      {/* Header com estatísticas */}
      <div className="space-y-3 sm:space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1E293B]">
            Gestão do Elenco
          </h1>
          <p className="text-sm text-[#1E293B]/70">
            Gerencie jogadores e comissão técnica
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <Card className="bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl border border-gray-100/50 hover:border-gray-200 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-3 sm:p-4 relative overflow-hidden">
              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              <div className="flex items-center space-x-2 sm:space-x-3 relative z-10">
                <div className="p-1.5 sm:p-2 bg-[#4C1D95]/10 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#4C1D95] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-[#1E293B] group-hover:text-[#4C1D95] transition-colors duration-300">{stats?.totalJogadores || 0}</p>
                  <p className="text-xs text-[#1E293B]/70 group-hover:text-[#1E293B] transition-colors duration-300">Total</p>
                </div>
              </div>
              
              {/* Decoração de fundo */}
              <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <Users className="w-full h-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl border border-gray-100/50 hover:border-gray-200 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-3 sm:p-4 relative overflow-hidden">
              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              <div className="flex items-center space-x-2 sm:space-x-3 relative z-10">
                <div className="p-1.5 sm:p-2 bg-[#22C55E]/10 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <TrendUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#22C55E] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-[#1E293B] group-hover:text-[#22C55E] transition-colors duration-300">{stats?.presencaMedia || 0}%</p>
                  <p className="text-xs text-[#1E293B]/70 group-hover:text-[#1E293B] transition-colors duration-300">Presença Média</p>
                </div>
              </div>
              
              {/* Decoração de fundo */}
              <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <TrendUp className="w-full h-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl border border-gray-100/50 hover:border-gray-200 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-3 sm:p-4 relative overflow-hidden">
              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              <div className="flex items-center space-x-2 sm:space-x-3 relative z-10">
                <div className="p-1.5 sm:p-2 bg-[#F59E0B]/10 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-[#F59E0B] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-[#1E293B] group-hover:text-[#F59E0B] transition-colors duration-300">{stats?.totalTrofeus || 0}</p>
                  <p className="text-xs text-[#1E293B]/70 group-hover:text-[#1E293B] transition-colors duration-300">Troféus</p>
                </div>
              </div>
              
              {/* Decoração de fundo */}
              <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <Trophy className="w-full h-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl border border-gray-100/50 hover:border-gray-200 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-3 sm:p-4 relative overflow-hidden">
              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              <div className="flex items-center space-x-2 sm:space-x-3 relative z-10">
                <div className="p-1.5 sm:p-2 bg-[#3B82F6]/10 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#3B82F6] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-[#1E293B] group-hover:text-[#3B82F6] transition-colors duration-300">{stats?.totalMedalhas || 0}</p>
                  <p className="text-xs text-[#1E293B]/70 group-hover:text-[#1E293B] transition-colors duration-300">Medalhas</p>
                </div>
              </div>
              
              {/* Decoração de fundo */}
              <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <Star className="w-full h-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Escalação (botão separado) */}
      {isDataReady && (
        <div className="flex justify-center">
          <Button
            onClick={() => setIsEscalacaoOpen(true)}
            className="w-full max-w-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white shadow-lg hover:shadow-xl"
          >
            <SoccerBall className="w-4 h-4 mr-2" />
            <span className="text-sm">Montar Escalação</span>
          </Button>
        </div>
      )}

      {/* Filtros e Busca */}
      {isDataReady && (
        <div className="flex justify-center">
          <SearchFilters
            searchTerm={filters.searchTerm}
            onSearchChange={handleSearchChange}
            placeholder="Buscar jogadores..."
            filters={[
              {
                label: 'Posição',
                value: filters.position,
                options: [
                  { value: 'todos', label: 'Todas Posições' },
                  { value: 'goleiro', label: 'Goleiro' },
                  { value: 'zagueiro', label: 'Zagueiro' },
                  { value: 'lateral', label: 'Lateral' },
                  { value: 'meio-campo', label: 'Meio-campo' },
                  { value: 'atacante', label: 'Atacante' },
                  { value: 'tecnico', label: 'Técnico' }
                ],
                onChange: handlePositionChange
              }
            ]}
            sortOptions={{
              value: filters.sortBy,
              options: [
                { value: 'nome', label: 'Nome' },
                { value: 'presenca', label: 'Presença' },
                { value: 'idade', label: 'Idade' }
              ],
              onChange: handleSortChange
            }}
            extraActions={
              <Button
                onClick={handleNewPlayer}
                className="bg-gradient-to-r from-[#4C1D95] to-[#3B82F6] text-white shadow-lg hover:shadow-xl w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="text-sm">Novo Jogador</span>
              </Button>
            }
          />
        </div>
      )}

      {/* Lista de Jogadores */}
      <div>
        {!isDataReady ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando jogadores...</p>
            </div>
          </div>
        ) : filteredPlayers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
            {filteredPlayers.map((jogador, index) => (
              <div 
                key={jogador.id} 
                className="transition-smooth hover-lift w-full max-w-xl animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PlayerCard
                  jogador={jogador}
                  onEdit={handleEditPlayer}
                  onDelete={handleDeletePlayer}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            type="search"
            title="Nenhum jogador encontrado"
            description="Tente ajustar os filtros ou termos de busca"
            suggestions={[
              'Verifique se o termo de busca está correto',
              'Tente usar filtros diferentes',
              'Adicione novos jogadores ao elenco'
            ]}
            actionButton={{
              label: 'Adicionar Jogador',
              onClick: handleNewPlayer,
              icon: Plus
            }}
          />
        )}
      </div>

      {/* Modal para criar novo jogador */}
      <Dialog open={isCriarJogadorOpen} onOpenChange={setIsCriarJogadorOpen}>
        <DialogContent className="w-[95vw] max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl max-h-[90vh] rounded-xl bg-white border-0 shadow-2xl backdrop-blur-sm mx-auto my-auto">
          <div className="flex flex-col h-full max-h-[90vh]">
            <DialogHeader className="text-center pb-2 pt-3 sm:pt-4 md:pt-6 flex-shrink-0">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
                <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
              <DialogTitle className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">Adicionar Novo Jogador</DialogTitle>
              <DialogDescription className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm md:text-base px-1 sm:px-2 md:px-4">
                Preencha as informações para adicionar um novo jogador ao elenco
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto px-2 sm:px-3 md:px-4 lg:px-6 py-2 sm:py-3 md:py-4 pb-4">
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="nome" className="text-xs sm:text-sm font-semibold text-gray-700">
                      Nome Completo
                    </Label>
                    <Input
                      id="nome"
                      placeholder="Nome do jogador"
                      value={novoJogador.nome}
                      onChange={(e) => setNovoJogador({ ...novoJogador, nome: e.target.value })}
                      className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-100"
                    />
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="cpf" className="text-xs sm:text-sm font-semibold text-gray-700">
                      CPF
                    </Label>
                    <Input
                      id="cpf"
                      type="text"
                      placeholder="CPF do jogador"
                      value={novoJogador.cpf}
                      onChange={(e) => setNovoJogador({ ...novoJogador, cpf: e.target.value })}
                      className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-100"
                    />
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="imagem" className="text-xs sm:text-sm font-semibold text-gray-700">
                      Foto do Jogador
                    </Label>
                    <div className="space-y-2">
                      <Input
                        id="imagem"
                        type="file"
                        accept="image/*"
                        onChange={handleImagemChange}
                        className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-100 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                      />
                      {novoJogador.imagem && imageUrlRef.current && (
                        <div className="mt-2">
                          <img
                            src={imageUrlRef.current}
                            alt="Preview"
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="posicao" className="text-xs sm:text-sm font-semibold text-gray-700">
                      Posição
                    </Label>
                    <select
                      id="posicao"
                      value={novoJogador.posicao}
                      onChange={(e) => setNovoJogador({ ...novoJogador, posicao: e.target.value })}
                      className="w-full h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 sm:py-2 border border-gray-200 rounded-md focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-100"
                    >
                      <option value="goleiro">Goleiro</option>
                      <option value="zagueiro">Zagueiro</option>
                      <option value="lateral">Lateral</option>
                      <option value="meio-campo">Meio-campo</option>
                      <option value="atacante">Atacante</option>
                      <option value="tecnico">Técnico</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="idade" className="text-xs sm:text-sm font-semibold text-gray-700">
                      Idade
                    </Label>
                    <Input
                      id="idade"
                      type="number"
                      placeholder="Idade"
                      value={novoJogador.idade}
                      onChange={(e) => setNovoJogador({ ...novoJogador, idade: e.target.value })}
                      className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-100"
                    />
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="telefone" className="text-xs sm:text-sm font-semibold text-gray-700">
                      Telefone
                    </Label>
                    <Input
                      id="telefone"
                      placeholder="Telefone (opcional)"
                      value={novoJogador.telefone}
                      onChange={(e) => setNovoJogador({ ...novoJogador, telefone: e.target.value })}
                      className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-100"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-row gap-2 sm:gap-3 md:gap-4 pt-2 sm:pt-3 md:pt-4 lg:pt-6 mt-2 sm:mt-3 md:mt-4 lg:mt-6 border-t border-gray-100 px-2 sm:px-3 md:px-4 lg:px-6 pb-2 sm:pb-3 md:pb-4 lg:pb-6 flex-shrink-0">
              <Button 
                variant="outline" 
                onClick={handleCancelarCriacao}
                className="flex-1 h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-100"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmitNovoJogador}
                className="flex-1 h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-100"
              >
                <UserPlus className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-1 sm:mr-1 md:mr-2" />
                Adicionar Jogador
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Escalação */}
      <EscalacaoModal
        open={isEscalacaoOpen}
        onOpenChange={setIsEscalacaoOpen}
        jogadores={filteredPlayers}
      />
    </div>
  );
};

export default GestaoJogadores;