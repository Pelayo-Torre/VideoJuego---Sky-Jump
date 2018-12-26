class Arquero extends Modelo{

    constructor(x, y) {
        super(imagenes.arquero, x, y);
        this.estado = estados.moviendo;
        this.orientacion = orientaciones.derecha;
        this.vxInteligencia = -2;
        this.vx = this.vxInteligencia;

        this.aMoverIzquierda = new Animacion(imagenes.arquero_izquierda,
            this.ancho, this.alto, 6, 2);

        this.aMoverDerecha = new Animacion(imagenes.arquero_derecha,
            this.ancho, this.alto, 6, 2);

        this.aMorir = new Animacion(imagenes.arquero_muerte,
            this.ancho, this.alto, 6, 6, this.finAnimacionMorir.bind(this));

        this.aAtaqueAbajo = new Animacion(imagenes.arquero_ataque_abajo,
            this.ancho, this.alto, 6, 6);

        this.aAtaqueArriba = new Animacion(imagenes.arquero_ataque_arriba,
            this.ancho, this.alto, 6, 6);

        this.aAtaqueDerecha = new Animacion(imagenes.arquero_ataque_derecha,
            this.ancho, this.alto, 6, 6, this.finAnimacionDisparar.bind(this));

        this.aAtaqueIzquierda = new Animacion(imagenes.arquero_ataque_izquierda,
            this.ancho, this.alto, 6, 6, this.finAnimacionDisparar.bind(this));

        this.animacion = this.aMoverDerecha;

        this.vy = 0;
        this.vx = 1;
    }

    actualizar(){
        this.animacion.actualizar();

        // Establecer orientación
        if ( this.vx > 0 ){
            this.orientacion = orientaciones.derecha;
        }
        if ( this.vx < 0 ){
            this.orientacion = orientaciones.izquierda;
        }


        switch (this.estado){
            case estados.moviendo:
                if ( this.vx != 0 ) {
                    if (this.orientacion == orientaciones.derecha) {
                        this.animacion = this.aMoverDerecha;
                    }
                    if (this.orientacion == orientaciones.izquierda) {
                        this.animacion = this.aMoverIzquierda;
                    }
                }
                break;
            case estados.muriendo:
                this.animacion = this.aMorir;
                break;
            case estados.disparando:
                if ( this.vx != 0 ) {
                    if (this.orientacion == orientaciones.derecha) {
                        this.animacion = this.aAtaqueDerecha;
                    }
                    if (this.orientacion == orientaciones.izquierda) {
                        this.animacion = this.aAtaqueIzquierda;
                    }
                }
                break;
        }

        if ( this.estado == estados.muriendo) {
            this.vx = 0;
        } else {

            if ( this.vx == 0){
                this.vxInteligencia = this.vxInteligencia * -1;
                this.vx = this.vxInteligencia;
            }

            if (this.fueraPorDerecha ){
                // mover hacia la izquierda vx negativa
                if ( this.vxInteligencia > 0){
                    this.vxInteligencia = this.vxInteligencia * -1;
                }
                this.vx = this.vxInteligencia;
            }
            if (this.fueraPorIzquierda ){
                // mover hacia la derecha vx positiva
                if ( this.vxInteligencia < 0){
                    this.vxInteligencia = this.vxInteligencia * -1;
                }
                this.vx = this.vxInteligencia;
            }

        }
    }

    finAnimacionMorir(){
        this.estado = estados.muerto;
    }

    finAnimacionDisparar(){
        this.estado = estados.moviendo;
    }

    impactado(){
        if ( this.estado != estados.muriendo ){
            this.estado = estados.muriendo;
        }
    }

    disparar(){
        if ( this.estado != estados.muriendo ){
            this.estado = estados.disparando;
            var disparo =  new DisparoArquero(this.x, this.y);
            if(this.orientacion == orientaciones.derecha){
                disparo.setVelocidad(9)
            }
            else{
                disparo.setVelocidad(-9)
            }
            return disparo;
        }
        return null;
    }

    dibujar (scrollY){
        scrollY = scrollY || 0;
        this.animacion.dibujar(this.x, this.y - scrollY);
    }


}