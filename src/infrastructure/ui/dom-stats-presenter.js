import { IStatsPresenter } from '../../domain/interfaces/ui-contracts.js';

export class DomStatsPresenter extends IStatsPresenter {
    constructor() {
        super();
        this.stats = {
            hambre: {
                barra: document.getElementById('barra-hambre'),
                valor: document.getElementById('valor-hambre'),
                estado: document.getElementById('estado-hambre'),
                inverse: true,
                labels: { good: 'Controlada', warning: 'Atención', critical: 'Crítica' }
            },
            felicidad: {
                barra: document.getElementById('barra-felicidad'),
                valor: document.getElementById('valor-felicidad'),
                estado: document.getElementById('estado-felicidad'),
                inverse: false,
                labels: { good: 'Alta', warning: 'Media', critical: 'Baja' }
            },
            energia: {
                barra: document.getElementById('barra-energia'),
                valor: document.getElementById('valor-energia'),
                estado: document.getElementById('estado-energia'),
                inverse: false,
                labels: { good: 'Alta', warning: 'Media', critical: 'Baja' }
            },
            salud: {
                barra: document.getElementById('barra-salud'),
                valor: document.getElementById('valor-salud'),
                estado: document.getElementById('estado-salud'),
                inverse: false,
                labels: { good: 'Óptima', warning: 'Inestable', critical: 'Crítica' }
            },
            aburrimiento: {
                barra: document.getElementById('barra-aburrimiento'),
                valor: document.getElementById('valor-aburrimiento'),
                estado: document.getElementById('estado-aburrimiento'),
                inverse: true,
                labels: { good: 'Bajo', warning: 'Subiendo', critical: 'Alto' }
            }
        };
    }

    actualizarBarras(tamagotchi) {
        Object.entries(this.stats).forEach(([key, config]) => {
            const value = tamagotchi[key];
            const level = this.resolveLevel(value, config.inverse);
            const textLevel = config.labels[level];

            config.barra.style.width = `${value}%`;
            config.valor.textContent = `${value}% · ${textLevel}`;
            config.estado.dataset.level = level;

            const progressBar = config.barra.parentElement;
            progressBar.setAttribute('aria-valuenow', String(value));
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
