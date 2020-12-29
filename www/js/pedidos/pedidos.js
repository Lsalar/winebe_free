$r.dom();


if($__verificamos_carrito_local() == true)
  _variables.carrito = JSON.parse($r.tls('ZWNvbW1lcmNld2luZWJl'));

// ponemos eventos al carrito
$__carga_evento_carrito();

_variables._usuario = $_valida_usuario();
if(_variables._usuario == false)
  _variables._usuario = {"nombre":'Invitado'};

_e.d._nombre_avatar.setAttribute('data-initial',_variables._usuario.nombre.slice(0,2));

/* Ponemos precarga de elementos */
  var _divTitle     = $r.create('div');
      _divTitle.classList.add('tile','tile-centered');
  var _divTitleIcon = $r.create('div');
      _divTitleIcon.classList.add('tile-icon','image-precarga')
  var _divTitleCont = $r.create('div');
      _divTitleCont.classList.add('tile-content','text-precarga');

    _divTitle.appendChild(_divTitleIcon);
    _divTitle.appendChild(_divTitleCont);

    /* Title icono */
    _divTitleIcon.innerHTML = ' <div class="example-tile-icon"></div>';
    _divTitleCont.innerHTML = ' <p class="tile-title text-precarga-line"></p>\
                                <p class="tile-subtitle text-precarga-line"></p>';

  __carga_pedidos_generales.innerHTML = '';
  __carga_pedidos_generales.appendChild(_divTitle);

