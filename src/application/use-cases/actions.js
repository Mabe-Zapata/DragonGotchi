export class ActionUseCase {
    constructor(tamagotchi, repository, stateEvaluator) {
        this.tamagotchi = tamagotchi;
        this.repository = repository;
        this.stateEvaluator = stateEvaluator;
    }

    alimentar() {
        return this.executeAction('alimentar');
    }

    jugar() {
        return this.executeAction('jugar');
    }

    dormir() {
        return this.executeAction('dormir');
    }

    curar() {
        return this.executeAction('curar');
    }

    executeAction(action) {
        this.tamagotchi[action]();

        if (this.tamagotchi.vivo && this.stateEvaluator) {
            const nuevoEstado = this.stateEvaluator.evaluate(this.tamagotchi);
            if (nuevoEstado) {
                this.tamagotchi.setEstado(nuevoEstado);
            }
        }

        this.repository.save(this.tamagotchi);
        return this.tamagotchi;
    }
}

export class TickUseCase {
    constructor(tamagotchi, repository, stateEvaluator, statsPresenter) {
        this.tamagotchi = tamagotchi;
        this.repository = repository;
        this.stateEvaluator = stateEvaluator;
        this.statsPresenter = statsPresenter;
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
        
        const nuevoEstado = this.stateEvaluator.evaluate(this.tamagotchi);
        if (nuevoEstado) {
            this.tamagotchi.setEstado(nuevoEstado);
        }

        this.repository.save(this.tamagotchi);
        
        if (this.statsPresenter) {
            this.statsPresenter.actualizarBarras(this.tamagotchi);
        }
    }
}
