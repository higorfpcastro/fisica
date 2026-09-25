# Física — Site de apoio às aulas

Site de conteúdo para as aulas de Física do Ensino Médio (Prof. Higor Castro).
Navegação pública sem necessidade de login; uma área `/admin` restrita ao
professor, para publicar tópicos, materiais, notícias e páginas.

Stack: **Next.js** (App Router) + **Supabase** (banco de dados Postgres,
autenticação e políticas de segurança por linha). Hospedagem gratuita na
**Vercel**, código versionado no **GitHub** — mesmo modelo usado no projeto
Elo, mas este é um repositório e projeto Supabase totalmente separados.

## 1. Criar o projeto no Supabase

1. Crie uma conta gratuita em [supabase.com](https://supabase.com) e clique em "New project".
2. Escolha a região mais próxima (South America — São Paulo, se disponível).
3. Depois de criado, vá em **SQL Editor → New query**, cole todo o conteúdo
   de [`supabase/schema.sql`](./supabase/schema.sql) e execute (Run). Isso
   cria as tabelas, as regras de segurança e algumas páginas estáticas
   vazias, prontas para você editar.
4. Em **Project Settings → API**, copie a **Project URL** e a chave
   **anon public** (ou **Publishable key**, em painéis mais novos).

### Criar seu próprio login (professor)

1. Vá em **Authentication → Users → Add user**.
2. Preencha seu e-mail e uma senha.
3. No campo de metadata, adicione:
   ```json
   { "nome": "Higor Castro", "papel": "professor" }
   ```
4. Marque "Auto Confirm User", se essa opção aparecer.

Esse é o único login que existe por enquanto — o site inteiro é público
para leitura, só a edição de conteúdo é restrita a quem tiver
`papel = "professor"`.

## 2. Rodar localmente

```bash
npm install
cp .env.local.example .env.local
# edite .env.local com a URL e a chave do seu projeto Supabase
npm run dev
```

Acesse `http://localhost:3000` para o site público, e `http://localhost:3000/login`
para entrar como professor.

## 3. Subir para o GitHub

```bash
git init
git add .
git commit -m "Primeira versão do site de Física"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/fisica-app.git
git push -u origin main
```

Crie o repositório vazio antes no GitHub. Se preferir subir pela interface
web (arrastando os arquivos), lembre-se de fazer o upload direto na tela
inicial do repositório (raiz), não dentro de nenhuma subpasta.

## 4. Publicar com a Vercel

1. Crie uma conta gratuita em [vercel.com](https://vercel.com) usando login do GitHub.
2. **Add New → Project** → selecione o repositório `fisica-app`.
3. Em "Environment Variables", adicione `NEXT_PUBLIC_SUPABASE_URL` e
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy. A partir daí, cada `git push` publica uma nova versão sozinho.

## Como usar o painel (`/admin`)

- **Conteúdo (1º/2º/3º Ano), Atividades, Simulações, Tabelas, Tecnologia**:
  todas usam a mesma estrutura de "tópicos" — você cria um tópico (ex.:
  "Cinemática"), opcionalmente adiciona subtópicos dentro dele (ex.: "MRU",
  "MRUV"), e dentro de cada tópico adiciona os materiais: slides
  incorporados (cole o código `<iframe>` do Google Slides/Canva/PowerPoint
  Online), vídeos (URL de embed do YouTube), PDFs e imagens (envie o
  arquivo direto pelo painel, ou cole um link externo, o que for mais
  fácil) ou texto livre.
- **Páginas estáticas** (Cronograma, Horário, Astronomia, Dicas, Contato):
  um campo de texto/HTML simples por página.
- **Notícias**: funciona como um mini-blog, com título, resumo, imagem de
  capa opcional e conteúdo.
- **Dúvidas**: perguntas e respostas simples, uma abaixo da outra.

Cada tópico/notícia tem um botão que alterna entre "Publicado" e
"Rascunho" — um rascunho só aparece pra você, logado; o público só vê o
que estiver como "Publicado".

### Anexar PDFs e imagens

Rode `supabase/migracao_storage.sql` no SQL Editor — ela cria o espaço de
armazenamento de arquivos no Supabase (gratuito até 1GB no plano free).
Depois disso, ao adicionar um material do tipo **PDF** ou **Imagem**, use
o campo "Ou envie um arquivo" para anexar direto do seu computador, em
vez de precisar hospedar em outro lugar e colar um link.

### Como incorporar slides (Google Slides, Canva, PowerPoint)

No Google Slides: Arquivo → Publicar na web → Incorporar → copie o código
`<iframe>...</iframe>` inteiro e cole no campo "Link, código de embed ou
texto" ao adicionar um material do tipo **Slide incorporado**. O mesmo
vale para Canva (Compartilhar → Incorporar) e PowerPoint Online.

## Deixando pronto para alunos logarem no futuro

A tabela `profiles` já tem um papel `"aluno"`, mas hoje nada usa isso —
todo o site é público. Quando você quiser abrir uma área exclusiva para
alunos logados (por exemplo, listas de exercícios ou gabaritos só para
quem está logado), essa é a mudança necessária:

1. Criar os logins dos alunos (Authentication → Users, com
   `papel: "aluno"` no metadata) — ou construir uma tela de cadastro,
   se preferir que eles se cadastrem sozinhos.
2. Marcar quais materiais são "só para alunos logados" (adicionar uma
   coluna `restrito boolean` na tabela `materiais`) e ajustar a política
   de segurança (RLS) correspondente.

Nenhuma dessas mudanças exige reconstruir o site — é só evolução da
mesma base.

## Estrutura do projeto

```
src/app/ano/[ano]/            1º/2º/3º Ano — lista de tópicos
src/app/topico/[slug]/        página de um tópico (materiais + subtópicos)
src/app/atividades/[ano]/     Atividades por ano
src/app/simulacoes/[ano]/     Simulações por ano
src/app/tabelas/[ano]/        Tabelas por ano
src/app/tecnologia/[ano]/     Tecnologia e Inovação por ano
src/app/astronomia/           página estática
src/app/cronograma/           página estática
src/app/horario/              página estática
src/app/contato/              página estática
src/app/dicas/                página estática
src/app/noticias/             lista + posts
src/app/duvidas/              FAQ
src/app/login/                login do professor
src/app/admin/                painel (protegido por middleware)
src/lib/supabase/             clientes Supabase (navegador e servidor)
src/lib/topicos.ts            helper de busca de tópicos por categoria/ano
src/lib/slug.ts               gerador de slug a partir do título
src/middleware.ts             protege só a área /admin
supabase/schema.sql           todo o banco de dados e as regras de acesso
```

## Próximos passos sugeridos

- Upload de arquivos direto pelo painel (Supabase Storage), em vez de
  precisar colar uma URL externa para PDFs/imagens.
- Área de login para alunos (ver seção acima).
- Busca por palavra-chave no conteúdo do site.
