import { UIController } from '../interfaces/ui-controller.js';
import { LocalStorageRepository } from '../infrastructure/persistence/local-storage-repository.js';
import { DomUIProvider } from '../infrastructure/ui/dom-ui-provider.js';

window.addEventListener('DOMContentLoaded', () => {
    // Composition Root: Armamos las piezas
    const repository = new LocalStorageRepository();
    const uiProvider = new DomUIProvider();
    
    // Inyectamos las dependencias
    const app = new UIController(repository, uiProvider);
    app.start();
});
