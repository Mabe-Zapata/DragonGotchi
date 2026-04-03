import { IAnimator } from '../../domain/interfaces/ui-contracts.js';
import { VideoManager } from '../video/video-manager.js';

export class DomAnimator extends IAnimator {
    constructor() {
        super();
        this.videoManager = new VideoManager();
        this.video = document.getElementById('tamagotchi-video');
        this.animacionTemporalActiva = false;
        this.animacionPendiente = null;
        this.temporizadorAnimacion = null;
    }

    cambiarAnimacion(nombre, tamagotchi = null) {
        if (this.animacionTemporalActiva) {
            this.animacionPendiente = { nombre, tamagotchi };
            return;
        }

        this.reproducirAnimacion(nombre, tamagotchi);
    }

    mostrarAnimacionYActualizar(nombre, duracion, tamagotchi = null) {
        if (this.temporizadorAnimacion) {
            clearTimeout(this.temporizadorAnimacion);
        }

        this.animacionTemporalActiva = true;
        this.reproducirAnimacion(nombre, tamagotchi);

        return new Promise(resolve => {
            this.temporizadorAnimacion = setTimeout(() => {
                this.animacionTemporalActiva = false;

                const animacionASincronizar = this.animacionPendiente
                    || (tamagotchi?.estado ? { nombre: tamagotchi.estado.getAnimationName(), tamagotchi } : null);

                this.animacionPendiente = null;
                this.temporizadorAnimacion = null;

                if (animacionASincronizar) {
                    this.reproducirAnimacion(animacionASincronizar.nombre, animacionASincronizar.tamagotchi);
                }

                resolve();
            }, duracion);
        });
    }

    reproducirAnimacion(nombre, tamagotchi = null) {
        const videoPath = this.videoManager.getVideoPath(nombre, tamagotchi);

        if (!videoPath || !this.video) {
            return;
        }

        this.video.pause();
        this.video.src = videoPath;
        this.video.play().catch(() => {});
    }
}
