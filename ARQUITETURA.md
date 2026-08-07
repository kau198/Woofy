# Arquitetura proposta — Woofy

## Visão geral

O projeto será um monorepositório simples com duas aplicações independentes:

```text
woofy/
├── frontend/   # React, TypeScript, Vite e Tailwind CSS
└── backend/    # FastAPI, SQLAlchemy, Alembic e MySQL (próxima etapa)
```

O frontend nunca acessará o MySQL diretamente. Toda comunicação será feita por uma API REST autenticada. A integração com inteligência artificial ficará atrás do backend, que aplicará as regras de segurança, personalidade do pet e confirmação das ações sugeridas.

## Frontend

A interface é dividida em quatro superfícies:

1. site institucional público;
2. cadastro e login;
3. fluxo obrigatório de adoção;
4. aplicativo autenticado com navegação compartilhada.

Os contratos TypeScript representam usuários, pets, tarefas, hábitos e transações. Durante esta etapa, um contexto React mantém os dados de demonstração. Na integração, os componentes consumirão o cliente HTTP centralizado, com tokens JWT, tratamento consistente de erros e invalidação dos dados após mutações.

## Backend planejado

O backend seguirá camadas explícitas:

```text
backend/app/
├── core/          # configuração, segurança, limites e logs
├── database/      # engine, sessão e base dos modelos
├── models/        # entidades SQLAlchemy
├── schemas/       # contratos Pydantic de entrada e saída
├── repositories/  # consultas e persistência
├── services/      # regras de negócio e transações
├── routes/        # endpoints REST versionados
├── dependencies/  # usuário atual, sessão e autorização
└── integrations/  # provedor de IA
```

Rotas planejadas: `auth`, `users`, `pets`, `tasks`, `habits`, `focus-sessions`, `paws`, `accessories`, `conversations` e `progress`.

## Modelo de dados

O núcleo relacional segue o escopo informado:

- `users` possui um `pet` e `user_preferences` e possui muitas tarefas, hábitos, sessões, transações e conversas;
- `tasks` possui muitas `subtasks` e pode ser associada a sessões de foco;
- `habits` possui muitos `habit_logs`, com índice único por hábito e data;
- `accessories` se relaciona com usuários por `user_accessories`;
- `conversations` possui muitas `messages`;
- `paw_transactions` funciona como livro-razão: o saldo é a soma das transações, evitando divergência entre pontos concedidos e gastos.

Todas as tabelas pertencentes ao usuário terão índices por `user_id` e datas de consulta. E-mails serão únicos. Exclusões de usuário serão transacionais e em cascata para dados pessoais; acessórios globais não serão removidos. A propriedade do recurso será validada em toda consulta, nunca apenas na interface.

## Fluxo seguro da IA

```text
mensagem do usuário
→ backend carrega pet, preferências e contexto permitido
→ provedor gera resposta e sugestões estruturadas
→ resposta e sugestões são armazenadas
→ frontend mostra a prévia
→ usuário confirma “Adicionar estas tarefas”
→ backend valida novamente e cria os registros
```

A IA não receberá senha, token ou dados desnecessários e não fará mutações diretamente.

## Ordem de implementação

1. Frontend navegável e sistema visual — etapa atual.
2. Backend base, MySQL, migrações, autenticação e usuários.
3. Adoção persistida e proteção das rotas.
4. CRUD de tarefas, subtarefas e filtros.
5. Patinhas, modo foco e hábitos.
6. Conversas, integração com IA e confirmação de sugestões.
7. Acessórios, progresso, testes de integração e refinamento final.
