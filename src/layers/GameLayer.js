class GameLayer extends Layer {

    constructor() {
        super();
        this.mensaje = new Boton(imagenes.mensaje_como_jugar, 480/2, 320/2);
        this.pausa = true;
        this.iniciar();
    }

    iniciar() {
        this.scrollY = 0;
        reproducirMusica();

        this.botonDisparo = new Boton(imagenes.boton_disparo,480*0.75,320*0.83);
        this.pad = new Pad(480*0.14,320*0.8);

        this.espacio = new Espacio(1);
        this.bloques = [];
        this.minas = [];
        this.enemigos = [];
        this.paraguas = [];
        this.plataformasMoviles = [];
        this.plataformasDesaparecen = [];
        this.limite = 10000000;

        this.fondo = new Fondo(imagenes.fondo,480*0.5,320*0.5);
        this.fondoDisparos =
            new Fondo(imagenes.disparo_jugador, 480*0.85,320*0.05);
        this.numeroDisparos = new Texto(5,480*0.9,320*0.07 );

        this.fondoVidas =
            new Fondo(imagenes.icono_vidas, 400*0.85, 320*0.05);
        this.vidas = new Texto(3,400*0.92, 320*0.07);


        this.disparosJugador = [];
        this.disparosEnemigo = [];
        this.recolectables = [];

        this.cargarMapa("res/"+nivelActual+".txt");
    }

    actualizar (){

        if (this.pausa){
            return;
        }

        if ( this.limon.colisiona(this.jugador)){
            nivelActual++;
            if (nivelActual > nivelMaximo){
                nivelActual = 0;
            }
            this.pausa = true;
            this.mensaje =
                new Boton(imagenes.mensaje_ganar, 480/2, 320/2);

            this.iniciar();
        }


        this.espacio.actualizar();
        this.fondo.vx = -1;
        this.fondo.actualizar();
        this.jugador.actualizar();

        //El jugador estará saltando continuamente.
        this.jugador.saltar();

        // Eliminar disparos sin velocidad
        for (var i=0; i < this.disparosJugador.length; i++){
            if ( this.disparosJugador[i] != null &&
                this.disparosJugador[i].vx == 0){

                this.espacio
                    .eliminarCuerpoDinamico(this.disparosJugador[i]);
                this.disparosJugador.splice(i, 1);
            }
        }

        //Disparos del enemigo:
        if (this.iteracionesDisparoEnemigo == null)
            this.iteracionesDisparoEnemigo = 0;
        this.iteracionesDisparoEnemigo ++;

        if ( this.iteracionesDisparoEnemigo > 100){

            for (var i=0; i < this.enemigos.length; i++){

                    var disparoEnemigo = this.enemigos[i].disparar();
                    if(disparoEnemigo != null){
                        this.espacio.agregarCuerpoDinamico(disparoEnemigo);
                        this.disparosEnemigo.push(disparoEnemigo);
                    }
            }
            this.iteracionesDisparoEnemigo = 0;
        }


        for(var i=0; i<this.disparosEnemigo.length; i++){
            this.disparosEnemigo[i].actualizar();
        }


        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].actualizar();
        }

        for (var i=0; i < this.minas.length; i++) {
            this.minas[i].actualizar();
        }

        for (var i=0; i < this.paraguas.length; i++) {
            this.paraguas[i].actualizar();
        }

        for (var i=0; i < this.enemigos.length; i++) {
            this.enemigos[i].actualizar();
        }

        for (var i=0; i < this.recolectables.length; i++) {
            this.recolectables[i].actualizar();
        }

        for(var i=0; i<this.plataformasMoviles.length; i++){
            this.plataformasMoviles[i].actualizar();
        }

        for(var i=0; i<this.plataformasDesaparecen.length; i++){
            this.plataformasDesaparecen[i].actualizar();
        }

        //COLISIONES JUGADOR-MINA
        for (var i=0; i < this.minas.length; i++) {
            if ( this.jugador.colisiona(this.minas[i])){
                this.minas[i].impactado();
                this.jugador.vy = -26;
            }
        }

        //Colisiones jugador - paraguas.
        for (var i=0; i < this.paraguas.length; i++) {
            if ( this.jugador.colisiona(this.paraguas[i])){
                this.jugador.impactadoParaguas();
                this.espacio.eliminarCuerpoDinamico(this.paraguas[i])
                this.paraguas.splice(i,1);
            }
        }

        // colisiones disparoEnemigo-jugador
        for(var i=0; i < this.disparosEnemigo.length ; i++){
            if( this.disparosEnemigo[i] != null &&
                this.jugador.colisiona(this.disparosEnemigo[i])){
                this.disparosEnemigo.splice(i, 1);
                this.jugador.golpeado();
                this.vidas.valor = this.jugador.vidas;
                if (this.jugador.vidas <= 0){
                    this.pausa = true;
                    this.mensaje =
                        new Boton(imagenes.mensaje_perder, 480/2, 320/2);
                    this.iniciar();
                }
            }
        }

        //Si el jugador tiene paraguas, le damos una serie de iteraciones de juego de duración.
        if(this.jugador.paraguas == true){

            if (this.iteracionesParaguas == null)
                this.iteracionesParaguas = 0;
            this.iteracionesParaguas ++;

            if ( this.iteracionesParaguas > 500){
                this.jugador.acabarTiempoParaguas();
                this.iteracionesParaguas = 0;
            }
        }

        // Minas destruídas fuera del juego
        for (var j=0; j < this.minas.length; j++){
            if ( this.minas[j] != null &&
                this.minas[j].estado == estados.muerto  ) {
                this.espacio.eliminarCuerpoDinamico(this.minas[j])
                this.minas.splice(j, 1);
            }
        }

        //Colisiones disparo de jugador con enemigo.
        for (var i=0; i < this.disparosJugador.length; i++){
            for (var j=0; j < this.enemigos.length; j++){

                if (this.disparosJugador[i] != null &&
                    this.enemigos[j] != null &&
                    this.disparosJugador[i].colisiona(this.enemigos[j])) {

                    this.espacio
                        .eliminarCuerpoDinamico(this.disparosJugador[i]);
                    this.disparosJugador.splice(i, 1);
                    this.enemigos[j].impactado();
                    this.numeroDisparos.valor += 1;

                }
            }
        }

        //colisiones recolectable
        for (var i=0; i < this.recolectables.length; i++){
            if ( this.jugador.colisiona(this.recolectables[i])){
                this.numeroDisparos.valor+=5;
                this.recolectables.splice(i, 1)
            }
        }

        //Colisiones disparoEnemigo-bloques
        for (var i=0; i < this.disparosEnemigo.length; i++){
            for (var j=0; j < this.bloques.length; j++){

                if (this.disparosEnemigo[i] != null &&
                    this.bloques[j] != null &&
                    this.disparosEnemigo[i].colisiona(this.bloques[j])) {

                    this.espacio
                        .eliminarCuerpoDinamico(this.disparosEnemigo[i]);
                    this.disparosEnemigo.splice(i, 1);
                }
            }
        }

        //Colisiones disparoJugador-bloques movibles
        for (var i=0; i < this.disparosJugador.length; i++){
            for (var j=0; j < this.plataformasMoviles.length; j++){

                if (this.disparosJugador[i] != null &&
                    this.plataformasMoviles[j] != null &&
                    this.disparosJugador[i].colisiona(this.plataformasMoviles[j])) {

                    this.espacio
                        .eliminarCuerpoDinamico(this.disparosJugador[i]);
                    this.disparosJugador.splice(i, 1);
                }
            }
        }

        //Colisiones disparoEnemigo-bloques que desaparecen
        for (var i=0; i < this.disparosJugador.length; i++){
            for (var j=0; j < this.plataformasDesaparecen.length; j++){

                if (this.disparosJugador[i] != null &&
                    this.plataformasDesaparecen[j] != null &&
                    this.disparosJugador[i].colisiona(this.plataformasDesaparecen[j])) {

                    this.espacio
                        .eliminarCuerpoDinamico(this.disparosJugador[i]);
                    this.disparosJugador.splice(i, 1);
                }
            }
        }

        // colisiones
        for (var i=0; i < this.enemigos.length; i++){
            if ( this.jugador.colisiona(this.enemigos[i])){
                this.jugador.golpeado();
                this.vidas.valor = this.jugador.vidas;
                if (this.jugador.vidas <= 0){
                    this.pausa = true;
                    this.mensaje =
                        new Boton(imagenes.mensaje_perder, 480/2, 320/2);
                    this.iniciar();
                }

            }
        }

        //Colisiones jugador - bloque desaparece
        for(i = 0; i<this.plataformasDesaparecen.length ; i++){
            if(this.jugador.colisiona(this.plataformasDesaparecen[i])){
                    this.espacio.eliminarCuerpoDinamico(this.plataformasDesaparecen[i])
                    this.espacio.eliminarCuerpoEstatico(this.plataformasDesaparecen[i])
                    this.plataformasDesaparecen.splice(i,1);
                }

            }


        // Enemigos muertos fuera del juego
        for (var j=0; j < this.enemigos.length; j++){
            if ( this.enemigos[j] != null &&
                this.enemigos[j].estado == estados.muerto  ) {

                this.espacio
                    .eliminarCuerpoDinamico(this.enemigos[j]);
                this.enemigos.splice(j, 1);

            }
        }

    }

    dibujar (){
        this.calcularScroll();
        this.fondo.dibujar();
        for (var i=0; i < this.bloques.length; i++){
            this.bloques[i].dibujar(this.scrollY);
        }

        for (var i=0; i < this.disparosJugador.length; i++) {
            this.disparosJugador[i].dibujar(this.scrollY);
        }

        this.limon.dibujar(this.scrollY);

        for (var i=0; i < this.minas.length; i++) {
            this.minas[i].dibujar(this.scrollY);
        }

        for (var i=0; i < this.paraguas.length; i++) {
            this.paraguas[i].dibujar(this.scrollY);
        }

        for (var i=0; i < this.recolectables.length; i++) {
            this.recolectables[i].dibujar(this.scrollY);
        }

        for (var i=0; i < this.disparosEnemigo.length; i++) {
            this.disparosEnemigo[i].dibujar(this.scrollY);
        }

        for (var i=0; i < this.enemigos.length; i++) {
            this.enemigos[i].dibujar(this.scrollY);
        }

        for(var i=0; i<this.plataformasMoviles.length; i++){
            this.plataformasMoviles[i].dibujar(this.scrollY)
        }

        for(var i=0; i<this.plataformasDesaparecen.length; i++){
            this.plataformasDesaparecen[i].dibujar(this.scrollY)
        }

        this.jugador.dibujar(this.scrollY);
        this.fondoDisparos.dibujar();
        this.numeroDisparos.dibujar();
        this.fondoVidas.dibujar();
        this.vidas.dibujar();
        if ( !this.pausa && entrada == entradas.pulsaciones) {
            this.botonDisparo.dibujar();
            this.pad.dibujar();
        }


        if ( this.pausa ) {
            this.mensaje.dibujar();
        }
    }

    calcularScroll(){


        if ( this.jugador.y - this.scrollY < 320*0.3){
            this.scrollY = this.jugador.y - 320*0.3;
            this.limite = this.scrollY + 60;
        }

        if(this.scrollY  > this.limite) {
            this.pausa = true;
            this.mensaje =
                new Boton(imagenes.mensaje_perder, 480/2, 320/2);
            this.iniciar();
        }
        else{

            if ( this.jugador.y - this.scrollY > 320*0.7){
                this.scrollY = this.jugador.y - 320*0.7;
            }
        }

    }


    procesarControles( ){
        if (controles.continuar){
            controles.continuar = false;
            this.pausa = false;
        }

        // disparar
        if (  controles.disparo ){
            if(this.numeroDisparos.valor != 0){
                var nuevoDisparo = this.jugador.disparar();
                if ( nuevoDisparo != null ) {
                    this.espacio.agregarCuerpoDinamico(nuevoDisparo);
                    this.disparosJugador.push(nuevoDisparo);
                    this.numeroDisparos.valor -= 1;
                }
            }

        }

        // Eje X
        if ( controles.moverX > 0 ){
            this.jugador.moverX(1);

        }else if ( controles.moverX < 0){
            this.jugador.moverX(-1);

        } else {
            this.jugador.moverX(0);
        }

        // Eje Y
        if ( controles.moverY > 0 ){
            this.jugador.saltar();

        } else if ( controles.moverY < 0 ){


        } else {

        }

    }

    cargarMapa(ruta){
        var fichero = new XMLHttpRequest();
        fichero.open("GET", ruta, false);

        fichero.onreadystatechange = function () {
            var texto = fichero.responseText;
            var lineas = texto.split('\n');
            for (var i = 0; i < lineas.length; i++){
                var linea = lineas[i];
                for (var j = 0; j < linea.length; j++){
                    var simbolo = linea[j];
                    var x = 40/2 + j * 40; // x central
                    var y = 32 + i * 32; // y de abajo
                    this.cargarObjetoMapa(simbolo,x,y);
                }
            }
        }.bind(this);

        fichero.send(null);
    }

    cargarObjetoMapa(simbolo, x, y){
        switch(simbolo) {
            case "1":
                this.jugador = new Jugador(x, y);
                // modificación para empezar a contar desde el suelo
                this.jugador.y = this.jugador.y - this.jugador.alto/2;
                this.espacio.agregarCuerpoDinamico(this.jugador);
                break;
            case "#":
                var bloque = new Bloque(imagenes.plataforma_roja, x,y);
                bloque.y = bloque.y - bloque.alto/2;
                // modificación para empezar a contar desde el suelo
                this.bloques.push(bloque);
                this.espacio.agregarCuerpoEstatico(bloque);
                break;
            case "M":
                var mina = new Mina(x,y);
                mina.y = mina.y - mina.alto/2;
                // modificación para empezar a contar desde el suelo
                this.minas.push(mina);
                this.espacio.agregarCuerpoDinamico(mina);
                break;
            case "P":
                var paraguas = new Paraguas(x,y);
                paraguas.y = paraguas.y - paraguas.alto/2;
                // modificación para empezar a contar desde el suelo
                this.paraguas.push(paraguas);
                this.espacio.agregarCuerpoDinamico(paraguas);
                break;
            case "C":
                this.limon = new Bloque(imagenes.limon, x,y);
                this.limon.y = this.limon.y - this.limon.alto/2;
                // modificación para empezar a contar desde el suelo
                this.espacio.agregarCuerpoDinamico(this.limon);
                break;
            case "E":
                var enemigo = new Arquero(x,y);
                enemigo.y = enemigo.y - enemigo.alto/2;
                // modificación para empezar a contar desde el suelo
                this.enemigos.push(enemigo);
                this.espacio.agregarCuerpoDinamico(enemigo);
                break;
            case "X":
                var plataformaMovil = new PlataformaMovil(x,y);
                plataformaMovil.y = plataformaMovil.y - plataformaMovil.alto/2;
                // modificación para empezar a contar desde el suelo
                this.plataformasMoviles.push(plataformaMovil);
                this.espacio.agregarCuerpoDinamico(plataformaMovil);
                this.espacio.agregarCuerpoEstatico(plataformaMovil);
                break;
            case "I":
                var plataformaDesaparece = new BloqueDesaparece(x,y);
                plataformaDesaparece.y = plataformaDesaparece.y - plataformaDesaparece.alto/2;
                // modificación para empezar a contar desde el suelo
                this.plataformasDesaparecen.push(plataformaDesaparece);
                this.espacio.agregarCuerpoDinamico(plataformaDesaparece);
                this.espacio.agregarCuerpoEstatico(plataformaDesaparece);
                break;
            case "R":
                var recolectable = new Recolectable(x,y);
                recolectable.y = recolectable.y - recolectable.alto/2;
                this.recolectables.push(recolectable);
                this.espacio.agregarCuerpoDinamico(recolectable);
                break;
        }
    }


    calcularPulsaciones(pulsaciones){
        // Suponemos botones no estan pulsados
        this.botonDisparo.pulsado = false;
        // suponemos que el pad está sin tocar
        controles.moverX = 0;
        // Suponemos a false
        controles.continuar = false;

        for(var i=0; i < pulsaciones.length; i++){
            // MUY SIMPLE SIN BOTON cualquier click en pantalla lo activa
            if(pulsaciones[i].tipo == tipoPulsacion.inicio){
                controles.continuar = true;
            }

            if (this.pad.contienePunto(pulsaciones[i].x , pulsaciones[i].y) ){
                var orientacionX = this.pad.obtenerOrientacionX(pulsaciones[i].x);
                if ( orientacionX > 20) { // de 0 a 20 no contabilizamos
                    controles.moverX = orientacionX;
                }
                if ( orientacionX < -20) { // de -20 a 0 no contabilizamos
                    controles.moverX = orientacionX;
                }
            }


            if (this.botonDisparo.contienePunto(pulsaciones[i].x , pulsaciones[i].y) ){
                this.botonDisparo.pulsado = true;
                if ( pulsaciones[i].tipo == tipoPulsacion.inicio) {
                    controles.disparo = true;
                }
            }


        }

        // No pulsado - Boton Disparo
        if ( !this.botonDisparo.pulsado ){
            controles.disparo = false;
        }

    }



}
