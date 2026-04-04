export class VideoManager {
    constructor(basePath = './videos/') {
        this.basePath = basePath;
        this.sources = {
            bored:    'Aburrido.mp4',
            happy:    'Feliz.mp4',
            hungry:   'Hambriento.mp4',
            tired:    'Cansado.mp4',
            dead:     'Muerto.mp4',
            critical: 'Enfermo.mp4',
            eat:      'Comer.mp4',
            play:     'Jugar.mp4',
            sleep:    'Dormir.mp4',
            angry:    'Enojado.mp4',
            sad:      'Triste.mp4',
            worried:  'Preocupado.mp4',
            start:    'inicio.mp4'
        };

        this.aliases = {
            sick: 'critical'
        };
    }

    getVideoPath(name, tamagotchi = null) {
        const resolvedName = this.resolveVideoName(name, tamagotchi);
        const fileName     = this.sources[resolvedName] || '';
        return fileName ? `${this.basePath}${fileName}` : '';
    }

    resolveVideoName(name, tamagotchi = null) {
        const normalizedName = this.aliases[name] || name;

        if (this.sources[normalizedName] && this.isActionVideo(normalizedName)) {
            return normalizedName;
        }

        if (tamagotchi) {
            const contextualVideo = this.resolveContextualVideo(tamagotchi);
            if (contextualVideo) return contextualVideo;
        }

        if (this.sources[normalizedName]) return normalizedName;

        return this.sources.happy ? 'happy' : '';
    }

    isActionVideo(name) {
        return ['start', 'eat', 'play', 'sleep', 'dead'].includes(name);
    }

    resolveContextualVideo(tamagotchi) {
        if (!tamagotchi.alive && this.sources.dead)          return 'dead';
        if (tamagotchi.health  <  30 && this.sources.critical)  return 'critical';
        if (tamagotchi.hunger  >= 90 && this.sources.hungry)    return 'hungry';
        if (tamagotchi.health  <  70 && this.sources.worried)   return 'worried';
        if (tamagotchi.energy  <= 60 && this.sources.tired)     return 'tired';
        if (tamagotchi.boredom >= 70 && this.sources.bored)     return 'bored';
        if (tamagotchi.happiness <= 25 && this.sources.sad)     return 'sad';
        if (tamagotchi.happiness <= 45 && tamagotchi.boredom >= 45 && this.sources.angry) return 'angry';
        if (tamagotchi.hunger  >= 50 && this.sources.hungry)    return 'hungry';
        return this.sources.happy ? 'happy' : '';
    }
}
