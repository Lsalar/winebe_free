$r.dom();

if($__verificamos_carrito_local() == true)
  _variables.carrito = JSON.parse($r.tls('ZWNvbW1lcmNld2luZWJl'));
else
  $_pasa_seccion('home',true);

$__muestra_cantidades_totales = function()
{
  var _totalContado = 0;
  for (var ii = 0; ii < _variables.carrito.length; ii++) 
    _totalContado = _totalContado + _variables.carrito[ii].total;
  _e.d._total_contado.innerHTML = '$'+ $r.precio((_totalContado),2,',','.');
  _variables.carritoTotalHoy = _totalContado;
};

$__renderiza_carrito_ecommerce = function()
{
  /*
    Listamos los vinos que encontramos. 
  */
  var _bodUnicas = new Array();
  if(typeof _variables.carrito != 'undefined')
  {
    for (var ii = 0; ii < _variables.carrito.length; ii++) 
    {
        if(_bodUnicas.indexOf(_variables.carrito[ii].empresa) == -1)
          _bodUnicas.push(_variables.carrito[ii].empresa);
    };
      
  }
  var _obd =  {
                "url": $r.conf_ajax.absoluta+$r.conf_ajax.url.proceso, 
                "metodo": $r.conf_ajax.metodo.post, 
                "datos": "h=__trae_bodegas_especificas&bod="+_bodUnicas.join(','), 
                "recibe": function(v,b)
                {
                  if(v.aviso == true)
                  {
                    var dnde = 'lista_de_productos_end';
                    var _totalContado = 0;
                    _e.d[dnde].innerHTML = '';
                    
                    // Separar carrito por empresa para pagar.
                    var _arrEmp = new Array();
                    for (var hh = 0; hh < v.resultado.datos.length; hh++) 
                    {
                      var _div = $r.create('div');
                          _div.innerHTML  = ' <div class="tile">\
                                                <div class="tile-content">\
                                                  <div class="tile-title text-bold">\
                                                    <figure class="avatar" data-initial="'+ (v.resultado.datos[hh].nombre).slice(-2) +'"></figure> '+ v.resultado.datos[hh].nombre +'\
                                                  </div><br>\
                                                  <div id="emp_'+ v.resultado.datos[hh].id +'"></div>\
                                                  <div class="tile-footer"> <span class="btn btn-primary width-100" data-idemp="'+v.resultado.datos[hh].id+'" data-accion="pagar" >Pagar '+v.resultado.datos[hh].tipo_empresa+'</span> </div>\
                                                </div>\
                                              </div>';
                      _e.d[dnde].appendChild(_div);

                      _arrEmp['emp_'+v.resultado.datos[hh].id] = v.resultado.datos[hh].nombre;
                    }

                    var _botones = $r.select('span[data-accion="pagar"]');
                        for (var i = 0; i < _botones.length; i++) 
                        {
                          _botones[i].addEventListener('click',function(){
                            
                            _variables.idBodPaga = this.getAttribute('data-idemp');
                            var _obd =  {
                                            "url": $r.conf_ajax.absoluta+$r.conf_ajax.url.proceso, 
                                            "metodo": $r.conf_ajax.metodo.post, 
                                            "datos": "h=__trae_metodo_de_pago&id="+ btoa(this.getAttribute('data-idemp')), 
                                            "recibe": function(v,b)
                                            {
                                              _funciones_ajax_carrito(v,b);
                                            }
                                        };
                            $r.ajax2(_obd);

                            if($_valida_usuario() == false)
                              _e.d.modal_interna_registrate.classList.add('active');
                            else
                            {
                              $_acomoda_datos_usuario_en_forms();
                              $r.select('a[data-panel-menu][href="#2"]')[0].click();
                            }

                          },false);
                        }

                    $r.dom();
                    for (var ii = 0; ii < _variables.carrito.length; ii++) 
                    {
                      dnde = 'emp_'+_variables.carrito[ii].empresa;
                      var _swiperPasos = $r.create('div');
                          _swiperPasos.setAttribute('data-swiper-pasos','');

                      var _card     = $r.create('div');

                      var _chip     = 'oferta' 
                      var __precio  = _variables.carrito[ii].precio;
                      var _chipC    = '';
                        
                        var __texto_promo_visible = 'd-none';
                          if(_variables.carrito[ii].stock <= 0)
                          {
                            _chip = 'sin stock';
                            _card.classList.add('sin-stock');
                          }
                          else if(parseFloat(_variables.carrito[ii].es_oferta) == 1)
                          {
                              _chip = 'oferta';
                              _card.classList.add('off-promo');
                              __precio = parseFloat(_variables.carrito[ii].precio) - ((parseFloat(_variables.carrito[ii].precio) * parseFloat(_variables.carrito[ii].porcentaje_descuento)) / 100);
                              __texto_promo_visible = 'd-block';
                          }

                          if(parseFloat(_variables.carrito[ii].es_combo) == 1)
                          {
                            _chipC = 'x bulto';
                            _card.classList.add('combo');
                            __texto_promo_visible = 'd-block';
                          }

                          _card.classList.add('tile','tile-centered');
                          _card.innerHTML = ' <div class="tile-icon">\
                                              <span class="chip comuni-general">'+_chip+'</span>\
                                              <span class="chip xbulto">'+_chipC+'</span>\
                                                      <figure class="figure"><img loading="lazy" class="img-responsive img-fit-cover" src="'+ _variables.carrito[ii].foto +'" alt="'+ _variables.carrito[ii].nombre +'">\</figure>\
                                                  </div>\
                                                  <div class="tile-content">\
                                                      <p class="tile-title text-ellipsis">'+ _variables.carrito[ii].nombre +'</p>\
                                                      <p class="tile-subtitle text-gray text-ellipsis">'+ _variables.carrito[ii].productor +'</p>\
                                                      <div class="width-100 card-title text-left h5">$ '+ $r.precio((__precio*_variables.carrito[ii].cantidad),2,',','.') +'</div>\
                                                      <i class="width-100 text-left h9 text-gray d-block">$ '+ $r.precio(__precio,2,',','.') +' (x'+_variables.carrito[ii].cantidad+')</i>\
                                              </div>';
                        
                        _card._datos    = _variables.carrito[ii];
                        _card.addEventListener('click',function(){ _variables.vinoseleccionado = this._datos; },false);
                        _card.addEventListener('click',$__carga_info_interna_vino_simple,false);

                      var _card_footer = $r.create('div');
                          _card_footer.classList.add('tile-action');

                          var _boton_carrito = $r.create('button');
                              _boton_carrito.classList.add('btn','btn-primary');

                              if(_variables.carrito[ii].stock <= 0)
                                _boton_carrito.innerHTML  = '<i class="lar la-sad-cry"></i> Sin stock';
                              else
                                _boton_carrito.innerHTML  = '<i class="las la-plus"></i>';

                              _boton_carrito._datos     = _variables.carrito[ii];
                              _boton_carrito.addEventListener('click',$__agrega_producto_a_ecommerce,false);
                              _boton_carrito.addEventListener('click',$__renderiza_carrito_ecommerce,false);

                          var _boton_compartir = $r.create('button');
                              _boton_compartir.classList.add('btn','btn-link');
                              _boton_compartir.innerHTML = '<i class="las la-share"></i> share';

                          var _boton_ficha = $r.create('button');
                              _boton_ficha.classList.add('btn','btn-link');
                              _boton_ficha.innerHTML = '<i class="lar la-comment"></i>';
                              _boton_ficha._datos    = _variables.carrito[ii];
                              _boton_ficha.addEventListener('click',function(){ _variables.vinoseleccionado = this._datos; },false);
                              _boton_ficha.addEventListener('click',$__carga_info_interna_vino_simple,false);

                      _swiperPasos.appendChild(_card);
                        _card.appendChild(_card_footer);
                          _card_footer.appendChild(_boton_carrito);
                          // _card_footer.appendChild(_boton_compartir);
                          _card_footer.appendChild(_boton_ficha);

                      // renderizamos los elementos
                      _e.d[dnde].appendChild(_swiperPasos);
                      _swiperPasos = null;
                      _card = null;

                      _totalContado = _totalContado + _variables.carrito[ii].total;
                    }
                    _e.d._total_contado.innerHTML = '$'+ $r.precio((_totalContado),2,',','.');
                    _variables.carritoTotalHoy = _totalContado;

                    // Fin del recibe bodegas
                  }
                }
            };
  $r.ajax2(_obd);
};

