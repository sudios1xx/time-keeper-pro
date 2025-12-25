import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Trophy, SignOut, ArrowLeft } from 'phosphor-react';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../../utils/toast-helpers';
import PageHeader from '../common/PageHeader';

const Configuracoes: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [nomeTime, setNomeTime] = useState('Jogo em Foco');

  const handleSalvar = () => {
    showToast.success('Configurações salvas com sucesso!');
    navigate('/admin');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações do Time"
        description="Gerencie as configurações e informações do seu time"
      />

      <div className="space-y-6">
        {/* Informações Básicas */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Configure as informações principais do seu time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomeTime" className="text-sm font-semibold text-gray-700">
                Nome do Time
              </Label>
              <Input
                id="nomeTime"
                placeholder="Nome do time"
                value={nomeTime}
                onChange={(e) => setNomeTime(e.target.value)}
                className="h-12 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-100"
              />
            </div>
          </CardContent>
        </Card>

        {/* Logo do Time */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Logo do Time</CardTitle>
            <CardDescription>Personalize a logo do seu time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <Label htmlFor="logoTime" className="text-sm font-semibold text-gray-700">
                  Upload da Logo
                </Label>
                <Input
                  id="logoTime"
                  type="file"
                  accept="image/*"
                  className="h-12 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-100 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                <p className="text-xs text-gray-500 mt-1">Formatos aceitos: PNG, JPG, SVG (máx. 2MB)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/admin')}
            className="flex-1 h-12 text-base border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={handleSalvar}
            className="flex-1 h-12 text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-100"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Salvar Configurações
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full h-12 text-base border-red-200 text-red-600 hover:border-red-300 hover:bg-red-50 transition-all duration-100"
        >
          <SignOut className="w-4 h-4 mr-2" />
          Sair da Conta
        </Button>
      </div>
    </div>
  );
};

export default Configuracoes;


