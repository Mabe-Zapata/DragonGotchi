export class LocalStorageRepository {
    constructor(key = 'tamagotchiState') {
        this.key = key;
    }

    save(tamagotchi) {
        const stateClass = tamagotchi.alive
            ? tamagotchi.state?.constructor?.name || 'Happy'
            : 'Dead';

        const data = {
            name:      tamagotchi.name,
            hunger:    tamagotchi.hunger,
            boredom:   tamagotchi.boredom,
            energy:    tamagotchi.energy,
            happiness: tamagotchi.happiness,
            health:    tamagotchi.health,
            age:       tamagotchi.age,
            alive:     tamagotchi.alive,
            stateClass
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
