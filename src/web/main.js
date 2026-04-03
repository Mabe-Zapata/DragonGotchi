import { UIController } from '../interfaces/ui-controller.js';
import { LocalStorageRepository } from '../infrastructure/persistence/local-storage-repository.js';
import { DomNotifier } from '../infrastructure/ui/dom-notifier.js';
import { DomAnimator } from '../infrastructure/ui/dom-animator.js';
import { DomStatsPresenter } from '../infrastructure/ui/dom-stats-presenter.js';
import { DomMinigameProvider } from '../infrastructure/ui/dom-minigame-provider.js';
import { StateEvaluator } from '../application/services/state-evaluator.js';
import { Feliz, Hambriento, Cansado, Critico, Muerto } from '../domain/states/tamagotchi-states.js';

window.addEventListener('DOMContentLoaded', () => {
    // Configuración de reglas de estado (OCP)
    const stateRules = [
        {
            condition: t => !t.vivo,
            stateClass: Muerto
        },
        { 
            condition: t => t.salud < 30 || t.hambre > 80 || t.energia <= 15, 
            stateClass: Critico 
        },
        { 
            condition: t => t.energia <= 30, 
            stateClass: Cansado 
        },
        { 
            condition: t => t.hambre >= 50, 
            stateClass: Hambriento 
        },
        { 
            condition: () => true, // Regla por defecto
            stateClass: Feliz 
        }
    ];

    const repository = new LocalStorageRepository();
    const notifier = new DomNotifier();
    const animator = new DomAnimator();
    const statsPresenter = new DomStatsPresenter();
    const minigame = new DomMinigameProvider();
    
    const stateEvaluator = new StateEvaluator(stateRules);
    
    // Inyectamos todo segregado (ISP + DIP)
    const app = new UIController(
        repository, 
        notifier, 
        animator, 
        statsPresenter, 
        minigame, 
        stateEvaluator
    );
    app.start();
});
