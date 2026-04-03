/**
 * DomEventManager - SRP (Single Responsibility Principle)
 * Handles all event registrations for the DragonGotchi UI.
 */
export class DomEventManager {
    constructor(callbacks) {
        this.callbacks = callbacks; // ActionUseCase and Controller methods
    }

    init() {
        this.register('crear-tamagotchi', 'click', this.callbacks.onAdopt);
        this.register('alimentar', 'click', () => this.callbacks.onAction('alimentar'));
        this.register('jugar', 'click', () => this.callbacks.onAction('jugar'));
        this.register('dormir', 'click', () => this.callbacks.onAction('dormir'));
        this.register('curar', 'click', () => this.callbacks.onAction('curar'));
        this.register('reiniciar-Tamagotchi', 'click', this.callbacks.onReset);
        this.register('pip-button', 'click', this.callbacks.onPip);
        this.register('continuar-juego', 'click', this.callbacks.onContinue);
    }

    register(id, event, callback) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener(event, callback);
        }
    }
}
