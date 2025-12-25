// Dados fictícios para demonstração da PWA de futebol
import { 
  Usuario, 
  Jogador, 
  ComissaoTecnica, 
  Jogo, 
  Evento, 
  Noticia, 
  Trofeu, 
  Medalha 
} from '../types';

// Usuários fictícios
export const usuarios: Usuario[] = [
  {
    id: '1',
    nome: 'Carlos Silva',
    email: 'admin@time.com',
    tipo: 'administrador',
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    nome: 'João Santos',
    email: 'joao@time.com',
    tipo: 'jogador',
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  }
];

// Troféus disponíveis
export const trofeus: Trofeu[] = [
  {
    id: '1',
    nome: 'Artilheiro',
    descricao: 'Maior goleador do time',
    icone: '🏆',
    cor: 'gold',
    dataConquista: '2024-06-15'
  },
  {
    id: '2',
    nome: 'Melhor Jogador',
    descricao: 'Destaque da temporada',
    icone: '👑',
    cor: 'purple',
    dataConquista: '2024-07-01'
  },
  {
    id: '3',
    nome: 'Presença VIP',
    descricao: '100% de presença',
    icone: '⭐',
    cor: 'blue',
    dataConquista: '2024-07-10'
  }
];

// Medalhas disponíveis
export const medalhas: Medalha[] = [
  {
    id: '1',
    nome: 'Participação',
    descricao: 'Participou de 5 jogos',
    tipo: 'bronze',
    dataConquista: '2024-05-01'
  },
  {
    id: '2',
    nome: 'Assiduidade',
    descricao: 'Presença acima de 80%',
    tipo: 'prata',
    dataConquista: '2024-06-01'
  },
  {
    id: '3',
    nome: 'Excelência',
    descricao: 'Presença acima de 95%',
    tipo: 'ouro',
    dataConquista: '2024-07-01'
  }
];

// Jogadores fictícios
export const jogadores: Jogador[] = [
  {
    id: '2',
    nome: 'João Santos',
    posicao: 'Atacante',
    idade: 25,
    telefone: '(11) 99999-1111',
    percentualPresenca: 92,
    totalJogos: 12,
    jogosCompareceu: 11,
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    trofeus: [trofeus[0], trofeus[2]],
    medalhas: [medalhas[2]]
  },
  {
    id: '3',
    nome: 'Pedro Oliveira',
    posicao: 'Meio-campo',
    idade: 28,
    telefone: '(11) 99999-2222',
    percentualPresenca: 88,
    totalJogos: 12,
    jogosCompareceu: 10,
    foto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    trofeus: [trofeus[1]],
    medalhas: [medalhas[1]]
  },
  {
    id: '4',
    nome: 'Lucas Costa',
    posicao: 'Zagueiro',
    idade: 30,
    telefone: '(11) 99999-3333',
    percentualPresenca: 75,
    totalJogos: 12,
    jogosCompareceu: 9,
    foto: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face',
    trofeus: [],
    medalhas: [medalhas[0]]
  },
  {
    id: '5',
    nome: 'Rafael Ferreira',
    posicao: 'Goleiro',
    idade: 26,
    telefone: '(11) 99999-4444',
    percentualPresenca: 96,
    totalJogos: 12,
    jogosCompareceu: 11,
    foto: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=150&h=150&fit=crop&crop=face',
    trofeus: [trofeus[2]],
    medalhas: [medalhas[2]]
  },
  {
    id: '6',
    nome: 'André Silva',
    posicao: 'Lateral',
    idade: 24,
    telefone: '(11) 99999-5555',
    percentualPresenca: 85,
    totalJogos: 12,
    jogosCompareceu: 10,
    foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    trofeus: [],
    medalhas: [medalhas[1]]
  },
  {
    id: '7',
    nome: 'Bruno Santos',
    posicao: 'Meio-campo',
    idade: 27,
    telefone: '(11) 99999-6666',
    percentualPresenca: 78,
    totalJogos: 12,
    jogosCompareceu: 9,
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    trofeus: [],
    medalhas: [medalhas[0]]
  },
  {
    id: '8',
    nome: 'Carlos Oliveira',
    posicao: 'Atacante',
    idade: 23,
    telefone: '(11) 99999-7777',
    percentualPresenca: 92,
    totalJogos: 12,
    jogosCompareceu: 11,
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    trofeus: [trofeus[0]],
    medalhas: [medalhas[2]]
  },
  {
    id: '9',
    nome: 'Diego Costa',
    posicao: 'Zagueiro',
    idade: 29,
    telefone: '(11) 99999-8888',
    percentualPresenca: 88,
    totalJogos: 12,
    jogosCompareceu: 10,
    foto: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face',
    trofeus: [],
    medalhas: [medalhas[1]]
  },
  {
    id: '10',
    nome: 'Eduardo Lima',
    posicao: 'Goleiro',
    idade: 25,
    telefone: '(11) 99999-9999',
    percentualPresenca: 70,
    totalJogos: 12,
    jogosCompareceu: 8,
    foto: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=150&h=150&fit=crop&crop=face',
    trofeus: [],
    medalhas: [medalhas[0]]
  },
  {
    id: '11',
    nome: 'Carlos Silva',
    posicao: 'Técnico',
    idade: 45,
    telefone: '(11) 99999-0000',
    percentualPresenca: 100,
    totalJogos: 12,
    jogosCompareceu: 12,
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    trofeus: [trofeus[0], trofeus[1]],
    medalhas: [medalhas[0], medalhas[1]]
  }
];

