// Dashboard do Administrador
import React from 'react';
import { Trophy, Calendar, Users, TrendUp, Plus, UserPlus, Bell } from 'phosphor-react';
import { Button } from '../../components/ui/button';
// removed unused Badge import
// removed unused Card imports
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useNavigation } from '../../hooks/use-navigation';
import PageHeader from '../common/PageHeader';
import QuickActionCard from './components/QuickActionCard';
import UpcomingItemCard from './components/UpcomingItemCard';
import ModalFormLayout from './components/ModalFormLayout';
import { showToast } from '../../utils/toast-helpers';
  
const estatisticas = [
  { label: 'Total de Jogadores', valor: 4, icon: Users, color: 'blue' },
  { label: 'Próximos Jogos', valor: 1, icon: Calendar, color: 'info' },
      { label: 'Eventos Ativos', valor: 2, icon: Calendar, color: 'success' },
  { label: 'Presença Média', valor: '88%', icon: TrendUp, color: 'warning' },
];

const DashboardAdmin: React.FC = () => {
  const { navigateTo } = useNavigation();
  
  // Estados dos modais
  const [isCriarEventoOpen, setIsCriarEventoOpen] = React.useState(false);
  const [isAdicionarJogadorOpen, setIsAdicionarJogadorOpen] = React.useState(false);
  const [isAgendarJogoOpen, setIsAgendarJogoOpen] = React.useState(false);

  // cores para os cards de estatística via PageHeader

  const handleCriarEvento = () => {
    setIsCriarEventoOpen(true);
  };

  const handleAdicionarJogador = () => {
    setIsAdicionarJogadorOpen(true);
  };

  const handleAgendarJogo = () => {
    setIsAgendarJogoOpen(true);
  };

  // removed unused handleEnviarNotificacao to silence TS6133

  return (
    <div className="space-y-3 sm:space-y-6 animate-fade-in px-1">
      <PageHeader
        title="Gestão do Time"
        description="Dashboard administrativo completo"
        stats={estatisticas.map((s) => ({
          title: s.label,
          value: s.valor,
          icon: s.icon,
          color: s.color,
        }))}
      />

      {/* Ações Rápidas */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold text-[#1E293B] mb-3">Ações Rápidas</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <QuickActionCard title="Criar" subtitle="Evento" icon={Plus} bgClassName="bg-[#4C1D95]/10 group-hover:bg-[#4C1D95]/20" onClick={handleCriarEvento} />
          <QuickActionCard title="Agendar" subtitle="Jogo" icon={Calendar} bgClassName="bg-[#EF4444]/10 group-hover:bg-[#EF4444]/20" onClick={handleAgendarJogo} />
          <QuickActionCard title="Adicionar" subtitle="Jogador" icon={UserPlus} bgClassName="bg-[#22C55E]/10 group-hover:bg-[#22C55E]/20" onClick={handleAdicionarJogador} />
          <QuickActionCard title="Enviar" subtitle="Notificação" icon={Bell} bgClassName="bg-gray-200/50" disabled />
        </div>
      </section>

      {/* Próximos Jogos */}
      <section className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[#1E293B]">Próximos Jogos</h2>
          <Button 
            size="sm" 
            variant="link" 
            className="text-[#4C1D95] px-0"
            onClick={() => navigateTo('/admin/jogos')}
          >
            Ver todos
          </Button>
        </div>
        <div className="w-full">
          <UpcomingItemCard icon={Trophy} title="vs FC Rivais" dateText="24/07/2024 • 15:00" statusLabel="Agendado" statusClassName="bg-[#3B82F6] text-white text-xs px-3 py-1 rounded-full" iconGradientClassName="from-[#4C1D95] to-[#3B82F6]" />
        </div>
      </section>

      {/* Próximos Eventos */}
      <section className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-[#1E293B]">Próximos Eventos</h2>
          <Button 
            size="sm" 
            variant="link" 
            className="text-[#4C1D95] px-0"
            onClick={() => navigateTo('/admin/eventos')}
          >
            Ver todos
          </Button>
        </div>
        <div className="w-full">
          <UpcomingItemCard icon={Calendar} title="Treino Técnico" dateText="25/07/2024 • 19:00" statusLabel="Confirmado" statusClassName="bg-[#22C55E] text-white text-xs px-3 py-1 rounded-full" iconGradientClassName="from-[#22C55E] to-[#16A34A]" />
        </div>
      </section>

      {/* Espaçamento para o modal */}
      <div className="mb-24" />

      <ModalFormLayout
        open={isCriarEventoOpen}
        onOpenChange={setIsCriarEventoOpen}
        icon={Plus}
        title="Criar Novo Evento"
        description="Preencha as informações para criar um novo evento"
        onCancel={() => setIsCriarEventoOpen(false)}
        onConfirm={() => {
          showToast.success('Evento criado com sucesso!');
          setIsCriarEventoOpen(false);
        }}
        confirmLabel="Criar Evento"
      >
        <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="nomeEvento" className="text-xs sm:text-sm font-semibold text-gray-700">
              Nome do Evento
            </Label>
            <Input id="nomeEvento" placeholder="Nome do evento" className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200" />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="dataEvento" className="text-xs sm:text-sm font-semibold text-gray-700">
              Data
            </Label>
            <Input id="dataEvento" type="date" className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200" />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="localEvento" className="text-xs sm:text-sm font-semibold text-gray-700">
              Local
            </Label>
            <Input id="localEvento" placeholder="Local do evento" className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200" />
          </div>
        </div>
      </ModalFormLayout>

      <ModalFormLayout
        open={isAdicionarJogadorOpen}
        onOpenChange={setIsAdicionarJogadorOpen}
        icon={UserPlus}
        title="Adicionar Novo Jogador"
        description="Preencha as informações para adicionar um novo jogador"
        onCancel={() => setIsAdicionarJogadorOpen(false)}
        onConfirm={() => {
          showToast.success('Jogador adicionado com sucesso!');
          setIsAdicionarJogadorOpen(false);
        }}
        confirmLabel="Adicionar Jogador"
      >
        <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="nomeJogador" className="text-xs sm:text-sm font-semibold text-gray-700">
              Nome Completo
            </Label>
            <Input id="nomeJogador" placeholder="Nome do jogador" className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200" />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="posicaoJogador" className="text-xs sm:text-sm font-semibold text-gray-700">
              Posição
            </Label>
            <select id="posicaoJogador" className="w-full h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base px-2 sm:px-3 py-1 sm:py-2 border border-gray-200 rounded-md focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200">
              <option value="atacante">Atacante</option>
              <option value="meio-campo">Meio-campo</option>
              <option value="defensor">Defensor</option>
              <option value="goleiro">Goleiro</option>
            </select>
          </div>
        </div>
      </ModalFormLayout>

      <ModalFormLayout
        open={isAgendarJogoOpen}
        onOpenChange={setIsAgendarJogoOpen}
        icon={Calendar}
        title="Agendar Novo Jogo"
        description="Preencha as informações para agendar um novo jogo"
        onCancel={() => setIsAgendarJogoOpen(false)}
        onConfirm={() => {
          showToast.success('Jogo agendado com sucesso!');
          setIsAgendarJogoOpen(false);
        }}
        confirmLabel="Agendar Jogo"
      >
        <div className="space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="adversario" className="text-xs sm:text-sm font-semibold text-gray-700">
              Adversário
            </Label>
            <Input id="adversario" placeholder="Nome do time adversário" className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200" />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="dataJogo" className="text-xs sm:text-sm font-semibold text-gray-700">
              Data
            </Label>
            <Input id="dataJogo" type="date" className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200" />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="localJogo" className="text-xs sm:text-sm font-semibold text-gray-700">
              Local
            </Label>
            <Input id="localJogo" placeholder="Local do jogo" className="h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 text-xs sm:text-sm md:text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200" />
          </div>
        </div>
      </ModalFormLayout>
    </div>
  );
};

export default DashboardAdmin;