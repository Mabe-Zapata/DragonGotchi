import { IAnimator } from '../../domain/interfaces/ui-contracts.js';
import { VideoManager } from '../video/video-manager.js';

export class DomAnimator extends IAnimator {
    constructor() {
        super();
        this.videoManager = new VideoManager();
        this.video = document.getElementById('tamagotchi-video');
    }

    cambiarAnimacion(nombre) {
        this.video.pause();
        const videoPath = this.videoManager.getVideoPath(nombre);
        this.video.src = videoPath;
        this.video.play();
    }

    mostrarAnimacionYActualizar(nombre, duracion) {
        this.cambiarAnimacion(nombre);
        return new Promise(resolve => setTimeout(resolve, duracion));
    }
}
