// Gestão completa de jogos para administradores (feature-level)
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Clock, Trophy, CheckCircle } from 'phosphor-react';
import EmptyState from '@/components/common/EmptyState';
import ModalFormLayout from '@/components/admin/components/ModalFormLayout';
import JogoForm, { JogoFormState } from '@/components/admin/components/JogoForm';
import JogoCard from '@/components/admin/components/JogoCard';
import { showToast, confirmAction } from '@/utils/toast-helpers';
import { logger } from '@/utils/logger';
import { Jogo } from '@/types';
import { validateRequired, validateName, validateFutureDate } from '@/utils/validation';
import { data } from '@/services/data';

const GestaoJogos: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('todos');
  const [isAgendarJogoOpen, setIsAgendarJogoOpen] = useState(false);
  const [isEditarJogoOpen, setIsEditarJogoOpen] = useState(false);
  const [jogoEmEdicao, setJogoEmEdicao] = useState<Jogo | null>(null);
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [novoJogo, setNovoJogo] = useState({
    adversario: '',
    data: '',
    horario: '',
    local: '',
  });

  const statusOptions = [
    { value: 'todos', label: 'Todos' },
    { value: 'agendado', label: 'Agendados' },
    { value: 'finalizado', label: 'Finalizados' },
  ];

  useEffect(() => {
    let active = true;
    (async () => {
      const all = await data.getGames();
      if (!active) return;
      setJogos(all);
    })();
    return () => {
      active = false;
    };
  }, []);

  const jogosFiltrados = useMemo(
    () => jogos.filter((jogo) => filterStatus === 'todos' || jogo.status === filterStatus),
    [jogos, filterStatus],
  );

  const estatisticas = useMemo(
    () => ({
      total: jogos.length,
      agendados: jogos.filter((j) => j.status === 'agendado').length,
      finalizados: jogos.filter((j) => j.status === 'finalizado').length,
      vitorias: jogos.filter(
        (j) => j.status === 'finalizado' && j.resultado && j.resultado.gols > j.resultado.golsAdversario,
      ).length,
    }),
    [jogos],
  );

  const handleAgendarJogo = () => {
    setIsAgendarJogoOpen(true);
  };

  const handleSubmitNovoJogo = () => {
    if (!validateRequired(novoJogo.adversario)) {
      showToast.error('Por favor, preencha o adversário');
      return;
    }

    if (!validateName(novoJogo.adversario)) {
      showToast.error('Nome do adversário deve ter entre 2 e 50 caracteres');
      return;
    }

    if (!validateRequired(novoJogo.data)) {
      showToast.error('Por favor, preencha a data');
      return;
    }

    if (!validateFutureDate(novoJogo.data)) {
      showToast.error('A data do jogo deve ser futura');
      return;
    }

    if (!validateRequired(novoJogo.horario)) {
      showToast.error('Por favor, preencha o horário');
      return;
    }

    if (!validateRequired(novoJogo.local)) {
      showToast.error('Por favor, preencha o local');
      return;
    }

    const jogoId = crypto.randomUUID();
    const novoJogoCompleto = {
      id: jogoId,
      adversario: novoJogo.adversario,
      data: novoJogo.data,
      horario: novoJogo.horario,
      local: novoJogo.local,
      status: 'agendado' as const,
      presencas: [],
    };

    logger.log('Novo jogo agendado:', novoJogoCompleto);
    const next = [novoJogoCompleto as Jogo, ...jogos];
    setJogos(next);
    void data.setGames(next);

    setNovoJogo({ adversario: '', data: '', horario: '', local: '' });
    setIsAgendarJogoOpen(false);
    showToast.success('Jogo agendado com sucesso!');
  };

  const handleCancelarAgendamento = () => {
    setNovoJogo({ adversario: '', data: '', horario: '', local: '' });
    setIsAgendarJogoOpen(false);
  };

  const handleEditarJogo = (jogo: Jogo) => {
    setJogoEmEdicao(jogo);
    setIsEditarJogoOpen(true);
  };

  const handleSalvarEdicaoJogo = () => {
    if (!jogoEmEdicao) return;

    if (!validateRequired(jogoEmEdicao.adversario)) {
      showToast.error('Por favor, preencha o adversário');
      return;
    }

    if (!validateName(jogoEmEdicao.adversario)) {
      showToast.error('Nome do adversário deve ter entre 2 e 50 caracteres');
      return;
    }

    if (!validateRequired(jogoEmEdicao.data)) {
      showToast.error('Por favor, preencha a data');
      return;
    }

    if (!validateFutureDate(jogoEmEdicao.data)) {
      showToast.error('A data do jogo deve ser futura');
      return;
    }

    if (!validateRequired(jogoEmEdicao.horario)) {
      showToast.error('Por favor, preencha o horário');
      return;
    }

    if (!validateRequired(jogoEmEdicao.local)) {
      showToast.error('Por favor, preencha o local');
      return;
    }

    logger.log('Jogo editado:', jogoEmEdicao);
    const next = jogos.map((j) => (j.id === jogoEmEdicao.id ? jogoEmEdicao : j));
    setJogos(next);
    void data.setGames(next);

    setIsEditarJogoOpen(false);
    setJogoEmEdicao(null);
    showToast.success('Jogo editado com sucesso!');
  };

  const handleCancelarEdicaoJogo = () => {
    setIsEditarJogoOpen(false);
    setJogoEmEdicao(null);
  };

  const handleExcluirJogo = async (jogo: Jogo) => {
    await confirmAction(`Tem certeza que deseja excluir o jogo vs ${jogo.adversario}?`, async () => {
      logger.log('Excluindo jogo:', jogo);
      const next = jogos.filter((j) => j.id !== jogo.id);
      setJogos(next);
      void data.setGames(next);
      showToast.success(`Jogo vs ${jogo.adversario} excluído com sucesso!`);
    });
  };

  const handleVerConfirmacoes = (jogo: Jogo) => {
    logger.log('Ver confirmações do jogo:', jogo);
    const confirmados = jogo.presencas.filter((p) => p.confirmou).length;
    const total = jogo.presencas.length;
    showToast.info(`Confirmações: ${confirmados}/${total} confirmados`);
  };

  const handleRegistrarJogo = (jogo: Jogo) => {
    logger.log('Registrar resultado do jogo:', jogo);
    showToast.info(`Registrando resultado do jogo vs ${jogo.adversario}`);
  };

  return (
    <div className="space-y-3 sm:space-y-6 animate-fade-in px-1">
      <div className="space-y-3 sm:space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1E293B]">Gestão de Jogos</h1>
          <p className="text-sm text-[#1E293B]/70">Agende jogos e registre resultados</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <Card className="bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl border border-gray-100/50 hover:border-gray-200 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-3 sm:p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <div className="flex items-center space-x-2 sm:space-x-3 relative z-10">
                <div className="p-1.5 sm:p-2 bg-[#4C1D95]/10 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#4C1D95] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-[#1E293B] group-hover:text-[#4C1D95] transition-colors duration-300">
                    {estatisticas.total}
                  </p>
                  <p className="text-xs text-[#1E293B]/70 group-hover:text-[#1E293B] transition-colors duration-300">
                    Total
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <Calendar className="w-full h-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl border border-gray-100/50 hover:border-gray-200 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-3 sm:p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <div className="flex items-center space-x-2 sm:space-x-3 relative z-10">
                <div className="p-1.5 sm:p-2 bg-[#3B82F6]/10 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#3B82F6] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-[#1E293B] group-hover:text-[#3B82F6] transition-colors duration-300">
                    {estatisticas.agendados}
                  </p>
                  <p className="text-xs text-[#1E293B]/70 group-hover:text-[#1E293B] transition-colors duration-300">
                    Próximos
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <Clock className="w-full h-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl border border-gray-100/50 hover:border-gray-200 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-3 sm:p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <div className="flex items-center space-x-2 sm:space-x-3 relative z-10">
                <div className="p-1.5 sm:p-2 bg-[#22C55E]/10 rounded-lg shadow-sm group-hover:shadow-md transition-all duration-300">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#22C55E] group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-[#1E293B] group-hover:text-[#22C55E] transition-colors duration-300">
                    {estatisticas.finalizados}
                  </p>
                  <p className="text-xs text-[#1E293B]/70 group-hover:text-[#1E293B] transition-colors duration-300">
                    Finalizados
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <CheckCircle className="w-full h-full" />
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
                    {estatisticas.vitorias}
                  </p>
                  <p className="text-xs text-[#1E293B]/70 group-hover:text-[#1E293B] transition-colors duration-300">
                    Vitórias
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                <Trophy className="w-full h-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-center">
        <Card className="bg-white shadow-card">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col gap-4 items-center">
              <div className="flex flex-wrap gap-2 justify-center">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={filterStatus === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus(option.value)}
                    className={`text-xs sm:text-sm ${filterStatus === option.value ? 'shadow-glow' : ''}`}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>

              <div className="w-full">
                <Button
                  className="bg-gradient-to-r from-[#4C1D95] to-[#3B82F6] text-white shadow-lg hover:shadow-xl w-full"
                  onClick={handleAgendarJogo}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="text-sm">Agendar Jogo</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl w-full">
          {jogosFiltrados.map((jogo, index) => (
            <JogoCard
              key={jogo.id}
              jogo={jogo}
              index={index}
              onEdit={handleEditarJogo}
              onDelete={handleExcluirJogo}
              onConfirmations={handleVerConfirmacoes}
              onRegister={handleRegistrarJogo}
            />
          ))}
        </div>
      </div>

      {jogosFiltrados.length === 0 && (
        <EmptyState
          type="search"
          title="Nenhum jogo encontrado"
          description={
            filterStatus === 'todos'
              ? 'Agende o primeiro jogo do time'
              : `Nenhum jogo com status "${filterStatus}" encontrado`
          }
          actionButton={{ label: 'Agendar Jogo', onClick: handleAgendarJogo, icon: Plus }}
        />
      )}

      <ModalFormLayout
        open={isAgendarJogoOpen}
        onOpenChange={setIsAgendarJogoOpen}
        icon={Calendar}
        title="Agendar Novo Jogo"
        description="Preencha as informações para agendar um novo jogo"
        onCancel={handleCancelarAgendamento}
        onConfirm={handleSubmitNovoJogo}
        confirmLabel="Agendar Jogo"
      >
        <JogoForm value={novoJogo as JogoFormState} onChange={(v) => setNovoJogo(v)} />
      </ModalFormLayout>

      <ModalFormLayout
        open={isEditarJogoOpen}
        onOpenChange={setIsEditarJogoOpen}
        icon={Trophy}
        title="Editar Jogo"
        description="Atualize as informações do jogo"
        onCancel={handleCancelarEdicaoJogo}
        onConfirm={handleSalvarEdicaoJogo}
        confirmLabel="Salvar Alterações"
      >
        {jogoEmEdicao && (
          <JogoForm
            value={jogoEmEdicao as unknown as JogoFormState}
            onChange={(v) => setJogoEmEdicao(v as unknown as Jogo)}
          />
        )}
      </ModalFormLayout>
    </div>
  );
};

export default GestaoJogos;
