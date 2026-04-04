import { INotifier } from '../../domain/interfaces/ui-contracts.js';

export class DomNotifier extends INotifier {
    constructor() {
        super();
        this.messageLog = document.getElementById('log-mensajes');
    }

    showMessage(message) {
        this.messageLog.innerHTML      = `<p>${message}</p>`;
        this.messageLog.style.display  = 'block';
        setTimeout(() => {
            this.messageLog.style.display = 'none';
        }, 3000);
    }
}
