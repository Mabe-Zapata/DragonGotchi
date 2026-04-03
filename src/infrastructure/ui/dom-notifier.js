import { INotifier } from '../../domain/interfaces/ui-contracts.js';

export class DomNotifier extends INotifier {
    constructor() {
        super();
        this.logMensajes = document.getElementById('log-mensajes');
    }

    mostrarMensaje(mensaje) {
        this.logMensajes.innerHTML = `<p>${mensaje}</p>`;
        this.logMensajes.style.display = 'block';
        setTimeout(() => {
            this.logMensajes.style.display = 'none';
        }, 3000);
    }
}