/*
  Separamos la programacion, para el caso donde encontramos el codigo que quieren revisar.
*/
var _fech                        = ['osvaldo','Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
if(location.href.indexOf('?d=')>-1)
{
  var _queId = atob(location.href.split('?d=')[1]);
  if($r.validacion.numero(_queId) == true)
  {
    
    var _obd =  {
                  "url": $r.conf_ajax.absoluta+$r.conf_ajax.url.proceso, 
                  "metodo": $r.conf_ajax.metodo.post, 
                  "datos": "h=__trae_info_pedido&_usr="+JSON.stringify($_valida_usuario())+"&id="+_queId, 
                  "recibe": function(v,b)
                  {
                    $_lleva_a_estado(v);
                  }
              };
        $r.ajax2(_obd);
  }
};

    
    var _obd =  {
                  "url": $r.conf_ajax.absoluta+$r.conf_ajax.url.proceso, 
                  "metodo": $r.conf_ajax.metodo.post, 
                  "datos": "h=__trae_info_pedidos&_usr="+JSON.stringify($_valida_usuario()), 
                  "recibe": function(v,b)
                  {
                    if(v.aviso == true)
                    {
                      if(v.resultado.cantidad > 0)
                      {
                        _e.d.__carga_pedidos_generales.innerHTML = '';
                        for (var oop = 0; oop < v.resultado.datos.length; oop++) 
                        {
                          
                            
                            var _divTitle     = $r.create('div');
                                _divTitle.classList.add('tile','tile-centered');
                            var _divTitleIcon = $r.create('div');
                                _divTitleIcon.classList.add('tile-icon','tile-icon-medida')
                            var _divTitleCont = $r.create('div');
                                _divTitleCont.classList.add('tile-content');
                            var _divDivider   = $r.create('div');
                                _divDivider.classList.add('divider');

                              _divTitle.appendChild(_divTitleIcon);
                              _divTitle.appendChild(_divTitleCont);

                              /* Title icono */
                              var _fecha_hora = v.resultado.datos[oop].fecha_sistema_creado.split(' ');
                              var _fecha      =  _fecha_hora[0].split('-');
                              
                              var _estadoIcono = '<i class="las la-shopping-bag"></i>';

                              if( parseFloat(v.resultado.datos[oop].estado) == 0)
                                _estadoIcono = '<i class="las la-comments-dollar"></i>';
                              else if (parseFloat(v.resultado.datos[oop].estado) == 11 || parseFloat(v.resultado.datos[oop].estado) == 1 || parseFloat(v.resultado.datos[oop].estado) == 2)
                                _estadoIcono = '<i class="las la-truck-loading"></i>';
                              else if (parseFloat(v.resultado.datos[oop].estado) == 3)
                                _estadoIcono = '<i class="las la-truck"></i>';
                              else if (parseFloat(v.resultado.datos[oop].estado) == 4)
                                _estadoIcono = '<i class="las la-check-double"></i>';
                              else if (parseFloat(v.resultado.datos[oop].estado) == 5)
                                _estadoIcono = '<i class="las la-exclamation-circle"></i>';

                              _divTitleIcon.innerHTML = '<div class="example-tile-icon">'+ _estadoIcono +'</div>';
                              _divTitleCont.innerHTML = ' <p class="tile-title text-bold text-left">'+( _fecha[2] +' '+ _fech[parseFloat(_fecha[1])] +' '+ _fecha[0])+'</p>\
                                                          <p class="tile-subtitle text-left"><span class="text-bold">Cod:</span>'+ atob(v.resultado.datos[oop].nro_transaccion)+'</p>';

                              var _btnEstadoContenedor = $r.create('div');
                                  _btnEstadoContenedor.classList.add('text-right','mt-2');
                              /* Acciones Ver pedido / ver estado */
                              var _btnEstado = $r.create('button');
                                  _btnEstado.classList.add('btn','btn-primary');
                                  _btnEstado.innerHTML  = '<i class="las la-map-marked-alt"></i> estado';
                                  _btnEstado._id        = v.resultado.datos[oop].nro_transaccion;
                                  _btnEstado.addEventListener('click',function(){

                                    var _obd =  {
                                              "url": $r.conf_ajax.absoluta+$r.conf_ajax.url.proceso, 
                                              "metodo": $r.conf_ajax.metodo.post, 
                                              "datos": "h=__trae_info_pedido&_usr="+JSON.stringify($_valida_usuario())+"&id="+atob(this._id), 
                                              "recibe": function(v,b)
                                              {
                                                $_lleva_a_estado(v);
                                              }
                                          };
                                    $r.ajax2(_obd);

                                  },false);

                              _btnEstadoContenedor.appendChild(_btnEstado);

                              var _btnPedido = $r.create('button');
                                  _btnPedido.classList.add('btn','btn-link');
                                  _btnPedido.innerHTML = '<i class="las la-cart-arrow-down"></i> pedido';
                                  _btnPedido._carrito  = JSON.parse(v.resultado.datos[oop].pedido);
                                  _btnPedido.addEventListener('click',function(){

                                    _e.d.modal_interna_vinos.classList.add('active');
                                    $__inserta_ecommerce_maquetado_historial(this._carrito, '__lista_vinos_body','horizontal');

                                  },false);

                              _btnEstadoContenedor.appendChild(_btnPedido);


                              if(v.resultado.datos[oop].fecha_sistema_creado != 4)
                              {
                                var _btnWhats = $r.create('a');
                                    _btnWhats.classList.add('btn','btn-link');
                                    _btnWhats.innerHTML = '<i class="lab la-whatsapp"></i> Consultar';
                              }

                            _divTitleCont.appendChild(_btnEstadoContenedor);
                            _e.d.__carga_pedidos_generales.appendChild(_divTitle);
                            _e.d.__carga_pedidos_generales.appendChild(_divDivider);

                        }
                      }
                      else
                        _e.d.__carga_pedidos_generales.innerHTML = '<span class="alerta_de_vacio"> Todavía no tiene pedidos realizados </span>'; 
                    }
                    else
                        _e.d.__carga_pedidos_generales.innerHTML = '<span class="alerta_de_vacio"> Todavía no tiene pedidos realizados </span>'; 
                  }
              };
    $r.ajax2(_obd);

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
        var _dp = $r.select('div[data-panel]');
        for (var ii = 0; ii < _dp.length; ii++)
        {
          _menu[ii].parentNode.classList.remove('active');
          _dp[ii].style.display = 'none';
        }

        $r.select('div[data-panel="'+this.getAttribute('href').split('#')[1]+'"]')[0].style.display = 'block';
        this.parentNode.classList.add('active');
      return false;
    }, false)
}
_menu = null;

