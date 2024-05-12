
class Tamagochi {//Clase que representa la mascota virtual, con sus atributos y comportamientos.
    constructor(nombre) {
        if (Tamagochi.instance instanceof Tamagochi) {//Patron de diseño Singleton
            return Tamagochi.instance;
        }

        this.peso = 5.0;
        this.nivel = 1;
        this.vida = 100;
        this.felicidad = 10;
        this.nombre = nombre;
        this.necesidadBano = false;
        this.dormir = false;
        this.count = 0;
        this.state = '😀';
        Tamagochi.instance = this;
    }

    contadorVecesQueCome() { //Lleva la cuenta de veces que come
        if (this.count < 4) {
            this.comer();
            this.count++;
        } else {
            this.setNecesidadBano(true);
        }
    }

    getState() {
        return this.state;
    }

    setState(state) {
        this.state = state;
    }
    getNivel() {
        return this.nivel;
    }

    setNivel(nivel) {
        this.nivel = nivel;
    }

    getVida() {
        return this.vida;
    }
    setCount(count) {
        this.count = count;
    }

    getCount() {
        return this.count;
    }
    setVida(vida) {
        this.vida = vida;
    }

    getPeso() {
        return this.peso;
    }

    setPeso(peso) {
        this.peso = peso;
    }

    getFelicidad() {
        return this.felicidad;
    }

    setFelicidad(felicidad) {
        this.felicidad = felicidad;
    }

    getNombre() {
        return this.nombre;
    }

    setNombre(nombre) {
        this.nombre = nombre;
    }

    isDormir() {
        return this.dormir;
    }

    setDormir(dormir) {
        this.dormir = dormir;
    }

    getNecesidadBano() {
        return this.necesidadBano;
    }

    setNecesidadBano(necesidadBano) {
        this.necesidadBano = necesidadBano;
    }


}

class Jugador {// Clase que representa al usuario
    constructor(nombre, mascota, clave) {


        this.nombre = nombre;
        this.mascota = new Tamagochi(mascota);
        this.clave = clave;
        this.primeraConexion = null;
        this.observadores = [];

        Jugador.instancia = this;
    }

    getClave() {
        return this.clave;
    }

    setClave(clave) {
        this.clave = clave;
    }

    getNombre() {
        return this.nombre;
    }

    setNombre(nombre) {
        this.nombre = nombre;
    }

    getMascota() {
        return this.mascota;
    }

    getPrimeraConexion() {
        return this.primeraConexion;
    }

    setPrimeraConexion(primeraConexion) {
        this.primeraConexion = primeraConexion;
    }

    agregarObservador(observador) {
        this.observadores.push(observador);
    }

    eliminarObservador(observador) {
        const index = this.observadores.indexOf(observador);
        if (index > -1) {
            this.observadores.splice(index, 1);
        }
    }

    notificarObservadores() {
        this.observadores.forEach((observador) => {
            observador.update();
        });
    }
}
class ControlHilos {//Clase que maneja los intervalos con Web Workers por efectos over time
    constructor() {
        this.g = new Guardados();
        this.hiloFelicidadEjecutando = false;
        this.hiloDormirEjecutando = false;
        this.hiloAgonizarEjecutando = false;
        this.hiloRecuperarEjecutando = false;
        this.intervalIdReduccionFeli = null;
        this.intervalIdAgonizar = null;
        this.intervalIdDormir = null;
        this.intervalIdRecuperar = null;
    }

