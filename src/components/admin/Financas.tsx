import React, { useMemo, useState } from 'react';
import PageHeader from '../common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { showToast } from '../../utils/toast-helpers';
import { formatCurrency, formatDate } from '../../utils/helpers';
import {
  Wallet,
  TrendUp,
  TrendDown,
  PlusCircle,
  ArrowUp,
  ArrowDown,
  PencilSimple,
  Trash,
} from 'phosphor-react';

type MovimentoCategoria =
  | 'mensalidade'
  | 'patrocinio'
  | 'arbitragem'
  | 'campo'
  | 'materiais'
  | 'transporte'
  | 'confraternizacao'
  | 'outros';

type MovimentoTipo = 'receita' | 'despesa';

interface MovimentoFinanceiro {
  id: string;
  data: string;
  descricao: string;
  categoria: MovimentoCategoria;
  tipo: MovimentoTipo;
  valor: number;
}

const movimentosSeed: MovimentoFinanceiro[] = [
  { id: 'm1', data: '2024-07-02', descricao: 'Mensalidade Julho (12 atletas)', categoria: 'mensalidade', tipo: 'receita', valor: 1500 },
  { id: 'm2', data: '2024-07-04', descricao: 'Patrocínio - Mercado do Zé', categoria: 'patrocinio', tipo: 'receita', valor: 300 },
  { id: 'm3', data: '2024-07-06', descricao: 'Arbitragem jogo vs Unidos FC', categoria: 'arbitragem', tipo: 'despesa', valor: 320 },
  { id: 'm4', data: '2024-07-08', descricao: 'Campo (aluguel)', categoria: 'campo', tipo: 'despesa', valor: 200 },
  { id: 'm5', data: '2024-07-10', descricao: 'Transporte amistoso (van)', categoria: 'transporte', tipo: 'despesa', valor: 280 },
  { id: 'm6', data: '2024-07-12', descricao: 'Compra 3 bolas oficiais', categoria: 'materiais', tipo: 'despesa', valor: 450 },
  { id: 'm7', data: '2024-07-13', descricao: 'Confraternização pós-jogo', categoria: 'confraternizacao', tipo: 'despesa', valor: 120 },
];

const categoryLabels: Record<MovimentoCategoria, string> = {
  mensalidade: 'Mensalidade',
  patrocinio: 'Patrocínio',
  arbitragem: 'Arbitragem',
  campo: 'Campo/Quadra',
  materiais: 'Materiais (bola, colete, etc.)',
  transporte: 'Transporte',
  confraternizacao: 'Confraternização',
  outros: 'Outros',
};

const categoriaBadgeClass: Record<MovimentoCategoria, string> = {
  mensalidade: 'bg-emerald-100 text-emerald-700',
  patrocinio: 'bg-sky-100 text-sky-700',
  arbitragem: 'bg-amber-100 text-amber-700',
  campo: 'bg-orange-100 text-orange-700',
  materiais: 'bg-purple-100 text-purple-700',
  transporte: 'bg-indigo-100 text-indigo-700',
  confraternizacao: 'bg-pink-100 text-pink-700',
  outros: 'bg-slate-100 text-slate-700',
};

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const getPeriodoRange = (periodo: 'mes' | '30dias' | '90dias' | 'todos') => {
  const now = new Date();
  const end = startOfDay(now);
  if (periodo === 'todos') return { start: null as Date | null, end: null as Date | null };
  if (periodo === 'mes') {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return { start, end };
  }
  const days = periodo === '30dias' ? 30 : 90;
  const start = new Date(end);
  start.setDate(start.getDate() - (days - 1));
  return { start, end };
};

