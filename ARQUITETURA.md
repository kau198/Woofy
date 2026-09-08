# Arquitetura — Woofy

O frontend React consome uma API FastAPI autenticada em `/api/v1`. O backend pode servir os arquivos compilados do frontend no mesmo domínio. Em desenvolvimento, Vite encaminha a API por proxy. Dados de conta não são persistidos no armazenamento do navegador.

O SQLAlchemy representa usuários, pets, tarefas, subtarefas, hábitos, marcações diárias, sessões de foco, transações de patinhas, acessórios, sessões de autenticação, conversas e mensagens de contato. SQLite atende ao desenvolvimento e PostgreSQL à hospedagem; Alembic versiona o esquema.

Cada consulta valida a propriedade do recurso no servidor. Mutações concorrentes da mesma conta usam bloqueio de linha no PostgreSQL e transação de escrita no SQLite. As recompensas fazem parte da mesma transação da ação e não podem ser repetidas por reabertura ou confirmação duplicada.

Senhas usam Argon2id. A sessão JWT fica em cookie HttpOnly e está associada a um registro revogável. As mutações exigem cabeçalho próprio e origem autorizada. Produção exige segredo próprio, cookies seguros e origens HTTPS. Recuperação por SMTP usa token aleatório de uso único, armazenado por hash e com expiração; redefinir a senha revoga as sessões existentes.

O foco registra início, pausas e retomadas no servidor. O tempo do navegador só representa o relógio visual. O servidor confirma o tempo acumulado antes de conceder as patinhas.

O chat envia ao provedor apenas o histórico recente, a mensagem atual e a rotina permitida pelo usuário. Respostas e sugestões são validadas com um contrato estruturado. As sugestões são exibidas, editadas e depois confirmadas em uma transação idempotente. O provedor não recebe acesso de escrita ao banco. O limite diário por conta também conta tentativas ao provedor.

Configuração, execução, serviços externos e limitações de publicação estão no [README](README.md).
