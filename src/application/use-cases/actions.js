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
    constructor(tamagotchi, repository, stateEvaluator) {
        this.tamagotchi = tamagotchi;
        this.repository = repository;
        this.stateEvaluator = stateEvaluator;
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
        
        // OCP: El evaluador decide el nuevo estado basado en reglas externas
        const nuevoEstado = this.stateEvaluator.evaluate(this.tamagotchi);
        if (nuevoEstado) {
            this.tamagotchi.setEstado(nuevoEstado);
        }

        this.repository.save(this.tamagotchi);
        this.tamagotchi.ui.actualizarBarras(this.tamagotchi);
    }
}