const Financas: React.FC = () => {
  const [movimentos, setMovimentos] = useState<MovimentoFinanceiro[]>(movimentosSeed);
  const [periodo] = useState<'mes' | '30dias' | '90dias' | 'todos'>('mes');

  // modal adicionar movimento
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [novoTipo, setNovoTipo] = useState<MovimentoTipo>('despesa');
  const [novoCategoria, setNovoCategoria] = useState<MovimentoCategoria>('arbitragem');
  const [novoData, setNovoData] = useState(() => new Date().toISOString().slice(0, 10));
  const [novoDescricao, setNovoDescricao] = useState('');
  const [novoValor, setNovoValor] = useState('');

  // modal editar movimento
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [movimentoEditando, setMovimentoEditando] = useState<MovimentoFinanceiro | null>(null);
  const [editTipo, setEditTipo] = useState<MovimentoTipo>('despesa');
  const [editCategoria, setEditCategoria] = useState<MovimentoCategoria>('arbitragem');
  const [editData, setEditData] = useState('');
  const [editDescricao, setEditDescricao] = useState('');
  const [editValor, setEditValor] = useState('');

  // modal excluir movimento
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [movimentoExcluindo, setMovimentoExcluindo] = useState<MovimentoFinanceiro | null>(null);

  const movimentosFiltrados = useMemo(() => {
    const range = getPeriodoRange(periodo);
    return movimentos.filter((m) => {
      if (range.start && range.end) {
        const d = new Date(m.data);
        return d >= range.start! && d <= range.end!;
      }
      return true;
    }).sort((a, b) => (a.data < b.data ? 1 : -1));
  }, [movimentos, periodo]);

  // Agrupar transações por data
  const transacoesAgrupadas = useMemo(() => {
    const grupos: Record<string, MovimentoFinanceiro[]> = {};
    movimentosFiltrados.forEach((m) => {
      const dataKey = formatDate(m.data);
      if (!grupos[dataKey]) {
        grupos[dataKey] = [];
      }
      grupos[dataKey].push(m);
    });
    return grupos;
  }, [movimentosFiltrados]);

  const resumo = useMemo(() => {
    const receitas = movimentosFiltrados.filter((m) => m.tipo === 'receita').reduce((acc, m) => acc + m.valor, 0);
    const despesas = movimentosFiltrados.filter((m) => m.tipo === 'despesa').reduce((acc, m) => acc + m.valor, 0);
    const saldo = receitas - despesas;
    return { receitas, despesas, saldo };
  }, [movimentosFiltrados]);

  const resumoAnterior = useMemo(() => {
    const now = new Date();
    let start: Date;
    let end: Date;

    if (periodo === 'mes') {
      end = new Date(now.getFullYear(), now.getMonth(), 0);
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    } else if (periodo === '30dias') {
      end = new Date(now);
      end.setDate(end.getDate() - 30);
      start = new Date(end);
      start.setDate(start.getDate() - 30);
    } else if (periodo === '90dias') {
      end = new Date(now);
      end.setDate(end.getDate() - 90);
      start = new Date(end);
      start.setDate(start.getDate() - 90);
    } else {
      return { receitas: 0, despesas: 0, saldo: 0 };
    }

    const movimentosAnteriores = movimentos.filter((m) => {
      const d = new Date(m.data);
      return d >= start && d <= end;
    });

    const receitas = movimentosAnteriores.filter((m) => m.tipo === 'receita').reduce((acc, m) => acc + m.valor, 0);
    const despesas = movimentosAnteriores.filter((m) => m.tipo === 'despesa').reduce((acc, m) => acc + m.valor, 0);
    const saldo = receitas - despesas;
    return { receitas, despesas, saldo };
  }, [movimentos, periodo]);

  const calcularVariacao = (atual: number, anterior: number) => {
    if (anterior === 0) return atual > 0 ? 100 : 0;
    return ((atual - anterior) / anterior) * 100;
  };

  const totalMovimentos = useMemo(() => movimentosFiltrados.length, [movimentosFiltrados]);

  const variacaoSaldo = calcularVariacao(resumo.saldo, resumoAnterior.saldo);
  const variacaoReceitas = calcularVariacao(resumo.receitas, resumoAnterior.receitas);
  const variacaoDespesas = calcularVariacao(resumo.despesas, resumoAnterior.despesas);

  const onAdicionarMovimento = () => {
    const valor = Number(String(novoValor).replace(',', '.'));
    if (!novoDescricao.trim()) {
      showToast.error('Informe uma descrição.');
      return;
    }
    if (!novoData) {
      showToast.error('Informe a data.');
      return;
    }
    if (!Number.isFinite(valor) || valor <= 0) {
      showToast.error('Informe um valor válido maior que 0.');
      return;
    }

    const mov: MovimentoFinanceiro = {
      id: crypto.randomUUID(),
      data: novoData,
      descricao: novoDescricao.trim(),
      categoria: novoCategoria,
      tipo: novoTipo,
      valor,
    };
    setMovimentos((prev) => [mov, ...prev]);
    setIsAddOpen(false);
    setNovoDescricao('');
    setNovoValor('');
    showToast.success('Movimento adicionado.');
  };

  const abrirEditar = (mov: MovimentoFinanceiro) => {
    setMovimentoEditando(mov);
    setEditTipo(mov.tipo);
    setEditCategoria(mov.categoria);
    setEditData(mov.data);
    setEditDescricao(mov.descricao);
    setEditValor(String(mov.valor));
    setIsEditOpen(true);
  };

  const onEditarMovimento = () => {
    if (!movimentoEditando) return;

    const valor = Number(String(editValor).replace(',', '.'));
    if (!editDescricao.trim()) {
      showToast.error('Informe uma descrição.');
      return;
    }
    if (!editData) {
      showToast.error('Informe a data.');
      return;
    }
    if (!Number.isFinite(valor) || valor <= 0) {
      showToast.error('Informe um valor válido maior que 0.');
      return;
    }

    setMovimentos((prev) =>
      prev.map((m) =>
        m.id === movimentoEditando.id
          ? {
              ...m,
              tipo: editTipo,
              categoria: editCategoria,
              data: editData,
              descricao: editDescricao.trim(),
              valor,
            }
          : m
      )
    );
    setIsEditOpen(false);
    setMovimentoEditando(null);
    showToast.success('Movimento editado.');
  };

  const abrirExcluir = (mov: MovimentoFinanceiro) => {
    setMovimentoExcluindo(mov);
    setIsDeleteOpen(true);
  };

  const onExcluirMovimento = () => {
    if (!movimentoExcluindo) return;

    setMovimentos((prev) => prev.filter((m) => m.id !== movimentoExcluindo.id));
    setIsDeleteOpen(false);
    setMovimentoExcluindo(null);
    showToast.success('Movimento excluído.');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Finanças"
        description="Simples, completo e intuitivo: caixa do time."
        stats={[
          {
            title: 'Saldo',
            value: formatCurrency(resumo.saldo),
            icon: Wallet,
            color: 'blue',
            description:
              resumoAnterior.saldo !== 0 ? (
                <span className={`flex items-center gap-1 text-xs ${variacaoSaldo >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {variacaoSaldo >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {Math.abs(variacaoSaldo).toFixed(1)}% vs período anterior
                </span>
              ) : undefined,
          },
          {
            title: 'Receitas',
            value: formatCurrency(resumo.receitas),
            icon: TrendUp,
            color: 'green',
            description:
              resumoAnterior.receitas !== 0 ? (
                <span className={`flex items-center gap-1 text-xs ${variacaoReceitas >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {variacaoReceitas >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {Math.abs(variacaoReceitas).toFixed(1)}%
                </span>
              ) : undefined,
          },
          {
            title: 'Despesas',
            value: formatCurrency(resumo.despesas),
            icon: TrendDown,
            color: 'red',
            description:
              resumoAnterior.despesas !== 0 ? (
                <span className={`flex items-center gap-1 text-xs ${variacaoDespesas <= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {variacaoDespesas <= 0 ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
                  {Math.abs(variacaoDespesas).toFixed(1)}%
                </span>
              ) : undefined,
          },
          {
            title: 'Total de movimentos',
            value: totalMovimentos,
            icon: Wallet,
            color: 'purple',
          },
        ]}
        actionButton={{
          label: 'Adicionar movimento',
          onClick: () => setIsAddOpen(true),
          icon: PlusCircle,
        }}
      />

      {/* Histórico de Transações */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
          <CardDescription>Entradas e saídas do time.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-gray-100 overflow-hidden">
            {Object.keys(transacoesAgrupadas).length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground text-center">
                Nenhum movimento encontrado.
              </div>
            ) : (
              <div className="divide-y">
                {Object.entries(transacoesAgrupadas)
                  .sort(([a], [b]) => {
                    const dateA = new Date(a.split('/').reverse().join('-'));
                    const dateB = new Date(b.split('/').reverse().join('-'));
                    return dateB.getTime() - dateA.getTime();
                  })
                  .map(([dataKey, transacoes]) => (
                    <div key={dataKey}>
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-700">{dataKey}</p>
                        <p className="text-xs text-muted-foreground">
                          {transacoes.length} {transacoes.length === 1 ? 'transação' : 'transações'}
                        </p>
                      </div>
                      {transacoes.map((m) => (
                        <div
                          key={m.id}
                          className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#1E293B] truncate">{m.descricao}</p>
                            <Badge className={`${categoriaBadgeClass[m.categoria]} text-xs mt-1`}>
                              {categoryLabels[m.categoria]}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p
                                className={`text-base font-semibold ${m.tipo === 'receita' ? 'text-emerald-600' : 'text-red-600'}`}
                              >
                                {m.tipo === 'receita' ? '+' : '-'} {formatCurrency(m.valor)}
                              </p>
                              <p className="text-xs text-muted-foreground capitalize">{m.tipo}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => abrirEditar(m)}
                                className="h-8 w-8 p-0"
                              >
                                <PencilSimple className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => abrirExcluir(m)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal: Adicionar movimento */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="w-[95vw] max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar movimento</DialogTitle>
            <DialogDescription>Registre uma entrada ou saída no caixa do time.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Tipo</label>
              <Select value={novoTipo} onValueChange={(v) => setNovoTipo(v as MovimentoTipo)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Categoria</label>
              <Select value={novoCategoria} onValueChange={(v) => setNovoCategoria(v as MovimentoCategoria)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(categoryLabels).map((key) => (
                    <SelectItem key={key} value={key}>
                      {categoryLabels[key as MovimentoCategoria]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Data</label>
              <Input type="date" value={novoData} onChange={(e) => setNovoData(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Valor (R$)</label>
              <Input
                value={novoValor}
                onChange={(e) => setNovoValor(e.target.value)}
                placeholder="Ex: 120"
                inputMode="decimal"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-muted-foreground mb-1 block">Descrição</label>
              <Input
                value={novoDescricao}
                onChange={(e) => setNovoDescricao(e.target.value)}
                placeholder="Ex: Arbitragem do jogo X"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={onAdicionarMovimento} className="bg-gradient-to-r from-purple-600 to-blue-600">
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Editar movimento */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="w-[95vw] max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar movimento</DialogTitle>
            <DialogDescription>Atualize as informações do movimento financeiro.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Tipo</label>
              <Select value={editTipo} onValueChange={(v) => setEditTipo(v as MovimentoTipo)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Categoria</label>
              <Select value={editCategoria} onValueChange={(v) => setEditCategoria(v as MovimentoCategoria)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(categoryLabels).map((key) => (
                    <SelectItem key={key} value={key}>
                      {categoryLabels[key as MovimentoCategoria]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Data</label>
              <Input type="date" value={editData} onChange={(e) => setEditData(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Valor (R$)</label>
              <Input
                value={editValor}
                onChange={(e) => setEditValor(e.target.value)}
                placeholder="Ex: 120"
                inputMode="decimal"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-muted-foreground mb-1 block">Descrição</label>
              <Input
                value={editDescricao}
                onChange={(e) => setEditDescricao(e.target.value)}
                placeholder="Ex: Arbitragem do jogo X"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={onEditarMovimento} className="bg-gradient-to-r from-purple-600 to-blue-600">
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Excluir movimento */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir movimento?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o movimento "{movimentoExcluindo?.descricao}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMovimentoExcluindo(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onExcluirMovimento} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Financas;
