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
            this.animator.cambiarAnimacion(this.estado.getAnimationName());
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
        this.vivo = false;
        if (this.notifier) {
            this.notifier.mostrarMensaje(`${this.nombre} ha fallecido. 💀`);
        }
        if (this.animator) {
            this.animator.cambiarAnimacion('muerto');
        }
    }

    actualizarAtributos(delta) {
        if (!this.vivo) return;
        this.hambre = Math.min(100, Math.max(0, this.hambre + (delta.hambre || 0)));
        this.energia = Math.min(100, Math.max(0, this.energia + (delta.energia || 0)));
        this.salud = Math.min(100, Math.max(0, this.salud + (delta.salud || 0)));
        this.aburrimiento = Math.min(100, Math.max(0, this.aburrimiento + (delta.aburrimiento || 0)));
        this.felicidad = Math.min(100, Math.max(0, this.felicidad + (delta.felicidad || 0)));
    }
}
