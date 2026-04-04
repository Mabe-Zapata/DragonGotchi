import { IMinigameProvider } from '../../domain/interfaces/ui-contracts.js';

export class DomMinigameProvider extends IMinigameProvider {
    constructor() {
        super();
        this.minigameContainer = document.getElementById('minijuego-container');
        this.gameFrame         = document.getElementById('gameFrame');
        this.open              = false;
    }

    startMinigame() {
        this.open = true;
        this.minigameContainer.hidden = false;
        if (!this.gameFrame.getAttribute('src')) {
            this.gameFrame.src = 'https://arcade.makecode.com/29587-22905-09020-25217';
        }
    }

    hideMinigame() {
        this.open = false;
        this.minigameContainer.hidden = true;
        this.gameFrame.src = '';
    }

    isOpen() {
        return this.open;
    }
}
