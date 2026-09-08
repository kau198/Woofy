# Woofy

Organização pessoal com tarefas, hábitos, foco e um companheiro virtual personalizável. O projeto inclui o site React e a API Python, com contas e dados persistidos.

## O que está implementado

- Cadastro, login por senha com hash Argon2id, sessão HttpOnly revogável e logout.
- Login Google mediante configuração do cliente OAuth. Contas que já possuem senha não são vinculadas automaticamente por e-mail.
- Adoção, personalização do pet, interesses, tema e preferências salvos por conta.
- Criação, edição, exclusão, datas, prioridades e subtarefas.
- Hábitos com marcação diária pelo horário de Brasília.
- Foco com pausa, retomada e recuperação após recarregar a página. O servidor mede o tempo e concede a recompensa uma vez por sessão.
- Livro de patinhas, desbloqueio e seleção de acessórios. Concluir e reabrir uma tarefa ou hábito não gera recompensas repetidas.
- Conversas persistidas, modos de resposta, contexto opcional da rotina, anexos `.txt`/`.md` de até 12 KB e ditado quando suportado pelo navegador.
- Sugestões estruturadas do companheiro, editáveis e criadas somente após confirmação. Repetir a confirmação não duplica tarefas.
- Recuperação de senha por SMTP, exportação dos dados, exclusão da conta e formulário de contato persistido.
- Migrações, testes de integração, verificação automática no GitHub e imagem Docker para o site completo.

## Rodar no Windows

Requisitos: Python 3.11 ou superior, Node.js 24 e pnpm 11.19.

Na raiz do projeto:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -e ".\backend[dev]"
Copy-Item backend/.env.example .env
```

Edite `.env`. Gere sua `SECRET_KEY` com:

```powershell
.\.venv\Scripts\python.exe -c "import secrets; print(secrets.token_urlsafe(48))"
```

Depois inicie o banco e a API:

```powershell
.\.venv\Scripts\python.exe -m alembic -c backend/alembic.ini upgrade head
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Em outro terminal, também na raiz:

```powershell
pnpm --dir frontend install --frozen-lockfile
pnpm --dir frontend dev
```

Abra `http://localhost:5173`. O Vite encaminha `/api` para a API na porta 8000. Use o mesmo hostname durante a sessão: não alterne entre `localhost` e `127.0.0.1`.

O SQLite local fica em `data/woofy.db`. Contas novas começam sem tarefas de exemplo e com 50 patinhas de boas-vindas. Os antigos dados de demonstração do navegador não são importados automaticamente.

Para testar o site compilado em uma única porta, rode `pnpm --dir frontend build` antes de iniciar a API e abra `http://localhost:8000`.

## Ativar os serviços externos

As credenciais reais não fazem parte do repositório. Configure-as no `.env` local ou no gerenciador de segredos da hospedagem.

