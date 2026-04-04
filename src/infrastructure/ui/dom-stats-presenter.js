import { IStatsPresenter } from '../../domain/interfaces/ui-contracts.js';

export class DomStatsPresenter extends IStatsPresenter {
    constructor() {
        super();
        this.stats = {
            hunger: {
                bar:         document.getElementById('barra-hambre'),
                value:       document.getElementById('valor-hambre'),
                statusLabel: document.getElementById('estado-hambre'),
                inverse: true,
                labels: { good: 'Controlada', warning: 'Atención', critical: 'Crítica' }
            },
            happiness: {
                bar:         document.getElementById('barra-felicidad'),
                value:       document.getElementById('valor-felicidad'),
                statusLabel: document.getElementById('estado-felicidad'),
                inverse: false,
                labels: { good: 'Alta', warning: 'Media', critical: 'Baja' }
            },
            energy: {
                bar:         document.getElementById('barra-energia'),
                value:       document.getElementById('valor-energia'),
                statusLabel: document.getElementById('estado-energia'),
                inverse: false,
                labels: { good: 'Alta', warning: 'Media', critical: 'Baja' }
            },
            health: {
                bar:         document.getElementById('barra-salud'),
                value:       document.getElementById('valor-salud'),
                statusLabel: document.getElementById('estado-salud'),
                inverse: false,
                labels: { good: 'Óptima', warning: 'Inestable', critical: 'Crítica' }
            },
            boredom: {
                bar:         document.getElementById('barra-aburrimiento'),
                value:       document.getElementById('valor-aburrimiento'),
                statusLabel: document.getElementById('estado-aburrimiento'),
                inverse: true,
                labels: { good: 'Bajo', warning: 'Subiendo', critical: 'Alto' }
            }
        };
    }

    updateBars(tamagotchi) {
        Object.entries(this.stats).forEach(([key, config]) => {
            const value     = tamagotchi[key];
            const level     = this.resolveLevel(value, config.inverse);
            const textLevel = config.labels[level];

            config.bar.style.width           = `${value}%`;
            config.value.textContent         = `${value}% · ${textLevel}`;
            config.statusLabel.dataset.level = level;

            const progressBar = config.bar.parentElement;
            progressBar.setAttribute('aria-valuenow',  String(value));
            progressBar.setAttribute('aria-valuetext', `${key} ${value}% ${textLevel}`);
        });
    }

    resolveLevel(value, inverse) {
        if (inverse) {
            if (value >= 70) return 'critical';
            if (value >= 40) return 'warning';
            return 'good';
        }
        if (value >= 70) return 'good';
        if (value >= 40) return 'warning';
        return 'critical';
    }
}
