export class Tamagotchi {

    constructor(nombre) {
        if (Tamagotchi.instancia) {
            return Tamagotchi.instancia; // Si ya existe una instancia, retornarla
        }
        this.nombre = nombre || 'Tamagotchi';
        this.hambre = 0;
        this.aburrimiento = 0;
        this.energia = 100;
        this.felicidad = 100;
        this.salud = 100;
        this.edad = 0;
        this.estado = new Feliz();
        this.vivo = true;
        this.reloj= new Reloj();


        // Observadores
        this.observadores = {
            hambre: new Observer(document.getElementById('barra-hambre')),
            felicidad: new Observer(document.getElementById('barra-felicidad')),
            energia: new Observer(document.getElementById('barra-energia')),
            salud: new Observer(document.getElementById('barra-salud')),
            aburrimiento: new Observer(document.getElementById('barra-aburrimiento'))
        };

        // Iniciar temporizador para hambre y cansancio
        this.iniciarTemporizadores();
        Tamagotchi.instancia = this;  
    }

    static getInstancia(nombre) {
        if (!Tamagotchi.instancia) {
            Tamagotchi.instancia = new Tamagotchi(nombre);
        }
        return Tamagotchi.instancia;
    }

    static reiniciarInstancia(){
        Tamagotchi.instancia=null;
    }


    alimentar() {
        if (!this.vivo) return;
        this.estado.alimentar(this);
    }

    jugar() {
        if (!this.vivo) return;
        this.estado.jugar(this);
    }

    dormir() {
        if (!this.vivo) return;
        this.estado.dormir(this);
    }
    
    curar() {
        if (!this.vivo) return; 
            this.estado.curar(this);  
    }

    mostrarMensaje(mensaje) {
        var contenedor = document.getElementById('log-mensajes');
        contenedor.innerHTML = "<p>" + mensaje + "</p>";  // Mostrar el mensaje
        
        contenedor.style.display = 'block';  // Asegurarse de que el contenedor sea visible
        
        // Después de 3 segundos, ocultar el mensaje
        setTimeout(function() {
            contenedor.style.display = 'none';  // Ocultar el contenedor después de 3 segundos
        }, 3000);  
    }
    
    mostrarJuego() {
        // Obtén el contenedor del iframe
        const iframeContainer = document.getElementById('minijuego-container');
        
        // Verifica si el contenedor ya está visible antes de mostrarlo
        if (iframeContainer.style.display === 'none') {
            // Si está oculto, lo mostramos y cargamos el juego
            iframeContainer.style.display = 'block';
            document.getElementById('gameFrame').src = 'https://arcade.makecode.com/29587-22905-09020-25217';
        }
    }

    ocultarJuego() {
        const iframeContainer = document.getElementById('minijuego-container');
        iframeContainer.style.display = 'none';  // Esconde el iframe después de jugar
    }
    
    bloquearBotones(ocultar) {
        const botones = document.querySelectorAll(".botones button"); // Seleccionar todos los botones
        botones.forEach((boton) => {
            if (boton.id === 'curar') {
                boton.style.display = 'none'; // Ocultar el botón con id 'curar'
            } else {
                boton.style.display = ocultar ? 'none' : 'inline-block'; // Ocultar o mostrar los demás botones según 'ocultar'
            }
        });
    }
    
    cambiarEstado(nuevoEstado) {
        if (!this.vivo) return;
    
        // Asignar directamente la instancia proporcionada
        this.estado = nuevoEstado;
    
        // Cambia la animación según el nuevo estado
        this.cambiarAnimacion(this.estado.constructor.name.toLowerCase());
    
        // Mostrar u ocultar el botón de curar dependiendo del estado
        if (this.estado instanceof Critico) {
            this.estado.mostrarBotonCurar();
        } else {
            const botonCurar = document.getElementById('curar');
            if (botonCurar) botonCurar.style.display = 'none';
        }
    }
    

    
    aceptar(visitante) {
        // Lista de estados con valores actuales y métodos correspondientes
        const estados = [
            { valor: this.hambre, metodo: () => visitante.visitarHambre(this), critico: 100 },
            { valor: this.salud, metodo: () => visitante.visitarSalud(this), critico: 0 },
            { valor: this.felicidad, metodo: () => visitante.visitarFelicidad(this), critico: 0 },
            { valor: this.energia, metodo: () => visitante.visitarEnergia(this), critico: 0 },
            { valor: this.aburrimiento, metodo: () => visitante.visitarAburrimiento(this), critico: 100 }
        ];

        // Ordenar por cercanía al estado crítico
        estados.sort((a, b) => {
            const diferenciaA = Math.abs(a.valor - a.critico);
            const diferenciaB = Math.abs(b.valor - b.critico);
            return diferenciaA - diferenciaB; // Prioriza el estado más crítico
        });

        // Ejecutar el primer estado crítico encontrado
        for (let estado of estados) {
            if ((estado.critico === 100 && estado.valor >= 100) || 
                (estado.critico === 0 && estado.valor <= 0)) {
                estado.metodo();
                break;
            }
        }
    }

