// Este arquivo NÃO precisa ser editado para atualizar conteúdo.
// Para adicionar/mudar conteúdos, edite data/curriculo.json e data/topicos.json.

const ROTULOS_SERIE = {
  "1_ano": "1º ano",
  "2_ano": "2º ano",
  "3_ano": "3º ano",
};

async function carregarDados() {
  const [curriculoResp, topicosResp] = await Promise.all([
    fetch("data/curriculo.json"),
    fetch("data/topicos.json"),
  ]);
  const curriculo = await curriculoResp.json();
  const topicos = await topicosResp.json();
  return { curriculo, topicos };
}

function popularSeletorAnos(curriculo, seletorAno) {
  const anos = Object.keys(curriculo).filter((k) => k !== "_leia_me");
  anos.sort().reverse(); // ano mais recente primeiro
  seletorAno.innerHTML = anos
    .map((ano) => `<option value="${ano}">${ano}</option>`)
    .join("");
}

function popularSeletorSeries(curriculo, anoSelecionado, seletorSerie) {
  const series = Object.keys(curriculo[anoSelecionado] || {});
  seletorSerie.innerHTML = series
    .map((s) => `<option value="${s}">${ROTULOS_SERIE[s] || s}</option>`)
    .join("");
}

function linhaAula(aula, numero) {
  const temLista = aula.exercicios_url && aula.exercicios_url !== "#" && aula.n_exercicios > 0;
  const colunaExercicios = temLista
    ? `<a href="${aula.exercicios_url}" target="_blank" rel="noopener">
         <span class="rotulo-completo">${aula.n_exercicios} exercícios</span>
         <span class="rotulo-curto">${aula.n_exercicios} ex.</span>
       </a>`
    : `<span class="sem-lista">
         <span class="rotulo-completo">sem lista ainda</span>
         <span class="rotulo-curto">sem lista</span>
       </span>`;

  return `
    <tr>
      <td class="col-numero">${numero}</td>
      <td class="col-titulo"><a href="${aula.conteudo_url}" target="_blank" rel="noopener">${aula.titulo}</a></td>
      <td class="col-exercicios">${colunaExercicios}</td>
    </tr>`;
}

function renderizarTopicos(idsTopicos, topicos, container) {
  if (!idsTopicos || idsTopicos.length === 0) {
    container.innerHTML = `<p class="aviso-vazio">Nenhum conteúdo cadastrado ainda para esta série neste ano letivo.</p>`;
    return;
  }

  container.innerHTML = idsTopicos
    .map((id) => {
      const t = topicos[id];
      if (!t) {
        return `<p class="aviso-vazio">Conteúdo "${id}" não encontrado em topicos.json.</p>`;
      }
      const linhas = (t.aulas || [])
        .map((aula, i) => linhaAula(aula, i + 1))
        .join("");

      return `
        <div class="grupo-topico">
          <div class="grupo-topico-titulo">
            <h3>${t.titulo}</h3>
            <span class="contagem">${(t.aulas || []).length} aula(s)</span>
          </div>
          <table class="tabela-aulas">
            <tbody>${linhas}</tbody>
          </table>
        </div>`;
    })
    .join("");
}

async function iniciar() {
  const seletorAno = document.getElementById("seletor-ano");
  const seletorSerie = document.getElementById("seletor-serie");
  const container = document.getElementById("lista-topicos");

  let dados;
  try {
    dados = await carregarDados();
  } catch (erro) {
    container.innerHTML = `<p class="aviso-vazio">Não foi possível carregar os conteúdos agora. Se você abriu este arquivo diretamente (file://), rode um servidor local — veja o README.</p>`;
    console.error(erro);
    return;
  }

  const { curriculo, topicos } = dados;

  function atualizarLista() {
    const ano = seletorAno.value;
    const serie = seletorSerie.value;
    const idsTopicos = (curriculo[ano] || {})[serie] || [];
    renderizarTopicos(idsTopicos, topicos, container);
  }

  popularSeletorAnos(curriculo, seletorAno);
  popularSeletorSeries(curriculo, seletorAno.value, seletorSerie);
  atualizarLista();

  seletorAno.addEventListener("change", () => {
    popularSeletorSeries(curriculo, seletorAno.value, seletorSerie);
    atualizarLista();
  });
  seletorSerie.addEventListener("change", atualizarLista);
}

document.addEventListener("DOMContentLoaded", iniciar);
