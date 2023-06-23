var dealerSum = 0; // Mão Dealer
var jogadorSum = 0; // Mão Jogador

var dealerAceCount = 0; // Valor do A para o dealer
var jogadorAceCount = 0; // Valor do A para o player

var virada;
var deck;

var podeJogar = true; // Permite que o player jogue enquanto a mão dele for menor que 21

let vitorias = Number(localStorage.getItem("contadorVitorias")) || 0; // Variável de vitórias
let derrotas = Number(localStorage.getItem("contadorDerrotas")) || 0; // Variável de derrotas

console.log("Vitórias:", vitorias);
console.log("Derrotas:", derrotas);

// Embaralha as cartas
window.onload = function ()
{
    buildDeck();
    shuffleDeck();
    startGame();
}

// Deck
function buildDeck() {
    let values = ["A", "2" , "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"] // C = Paus; D = Ouro; H = Coração; S = Espada
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for(let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);// A-C até K-C; A-D até K-D; A-H até K-K; A-S até K-S
        }
    }
}

// Embaralhar
function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);// (0-1) * 52 => (0<-52)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

// Quando abre o jogo 
function startGame() {
    virada = deck.pop();
    dealerSum += getValue(virada);
    dealerAceCount += checkAce(virada);
    // Regra do dealer receber cartas até atingir ou passar 17
    while(dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cartas/" + card + ".png"
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("cartas-dealer").append(cardImg);
    }
    console.log(dealerSum)

    for (let i = 0; i < 2; i ++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cartas/" + card + ".png"
        jogadorSum += getValue(card);
        jogadorAceCount += checkAce(card);
        document.getElementById("cartas-jogador").append(cardImg);
    }
    console.log(jogadorSum);
    document.getElementById("jogar").addEventListener("click", jogar);
    document.getElementById("manter").addEventListener("click", manter); 
}

// Recomeçar
function recomeçar() {
    location.reload() 
}

// Manter
function manter() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    jogadorSum = reduceAce(jogadorSum, jogadorAceCount);

    podeJogar = false;
    document.getElementById("virada").src = "./cartas/" + virada + ".png";

    let message = "";
    if (jogadorSum > 21) {
        message = "Você PERDEU!";
        incrementarDerrota();
    }
    else if (dealerSum > 21) {
        message = "Você VENCEU!";
        incrementarVitoria();
    }
    else if (jogadorSum == dealerSum) {
        message = "EMPATE!";
    }
    else if (jogadorSum > dealerSum) {
        message = "Você VENCEU!";
        incrementarVitoria();
    }
    else if (jogadorSum < dealerSum) {
        message = "Você PERDEU!";
        incrementarDerrota();
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("jogador-sum").innerText = jogadorSum;
    document.getElementById("resultado").innerText = message;
    document.getElementById("recomeçar").addEventListener("click", recomeçar);
    document.getElementById("recomeçar").style.display = "inline-block"
}

// Jogar
function jogar() {
    if (!podeJogar) {
        return; 
    }
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cartas/" + card + ".png"
    jogadorSum += getValue(card);
    jogadorAceCount += checkAce(card);
    document.getElementById("cartas-jogador").append(cardImg);

    if (reduceAce(jogadorSum, jogadorAceCount) > 21) {
        podeJogar = false;
    }
}

// Valor Carta
function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    //A, J, Q e K
    if (isNaN(value)) {
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

// Valor do A
function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

// Corrigindo valor do A para 10 ou 1
function reduceAce(jogadorSum, jogadorAceCount) {
    while (jogadorSum > 21 && jogadorAceCount > 0) {
        jogadorSum -= 10;
        jogadorAceCount -= 1;
    }
    return jogadorSum;
}

// Contador de vitorias + armazenamento no navegador
function incrementarVitoria() {
    let contadorVitorias = Number(localStorage.getItem('contadorVitorias')) || 0;
    contadorVitorias++;
    localStorage.setItem("contadorVitorias", contadorVitorias);
    document.getElementById("contadorVitorias").textContent = contadorVitorias;
}

// Contador de derrotas + armazenamento no navegador
function incrementarDerrota() {
    let contadorDerrotas = Number(localStorage.getItem('contadorDerrotas')) || 0;
    contadorDerrotas++;
    localStorage.setItem("contadorDerrotas", contadorDerrotas);
    document.getElementById("contadorDerrotas").textContent = contadorDerrotas;
}

// Exibição do placar
function exibirPlacar() {
    let vitorias = Number(localStorage.getItem("contadorVitorias")) || 0;
    let derrotas = Number(localStorage.getItem("contadorDerrotas")) || 0;
    document.getElementById("contadorVitorias").textContent = vitorias;
    document.getElementById("contadorDerrotas").textContent = derrotas;
}

// Atualização do placar para 0,001s
setInterval(exibirPlacar, 1)
