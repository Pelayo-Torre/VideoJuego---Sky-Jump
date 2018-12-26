// Lista re recursos a precargar
var imagenes = {
    jugador : "res/jugador.png",
    fondo : "res/fondoBlanco.png",
    disparo_jugador : "res/disparo_jugador.png",
    disparo_enemigo : "res/disparo_enemigo.png",
    icono_puntos : "res/icono_puntos.png",
    icono_vidas : "res/icono_vidas.png",
    icono_recolectable : "res/icono_recolectable.png",
    jugador_idle_derecha : "res/jugador_idle_derecha.png",
    jugador_idle_izquierda : "res/jugador_idle_izquierda.png",
    jugador_corriendo_derecha : "res/jugador_corriendo_derecha.png",
    jugador_corriendo_izquierda : "res/jugador_corriendo_izquierda.png",
    jugador_disparando_derecha : "res/jugador_disparando_derecha.png",
    jugador_disparando_izquierda : "res/jugador_disparando_izquierda.png",
    jugador_saltando_derecha : "res/jugador_saltando_derecha.png",
    jugador_saltando_izquierda : "res/jugador_saltando_izquierda.png",
    copa : "res/copa.png",
    pad :"res/pad.png",
    boton_disparo : "res/boton_disparo.png",
    boton_salto : "res/boton_salto.png",
    boton_pausa : "res/boton_pausa.png",
    menu_fondo : "res/fondoInicio.jpeg",
    boton_jugar : "res/boton_jugar.png",
    mensaje_como_jugar : "res/mensaje_como_jugar.jpeg",
    mensaje_ganar : "res/mensaje_ganar.png",
    mensaje_perder : "res/mensaje_perder.png",
    animacion_mina : "res/animacion_mina_explota.png",
    mina : "res/mina.png",
    arquero : "res/arquero.png",
    arquero_ataque_abajo : "res/animacion_arquero_ataque_abajo.png",
    arquero_ataque_arriba : "res/animacion_arquero_ataque_arriba.png",
    arquero_ataque_derecha : "res/animacion_arquero_ataque_derecha.png",
    arquero_ataque_izquierda : "res/animacion_arquero_ataque_izquierda.png",
    arquero_derecha : "res/animacion_arquero_derecha.png",
    arquero_izquierda : "res/animacion_arquero_izquierda.png",
    arquero_muerte : "res/animacion_arquero_muerte.png",
    animacion_arquero_quieto : "res/animacion_arquero_quieto.png",
    paraguas : "res/paraguas.png",
    jugador_paraguas_izquierda : "res/jugador_paraguas_izquierda.png",
    jugador_paraguas_derecha : "res/jugador_paraguas_derecha.png",
    recolectable : "res/recolectable.png",
    plataforma_roja : "res/plataforma_roja.png",
    plataforma_gris : "res/plataforma_gris.png",
    plataforma_blanca_negra : "res/plataforma_blanca_negra.png",
    limon : "res/limon.png"

};

var rutasImagenes = Object.values(imagenes);
cargarImagenes(0);

function cargarImagenes(indice){
    var imagenCargar = new Image();
    imagenCargar.src = rutasImagenes[indice];
    imagenCargar.onload = function(){
        if ( indice < rutasImagenes.length-1 ){
            indice++;
            cargarImagenes(indice);
        } else {
            iniciarJuego();
        }
    }
}
