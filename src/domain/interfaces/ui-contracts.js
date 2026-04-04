/**
 * ISP (Interface Segregation Principle) - Domain Contracts
 * These interfaces define the "shapes" of UI components that the Domain needs.
 * The Domain does not know about the DOM, but it does know what it wants.
 */

export class INotifier {
    showMessage(message) { throw new Error('Not implemented'); }
}

export class IAnimator {
    changeAnimation(name, tamagotchi = null) { throw new Error('Not implemented'); }
    showAnimationAndUpdate(name, duration, tamagotchi = null) { throw new Error('Not implemented'); }
}

export class IStatsPresenter {
    updateBars(tamagotchi) { throw new Error('Not implemented'); }
}

export class IMinigameProvider {
    startMinigame() { throw new Error('Not implemented'); }
    hideMinigame()  { throw new Error('Not implemented'); }
    isOpen()        { throw new Error('Not implemented'); }
}
