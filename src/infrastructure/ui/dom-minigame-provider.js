import { IMinigameProvider } from '../../domain/interfaces/ui-contracts.js';

export class DomMinigameProvider extends IMinigameProvider {
    constructor() {
        super();
        this.minijuegoContainer = document.getElementById('minijuego-container');
        this.gameFrame = document.getElementById('gameFrame');
        this.abierto = false;
    }

    iniciarMinijuego() {
        this.abierto = true;
        this.minijuegoContainer.hidden = false;

        if (!this.gameFrame.getAttribute('src')) {
            this.gameFrame.src = 'https://arcade.makecode.com/29587-22905-09020-25217';
        }
    }

    ocultarMinijuego() {
        this.abierto = false;
        this.minijuegoContainer.hidden = true;
        this.gameFrame.src = '';
    }

    estaAbierto() {
        return this.abierto;
    }
}
