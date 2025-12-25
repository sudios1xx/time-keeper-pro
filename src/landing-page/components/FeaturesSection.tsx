import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, CurrencyDollarSimple, SoccerBall, Calendar, Trophy, ChartBar } from 'phosphor-react';
import { Feature } from '../types';

const features: Feature[] = [
  {
    title: 'Gestão de Elenco',
    description: 'Gerencie jogadores, escalações e estatísticas de forma simples e eficiente.',
    icon: Users,
  },
  {
    title: 'Controle Financeiro',
    description: 'Acompanhe receitas, despesas e mensalidades com relatórios detalhados.',
    icon: CurrencyDollarSimple,
  },
  {
    title: 'Agendamento de Jogos',
    description: 'Organize jogos, registre resultados e mantenha histórico completo.',
    icon: SoccerBall,
  },
  {
    title: 'Eventos e Treinos',
    description: 'Gerencie eventos, treinos e confraternizações do time.',
    icon: Calendar,
  },
  {
    title: 'Estatísticas e Relatórios',
    description: 'Visualize dados e métricas importantes para tomada de decisão.',
    icon: ChartBar,
  },
  {
    title: 'Conquistas e Troféus',
    description: 'Acompanhe conquistas, medalhas e reconhecimentos do time.',
    icon: Trophy,
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tudo que você precisa para
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              gerenciar seu time
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Uma plataforma completa e intuitiva para administradores de times de futebol
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className="border-2 border-gray-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