// Comissão técnica
export const comissaoTecnica: ComissaoTecnica[] = [
  {
    id: '1',
    nome: 'Carlos Silva',
    cargo: 'Técnico Principal',
    foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    telefone: '(11) 99999-0000'
  },
  {
    id: '2',
    nome: 'Ana Costa',
    cargo: 'Auxiliar Técnica',
    foto: 'https://images.unsplash.com/photo-1494790108755-2616b332e234?w=150&h=150&fit=crop&crop=face',
    telefone: '(11) 99999-0001'
  }
];

// Jogos fictícios
export const jogos: Jogo[] = [
  {
    id: '1',
    adversario: 'FC Rivais',
    data: '2024-07-25',
    horario: '15:00',
    local: 'Estádio Municipal',
    status: 'agendado',
    presencas: [
      { jogadorId: '2', confirmou: true, dataConfirmacao: '2024-07-20' },
      { jogadorId: '3', confirmou: true, dataConfirmacao: '2024-07-21' },
      { jogadorId: '4', confirmou: false },
      { jogadorId: '5', confirmou: true, dataConfirmacao: '2024-07-20' }
    ]
  },
  {
    id: '2',
    adversario: 'Unidos FC',
    data: '2024-07-18',
    horario: '16:00',
    local: 'Campo do Bairro',
    status: 'finalizado',
    placarNos: 3,
    placarAdversario: 1,
    resultado: {
      gols: 3,
      golsAdversario: 1,
      cartoesAmarelos: 2,
      cartoesVermelhos: 0
    },
    detalhes: [
      {
        id: '1',
        jogadorId: '2',
        jogadorNome: 'João Santos',
        tipo: 'gol',
        minuto: 15
      },
      {
        id: '2',
        jogadorId: '2',
        jogadorNome: 'João Santos',
        tipo: 'gol',
        minuto: 34
      },
      {
        id: '3',
        jogadorId: '3',
        jogadorNome: 'Pedro Oliveira',
        tipo: 'assistencia',
        minuto: 34
      },
      {
        id: '4',
        jogadorId: '4',
        jogadorNome: 'Lucas Costa',
        tipo: 'cartao_amarelo',
        minuto: 67
      }
    ],
    presencas: [
      { jogadorId: '2', confirmou: true },
      { jogadorId: '3', confirmou: true },
      { jogadorId: '4', confirmou: true },
      { jogadorId: '5', confirmou: true }
    ]
  },
  {
    id: '3',
    adversario: 'Estrela do Sul',
    data: '2024-07-11',
    horario: '14:30',
    local: 'Centro Esportivo',
    status: 'finalizado',
    placarNos: 2,
    placarAdversario: 2,
    resultado: {
      gols: 2,
      golsAdversario: 2,
      cartoesAmarelos: 1,
      cartoesVermelhos: 0
    },
    detalhes: [
      {
        id: '5',
        jogadorId: '2',
        jogadorNome: 'João Santos',
        tipo: 'gol',
        minuto: 22
      },
      {
        id: '6',
        jogadorId: '3',
        jogadorNome: 'Pedro Oliveira',
        tipo: 'gol',
        minuto: 55
      }
    ],
    presencas: [
      { jogadorId: '2', confirmou: true },
      { jogadorId: '3', confirmou: true },
      { jogadorId: '4', confirmou: false },
      { jogadorId: '5', confirmou: true }
    ]
  }
];