| Variável | Finalidade |
| --- | --- |
| `OPENAI_API_KEY` | Ativa as respostas reais; precisa de uma chave de projeto com crédito e acesso ao modelo. |
| `OPENAI_MODEL` | Modelo configurável; padrão `gpt-5.6-luna`. |
| `CHAT_DAILY_LIMIT` | Limite por conta/dia; padrão 40 solicitações. Tentativas ao provedor também contam. |
| `GOOGLE_CLIENT_ID` | Cliente OAuth Web autorizado para a origem do site. O botão aparece ao configurar esse valor no servidor. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` | Envio de links de recuperação com STARTTLS; porta padrão 587. |
| `PUBLIC_URL` | Endereço público do frontend usado nos links de recuperação. |

O chat usa a [Responses API](https://developers.openai.com/api/docs/guides/text) com saída estruturada, histórico recente e `store=false`. Isso desativa o armazenamento da resposta para recuperação pela API; não representa garantia de retenção zero no provedor. O Woofy mantém o histórico no próprio banco. A disponibilidade do modelo depende da sua conta; consulte o [catálogo oficial](https://developers.openai.com/api/docs/models).

Sem chave, o chat informa indisponibilidade; não gera respostas falsas. Sem SMTP, a recuperação informa que o serviço ainda não está disponível. O ditado depende do navegador e da permissão de microfone. Notícias e placares ao vivo não possuem busca web nesta versão.

## Publicar o site completo

O GitHub armazena o código. **GitHub Pages não executa Python nem hospeda o banco de dados.** Para o aplicativo completo, use uma hospedagem que execute o `Dockerfile` e um PostgreSQL persistente, de preferência com frontend e API no mesmo domínio.

Variáveis de produção:

```dotenv
APP_ENV=production
SECRET_KEY=<chave-aleatoria-com-pelo-menos-32-caracteres>
DATABASE_URL=postgresql+psycopg://usuario:senha@host:5432/woofy
FRONTEND_ORIGINS=https://seu-dominio.example
PUBLIC_URL=https://seu-dominio.example
COOKIE_SECURE=true
COOKIE_SAMESITE=lax
OPENAI_API_KEY=<chave-configurada-na-hospedagem>
OPENAI_MODEL=gpt-5.6-luna
```

A senha na URL de conexão deve estar codificada para URL. Use HTTPS na frente do serviço. O contêiner executa as migrações antes de subir e serve a interface compilada junto da API. A porta padrão é 8000, ou `PORT` quando fornecida pela hospedagem. Configure backup e retenção do PostgreSQL no provedor escolhido.

Para rodar o conjunto local com Docker e PostgreSQL, copie `backend/.env.example` para `.env`, preencha `POSTGRES_PASSWORD` com uma senha alfanumérica aleatória e rode:

```powershell
docker compose up --build -d
```

O conjunto local abre em `http://localhost:8000`. O banco não expõe porta pública. Não remova o volume `postgres-data` se quiser preservar as contas. A imagem final utiliza um usuário sem privilégios de administrador.

Se preferir manter o frontend no GitHub Pages, configure a variável de repositório `WOOFY_API_URL` com a URL HTTPS completa da API terminada em `/api/v1`. Configure a origem Pages em `FRONTEND_ORIGINS`, `COOKIE_SECURE=true` e `COOKIE_SAMESITE=none` quando os domínios forem diferentes. Navegadores que bloqueiam cookies de terceiros podem impedir esse arranjo; servir tudo no mesmo domínio evita essa dependência. Sem `WOOFY_API_URL`, o fluxo Pages é pulado para não publicar uma interface desconectada. O código e os testes continuam sendo enviados normalmente.

## Verificação

```powershell
.\.venv\Scripts\python.exe -m pytest backend -q
.\.venv\Scripts\python.exe -m ruff check backend
.\.venv\Scripts\python.exe -m alembic -c backend/alembic.ini check
pnpm --dir frontend lint
pnpm --dir frontend build
```

O GitHub executa os testes com SQLite e um PostgreSQL isolado. Os testes do provedor usam respostas controladas e verificam o contrato real da integração; não consomem crédito. Eles não substituem um teste com sua chave após a configuração. O limite de login é por processo; use também limites no proxy de entrada quando operar múltiplas instâncias.

Para mudanças de esquema, gere uma migração com `alembic -c backend/alembic.ini revision --autogenerate -m "Descricao"`, revise o arquivo e aplique `upgrade head`. Nunca aponte testes para um banco real. A suíte PostgreSQL exige um banco chamado `woofy_test`.

As mensagens do formulário ficam em `contact_messages` para consulta administrativa no banco; não há encaminhamento automático por e-mail. Os lembretes de tarefas, hábitos e pet aparecem com o app aberto e não são notificações push em segundo plano.

## Estrutura

```text
backend/app/          API, configuração, autenticação e regras do produto
backend/migrations/  Histórico versionado do banco
backend/tests/       Testes de conta, isolamento, foco, recompensas e chat
frontend/src/        Interface React
Dockerfile           Build e execução do site completo
compose.yaml         Ambiente local com PostgreSQL
.github/workflows/   Verificações e publicação opcional do frontend
```

Senhas, tokens, bancos locais e arquivos `.env` ficam fora do Git. A proteção das senhas segue a abordagem [FastAPI/pwdlib com Argon2](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/). O login Google valida assinatura, audiência, emissor e validade do ID token no servidor conforme a [documentação oficial](https://developers.google.com/identity/gsi/web/guides/verify-google-id-token).
