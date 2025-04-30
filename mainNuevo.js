import { Tamagotchi } from './tamagotchifinal.js';

const pantallaInicial = document.getElementById('pantalla-inicial');
const mensajeBienvenida = document.getElementById('mensaje-bienvenida');
const formularioNombre = document.getElementById('formulario-nombre');
const continuarJuego = document.getElementById('continuar-juego');
const nombreTamagotchiInput = document.getElementById('nombre-tamagotchi');
const crearTamagotchiBtn = document.getElementById('crear-tamagotchi');
const video = document.getElementById('tamagotchi-video');
const pantallaMuerte = document.getElementById('pantalla-muerte');
const mensajeMuerte = document.getElementById('mensaje-muerte');
const nombreTamagotchi = document.getElementById('nombre-dragon');
const alimentarBtn = document.getElementById('alimentar');
const jugarBtn = document.getElementById('jugar');
const dormirBtn = document.getElementById('dormir');
const curarBtn = document.getElementById('curar');
const reiniciarTamagotchiBtn = document.getElementById('reiniciar-Tamagotchi');
const pipButton = document.getElementById('pip-button'); // Botón para activar PiP

let tamagotchiInstance = null;

// Guardar estado del Tamagotchi
function guardarEstado() {
    if (tamagotchiInstance) {
        const estado = {
            nombre: tamagotchiInstance.nombre,
            hambre: tamagotchiInstance.hambre,
            aburrimiento: tamagotchiInstance.aburrimiento,
            energia: tamagotchiInstance.energia,
            felicidad: tamagotchiInstance.felicidad,
            salud: tamagotchiInstance.salud,
            edad: tamagotchiInstance.edad,
            vivo: tamagotchiInstance.vivo,
        };
        localStorage.setItem('tamagotchiEstado', JSON.stringify(estado));
    }
}

// Cargar estado del Tamagotchi desde almacenamiento local
function cargarEstado() {
    const estadoGuardado = localStorage.getItem('tamagotchiEstado');
    if (estadoGuardado) {
        const data = JSON.parse(estadoGuardado);
        tamagotchiInstance = Tamagotchi.getInstancia(data.nombre);
        Object.assign(tamagotchiInstance, data);
    }
}

// Manejar la muerte del Tamagotchi
function manejarMuerte() {
    pantallaInicial.style.display = 'none';
    mensajeMuerte.style.display = 'block'
    mensajeMuerte.textContent = `${tamagotchiInstance.nombre} ha fallecido. Puede adoptar un nuevo tamagotchi`;
    reiniciarTamagotchiBtn.style.display ='inline-block';
}

// Inicializar la aplicación
function inicializar() {
    cargarEstado();

    if (tamagotchiInstance) {
        if (tamagotchiInstance.vivo) {
            pantallaMuerte.style.display = 'none';
            mensajeBienvenida.textContent = `¡Bienvenido de vuelta! ${tamagotchiInstance.nombre} está feliz de verte de nuevo.`;
            continuarJuego.style.display = 'inline-block';
            formularioNombre.style.display = 'none';
            tamagotchiInstance.actualizar();
            nombreTamagotchi.innerHTML = tamagotchiInstance.nombre;
        } else {
            manejarMuerte();
        }
    } else {
        formularioNombre.style.display = 'block';
        continuarJuego.style.display = 'none';
        pantallaMuerte.style.display = 'none';
    }
}

function AnimacionInicial(tamagotchiInstance, callback) {
    return new Promise((resolve) => {
        const video = document.querySelector('video'); 
        if (!video) {
            console.error('No se encontró un elemento <video> en el DOM.');
            resolve(); 
            return;
        }

        video.src = './videos/inicio.mp4';
        video.play();

        
        video.onended = () => {
            if (callback) callback();
            tamagotchiInstance.actualizar(); 
            resolve();
        };

        // Como respaldo, un límite de tiempo para resolver la promesa
        setTimeout(() => {
            if (callback) callback();
            tamagotchiInstance.actualizar();
            resolve();
        }, 3000); // Tiempo máximo de espera (3 segundos)
    });
}


// Función para habilitar Picture-in-Picture (PiP)
function activarPictureInPicture() {
    if (document.pictureInPictureEnabled && !video.disablePictureInPicture) {
        video.requestPictureInPicture()
            .then(() => {
                console.log('Video ahora en modo Picture-in-Picture.');
            })
            .catch((error) => {
                console.error('Error al activar Picture-in-Picture:', error);
            });
    } else {
        console.warn('Picture-in-Picture no está habilitado en este navegador.');
    }
}


crearTamagotchiBtn.addEventListener('click', () => {
    const nombre = nombreTamagotchiInput.value.trim();
    if (nombre) {
        tamagotchiInstance = Tamagotchi.getInstancia(nombre);
        guardarEstado();
        pantallaInicial.style.display = 'none';
        nombreTamagotchi.innerHTML = tamagotchiInstance.nombre;
        AnimacionInicial(tamagotchiInstance);
    }
});

pipButton.addEventListener('click', activarPictureInPicture);

function reiniciarJuego() {
    localStorage.removeItem('tamagotchiEstado');
    Tamagotchi.reiniciarInstancia();
    tamagotchiInstance = null;
    window.location.reload();
}

reiniciarTamagotchiBtn.addEventListener('click', reiniciarJuego);

continuarJuego.addEventListener('click', () => {
    pantallaInicial.style.display = 'none';
});

alimentarBtn.addEventListener('click', () => {
    if (tamagotchiInstance) {
        tamagotchiInstance.alimentar();
        guardarEstado();
        if (!tamagotchiInstance.vivo) manejarMuerte();
    }
});

jugarBtn.addEventListener('click', () => {
    if (tamagotchiInstance) {
        tamagotchiInstance.jugar();
        guardarEstado();
        if (!tamagotchiInstance.vivo) manejarMuerte();
    }
});

dormirBtn.addEventListener('click', () => {
    if (tamagotchiInstance) {
        tamagotchiInstance.dormir();
        guardarEstado();
        if (!tamagotchiInstance.vivo) manejarMuerte();
    }
});

curarBtn.addEventListener('click', () => {
    if (tamagotchiInstance) {
        tamagotchiInstance.curar();
        guardarEstado();
        if (!tamagotchiInstance.vivo) manejarMuerte();
    }
});

// Detectar cierre de la página para guardar automáticamente
window.addEventListener('beforeunload', guardarEstado);

// Inicializar el juego al cargar la página
inicializar();