    reduccionDeFelicidad(tamagochi) {//Disminuye la felicidad
        if (!this.hiloFelicidadEjecutando) {
            this.hiloFelicidadEjecutando = true;

            this.intervalIdReduccionFeli = setInterval(() => {
                if (tamagochi.getFelicidad() > 0) {
                    if (tamagochi.getFelicidad() < 4) {
                        guardarMensaje(`${tamagochi.getNombre()} está con niveles bajos de felicidad`);
                        mostrarMensajesEnDiv();
                        tamagochi.setFelicidad(tamagochi.getFelicidad() - 1);
                    }
                    tamagochi.setFelicidad(tamagochi.getFelicidad() - 1);

                    document.getElementById('text3').innerHTML = `<img src="imagenes/felicidadPixeles.png" alt="Image 3"> ${tamagochi.getFelicidad()}`;
                    if (tamagochi.getFelicidad() === -1) {
                        tamagochi.setFelicidad(0);
                    }
                    if ((tamagochi.getFelicidad() <= 10 && tamagochi.getFelicidad() > 8)) {
                        tamagochi.setState('😀');
                        document.getElementById('textEstado').innerText = 'Estado: ' + tamagochi.getState();
                    }
                    if ((tamagochi.getFelicidad() <= 8 && tamagochi.getFelicidad() > 5)) {
                        tamagochi.setState('😠');
                        document.getElementById('textEstado').innerText = 'Estado: ' + tamagochi.getState();
                    }
                    if ((tamagochi.getFelicidad() <= 5 && tamagochi.getFelicidad() > 2)) {
                        tamagochi.setState('😭');
                        document.getElementById('textEstado').innerText = 'Estado: ' + tamagochi.getState();
                    }
                    if ((tamagochi.getFelicidad() <= 2 && tamagochi.getFelicidad() >= 0)) {
                        tamagochi.setState('💀');
                        document.getElementById('textEstado').innerText = 'Estado: ' + tamagochi.getState();
                    }
                    if (tamagochi.getFelicidad() === 0) {
                        guardarMensaje(`${tamagochi.getNombre()} está sin felicidad`);
                        mostrarMensajesEnDiv();
                    }
                } else {
                    clearInterval(this.intervalIdReduccionFeli);
                    this.hiloFelicidadEjecutando = false;
                }
            }, 30000); // Cada 30 segundos
        }
    }

    tiempoDeDormir(tamagochi) {//Cambia de estado a dormir
        if (!this.hiloDormirEjecutando) {
            this.hiloDormirEjecutando = true;

            this.intervalIdDormir = setInterval(() => {
                if (!tamagochi.isDormir()) {
                    guardarMensaje(`${tamagochi.getNombre()} ya quiere dormir`);
                    mostrarMensajesEnDiv();
                    tamagochi.setDormir(true);
                    if (tamagochi.isDormir()) {
                        document.getElementById('text6').innerHTML = `<img src="imagenes/vistoPixel.png" alt="Image 6"> ${"Quiere dormir"}`;
                    } else {
                        document.getElementById('text6').innerHTML = `<img src="imagenes/xPixel.png" alt="Image 6"> ${"No quiere dormir"}`;
                    }
                }

            }, 120000); // 2 minutos
        }
    }

    agonizar(jugador) {//Disminuye la vida

        if (!this.hiloAgonizarEjecutando) {
            this.hiloAgonizarEjecutando = true;

            this.intervalIdAgonizar = setInterval(() => {
                if (jugador.getMascota().getFelicidad() < 4) {
                    jugador.getMascota().setVida(jugador.getMascota().getVida() - 1);
                    guardarMensaje(jugador.getMascota().getNombre() + 'Esta agonizando');
                    mostrarMensajesEnDiv();
                    document.getElementById('text2').innerHTML = `<img src="imagenes/corazonPixeles.png" alt="Image 2"> ${jugador.getMascota().getVida()}`;
                }

                if (jugador.getMascota().getVida() <= 0) {
                    eliminarPartida(jugador);
                    mostrarMensajesEnDiv();
                    clearInterval(this.intervalIdAgonizar);
                    this.hiloAgonizarEjecutando = false;
                }
            }, 10000); // cada 10 segundos
        }
    }

    recuperarVida(tamagochi) {//Aumenta la vida
        if (!this.hiloRecuperarEjecutando) {
            this.hiloRecuperarEjecutando = true;

            this.intervalIdRecuperar = setInterval(() => {
                if (tamagochi.getFelicidad() >= 4) {
                    if (tamagochi.getVida() < 100) {
                        tamagochi.setVida(tamagochi.getVida() + 1);
                        document.getElementById('text2').innerHTML = `<img src="imagenes/corazonPixeles.png" alt="Image 2"> ${tamagochi.getVida()}`;

                    }
                }

            }, 5000); // cada 5 segundos
        }
    }
    actualizandoLocalStorage(jugador) {
        setInterval(() => {

            localStorage.setItem('partidaJugador', JSON.stringify(jugador));
            mostrarMensajesEnDiv();
        }, 500);
    }

