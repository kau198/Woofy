# Woofy — Frontend

Frontend responsivo do Woofy, um companheiro virtual para organizar tarefas, hábitos, estudos e rotinas de forma acolhedora e sem julgamentos.

## Tecnologias

- React 19 e TypeScript
- Vite
- Tailwind CSS 4
- React Router
- Lucide React
- Fetch API preparada para o backend FastAPI
- Ilustrações editoriais consistentes do Golden Retriever em diferentes estados

## Executar localmente

Requisitos: Node.js 20 ou superior e pnpm.

```bash
pnpm install
cp .env.example .env
pnpm dev
```

A aplicação será aberta em `http://localhost:5173`. Para gerar a versão de produção:

```bash
pnpm build
pnpm preview
```

## Variáveis de ambiente

| Variável | Uso | Padrão |
| --- | --- | --- |
| `VITE_API_URL` | URL base da API FastAPI | `http://localhost:8000/api/v1` |

Nenhuma chave de inteligência artificial deve ser adicionada ao frontend. Essa chave será mantida exclusivamente no backend.

## Rotas disponíveis

### Site institucional

- `/` — página inicial
- `/como-funciona` — explicação da jornada
- `/entrar` e `/criar-conta` — autenticação
- `/contato`, `/termos` e `/privacidade` — páginas institucionais

### Onboarding

- `/adocao` — boas-vindas, pelagem, gênero, nome, personalidade, objetivo e certificado

### Aplicativo

- `/app` — dashboard
- `/app/tarefas` — tarefas e criação de tarefa
- `/app/habitos` — hábitos
- `/app/foco` — temporizador funcional
- `/app/conversar` — conversa e confirmação de sugestões
- `/app/meu-pet` — personalização do pet
- `/app/acessorios` — catálogo de recompensas
- `/app/progresso` — métricas e gráficos
- `/app/perfil` e `/app/configuracoes` — conta e preferências

## Organização

```text
src/
├── components/   # componentes compartilhados e layouts
├── contexts/     # estado temporário da demonstração
├── data/         # dados centralizados de demonstração
├── pages/        # páginas das rotas públicas e autenticadas
├── services/     # cliente HTTP do backend
├── types/        # contratos TypeScript
├── App.tsx       # definição das rotas
├── index.css     # tema, componentes e responsividade
└── main.tsx      # composição dos providers
```

## Estado atual

Esta etapa prioriza a experiência frontend. Os fluxos estão navegáveis e as principais interações funcionam com estado em memória: conclusão de tarefas e hábitos, ganho de patinhas, timer, personalização do pet, criação de tarefas e confirmação de sugestões da IA.

O chat aceita texto livre, anexos locais de demonstração e entrada por voz simulada. Os modos “conversa livre”, “planejar”, “estudar” e “praticar idioma” são preferências opcionais, não bloqueios. O usuário também controla o nível de detalhes e se o contexto da rotina pode ser utilizado.

Os arquivos do mascote ficam em `public/mascots/`. O componente `Mascot.tsx` centraliza a escolha de estado e pelagem, permitindo substituir ou adicionar novas ilustrações sem alterar as páginas.

Ao integrar o backend, o contexto de demonstração será substituído por chamadas em `src/services/api.ts`, preservando os componentes e as rotas.
