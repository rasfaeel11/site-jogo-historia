// Variável Global
let idDoJogoSalvo = null; 


async function enviarAcaoParaBackend(acaoNome) { // <--- CORREÇÃO 1: Adicionei (acaoNome)
    if (idDoJogoSalvo === null) {
        console.error("Sem ID de jogo!");
        return null;
    }

    try {
        const resposta = await fetch("http://localhost:3000/jogar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                acao: acaoNome,
                gameId: idDoJogoSalvo
            })
        });
        return await resposta.json();
    } catch (error) {
        console.error("Erro de conexão:", error);
        return { erro: "Falha na conexão com o servidor" };
    }
}


async function comecarJogo() {
    const nomeDigitado = document.getElementById("inputNome").value;
    const classeSelecionada = document.getElementById("selectClasse").value;

    if(nomeDigitado === "") {
        alert("Digite um nome!");
        return;
    }

    console.log("Tentando criar jogo...");

    const resposta = await fetch("http://localhost:3000/iniciar", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            nome: nomeDigitado, 
            classe: classeSelecionada 
        })
    });

    const dados = await resposta.json();

    if(resposta.status === 200) {
        console.log("Sucesso! ID do jogo:", dados.gameId);
        idDoJogoSalvo = dados.gameId;

        atualizarTela(dados.jogador, dados.inimigo);

        document.getElementById("tela-menu").style.display = "none";
        document.getElementById("tela-jogo").style.display = "block";
    } else {
        alert("Erro no backend: " + dados.erro);
    }
}

async function jogarTurno(acaoEscolhida) {
    if(idDoJogoSalvo === null) {
        alert("Erro: Jogo não iniciado.");
        return;
    }

    console.log("Enviando ação:", acaoEscolhida);

    const dados = await enviarAcaoParaBackend(acaoEscolhida);
    
    if (!dados || dados.erro) {
        alert("Erro: " + (dados ? dados.erro : "Falha na conexão"));
        return;
    }

    atualizarTela(dados.heroi, dados.inimigo);
    mostrarLogs(dados.logs);

    if (dados.jogoContinua === false) {
        alert("Fim de Jogo!");
    }
} 

async function tentarFugir() {
    if(idDoJogoSalvo == null){
        alert("jogo nao iniciado");
        return;
    }
    const dados = await enviarAcaoParaBackend("FUGIR");
    
    if(dados && !dados.erro) {
        atualizarTela(dados.heroi, dados.inimigo);
        mostrarLogs(dados.logs);
    }
}

async function ativarModoBerserker() {
    console.log("MODO BERSERKER!!");
    const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    let minhaVidaNaMemoria = 100;
    let lutando = true;

    while(lutando){
        let acaoDoRobo = "ATACAR";


        if(minhaVidaNaMemoria < 50){ 
            console.log("Vida baixa (" + minhaVidaNaMemoria + "), tentando curar...");
            acaoDoRobo = "CURAR";
        }


        const resultado = await enviarAcaoParaBackend(acaoDoRobo);

        if(resultado == null || resultado.erro){
            console.log("Fim de conexão ou erro");
            lutando = false;
        } else {
            atualizarTela(resultado.heroi, resultado.inimigo);
            mostrarLogs(resultado.logs);
            
            lutando = resultado.jogoContinua;
            
            // Atualiza a memória pro próximo loop
            minhaVidaNaMemoria = resultado.heroi.hp; 
        }
        
        await esperar(1000);
    }
}


function atualizarTela(heroi, inimigo) {
    if(heroi) {

        document.getElementById("displayHeroi").innerText = 
            `${heroi.nome} (HP: ${heroi.hp}/${heroi.hpMax || heroi.hp} MANA: ${heroi.mana}/${heroi.manaMax})`;
    }
    
    if(inimigo) {

        document.getElementById("displayInimigo").innerText = 
            `${inimigo.nome} (HP: ${inimigo.hp})`;
    }
}

function mostrarLogs(listaDeLogs) {
    const divLogs = document.getElementById("listaLogs");
    if(!listaDeLogs) return;

    divLogs.innerHTML = ""; 

    listaDeLogs.forEach(frase => {
        const p = document.createElement("p"); 
        p.innerText = frase; 
        divLogs.appendChild(p); 
    });
}