    finalizarWorkers() {
        clearInterval(this.intervalIdAgonizar);
        clearInterval(this.intervalIdDormir);
        clearInterval(this.intervalIdRecuperar);
        clearInterval(this.intervalIdReduccionFeli);

        this.hiloAgonizarEjecutando = false;
        this.hiloDormirEjecutando = false;
        this.hiloRecuperarEjecutando = false;
        this.hiloFelicidadEjecutando = false;
    }
}

// Cuando se realiza un cambio en el objeto jugador, se llama al método notificarObservadores()

class Guardados { //Clase que se encarga de de guadar y cargar partidas
    constructor() {

    }

    guardarPartidaCargada(jugador) {//Actualiza los datos del jugador

        const data = localStorage.getItem('datosDelJugador');
        this.jugadores = data ? JSON.parse(data) : [];

        for (let i = 0; i < this.jugadores.length; i++) {
            if (this.jugadores[i].nombre === jugador.getNombre()) {
                this.jugadores[i] = jugador;
                break;
            }
        }
        localStorage.setItem('datosDelJugador', JSON.stringify(this.jugadores));
    }



    crearPartida() { //Crea la partida
        if (
            document.getElementById('newUsername').value === '' ||
            document.getElementById('newPassword').value === '' ||
            document.getElementById('confirmPassword').value === '' ||
            document.getElementById('petName').value === '') {
            console.log('Por favor rellene todos los cuadros de texto');
        } else {
            let nombreUnico = true;

            // Verificar si la clave existe en localStorage
            if ('datosDelJugador' in localStorage) {
                // La clave existe, obtener los datos almacenados
                const data = localStorage.getItem('datosDelJugador');
                this.jugadores = data ? JSON.parse(data) : [];
            } else {
                // La clave no existe, inicializar localStorage con un valor predeterminado
                // En este caso, un array vacío
                localStorage.setItem('datosDelJugador', JSON.stringify([]));
                this.jugadores = [];
            }

            // Verificar si el nombre de usuario ya existe en el almacenamiento local
            const nuevoUsername = document.getElementById('newUsername').value;
            for (let i = 0; i < this.jugadores.length; i++) {
                if (this.jugadores[i].nombre === nuevoUsername) {
                    nombreUnico = false;
                    break;
                }

            }

            if (nombreUnico) {
                if (document.getElementById('newPassword').value === document.getElementById('confirmPassword').value) {
                    const nuevoJugador = new Jugador(
                        nuevoUsername,
                        new Tamagochi(document.getElementById('petName').value),
                        document.getElementById('newPassword').value);

                    nuevoJugador.setPrimeraConexion(this.fecha());
                    try {
                        this.jugadores.push(nuevoJugador);
                        window.alert('Se ha creado una nueva partida ');
                        goBackToLogin();
                        localStorage.setItem('datosDelJugador', JSON.stringify(this.jugadores));

                        // Restablecer o limpiar los campos del formulario solo si se crea exitosamente un nuevo jugador
                        document.getElementById('newUsername').value = '';
                        document.getElementById('newPassword').value = '';
                        document.getElementById('confirmPassword').value = '';
                        document.getElementById('petName').value = '';

                    } catch (error) {
                        window.alert('Error en crear la partida');
                    }
                } else {
                    window.alert('La contraseña no coincide');
                    document.getElementById('newPassword').value = '';
                    document.getElementById('confirmPassword').value = '';
                }
            } else {
                window.alert('Nombre de usuario no esta disponible. Cambie a otro ');
            }
        }
    }
    login() {
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        var storedPlayers = localStorage.getItem('datosDelJugador');

        if (storedPlayers) {
            // El objeto existe en el localStorage, intenta encontrar al jugador con el nombre de usuario
            var playersArray = JSON.parse(storedPlayers);
            var foundPlayer = playersArray.find(player => player.nombre === username);


            if (foundPlayer && foundPlayer.clave === password) {
                alert('Inicio de sesión exitoso');

                localStorage.setItem('partidaJugador', JSON.stringify(foundPlayer));
                // Redirige a otra interfaz después del inicio de sesión exitoso
                goToSalaPrincipal();
            } else {
                alert('Credenciales incorrectas. Intenta de nuevo.');
            }
        } else {
            alert('No hay jugadores registrados. Regístrate primero.');
        }


    }
    cargarDatos() {// Inicializa los datos de la partida guardada
        var partidaJugadorString = localStorage.getItem('partidaJugador');
        var partidaJugador = JSON.parse(partidaJugadorString);
        const jugador = new Jugador('', '', '');
        jugador.setNombre(partidaJugador.nombre);
        jugador.setClave(partidaJugador.clave);
        jugador.setPrimeraConexion(partidaJugador.primeraConexion);
        jugador.getMascota().setNombre(partidaJugador.mascota.nombre);
        jugador.getMascota().setNivel(partidaJugador.mascota.nivel);
        jugador.getMascota().setPeso(partidaJugador.mascota.peso);
        jugador.getMascota().setVida(partidaJugador.mascota.vida);
        jugador.getMascota().setFelicidad(partidaJugador.mascota.felicidad);
        jugador.getMascota().setNecesidadBano(partidaJugador.mascota.necesidadBano);
        jugador.getMascota().setDormir(partidaJugador.mascota.dormir);
        jugador.getMascota().setCount(partidaJugador.mascota.count);
        jugador.getMascota().setState(partidaJugador.mascota.state);
        console.log(jugador.getPrimeraConexion());
        this.cargarWorker(jugador);

        this.actualizarInterfaz(jugador);
    }
    actualizarInterfaz(jugador) {

        // Actualiza el contenido del elemento con el ID 
        document.getElementById('text1').innerText = 'Level: ' + jugador.getMascota().getNivel();
        document.getElementById('textoEncima').innerText = jugador.getMascota().getNombre();
        document.getElementById('textoEsquina').innerText = 'Usuario: ' + jugador.getNombre();
        document.getElementById('textEstado').innerText = 'Estado: ' + jugador.getMascota().getState();
        document.getElementById('text2').innerHTML = `<img src="imagenes/corazonPixeles.png" alt="Image 2"> ${jugador.getMascota().getVida()}`;
        document.getElementById('text3').innerHTML = `<img src="imagenes/felicidadPixeles.png" alt="Image 3"> ${jugador.getMascota().getFelicidad()}`;
        document.getElementById('text4').innerHTML = `<img src="imagenes/pesoPixel.png" alt="Image 4"> ${jugador.getMascota().getPeso()}`;
        if (jugador.getMascota().getNecesidadBano()) {
            document.getElementById('text5').innerHTML = `<img src="imagenes/vistoPixel.png" alt="Image 5"> ${"Quiere ir al baño"}`;
            guardarMensaje(jugador.getMascota().getNombre() + ' quiere ir al baño!!!');
            mostrarMensajesEnDiv();
        } else {
            document.getElementById('text5').innerHTML = `<img src="imagenes/xPixel.png" alt="Image 5"> ${"No quiere ir al baño"}`;
        }
        if (jugador.getMascota().isDormir()) {
            document.getElementById('text6').innerHTML = `<img src="imagenes/vistoPixel.png" alt="Image 6"> ${"Quiere dormir"}`;
            guardarMensaje(jugador.getMascota().getNombre() + ' quiere ir a dormir!!!');
            mostrarMensajesEnDiv();
        } else {
            document.getElementById('text6').innerHTML = `<img src="imagenes/xPixel.png" alt="Image 6"> ${"No quiere dormir"}`;
        }
    }
    cargarWorker(jugador) {
        let workers = new ControlHilos();

        //finaliza todos los worker anteriores para poder iniciar de nuevo cada que cambie de interfaz
        workers.finalizarWorkers(jugador);
        workers.reduccionDeFelicidad(jugador.getMascota());
        workers.agonizar(jugador);
        workers.tiempoDeDormir(jugador.getMascota());
        workers.recuperarVida(jugador.getMascota());
        workers.actualizandoLocalStorage(jugador);
    }
    //Patron de diseño command
    accionarBotonesDidacticos(accion) {

        var partidaJugadorString = localStorage.getItem('partidaJugador');
        var partidaJugador = JSON.parse(partidaJugadorString);
        const jugador = new Jugador('', '', '');
        jugador.setNombre(partidaJugador.nombre);
        jugador.setClave(partidaJugador.clave);
        jugador.setPrimeraConexion(partidaJugador.primeraConexion);
        jugador.getMascota().setNombre(partidaJugador.mascota.nombre);
        jugador.getMascota().setNivel(partidaJugador.mascota.nivel);
        jugador.getMascota().setPeso(partidaJugador.mascota.peso);
        jugador.getMascota().setVida(partidaJugador.mascota.vida);
        jugador.getMascota().setFelicidad(partidaJugador.mascota.felicidad);
        jugador.getMascota().setNecesidadBano(partidaJugador.mascota.necesidadBano);
        jugador.getMascota().setDormir(partidaJugador.mascota.dormir);
        jugador.getMascota().setCount(partidaJugador.mascota.count);
        jugador.getMascota().setState(partidaJugador.mascota.state);

        switch (accion) {
            case "jugar":
                this.jugar(jugador);
                localStorage.setItem('partidaJugador', JSON.stringify(jugador));
                this.estadoMascota(jugador.getMascota());
                this.actualizarInterfaz(jugador);              
                break;

            case 'dormir':

                if (jugador.getMascota().isDormir()) {
                    jugador.getMascota().setDormir(false);
                    localStorage.setItem('partidaJugador', JSON.stringify(jugador));
                    this.actualizarInterfaz(jugador);
                } else {
                    guardarMensaje('ya no puede dormir, le haces daño!!!!');
                    this.lastimarMascota(jugador);
                }
            case 'comer':
                if (jugador.getMascota().getCount() < 4) {
                    this.comer(jugador.getMascota());

                    localStorage.setItem('partidaJugador', JSON.stringify(jugador));
                    this.actualizarInterfaz(jugador);
                } else {
                    guardarMensaje('ya no puede comer, quiere ir al baño');
                    jugador.getMascota().setNecesidadBano(true);
                    this.lastimarMascota(jugador);
                }
                break;
            case 'usarBanio':
                if (jugador.getMascota().getNecesidadBano()) {
                    this.accionBano(jugador.getMascota());
                    localStorage.setItem('partidaJugador', JSON.stringify(jugador));
                    this.actualizarInterfaz(jugador);
                } else {
                    guardarMensaje('ya no quiere ir al baño, dejalo salir!!!!');
                    this.lastimarMascota(jugador);
                }
                break;
            case 'guardar':
                this.guardarPartidaCargada(jugador);
                window.alert('Se ha guardado su progreso');
                break;
            case 'salir':
                if (window.confirm('Antes de salir quiere guardar su progreso actual?')) {
                    this.guardarPartidaCargada(jugador);

                    cerrarSesion();
                } else {
                    cerrarSesion();
                }
                break;
            default:
                console.log('Opción no reconocida');
        }
    }
    lastimarMascota(jugador) {
        const vidaActual = jugador.getMascota().getVida();
        if (vidaActual > 0) {
            jugador.getMascota().setVida(vidaActual - 1);
            this.actualizarInterfaz(jugador);
    
            if (jugador.getMascota().getVida() <= 0) {
                jugador.getMascota().setVida(0);
                eliminarPartida(jugador);
            }
        }
    }
    estadoMascota(tamagochi) {
        if ((tamagochi.getFelicidad() <= 10 && tamagochi.getFelicidad() > 8)) {
            tamagochi.setState('😀');
            document.getElementById('textEstado').innerText = 'Estado: ' + tamagochi.getState();
        }
        if ((tamagochi.getFelicidad() <= 8 && tamagochi.getFelicidad() > 5)) {
            tamagochi.setState('😠');
            document.getElementById('textEstado').innerText = 'Estado: ' + tamagochi.getState();
        }
        if ((tamagochi.getFelicidad() <= 5 && tamagochi.getFelicidad() > 2)) {
            tamagochi.setState('😭');
            document.getElementById('textEstado').innerText = 'Estado: ' + tamagochi.getState();
        }
        if ((tamagochi.getFelicidad() <= 2 && tamagochi.getFelicidad() >= 0)) {
            tamagochi.setState('💀');
            document.getElementById('textEstado').innerText = 'Estado: ' + tamagochi.getState();
        }
    }
    comer(tamagochi) {// Aumenta el peso
        tamagochi.setPeso(tamagochi.getPeso() + 0.6);
        tamagochi.setCount(tamagochi.getCount() + 1);
    }

