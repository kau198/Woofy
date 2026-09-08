# Woofy — interface

React 19, TypeScript, Vite, Tailwind CSS, Motion, GSAP e Lucide. O cliente de API usa sessão HttpOnly e a fonte de dados do aplicativo é o backend Python.

Na raiz do repositório:

```powershell
pnpm --dir frontend install --frozen-lockfile
pnpm --dir frontend dev
```

A API deve estar na porta 8000. O proxy do Vite atende `/api/v1`; a URL pode ser substituída por `VITE_API_URL`. `VITE_BASE_PATH` configura uma subpasta de hospedagem. O login Google recebe seu identificador público da API, sem chave secreta no frontend.

```powershell
pnpm --dir frontend lint
pnpm --dir frontend build
```

Consulte o [guia completo](../README.md) para iniciar o banco, configurar os serviços e publicar. O aplicativo protege as rotas privadas e exige adoção no primeiro acesso. As páginas públicas mantêm prévias visuais do produto, separadas dos dados reais da conta.
