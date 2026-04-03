export class Estado {
    constructor(tamagotchi) {
        this.tamagotchi = tamagotchi;
    }
    alimentar() { throw new Error('Método no implementado'); }
    jugar() { throw new Error('Método no implementado'); }
    dormir() { throw new Error('Método no implementado'); }
    curar() { throw new Error('Método no implementado'); }
    getAnimationName() { throw new Error('Método no implementado'); }
}

export class Feliz extends Estado {
    alimentar() {
        this.tamagotchi.actualizarAtributos({ hambre: -15, aburrimiento: 10, felicidad: -5 });
        this.tamagotchi.ui.mostrarAnimacionYActualizar('comer', 5000);
        this.tamagotchi.ui.mostrarMensaje(`NAM NAM NAM GALLETITA`);
        if (this.tamagotchi.hambre >= 50) this.tamagotchi.setEstado(new Hambriento(this.tamagotchi));
    }
    jugar() {
        if (this.tamagotchi.energia <= 30) {
            this.tamagotchi.ui.mostrarMensaje(`RAWR quiero dormir RAWR`);
            this.tamagotchi.setEstado(new Cansado(this.tamagotchi));
            return;
        }
        // Minijuego logic outsourced to UI/Infrastructure via Application layer (simplified here)
        this.tamagotchi.ui.iniciarMinijuego();
    }
    dormir() {
        this.tamagotchi.ui.mostrarMensaje(`No estoy cansado, déjame jugar un poco más.`);
        this.tamagotchi.actualizarAtributos({ felicidad: -10, salud: -10, aburrimiento: 15 });
        this.tamagotchi.ui.mostrarAnimacionYActualizar('enojado', 5000);
    }
    getAnimationName() { return 'feliz'; }
}

export class Hambriento extends Estado {
    alimentar() {
        this.tamagotchi.actualizarAtributos({ hambre: -20, felicidad: 10 });
        this.tamagotchi.ui.mostrarAnimacionYActualizar('comer', 5000);
        this.tamagotchi.ui.mostrarMensaje(` RAWR quiero mas comida RAWR `);
        if (this.tamagotchi.hambre <= 20) this.tamagotchi.setEstado(new Feliz(this.tamagotchi));
    }
    jugar() {
        if (this.tamagotchi.hambre > 80) this.tamagotchi.setEstado(new Critico(this.tamagotchi));
        this.tamagotchi.ui.mostrarMensaje('No estoy aburrido, tengo hambre.');
        this.tamagotchi.ui.mostrarAnimacionYActualizar('triste', 5000);
        this.tamagotchi.actualizarAtributos({ felicidad: -30, salud: -30, aburrimiento: 10 });
    }
    dormir() {
        if (this.tamagotchi.hambre > 80) this.tamagotchi.setEstado(new Critico(this.tamagotchi));
        this.tamagotchi.ui.mostrarMensaje('No estoy cansado, tengo hambre y te ves jugosito.');
        this.tamagotchi.actualizarAtributos({ felicidad: -10, salud: -30 });
        this.tamagotchi.ui.mostrarAnimacionYActualizar('enojado', 5000);
    }
    getAnimationName() { return 'hambriento'; }
}

export class Cansado extends Estado {
    dormir() {
        if (this.tamagotchi.energia <= 30) {
            this.tamagotchi.ui.iniciarSueno(120000); // 2 minutes
        }
    }
    alimentar() {
        this.tamagotchi.ui.mostrarMensaje('DORMIR DORMIR SOLO QUIERO DORMIR');
        this.tamagotchi.actualizarAtributos({ felicidad: -15, energia: -10, salud: -10 });
        this.tamagotchi.ui.mostrarAnimacionYActualizar('triste', 5000);
    }
    jugar() {
        this.tamagotchi.ui.mostrarMensaje(`RAWR DORMIR DORMIR QUIERO DORMIR`);
        this.tamagotchi.actualizarAtributos({ felicidad: -30, salud: -30 });
        this.tamagotchi.ui.mostrarAnimacionYActualizar('triste', 5000);
        if (this.tamagotchi.energia < 20) this.tamagotchi.setEstado(new Critico(this.tamagotchi));
    }
    getAnimationName() { return 'cansado'; }
}

export class Critico extends Estado {
    alimentar() {
        this.tamagotchi.ui.mostrarMensaje(`${this.tamagotchi.nombre} está en un estado crítico, necesita atención urgente.`);
        this.tamagotchi.actualizarAtributos({ salud: -20, hambre: -15 });
        if (this.tamagotchi.salud <= 0) this.tamagotchi.matar();
    }
    jugar() {
        this.tamagotchi.ui.mostrarMensaje(`${this.tamagotchi.nombre} no puede jugar en estado crítico.`);
        this.tamagotchi.actualizarAtributos({ salud: -30, energia: -15 });
        if (this.tamagotchi.salud <= 0) this.tamagotchi.matar();
    }
    dormir() {
        this.tamagotchi.ui.mostrarMensaje(`estoy enfermito :(`);
        this.tamagotchi.actualizarAtributos({ energia: 20, hambre: 15 });
        if (this.tamagotchi.salud <= 0) this.tamagotchi.matar();
        else if (this.tamagotchi.salud > 50) this.tamagotchi.setEstado(new Cansado(this.tamagotchi));
    }
    curar() {
        this.tamagotchi.salud = Math.min(100, this.tamagotchi.salud + 20);
        this.tamagotchi.ui.mostrarMensaje(`${this.tamagotchi.nombre} ha sido curado. Salud actual: ${this.tamagotchi.salud}`);
        if (this.tamagotchi.salud > 60) this.tamagotchi.setEstado(new Feliz(this.tamagotchi));
    }
    getAnimationName() { return 'critico'; }
}

export class Muerto extends Estado {
    alimentar() { this.tamagotchi.ui.mostrarMensaje(`estoy muerto`); }
    jugar() { this.tamagotchi.ui.mostrarMensaje(`estoy muerto`); }
    dormir() { this.tamagotchi.ui.mostrarMensaje(`estoy muerto`); }
    getAnimationName() { return 'muerto'; }
}
