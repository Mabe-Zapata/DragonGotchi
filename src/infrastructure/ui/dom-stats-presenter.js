import { IStatsPresenter } from '../../domain/interfaces/ui-contracts.js';

export class DomStatsPresenter extends IStatsPresenter {
    constructor() {
        super();
        this.barras = {
            hambre: document.getElementById('barra-hambre'),
            felicidad: document.getElementById('barra-felicidad'),
            energia: document.getElementById('barra-energia'),
            salud: document.getElementById('barra-salud'),
            aburrimiento: document.getElementById('barra-aburrimiento')
        };
    }

    actualizarBarras(tamagotchi) {
        this.barras.hambre.style.width = `${tamagotchi.hambre}%`;
        this.barras.felicidad.style.width = `${tamagotchi.felicidad}%`;
        this.barras.energia.style.width = `${tamagotchi.energia}%`;
        this.barras.salud.style.width = `${tamagotchi.salud}%`;
        this.barras.aburrimiento.style.width = `${tamagotchi.aburrimiento}%`;
    }
}
