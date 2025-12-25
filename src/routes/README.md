# Sistema de Rotas - DVFoot

## 📋 **Estrutura de Rotas**

### 🔐 **Rotas Públicas**
- `/login` - Tela de login
- `/selecao-perfil` - Seleção de perfil (admin/jogador)

### 👨‍💼 **Rotas do Administrador**
- `/admin` - Dashboard principal
- `/admin/elenco` - Gestão de jogadores
- `/admin/jogos` - Gestão de jogos
- `/admin/eventos` - Gestão de eventos

### ⚽ **Rotas do Jogador**
- `/jogador` - Dashboard principal
- `/jogador/jogos` - Visualizar jogos
- `/jogador/eventos` - Visualizar eventos

## 🛡️ **Segurança**

### **Proteção de Rotas**
- Todas as rotas são protegidas por autenticação
- Verificação de permissões por tipo de usuário
- Redirecionamento automático para rotas apropriadas

### **Componentes de Segurança**
- `ProtectedRoute` - Proteção de rotas com verificação de permissões
- `useNavigation` - Hook para navegação segura
- `PublicRoute` - Rotas públicas com redirecionamento automático

## 🔄 **Fluxo de Navegação**

1. **Login** → `/login`
2. **Seleção de Perfil** → `/selecao-perfil`
3. **Dashboard** → `/admin` ou `/jogador`
4. **Navegação Interna** → Rotas específicas por perfil

## 📱 **Responsividade**

- **Mobile-first** design
- **Navegação inferior** em dispositivos móveis
- **Menu horizontal** em desktop
- **URLs limpas** e SEO-friendly

## 🚀 **Performance**

- **Lazy loading** de componentes
- **Code splitting** automático
- **Suspense** para loading states
- **Caching** de rotas

## 🔧 **Manutenção**

### **Adicionar Nova Rota**
1. Criar componente na pasta apropriada
2. Adicionar lazy import em `routes/index.tsx`
3. Adicionar rota no grupo correto (AdminRoutes/PlayerRoutes)
4. Atualizar menu de navegação se necessário

### **Modificar Permissões**
1. Editar `allowedRoles` no ProtectedRoute
2. Atualizar `useNavigation` hook se necessário
3. Testar redirecionamentos

### **Estrutura de Arquivos**
```
src/
├── routes/
│   ├── index.tsx          # Sistema principal de rotas
│   └── README.md          # Esta documentação
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx  # Proteção de rotas
│   └── navigation/
│       └── Navigation.tsx      # Componente de navegação
└── hooks/
    └── use-navigation.ts       # Hook de navegação segura
``` 