import { UIController } from '../interfaces/ui-controller.js';
import { LocalStorageRepository } from '../infrastructure/persistence/local-storage-repository.js';
import { DomNotifier } from '../infrastructure/ui/dom-notifier.js';
import { DomAnimator } from '../infrastructure/ui/dom-animator.js';
import { DomStatsPresenter } from '../infrastructure/ui/dom-stats-presenter.js';
import { DomMinigameProvider } from '../infrastructure/ui/dom-minigame-provider.js';
import { StateEvaluator } from '../application/services/state-evaluator.js';
import { Happy, Hungry, Tired, Critical, Dead } from '../domain/states/tamagotchi-states.js';

window.addEventListener('DOMContentLoaded', () => {
    // State rules configuration (OCP)
    const stateRules = [
        {
            condition: t => !t.alive,
            stateClass: Dead
        },
        {
            condition: t => t.health < 30 || t.hunger > 80 || t.energy <= 15,
            stateClass: Critical
        },
        {
            condition: t => t.energy <= 60,
            stateClass: Tired
        },
        {
            condition: t => t.hunger >= 50,
            stateClass: Hungry
        },
        {
            condition: () => true, // Default rule
            stateClass: Happy
        }
    ];

    const repository    = new LocalStorageRepository();
    const notifier      = new DomNotifier();
    const animator      = new DomAnimator();
    const statsPresenter = new DomStatsPresenter();
    const minigame      = new DomMinigameProvider();

    const stateEvaluator = new StateEvaluator(stateRules);

    // Inject all segregated dependencies (ISP + DIP)
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
