// Constantes do sistema

export const APP_NAME = 'DVFoot';
export const APP_DESCRIPTION = 'Sistema de Gestão de Futebol';

// Rotas
export const ROUTES = {
  // Públicas
  LOGIN: '/login',
  SELECAO_PERFIL: '/selecao-perfil',
  
  // Admin
  ADMIN: '/admin',
  ADMIN_ELENCO: '/admin/elenco',
  ADMIN_JOGOS: '/admin/jogos',
  ADMIN_EVENTOS: '/admin/eventos',
  
  // Jogador
  JOGADOR: '/jogador',
  JOGADOR_JOGOS: '/jogador/jogos',
  JOGADOR_EVENTOS: '/jogador/eventos',
} as const;

// Tipos de usuário
export const USER_TYPES = {
  ADMIN: 'administrador',
  PLAYER: 'jogador'
} as const;

// Posições de jogador
export const PLAYER_POSITIONS = {
  GOLEIRO: 'goleiro',
  ZAGUEIRO: 'zagueiro',
  LATERAL: 'lateral',
  MEIO_CAMPO: 'meio-campo',
  ATACANTE: 'atacante'
} as const;

// Status de jogos
export const GAME_STATUS = {
  AGENDADO: 'agendado',
  FINALIZADO: 'finalizado',
  CANCELADO: 'cancelado'
} as const;

// Tipos de evento
export const EVENT_TYPES = {
  SOCIAL: 'social',
  REUNIAO: 'reuniao',
  TREINO: 'treino',
  OUTRO: 'outro'
} as const;

// Cores por posição
export const POSITION_COLORS = {
  [PLAYER_POSITIONS.GOLEIRO]: 'bg-blue-100 text-blue-800',
  [PLAYER_POSITIONS.ZAGUEIRO]: 'bg-green-100 text-green-800',
  [PLAYER_POSITIONS.LATERAL]: 'bg-yellow-100 text-yellow-800',
  [PLAYER_POSITIONS.MEIO_CAMPO]: 'bg-purple-100 text-purple-800',
  [PLAYER_POSITIONS.ATACANTE]: 'bg-red-100 text-red-800'
} as const;

// Cores por percentual de presença
export const PRESENCE_COLORS = {
  EXCELLENT: 'text-green-600', // >= 90%
  GOOD: 'text-yellow-600',     // >= 75%
  POOR: 'text-red-600'         // < 75%
} as const;

// Opções de ordenação
export const SORT_OPTIONS = {
  NOME: 'nome',
  PRESENCA: 'presenca',
  IDADE: 'idade'
} as const;

// Modos de visualização
export const VIEW_MODES = {
  GRID: 'grid',
  LIST: 'list'
} as const;

// Limites de presença
export const PRESENCE_LIMITS = {
  EXCELLENT: 90,
  GOOD: 75
} as const;

// Configurações de paginação
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50
} as const;

// Configurações de cache
export const CACHE_CONFIG = {
  PLAYERS_TTL: 5 * 60 * 1000, // 5 minutos
  GAMES_TTL: 10 * 60 * 1000,  // 10 minutos
  EVENTS_TTL: 15 * 60 * 1000  // 15 minutos
} as const;

// Mensagens de erro
export const ERROR_MESSAGES = {
  LOAD_PLAYERS: 'Erro ao carregar jogadores',
  CREATE_PLAYER: 'Erro ao criar jogador',
  UPDATE_PLAYER: 'Erro ao atualizar jogador',
  DELETE_PLAYER: 'Erro ao excluir jogador',
  NETWORK_ERROR: 'Erro de conexão',
  UNAUTHORIZED: 'Acesso não autorizado',
  NOT_FOUND: 'Recurso não encontrado'
} as const;

// Mensagens de sucesso
export const SUCCESS_MESSAGES = {
  PLAYER_CREATED: 'Jogador criado com sucesso',
  PLAYER_UPDATED: 'Jogador atualizado com sucesso',
  PLAYER_DELETED: 'Jogador excluído com sucesso',
  LOGIN_SUCCESS: 'Login realizado com sucesso',
  LOGOUT_SUCCESS: 'Logout realizado com sucesso'
} as const;

// Configurações de validação
export const VALIDATION = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MIN_AGE: 16,
  MAX_AGE: 50,
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 15
} as const;

// Configurações de UI
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  HOVER_DELAY: 200,
  DEBOUNCE_DELAY: 500,
  TOAST_DURATION: 4000
} as const; 