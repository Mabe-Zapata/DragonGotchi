import { Tamagotchi } from '../domain/entities/tamagotchi.js';
import { ActionUseCase, TickUseCase, MinigameRecoveryUseCase } from '../application/use-cases/actions.js';
import { Feliz, Hambriento, Cansado, Critico, Muerto } from '../domain/states/tamagotchi-states.js';
import { DomEventManager } from './events/dom-event-manager.js';

export class UIController {
    constructor(repository, notifier, animator, statsPresenter, minigame, stateEvaluator) {
        this.repository = repository;
        this.notifier = notifier;
        this.animator = animator;
        this.statsPresenter = statsPresenter;
        this.minigame = minigame;
        this.stateEvaluator = stateEvaluator;
        
        this.tamagotchi = null;
        this.actionUseCase = null;
        this.tickUseCase = null;
        this.minigameRecoveryUseCase = null;
        this.temporizador = null;
        this.minigameRecoveryTimer = null;
        this.video = document.getElementById('tamagotchi-video');
        this.pipButton = document.getElementById('pip-button');
        this.accionesAyuda = document.getElementById('acciones-ayuda');
        this.actionButtons = {
            alimentar: document.getElementById('alimentar'),
            jugar: document.getElementById('jugar'),
            dormir: document.getElementById('dormir'),
            curar: document.getElementById('curar')
        };
        
        this.eventManager = new DomEventManager({
            onAdopt: () => this.handleAdopt(),
            onAction: (action) => this.handleAction(action),
            onReset: () => this.handleReset(),
            onPip: () => this.handlePip(),
            onContinue: () => this.handleContinue(),
            onCloseMinigame: () => this.handleCloseMinigame()
        });
    }

    async start() {
        this.eventManager.init();
        this.setupPictureInPicture();
        this.updatePipButtonState(Boolean(document.pictureInPictureElement));

        const initialState = this.repository.load();
        if (initialState) {
            this.bootstrap(initialState);

            if (this.tamagotchi.vivo) {
                this.showContinueScreen();
                this.notifier.mostrarMensaje(`¡Bienvenido de nuevo, ${this.tamagotchi.nombre}!`);
            } else {
                this.manejarMuerte();
            }
        } else {
            this.showAdoptionScreen();
        }
    }

    bootstrap(initialState) {
        this.tamagotchi = new Tamagotchi(initialState.nombre, initialState);
        this.tamagotchi.setUI(this.notifier, this.animator, this.minigame);
        
        const stateMap = { Feliz, Hambriento, Cansado, Critico, Muerto };
        const StateClass = stateMap[initialState.estadoClase || 'Feliz'];
        this.tamagotchi.setEstado(new StateClass(this.tamagotchi));
        
        this.actionUseCase = new ActionUseCase(this.tamagotchi, this.repository, this.stateEvaluator);
        this.tickUseCase = new TickUseCase(this.tamagotchi, this.repository, this.stateEvaluator, this.statsPresenter);
        this.minigameRecoveryUseCase = new MinigameRecoveryUseCase(this.tamagotchi, this.repository, this.stateEvaluator);
        
        this.refreshUIState();

        if (this.tamagotchi.vivo) {
            this.iniciarReloj();
        }
    }

    handleAdopt() {
        const nombre = document.getElementById('nombre-tamagotchi').value.trim() || 'Dragon';
        
        this.bootstrap({ nombre, vivo: true });
        this.notifier.mostrarMensaje(`¡Has adoptado a ${nombre}!`);
        this.animacionInicial();
    }

    handleAction(action) {
        if (!this.actionUseCase) {
            return;
        }

        const availability = this.getActionAvailability();
        if (!availability[action]?.enabled) {
            this.notifier.mostrarMensaje(availability[action]?.reason || 'Esa acción no está disponible ahora.');
            this.refreshUIState();
            return;
        }

        this.actionUseCase[action]();
        this.syncMinigameRecovery();
        this.refreshUIState();

        if (!this.tamagotchi.vivo) {
            this.manejarMuerte();
            if (this.temporizador) {
                clearInterval(this.temporizador);
                this.temporizador = null;
            }
        }
    }

    handleReset() {
        this.repository.clear();
        window.location.reload();
    }

    handlePip() {
        if (!document.pictureInPictureEnabled) {
            this.notifier.mostrarMensaje('Picture-in-Picture no está disponible en este navegador.');
            return;
        }

        if (document.pictureInPictureElement) {
            document.exitPictureInPicture().catch(() => {
                this.notifier.mostrarMensaje('No se pudo restaurar el video desde Picture-in-Picture.');
            });
            return;
        }

        this.video.requestPictureInPicture().catch(() => {
            this.notifier.mostrarMensaje('No se pudo abrir Picture-in-Picture en este momento.');
        });
    }

    handleContinue() {
        document.getElementById('pantalla-inicial').style.display = 'none';
        this.refreshUIState();
    }

    handleCloseMinigame() {
        this.minigame.ocultarMinijuego();
        this.syncMinigameRecovery();
        this.refreshUIState();
    }

    iniciarReloj() {
        if (this.temporizador) clearInterval(this.temporizador);
        this.temporizador = setInterval(() => {
            this.tickUseCase.execute();
            this.refreshUIState();
            if (!this.tamagotchi.vivo) {
                this.manejarMuerte();
                clearInterval(this.temporizador);
            }
        }, 60000);
    }

