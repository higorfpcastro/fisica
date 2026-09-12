// Este arquivo NÃO precisa ser editado para atualizar conteúdo.
// Para adicionar/mudar conteúdos, edite data/curriculo.json e data/topicos.json.

const ROTULOS_SERIE = {
  "1_ano": "1º ano",
  "2_ano": "2º ano",
  "3_ano": "3º ano",
};

const ROTULOS_TIPO = {
  pdf: "PDF",
  video: "Vídeo",
  lista: "Lista",
  link: "Link",
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

function renderizarMateriais(materiais) {
  return materiais
    .map(
      (m) => `
      <li>
        <a href="${m.url}" target="_blank" rel="noopener">
          <span class="tag-tipo ${m.tipo}">${ROTULOS_TIPO[m.tipo] || m.tipo}</span>
          ${m.titulo}
        </a>
      </li>`
    )
    .join("");
}

function renderizarTopicos(idsTopicos, topicos, container) {
  if (!idsTopicos || idsTopicos.length === 0) {
    container.innerHTML = `<p class="aviso-vazio">Nenhum conteúdo cadastrado ainda para esta série neste ano letivo.</p>`;
    return;
  }

  container.innerHTML = idsTopicos
    .map((id, indice) => {
      const t = topicos[id];
      if (!t) {
        return `<div class="topico"><p class="aviso-vazio">Conteúdo "${id}" não encontrado em topicos.json.</p></div>`;
      }
      return `
        <div class="topico" data-aberto="false">
          <button class="topico-cabecalho" type="button" aria-expanded="false">
            <span class="topico-ordem">${String(indice + 1).padStart(2, "0")}</span>
            <span class="topico-titulo-bloco">
              <h3>${t.titulo}</h3>
              <p>${t.resumo}</p>
            </span>
            <span class="topico-toggle">ver materiais</span>
          </button>
          <div class="topico-materiais">
            <ul>${renderizarMateriais(t.materiais || [])}</ul>
          </div>
        </div>`;
    })
    .join("");

  container.querySelectorAll(".topico-cabecalho").forEach((botao) => {
    botao.addEventListener("click", () => {
      const topico = botao.closest(".topico");
      const aberto = topico.getAttribute("data-aberto") === "true";
      topico.setAttribute("data-aberto", String(!aberto));
      botao.setAttribute("aria-expanded", String(!aberto));
      botao.querySelector(".topico-toggle").textContent = aberto
        ? "ver materiais"
        : "fechar";
    });
  });
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
