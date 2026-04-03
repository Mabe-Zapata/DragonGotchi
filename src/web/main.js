import { UIController } from '../interfaces/ui-controller.js';
import { LocalStorageRepository } from '../infrastructure/persistence/local-storage-repository.js';
import { DomUIProvider } from '../infrastructure/ui/dom-ui-provider.js';
import { StateEvaluator } from '../application/services/state-evaluator.js';
import { Feliz, Hambriento, Cansado, Critico } from '../domain/states/tamagotchi-states.js';

window.addEventListener('DOMContentLoaded', () => {
    // Configuración de reglas de estado (OCP)
    const stateRules = [
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
    const uiProvider = new DomUIProvider();
    const stateEvaluator = new StateEvaluator(stateRules);
    
    // Inyectamos todo en el controlador (DIP)
    const app = new UIController(repository, uiProvider, stateEvaluator);
    app.start();
});
