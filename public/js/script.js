// VARIÁVEL GLOBAL
// Precisamos dela aqui fora para ela "sobreviver" entre as funções.
// É aqui que vamos guardar o UUID que o banco de dados vai gerar.
let idDoJogoSalvo = null; 

// ================================================================
// FUNÇÃO 1: INICIAR (POST /iniciar)
// ================================================================
async function comecarJogo() {
    
    // 1. CAPTURAR DADOS (DOM)
    // document.getElementById pega o elemento pelo ID do HTML
    // .value pega o que está escrito dentro dele
    const nomeDigitado = document.getElementById("inputNome").value;
    const classeSelecionada = document.getElementById("selectClasse").value;

    // Validação simples no front
    if(nomeDigitado === "") {
        alert("Digite um nome!");
        return;
    }

    console.log("Tentando criar jogo..."); // Bom para debugar (F12)

    // 2. FETCH (A Requisição)
    // O fetch é uma "Promessa" (Promise). Ele demora um pouco.
    // Por isso usamos 'await' (espere) e a função tem que ser 'async'.
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

    // 3. TRATAR RESPOSTA
    // O fetch retorna um fluxo de dados. Precisamos converter pra JSON.
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

// ================================================================
// FUNÇÃO 2: JOGAR O TURNO (POST /jogar)
// ================================================================
async function jogarTurno(acaoEscolhida) {
    // Segurança: só joga se tiver ID
    if(idDoJogoSalvo === null) {
        alert("Erro: Jogo não iniciado.");
        return;
    }

    console.log("Enviando ação:", acaoEscolhida);

    // Faz o fetch para a rota /jogar
    const resposta = await fetch("http://localhost:3000/jogar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            acao: acaoEscolhida,
            gameId: idDoJogoSalvo // <--- O SEGREDINHO: MANDAR O ID PRO BACK SABER QUEM É
        })
    });

    const dados = await resposta.json();

    if(resposta.status === 200) {
        // O backend devolve: { heroi, inimigo, historicoDeBatalha, jogoContinua }
        atualizarTela(dados.heroi, dados.inimigo);
        mostrarLogs(dados.logs);

        if(dados.jogoContinua === false) {
            alert("Fim de Jogo! Verifique o log.");
        }
    } else {
        alert("Erro: " + dados.erro);
    }
}

// ================================================================
// FUNÇÕES AUXILIARES (APENAS VISUAL)
// ================================================================
function atualizarTela(heroi, inimigo) {
    // Pega os spans e muda o texto dentro deles (.innerText)
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