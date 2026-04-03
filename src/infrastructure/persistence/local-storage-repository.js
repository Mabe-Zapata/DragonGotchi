export class LocalStorageRepository {
    constructor(key = 'tamagotchiEstado') {
        this.key = key;
    }

    save(tamagotchi) {
        const data = {
            nombre: tamagotchi.nombre,
            hambre: tamagotchi.hambre,
            aburrimiento: tamagotchi.aburrimiento,
            energia: tamagotchi.energia,
            felicidad: tamagotchi.felicidad,
            salud: tamagotchi.salud,
            edad: tamagotchi.edad,
            vivo: tamagotchi.vivo,
            estadoClase: tamagotchi.estado.constructor.name
        };
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    load() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : null;
    }

    clear() {
        localStorage.removeItem(this.key);
    }
}