    animacionInicial() {
        document.getElementById('pantalla-inicial').style.display = 'none';
        document.getElementById('nombre-dragon').textContent = this.tamagotchi.nombre;
        this.animator.mostrarAnimacionYActualizar('inicio', 3000, this.tamagotchi).then(() => {
            this.refreshUIState();
        });
    }

    showAdoptionScreen() {
        document.getElementById('pantalla-inicial').style.display = 'flex';
        document.getElementById('pantalla-muerte').style.display = 'none';
        document.getElementById('continuar-juego').style.display = 'none';
        document.getElementById('formulario-nombre').style.display = 'block';
        document.getElementById('mensaje-bienvenida').textContent = '¡Bienvenido! Adoptá un nuevo DragonGotchi.';
    }

    showContinueScreen() {
        document.getElementById('pantalla-inicial').style.display = 'flex';
        document.getElementById('pantalla-muerte').style.display = 'none';
        document.getElementById('continuar-juego').style.display = 'inline-block';
        document.getElementById('formulario-nombre').style.display = 'none';
        document.getElementById('nombre-dragon').textContent = this.tamagotchi.nombre;
        document.getElementById('mensaje-bienvenida').textContent = `¡Bienvenido de vuelta! ${this.tamagotchi.nombre} está feliz de verte.`;
    }

    manejarMuerte() {
        this.minigame.ocultarMinijuego();
        this.detenerRecuperacionMinijuego();
        if (this.temporizador) {
            clearInterval(this.temporizador);
            this.temporizador = null;
        }

        document.getElementById('pantalla-inicial').style.display = 'none';
        document.getElementById('pantalla-muerte').style.display = 'flex';
        document.getElementById('mensaje-muerte').style.display = 'block';
        document.getElementById('mensaje-muerte').textContent = `El bicho ha fallecido. Adoptá uno nuevo.`;
        document.getElementById('reiniciar-Tamagotchi').style.display = 'inline-block';
        this.refreshUIState();
    }

    refreshUIState() {
        if (!this.tamagotchi) {
            return;
        }

        this.statsPresenter.actualizarBarras(this.tamagotchi);
        this.updateActionButtons();
    }

    syncMinigameRecovery() {
        if (!this.tamagotchi?.vivo || !this.minigame.estaAbierto()) {
            this.detenerRecuperacionMinijuego();
            return;
        }

        if (this.minigameRecoveryTimer) {
            return;
        }

        this.minigameRecoveryTimer = setInterval(() => {
            if (!this.tamagotchi?.vivo || !this.minigame.estaAbierto()) {
                this.detenerRecuperacionMinijuego();
                return;
            }

            this.minigameRecoveryUseCase.execute();
            this.refreshUIState();

            if (!this.tamagotchi.vivo) {
                this.manejarMuerte();
            }
        }, 3000);
    }

    detenerRecuperacionMinijuego() {
        if (!this.minigameRecoveryTimer) {
            return;
        }

        clearInterval(this.minigameRecoveryTimer);
        this.minigameRecoveryTimer = null;
    }

    getActionAvailability() {
        const availability = this.tamagotchi?.getActionAvailability?.() || {};

        if (this.minigame.estaAbierto()) {
            return Object.fromEntries(
                Object.entries(availability).map(([action, state]) => [
                    action,
                    {
                        enabled: false,
                        reason: action === 'jugar'
                            ? 'El minijuego ya está abierto.'
                            : 'Cerrá el minijuego para volver a usar acciones del dragón.'
                    }
                ])
            );
        }

        return availability;
    }

    updateActionButtons() {
        const availability = this.getActionAvailability();
        const disabledReasons = [];

        Object.entries(this.actionButtons).forEach(([action, button]) => {
            const state = availability[action] || { enabled: true, reason: '' };
            button.disabled = !state.enabled;
            button.setAttribute('aria-disabled', String(!state.enabled));
            button.title = state.reason || '';

            if (!state.enabled && state.reason) {
                disabledReasons.push(`${button.textContent}: ${state.reason}`);
            }
        });

        this.accionesAyuda.textContent = this.minigame.estaAbierto()
            ? 'Minijuego abierto: podés cerrarlo cuando quieras y la mascota sigue visible.'
            : (disabledReasons[0] || 'Acciones disponibles según el estado actual del dragón.');
    }

    setupPictureInPicture() {
        if (!this.video) {
            return;
        }

        this.video.addEventListener('enterpictureinpicture', () => {
            document.body.classList.add('pip-activo');
            this.updatePipButtonState(true);
        });

        this.video.addEventListener('leavepictureinpicture', () => {
            document.body.classList.remove('pip-activo');
            this.updatePipButtonState(false);
        });

        if (!document.pictureInPictureEnabled) {
            this.pipButton.disabled = true;
            this.pipButton.title = 'Este navegador no soporta Picture-in-Picture.';
        }
    }

    updatePipButtonState(isActive) {
        if (!this.pipButton) {
            return;
        }

        this.pipButton.textContent = isActive ? 'Restaurar video' : 'Minimizar video';
        this.pipButton.classList.toggle('boton-pip--activo', isActive);
        this.pipButton.setAttribute('aria-pressed', String(isActive));
        this.pipButton.title = isActive
            ? 'Volvé el video a la página principal.'
            : 'Abrí el video en una ventana flotante.';
    }
}
