// Tela de finanças para administradores (feature-level)
import React, { useMemo, useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showToast } from '@/utils/toast-helpers';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { Wallet, TrendUp, TrendDown, PlusCircle, ArrowUp, ArrowDown, PencilSimple, Trash } from 'phosphor-react';

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

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [novoTipo, setNovoTipo] = useState<MovimentoTipo>('despesa');
  const [novoCategoria, setNovoCategoria] = useState<MovimentoCategoria>('arbitragem');
  const [novoData, setNovoData] = useState(() => new Date().toISOString().slice(0, 10));
  const [novoDescricao, setNovoDescricao] = useState('');
  const [novoValor, setNovoValor] = useState('');

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [movimentoEditando, setMovimentoEditando] = useState<MovimentoFinanceiro | null>(null);
  const [editTipo, setEditTipo] = useState<MovimentoTipo>('despesa');
  const [editCategoria, setEditCategoria] = useState<MovimentoCategoria>('arbitragem');
  const [editData, setEditData] = useState('');
  const [editDescricao, setEditDescricao] = useState('');
  const [editValor, setEditValor] = useState('');

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [movimentoExcluindo, setMovimentoExcluindo] = useState<MovimentoFinanceiro | null>(null);

  const movimentosFiltrados = useMemo(() => {
    const range = getPeriodoRange(periodo);
    return movimentos
      .filter((m) => {
        if (range.start && range.end) {
          const d = new Date(m.data);
          return d >= range.start! && d <= range.end!;
        }
        return true;
      })
      .sort((a, b) => (a.data < b.data ? 1 : -1));
  }, [movimentos, periodo]);

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
    const receitas = movimentosFiltrados
      .filter((m) => m.tipo === 'receita')
      .reduce((acc, m) => acc + m.valor, 0);
    const despesas = movimentosFiltrados
      .filter((m) => m.tipo === 'despesa')
      .reduce((acc, m) => acc + m.valor, 0);
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

    const receitas = movimentosAnteriores
      .filter((m) => m.tipo === 'receita')
      .reduce((acc, m) => acc + m.valor, 0);
    const despesas = movimentosAnteriores
      .filter((m) => m.tipo === 'despesa')
      .reduce((acc, m) => acc + m.valor, 0);
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
          ? { ...m, descricao: editDescricao.trim(), data: editData, categoria: editCategoria, tipo: editTipo, valor }
          : m,
      ),
    );
    setIsEditOpen(false);
    setMovimentoEditando(null);
    showToast.success('Movimento atualizado.');
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

  const renderVariation = (value: number) => {
    const isPositive = value >= 0;
    const Icon = isPositive ? TrendUp : TrendDown;
    const colorClass = isPositive ? 'text-emerald-600' : 'text-red-600';
    return (
      <div className={`flex items-center text-xs font-medium ${colorClass}`}>
        <Icon className="w-3 h-3 mr-1" />
        {value.toFixed(1)}%
      </div>
    );
  };

  return (
    <div className="space-y-3 sm:space-y-6 animate-fade-in px-1">
      <PageHeader
        title="Finanças do Time"
        description="Controle receitas, despesas e tenha clareza do caixa do time"
        stats={[
          {
            title: 'Saldo Atual',
            value: formatCurrency(resumo.saldo),
            icon: Wallet,
            color: resumo.saldo >= 0 ? 'green' : 'red',
          },
          {
            title: 'Receitas no Período',
            value: formatCurrency(resumo.receitas),
            icon: ArrowUp,
            color: 'green',
          },
          {
            title: 'Despesas no Período',
            value: formatCurrency(resumo.despesas),
            icon: ArrowDown,
            color: 'red',
          },
          {
            title: 'Movimentos',
            value: String(totalMovimentos),
            icon: PlusCircle,
            color: 'info',
          },
        ]}
      />

      <section className="grid md:grid-cols-3 gap-3 sm:gap-4">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Saldo Atual</CardTitle>
            <CardDescription>Comparado ao período anterior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-bold">{formatCurrency(resumo.saldo)}</div>
                <p className="text-xs text-muted-foreground mt-1">Incluindo todas as receitas e despesas</p>
              </div>
              {renderVariation(variacaoSaldo)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Receitas</CardTitle>
            <CardDescription>Entradas no período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(resumo.receitas)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Mensalidades, patrocínios e outros</p>
              </div>
              {renderVariation(variacaoReceitas)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Despesas</CardTitle>
            <CardDescription>Saídas no período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(resumo.despesas)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Campo, arbitragem, materiais e mais</p>
              </div>
              {renderVariation(variacaoDespesas)}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col md:flex-row gap-3 sm:gap-4 items-start">
        <Card className="flex-1 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>Movimentações</CardTitle>
              <CardDescription>Histórico financeiro do período selecionado</CardDescription>
            </div>
            <Button size="sm" onClick={() => setIsAddOpen(true)}>
              <PlusCircle className="w-4 h-4 mr-1" />
              Novo Movimento
            </Button>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {Object.entries(transacoesAgrupadas).map(([dataKey, itens]) => (
              <div key={dataKey} className="space-y-1">
                <div className="text-xs font-semibold text-muted-foreground mt-2">{dataKey}</div>
                {itens.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between rounded-lg border border-border/40 bg-card px-3 py-2 text-sm hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{m.descricao}</span>
                        <Badge className={categoriaBadgeClass[m.categoria]}>{categoryLabels[m.categoria]}</Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {m.tipo === 'receita' ? (
                            <ArrowUp className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-red-500" />
                          )}
                          {m.tipo === 'receita' ? 'Receita' : 'Despesa'}
                        </span>
                        <span>{formatCurrency(m.valor)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => abrirEditar(m)}
                      >
                        <PencilSimple className="w-3 h-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-red-500 hover:text-red-600"
                        onClick={() => abrirExcluir(m)}
                      >
                        <Trash className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {totalMovimentos === 0 && (
              <div className="text-center text-sm text-muted-foreground py-8">
                Nenhum movimento financeiro cadastrado para o período.
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Dialogs de criar/editar/excluir (mantidos iguais, só ajustando imports) */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo movimento financeiro</DialogTitle>
            <DialogDescription>Cadastre uma nova entrada ou saída no caixa do time.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={novoTipo === 'despesa' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setNovoTipo('despesa')}
              >
                <ArrowDown className="w-4 h-4 mr-1" /> Despesa
              </Button>
              <Button
                type="button"
                variant={novoTipo === 'receita' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setNovoTipo('receita')}
              >
                <ArrowUp className="w-4 h-4 mr-1" /> Receita
              </Button>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Categoria</span>
              <Select value={novoCategoria} onValueChange={(value) => setNovoCategoria(value as MovimentoCategoria)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(categoryLabels) as MovimentoCategoria[]).map((c) => (
                    <SelectItem key={c} value={c}>
                      {categoryLabels[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Data</span>
              <Input type="date" value={novoData} onChange={(e) => setNovoData(e.target.value)} />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Descrição</span>
              <Input
                placeholder="Ex: Arbitragem amistoso vs Unidos FC"
                value={novoDescricao}
                onChange={(e) => setNovoDescricao(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Valor</span>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={novoValor}
                onChange={(e) => setNovoValor(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={onAdicionarMovimento}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar movimento</DialogTitle>
            <DialogDescription>Atualize as informações do movimento selecionado.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="flex gap-2">
              <Button
                type="button"
                variant={editTipo === 'despesa' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setEditTipo('despesa')}
              >
                <ArrowDown className="w-4 h-4 mr-1" /> Despesa
              </Button>
              <Button
                type="button"
                variant={editTipo === 'receita' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setEditTipo('receita')}
              >
                <ArrowUp className="w-4 h-4 mr-1" /> Receita
              </Button>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Categoria</span>
              <Select value={editCategoria} onValueChange={(value) => setEditCategoria(value as MovimentoCategoria)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(categoryLabels) as MovimentoCategoria[]).map((c) => (
                    <SelectItem key={c} value={c}>
                      {categoryLabels[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Data</span>
              <Input type="date" value={editData} onChange={(e) => setEditData(e.target.value)} />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Descrição</span>
              <Input
                placeholder="Descrição"
                value={editDescricao}
                onChange={(e) => setEditDescricao(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-muted-foreground">Valor</span>
              <Input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={editValor}
                onChange={(e) => setEditValor(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={onEditarMovimento}>
              Salvar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir movimento</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Tem certeza que deseja excluir este movimento do histórico financeiro?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onExcluirMovimento}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Financas;
