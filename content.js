// ================================= BLOQUEIA PAGAMENTOS COM CAIXA FECHADO ================================
(() => {
  const textoAlvo = "Atenção! Seu caixa está fechado. Por favor, abra-o para receber esta conta.";

  function verificarParagrafos() {
    const paragrafos = document.querySelectorAll("p");
    for (let p of paragrafos) {
      if (p.textContent.trim().includes(textoAlvo)) {
        const divPagto = document.getElementById("pagtoConv");
        if (divPagto) {
          divPagto.hidden = true;
        }
        return;
      }
    }
  }

  const observer = new MutationObserver(() => verificarParagrafos());

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  verificarParagrafos();
})();


// ================================= CONTA PACIENTES AGENDADOS ================================
let ultimaQuantidadePacientes = -1;

function atualizarContadorPacientes() {

    const linhas = document.querySelectorAll("tr[id]");
    let quantidadePacientes = 0;

    linhas.forEach(tr => {

        // ignora linhas de bloqueio
        if (tr.className && tr.className.includes("bloq")) {
            return;
        }

        // procura o td com nome do paciente
        const nomePac = tr.querySelector(".nomePac");

        if (nomePac && nomePac.textContent.trim() !== "") {
            quantidadePacientes++;
        }

    });

    if (quantidadePacientes === ultimaQuantidadePacientes) return;
    ultimaQuantidadePacientes = quantidadePacientes;

    const painel = document.querySelector("div.panel.multipla-step-2");
    if (!painel) return;

    const antigo = document.querySelector(".contador-pacientes");
    if (antigo) antigo.remove();

    const contadorPac = document.createElement("div");
    contadorPac.className = "contador-pacientes";
    contadorPac.style.marginTop = "8px";
    contadorPac.style.marginLeft = "20px";
    contadorPac.style.fontWeight = "bold";
    contadorPac.style.color = "blue";
    contadorPac.textContent = `Total disponível: ${quantidadePacientes}`;

    painel.insertAdjacentElement("afterend", contadorPac);
}


// ================================= CONTADOR DE PROPOSTAS ================================
let ultimaQuantidade = -1;

const atualizarContador = () => {
    const quantidade = document.querySelectorAll("i.far.fa-edit").length;

    if (quantidade === ultimaQuantidade) return;
    ultimaQuantidade = quantidade;

    const titulos = document.querySelectorAll("span.panel-title");

    titulos.forEach(titulo => {
        if (titulo.textContent.includes(" Propostas Geradas")) {
            const contadorAntigo = titulo.querySelector(".contador-propostas");
            if (contadorAntigo) contadorAntigo.remove();

            const contador = document.createElement("span");
            contador.className = "contador-propostas";
            contador.style.marginLeft = "8px";
            contador.style.fontWeight = "bold";
            contador.style.color = "red";
            contador.textContent = `(${quantidade})`;

            titulo.appendChild(contador);
        }
    });
};

const observer = new MutationObserver(() => {
    atualizarContador();
    atualizarContadorPacientes();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

atualizarContadorPacientes();