    verificarEstado(visitante) {
        if (this.vivo) {
            const visitante = new MuertePorEstado();
            this.aceptar(visitante);
        }
    }


   
    actualizarEstado() {
        if (!this.vivo) return;
        const reglas = [
            { condicion: () =>  this.salud < 30|| this.hambre > 80 || this.energia <=15, estado: new Critico() },
            { condicion: () => this.energia <= 30, estado: new Cansado() },
            { condicion: () => this.hambre >= 50, estado: new Hambriento() },
            {condicion: () => this.salud > 50, estado: new Feliz()},
            { condicion: () => true, estado: new Feliz() }, 
        ];
        for (const regla of reglas) {
            if (regla.condicion()) {
                this.cambiarEstado(regla.estado);
                break; 
            }
        }
    }

    iniciarTemporizadores(){
        this.temporizador = setInterval(() => {
            if (this.vivo) { 
                if (this.hambre < 100) this.hambre += 10;
                if (this.energia > 0) this.energia -= 10;
                if (this.salud > 0 && this.energia <= 20) this.salud -= 0.5;
                if (this.aburrimiento >= 0) this.aburrimiento += 5;
                this.actualizar();
            } else {
                this.detenerTemporizador();  
            }
        }, 60000);  
    }
    

    actualizarBarras(){
        if(!this.vivo)return;
        this.observadores.hambre.actualizar(this.hambre);
        this.observadores.felicidad.actualizar(this.felicidad);
        this.observadores.energia.actualizar(this.energia);
        this.observadores.salud.actualizar(this.salud);
        this.observadores.aburrimiento.actualizar(this.aburrimiento);
    }

    detenerTemporizador(){
        if (!this.vivo) {
            clearInterval(this.temporizador);  
        }
        
    }

    matar(){
        this.vivo=false;
        this.estado = new Muerto();
        this.detenerTemporizador();
    }


    
    actualizar(){
        if(!this.vivo)return;
        this.actualizarEstado();
        this.actualizarBarras();
        this.verificarEstado();
    }
    
    mostrarAnimacionYActualizar(animacion,duracion,callback){
        return new Promise((resolve)=>{
            this.cambiarAnimacionMetodo(animacion);
            setTimeout(()=>{
                if (callback) callback();
                this.actualizar();
                resolve();
            },duracion)
        });
    }

    cambiarAnimacionMetodo(cadena) {
        const video = document.getElementById('tamagotchi-video');
        
        // Detener cualquier animación en curso antes de cambiar
        video.pause();
        video.src = '';  // Limpiar el video antes de cambiar la fuente
    
        // Asignar un nuevo video basado en la animación
        switch (cadena) {
            case 'triste':
                video.src = './videos/triste.mp4';
                break;
            case 'comer':
                video.src = './videos/Comer.mp4';  // Video cuando está comiendo
                break;
            case 'jugar':
                video.src = './videos/Jugar.mp4';  // Video cuando está jugando
                break;
            case 'dormir':
                video.src = './videos/Dormir.mp4';  // Video cuando está durmiendo
                break;
            case 'matar':
                video.src = './videos/Muerto.mp4';
                break;
            case 'enojado':
                video.src = './videos/Enojado.mp4';
                break;
            case 'preocupado':
                video.src = './videos/Preocupado.mp4';
                break;
        }
    
        // Reproducir el nuevo video asignado
        video.play();
    }
    

    cambiarAnimacion(cadena) {
        const video = document.getElementById('tamagotchi-video');
        video.pause();
        video.src = '';
        switch (cadena) {
            case 'feliz':
                video.src = './videos/Feliz.mp4';  // Video cuando está feliz
                break;
            case 'hambriento':
                video.src = './videos/Hambriento.mp4';  // Video cuando tiene hambre
                break;
            case 'cansado':
                video.src = './videos/Cansado.mp4';  // Video cuando está cansado
                break;
            case 'muerto':
                video.src = './videos/Muerto.mp4';  // Video cuando muere
                break;
            case 'critico':
                video.src = './videos/Enfermo.mp4';
                break;
            default:
                video.src = '';  // Vacío si no hay animación
                break;
        }
        video.play();
    }
}