$__renderiza_carrito_ecommerce();

// ponemos eventos al carrito
$__carga_evento_carrito();

var _obd =  {
                "url": $r.conf_ajax.absoluta+$r.conf_ajax.url.proceso, 
                "metodo": $r.conf_ajax.metodo.post, 
                "datos": "h=__trae_metodo_de_pago&id="+ btoa(1), 
                "recibe": function(v,b)
                {
                  _funciones_ajax_carrito(v,b);
                }
            };
$r.ajax2(_obd);

/*
  Programacion para los modals
*/
var _modal = $r.select('.cerrar-modal');
for (var i = 0; i < _modal.length; i++) 
{
  _modal[i].addEventListener('click',function()
  {
    var _modal = $r.select('.modal');
    for (var ii = 0; ii < _modal.length; ii++) 
      _modal[ii].classList.remove('active');
    _modal = null;
  },false);
};
_modal = null;

/*
  Programacion para los modals
*/
var _modal = $r.select('.actualiza-lista-pedidos');
for (var i = 0; i < _modal.length; i++) 
{
  _modal[i].addEventListener('click',function()
  {
    $__renderiza_carrito_ecommerce();
  },false);
};
_modal = null;

/*
  Programacion para desabilitar los forms
*/
var _form = $r.select('.deshabilitado');
for (var i = 0; i < _form.length; i++)
  _form[i].addEventListener('submit',function(a){a.preventDefault(); return false;},false);


/*
  Programacion de codigos de descuento
*/
_variables.codigoTimer = 0;
_e.d._codigo_desc.addEventListener('keyup',function(a)
{
  _e.d._total_contado.innerHTML = '$'+ $r.precio((_variables.carritoTotalHoy),2,',','.');
  _e.d._codigo_desc.classList.remove("text-error","text-success");
  clearTimeout(_variables.codigoTimer);
  _variables.codigoTimer = setTimeout(function(_t)
  {
    
    if($r.validacion.numero(_t.slice(0,2)) == false)
    {
      if(_t.slice(2).trim().length == 5)
      {
        if($r.validacion.numero(_t.slice(2)) == true)
        {
            var _obd =  {
                "url": $r.conf_ajax.absoluta+$r.conf_ajax.url.proceso, 
                "metodo": $r.conf_ajax.metodo.post, 
                "datos": "h=__verifica_cupon_desc&cod="+_e.d._codigo_desc.value, 
                "recibe": function(v,b)
                {
                  if(v.aviso == true)
                  {
                    $__muestra_cantidades_totales();
                    var _porc             = {};
                        _porc.obtenido    = v.resultado.datos[0].descuento;
                        
                        if(v.resultado.datos[0].tipo == 1)
                          _porc.aDescontar  = (_variables.carritoTotalHoy * parseFloat(_porc.obtenido)) / 100;
                        else
                          _porc.aDescontar  = parseFloat(_porc.obtenido);
                        
                        _porc.nuevoTotal  = _variables.carritoTotalHoy - _porc.aDescontar;

                    _e.d._total_contado.innerHTML = '$'+ $r.precio((_porc.nuevoTotal),2,',','.');

                    _e.d._codigo_desc.classList.add("text-success");

                    _porc = null;
                  }
                  else
                    _e.d._codigo_desc.classList.add("text-error");
                }
            };
            $r.ajax2(_obd);

        }
      }
    }

  },500,this.value)
},false);