var _volver = $r.select('span[data-volver]');
for (var i = 0; i < _volver.length; i++) 
  _volver[i].addEventListener('click', function(a) {location.href='home.html'; }, false);
_volver = null;


function $_lleva_a_estado(v)
{
  /* Paso 1 */
          _e.d._seguimiento_p1_fecha_tooltip.setAttribute('data-tooltip','');
          _e.d._seguimiento_p1_fecha_tooltip.classList.add('icon-lg','opacity-07');
          _e.d._seguimiento_p1_fecha_tooltip.innerHTML  = '<i class="las la-shopping-bag"></i>';
          _e.d._seguimiento_p1_fecha.innerHTML          = '';
          _e.d._seguimiento_p1_status.innerHTML         = '';

          /* Paso 2 */
          _e.d._seguimiento_p2_fecha_tooltip.setAttribute('data-tooltip','');
          _e.d._seguimiento_p2_fecha_tooltip.classList.add('icon-lg','opacity-07');
          _e.d._seguimiento_p2_fecha_tooltip.innerHTML  = '<i class="las la-truck-loading"></i>';
          _e.d._seguimiento_p2_fecha.innerHTML          = '';
          _e.d._seguimiento_p2_status.innerHTML         = '';

          /* Paso 3 */
          _e.d._seguimiento_p3_fecha_tooltip.setAttribute('data-tooltip','');
          _e.d._seguimiento_p3_fecha_tooltip.classList.add('icon-lg','opacity-07');
          _e.d._seguimiento_p3_fecha_tooltip.innerHTML = '<i class="las la-truck"></i>';
          _e.d._seguimiento_p3_fecha.innerHTML  = '';
          _e.d._seguimiento_p3_status.innerHTML = '';

          /* Paso 4 */
          _e.d._seguimiento_p4_fecha_tooltip.setAttribute('data-tooltip','');
          _e.d._seguimiento_p4_fecha_tooltip.classList.add('icon-lg','opacity-07');
          _e.d._seguimiento_p4_fecha_tooltip.classList.remove('icon-lg','bg-error');
          _e.d._seguimiento_p4_fecha_tooltip.innerHTML = '<i class="las la-gift"></i>';
          _e.d._seguimiento_p4_fecha.innerHTML  = '';
          _e.d._seguimiento_p4_status.innerHTML = '';
  if(v.aviso == true)
  {
    if(v.resultado.cantidad > 0)
    {
      for (var oop = 0; oop < v.resultado.datos.length; oop++) 
      {
        /* Estado pago con preparacion de envio */
        if( parseFloat(v.resultado.datos[oop].estado) == 0)
        {
          _e.d._seguimiento_p1_fecha_tooltip.setAttribute('data-tooltip','Pendiente de validación');
          _e.d._seguimiento_p1_fecha_tooltip.classList.remove('opacity-07');
          
          var _fecha_hora = v.resultado.datos[oop].fecha_sistema_creado.split(' ');
          var _fecha      =  _fecha_hora[0].split('-');

          _e.d._seguimiento_p1_fecha.innerHTML  = _fecha[2] +' '+ _fech[parseFloat(_fecha[1])] +' '+ _fecha[0] +' '+ _fecha_hora[1];
          _e.d._seguimiento_p1_status.innerHTML = 'Transacción aceptada, pendiente de verificación.';
        }
        else if (parseFloat(v.resultado.datos[oop].estado) == 11 || parseFloat(v.resultado.datos[oop].estado) == 1 || parseFloat(v.resultado.datos[oop].estado) == 2)
        {

          /* Paso 1 */
          _e.d._seguimiento_p1_fecha_tooltip.setAttribute('data-tooltip','Pago verificado');
          _e.d._seguimiento_p1_fecha_tooltip.classList.remove('icon-lg','opacity-07');
          _e.d._seguimiento_p1_fecha_tooltip.innerHTML = '';
          
          var _fecha_hora = v.resultado.datos[oop].fecha_sistema_creado.split(' ');
          var _fecha      =  _fecha_hora[0].split('-');

          _e.d._seguimiento_p1_fecha.innerHTML  = _fecha[2] +' '+ _fech[parseFloat(_fecha[1])] +' '+ _fecha[0] +' '+ _fecha_hora[1];
          _e.d._seguimiento_p1_status.innerHTML = 'Transacción aceptada.';

          /* Paso 2 */
          _e.d._seguimiento_p2_fecha_tooltip.setAttribute('data-tooltip','Preparando envio');
          _e.d._seguimiento_p2_fecha_tooltip.classList.remove('opacity-07');

          _e.d._seguimiento_p2_fecha.innerHTML  = 'Preparando envio';
          _e.d._seguimiento_p2_status.innerHTML = '';
        }
        else if (parseFloat(v.resultado.datos[oop].estado) == 3)
        {

          /* Paso 1 */
          _e.d._seguimiento_p1_fecha_tooltip.setAttribute('data-tooltip','Pago verificado');
          _e.d._seguimiento_p1_fecha_tooltip.classList.remove('icon-lg','opacity-07');
          _e.d._seguimiento_p1_fecha_tooltip.innerHTML = '';
          
          var _fecha_hora = v.resultado.datos[oop].fecha_sistema_creado.split(' ');
          var _fecha      =  _fecha_hora[0].split('-');

          _e.d._seguimiento_p1_fecha.innerHTML  = _fecha[2] +' '+ _fech[parseFloat(_fecha[1])] +' '+ _fecha[0] +' '+ _fecha_hora[1];
          _e.d._seguimiento_p1_status.innerHTML = 'Transacción aceptada.';

          /* Paso 2 */
          _e.d._seguimiento_p2_fecha_tooltip.setAttribute('data-tooltip','Pedido preparado');
          _e.d._seguimiento_p2_fecha_tooltip.classList.remove('icon-lg','opacity-07');
          _e.d._seguimiento_p2_fecha_tooltip.innerHTML = '';

          _e.d._seguimiento_p2_fecha.innerHTML  = 'Pedido preparado';
          _e.d._seguimiento_p2_status.innerHTML = '';

          /* Paso 3 */
          _e.d._seguimiento_p3_fecha_tooltip.setAttribute('data-tooltip','Pedido enviado');
          _e.d._seguimiento_p3_fecha_tooltip.classList.remove('opacity-07');

          _e.d._seguimiento_p3_fecha.innerHTML  = 'Pedido en viaje';
          _e.d._seguimiento_p3_status.innerHTML = '';

        }
        else if (parseFloat(v.resultado.datos[oop].estado) == 4)
        {

          /* Paso 1 */
          _e.d._seguimiento_p1_fecha_tooltip.setAttribute('data-tooltip','Pago verificado');
          _e.d._seguimiento_p1_fecha_tooltip.classList.remove('icon-lg','opacity-07');
          _e.d._seguimiento_p1_fecha_tooltip.innerHTML = '';
          
          var _fecha_hora = v.resultado.datos[oop].fecha_sistema_creado.split(' ');
          var _fecha      =  _fecha_hora[0].split('-');

          _e.d._seguimiento_p1_fecha.innerHTML  = _fecha[2] +' '+ _fech[parseFloat(_fecha[1])] +' '+ _fecha[0] +' '+ _fecha_hora[1];
          _e.d._seguimiento_p1_status.innerHTML = 'Transacción aceptada.';

          /* Paso 2 */
          _e.d._seguimiento_p2_fecha_tooltip.setAttribute('data-tooltip','Pedido preparado');
          _e.d._seguimiento_p2_fecha_tooltip.classList.remove('icon-lg','opacity-07');
          _e.d._seguimiento_p2_fecha_tooltip.innerHTML = '';

          _e.d._seguimiento_p2_fecha.innerHTML  = 'Pedido preparado';
          _e.d._seguimiento_p2_status.innerHTML = '';

          /* Paso 3 */
          _e.d._seguimiento_p3_fecha_tooltip.setAttribute('data-tooltip','Pedido enviado');
          _e.d._seguimiento_p3_fecha_tooltip.classList.remove('icon-lg','opacity-07');
          _e.d._seguimiento_p3_fecha_tooltip.innerHTML = '';

          _e.d._seguimiento_p3_fecha.innerHTML  = 'Pedido en viaje';
          _e.d._seguimiento_p3_status.innerHTML = '';

          /* Paso 4 */
          _e.d._seguimiento_p4_fecha_tooltip.setAttribute('data-tooltip','Pedido recibido');
          _e.d._seguimiento_p4_fecha_tooltip.classList.remove('icon-lg','opacity-07');
          _e.d._seguimiento_p4_fecha_tooltip.innerHTML = '';
          

          _e.d._seguimiento_p4_fecha.innerHTML  = 'Pedido recibido!';
          _e.d._seguimiento_p4_status.innerHTML = 'Ahora a disfrutar la compra <i class="lar la-heart"></i>';

        }
        else if (parseFloat(v.resultado.datos[oop].estado) == 5)
        {

          /* Paso 1 */
          _e.d._seguimiento_p1_fecha_tooltip.setAttribute('data-tooltip','Pago verificado');
          _e.d._seguimiento_p1_fecha_tooltip.classList.remove('icon-lg','opacity-07');
          _e.d._seguimiento_p1_fecha_tooltip.innerHTML = '';
          
          var _fecha_hora = v.resultado.datos[oop].fecha_sistema_creado.split(' ');
          var _fecha      =  _fecha_hora[0].split('-');

          _e.d._seguimiento_p1_fecha.innerHTML  = _fecha[2] +' '+ _fech[parseFloat(_fecha[1])] +' '+ _fecha[0] +' '+ _fecha_hora[1];
          _e.d._seguimiento_p1_status.innerHTML = 'Transacción aceptada.';

          /* Paso 2 */
          _e.d._seguimiento_p2_fecha_tooltip.setAttribute('data-tooltip','Pedido preparado');
          _e.d._seguimiento_p2_fecha_tooltip.classList.remove('icon-lg','opacity-07');
          _e.d._seguimiento_p2_fecha_tooltip.innerHTML = '';


          _e.d._seguimiento_p2_fecha.innerHTML  = 'Pedido preparado';
          _e.d._seguimiento_p2_status.innerHTML = '';

          /* Paso 3 */
          _e.d._seguimiento_p3_fecha_tooltip.setAttribute('data-tooltip','Pedido enviado');
          _e.d._seguimiento_p3_fecha_tooltip.classList.remove('icon-lg','opacity-07');
          _e.d._seguimiento_p3_fecha_tooltip.innerHTML = '';


          _e.d._seguimiento_p3_fecha.innerHTML  = 'Pedido en viaje';
          _e.d._seguimiento_p3_status.innerHTML = '';

          /* Paso 4 */
          _e.d._seguimiento_p4_fecha_tooltip.setAttribute('data-tooltip','Pedido no recibido');
          _e.d._seguimiento_p4_fecha_tooltip.classList.add('bg-error');


          _e.d._seguimiento_p4_fecha.innerHTML  = 'Pedido no recibido!';
          _e.d._seguimiento_p4_status.innerHTML = 'Pero no te preocupes.<br>Nos estaremos contactando para coordinar un próximo encuentro.';

        }

        _fecha_hora = null;
        _fecha      = null;
      }

      $r.select('a[href="#vinos"]')[0].click();
    } 
  };
}

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
