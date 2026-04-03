/**
 * ISP (Interface Segregation Principle) - Domain Contracts
 * These interfaces define the "shapes" of UI components that the Domain needs.
 * The Domain does not know about the DOM, but it does know what it wants.
 */

export class INotifier {
    mostrarMensaje(mensaje) { throw new Error('Not implemented'); }
}

export class IAnimator {
    cambiarAnimacion(nombre) { throw new Error('Not implemented'); }
    mostrarAnimacionYActualizar(nombre, duracion) { throw new Error('Not implemented'); }
}

export class IStatsPresenter {
    actualizarBarras(tamagotchi) { throw new Error('Not implemented'); }
}

export class IMinigameProvider {
    iniciarMinijuego() { throw new Error('Not implemented'); }
    ocultarMinijuego() { throw new Error('Not implemented'); }
}