_e.d.submit_mp_paso_pago.addEventListener('click',function(){_e.d.interna_paso_mp_2.click();},false)
/*
  Programacion para las sumas o restas
*/

_variables.tiempoSumaResta = 0;
_e.d.__suma_cantidad_carrito.addEventListener('click', function(){
  // sumamos o restamos producto del ecommerce
  clearTimeout(_variables.tiempoSumaResta);
  _e.d.__cantidad_interna_cantidades.value = parseFloat(_e.d.__cantidad_interna_cantidades.value) + 1;
  _variables.tiempoSumaResta = setTimeout(function(){$__suma_producto_a_ecommerce(); $__muestra_cantidades_totales();},400)
}, false);

_e.d.__resta_cantidad_carrito.addEventListener('click', function(){
  // sumamos o restamos producto del ecommerce
  clearTimeout(_variables.tiempoSumaResta);
  _e.d.__cantidad_interna_cantidades.value = parseFloat(_e.d.__cantidad_interna_cantidades.value) - 1;
  if(_e.d.__cantidad_interna_cantidades.value <= 0)
    _e.d.__cantidad_interna_cantidades.value = 0;
  _variables.tiempoSumaResta = setTimeout(function(){$__suma_producto_a_ecommerce();$__muestra_cantidades_totales();},400)
}, false);

/*
  Programacion para el manejo de secciones de empresa
*/
var _menu = $r.select('a[data-panel-menu]');
for (var i = 0; i < _menu.length; i++) 
{
  _menu[i].addEventListener('click', function(a)
    {
      a.preventDefault();
        var _menu = $r.select('a[data-panel-menu]');
        var _dp = $r.select('div[data-step-finalizacion]');
        for (var ii = 0; ii < _dp.length; ii++)
        {
          _menu[ii].parentNode.classList.remove('active');
          _dp[ii].style.display = 'none';
        }

        if(this.getAttribute('href').split('#')[1] == 2)
        {
          if($_valida_usuario() == false)
          {
            _e.d.modal_interna_registrate.classList.add('active');
            _menu[0].parentNode.classList.add('active');
            _dp[0].style.display = 'block';
          }
          else
          {
            $r.select('div[data-step-finalizacion="'+this.getAttribute('href').split('#')[1]+'"]')[0].style.display = 'block';
            this.parentNode.classList.add('active');
          }
        }
        else
        {
          $r.select('div[data-step-finalizacion="'+this.getAttribute('href').split('#')[1]+'"]')[0].style.display = 'block';
          this.parentNode.classList.add('active');
        }

      return false;
    }, false)
}
_menu = null;

var _volver = $r.select('span[data-volver]');
for (var i = 0; i < _volver.length; i++) 
  _volver[i].addEventListener('click', function(a) {history.go(-1); }, false);
_volver = null;


ir_paso_dos = function(a)
{
  a.preventDefault();

  if($_valida_usuario() == false)
    _e.d.modal_interna_registrate.classList.add('active');
  else
  {
    $_acomoda_datos_usuario_en_forms();
    $r.select('a[data-panel-menu][href="'+this.getAttribute('href')+'"]')[0].click();
  }
};
_e.d.pagar_paso_2.addEventListener('click', ir_paso_dos, false);
_e.d.ir_a_pagos.addEventListener('click', ir_paso_dos, false);
_e.d.regresar_a_tarjeta.addEventListener('click', ir_paso_dos, false);



delete ir_paso_dos;


/*
  Programacion de MercadoPago
*/
__mercadopago.prepara.addEvent(_e.d.pay,        'submit', __mercadopago.prepara.doPay);
__mercadopago.prepara.addEvent(_e.d.cardNumber, 'keyup',  __mercadopago.prepara.guessingPaymentMethod);
__mercadopago.prepara.addEvent(_e.d.cardNumber, 'change', __mercadopago.prepara.guessingPaymentMethod);

_e.d.interna_paso_mp_1.addEventListener('click',function(a){
  a.preventDefault();

  _e.d._pagos_mp_personales.style.display   = 'inline-block';
  _e.d._pagos_mp_tarjeta.style.display      = 'none';
  this.parentNode.classList.add('active');
  _e.d.interna_paso_mp_2.parentNode.classList.remove('active');
},false);
_e.d.interna_paso_mp_2.addEventListener('click',
  function(a)
  {
    a.preventDefault();
    _e.d._pagos_mp_personales.style.display   = 'none';
    _e.d._pagos_mp_tarjeta.style.display      = 'inline-block';
    _e.d.interna_paso_mp_1.parentNode.classList.remove('active');
    this.parentNode.classList.add('active');
  },
false);


