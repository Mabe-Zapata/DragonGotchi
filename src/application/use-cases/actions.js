class TamagotchiPersistenceUseCase {
    constructor(tamagotchi, repository, stateEvaluator) {
        this.tamagotchi    = tamagotchi;
        this.repository    = repository;
        this.stateEvaluator = stateEvaluator;
    }

    syncStateAndPersist() {
        if (this.tamagotchi.alive && this.stateEvaluator) {
            const newState = this.stateEvaluator.evaluate(this.tamagotchi);
            if (newState) {
                this.tamagotchi.setState(newState);
            }
        }
        this.repository.save(this.tamagotchi);
        return this.tamagotchi;
    }
}

export class ActionUseCase extends TamagotchiPersistenceUseCase {

    feed()  { return this.executeAction('feed');  }
    play()  { return this.executeAction('play');  }
    sleep() { return this.executeAction('sleep'); }
    heal()  { return this.executeAction('heal');  }

    executeAction(action) {
        const availability  = this.tamagotchi.getActionAvailability?.();
        const actionState   = availability?.[action];

        if (actionState && !actionState.enabled) {
            this.tamagotchi.notifier?.showMessage(actionState.reason);
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
        if (!this.tamagotchi.alive) return;

        const delta = {
            hunger:  10,
            energy:  -10,
            boredom: 5
        };

        const projectedState    = this.tamagotchi.getProjectedAttributes(delta);
        const passiveHealthDelta = this.tamagotchi.calculatePassiveHealthDelta(projectedState);

        if (passiveHealthDelta !== 0) {
            delta.health = (delta.health || 0) + passiveHealthDelta;
        }

        this.tamagotchi.updateAttributes(delta);
        this.syncStateAndPersist();

        if (this.statsPresenter) {
            this.statsPresenter.updateBars(this.tamagotchi);
        }
    }
}

export class MinigameRecoveryUseCase extends TamagotchiPersistenceUseCase {
    execute() {
        if (!this.tamagotchi.alive) return this.tamagotchi;

        this.tamagotchi.updateAttributes({
            happiness: 2,
            boredom:   -2
        });

        return this.syncStateAndPersist();
    }
}
