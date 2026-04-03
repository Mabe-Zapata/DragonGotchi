import { Feliz, Hambriento, Cansado, Critico, Muerto } from '../../domain/states/tamagotchi-states.js';

export class ActionUseCase {
    constructor(tamagotchi, repository) {
        this.tamagotchi = tamagotchi;
        this.repository = repository;
    }

    alimentar() {
        this.tamagotchi.alimentar();
        this.repository.save(this.tamagotchi);
    }

    jugar() {
        this.tamagotchi.jugar();
        this.repository.save(this.tamagotchi);
    }

    dormir() {
        this.tamagotchi.dormir();
        this.repository.save(this.tamagotchi);
    }

    curar() {
        this.tamagotchi.curar();
        this.repository.save(this.tamagotchi);
    }
}

export class TickUseCase {
    constructor(tamagotchi, repository) {
        this.tamagotchi = tamagotchi;
        this.repository = repository;
    }

    execute() {
        if (!this.tamagotchi.vivo) return;
        
        const delta = {
            hambre: 10,
            energia: -10,
            aburrimiento: 5
        };
        
        if (this.tamagotchi.energia <= 20) {
            delta.salud = -0.5;
        }
        
        this.tamagotchi.actualizarAtributos(delta);
        this.tamagotchi.setEstado(this.evaluarEstado(this.tamagotchi));
        this.repository.save(this.tamagotchi);
        this.tamagotchi.ui.actualizarBarras(this.tamagotchi);
    }

    evaluarEstado(tamagotchi) {
        // Business logic for state evaluation
        if (tamagotchi.salud < 30 || tamagotchi.hambre > 80 || tamagotchi.energia <= 15) return new Critico(tamagotchi);
        if (tamagotchi.energia <= 30) return new Cansado(tamagotchi);
        if (tamagotchi.hambre >= 50) return new Hambriento(tamagotchi);
        return new Feliz(tamagotchi);
    }
}
