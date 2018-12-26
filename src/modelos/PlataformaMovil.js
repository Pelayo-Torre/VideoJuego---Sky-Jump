class PlataformaMovil extends Modelo{

    constructor(x, y){
        super(imagenes.plataforma_gris, x, y);
        this.vxInteligencia = 2;
        this.vx = this.vxInteligencia;
    }

    actualizar(){
        if(this.vx == 0){
            this.vxInteligencia = this.vxInteligencia * (-1);
            this.vx = this.vxInteligencia;
        }

    }

}