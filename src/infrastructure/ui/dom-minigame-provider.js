import { IMinigameProvider } from '../../domain/interfaces/ui-contracts.js';

export class DomMinigameProvider extends IMinigameProvider {
    constructor() {
        super();
        this.minijuegoContainer = document.getElementById('minijuego-container');
        this.gameFrame = document.getElementById('gameFrame');
        this.botonesLog = document.querySelectorAll(".botones button");
    }

    iniciarMinijuego() {
        this.minijuegoContainer.style.display = 'block';
        this.gameFrame.src = 'https://arcade.makecode.com/29587-22905-09020-25217';
        this.bloquearBotones(true);
    }

    ocultarMinijuego() {
        this.minijuegoContainer.style.display = 'none';
        this.bloquearBotones(false);
    }

    bloquearBotones(bloquear) {
        this.botonesLog.forEach(boton => {
            if (boton.id !== 'curar') {
                boton.style.display = bloquear ? 'none' : 'inline-block';
            }
        });
    }
}
