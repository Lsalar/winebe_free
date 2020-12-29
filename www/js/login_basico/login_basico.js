$r.dom();

/* Formulario */
_e.d.login_basico.addEventListener('submit', function(a){
  console.log('asdasd')
  a.preventDefault();

  var _error = false;

  if(_e.d.login_basico_nombre_apellido.value.trim().length < 3)
    _error = 'Ingrese un nombre válido';
  // else if(_e.d.login_basico_edad.value.trim().indexOf('-') == -1)
  //   _error = 'Ingrese una edad valida';
  else if( (parseFloat($r.date('Y')) - parseFloat(_e.d.login_basico_edad.value.trim().split('-')[0])) < 18 )
    _error = 'Debe ser mayor a 18 para continuar';
  else if( $r.validacion.numero(parseFloat(_e.d.login_basico_dni.value.trim())) != true )
    _error = 'Ingrese un DNI válido';

  if(_error == false)
  {
    $r.cls('__wnbusr', btoa(JSON.stringify({"id":$r.date('Ymdhisu'), "nombre":_e.d.login_basico_nombre_apellido.value.trim(), "edad": _e.d.login_basico_edad.value.trim(), "email": _e.d.login_basico_email.value.trim() ,"dni": parseFloat(_e.d.login_basico_dni.value.trim())})));

    var _obd =  {
              "url": $r.conf_ajax.absoluta+$r.conf_ajax.url.proceso, 
              "metodo": $r.conf_ajax.metodo.post, 
              "datos": "h=_registra_usuario&"+$r.serialize(this), 
              "recibe": function(v,b)
              {
                if(typeof gtag != 'undefined')
                  gtag('event', 'Prelogin', {"nombre":_e.d.login_basico_nombre_apellido.value.trim(), "edad": _e.d.login_basico_edad.value.trim(), "email": _e.d.login_basico_email.value.trim() ,"dni": parseFloat(_e.d.login_basico_dni.value.trim())});

                var _error = 'Ocurrió un error con los datos, verifique e intente nuevamente';
                if($_valida_usuario() != true)
                {
                  $r.select('a[data-panel-menu][href="#2"]')[0].click();
                  _e.d.modal_interna_registrate.classList.remove('active');

                  $_acomoda_datos_usuario_en_forms();
                }
                else
                  alert('<div class="toast toast-error"> <p>'+_error+'</p></div>', 4000);


              }
          };
    $r.ajax2(_obd);

  }
  else
    alert('<div class="toast toast-error"> <p>'+_error+'</p></div>', 4000);

  return false;
}, false);