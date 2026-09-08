<div align="center">
  <img src="frontend/public/woofy-logo-256.webp" alt="Woofy" width="132" />

  # Woofy

  **Organizar a vida pode ser mais leve quando você não sente que está fazendo tudo sozinho.**

  Um companheiro de rotina que transforma tarefas, hábitos e momentos de foco em uma jornada acolhedora ao lado do Doug.

  [![Verificar projeto](https://github.com/kau198/Woofy/actions/workflows/checks.yml/badge.svg)](https://github.com/kau198/Woofy/actions/workflows/checks.yml)
</div>

---

## Por que o Woofy existe

Muitas ferramentas de produtividade tratam a rotina como uma corrida: mais metas, mais números, mais cobrança. Mas há dias em que uma tarefa pequena já exige coragem — e nesses dias uma interface fria pode pesar ainda mais.

O Woofy nasceu de uma ideia simples e nobre: **a tecnologia deve ajudar as pessoas a cuidarem do próprio tempo sem transformar cada dia em uma prova de desempenho**.

Doug, o companheiro virtual do projeto, não existe para julgar atrasos. Ele acompanha o usuário, celebra avanços reais e ajuda a transformar planos grandes em próximos passos possíveis. O objetivo não é produzir a qualquer custo; é construir constância, autonomia e uma relação mais gentil com a própria rotina.

<div align="center">
  <img src="frontend/public/mascots/doug-real-excited.webp" alt="Doug, o companheiro do Woofy" width="260" />
</div>

## Uma experiência com propósito

- **Organização sem sobrecarga:** tarefas, prioridades, datas e subtarefas em um espaço claro.
- **Hábitos que respeitam o ritmo:** acompanhamento diário sem recompensas duplicadas ou atalhos artificiais.
- **Foco com presença:** sessões que podem ser pausadas e retomadas, mesmo após recarregar a página.
- **Progresso que ganha significado:** conquistas rendem patinhas para personalizar o Doug.
- **Conversas que viram ação:** o companheiro entende o contexto autorizado da rotina e sugere passos editáveis, sempre exigindo confirmação antes de criar algo.
- **Um vínculo pessoal:** adoção, nome, personalidade, pelagem, interesses e acessórios persistem em cada conta.

## O que já funciona

| Área | Recursos |
| --- | --- |
| Conta | Cadastro, login seguro, sessão revogável, login Google, recuperação de senha, exportação e exclusão dos dados |
| Rotina | Tarefas, subtarefas, prioridades, datas, horários, hábitos e lembretes dentro do aplicativo |
| Foco | Temporizador persistente com pausa, retomada, cancelamento e recompensa validada pelo servidor |
| Companhia | Conversas persistidas, modos de resposta, ditado, anexos de texto e sugestões estruturadas |
| Gamificação | Livro de patinhas, recompensas protegidas contra repetição, acessórios e personalização do pet |
| Plataforma | API Python, PostgreSQL, migrações, Docker, testes e verificações automáticas no GitHub |

## Identidade e tecnologia

O visual combina tons naturais, tipografia editorial, ilustrações próprias do Doug e movimento com propósito. As animações orientam a atenção e tornam a experiência viva sem transformar a interface em excesso de efeitos.

- **Interface:** React 19, TypeScript, Vite, Motion, GSAP e Lucide.
- **Servidor:** Python, FastAPI, SQLAlchemy e Alembic.
- **Dados:** SQLite no desenvolvimento e PostgreSQL em produção.
- **Segurança:** Argon2id, cookies HttpOnly, sessões revogáveis, proteção de origem e limites de uso.
- **Operação:** Docker, GitHub Actions, Dependabot e proteção contra envio de segredos.

## Começar no Windows

Requisitos: Python 3.11 ou superior, Node.js 24 e pnpm 11.19.

Na raiz do projeto:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e ".\backend[dev]"
Copy-Item backend/.env.example .env
```

Gere uma chave local e coloque o resultado em `SECRET_KEY` no arquivo `.env`:

```powershell
.\.venv\Scripts\python.exe -c "import secrets; print(secrets.token_urlsafe(48))"
```

Prepare o banco e inicie o servidor:

```powershell
.\.venv\Scripts\python.exe -m alembic -c backend/alembic.ini upgrade head
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Em outro terminal:

```powershell
pnpm --dir frontend install --frozen-lockfile
pnpm --dir frontend dev
```

Abra `http://localhost:5173`. Use sempre o mesmo hostname durante a sessão — não alterne entre `localhost` e `127.0.0.1`.

O banco local fica em `data/woofy.db` e nunca é enviado ao Git. Contas novas começam com 50 patinhas e sem conteúdo de demonstração.

## Serviços opcionais

Credenciais reais devem existir somente no `.env` local ou no gerenciador de segredos da hospedagem.

| Variável | Finalidade |
| --- | --- |
| `OPENAI_API_KEY` | Ativa as conversas reais do Doug |
| `OPENAI_MODEL` | Define o modelo usado pelo serviço de conversa |
| `CHAT_DAILY_LIMIT` | Limita solicitações por conta e por dia |
| `GOOGLE_CLIENT_ID` | Ativa o botão de login Google para origens autorizadas |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | Enviam links de recuperação de senha com STARTTLS |
| `PUBLIC_URL` | Define o endereço usado nos links de recuperação |

As conversas usam a [Responses API](https://developers.openai.com/api/docs/guides/text), saída estruturada e `store=false`. O histórico necessário para o produto permanece no banco do próprio Woofy. Sem uma chave configurada, o aplicativo informa que o serviço está indisponível em vez de simular uma resposta.

## Publicação

O GitHub Pages hospeda apenas arquivos estáticos e não executa a API Python. Para publicar o Woofy completo, use uma hospedagem compatível com o `Dockerfile` e conecte um PostgreSQL persistente. Servir interface e API no mesmo domínio oferece a experiência mais confiável.

Configuração mínima de produção:

```dotenv
APP_ENV=production
SECRET_KEY=<chave-aleatoria-com-pelo-menos-32-caracteres>
DATABASE_URL=postgresql+psycopg://usuario:senha@host:5432/woofy
FRONTEND_ORIGINS=https://seu-dominio.example
PUBLIC_URL=https://seu-dominio.example
COOKIE_SECURE=true
COOKIE_SAMESITE=lax
OPENAI_API_KEY=<configurada-no-gerenciador-de-segredos>
```

Para executar localmente com Docker e PostgreSQL:

```powershell
Copy-Item backend/.env.example .env
docker compose up --build -d
```

O aplicativo ficará em `http://localhost:8000`. O banco não expõe uma porta pública, e o contêiner aplica as migrações antes de iniciar o site.

O GitHub Pages sempre recebe a versão visual mais recente. Para que cadastro, login e áreas internas também funcionem nele, configure `WOOFY_API_URL` com a URL HTTPS da API terminada em `/api/v1`. Sem essa variável, as páginas públicas continuam atualizadas, mas os recursos que dependem do servidor informam indisponibilidade.

## Qualidade e segurança

```powershell
.\.venv\Scripts\python.exe -m pytest backend -q
.\.venv\Scripts\python.exe -m ruff check backend
.\.venv\Scripts\python.exe -m alembic -c backend/alembic.ini check
pnpm --dir frontend lint
pnpm --dir frontend build
```

As verificações executam o backend em SQLite e PostgreSQL, validam as migrações, compilam a interface e bloqueiam padrões comuns de credenciais em todo o histórico. Senhas usam Argon2id; sessões ficam em cookies HttpOnly e podem ser revogadas.

Arquivos `.env`, bancos, chaves privadas, uploads, exportações e logs ficam fora do Git. Consulte a [política de segurança](SECURITY.md) antes de configurar um ambiente real. Nunca use um banco de produção nos testes.

## Estrutura do projeto

```text
backend/app/          API, autenticação e regras do produto
backend/migrations/  Evolução versionada do banco de dados
backend/tests/       Testes de segurança, isolamento e funcionalidades
frontend/src/        Interface React e experiência do usuário
frontend/public/     Identidade visual, mascotes e vídeo
Dockerfile           Build e execução do aplicativo completo
compose.yaml         Ambiente local com PostgreSQL
.github/workflows/   Segurança, testes e publicação opcional
```

---

<div align="center">
  <strong>Woofy é um lembrete de que progresso também pode ter afeto.</strong><br />
  Pequenos passos continuam sendo passos.
</div>
