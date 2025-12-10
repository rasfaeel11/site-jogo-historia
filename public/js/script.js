
let idDoJogoSalvo = null; 


async function comecarJogo() {
    

    const nomeDigitado = document.getElementById("inputNome").value;
    const classeSelecionada = document.getElementById("selectClasse").value;


    if(nomeDigitado === "") {
        alert("Digite um nome!");
        return;
    }

    console.log("Tentando criar jogo..."); // Bom para debugar (F12)

    
    const resposta = await fetch("http://localhost:3000/iniciar", {
        method: "POST", // O método HTTP
        headers: {
            "Content-Type": "application/json" // Avisa o back que vai chegar JSON
        },
        body: JSON.stringify({ // Transforma o objeto JS em texto JSON para viajar na rede
            nome: nomeDigitado,
            classe: classeSelecionada
        })
    });

   
    const dados = await resposta.json();

    if(resposta.status === 200) {
        // Se deu tudo certo (Status 200 OK)
        console.log("Sucesso! ID do jogo:", dados.gameId);
        
        // SALVA O ID NA VARIÁVEL GLOBAL
        idDoJogoSalvo = dados.gameId;

        // Atualiza a tela com os dados iniciais
        atualizarTela(dados.jogador, { nome: "Monstro", vidaAtual: "??" });

        // Troca as telas (Esconde menu, mostra jogo)
        document.getElementById("tela-menu").style.display = "none";
        document.getElementById("tela-jogo").style.display = "block";
    } else {
        // Se deu erro (Ex: Classe inválida)
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


function atualizarTela(heroi, inimigo) {

    document.getElementById("displayHeroi").innerText = 
        `${heroi.nome} (HP: ${heroi.vidaAtual}/${heroi.vidaMax || heroi.vidaAtual})`;
    
    document.getElementById("displayInimigo").innerText = 
        `${inimigo.nome} (HP: ${inimigo.vidaAtual})`;
}

function mostrarLogs(listaDeLogs) {
    const divLogs = document.getElementById("listaLogs");
    divLogs.innerHTML = ""; // Limpa os logs antigos

    // Para cada frase que o backend mandou...
    listaDeLogs.forEach(frase => {
        const p = document.createElement("p"); // Cria um <p>
        p.innerText = frase; // Põe o texto
        divLogs.appendChild(p); // Adiciona na div
    });
}

async function tentarFugir() {
    if(idDoJogoSalvo == null){
        alert("jogo nao iniciado");
        return;
    }
    const dados = await enviarAcaoParaBackend("FUGIR");
    atualizarTela(dados.heroi, dados.inimigo);
    mostrarLogs(dados.logs);
}

async function enviarAcaoParaBackend() {
    if (idDoJogoSalvo === null) {
        console.error("Sem ID de jogo!");
        return null;
    }

    const resposta = await fetch("http://localhost:3000/jogar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            acao: acaoNome,
            gameId: idDoJogoSalvo
        })
    });

    return await resposta.json(); // Retorna o objeto pronto (dados)
}}

async function ativarModoBerserker() {
    console.log("MODO BERSERKER!!");
    const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    let lutando = true;
    while(lutando){
        let acaoDoRobo = "ATACAR";
         if(resultado.heroi.vidaAtual < 50){
                console.log("vida baixa");
                acaoDoRobo= "CURAR";
            }
        const resultado =  await enviarAcaoParaBackend(acaoDoRobo);
        if(resultado == null || resultado.erro){
            console.log("fim de conexäo")
            lutando = false;
        } else{
            atualizarTela(resultado.heroi, resultado.inimigo);
            mostrarLogs(resultado.logs);
            lutando = resultado.jogoContinua;
        }
        await esperar(1000);
    }
}