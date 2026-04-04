export class State {
    constructor(tamagotchi) {
        this.tamagotchi = tamagotchi;
    }

    // Default behaviors (LSP - Liskov Substitution Principle)
    feed() {
        this.tamagotchi.notifier.showMessage(`${this.tamagotchi.name} no tiene ganas de comer ahora.`);
    }

    play() {
        this.tamagotchi.notifier.showMessage(`${this.tamagotchi.name} no tiene ganas de jugar ahora.`);
    }

    sleep() {
        this.tamagotchi.notifier.showMessage(`${this.tamagotchi.name} no tiene sueño ahora.`);
    }

    heal() {
        if (this.tamagotchi.health >= 70) {
            this.tamagotchi.notifier.showMessage(`${this.tamagotchi.name} no necesita que lo curen.`);
            return;
        }
        this.tamagotchi.health = Math.min(100, this.tamagotchi.health + 15);
        this.tamagotchi.notifier.showMessage(`${this.tamagotchi.name} recuperó salud. Salud actual: ${this.tamagotchi.health}`);
    }

    getAnimationName() {
        return 'happy'; // Default
    }
}

export class Happy extends State {
    feed() {
        this.tamagotchi.updateAttributes({ hunger: -15, boredom: 10, happiness: -5 });
        this.tamagotchi.animator.showAnimationAndUpdate('eat', 5000, this.tamagotchi);
        this.tamagotchi.notifier.showMessage(`NAM NAM NAM GALLETITA`);
    }
    play() {
        if (this.tamagotchi.energy <= 30) {
            this.tamagotchi.notifier.showMessage(`RAWR quiero dormir RAWR`);
            return;
        }
        this.tamagotchi.animator.showAnimationAndUpdate('play', 3500, this.tamagotchi);
        this.tamagotchi.notifier.showMessage(`${this.tamagotchi.name} salió a jugar un rato.`);
        this.tamagotchi.minigame.startMinigame();
    }
    sleep() {
        this.tamagotchi.notifier.showMessage(`No estoy cansado, déjame jugar un poco más.`);
        this.tamagotchi.updateAttributes({ happiness: -10, health: -10, boredom: 15 });
        this.tamagotchi.animator.showAnimationAndUpdate('angry', 5000, this.tamagotchi);
    }
    getAnimationName() { return 'happy'; }
}

export class Hungry extends State {
    feed() {
        this.tamagotchi.updateAttributes({ hunger: -20, happiness: 10 });
        this.tamagotchi.animator.showAnimationAndUpdate('eat', 5000, this.tamagotchi);
        this.tamagotchi.notifier.showMessage(` RAWR quiero mas comida RAWR `);
    }
    play() {
        this.tamagotchi.notifier.showMessage('No estoy aburrido, tengo hambre.');
        this.tamagotchi.animator.showAnimationAndUpdate('sad', 5000, this.tamagotchi);
        this.tamagotchi.updateAttributes({ happiness: -30, health: -30, boredom: 10 });
    }
    sleep() {
        this.tamagotchi.notifier.showMessage('No estoy cansado, tengo hambre y te ves jugosito.');
        this.tamagotchi.updateAttributes({ happiness: -10, health: -30 });
        this.tamagotchi.animator.showAnimationAndUpdate('angry', 5000, this.tamagotchi);
    }
    getAnimationName() { return 'hungry'; }
}

export class Tired extends State {
    sleep() {
        this.tamagotchi.updateAttributes({ energy: 40, health: 10, hunger: 10, boredom: -5 });
        this.tamagotchi.animator.showAnimationAndUpdate('sleep', 5000, this.tamagotchi);
        this.tamagotchi.notifier.showMessage(`${this.tamagotchi.name} descansó y recuperó energía.`);
    }
    feed() {
        this.tamagotchi.notifier.showMessage('DORMIR DORMIR SOLO QUIERO DORMIR');
        this.tamagotchi.updateAttributes({ happiness: -15, energy: -10, health: -10 });
        this.tamagotchi.animator.showAnimationAndUpdate('sad', 5000, this.tamagotchi);
    }
    play() {
        this.tamagotchi.notifier.showMessage(`RAWR DORMIR DORMIR QUIERO DORMIR`);
        this.tamagotchi.updateAttributes({ happiness: -30, health: -30 });
        this.tamagotchi.animator.showAnimationAndUpdate('sad', 5000, this.tamagotchi);
    }
    getAnimationName() { return 'tired'; }
}

export class Critical extends State {
    feed() {
        this.tamagotchi.notifier.showMessage(`${this.tamagotchi.name} comió algo liviano para estabilizarse.`);
        this.tamagotchi.updateAttributes({ health: 5, hunger: -20, happiness: 5 });
        if (this.tamagotchi.health <= 0) this.tamagotchi.die();
    }
    play() {
        this.tamagotchi.notifier.showMessage(`${this.tamagotchi.name} no puede jugar en estado crítico.`);
        this.tamagotchi.updateAttributes({ health: -30, energy: -15 });
        if (this.tamagotchi.health <= 0) this.tamagotchi.die();
    }
    sleep() {
        this.tamagotchi.notifier.showMessage(`${this.tamagotchi.name} descansó un rato para recuperarse.`);
        this.tamagotchi.updateAttributes({ energy: 25, health: 5, hunger: 10 });
        if (this.tamagotchi.health <= 0) this.tamagotchi.die();
    }
    heal() {
        this.tamagotchi.health = Math.min(100, this.tamagotchi.health + 20);
        this.tamagotchi.notifier.showMessage(`${this.tamagotchi.name} ha sido curado. Salud actual: ${this.tamagotchi.health}`);
    }
    getAnimationName() { return 'critical'; }
}

export class Dead extends State {
    feed()  { this.tamagotchi.notifier.showMessage(`estoy muerto`); }
    play()  { this.tamagotchi.notifier.showMessage(`estoy muerto`); }
    sleep() { this.tamagotchi.notifier.showMessage(`estoy muerto`); }
    heal()  { this.tamagotchi.notifier.showMessage(`estoy muerto`); }
    getAnimationName() { return 'dead'; }
}
