export class VideoManager {
    constructor(basePath = './videos/') {
        this.basePath = basePath;
        this.sources = {
            aburrido: 'Aburrido.mp4',
            feliz: 'Feliz.mp4',
            hambriento: 'Hambriento.mp4',
            cansado: 'Cansado.mp4',
            muerto: 'Muerto.mp4',
            critico: 'Enfermo.mp4',
            comer: 'Comer.mp4',
            jugar: 'Jugar.mp4',
            dormir: 'Dormir.mp4',
            enojado: 'Enojado.mp4',
            triste: 'Triste.mp4',
            preocupado: 'Preocupado.mp4',
            inicio: 'inicio.mp4'
        };

        this.aliases = {
            enfermo: 'critico'
        };
    }

    getVideoPath(name, tamagotchi = null) {
        const resolvedName = this.resolveVideoName(name, tamagotchi);
        const fileName = this.sources[resolvedName] || '';
        return fileName ? `${this.basePath}${fileName}` : '';
    }

    resolveVideoName(name, tamagotchi = null) {
        const normalizedName = this.aliases[name] || name;

        if (this.sources[normalizedName] && this.isActionVideo(normalizedName)) {
            return normalizedName;
        }

        if (tamagotchi) {
            const contextualVideo = this.resolveContextualVideo(tamagotchi);
            if (contextualVideo) {
                return contextualVideo;
            }
        }

        if (this.sources[normalizedName]) {
            return normalizedName;
        }

        return this.sources.feliz ? 'feliz' : '';
    }

    isActionVideo(name) {
        return ['inicio', 'comer', 'jugar', 'dormir', 'muerto'].includes(name);
    }

    resolveContextualVideo(tamagotchi) {
        if (!tamagotchi.vivo && this.sources.muerto) {
            return 'muerto';
        }

        if (tamagotchi.salud < 30 && this.sources.critico) {
            return 'critico';
        }

        if (tamagotchi.hambre >= 90 && this.sources.hambriento) {
            return 'hambriento';
        }

        if (tamagotchi.salud < 70 && this.sources.preocupado) {
            return 'preocupado';
        }

        if (tamagotchi.energia <= 60 && this.sources.cansado) {
            return 'cansado';
        }

        if (tamagotchi.aburrimiento >= 70 && this.sources.aburrido) {
            return 'aburrido';
        }

        if (tamagotchi.felicidad <= 25 && this.sources.triste) {
            return 'triste';
        }

        if (tamagotchi.felicidad <= 45 && tamagotchi.aburrimiento >= 45 && this.sources.enojado) {
            return 'enojado';
        }

        if (tamagotchi.hambre >= 50 && this.sources.hambriento) {
            return 'hambriento';
        }

        return this.sources.feliz ? 'feliz' : '';
    }
}
