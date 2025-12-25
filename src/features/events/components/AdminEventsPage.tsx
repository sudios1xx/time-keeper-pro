// Gestão completa de eventos para administradores (feature-level)
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Users,
  CheckCircle,
  Lightning,
  Plus,
  PencilSimple,
  Archive,
} from 'phosphor-react';
import { data } from '@/services/data';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import ModalFormLayout from '@/components/admin/components/ModalFormLayout';
import EventoForm, { EventoFormState } from '@/components/admin/components/EventoForm';
import EventoCard from '@/components/admin/components/EventoCard';
import { showToast, confirmAction } from '@/utils/toast-helpers';
import { logger } from '@/utils/logger';
import { Evento } from '@/types';
import { validateRequired, validateName } from '@/utils/validation';

const GestaoEventos: React.FC = () => {
  const [filterType, setFilterType] = useState('todos');
  const [isCriarEventoOpen, setIsCriarEventoOpen] = useState(false);
  const [isEditarEventoOpen, setIsEditarEventoOpen] = useState(false);
  const [eventoEmEdicao, setEventoEmEdicao] = useState<Evento | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [novoEvento, setNovoEvento] = useState({
    nome: '',
    descricao: '',
    data: '',
    horario: '',
    local: '',
    tipo: 'social',
  });

  const tiposEventos = [
    { value: 'todos', label: 'Todos' },
    { value: 'social', label: 'Sociais' },
    { value: 'treino', label: 'Treinos' },
    { value: 'reuniao', label: 'Reuniões' },
  ];

  useEffect(() => {
    let active = true;
    (async () => {
      const all = await data.getEvents();
      if (!active) return;
      setEventos(all);
    })();
    return () => {
      active = false;
    };
  }, []);

  const eventosFiltrados = useMemo(
    () => eventos.filter((evento) => filterType === 'todos' || evento.tipo === filterType),
    [eventos, filterType],
  );

  const estatisticas = useMemo(() => {
    const total = eventos.length || 1;
    const proximosEventos = eventos.filter((e) => new Date(e.data) > new Date()).length;
    const eventosPassados = eventos.filter((e) => new Date(e.data) <= new Date()).length;
    const mediaConfirmacoes = Math.round(
      eventos.reduce(
        (acc, e) => acc + (e.presencas.filter((p) => p.confirmou).length / e.presencas.length) * 100,
        0,
      ) / total,
    );
    return { total: eventos.length, proximosEventos, eventosPassados, mediaConfirmacoes };
  }, [eventos]);

  const handleCriarEvento = () => {
    setIsCriarEventoOpen(true);
  };

  const handleSubmitNovoEvento = () => {
    if (!validateRequired(novoEvento.nome)) {
      showToast.error('Por favor, preencha o nome do evento');
      return;
    }

    if (!validateName(novoEvento.nome)) {
      showToast.error('Nome do evento deve ter entre 2 e 50 caracteres');
      return;
    }

    if (!validateRequired(novoEvento.data)) {
      showToast.error('Por favor, preencha a data');
      return;
    }

    if (!validateRequired(novoEvento.horario)) {
      showToast.error('Por favor, preencha o horário');
      return;
    }

    if (!validateRequired(novoEvento.local)) {
      showToast.error('Por favor, preencha o local');
      return;
    }

    const eventoId = crypto.randomUUID();
    const novoEventoCompleto = {
      id: eventoId,
      nome: novoEvento.nome,
      descricao: novoEvento.descricao,
      data: novoEvento.data,
      horario: novoEvento.horario,
      local: novoEvento.local,
      tipo: novoEvento.tipo as 'social' | 'treino' | 'reuniao',
      presencas: [],
    };

    logger.log('Novo evento criado:', novoEventoCompleto);
    const next = [novoEventoCompleto as Evento, ...eventos];
    setEventos(next);
    void data.setEvents(next);

    setNovoEvento({
      nome: '',
      descricao: '',
      data: '',
      horario: '',
      local: '',
      tipo: 'social',
    });
    setIsCriarEventoOpen(false);
    showToast.success('Evento criado com sucesso!');
  };

  const handleCancelarCriacao = () => {
    setNovoEvento({
      nome: '',
      descricao: '',
      data: '',
      horario: '',
      local: '',
      tipo: 'social',
    });
    setIsCriarEventoOpen(false);
  };

  const handleEditarEvento = (evento: Evento) => {
    setEventoEmEdicao(evento);
    setIsEditarEventoOpen(true);
  };

  const handleExcluirEvento = async (evento: Evento) => {
    await confirmAction(`Tem certeza que deseja excluir o evento "${evento.nome}"?`, async () => {
      logger.log('Excluindo evento:', evento);
      showToast.success(`Evento "${evento.nome}" excluído com sucesso!`);
    });
  };

  const handleVerConfirmacoes = (evento: Evento) => {
    const confirmados = evento.presencas.filter((p) => p.confirmou).length;
    const total = evento.presencas.length;
    const percentual = total > 0 ? Math.round((confirmados / total) * 100) : 0;

    logger.log('Ver confirmações do evento:', evento);
    showToast.info(`Confirmações: ${confirmados}/${total} confirmados (${percentual}%)`);
  };

  const handleSalvarEdicao = () => {
    if (!eventoEmEdicao) return;

    if (!validateRequired(eventoEmEdicao.nome)) {
      showToast.error('Por favor, preencha o nome do evento');
      return;
    }

    if (!validateName(eventoEmEdicao.nome)) {
      showToast.error('Nome do evento deve ter entre 2 e 50 caracteres');
      return;
    }

    if (!validateRequired(eventoEmEdicao.data)) {
      showToast.error('Por favor, preencha a data');
      return;
    }

    if (!validateRequired(eventoEmEdicao.horario)) {
      showToast.error('Por favor, preencha o horário');
      return;
    }

    if (!validateRequired(eventoEmEdicao.local)) {
      showToast.error('Por favor, preencha o local');
      return;
    }

    logger.log('Evento editado:', eventoEmEdicao);
    setIsEditarEventoOpen(false);
    setEventoEmEdicao(null);
    showToast.success('Evento editado com sucesso!');
  };

  const handleCancelarEdicao = () => {
    setIsEditarEventoOpen(false);
    setEventoEmEdicao(null);
  };

  return (
    <div className="space-y-3 sm:space-y-6 animate-fade-in px-1">
      <PageHeader
        title="Gestão de Eventos"
        description="Crie e gerencie eventos do time"
        stats={[
          { title: 'Total', value: estatisticas.total, icon: Calendar, color: 'blue' },
          { title: 'Próximos', value: estatisticas.proximosEventos, icon: CheckCircle, color: 'green' },
          { title: 'Média Confirmações', value: `${estatisticas.mediaConfirmacoes}%`, icon: Users, color: 'blue' },
          { title: 'Realizados', value: estatisticas.eventosPassados, icon: Archive, color: 'yellow' },
        ]}
      />

      <div className="flex justify-center">
        <Card className="bg-white shadow-card">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col gap-4 items-center">
              <div className="flex flex-wrap gap-2 justify-center">
                {tiposEventos.map((tipo) => (
                  <Button
                    key={tipo.value}
                    variant={filterType === tipo.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterType(tipo.value)}
                    className={`text-xs sm:text-sm ${filterType === tipo.value ? 'shadow-glow' : ''}`}
                  >
                    {tipo.label}
                  </Button>
                ))}
              </div>

              <div className="w-full">
                <Button
                  className="bg-gradient-to-r from-[#4C1D95] to-[#3B82F6] text-white shadow-lg hover:shadow-xl w-full"
                  onClick={handleCriarEvento}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="text-sm">Criar Evento</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-6xl w-full">
          {eventosFiltrados.map((evento, index) => (
            <EventoCard
              key={evento.id}
              evento={evento}
              index={index}
              onEdit={handleEditarEvento}
              onDelete={handleExcluirEvento}
              onConfirmations={handleVerConfirmacoes}
              onReminder={(e) => showToast.success(`Lembrete enviado para o evento "${e.nome}"!`)}
            />
          ))}
        </div>
      </div>

      {eventosFiltrados.length === 0 && (
        <EmptyState
          type="search"
          title="Nenhum evento encontrado"
          description={
            filterType === 'todos'
              ? 'Crie o primeiro evento do time'
              : `Nenhum evento do tipo "${filterType}" encontrado`
          }
          actionButton={{ label: 'Criar Evento', onClick: handleCriarEvento, icon: Plus }}
        />
      )}

      <ModalFormLayout
        open={isCriarEventoOpen}
        onOpenChange={setIsCriarEventoOpen}
        icon={Lightning}
        title="Criar Novo Evento"
        description="Preencha as informações para criar um novo evento"
        onCancel={handleCancelarCriacao}
        onConfirm={handleSubmitNovoEvento}
        confirmLabel="Criar Evento"
      >
        <EventoForm value={novoEvento as EventoFormState} onChange={(v) => setNovoEvento(v)} />
      </ModalFormLayout>

      <ModalFormLayout
        open={isEditarEventoOpen}
        onOpenChange={setIsEditarEventoOpen}
        icon={PencilSimple}
        title="Editar Evento"
        description="Edite as informações do evento"
        onCancel={handleCancelarEdicao}
        onConfirm={handleSalvarEdicao}
        confirmLabel="Salvar Alterações"
      >
        {eventoEmEdicao && (
          <EventoForm
            value={eventoEmEdicao as EventoFormState}
            onChange={(v) => setEventoEmEdicao(v as unknown as Evento)}
          />
        )}
      </ModalFormLayout>
    </div>
  );
};

export default GestaoEventos;
