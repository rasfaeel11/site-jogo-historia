import { GameLoop } from "../service/CombatManager/GameLoop";

export let jogoAtual: GameLoop | null = null;

export function setJogoAtual(novoJogo: GameLoop){
    jogoAtual = novoJogo;
}

export function getJogoAtual(){
    if(!jogoAtual){
      jogoAtual = new GameLoop()
   }
    return jogoAtual;
}