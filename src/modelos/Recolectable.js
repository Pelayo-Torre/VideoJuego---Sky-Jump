class Recolectable extends Modelo {

    constructor(x, y) {
        super(imagenes.icono_recolectable, x, y)

        this.aMover = new Animacion(imagenes.recolectable,
            this.ancho, this.alto, 1, 8);

        // Ref a la animación actual
        this.animacion = this.aMover;

    }

    actualizar () {
        // Actualizar animación
        this.animacion.actualizar();
    }

    dibujar (scrollY){
        scrollY = scrollY || 0;
        this.animacion.dibujar(this.x, this.y - scrollY);
    }

}
