-- =====================================================================
-- Migração: cria um espaço de armazenamento ("bucket") para você poder
-- anexar PDFs e imagens direto pelo painel, em vez de precisar colar um
-- link externo. Cole no SQL Editor do Supabase e execute.
-- =====================================================================

-- Cria o bucket "materiais", público para leitura (assim os arquivos
-- podem ser vistos por qualquer visitante do site, sem precisar de
-- login) — só o professor pode enviar/apagar arquivos nele.
insert into storage.buckets (id, name, public)
values ('materiais', 'materiais', true)
on conflict (id) do nothing;

create policy "materiais_bucket_select" on storage.objects for select
  using (bucket_id = 'materiais');

create policy "materiais_bucket_insert" on storage.objects for insert
  with check (bucket_id = 'materiais' and public.papel_atual() = 'professor');

create policy "materiais_bucket_update" on storage.objects for update
  using (bucket_id = 'materiais' and public.papel_atual() = 'professor');

create policy "materiais_bucket_delete" on storage.objects for delete
  using (bucket_id = 'materiais' and public.papel_atual() = 'professor');