/*
  Label etiqueta seleccionada
*/
var _label = $r.select('.accordion-header');
for (var i = 0; i < _label.length; i++) 
{
  _label[i].addEventListener('click', function()
  {

    var _label = $r.select('.accordion-header');
    for (var i = 0; i < _label.length; i++) 
      _label[i].classList.remove('label','text-bold'); 

    this.classList.add('label','text-bold');

    /* Agregamos las programaciones ideales para cada paso */
      // programacion para transferencia
      if(this.getAttribute('data-mp-elegido') == 'transferencia')
      {
        _e.d.transferencia_fecha.value  = $r.date('Y-m-d');
        _e.d.transferencia_hora.value   = $r.date('H:i');
      }
      else if(this.getAttribute('data-mp-elegido') == 'mercadopago')
        __mercadopago.prepara.clavePublica(_e.d.mppubkey.value);
    
  }, false);
};


/*
  Submit de formularios para entrega
*/
_e.d.__transaccion_efectivo.addEventListener('submit',
function(a)
{
  a.preventDefault();
  var _error = false;
  
  /* Limpiamos todos los campos */
  _e.d.nombre_apellido.classList.remove('is-error');
  _e.d.edad.classList.remove('is-error');
  _e.d.dni.classList.remove('is-error');
  _e.d.personal_email.classList.remove('is-error');
  _e.d.personal_celular.classList.remove('is-error');
  _e.d.calle.classList.remove('is-error');
  _e.d.altura.classList.remove('is-error');
  _e.d.cp.classList.remove('is-error');
  _e.d.piso.classList.remove('is-error');
  _e.d.enviar_efectivo_reserva.classList.remove('loading');

  if(_e.d.nombre_apellido.value.trim().length < 3)
  {
    _e.d.nombre_apellido.focus();
    _e.d.nombre_apellido.classList.add('is-error');
    _error = "Ingrese un nombre válido";
  }
  else if( _e.d.edad.value.trim().indexOf('-') == -1 || ( parseFloat($r.date('Y')) - parseFloat(_e.d.edad.value.trim().split('-')[0]) ) < 18 )
  {
    // validamos el anterior 
    _e.d.nombre_apellido.classList.add('is-success');
    
    // mostramos el error 
    _e.d.edad.focus();
    _e.d.edad.classList.add('is-error');

    _error = "Debe ser mayor a 18 años para comprar";
  }
  else if( String(parseFloat(_e.d.dni.value.trim())).length < 8 || $r.validacion.numero(String(parseFloat(_e.d.dni.value.trim()))) == false)
  {
    // validamos el anterior 
    _e.d.nombre_apellido.classList.add('is-success');
    _e.d.edad.classList.add('is-success');
    
    // mostramos el error 
    _e.d.dni.focus();
    _e.d.dni.classList.add('is-error');
    _error = "Ingrese un DNI válido";
  }
  else if( (_e.d.personal_email.value.trim().split('@') == -1) || (_e.d.personal_email.value.trim().split('@.') > -1) )
  {
    // validamos el anterior 
    _e.d.nombre_apellido.classList.add('is-success');
    _e.d.edad.classList.add('is-success');
    _e.d.dni.classList.add('is-success');
    
    // mostramos el error 
    _e.d.personal_email.focus();
    _e.d.personal_email.classList.add('is-error');
    _error = "Ingrese un mail válido de contacto";
  }
  else if( String(parseFloat(_e.d.personal_celular.value.trim())).length < 4 || $r.validacion.numero(String(parseFloat(_e.d.personal_celular.value.trim()))) == false )
  {
    // validamos el anterior 
    _e.d.nombre_apellido.classList.add('is-success');
    _e.d.edad.classList.add('is-success');
    _e.d.dni.classList.add('is-success');
    _e.d.personal_email.classList.add('is-success');
    
    // mostramos el error 
    _e.d.personal_celular.focus();
    _e.d.personal_celular.classList.add('is-error');
    _error = "Ingrese un celular válido de contacto"
  }
  else if( _e.d.calle.value.trim().length < 2 )
  {
    // validamos el anterior 
    _e.d.nombre_apellido.classList.add('is-success');
    _e.d.edad.classList.add('is-success');
    _e.d.dni.classList.add('is-success');
    _e.d.personal_email.classList.add('is-success');
    _e.d.personal_celular.classList.add('is-success');
    
    // mostramos el error 
    _e.d.calle.focus();
    _e.d.calle.classList.add('is-error');
    _error = "Ingrese la calle sin numeros ni caracteres especiales";
  }
  else if( String(parseFloat(_e.d.altura.value.trim())).length < 3 || $r.validacion.numero(String(parseFloat(_e.d.altura.value.trim()))) == false )
  {
    // validamos el anterior 
    _e.d.nombre_apellido.classList.add('is-success');
    _e.d.edad.classList.add('is-success');
    _e.d.dni.classList.add('is-success');
    _e.d.personal_email.classList.add('is-success');
    _e.d.personal_celular.classList.add('is-success');
    _e.d.calle.classList.add('is-success');
    
    // mostramos el error 
    _e.d.altura.focus();
    _e.d.altura.classList.add('is-error');
    _error = "La altura solo debe ser numérica";
  }
  else if( String(parseFloat(_e.d.cp.value.trim())).length < 3 || $r.validacion.numero(String(parseFloat(_e.d.cp.value.trim()))) == false )
  {
    // validamos el anterior 
    _e.d.nombre_apellido.classList.add('is-success');
    _e.d.edad.classList.add('is-success');
    _e.d.dni.classList.add('is-success');
    _e.d.personal_email.classList.add('is-success');
    _e.d.personal_celular.classList.add('is-success');
    _e.d.calle.classList.add('is-success');
    _e.d.altura.classList.add('is-success');
    
    // mostramos el error 
    _e.d.cp.classList.add('is-error');
    _error = "Ingrese un codigo postal válido";
  }
  
  /* Acciones para el submit */
  _e.d.enviar_efectivo_reserva.classList.add('loading');

  if(_error == false)
  {
      var _obd =  {
              "url": $r.conf_ajax.absoluta+$r.conf_ajax.url.proceso, 
              "metodo": $r.conf_ajax.metodo.post, 
              "datos": "h=_genera_pedido&_desc="+_e.d._codigo_desc.value+"&_usr="+JSON.stringify($_valida_usuario())+"&tipo=1&carrito="+JSON.stringify(_variables.carrito)+"&"+$r.serialize(this), 
              "recibe": function(v,b)
              {
                _funciones_ajax_carrito(v,b);
                $r.precarga.remove();

                if(typeof gtag != 'undefined')
                  gtag('event', 'Pago', {'metodo': 'Efectivo'});
              }
          };
      $r.ajax2(_obd);

  }
  else
  {
      _e.d.enviar_efectivo_reserva.classList.remove('loading');
      alert('<div class="toast toast-error"> <p>'+_error+'</p> </div>', 5000);
  }
},false);


