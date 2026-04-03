export class VideoManager {
    constructor(basePath = './videos/') {
        this.basePath = basePath;
        this.sources = {
            feliz: 'Feliz.mp4',
            hambriento: 'Hambriento.mp4',
            cansado: 'Cansado.mp4',
            muerto: 'Muerto.mp4',
            critico: 'Enfermo.mp4',
            comer: 'Comer.mp4',
            jugar: 'Jugar.mp4',
            dormir: 'Dormir.mp4',
            enojado: 'Enojado.mp4',
            triste: 'triste.mp4',
            preocupado: 'Preocupado.mp4',
            inicio: 'inicio.mp4'
        };
    }

    getVideoPath(name) {
        const fileName = this.sources[name] || '';
        return fileName ? `${this.basePath}${fileName}` : '';
    }
}
