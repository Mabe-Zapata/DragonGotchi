import { VideoManager } from '../video/video-manager.js';

export class DomUIProvider {
    constructor() {
        this.videoManager    = new VideoManager();
        this.video           = document.getElementById('tamagotchi-video');
        this.messageLog      = document.getElementById('log-mensajes');
        this.bars = {
            hunger:    document.getElementById('barra-hambre'),
            happiness: document.getElementById('barra-felicidad'),
            energy:    document.getElementById('barra-energia'),
            health:    document.getElementById('barra-salud'),
            boredom:   document.getElementById('barra-aburrimiento')
        };
        this.minigameContainer = document.getElementById('minijuego-container');
        this.gameFrame         = document.getElementById('gameFrame');
        this.clockContainer    = document.getElementById('tiempo-transcurrido');
    }

    showMessage(message) {
        this.messageLog.innerHTML     = `<p>${message}</p>`;
        this.messageLog.style.display = 'block';
        setTimeout(() => {
            this.messageLog.style.display = 'none';
        }, 3000);
    }

    changeAnimation(name, tamagotchi = null) {
        this.video.pause();
        const videoPath  = this.videoManager.getVideoPath(name, tamagotchi);
        this.video.src   = videoPath;
        this.video.play();
    }

    showAnimationAndUpdate(name, duration, tamagotchi = null) {
        this.changeAnimation(name, tamagotchi);
        return new Promise(resolve => setTimeout(resolve, duration));
    }

    updateBars(tamagotchi) {
        this.bars.hunger.style.width    = `${tamagotchi.hunger}%`;
        this.bars.happiness.style.width = `${tamagotchi.happiness}%`;
        this.bars.energy.style.width    = `${tamagotchi.energy}%`;
        this.bars.health.style.width    = `${tamagotchi.health}%`;
        this.bars.boredom.style.width   = `${tamagotchi.boredom}%`;
    }

    startMinigame() {
        this.minigameContainer.style.display = 'block';
        this.gameFrame.src = 'https://arcade.makecode.com/29587-22905-09020-25217';
    }

    hideMinigame() {
        this.minigameContainer.style.display = 'none';
    }

    lockButtons(lock) {
        const buttons = document.querySelectorAll('.botones button');
        buttons.forEach(button => {
            if (button.id !== 'curar') {
                button.style.display = lock ? 'none' : 'inline-block';
            }
        });
    }
}
