import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { showToast } from '@/utils/toast-helpers';
import { BetaFormData } from '../types';
import { Envelope, User, Phone, Trophy } from 'phosphor-react';

const formSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().optional(),
  timeClube: z.string().min(2, 'Nome do time/clube é obrigatório'),
});

const FormSection: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BetaFormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: BetaFormData) => {
    try {
      // Simular envio (aqui será integrado com backend futuramente)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log('Dados do formulário:', data);
      showToast.success('Cadastro realizado com sucesso! Em breve você receberá um email com instruções.');
      reset();
    } catch (error) {
      showToast.error('Erro ao realizar cadastro. Tente novamente.');
    }
  };

  return (
    <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Garanta seu acesso ao
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Beta Exclusivo
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Preencha o formulário abaixo e seja um dos primeiros a testar nossa plataforma
          </p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Cadastro para Beta</CardTitle>
            <CardDescription className="text-base">
              Preencha seus dados e receba acesso prioritário
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome Completo *
                </Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Seu nome completo"
                  {...register('nome')}
                  className="h-12 text-base"
                  disabled={isSubmitting}
                />
                {errors.nome && (
                  <p className="text-sm text-red-600">{errors.nome.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Envelope className="w-4 h-4" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                  className="h-12 text-base"
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="telefone" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefone (opcional)
                </Label>
                <Input
                  id="telefone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  {...register('telefone')}
                  className="h-12 text-base"
                  disabled={isSubmitting}
                />
                {errors.telefone && (
                  <p className="text-sm text-red-600">{errors.telefone.message}</p>
                )}
              </div>

              {/* Time/Clube */}
              <div className="space-y-2">
                <Label htmlFor="timeClube" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Nome do Time/Clube *
                </Label>
                <Input
                  id="timeClube"
                  type="text"
                  placeholder="Nome do seu time ou clube"
                  {...register('timeClube')}
                  className="h-12 text-base"
                  disabled={isSubmitting}
                />
                {errors.timeClube && (
                  <p className="text-sm text-red-600">{errors.timeClube.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmitting ? 'Enviando...' : 'Garantir Acesso ao Beta'}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Ao se cadastrar, você concorda em receber comunicações sobre o beta.
                <br />
                Seus dados estão seguros e não serão compartilhados.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default FormSection;

