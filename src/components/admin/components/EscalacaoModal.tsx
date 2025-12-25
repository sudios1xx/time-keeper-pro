import React, { useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Jogador } from '../../../types';
import { Users, X, Download } from 'phosphor-react';
import { showToast } from '../../../utils/toast-helpers';
import html2canvas from 'html2canvas';

interface Posicao {
  id: string;
  nome: string;
  x: number; // porcentagem da esquerda
  y: number; // porcentagem do topo
  tipo: 'goleiro' | 'defesa' | 'meio' | 'ataque';
}

interface EscalacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jogadores: Jogador[];
}

const posicoes: Posicao[] = [
  // 4-3-3 (nomes PT-BR)
  { id: 'ponta_esquerda', nome: 'Ponta Esquerda', x: 18, y: 18, tipo: 'ataque' },
  { id: 'centroavante', nome: 'Centroavante', x: 50, y: 14, tipo: 'ataque' },
  { id: 'ponta_direita', nome: 'Ponta Direita', x: 82, y: 18, tipo: 'ataque' },

  { id: 'meia_esquerdo', nome: 'Meia Esquerdo', x: 30, y: 40, tipo: 'meio' },
  { id: 'volante', nome: 'Volante', x: 50, y: 52, tipo: 'meio' },
  { id: 'meia_direito', nome: 'Meia Direito', x: 70, y: 40, tipo: 'meio' },

  { id: 'lateral_esquerdo', nome: 'Lateral Esquerdo', x: 12, y: 64, tipo: 'defesa' },
  { id: 'zagueiro_esquerdo', nome: 'Zagueiro', x: 32, y: 76, tipo: 'defesa' },
  { id: 'zagueiro_direito', nome: 'Zagueiro', x: 68, y: 76, tipo: 'defesa' },
  { id: 'lateral_direito', nome: 'Lateral Direito', x: 88, y: 64, tipo: 'defesa' },

  { id: 'goleiro', nome: 'Goleiro', x: 50, y: 92, tipo: 'goleiro' },
];