_e.d.__aviso_transferencia.addEventListener('submit',
function(a)
{
  a.preventDefault();
  var _error = false;
  
  /* Limpiamos todos los campos */
  _e.d.transferencia_nombre_apellido.classList.remove('is-error');
  _e.d.transferencia_edad.classList.remove('is-error');
  _e.d.transferencia_dni.classList.remove('is-error');
  _e.d.transferencia_email.classList.remove('is-error');
  _e.d.transferencia_celular.classList.remove('is-error');
  _e.d.transferencia_calle.classList.remove('is-error');
  _e.d.transferencia_altura.classList.remove('is-error');
  _e.d.transferencia_cp.classList.remove('is-error');
  _e.d.transferencia_piso.classList.remove('is-error');
  _e.d.transferencia_transaccion.classList.remove('is-error');
  _e.d.submit_transfer.classList.remove('loading');

  if(_e.d.transferencia_nombre_apellido.value.trim().length < 3)
  {
    _e.d.transferencia_nombre_apellido.focus();
    _e.d.transferencia_nombre_apellido.classList.add('is-error');
    _error = "Ingrese un nombre válido";
  }
  else if( _e.d.transferencia_edad.value.trim().indexOf('-') == -1 || ( parseFloat($r.date('Y')) - parseFloat(_e.d.transferencia_edad.value.trim().split('-')[0]) ) < 18 )
  {
    // validamos el anterior 
    _e.d.transferencia_nombre_apellido.classList.add('is-success');
    
    // mostramos el error 
    _e.d.transferencia_edad.focus();
    _e.d.transferencia_edad.classList.add('is-error');

    _error = "Debe ser mayor a 18 años para comprar";
  }
  else if( String(parseFloat(_e.d.transferencia_dni.value.trim())).length < 8 || $r.validacion.numero(String(parseFloat(_e.d.transferencia_dni.value.trim()))) == false)
  {
    // validamos el anterior 
    _e.d.transferencia_nombre_apellido.classList.add('is-success');
    _e.d.transferencia_edad.classList.add('is-success');
    
    // mostramos el error 
    _e.d.transferencia_dni.focus();
    _e.d.transferencia_dni.classList.add('is-error');
    _error = "Ingrese un DNI válido";
  }
  else if( (_e.d.transferencia_email.value.trim().split('@') == -1) || (_e.d.transferencia_email.value.trim().split('@.') > -1) )
  {
    // validamos el anterior 
    _e.d.transferencia_nombre_apellido.classList.add('is-success');
    _e.d.transferencia_edad.classList.add('is-success');
    _e.d.transferencia_dni.classList.add('is-success');
    
    // mostramos el error 
    _e.d.transferencia_email.focus();
    _e.d.transferencia_email.classList.add('is-error');
    _error = "Ingrese un mail válido de contacto";
  }
  else if( String(parseFloat(_e.d.transferencia_celular.value.trim())).length < 4 || $r.validacion.numero(String(parseFloat(_e.d.transferencia_celular.value.trim()))) == false )
  {
    // validamos el anterior 
    _e.d.transferencia_nombre_apellido.classList.add('is-success');
    _e.d.transferencia_edad.classList.add('is-success');
    _e.d.transferencia_dni.classList.add('is-success');
    _e.d.transferencia_email.classList.add('is-success');
    
    // mostramos el error 
    _e.d.transferencia_celular.focus();
    _e.d.transferencia_celular.classList.add('is-error');
    _error = "Ingrese un celular válido de contacto"
  }
  else if( _e.d.transferencia_calle.value.trim().length < 2 )
  {
    // validamos el anterior 
    _e.d.transferencia_nombre_apellido.classList.add('is-success');
    _e.d.transferencia_edad.classList.add('is-success');
    _e.d.transferencia_dni.classList.add('is-success');
    _e.d.transferencia_email.classList.add('is-success');
    _e.d.transferencia_celular.classList.add('is-success');
    
    // mostramos el error 
    _e.d.transferencia_calle.focus();
    _e.d.transferencia_calle.classList.add('is-error');
    _error = "Ingrese la calle sin numeros ni caracteres especiales";
  }
  else if( String(parseFloat(_e.d.transferencia_altura.value.trim())).length < 3 || $r.validacion.numero(String(parseFloat(_e.d.transferencia_altura.value.trim()))) == false )
  {
    // validamos el anterior 
    _e.d.transferencia_nombre_apellido.classList.add('is-success');
    _e.d.transferencia_edad.classList.add('is-success');
    _e.d.transferencia_dni.classList.add('is-success');
    _e.d.transferencia_email.classList.add('is-success');
    _e.d.transferencia_celular.classList.add('is-success');
    _e.d.transferencia_calle.classList.add('is-success');
    
    // mostramos el error 
    _e.d.transferencia_altura.focus();
    _e.d.transferencia_altura.classList.add('is-error');
    _error = "La altura solo debe ser numérica";
  }
  else if( String(parseFloat(_e.d.transferencia_cp.value.trim())).length < 3 || $r.validacion.numero(String(parseFloat(_e.d.transferencia_cp.value.trim()))) == false )
  {
    // validamos el anterior 
    _e.d.transferencia_nombre_apellido.classList.add('is-success');
    _e.d.transferencia_edad.classList.add('is-success');
    _e.d.transferencia_dni.classList.add('is-success');
    _e.d.transferencia_email.classList.add('is-success');
    _e.d.transferencia_celular.classList.add('is-success');
    _e.d.transferencia_calle.classList.add('is-success');
    _e.d.transferencia_altura.classList.add('is-success');
    
    // mostramos el error 
    _e.d.transferencia_cp.classList.add('is-error');
    _error = "Ingrese un codigo postal válido";
  }
  else if( _e.d.transferencia_transaccion.value.trim().length == 0)
  {
    // validamos el anterior 
    _e.d.transferencia_nombre_apellido.classList.add('is-success');
    _e.d.transferencia_edad.classList.add('is-success');
    _e.d.transferencia_dni.classList.add('is-success');
    _e.d.transferencia_email.classList.add('is-success');
    _e.d.transferencia_celular.classList.add('is-success');
    _e.d.transferencia_calle.classList.add('is-success');
    _e.d.transferencia_altura.classList.add('is-success');
    _e.d.transferencia_cp.classList.add('is-success');
    
    // mostramos el error 
    _e.d.transferencia_transaccion.classList.add('is-error');
    _e.d.transferencia_transaccion.focus();
    _error = 'Ingrese un nro de transferencia válido';
  }

  _e.d.submit_transfer.classList.add('loading');

  if(_error == false)
  {
      var _obd =  {
              "url": $r.conf_ajax.absoluta+$r.conf_ajax.url.proceso, 
              "metodo": $r.conf_ajax.metodo.post, 
              "datos": "h=_genera_pedido&_desc="+_e.d._codigo_desc.value+"&_usr="+JSON.stringify($_valida_usuario())+"&tipo=3&carrito="+JSON.stringify(_variables.carrito)+"&"+$r.serialize(this), 
              "recibe": function(v,b)
              {
                _funciones_ajax_carrito(v,b);
                $r.precarga.remove();

                if(typeof gtag != 'undefined')
                  gtag('event', 'Pago', {'metodo': 'Transferencia'});
              }
          };
      $r.ajax2(_obd);

  }
  else
  {
      _e.d.submit_transfer.classList.remove('loading');
      alert('<div class="toast toast-error"> <p>'+_error+'</p> </div>', 5000);
  }
},false);

