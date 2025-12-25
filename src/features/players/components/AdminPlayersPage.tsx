// Gestão completa de jogadores para administradores (feature-level)
import React, { useState, useEffect, useRef } from 'react';
import { Users, Plus, Trophy, Star, TrendUp, SoccerBall, UserPlus } from 'phosphor-react';
import { usePlayersOptimized } from '@/hooks/use-players-optimized';
import SearchFilters from '@/components/common/SearchFilters';
import PlayerCard from '@/components/common/PlayerCard';
import EmptyState from '@/components/common/EmptyState';
import { Jogador } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { showToast, confirmAction } from '@/utils/toast-helpers';
import { logger } from '@/utils/logger';
import {
  validateRequired,
  validateName,
  validateCPF,
  validateAge,
  validatePhone,
  validateFileSize,
  validateFileType,
} from '@/utils/validation';
import EscalacaoModal from '@/components/admin/components/EscalacaoModal';

const GestaoJogadores: React.FC = () => {
  const { filteredPlayers, stats, error, filters, updateFilters, deletePlayer, isDataReady } =
    usePlayersOptimized();

  const [isCriarJogadorOpen, setIsCriarJogadorOpen] = useState(false);
  const [isEscalacaoOpen, setIsEscalacaoOpen] = useState(false);
  const [novoJogador, setNovoJogador] = useState({
    nome: '',
    posicao: 'atacante',
    idade: '',
    telefone: '',
    cpf: '',
    imagem: null as File | null,
  });

  const imageUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
        imageUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (novoJogador.imagem) {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current);
      }
      imageUrlRef.current = URL.createObjectURL(novoJogador.imagem);
    } else if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current);
      imageUrlRef.current = null;
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
    logger.log('Editar jogador:', jogador);
    showToast.info(`Editando jogador: ${jogador.nome}`);
  };

  const handleDeletePlayer = async (jogador: Jogador) => {
    await confirmAction(`Tem certeza que deseja excluir ${jogador.nome}?`, async () => {
      await deletePlayer(jogador.id);
      showToast.success(`${jogador.nome} excluído com sucesso!`);
    });
  };

  const handleNewPlayer = () => {
    setIsCriarJogadorOpen(true);
  };

  const handleSubmitNovoJogador = () => {
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
    if (Number.isNaN(idadeNum) || !validateAge(idadeNum)) {
      showToast.error('Idade deve ser um número entre 16 e 50');
      return;
    }

    if (novoJogador.telefone && !validatePhone(novoJogador.telefone)) {
      showToast.error('Telefone inválido');
      return;
    }

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

    const jogadorId = crypto.randomUUID();
    const fotoUrl =
      imageUrlRef.current ||
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face';

    const novoJogadorCompleto = {
      id: jogadorId,
      nome: novoJogador.nome.trim(),
      posicao: novoJogador.posicao as
        | 'goleiro'
        | 'zagueiro'
        | 'lateral'
        | 'meio-campo'
        | 'atacante'
        | 'tecnico',
      idade: idadeNum,
      telefone: novoJogador.telefone.trim() || undefined,
      cpf: novoJogador.cpf.replace(/\D/g, ''),
      imagem: novoJogador.imagem,
      presenca: 0,
      jogos: 0,
      trofeus: 0,
      medalhas: 0,
      foto: fotoUrl,
    };

    logger.log('Novo jogador criado:', novoJogadorCompleto);

    setNovoJogador({
      nome: '',
      posicao: 'atacante',
      idade: '',
      telefone: '',
      cpf: '',
      imagem: null,
    });
    setIsCriarJogadorOpen(false);

    showToast.success('Jogador adicionado com sucesso!');
  };

  const handleCancelarCriacao = () => {
    setNovoJogador({
      nome: '',
      posicao: 'atacante',
      idade: '',
      telefone: '',
      cpf: '',
      imagem: null,
    });
    setIsCriarJogadorOpen(false);
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!validateFileType(file)) {
        showToast.error('Tipo de arquivo inválido. Use apenas imagens (JPEG, PNG, WebP)');
        e.target.value = '';
        return;
      }

      if (!validateFileSize(file, 5)) {
        showToast.error('Imagem muito grande. Tamanho máximo: 5MB');
        e.target.value = '';
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
      <div className="space-y-3 sm:space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1E293B]">Gestão do Elenco</h1>
          <p className="text-sm text-[#1E293B]/70">Gerencie jogadores e comissão técnica</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <Card className="bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl border border-gray-100/50 hover:border-gray-200 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-3 sm:p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              <div className="flex items-center space-x-2 sm:space-x-3 relative z-10">
                <div className="p-1.5 sm:p-2 bg-[#4C1D95]/10 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#4C1D95] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-[#1E293B] group-hover:text-[#4C1D95] transition-colors duration-300">
                    {stats?.totalJogadores || 0}
                  </p>
                  <p className="text-xs text-[#1E293B]/70 group-hover:text-[#1E293B] transition-colors duration-300">Total</p>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <Users className="w-full h-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl border border-gray-100/50 hover:border-gray-200 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-3 sm:p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              <div className="flex items-center space-x-2 sm:space-x-3 relative z-10">
                <div className="p-1.5 sm:p-2 bg-[#22C55E]/10 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <TrendUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#22C55E] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-[#1E293B] group-hover:text-[#22C55E] transition-colors duration-300">
                    {stats?.presencaMedia || 0}%
                  </p>
                  <p className="text-xs text-[#1E293B]/70 group-hover:text-[#1E293B] transition-colors duration-300">
                    Presença Média
                  </p>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <TrendUp className="w-full h-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl border border-gray-100/50 hover:border-gray-200 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-3 sm:p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              <div className="flex items-center space-x-2 sm:space-x-3 relative z-10">
                <div className="p-1.5 sm:p-2 bg-[#F59E0B]/10 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-[#F59E0B] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-[#1E293B] group-hover:text-[#F59E0B] transition-colors duration-300">
                    {stats?.totalTrofeus || 0}
                  </p>
                  <p className="text-xs text-[#1E293B]/70 group-hover:text-[#1E293B] transition-colors duration-300">Troféus</p>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <Trophy className="w-full h-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl border border-gray-100/50 hover:border-gray-200 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-3 sm:p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              <div className="flex items-center space-x-2 sm:space-x-3 relative z-10">
                <div className="p-1.5 sm:p-2 bg-[#3B82F6]/10 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#3B82F6] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-[#1E293B] group-hover:text-[#3B82F6] transition-colors duration-300">
                    {stats?.totalMedalhas || 0}
                  </p>
                  <p className="text-xs text-[#1E293B]/70 group-hover:text-[#1E293B] transition-colors duration-300">Medalhas</p>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <Star className="w-full h-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
                  { value: 'tecnico', label: 'Técnico' },
                ],
                onChange: handlePositionChange,
              },
            ]}
            sortOptions={{
              value: filters.sortBy,
              options: [
                { value: 'nome', label: 'Nome' },
                { value: 'presenca', label: 'Presença' },
                { value: 'idade', label: 'Idade' },
              ],
              onChange: handleSortChange,
            }}
          />
        </div>
      )}

      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-6xl w-full">
          {filteredPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              jogador={player}
              onEdit={() => handleEditPlayer(player)}
              onDelete={() => handleDeletePlayer(player)}
            />
          ))}
        </div>
      </div>

      {isDataReady && filteredPlayers.length === 0 && (
        <EmptyState
          type="search"
          title="Nenhum jogador encontrado"
          description="Tente ajustar os filtros ou adicionar um novo jogador ao elenco."
          actionButton={{ label: 'Adicionar Jogador', onClick: handleNewPlayer, icon: UserPlus }}
        />
      )}

      <div className="fixed bottom-20 right-4 z-40">
        <Button
          size="lg"
          className="rounded-full shadow-xl bg-gradient-to-r from-[#4C1D95] to-[#3B82F6] text-white hover:shadow-2xl"
          onClick={handleNewPlayer}
        >
          <Plus className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Novo Jogador</span>
        </Button>
      </div>

      <Dialog open={isCriarJogadorOpen} onOpenChange={setIsCriarJogadorOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Jogador</DialogTitle>
            <DialogDescription>Preencha as informações do novo jogador para adicioná-lo ao elenco.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                value={novoJogador.nome}
                onChange={(e) => setNovoJogador({ ...novoJogador, nome: e.target.value })}
                placeholder="Ex: João Silva"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="posicao">Posição</Label>
              <select
                id="posicao"
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={novoJogador.posicao}
                onChange={(e) => setNovoJogador({ ...novoJogador, posicao: e.target.value })}
              >
                <option value="goleiro">Goleiro</option>
                <option value="zagueiro">Zagueiro</option>
                <option value="lateral">Lateral</option>
                <option value="meio-campo">Meio-campo</option>
                <option value="atacante">Atacante</option>
                <option value="tecnico">Técnico</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="idade">Idade</Label>
                <Input
                  id="idade"
                  type="number"
                  value={novoJogador.idade}
                  onChange={(e) => setNovoJogador({ ...novoJogador, idade: e.target.value })}
                  placeholder="Ex: 25"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={novoJogador.telefone}
                  onChange={(e) => setNovoJogador({ ...novoJogador, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={novoJogador.cpf}
                onChange={(e) => setNovoJogador({ ...novoJogador, cpf: e.target.value })}
                placeholder="000.000.000-00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imagem">Foto (opcional)</Label>
              <Input id="imagem" type="file" accept="image/*" onChange={handleImagemChange} />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleCancelarCriacao}>
                Cancelar
              </Button>
              <Button onClick={handleSubmitNovoJogador}>Salvar Jogador</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <EscalacaoModal open={isEscalacaoOpen} onOpenChange={setIsEscalacaoOpen} jogadores={filteredPlayers} />
    </div>
  );
};

export default GestaoJogadores;
