import { IAnimator } from '../../domain/interfaces/ui-contracts.js';
import { VideoManager } from '../video/video-manager.js';

export class DomAnimator extends IAnimator {
    constructor() {
        super();
        this.videoManager            = new VideoManager();
        this.video                   = document.getElementById('tamagotchi-video');
        this.temporaryAnimationActive = false;
        this.pendingAnimation         = null;
        this.animationTimer           = null;
    }

    changeAnimation(name, tamagotchi = null) {
        if (this.temporaryAnimationActive) {
            this.pendingAnimation = { name, tamagotchi };
            return;
        }
        this.playAnimation(name, tamagotchi);
    }

    showAnimationAndUpdate(name, duration, tamagotchi = null) {
        if (this.animationTimer) {
            clearTimeout(this.animationTimer);
        }

        this.temporaryAnimationActive = true;
        this.playAnimation(name, tamagotchi);

        return new Promise(resolve => {
            this.animationTimer = setTimeout(() => {
                this.temporaryAnimationActive = false;

                const animationToSync = this.pendingAnimation
                    || (tamagotchi?.state ? { name: tamagotchi.state.getAnimationName(), tamagotchi } : null);

                this.pendingAnimation = null;
                this.animationTimer   = null;

                if (animationToSync) {
                    this.playAnimation(animationToSync.name, animationToSync.tamagotchi);
                }

                resolve();
            }, duration);
        });
    }

    playAnimation(name, tamagotchi = null) {
        const videoPath = this.videoManager.getVideoPath(name, tamagotchi);
        if (!videoPath || !this.video) return;

        this.video.pause();
        this.video.src = videoPath;
        this.video.play().catch(() => {});
    }
}