/* Formulario de mercadopago */
function $__envia_ajax_mercadopago()
{
  var _error = false;
  
  /* Limpiamos todos los campos */
  _e.d.cardholderName.classList.remove('is-error');
  _e.d.edad.classList.remove('is-error');
  _e.d.docNumber.classList.remove('is-error');
  _e.d.email.classList.remove('is-error');
  _e.d.calle_mp.classList.remove('is-error');
  _e.d.altura_mp.classList.remove('is-error');
  _e.d.cp_mp.classList.remove('is-error');
  _e.d.piso_mp.classList.remove('is-error');
  _e.d.submit_mp.classList.remove('loading');

  if(_e.d.cardholderName.value.trim().length < 3)
  {
    _e.d.cardholderName.focus();
    _e.d.cardholderName.classList.add('is-error');
    _error = "Ingrese un nombre válido";
  }
  else if( _e.d.edad.value.trim().indexOf('-') == -1 || ( parseFloat($r.date('Y')) - parseFloat(_e.d.edad.value.trim().split('-')[0]) ) < 18 )
  {
    // validamos el anterior 
    _e.d.cardholderName.classList.add('is-success');
    
    // mostramos el error 
    _e.d.edad.focus();
    _e.d.edad.classList.add('is-error');

    _error = "Debe ser mayor a 18 años para comprar";
  }
  else if( String(parseFloat(_e.d.docNumber.value.trim())).length < 8 || $r.validacion.numero(String(parseFloat(_e.d.docNumber.value.trim()))) == false)
  {
    // validamos el anterior 
    _e.d.cardholderName.classList.add('is-success');
    _e.d.edad.classList.add('is-success');
    
    // mostramos el error 
    _e.d.docNumber.focus();
    _e.d.docNumber.classList.add('is-error');
    _error = "Ingrese un DNI válido";
  }
  else if( (_e.d.email.value.trim().split('@') == -1) || (_e.d.email.value.trim().split('@.') > -1) )
  {
    // validamos el anterior 
    _e.d.cardholderName.classList.add('is-success');
    _e.d.edad.classList.add('is-success');
    _e.d.docNumber.classList.add('is-success');
    
    // mostramos el error 
    _e.d.email.focus();
    _e.d.email.classList.add('is-error');
    _error = "Ingrese un mail válido de contacto";
  }
  else if( _e.d.calle_mp.value.trim().length < 2 )
  {
    // validamos el anterior 
    _e.d.cardholderName.classList.add('is-success');
    _e.d.edad.classList.add('is-success');
    _e.d.docNumber.classList.add('is-success');
    _e.d.email.classList.add('is-success');
    
    // mostramos el error 
    _e.d.calle_mp.focus();
    _e.d.calle_mp.classList.add('is-error');
    _error = "Ingrese la calle sin numeros ni caracteres especiales";
  }
  else if( String(parseFloat(_e.d.altura_mp.value.trim())).length < 3 || $r.validacion.numero(String(parseFloat(_e.d.altura_mp.value.trim()))) == false )
  {
    // validamos el anterior 
    _e.d.cardholderName.classList.add('is-success');
    _e.d.edad.classList.add('is-success');
    _e.d.docNumber.classList.add('is-success');
    _e.d.email.classList.add('is-success');
    _e.d.calle_mp.classList.add('is-success');
    
    // mostramos el error 
    _e.d.altura_mp.focus();
    _e.d.altura_mp.classList.add('is-error');
    _error = "La altura solo debe ser numérica";
  }
  else if( String(parseFloat(_e.d.cp_mp.value.trim())).length < 3 || $r.validacion.numero(String(parseFloat(_e.d.cp_mp.value.trim()))) == false )
  {
    // validamos el anterior 
    _e.d.cardholderName.classList.add('is-success');
    _e.d.edad.classList.add('is-success');
    _e.d.docNumber.classList.add('is-success');
    _e.d.email.classList.add('is-success');
    _e.d.calle_mp.classList.add('is-success');
    _e.d.altura_mp.classList.add('is-success');
    
    // mostramos el error 
    _e.d.cp_mp.classList.add('is-error');
    _error = "Ingrese un codigo postal válido";
  }
  
  /* Acciones para el submit */
  _e.d.submit_mp.classList.add('loading');

  if(_error == false)
  {
      var _obd =  {
              "url": $r.conf_ajax.absoluta+$r.conf_ajax.url.proceso, 
              "metodo": $r.conf_ajax.metodo.post, 
              "datos": "h=_genera_pedido&_desc="+_e.d._codigo_desc.value+"&_usr="+JSON.stringify($_valida_usuario())+"&tipo=2&carrito="+JSON.stringify(_variables.carrito)+"&"+$r.serialize(_e.d.pay), 
              "recibe": function(v,b)
              {
                _funciones_ajax_carrito(v,b);
                $r.precarga.remove();

                if(typeof gtag != 'undefined')
                  gtag('event', 'Pago', {'metodo': 'MercadoPago'});
              }
          };
      $r.ajax2(_obd);

  }
  else
  {
      _e.d.submit_mp.classList.remove('loading');
      alert('<div class="toast toast-error"> <p>'+_error+'</p> </div>', 5000);
  }
};

