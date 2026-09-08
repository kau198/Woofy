# Segurança

Não publique credenciais em issues, pull requests, capturas de tela ou arquivos do repositório.

## Dados que ficam fora do Git

- arquivos `.env` e credenciais de serviços;
- chaves privadas e certificados pessoais;
- bancos SQLite, exportações, uploads e logs;
- tokens de sessão e dados reais de usuários.

Use os arquivos `.env.example` apenas como referência e configure valores reais no gerenciador de segredos da hospedagem. Variáveis do GitHub devem ser cadastradas em **Settings → Secrets and variables → Actions**.

## Se uma credencial for exposta

Revogue ou faça a rotação imediatamente no provedor original. Apagar apenas o arquivo ou o commit não invalida uma credencial já copiada. Depois da rotação, remova o valor de todo o histórico e revise os registros de acesso do serviço afetado.

## Relato de vulnerabilidade

Não abra uma issue pública com detalhes exploráveis ou dados pessoais. Use o relato privado de vulnerabilidade disponibilizado na aba **Security** do repositório.
