-- =====================================================================
-- FÍSICA — Site de apoio às aulas (Prof. Higor Castro)
-- Execute este arquivo inteiro em: Supabase > SQL Editor > New query
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- PERFIS
-- Hoje só existe o papel "professor" (você). O papel "aluno" já fica
-- pronto no banco para quando você quiser abrir login para os alunos no
-- futuro — não vai precisar mudar a estrutura, só criar os logins.
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null,
  papel text not null default 'aluno' check (papel in ('professor', 'aluno')),
  criado_em timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nome, papel)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', new.email),
    coalesce(new.raw_user_meta_data->>'papel', 'aluno')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.papel_atual()
returns text as $$
  select papel from public.profiles where id = auth.uid();
$$ language sql stable security definer;

-- ---------------------------------------------------------------------
-- PÁGINAS ESTÁTICAS (Cronograma, Horário, Contato, Astronomia, Dicas)
-- Uma linha por página; o professor edita o texto pelo painel.
-- ---------------------------------------------------------------------
create table if not exists public.paginas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null,
  corpo_html text not null default '',
  atualizado_em timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- TÓPICOS
-- Estrutura genérica usada por 1º/2º/3º Ano, Atividades, Simulações,
-- Tabelas e Tecnologia — todas essas seções são "tópicos" organizados
-- por ano, podendo ter subtópicos (ex.: "Leis de Newton" > "O que a
-- balança mede?"). Isso evita ter uma tela de administração diferente
-- para cada seção do menu.
-- ---------------------------------------------------------------------
create table if not exists public.topicos (
  id uuid primary key default gen_random_uuid(),
  categoria text not null check (categoria in ('conteudo', 'atividades', 'simulacoes', 'tabelas', 'tecnologia')),
  ano int not null check (ano in (1, 2, 3)),
  parent_id uuid references public.topicos (id) on delete cascade,
  titulo text not null,
  slug text not null unique,
  ordem int not null default 0,
  publicado boolean not null default true,
  criado_em timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- MATERIAIS
-- O conteúdo de dentro de cada tópico: slides incorporados, PDFs,
-- vídeos, texto livre ou imagens.
-- ---------------------------------------------------------------------
create table if not exists public.materiais (
  id uuid primary key default gen_random_uuid(),
  topico_id uuid not null references public.topicos (id) on delete cascade,
  tipo text not null check (tipo in ('embed', 'pdf', 'video', 'texto', 'imagem')),
  titulo text,
  conteudo text not null, -- código de incorporação, URL, ou texto, dependendo do tipo
  ordem int not null default 0,
  criado_em timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- NOTÍCIAS (mini-blog)
-- ---------------------------------------------------------------------
create table if not exists public.noticias (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  slug text not null unique,
  resumo text,
  corpo_html text not null default '',
  capa_url text,
  publicado boolean not null default true,
  publicado_em timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- DÚVIDAS (perguntas frequentes)
-- ---------------------------------------------------------------------
create table if not exists public.duvidas (
  id uuid primary key default gen_random_uuid(),
  pergunta text not null,
  resposta text not null,
  ordem int not null default 0
);

-- =====================================================================
-- ROW LEVEL SECURITY
-- Regra geral do site: qualquer visitante pode LER o conteúdo publicado
-- (sem precisar de login); só quem tem papel "professor" pode
-- criar/editar/excluir.
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.paginas enable row level security;
alter table public.topicos enable row level security;
alter table public.materiais enable row level security;
alter table public.noticias enable row level security;
alter table public.duvidas enable row level security;

create policy "profiles_select_own" on public.profiles for select
  using (id = auth.uid());

create policy "paginas_select" on public.paginas for select
  using (true);
create policy "paginas_write" on public.paginas for all
  using (public.papel_atual() = 'professor')
  with check (public.papel_atual() = 'professor');

create policy "topicos_select" on public.topicos for select
  using (publicado = true or public.papel_atual() = 'professor');
create policy "topicos_write" on public.topicos for all
  using (public.papel_atual() = 'professor')
  with check (public.papel_atual() = 'professor');

create policy "materiais_select" on public.materiais for select
  using (
    exists (
      select 1 from public.topicos t
      where t.id = materiais.topico_id
      and (t.publicado = true or public.papel_atual() = 'professor')
    )
  );
create policy "materiais_write" on public.materiais for all
  using (public.papel_atual() = 'professor')
  with check (public.papel_atual() = 'professor');

create policy "noticias_select" on public.noticias for select
  using (publicado = true or public.papel_atual() = 'professor');
create policy "noticias_write" on public.noticias for all
  using (public.papel_atual() = 'professor')
  with check (public.papel_atual() = 'professor');

create policy "duvidas_select" on public.duvidas for select
  using (true);
create policy "duvidas_write" on public.duvidas for all
  using (public.papel_atual() = 'professor')
  with check (public.papel_atual() = 'professor');

-- =====================================================================
-- PÁGINAS ESTÁTICAS INICIAIS (vazias — edite pelo painel /admin)
-- =====================================================================
insert into public.paginas (slug, titulo, corpo_html) values
  ('cronograma', 'Cronograma', '<p>Em breve.</p>'),
  ('horario', 'Horário', '<p>Em breve.</p>'),
  ('contato', 'Contato', '<p>Em breve.</p>'),
  ('astronomia', 'Astronomia', '<p>Em breve.</p>'),
  ('dicas', 'Dicas', '<p>Em breve.</p>')
on conflict (slug) do nothing;