class Observer {
    constructor(barra) {
        this.barra = barra;
    }

    actualizar(valor) {
        this.barra.style.width = `${valor}%`;
    }
}

class Estado {
    alimentar(tamagotchi) {
        throw new Error('Método alimentar debe implementarse');
    }

    jugar(tamagotchi) {
        throw new Error('Método jugar debe implementarse');
    }

    dormir(tamagotchi) {
        throw new Error('Método dormir debe implementarse');
    }

}
class Feliz extends Estado {
    alimentar(tamagotchi) {
        if(tamagotchi.hambre >=50) {
            tamagotchi.cambiarEstado(new Hambriento());
        }
        tamagotchi.aburrimiento = Math.min(100, tamagotchi.aburrimiento + 10);
        tamagotchi.felicidad = Math.min(100, tamagotchi.felicidad - 5);
        tamagotchi.hambre = Math.min(0, tamagotchi.hambre - 15);
        const hambreReducida = Math.min(0, tamagotchi.hambre);
        tamagotchi.hambre -= hambreReducida;
        tamagotchi.mostrarAnimacionYActualizar('comer',5000);
        tamagotchi.mostrarMensaje(`NAM NAM NAM GALLETITA`);
    }

    jugar(tamagotchi) {
            // Realiza las acciones de juego solo si el Tamagotchi está feliz
            if (tamagotchi.energia <= 30) {
                tamagotchi.mostrarMensaje(`RAWR quiero dormir RAWR`);
                tamagotchi.cambiarEstado(new Cansado());
                return;
            }
            const contadorElement = document.getElementById('tiempo-transcurrido');
            tamagotchi.reloj.iniciarReloj(60000, contadorElement); 
            tamagotchi.bloquearBotones(true); // Inicia el reloj para el tiempo transcurrido
            tamagotchi.mostrarAnimacionYActualizar('jugar',60000);
            tamagotchi.mostrarJuego();
            // Realiza las acciones asociadas al juego durante un minuto
            setTimeout(() => {
                tamagotchi.energia = Math.min(100, tamagotchi.energia - 25); 
                tamagotchi.aburrimiento = Math.min(100, tamagotchi.aburrimiento - 50);  
                tamagotchi.felicidad = Math.min(100, tamagotchi.felicidad + 30);  // Aumenta la felicidad
                tamagotchi.salud = Math.min(100, tamagotchi.salud + 10);  // Aumenta un poco la salud
                tamagotchi.hambre = Math.min(100, tamagotchi.hambre + 10);  // Disminuye el hambre 
                tamagotchi.reloj.detenerReloj(contadorElement);  // Detiene el reloj
                // Luego de un minuto, los botones se desbloquean y se actualiza la interfaz
                tamagotchi.bloquearBotones(false);
                tamagotchi.ocultarJuego();
            }, 60000);  // Retraso de 1 minuto
        }
    

    dormir(tamagotchi) {
        tamagotchi.mostrarMensaje(`No estoy cansado, déjame jugar un poco más.`);
        tamagotchi.felicidad = Math.max(0, tamagotchi.felicidad - 10);
        tamagotchi.salud = Math.max(0, tamagotchi.salud - 10);
        tamagotchi.aburrimiento = Math.min(100, tamagotchi.aburrimiento + 15);
        tamagotchi.mostrarAnimacionYActualizar('enojado',5000);
    }

}

class Hambriento extends Estado {
    alimentar(tamagotchi) {
        const hambreReducida = Math.min(20, tamagotchi.hambre);
        tamagotchi.hambre -= hambreReducida;
        tamagotchi.felicidad = Math.min(100, tamagotchi.felicidad + 10);
        tamagotchi.mostrarAnimacionYActualizar('comer',5000);
       tamagotchi.mostrarMensaje(` RAWR quiero mas comida RAWR `);
        
        if (tamagotchi.hambre <= 20) {
            tamagotchi.cambiarEstado(new Feliz()); 
        }
    }

