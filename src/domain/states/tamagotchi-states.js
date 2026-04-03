export class Estado {
    constructor(tamagotchi) {
        this.tamagotchi = tamagotchi;
    }
    
    // Comportamientos por defecto (LSP - Substituibilidad)
    alimentar() { 
        this.tamagotchi.notifier.mostrarMensaje(`${this.tamagotchi.nombre} no tiene ganas de comer ahora.`);
    }
    
    jugar() { 
        this.tamagotchi.notifier.mostrarMensaje(`${this.tamagotchi.nombre} no tiene ganas de jugar ahora.`);
    }
    
    dormir() { 
        this.tamagotchi.notifier.mostrarMensaje(`${this.tamagotchi.nombre} no tiene sueño ahora.`);
    }
    
    curar() { 
        this.tamagotchi.notifier.mostrarMensaje(`${this.tamagotchi.nombre} no necesita que lo curen.`);
    }

    getAnimationName() {
        return 'feliz'; // Por defecto
    }
}

export class Feliz extends Estado {
    alimentar() {
        this.tamagotchi.actualizarAtributos({ hambre: -15, aburrimiento: 10, felicidad: -5 });
        this.tamagotchi.animator.mostrarAnimacionYActualizar('comer', 5000);
        this.tamagotchi.notifier.mostrarMensaje(`NAM NAM NAM GALLETITA`);
    }
    jugar() {
        if (this.tamagotchi.energia <= 30) {
            this.tamagotchi.notifier.mostrarMensaje(`RAWR quiero dormir RAWR`);
            return;
        }
        this.tamagotchi.minigame.iniciarMinijuego();
    }
    dormir() {
        this.tamagotchi.notifier.mostrarMensaje(`No estoy cansado, déjame jugar un poco más.`);
        this.tamagotchi.actualizarAtributos({ felicidad: -10, salud: -10, aburrimiento: 15 });
        this.tamagotchi.animator.mostrarAnimacionYActualizar('enojado', 5000);
    }
    getAnimationName() { return 'feliz'; }
}

export class Hambriento extends Estado {
    alimentar() {
        this.tamagotchi.actualizarAtributos({ hambre: -20, felicidad: 10 });
        this.tamagotchi.animator.mostrarAnimacionYActualizar('comer', 5000);
        this.tamagotchi.notifier.mostrarMensaje(` RAWR quiero mas comida RAWR `);
    }
    jugar() {
        this.tamagotchi.notifier.mostrarMensaje('No estoy aburrido, tengo hambre.');
        this.tamagotchi.animator.mostrarAnimacionYActualizar('triste', 5000);
        this.tamagotchi.actualizarAtributos({ felicidad: -30, salud: -30, aburrimiento: 10 });
    }
    dormir() {
        this.tamagotchi.notifier.mostrarMensaje('No estoy cansado, tengo hambre y te ves jugosito.');
        this.tamagotchi.actualizarAtributos({ felicidad: -10, salud: -30 });
        this.tamagotchi.animator.mostrarAnimacionYActualizar('enojado', 5000);
    }
    getAnimationName() { return 'hambriento'; }
}

export class Cansado extends Estado {
    dormir() {
        // En un futuro el Minigame o un SleepService manejaría el tiempo del sueño
        this.tamagotchi.notifier.mostrarMensaje(`${this.tamagotchi.nombre} se fue a dormir...`);
    }
    alimentar() {
        this.tamagotchi.notifier.mostrarMensaje('DORMIR DORMIR SOLO QUIERO DORMIR');
        this.tamagotchi.actualizarAtributos({ felicidad: -15, energia: -10, salud: -10 });
        this.tamagotchi.animator.mostrarAnimacionYActualizar('triste', 5000);
    }
    jugar() {
        this.tamagotchi.notifier.mostrarMensaje(`RAWR DORMIR DORMIR QUIERO DORMIR`);
        this.tamagotchi.actualizarAtributos({ felicidad: -30, salud: -30 });
        this.tamagotchi.animator.mostrarAnimacionYActualizar('triste', 5000);
    }
    getAnimationName() { return 'cansado'; }
}

export class Critico extends Estado {
    alimentar() {
        this.tamagotchi.notifier.mostrarMensaje(`${this.tamagotchi.nombre} está en un estado crítico, necesita atención urgente.`);
        this.tamagotchi.actualizarAtributos({ salud: -20, hambre: -15 });
        if (this.tamagotchi.salud <= 0) this.tamagotchi.matar();
    }
    jugar() {
        this.tamagotchi.notifier.mostrarMensaje(`${this.tamagotchi.nombre} no puede jugar en estado crítico.`);
        this.tamagotchi.actualizarAtributos({ salud: -30, energia: -15 });
        if (this.tamagotchi.salud <= 0) this.tamagotchi.matar();
    }
    dormir() {
        this.tamagotchi.notifier.mostrarMensaje(`estoy enfermito :(`);
        this.tamagotchi.actualizarAtributos({ energia: 20, hambre: 15 });
        if (this.tamagotchi.salud <= 0) this.tamagotchi.matar();
    }
    curar() {
        this.tamagotchi.salud = Math.min(100, this.tamagotchi.salud + 20);
        this.tamagotchi.notifier.mostrarMensaje(`${this.tamagotchi.nombre} ha sido curado. Salud actual: ${this.tamagotchi.salud}`);
    }
    getAnimationName() { return 'critico'; }
}

export class Muerto extends Estado {
    alimentar() { this.tamagotchi.notifier.mostrarMensaje(`estoy muerto`); }
    jugar() { this.tamagotchi.notifier.mostrarMensaje(`estoy muerto`); }
    dormir() { this.tamagotchi.notifier.mostrarMensaje(`estoy muerto`); }
    curar() { this.tamagotchi.notifier.mostrarMensaje(`estoy muerto`); }
    getAnimationName() { return 'muerto'; }
}
