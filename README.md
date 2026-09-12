# Site de Física — Prof. Higor F. P. Castro

Site estático (HTML/CSS/JS puro, sem instalação de nada) para publicar
conteúdos de Física organizados por série, com a grade curricular separada
do conteúdo em si — assim, quando o conteúdo muda de série de um ano para o
outro, você edita só um arquivo pequeno, sem duplicar nada.

## Estrutura

```
.
├── index.html                 # a página em si (não precisa editar no dia a dia)
├── assets/
│   ├── css/style.css           # visual do site (não precisa editar no dia a dia)
│   └── js/site.js              # lógica de filtro (não precisa editar no dia a dia)
└── data/
    ├── curriculo.json          # QUAL série vê QUAL conteúdo, em cada ano letivo
    └── topicos.json            # o conteúdo de cada tópico (título, resumo, materiais)
```

**No dia a dia, você só vai mexer em `data/curriculo.json` e
`data/topicos.json`.** O resto é a "moldura" do site.

## 1. Publicando no GitHub Pages

1. Crie um repositório novo no GitHub (pode chamar, por exemplo,
   `site-fisica`).
2. Envie todos os arquivos e pastas deste projeto para a raiz do
   repositório, na branch `main`.
3. No repositório, vá em **Settings → Pages**.
4. Em "Source", escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
5. Salve. Em 1–2 minutos o GitHub mostra o link do site publicado, algo como
   `https://seu-usuario.github.io/site-fisica/`.

Pronto — a partir daí, qualquer alteração que você commitar na `main`
atualiza o site publicado automaticamente, sem nenhum passo extra.

## 2. Como adicionar ou editar um conteúdo (tópico)

Edite `data/topicos.json` direto pela interface do GitHub (não precisa
baixar nada): abra o arquivo no repositório, clique no ícone de lápis
("Edit"), adicione um novo bloco assim:

```json
"gravitacao": {
  "titulo": "Gravitação",
  "resumo": "Lei da gravitação universal e movimento orbital.",
  "materiais": [
    { "tipo": "pdf", "titulo": "Resumo teórico", "url": "https://..." },
    { "tipo": "video", "titulo": "Aula: órbitas", "url": "https://..." },
    { "tipo": "lista", "titulo": "Lista 8", "url": "https://..." }
  ]
}
```

- O nome antes dos dois-pontos (`gravitacao`) é o **id** do tópico — sem
  espaços ou acentos. É esse id que você vai usar em `curriculo.json`.
- `tipo` aceita: `pdf`, `video`, `lista` ou `link` (cada um ganha uma cor
  diferente automaticamente).
- `url` pode ser um link do Google Drive, YouTube, ou qualquer link público.
- Não esqueça a vírgula entre um bloco de tópico e outro.

## 3. Como mudar a grade do ano letivo (o problema que você descreveu)

Edite `data/curriculo.json`. Cada ano letivo é um bloco, e dentro dele cada
série lista os **ids** dos tópicos (na ordem em que devem aparecer):

```json
"2027": {
  "1_ano": ["introducao_fisica", "cinematica"],
  "2_ano": ["energia_trabalho", "ondulatoria"],
  "3_ano": ["leis_newton", "eletrodinamica"]
}
```

Se em 2027 você for dar Leis de Newton para o 3º ano em vez do 2º, é só
mover `"leis_newton"` de uma lista para a outra — o conteúdo em si (em
`topicos.json`) não muda nadinha.

Para adicionar um ano letivo novo (ex: 2028), copie o bloco de um ano
existente e ajuste as listas.

## 4. Testando no seu computador antes de publicar

Como o site carrega os arquivos `.json` via JavaScript, abrir o
`index.html` direto no navegador (clique duplo) não funciona — os
navegadores bloqueiam essa leitura por segurança quando o arquivo é aberto
localmente. Para testar antes de subir para o GitHub, rode no terminal,
dentro da pasta do projeto:

```bash
python3 -m http.server 8000
```

E acesse `http://localhost:8000` no navegador. (Depois de publicado no
GitHub Pages, isso não é mais necessário — funciona normal.)

## 5. Próximos passos possíveis

- Trocar os links `"#"` de `topicos.json` pelos links reais dos seus
  materiais (Google Drive, YouTube, etc.).
- Adicionar uma foto ou um texto mais pessoal na seção "Sobre" (dentro de
  `index.html`).
- Se no futuro você quiser editar o conteúdo por um formulário visual em vez
  de mexer direto no JSON, dá para conectar uma ferramenta de CMS sem
  servidor (ex: Decap CMS) por cima dessa mesma estrutura de arquivos — é
  só avisar quando quiser evoluir para isso.
