import { Muerto } from '../states/tamagotchi-states.js';

export class Tamagotchi {
    constructor(nombre, initialState = {}) {
        this.nombre = nombre || 'Tamagotchi';
        this.hambre = initialState.hambre ?? 0;
        this.aburrimiento = initialState.aburrimiento ?? 0;
        this.energia = initialState.energia ?? 100;
        this.felicidad = initialState.felicidad ?? 100;
        this.salud = initialState.salud ?? 100;
        this.edad = initialState.edad ?? 0;
        this.vivo = initialState.vivo ?? true;
        this.reloj = null; // Will be injected or managed via use case
        this.estado = null; // Set via state machine
        
        // Callback interfaces (Adapters)
        this.onStateChange = null;
        this.onAction = null;
    }

    setUI(notifier, animator, minigame) {
        this.notifier = notifier;
        this.animator = animator;
        this.minigame = minigame;
    }

    setEstado(estado) {
        this.estado = estado;
        if (this.animator) {
            this.animator.cambiarAnimacion(this.estado.getAnimationName(), this);
        }
    }

    alimentar() {
        if (!this.vivo) return;
        this.estado.alimentar(this);
    }

    jugar() {
        if (!this.vivo) return;
        this.estado.jugar(this);
    }

    dormir() {
        if (!this.vivo) return;
        this.estado.dormir(this);
    }

    curar() {
        if (!this.vivo) return;
        this.estado.curar(this);
    }

    matar() {
        if (!this.vivo && this.estado instanceof Muerto) {
            return;
        }

        this.vivo = false;
        this.setEstado(new Muerto(this));
        if (this.notifier) {
            this.notifier.mostrarMensaje(`${this.nombre} ha fallecido. 💀`);
        }
    }

    actualizarAtributos(delta) {
        if (!this.vivo) return;
        this.hambre = Math.min(100, Math.max(0, this.hambre + (delta.hambre || 0)));
        this.energia = Math.min(100, Math.max(0, this.energia + (delta.energia || 0)));
        this.salud = Math.min(100, Math.max(0, this.salud + (delta.salud || 0)));
        this.aburrimiento = Math.min(100, Math.max(0, this.aburrimiento + (delta.aburrimiento || 0)));
        this.felicidad = Math.min(100, Math.max(0, this.felicidad + (delta.felicidad || 0)));

        if (this.salud <= 0) {
            this.matar();
        }
    }

    getProjectedAttributes(delta = {}) {
        const clamp = (value, change = 0) => Math.min(100, Math.max(0, value + change));

        return {
            hambre: clamp(this.hambre, delta.hambre || 0),
            energia: clamp(this.energia, delta.energia || 0),
            salud: clamp(this.salud, delta.salud || 0),
            aburrimiento: clamp(this.aburrimiento, delta.aburrimiento || 0),
            felicidad: clamp(this.felicidad, delta.felicidad || 0)
        };
    }

    calculatePassiveHealthDelta(projectedAttributes = this) {
        if (!this.vivo) {
            return 0;
        }

        const {
            hambre,
            energia,
            salud,
            aburrimiento,
            felicidad
        } = projectedAttributes;

        const tieneHambreAlta = hambre >= 60;
        const tieneHambreExtrema = hambre >= 85;
        const estaCansado = energia <= 30;
        const estaAgotado = energia <= 10;
        const estaEstresado = felicidad <= 35 || aburrimiento >= 65;
        const estaMuyEstresado = felicidad <= 20 || aburrimiento >= 80;
        const estaBienCuidado = hambre <= 25 && energia >= 75 && felicidad >= 70 && aburrimiento <= 25;

        let healthDelta = 0;

        if (tieneHambreExtrema) {
            healthDelta -= 2.5;
        } else if (tieneHambreAlta) {
            healthDelta -= 1;
        }

        if (estaAgotado) {
            healthDelta -= 3;
        } else if (estaCansado) {
            healthDelta -= 1.5;
        }

        if (felicidad <= 25) {
            healthDelta -= 1;
        }

        if (aburrimiento >= 75) {
            healthDelta -= 1;
        }

        if (tieneHambreAlta && estaCansado) {
            healthDelta -= 2;
        }

        if (estaCansado && estaEstresado) {
            healthDelta -= 1.5;
        }

        if (tieneHambreAlta && estaMuyEstresado) {
            healthDelta -= 1.5;
        }

        if (salud < 30 && (tieneHambreAlta || estaCansado || estaEstresado)) {
            healthDelta -= 2;
        }

        if (healthDelta === 0 && salud < 100 && estaBienCuidado) {
            healthDelta += 0.25;
        }

        return Math.max(-10, Math.min(1, healthDelta));
    }

    getActionAvailability() {
        if (!this.vivo) {
            return {
                alimentar: { enabled: false, reason: 'Tu DragonGotchi ya no puede realizar acciones.' },
                jugar: { enabled: false, reason: 'Tu DragonGotchi ya no puede realizar acciones.' },
                dormir: { enabled: false, reason: 'Tu DragonGotchi ya no puede realizar acciones.' },
                curar: { enabled: false, reason: 'Tu DragonGotchi ya no puede realizar acciones.' }
            };
        }

        const availability = {
            alimentar: { enabled: true, reason: '' },
            jugar: { enabled: true, reason: '' },
            dormir: { enabled: true, reason: '' },
            curar: { enabled: true, reason: '' }
        };

        if (this.energia > 60) {
            availability.dormir = {
                enabled: false,
                reason: 'Todavía tiene energía para seguir despierto.'
            };
        } else if (this.hambre >= 50) {
            availability.dormir = {
                enabled: false,
                reason: 'Tiene demasiada hambre para dormir tranquilo.'
            };
        }

        if (this.salud >= 70) {
            availability.curar = {
                enabled: false,
                reason: 'No necesita curación por ahora.'
            };
        }

        if (this.energia <= 30) {
            availability.jugar = {
                enabled: false,
                reason: 'Está muy cansado para jugar.'
            };
        } else if (this.hambre >= 50) {
            availability.jugar = {
                enabled: false,
                reason: 'Primero necesita comer antes de jugar.'
            };
        } else if (this.salud < 30) {
            availability.jugar = {
                enabled: false,
                reason: 'Está delicado de salud: jugar ahora sería riesgoso.'
            };
        }

        return availability;
    }
}
