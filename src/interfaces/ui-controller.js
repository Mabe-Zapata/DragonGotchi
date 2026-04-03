import { Tamagotchi } from '../domain/entities/tamagotchi.js';
import { ActionUseCase, TickUseCase } from '../application/use-cases/actions.js';
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
        this.temporizador = null;
        
        this.eventManager = new DomEventManager({
            onAdopt: () => this.handleAdopt(),
            onAction: (action) => this.actionUseCase[action](),
            onReset: () => this.handleReset(),
            onPip: () => this.handlePip(),
            onContinue: () => this.handleContinue()
        });
    }

    async start() {
        const initialState = this.repository.load();
        if (initialState) {
            this.bootstrap(initialState);
            this.notifier.mostrarMensaje(`¡Bienvenido de nuevo, ${this.tamagotchi.nombre}!`);
        } else {
            // Mostrar pantalla inicial si no hay datos guardados
            document.getElementById('pantalla-inicial').style.display = 'flex';
        }
    }

    bootstrap(initialState) {
        this.tamagotchi = new Tamagotchi(initialState.nombre, initialState);
        this.tamagotchi.setUI(this.notifier, this.animator, this.minigame);
        
        const stateMap = { Feliz, Hambriento, Cansado, Critico, Muerto };
        const StateClass = stateMap[initialState.estadoClase || 'Feliz'];
        this.tamagotchi.setEstado(new StateClass(this.tamagotchi));
        
        this.actionUseCase = new ActionUseCase(this.tamagotchi, this.repository);
        this.tickUseCase = new TickUseCase(this.tamagotchi, this.repository, this.stateEvaluator, this.statsPresenter);
        
        this.statsPresenter.actualizarBarras(this.tamagotchi);
        this.iniciarReloj();
    }

    handleAdopt() {
        const nombre = document.getElementById('pet-name').value || 'Dragon';
        document.getElementById('pantalla-inicial').style.display = 'none';
        
        this.bootstrap({ nombre, vivo: true });
        this.notifier.mostrarMensaje(`¡Has adoptado a ${nombre}!`);
        this.animacionInicial();
    }

    handleReset() {
        this.repository.clear();
        window.location.reload();
    }

    handlePip() {
        const video = document.getElementById('tamagotchi-video');
        if (document.pictureInPictureEnabled) video.requestPictureInPicture();
    }

    handleContinue() {
        document.getElementById('pantalla-inicial').style.display = 'none';
    }

    iniciarReloj() {
        if (this.temporizador) clearInterval(this.temporizador);
        this.temporizador = setInterval(() => {
            this.tickUseCase.execute();
            if (!this.tamagotchi.vivo) {
                this.manejarMuerte();
                clearInterval(this.temporizador);
            }
        }, 60000);
    }

    animacionInicial() {
        document.getElementById('pantalla-inicial').style.display = 'none';
        document.getElementById('nombre-dragon').textContent = this.tamagotchi.nombre;
        this.ui.mostrarAnimacionYActualizar('inicio', 3000).then(() => {
            this.ui.actualizarBarras(this.tamagotchi);
        });
    }

    showGameContent() {
        document.getElementById('pantalla-inicial').style.display = 'flex';
        document.getElementById('pantalla-muerte').style.display = 'none';
        document.getElementById('continuar-juego').style.display = 'inline-block';
        document.getElementById('formulario-nombre').style.display = 'none';
        document.getElementById('nombre-dragon').textContent = this.tamagotchi.nombre;
        document.getElementById('mensaje-bienvenida').textContent = `¡Bienvenido de vuelta! ${this.tamagotchi.nombre} está feliz de verte.`;
    }

    manejarMuerte() {
        document.getElementById('pantalla-inicial').style.display = 'none';
        document.getElementById('pantalla-muerte').style.display = 'flex';
        document.getElementById('mensaje-muerte').style.display = 'block';
        document.getElementById('mensaje-muerte').textContent = `El bicho ha fallecido. Adoptá uno nuevo.`;
        document.getElementById('reiniciar-Tamagotchi').style.display = 'inline-block';
    }
}