// Eventos fictícios
export const eventos: Evento[] = [
  {
    id: '1',
    nome: 'Confraternização do Time',
    descricao: 'Encontro social para integração da equipe',
    data: '2024-07-28',
    horario: '19:00',
    local: 'Churrascaria do Centro',
    tipo: 'social',
    presencas: [
      { jogadorId: '2', confirmou: true, dataConfirmacao: '2024-07-20' },
      { jogadorId: '3', confirmou: false },
      { jogadorId: '4', confirmou: true, dataConfirmacao: '2024-07-21' },
      { jogadorId: '5', confirmou: true, dataConfirmacao: '2024-07-19' }
    ]
  },
  {
    id: '2',
    nome: 'Reunião Técnica',
    descricao: 'Análise dos últimos jogos e estratégias',
    data: '2024-07-22',
    horario: '20:00',
    local: 'Sede do Clube',
    tipo: 'reuniao',
    presencas: [
      { jogadorId: '2', confirmou: true, dataConfirmacao: '2024-07-20' },
      { jogadorId: '3', confirmou: true, dataConfirmacao: '2024-07-20' },
      { jogadorId: '4', confirmou: true, dataConfirmacao: '2024-07-20' },
      { jogadorId: '5', confirmou: false }
    ]
  }
];

// Notícias fictícias
export const noticias: Noticia[] = [
  {
    id: '1',
    titulo: 'Grande Vitória Contra o Unidos FC!',
    conteudo: 'Nosso time demonstrou excelente performance no último jogo, vencendo por 3x1. Destaque para João Santos com 2 gols e Pedro Oliveira com uma assistência decisiva. A equipe está evoluindo e mostrando grande entrosamento em campo.',
    dataPublicacao: '2024-07-18',
    autorId: '1',
    autorNome: 'Carlos Silva',
    autorFoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    foto: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=200&fit=crop',
    imagem: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=200&fit=crop',
    visualizacoes: 1247,
    likes: 89,
    comentarios: 23,
    categoria: 'Resultados',
    destaque: true
  },
  {
    id: '2',
    titulo: 'Próximo Jogo: FC Rivais',
    conteudo: 'Nosso próximo desafio será contra o FC Rivais no dia 25/07 às 15:00 no Estádio Municipal. É importante que todos confirmem presença com antecedência. Vamos com tudo buscar mais uma vitória!',
    dataPublicacao: '2024-07-20',
    autorId: '1',
    autorNome: 'Carlos Silva',
    autorFoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    foto: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=200&fit=crop',
    imagem: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=200&fit=crop',
    visualizacoes: 892,
    likes: 67,
    comentarios: 15,
    categoria: 'Jogos',
    destaque: false
  },
  {
    id: '3',
    titulo: 'Evento Social do Time',
    conteudo: 'Não esqueçam da confraternização do time no dia 28/07 às 19:00 na Churrascaria do Centro. Será uma ótima oportunidade para fortalecer os laços da equipe fora de campo. Confirmem presença!',
    dataPublicacao: '2024-07-19',
    autorId: '1',
    autorNome: 'Carlos Silva',
    autorFoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    foto: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=200&fit=crop',
    imagem: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=200&fit=crop',
    visualizacoes: 634,
    likes: 45,
    comentarios: 8,
    categoria: 'Eventos',
    destaque: false
  }
];