function $_limpia_carrito_luego_de_compra()
{
  if(typeof _variables.idBodPaga != 'undefined')
  {
    for (var kk = 0; kk < _variables.carrito.length; kk++) 
    {
      if(parseFloat(_variables.carrito[kk].empresa) == parseFloat(_variables.idBodPaga))
      {
        _variables.carrito.splice(kk,1);
        kk--;
      }
    }
  };

  if(_variables.carrito.length == 0)
    _variables.carrito = {};
  
  $r.lls('ZWNvbW1lcmNld2luZWJl');

  $__muestra_cantidades_totales();
}

function _funciones_ajax_carrito(v,b)
{
  switch(b)
  {
    case "_genera_pedido":
      if(v.aviso == true)
      {
        _e.d.__confirmacion_titulo.classList.add('text-success');
        _e.d.__confirmacion_icono.classList.add('text-success');

        if( parseFloat(v.tipo) == 1)
        {
          _e.d.__confirmacion_icono.innerHTML   = '<i class="las la-wine-glass-alt"></i>';
          _e.d.__confirmacion_titulo.innerHTML  = '¡Reservado!';
          _e.d.__confirmacion_texto.innerHTML   = 'Su pedido fue recepcionado, durante las próximas 24 horas nos pondremos en contacto para coordinar entrega.';
          _e.d.ir_a_pagos.classList.add('d-none');
          _e.d.regresar_a_tarjeta.classList.add('d-none');
          
          $_limpia_carrito_luego_de_compra();

          // lleva al paso 3
          $r.select('a[data-panel-menu][href="#3"]')[0].click();
          _e.d.__transaccion_efectivo.reset();

          if(typeof gtag != 'undefined')
            gtag('event', 'Pago', {'resultado': 'Reservado'});
        }
        else if( parseFloat(v.tipo) == 2)
        {
          if(v.mp.aviso == true && v.mp.id > 0)
          {
            _e.d.__confirmacion_icono.innerHTML   = '<i class="las la-wine-glass-alt"></i>';
            _e.d.__confirmacion_titulo.innerHTML  = '¡Reservado!';
            _e.d.__confirmacion_texto.innerHTML    = 'Su pedido fue recepcionado, durante las próximas 24 horas nos pondremos en contacto para coordinar entrega.';
            _e.d.__confirmacion_texto.innerHTML   += '<br><br><span class="text-bold text-center">Su código de MercadoPago:</span><span class="text-bold text-center h5 text-success"> '+v.mp.id+'</span>';

            _e.d.ir_a_pagos.classList.add('d-none');
            _e.d.regresar_a_tarjeta.classList.add('d-none');
          
            $_limpia_carrito_luego_de_compra();

            // lleva al paso 3
            $r.select('a[data-panel-menu][href="#3"]')[0].click();
            _e.d.pay.reset();

            if(typeof gtag != 'undefined')
              gtag('event', 'Pago', {'resultado': 'Pago exitoso'});
          }
          else
          {
            _e.d.__confirmacion_icono.innerHTML   = '<i class="las la-credit-card"></i>';
            _e.d.__confirmacion_titulo.innerHTML  = v.mp.response;
            _e.d.__confirmacion_texto.innerHTML    = 'No se pudo concretar su pedido, verifique los datos e intente nuevamente.';
            _e.d.ir_a_pagos.classList.add('d-none');
            _e.d.regresar_a_tarjeta.classList.remove('d-none');
          
            $_limpia_carrito_luego_de_compra();

            // lleva al paso 3
            $r.select('a[data-panel-menu][href="#3"]')[0].click();
            if(typeof gtag != 'undefined')
              gtag('event', 'Pago', {'resultado': 'Rechazado'});
          }
        }
        else if( parseFloat(v.tipo) == 3)
        {
          _e.d.__confirmacion_icono.innerHTML   = '<i class="las la-wine-glass-alt"></i>';
          _e.d.__confirmacion_titulo.innerHTML  = '¡Terminado!';
          _e.d.__confirmacion_texto.innerHTML    = 'Su pedido fue recepcionado, durante las próximas 24 horas nos pondremos en contacto para coordinar entrega.';
          _e.d.__confirmacion_texto.innerHTML   += '<br><br><span class="text-bold text-center">Su código de MercadoPago:</span><span class="text-bold text-center h5 text-success"> '+v.mp.id+'</span>';
          _e.d.ir_a_pagos.classList.add('d-none');
          _e.d.regresar_a_tarjeta.classList.add('d-none');
        
          $_limpia_carrito_luego_de_compra();

          // lleva al paso 3
          $r.select('a[data-panel-menu][href="#3"]')[0].click();
          if(typeof gtag != 'undefined')
            gtag('event', 'Pago', {'resultado': 'Reservado'});
        }

        setTimeout(function(){ location.href = 'home.html'; },10000);
      }
      else
      {
        _e.d.__confirmacion_titulo.classList.remove('text-success');
        _e.d.__confirmacion_icono.classList.remove('text-success');
        _e.d.__confirmacion_titulo.classList.add('text-error');
        _e.d.__confirmacion_icono.classList.add('text-error');

        _e.d.__confirmacion_icono.innerHTML    = '<i class="las la-exclamation-circle"></i>';
        _e.d.__confirmacion_titulo.innerHTML   = '¡Error al procesar el pedido!';
        _e.d.__confirmacion_texto.innerHTML    = 'Hubo un error al procesar el pedido, intente nuevamente más tarde o contactenos a nuestro whatsapp';
        _e.d.__confirmacion_texto.innerHTML   += '<br><br><span class="text-bold text-center">whatsapp:</span><span class="text-bold text-center h5 text-success"><a class="btn btn-primary" href="https://wa.me/541154759919?text=">+54 11 37762637</a></span>';

      }
      
      _e.d.submit_mp.classList.remove('loading');
      _e.d.enviar_efectivo_reserva.classList.remove('loading');
      _e.d.submit_transfer.classList.remove('loading');

    break;
    case "__trae_metodo_de_pago":
      if(v.aviso == true)
      {
        if(v.resultado.datos.length > 0)
        {
            $r.select('div[data-medio-pago="transferencia"]')[0].style.display = 'block';
            $r.select('div[data-medio-pago="efectivo"]')[0].style.display      = 'block';
            $r.select('div[data-medio-pago="mercadopago"]')[0].style.display   = 'block';
            for (var uuu = 0; uuu < v.resultado.datos.length; uuu++) 
            {
              // efectivo
              if(parseFloat(v.resultado.datos[uuu].tipo) == 1)
              {
                // validamos efectivo
                var _validador = JSON.parse(atob(v.resultado.datos[uuu].credenciales));
                if(_validador.efectivo != 1)
                  $r.select('div[data-medio-pago="efectivo"]')[0].style.display = 'none';
              }

              // MercadoPago
              if(parseFloat(v.resultado.datos[uuu].tipo) == 2)
              {
                // validamos mercadopago
                var _validador = JSON.parse(atob(v.resultado.datos[uuu].credenciales));
                if(_validador.public == '')
                  $r.select('div[data-medio-pago="mercadopago"]')[0].style.display = 'none';
                else
                {
                  _e.d.mppubkey.value = _validador.public;
                  __mercadopago.prepara.clavePublica(_e.d.mppubkey.value);
                }
              }

              // transferencia
              if(parseFloat(v.resultado.datos[uuu].tipo) == 3)
              {
                // validamos transferencia
                var _validador = JSON.parse(atob(v.resultado.datos[uuu].credenciales));
                if(_validador.cbu == '')
                  $r.select('div[data-medio-pago="transferencia"]')[0].style.display = 'none';
                else
                {
                  _e.d.bnk_cbu.innerHTML    = '<span class="text-bold">CBU: </span> '+_validador.cbu;
                  _e.d.bnk_alias.innerHTML  = '<span class="text-bold">Alias: </span> '+_validador.alias;
                }
              }
            }
        }
      }
    break;
  }
}