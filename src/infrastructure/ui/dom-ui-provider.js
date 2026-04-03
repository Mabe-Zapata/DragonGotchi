import { VideoManager } from '../video/video-manager.js';

export class DomUIProvider {
    constructor() {
        this.videoManager = new VideoManager();
        this.video = document.getElementById('tamagotchi-video');
        this.logMensajes = document.getElementById('log-mensajes');
        this.barras = {
            hambre: document.getElementById('barra-hambre'),
            felicidad: document.getElementById('barra-felicidad'),
            energia: document.getElementById('barra-energia'),
            salud: document.getElementById('barra-salud'),
            aburrimiento: document.getElementById('barra-aburrimiento')
        };
        this.minijuegoContainer = document.getElementById('minijuego-container');
        this.gameFrame = document.getElementById('gameFrame');
        this.relojContainer = document.getElementById('tiempo-transcurrido');
    }

    mostrarMensaje(mensaje) {
        this.logMensajes.innerHTML = `<p>${mensaje}</p>`;
        this.logMensajes.style.display = 'block';
        setTimeout(() => {
            this.logMensajes.style.display = 'none';
        }, 3000);
    }

    cambiarAnimacion(nombre, tamagotchi = null) {
        this.video.pause();
        const videoPath = this.videoManager.getVideoPath(nombre, tamagotchi);
        this.video.src = videoPath;
        this.video.play();
    }

    mostrarAnimacionYActualizar(nombre, duracion, tamagotchi = null) {
        this.cambiarAnimacion(nombre, tamagotchi);
        return new Promise(resolve => setTimeout(resolve, duracion));
    }

    actualizarBarras(tamagotchi) {
        this.barras.hambre.style.width = `${tamagotchi.hambre}%`;
        this.barras.felicidad.style.width = `${tamagotchi.felicidad}%`;
        this.barras.energia.style.width = `${tamagotchi.energia}%`;
        this.barras.salud.style.width = `${tamagotchi.salud}%`;
        this.barras.aburrimiento.style.width = `${tamagotchi.aburrimiento}%`;
    }

    iniciarMinijuego() {
        this.minijuegoContainer.style.display = 'block';
        this.gameFrame.src = 'https://arcade.makecode.com/29587-22905-09020-25217';
    }

    ocultarMinijuego() {
        this.minijuegoContainer.style.display = 'none';
    }

    bloquearBotones(bloquear) {
        const botones = document.querySelectorAll(".botones button");
        botones.forEach(boton => {
            if (boton.id !== 'curar') {
                boton.style.display = bloquear ? 'none' : 'inline-block';
            }
        });
    }
}