    jugar(jugador) {// Aumenta la felicidad y el nivel
        if (jugador.getMascota().getFelicidad() < 10) {
            jugador.getMascota().setFelicidad(jugador.getMascota().getFelicidad() + 1);
            jugador.getMascota().setNivel(jugador.getMascota().getNivel() + 1);
        } else {
            jugador.getMascota().setVida(jugador.getMascota().getVida() - 1);
            if(jugador.getMascota().getVida()<=0){
                eliminarPartida(jugador);
            }
            guardarMensaje("Tiene la felicidad al máximo");
            mostrarMensajesEnDiv();
        }
    }



    accionBano(tamagochi) {
        const random = Math.random();
        tamagochi.setPeso(tamagochi.getPeso() - (0.5 + (1.5 - 0.5) * random));
        tamagochi.count = 0;
        tamagochi.setNecesidadBano(false);
    }

    fecha() {
        const fecha = new Date();
        const formato = new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });

        return formato.format(fecha);
    }

}

// Función para guardar un mensaje en el localStorage
function guardarMensaje(mensaje) {// Almacena mensajes en localStorage
    // Verificar si la clave existe en localStorage
    if (!localStorage.getItem("mensajes")) {
        // Si la clave no existe, inicializarla con un array vacío
        localStorage.setItem("mensajes", JSON.stringify([]));
    }

    // Recuperar mensajes existentes del localStorage
    const mensajesGuardados = JSON.parse(localStorage.getItem("mensajes"));

    // Agregar el nuevo mensaje al vector
    mensajesGuardados.push(mensaje);

    // Guardar el vector actualizado en el localStorage
    localStorage.setItem("mensajes", JSON.stringify(mensajesGuardados));
}
function eliminarPartida(jugador) {
    try {
        const data = localStorage.getItem('datosDelJugador');
        this.jugadores = data ? JSON.parse(data) : [];
        
        const index = this.jugadores.findIndex(player => player.nombre === jugador.getNombre());
        
        if (index !== -1) {
            this.jugadores.splice(index, 1);
            localStorage.setItem('datosDelJugador', JSON.stringify(this.jugadores));
            window.alert(jugador.getMascota().getNombre() + ' murio y con ello tu partida muahahaha');
            cerrarSesion();
        } else {
            console.error('Jugador no encontrado');
        }
    } catch (error) {
        console.error('Error al eliminar');
    }
}

