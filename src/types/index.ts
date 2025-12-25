// Tipos TypeScript para a PWA de gestão de futebol

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  foto?: string;
  tipo: 'jogador' | 'administrador';
}

export interface Jogador {
  id: string;
  nome: string;
  foto?: string;
  posicao: string;
  idade: number;
  telefone?: string;
  endereco?: string;
  percentualPresenca: number;
  totalJogos: number;
  jogosCompareceu: number;
  trofeus: Trofeu[];
  medalhas: Medalha[];
}

export interface ComissaoTecnica {
  id: string;
  nome: string;
  cargo: string;
  foto?: string;
  telefone?: string;
}

export interface Jogo {
  id: string;
  adversario: string;
  data: string;
  horario: string;
  local: string;
  status: 'agendado' | 'finalizado';
  placarNos?: number;
  placarAdversario?: number;
  resultado?: {
    gols: number;
    golsAdversario: number;
    cartoesAmarelos: number;
    cartoesVermelhos: number;
  };
  detalhes?: DetalhesJogo[];
  presencas: PresencaJogo[];
}

export interface DetalhesJogo {
  id: string;
  jogadorId: string;
  jogadorNome: string;
  tipo: 'gol' | 'assistencia' | 'cartao_amarelo' | 'cartao_vermelho' | 'falta';
  minuto?: number;
  observacao?: string;
}

export interface PresencaJogo {
  jogadorId: string;
  confirmou: boolean;
  dataConfirmacao?: string;
}

export interface Evento {
  id: string;
  nome: string;
  descricao?: string;
  data: string;
  horario: string;
  local: string;
  tipo: 'social' | 'reuniao' | 'treino' | 'outro';
  presencas: PresencaEvento[];
}

export interface PresencaEvento {
  jogadorId: string;
  confirmou: boolean;
  dataConfirmacao?: string;
}

export interface Noticia {
  id: string;
  titulo: string;
  conteudo: string;
  dataPublicacao: string;
  autorId: string;
  autorNome: string;
  autorFoto?: string;
  foto?: string;
  imagem?: string;
  visualizacoes: number;
  likes: number;
  comentarios: number;
  categoria: string;
  destaque?: boolean;
}

export interface Trofeu {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  cor: string;
  dataConquista: string;
}

export interface Medalha {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'bronze' | 'prata' | 'ouro';
  dataConquista: string;
}

export interface EstatisticasJogador {
  jogadorId: string;
  gols: number;
  assistencias: number;
  cartoesAmarelos: number;
  cartoesVermelhos: number;
  faltas: number;
  jogosDisponiveis: number;
  jogosCompareceu: number;
}