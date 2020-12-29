/* Verificamos el sistema de locals para saber que tiene el usuario */
if($_valida_usuario() != false)
    $_pasa_seccion('home',true);
else
    $_pasa_seccion('home',true);