// Función para recuperar mensajes y mostrarlos en un div
function mostrarMensajesEnDiv() {//Muestra mensajes almacenados
    // Recuperar mensajes del localStorage
    const mensajesGuardados = localStorage.getItem("mensajes");
    const mensajes = mensajesGuardados ? JSON.parse(mensajesGuardados) : [];

    // Mostrar los mensajes en el div
    const mensajesDiv = document.getElementById("mensajes");

    // Limpiar el contenido actual del div
    mensajesDiv.innerHTML = "";

    // Iterar sobre los mensajes en orden inverso y agregarlos al div
    for (let i = mensajes.length - 1; i >= 0; i--) {
        mensajesDiv.innerHTML += mensajes[i];

        // Agregar salto de línea si no es el último mensaje
        if (i > 0) {
            mensajesDiv.innerHTML += "<br>";
        }
    }
}
function showLoading() {
    var loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('active');
}

function hideLoading() {
    var loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.remove('active');
}

function toggleCreatePetForm() {
    var createPetForm = document.getElementById('createPetForm');
    createPetForm.style.display = createPetForm.style.display === 'none' ? 'block' : 'none';
}

function checkExistingUser(newUsername) {
    // Verifica si el nuevo usuario ya existe
    var existingUser = localStorage.getItem(newUsername);

    if (existingUser) {
        alert('El usuario ya existe. Por favor, elige otro nombre de usuario.');
        return true; // Usuario existente
    }

    return false; // Usuario no existe
}
/*en estos metodos se podria traer guardar toda la informacion del jugador*/
function toggleCreatePetForm() {
    var loginForm = document.getElementById('loginForm');
    var createPetForm = document.getElementById('createPetForm');
    document.getElementById('username').value = ' ';
    document.getElementById('password').value = ' ';
    // Alternar la visibilidad de los formularios
    loginForm.style.display = 'none';
    createPetForm.style.display = 'block';
}

