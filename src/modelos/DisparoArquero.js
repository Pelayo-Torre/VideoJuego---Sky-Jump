class DisparoArquero extends Modelo{

    constructor(x, y) {
        super(imagenes.disparo_enemigo, x, y)
        this.vx = 9;
    }

    setVelocidad(v){
        this.vx = v;
    }

    actualizar (){

    }

}