    jugar(tamagotchi) {
        if(tamagotchi.hambre>80){
            tamagotchi.mostrarAnimacionYActualizar('preocupado',2000);
            tamagotchi.cambiarEstado = new Critico();}
        tamagotchi.mostrarMensaje('No estoy aburrido, tengo hambre.');
        tamagotchi.mostrarAnimacionYActualizar('triste',5000);
        tamagotchi.felicidad = Math.max(0, tamagotchi.felicidad - 30);
        tamagotchi.salud = Math.max(0, tamagotchi.salud - 30);
        tamagotchi.aburrimiento = Math.min(100, tamagotchi.aburrimiento + 10);
    }

    dormir(tamagotchi) {
        if(tamagotchi.hambre>80){
            tamagotchi.mostrarAnimacionYActualizar('preocupado',2000);
            tamagotchi.cambiarEstado = new Critico();
        }
        tamagotchi.mostrarMensaje('No estoy cansado, tengo hambre y te ves jugosito.');
        tamagotchi.felicidad = Math.max(0, tamagotchi.felicidad - 10);
        tamagotchi.salud = Math.max(0, tamagotchi.salud - 30);
        tamagotchi.mostrarAnimacionYActualizar('enojado',5000);

        
    }
}

class Cansado extends Estado {
    dormir(tamagotchi) {
        if (tamagotchi.energia <= 30) {
            tamagotchi.mostrarMensaje(`${tamagotchi.nombre} tiene poca energía y está durmiendo por 2 minutos.`);

            const contadorElement = document.getElementById('tiempo-transcurrido');
            tamagotchi.reloj.iniciarReloj(120000, contadorElement); 
            tamagotchi.bloquearBotones(true); 
            tamagotchi.mostrarAnimacionYActualizar('dormir', 120000);
            tamagotchi.energia = 40;
            
            setTimeout(() => {
                tamagotchi.energia = 100;  // Recupera un poco de energía
                tamagotchi.felicidad = Math.min(100, tamagotchi.felicidad + 20);  
                tamagotchi.salud = Math.min(100, tamagotchi.salud + 10);  
                tamagotchi.hambre = Math.min(100, tamagotchi.hambre + 5);  
                tamagotchi.reloj.detenerReloj(contadorElement);  // Detiene el reloj
                tamagotchi.bloquearBotones(false);
            }, 120000); 
        } 
    }

    alimentar(tamagotchi) {
        tamagotchi.mostrarMensaje('DORMIR DORMIR SOLO QUIERO DORMIR');
        tamagotchi.felicidad = Math.max(0, tamagotchi.felicidad - 15);
        tamagotchi.energia = Math.max(0,tamagotchi.energia - 10);
        tamagotchi.salud = Math.max(0, tamagotchi.salud - 10);
        tamagotchi.mostrarAnimacionYActualizar('triste',5000);

    }

    jugar(tamagotchi) {
        tamagotchi.mostrarMensaje(`RAWR DORMIR DORMIR QUIERO DORMIR`);
        tamagotchi.felicidad = Math.max(0, tamagotchi.felicidad - 30);
        tamagotchi.salud = Math.max(0, tamagotchi.salud - 30);
        tamagotchi.mostrarAnimacionYActualizar('triste',5000);
        if(tamagotchi.energia<20){tamagotchi.cambiarEstado(new Critico());}
        tamagotchi.actualizar();
    }
}


class Critico extends Estado {

    alimentar(tamagotchi) {
        tamagotchi.mostrarMensaje(`${tamagotchi.nombre} está en un estado crítico, necesita atención urgente.`);
        tamagotchi.salud = Math.max(0, tamagotchi.salud - 20);
        tamagotchi.hambre = Math.max(0, tamagotchi.hambre -15 );
        tamagotchi.mostrarAnimacionYActualizar('Preocupado',5000);
        if (tamagotchi.salud <= 0) {
            tamagotchi.cambiarEstado(new Muerto());  // Cambiar al estado Muerto si la salud es 0 o menos
        } 
    }


    jugar(tamagotchi) {
        tamagotchi.mostrarMensaje(`${tamagotchi.nombre} no puede jugar en estado crítico.`);
        tamagotchi.salud = Math.max(0, tamagotchi.salud - 30);
        tamagotchi.energia = Math.max(0, tamagotchi.energia -15 );
        tamagotchi.mostrarAnimacionYActualizar('preocupado',5000);
        if (tamagotchi.salud <= 0) {
            tamagotchi.cambiarEstado(new Muerto()); }// Cambiar al estado Muerto si la salud es 0 o menos
    }