const EscalacaoModal: React.FC<EscalacaoModalProps> = ({ open, onOpenChange, jogadores }) => {
  const [escalacao, setEscalacao] = useState<Record<string, Jogador | null>>({});
  const [posicaoSelecionada, setPosicaoSelecionada] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const escaladosCount = useMemo(
    () => Object.values(escalacao).filter(Boolean).length,
    [escalacao]
  );

  const getTwoPartName = (fullName: string): string => {
    const parts = (fullName || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[parts.length - 1]}`;
  };

  const handlePosicaoClick = (posicaoId: string) => {
    setPosicaoSelecionada(posicaoId);
  };

  const handleJogadorSelecionado = (jogador: Jogador) => {
    if (posicaoSelecionada) {
      setEscalacao(prev => ({
        ...prev,
        [posicaoSelecionada]: jogador
      }));
      setPosicaoSelecionada(null);
      showToast.success(`${jogador.nome} escalado!`);
    }
  };

  const handleRemoverJogador = (posicaoId: string) => {
    setEscalacao(prev => {
      const nova = { ...prev };
      delete nova[posicaoId];
      return nova;
    });
  };

  const handleSalvar = () => {
    const jogadoresEscalados = Object.values(escalacao).filter(Boolean).length;
    if (jogadoresEscalados < 11) {
      showToast.error('Complete a escalação com 11 jogadores');
      return;
    }
    showToast.success('Escalação salva com sucesso!');
    onOpenChange(false);
  };

  const handleExportarImagem = async () => {
    const node = exportRef.current;
    if (!node) {
      showToast.error('Não foi possível exportar (campo não encontrado)');
      return;
    }

    try {
      setIsExporting(true);
      showToast.info('Gerando imagem...');

      // Captura o DOM do campo (igual ao que aparece na tela)
      const captured = await html2canvas(node, {
        backgroundColor: '#2E7D32',
        scale: 3, // melhora muito a qualidade
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      // Saída fixa 1080x1350 (4:5)
      const outW = 1080;
      const outH = 1350;
      const out = document.createElement('canvas');
      out.width = outW;
      out.height = outH;
      const ctx = out.getContext('2d');
      if (!ctx) return;

      // "Cover" com crop central para garantir 1080x1350 sempre
      const srcW = captured.width;
      const srcH = captured.height;
      const scale = Math.max(outW / srcW, outH / srcH);
      const drawW = srcW * scale;
      const drawH = srcH * scale;
      const dx = (outW - drawW) / 2;
      const dy = (outH - drawH) / 2;

      ctx.fillStyle = '#2E7D32';
      ctx.fillRect(0, 0, outW, outH);
      ctx.drawImage(captured, dx, dy, drawW, drawH);

      out.toBlob((blob) => {
        if (!blob) {
          showToast.error('Erro ao gerar imagem');
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `escalacao-1080x1350-${new Date().toISOString().split('T')[0]}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast.success('Imagem exportada!');
      }, 'image/jpeg', 0.95);
    } catch {
      showToast.error('Erro ao exportar imagem (fotos podem estar bloqueadas)');
    } finally {
      setIsExporting(false);
    }
  };

  const getJogadoresPorPosicao = (tipo: string) => {
    return jogadores.filter(j => {
      const pos = j.posicao.toLowerCase();
      if (tipo === 'goleiro') return pos.includes('goleiro');
      if (tipo === 'defesa') return pos.includes('zagueiro') || pos.includes('lateral');
      if (tipo === 'meio') return pos.includes('meio') || pos.includes('volante');
      if (tipo === 'ataque') return pos.includes('atacante') || pos.includes('ponta') || pos.includes('centroavante');
      return true;
    });
  };

  const jogadorNaPosicao = (posicaoId: string) => escalacao[posicaoId];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="inset-0 left-0 top-0 translate-x-0 translate-y-0 w-full h-[100dvh] max-w-none max-h-none rounded-none bg-white border-0 shadow-none p-0 overflow-hidden flex flex-col sm:inset-auto sm:left-[50%] sm:top-[50%] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[95vw] sm:max-w-5xl sm:h-auto sm:max-h-[90vh] sm:rounded-xl sm:shadow-2xl">
        <div className="flex flex-col h-full min-h-0 sm:max-h-[90vh]">
          <DialogHeader className="text-center pb-3 pt-6 flex-shrink-0 px-4 sm:px-6">
            <DialogTitle className="text-2xl font-bold text-[#1E293B]">Montar Escalação</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2 text-base">
              Clique em uma posição e selecione o jogador. Complete todas as 11 posições.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 pb-4 min-h-0 overscroll-contain">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Campo de Futebol */}
              <div
                ref={exportRef}
                className="flex-1 relative rounded-lg overflow-hidden border-4 border-white shadow-xl aspect-[4/5] min-h-[520px] sm:aspect-auto sm:min-h-[560px]"
                style={{
                  backgroundColor: '#2E7D32',
                  backgroundImage:
                    'repeating-linear-gradient(0deg, rgba(255,255,255,0.00) 0px, rgba(255,255,255,0.00) 36px, rgba(255,255,255,0.08) 36px, rgba(255,255,255,0.08) 72px)',
                }}
              >
            {/* Linhas do campo */}
            <div className="absolute inset-0 border-2 border-white/50">
              {/* Círculo central */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/50 rounded-full"></div>
              {/* Linha central */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/50"></div>
              {/* Área do goleiro */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-24 border-2 border-white/50 rounded-t-full"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-24 border-2 border-white/50 rounded-b-full"></div>
            </div>

            {/* Posições */}
            {posicoes.map((pos) => {
              const jogador = jogadorNaPosicao(pos.id);
              const isSelecionada = posicaoSelecionada === pos.id;
              
              return (
                <div
                  key={pos.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  onClick={() => handlePosicaoClick(pos.id)}
                >
                  <div
                    className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      jogador
                        ? 'bg-[#4C1D95] border-white shadow-lg'
                        : isSelecionada
                        ? 'bg-yellow-400 border-yellow-600 shadow-xl scale-110'
                        : 'bg-white/90 border-[#4C1D95] hover:bg-[#4C1D95]/20 hover:scale-110'
                    }`}
                  >
                    {jogador ? (
                      <img
                        src={jogador.foto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                        alt={jogador.nome}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <Users className={`w-6 h-6 ${isSelecionada ? 'text-yellow-900' : 'text-[#4C1D95]'}`} />
                    )}
                  </div>
                  
                  {/* Nome + posição (visual como na imagem) */}
                  <div className="absolute top-[64px] left-1/2 transform -translate-x-1/2 whitespace-nowrap text-center">
                    <div
                      className={`px-2 py-1 rounded shadow-md ${
                        jogador
                          ? 'bg-black/70 text-white'
                          : isSelecionada
                          ? 'bg-yellow-400 text-yellow-900'
                          : 'bg-white/90 text-[#1E293B]'
                      }`}
                    >
                      <div className="text-[11px] leading-none font-semibold">
                        {jogador ? getTwoPartName(jogador.nome) : pos.nome}
                      </div>
                      <div className="text-[10px] leading-none opacity-90 mt-0.5">
                        {jogador ? jogador.posicao : 'Toque para escalar'}
                      </div>
                    </div>
                  </div>

                  {/* Botão remover */}
                  {jogador && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoverJogador(pos.id);
                      }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
              </div>

              {/* Lista de Jogadores */}
              <div className="w-full lg:w-80 flex flex-col gap-4">
                {posicaoSelecionada ? (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-[#1E293B]">
                      Selecione jogador para: {posicoes.find(p => p.id === posicaoSelecionada)?.nome}
                    </h3>
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                      {getJogadoresPorPosicao(posicoes.find(p => p.id === posicaoSelecionada)?.tipo || '').map((jogador) => (
                        <button
                          key={jogador.id}
                          onClick={() => handleJogadorSelecionado(jogador)}
                          className="w-full flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-[#4C1D95] hover:bg-[#4C1D95]/5 transition-all"
                        >
                          <img
                            src={jogador.foto || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'}
                            alt={jogador.nome}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1 text-left">
                            <p className="font-semibold text-sm text-[#1E293B]">{jogador.nome}</p>
                            <p className="text-xs text-muted-foreground">{jogador.posicao}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setPosicaoSelecionada(null)}
                      className="w-full"
                    >
                      Cancelar
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-[#1E293B]">Escalação</h3>
                    <div className="text-sm text-muted-foreground mb-4">
                      {Object.values(escalacao).filter(Boolean).length} / 11 jogadores escalados
                    </div>
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                      {posicoes.map((pos) => {
                        const jogador = jogadorNaPosicao(pos.id);
                        return (
                          <div
                            key={pos.id}
                            className={`p-2 rounded-lg border ${
                              jogador ? 'bg-[#4C1D95]/10 border-[#4C1D95]' : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-[#1E293B]">{pos.nome}</span>
                              {jogador ? (
                                <span className="text-xs text-[#4C1D95] font-semibold">{jogador.nome.split(' ')[0]}</span>
                              ) : (
                                <span className="text-xs text-muted-foreground\">Vazio</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botões (fixo) */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 px-4 sm:px-6 pb-4 flex-shrink-0 bg-white/80 backdrop-blur-sm">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 h-12">
              Cancelar
            </Button>
            <Button
              variant="outline"
              onClick={handleExportarImagem}
              className="h-12 border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E] hover:text-white"
              disabled={isExporting || escaladosCount === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exportando...' : 'Exportar JPG'}
            </Button>
            <Button
              onClick={handleSalvar}
              className="flex-1 h-12 bg-gradient-to-r from-[#4C1D95] to-[#3B82F6] text-white"
            >
              Salvar Escalação
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EscalacaoModal;