function goBackToLogin() {
    localStorage.removeItem('mensajes');
    var loginForm = document.getElementById('loginForm');
    var createPetForm = document.getElementById('createPetForm');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';

    // Alternar la visibilidad de los formularios
    loginForm.style.display = 'block';
    createPetForm.style.display = 'none';
}


//para cambiar las interfaces


// Implementación del patrón Observer
class EventObserver {
    constructor() {
        this.observers = [];

    }

    subscribe(fn) {
        this.observers.push(fn);
    }

    unsubscribe(fn) {
        this.observers = this.observers.filter(subscriber => subscriber !== fn);
    }

    notify(data) {
        this.observers.forEach(observer => observer(data));
    }
}

// Crear una instancia del observador
const interfaceChangeObserver = new EventObserver();

// Funciones para cambiar de interfaz
function goToDormir() {
    guardarMensaje('dormitorio');
    // Notificar a los observadores sobre el cambio de interfaz
    interfaceChangeObserver.notify('SalaDormir');
    mostrarMensajesEnDiv();
}

function goToSalaPrincipal() {
    guardarMensaje('Sala Principal');
    // Notificar a los observadores sobre el cambio de interfaz
    interfaceChangeObserver.notify('MenuPrincipal');
    mostrarMensajesEnDiv();
}

