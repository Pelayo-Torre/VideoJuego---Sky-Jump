class Paraguas extends Modelo{

    constructor(x, y) {
        super(imagenes.paraguas, x, y);

        this.quieto = new Animacion(imagenes.paraguas,
            this.ancho, this.alto, 6, 1);

        this.animacion = this.quieto;

    }

    actualizar(){
        this.animacion.actualizar();
    }

    dibujar(scrollY){
        scrollY = scrollY || 0;
        this.animacion.dibujar(this.x, this.y - scrollY);

    }

}