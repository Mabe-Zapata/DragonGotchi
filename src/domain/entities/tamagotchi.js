import { Dead } from '../states/tamagotchi-states.js';

export class Tamagotchi {
    constructor(name, initialState = {}) {
        this.name        = name || 'Tamagotchi';
        this.hunger      = initialState.hunger      ?? 0;
        this.boredom     = initialState.boredom     ?? 0;
        this.energy      = initialState.energy      ?? 100;
        this.happiness   = initialState.happiness   ?? 100;
        this.health      = initialState.health      ?? 100;
        this.age         = initialState.age         ?? 0;
        this.alive       = initialState.alive       ?? true;
        this.clock       = null; // Will be injected or managed via use case
        this.state       = null; // Set via state machine

        // Callback interfaces (Adapters)
        this.onStateChange = null;
        this.onAction      = null;
    }

    setUI(notifier, animator, minigame) {
        this.notifier  = notifier;
        this.animator  = animator;
        this.minigame  = minigame;
    }

    setState(state) {
        this.state = state;
        if (this.animator) {
            this.animator.changeAnimation(this.state.getAnimationName(), this);
        }
    }

    feed() {
        if (!this.alive) return;
        this.state.feed(this);
    }

    play() {
        if (!this.alive) return;
        this.state.play(this);
    }

    sleep() {
        if (!this.alive) return;
        this.state.sleep(this);
    }

    heal() {
        if (!this.alive) return;
        this.state.heal(this);
    }

    die() {
        if (!this.alive && this.state instanceof Dead) {
            return;
        }
        this.alive = false;
        this.setState(new Dead(this));
        if (this.notifier) {
            this.notifier.showMessage(`${this.name} ha fallecido. 💀`);
        }
    }

    updateAttributes(delta) {
        if (!this.alive) return;
        this.hunger    = Math.min(100, Math.max(0, this.hunger    + (delta.hunger    || 0)));
        this.energy    = Math.min(100, Math.max(0, this.energy    + (delta.energy    || 0)));
        this.health    = Math.min(100, Math.max(0, this.health    + (delta.health    || 0)));
        this.boredom   = Math.min(100, Math.max(0, this.boredom   + (delta.boredom   || 0)));
        this.happiness = Math.min(100, Math.max(0, this.happiness + (delta.happiness || 0)));

        if (this.health <= 0) {
            this.die();
        }
    }

    getProjectedAttributes(delta = {}) {
        const clamp = (value, change = 0) => Math.min(100, Math.max(0, value + change));
        return {
            hunger:    clamp(this.hunger,    delta.hunger    || 0),
            energy:    clamp(this.energy,    delta.energy    || 0),
            health:    clamp(this.health,    delta.health    || 0),
            boredom:   clamp(this.boredom,   delta.boredom   || 0),
            happiness: clamp(this.happiness, delta.happiness || 0)
        };
    }

    calculatePassiveHealthDelta(projectedAttributes = this) {
        if (!this.alive) return 0;

        const { hunger, energy, health, boredom, happiness } = projectedAttributes;

        const hasHighHunger    = hunger    >= 60;
        const hasExtremeHunger = hunger    >= 85;
        const isTired          = energy    <= 30;
        const isExhausted      = energy    <= 10;
        const isStressed       = happiness <= 35 || boredom >= 65;
        const isVeryStressed   = happiness <= 20 || boredom >= 80;
        const isWellCared      = hunger <= 25 && energy >= 75 && happiness >= 70 && boredom <= 25;

        let healthDelta = 0;

        if (hasExtremeHunger)      healthDelta -= 2.5;
        else if (hasHighHunger)    healthDelta -= 1;

        if (isExhausted)           healthDelta -= 3;
        else if (isTired)          healthDelta -= 1.5;

        if (happiness <= 25)       healthDelta -= 1;
        if (boredom >= 75)         healthDelta -= 1;
        if (hasHighHunger && isTired)        healthDelta -= 2;
        if (isTired && isStressed)           healthDelta -= 1.5;
        if (hasHighHunger && isVeryStressed) healthDelta -= 1.5;
        if (health < 30 && (hasHighHunger || isTired || isStressed)) healthDelta -= 2;

        if (healthDelta === 0 && health < 100 && isWellCared) healthDelta += 0.25;

        return Math.max(-10, Math.min(1, healthDelta));
    }

    getActionAvailability() {
        if (!this.alive) {
            return {
                feed:  { enabled: false, reason: 'Tu DragonGotchi ya no puede realizar acciones.' },
                play:  { enabled: false, reason: 'Tu DragonGotchi ya no puede realizar acciones.' },
                sleep: { enabled: false, reason: 'Tu DragonGotchi ya no puede realizar acciones.' },
                heal:  { enabled: false, reason: 'Tu DragonGotchi ya no puede realizar acciones.' }
            };
        }

        const availability = {
            feed:  { enabled: true, reason: '' },
            play:  { enabled: true, reason: '' },
            sleep: { enabled: true, reason: '' },
            heal:  { enabled: true, reason: '' }
        };

        if (this.energy > 60) {
            availability.sleep = { enabled: false, reason: 'Todavía tiene energía para seguir despierto.' };
        } else if (this.hunger >= 50) {
            availability.sleep = { enabled: false, reason: 'Tiene demasiada hambre para dormir tranquilo.' };
        }

        if (this.health >= 70) {
            availability.heal = { enabled: false, reason: 'No necesita curación por ahora.' };
        }

        if (this.energy <= 30) {
            availability.play = { enabled: false, reason: 'Está muy cansado para jugar.' };
        } else if (this.hunger >= 50) {
            availability.play = { enabled: false, reason: 'Primero necesita comer antes de jugar.' };
        } else if (this.health < 30) {
            availability.play = { enabled: false, reason: 'Está delicado de salud: jugar ahora sería riesgoso.' };
        }

        return availability;
    }
}
