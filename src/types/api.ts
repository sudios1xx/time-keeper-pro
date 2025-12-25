/**
 * DTOs (contratos) para integração com backend.
 * A UI usa os tipos em `src/types/index.ts`.
 */

export type UserRoleDTO = 'jogador' | 'administrador';

export interface UsuarioDTO {
  id: string;
  nome: string;
  email: string;
  foto?: string;
  tipo: UserRoleDTO;
}

export interface TrofeuDTO {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  cor: string;
  dataConquista: string; // ISO
}

export type MedalhaTipoDTO = 'bronze' | 'prata' | 'ouro';

export interface MedalhaDTO {
  id: string;
  nome: string;
  descricao: string;
  tipo: MedalhaTipoDTO;
  dataConquista: string; // ISO
}

export interface JogadorDTO {
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
  trofeus: TrofeuDTO[];
  medalhas: MedalhaDTO[];
}

export interface PresencaJogoDTO {
  jogadorId: string;
  confirmou: boolean;
  dataConfirmacao?: string; // ISO
}

export interface JogoResultadoDTO {
  gols: number;
  golsAdversario: number;
  cartoesAmarelos: number;
  cartoesVermelhos: number;
}

export interface JogoDTO {
  id: string;
  adversario: string;
  data: string; // ISO
  horario: string;
  local: string;
  status: 'agendado' | 'finalizado';
  resultado?: JogoResultadoDTO;
  presencas: PresencaJogoDTO[];
}

export interface PresencaEventoDTO {
  jogadorId: string;
  confirmou: boolean;
  dataConfirmacao?: string; // ISO
}

export interface EventoDTO {
  id: string;
  nome: string;
  descricao?: string;
  data: string; // ISO
  horario: string;
  local: string;
  tipo: 'social' | 'reuniao' | 'treino' | 'outro';
  presencas: PresencaEventoDTO[];
}

export interface NoticiaDTO {
  id: string;
  titulo: string;
  conteudo: string;
  dataPublicacao: string; // ISO
  autorId: string;
  autorNome: string;
  autorFoto?: string;
  imagem?: string;
  visualizacoes: number;
  likes: number;
  comentarios: number;
  categoria: string;
  destaque?: boolean;
}








