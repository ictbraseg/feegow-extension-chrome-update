(() => {

    // ================================= BLOQUEIA PAGAMENTOS COM CAIXA FECHADO ================================
    const textoAlvo = "Atenção! Seu caixa está fechado. Por favor, abra-o para receber esta conta.";

    function verificarBloqueio() {

        const encontrou = document.body.innerText.includes(textoAlvo);

        if (!encontrou) return;

        // Esconde a div de pagamento
        document.getElementById("pagtoConv")?.setAttribute("hidden", true);

        // Desabilita o input específico com id="valCredito"
        document.getElementById("valCredito")?.setAttribute("disabled", true);

        // Desabilita o botão "Utilizar Crédito"
        const btn = document.querySelector('button[onclick="applyCredit(this);"]');
        if (btn) btn.disabled = true;
    }


    // ================================= CONTA PACIENTES AGENDADOS ================================
    let ultimaQuantidadePacientes = -1;

    function atualizarPacientes() {
        const linhas = document.querySelectorAll("tr[id]");
        let quantidadePacientes = 0;

        linhas.forEach(tr => {

            // ignora linhas de bloqueio
            if (tr.className?.includes("bloq")) return;

            // procura o td com nome do paciente
            const nomePac = tr.querySelector(".nomePac");

            if (nomePac?.textContent.trim()) {
                quantidadePacientes++;
            }

        });

        if (quantidadePacientes === ultimaQuantidadePacientes) return;
        ultimaQuantidadePacientes = quantidadePacientes;

        const painel = document.querySelector("div.panel.multipla-step-2");
        if (!painel) return;

        let contadorPac = document.querySelector(".contador-pacientes");

        // cria só se não existir
        if (!contadorPac) {
            contadorPac = document.createElement("div");
            contadorPac.className = "contador-pacientes";
            contadorPac.style.cssText = "margin:8px 0 0 20px;font-weight:bold;color:blue;";
            painel.insertAdjacentElement("afterend", contadorPac);
        }

        contadorPac.textContent = `Total disponível: ${quantidadePacientes}`;
    }


    // ================================= CONTADOR DE PROPOSTAS ================================
    let ultimaQuantidadePropostas = -1;

    function atualizarPropostas() {
        const quantidade = document.querySelectorAll("i.far.fa-edit").length;

        if (quantidade === ultimaQuantidadePropostas) return;
        ultimaQuantidadePropostas = quantidade;

        document.querySelectorAll("span.panel-title").forEach(titulo => {

            if (!titulo.textContent.includes(" Propostas Geradas")) return;

            let contador = titulo.querySelector(".contador-propostas");

            // cria só se não existir
            if (!contador) {
                contador = document.createElement("span");
                contador.className = "contador-propostas";
                contador.style.cssText = "margin-left:8px;font-weight:bold;color:blue;";
                titulo.appendChild(contador);
            }

            contador.textContent = `Total: ${quantidade}`;
        });
    }


    // OBSERVER COM DEBOUNCE (evita execução excessiva)
    let timeout;

    const observer = new MutationObserver(() => {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            verificarBloqueio();
            atualizarPacientes();
            atualizarPropostas();
        }, 150);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });


    // primeira execução
    verificarBloqueio();
    atualizarPacientes();
    atualizarPropostas();

})();