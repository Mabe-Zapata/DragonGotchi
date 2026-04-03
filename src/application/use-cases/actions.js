class TamagotchiPersistenceUseCase {
    constructor(tamagotchi, repository, stateEvaluator) {
        this.tamagotchi = tamagotchi;
        this.repository = repository;
        this.stateEvaluator = stateEvaluator;
    }

    syncStateAndPersist() {
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

export class ActionUseCase extends TamagotchiPersistenceUseCase {

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
        const availability = this.tamagotchi.getActionAvailability?.();
        const actionState = availability?.[action];

        if (actionState && !actionState.enabled) {
            this.tamagotchi.notifier?.mostrarMensaje(actionState.reason);
            this.repository.save(this.tamagotchi);
            return this.tamagotchi;
        }

        this.tamagotchi[action]();

        return this.syncStateAndPersist();
    }
}

export class TickUseCase extends TamagotchiPersistenceUseCase {
    constructor(tamagotchi, repository, stateEvaluator, statsPresenter) {
        super(tamagotchi, repository, stateEvaluator);
        this.statsPresenter = statsPresenter;
    }

    execute() {
        if (!this.tamagotchi.vivo) return;
        
        const delta = {
            hambre: 10,
            energia: -10,
            aburrimiento: 5
        };

        const projectedState = this.tamagotchi.getProjectedAttributes(delta);
        const passiveHealthDelta = this.tamagotchi.calculatePassiveHealthDelta(projectedState);

        if (passiveHealthDelta !== 0) {
            delta.salud = (delta.salud || 0) + passiveHealthDelta;
        }

        this.tamagotchi.actualizarAtributos(delta);

        this.syncStateAndPersist();
        
        if (this.statsPresenter) {
            this.statsPresenter.actualizarBarras(this.tamagotchi);
        }
    }
}

export class MinigameRecoveryUseCase extends TamagotchiPersistenceUseCase {
    execute() {
        if (!this.tamagotchi.vivo) {
            return this.tamagotchi;
        }

        this.tamagotchi.actualizarAtributos({
            felicidad: 2,
            aburrimiento: -2
        });

        return this.syncStateAndPersist();
    }
}
