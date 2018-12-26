class Mina extends Modelo {

    constructor(x, y) {
        super(imagenes.mina, x, y);
        this.estado = estados.quieto;

        this.quieto = new Animacion(imagenes.mina,
            this.ancho, this.alto, 6, 1);

        this.aMorir = new Animacion(imagenes.animacion_mina,
            this.ancho, this.alto, 1, 8, this.finAnimacionMorir.bind(this));
        // Ref a la animación actual

        this.animacion = this.quieto;

    }

    finAnimacionMorir(){
        this.estado = estados.muerto;
    }

    actualizar(){
        this.animacion.actualizar();

        switch (this.estado){
            case estados.quieto:
                this.animacion = this.quieto;
                break;
            case estados.muriendo:
                this.animacion = this.aMorir;
                break;
        }

    }

    impactado(){
        if ( this.estado != estados.muriendo ){
            this.estado = estados.muriendo;
            this.animacion = this.aMorir;
        }
    }

    dibujar (scrollY){
        scrollY = scrollY || 0;
        this.animacion.dibujar(this.x, this.y - scrollY);
    }


}