    dormir(tamagotchi) {
        tamagotchi.mostrarMensaje(`estoy enfermito :(`);
        tamagotchi.energia = Math.max(100, tamagotchi.energia + 20);
        tamagotchi.hambre = Math.min(100, tamagotchi.hambre + 15);
        tamagotchi.mostrarAnimacionYActualizar('preocupado',5000);
        
    if (tamagotchi.salud <= 0) {
        tamagotchi.cambiarEstado(new Muerto());  // Cambiar al estado Muerto si la salud es 0 o menos
    } else if (tamagotchi.salud > 50) {
        tamagotchi.cambiarEstado(new Cansado());
    }
    }


    mostrarBotonCurar() {
        document.getElementById('curar').style.display = 'block';
    }


    curar(tamagotchi) {
        if(tamagotchi.salud > 60){tamagotchi.cambiarEstado(new Feliz());}
        tamagotchi.salud = Math.min(100, tamagotchi.salud + 20);
        tamagotchi.mostrarMensaje(`${tamagotchi.nombre} ha sido curado. Salud actual: ${tamagotchi.salud}`);
        tamagotchi.actualizar();
    }

}

class Muerto extends Estado {
    alimentar(tamagotchi) {
        tamagotchi.mostrarMensaje(`estoy muerto`);
    }

    jugar(tamagotchi) {
        tamagotchi.mostrarMensaje(`estoy muerto`);
    }

    dormir(tamagotchi) {
        tamagotchi.mostrarMensaje(`estoy muerto`);
    }


}


class VisitanteMuerte {
    visitarHambre(tamagotchi) {}
    visitarSalud(tamagotchi) {}
    visitarFelicidad(tamagotchi) {}
    visitarEnergia(tamagotchi) {}
}

class MuertePorEstado extends VisitanteMuerte {
    animacion(tamagotchi){
        const video = document.getElementById('tamagotchi-video');
        video.src = './videos/Muerto.mp4';
        video.play();
    }

    visitarHambre(tamagotchi) {
        tamagotchi.mostrarMensaje(`${tamagotchi.nombre} ha fallecido por hambre extrema. 🍽️💀`);
        this.animacion();
        tamagotchi.matar();
    }

    visitarSalud(tamagotchi) {
        tamagotchi.mostrarMensaje(`${tamagotchi.nombre} ha fallecido por mala salud. 🤒💀`);
        this.animacion();
        tamagotchi.matar();
    }

    visitarFelicidad(tamagotchi) {
       tamagotchi.mostrarMensaje(`${tamagotchi.nombre} ha fallecido por tristeza extrema. 😭💀`);
        this.animacion();
        tamagotchi.matar();
    }

    visitarEnergia(tamagotchi) {
        tamagotchi.mostrarMensaje(`${tamagotchi.nombre} ha fallecido por agotamiento extremo. 😴💀`);
        this.animacion();
        tamagotchi.matar();

    }

    visitarAburrimiento(tamagotchi) {
        tamagotchi.mostrarMensaje(`${tamagotchi.nombre} ha fallecido por aburrimiento. 💀`);
        this.animacion();
        tamagotchi.matar();
    }
}

class Reloj {
    constructor() {
        this.intervaloReloj = null;
    }

    iniciarReloj(tiempoTotal, contadorElement) {
        if (contadorElement) {
            contadorElement.style.display = 'block';  // Mostrar el contador
        }
        let tiempoRestante = tiempoTotal / 1000; // Convertir a segundos

        const actualizarReloj = () => {
            contadorElement
            const minutos = Math.floor(tiempoRestante / 60);
            const segundos = tiempoRestante % 60;
            contadorElement.textContent = `${minutos}:${segundos}`;
        };

        // Mostrar reloj desde el principio
        actualizarReloj();

        this.intervaloReloj = setInterval(() => {
            tiempoRestante--;

            if (tiempoRestante <= 0) {
                clearInterval(this.intervaloReloj);
                this.intervaloReloj = null;
                contadorElement.textContent = "00:00";
            } else {
                actualizarReloj();
            }
        }, 1000);
    }

    detenerReloj(contadorElement) {
        if (contadorElement) {
            contadorElement.style.display = 'none';  // Ocultar el contador cuando el reloj se detiene
        }
        if (this.intervaloReloj) {
            clearInterval(this.intervaloReloj);  // Detener el intervalo
            this.intervaloReloj = null;  // Restablecer el intervalo
        }
    }
}    