function goToComer() {
    guardarMensaje('comedor');
    // Notificar a los observadores sobre el cambio de interfaz
    interfaceChangeObserver.notify('Cocina');
    mostrarMensajesEnDiv();
}

function goToBanio() {
    guardarMensaje('Cuarto de baño');
    // Notificar a los observadores sobre el cambio de interfaz
    interfaceChangeObserver.notify('Banio');
    mostrarMensajesEnDiv();
}

function goToJugar() {
    guardarMensaje('Patio');
    // Notificar a los observadores sobre el cambio de interfaz
    interfaceChangeObserver.notify('Patio');
    mostrarMensajesEnDiv();
}

function guardarPartida() {
    alert('Partida guardada');
    // Aquí puedes implementar la lógica para guardar la partida
}

function cerrarSesion() {
    localStorage.removeItem('mensajes');
    // Notificar a los observadores sobre el cierre de sesión
    interfaceChangeObserver.notify('CerrarSesion');
    window.location.href = 'mascotaprincipal.html';
}

// Suscribir funciones a eventos de cambio de interfaz
interfaceChangeObserver.subscribe((newInterface) => {
    // Acciones específicas según la interfaz actual
    if (newInterface === 'SalaDormir') {
        window.location.href = 'SalaDormir.html';
    } else if (newInterface === 'MenuPrincipal') {
        window.location.href = 'MenuPrincipal.html';
    } else if (newInterface === 'Cocina') {
        window.location.href = 'Cocina.html';
    } else if (newInterface === 'Banio') {
        window.location.href = 'Banio.html';
    } else if (newInterface === 'Patio') {
        window.location.href = 'Patio.html';
    } else if (newInterface === 'CerrarSesion') {
        window.location.href = 'mascotaprincipal.html';
    }
});
