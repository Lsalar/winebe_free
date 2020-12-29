$r.dom();

if($__verificamos_carrito_local() == true)
  _variables.carrito = JSON.parse($r.tls('ZWNvbW1lcmNld2luZWJl'));

$__carga_evento_carrito();

var _obd =  {
                "url": $r.conf_ajax.absoluta+$r.conf_ajax.url.proceso, 
                "metodo": $r.conf_ajax.metodo.post, 
                "datos": "h=__trae_destacados_home", 
                "recibe": function(v,b)
                {
                  if(v.aviso == true)
                  {
                    if(v.resultado.productos.datos.length > 0)
                    {
                      $__inserta_ecommerce_maquetado(v, 'contenedor_home_swiper_vinos_recomendados');
                    }
                    // slide destacado de 
                    _variables.swiper_home = tns(
                      {
                        "container": _e.d.contenedor_home_swiper_vinos_recomendados,
                        "items": 2,
                        "gutter": 3,
                        "mouseDrag": true,
                        "swipeAngle": false,
                        "speed": 400,
                        "controls":false,
                        "prevButton":false,
                        "nextButton":false,
                        "nav":false,
                        "loop": false
                      }
                    );

                    /*
                      DESTACADOS BODEGAS
                    */
                    _e.d.contenedor_home_swiper_bodegas_recomendados.innerHTML = '';
                    if(v.resultado.bodegas.datos.length > 0)
                    {
                      for (var ii = 0; ii < v.resultado.bodegas.datos.length; ii++) 
                      {
                        var _swiperPasos = $r.create('div');
                            _swiperPasos.setAttribute('data-swiper-pasos','');

                        var _card = $r.create('div');
                            _card.classList.add('card');
                            _card.innerHTML = ' <div class="card-image">\
                                                  <img loading="lazy" class="img-responsive img-fit-cover" src="'+ v.resultado.bodegas.datos[ii].foto +'" alt="'+ v.resultado.bodegas.datos[ii].nombre +'">\
                                                </div>\
                                                <div class="card-header">\
                                                  <div class="card-title h6">'+ v.resultado.bodegas.datos[ii].nombre +'</div>\
                                                  <div class="card-subtitle text-gray">'+ v.resultado.bodegas.datos[ii].provincia_nombre +'</div>\
                                                </div>';

                        var _card_footer = $r.create('div');
                            _card_footer.classList.add('card-footer');

                            var _boton_carrito = $r.create('a');
                                _boton_carrito.setAttribute('href', 'empresa.html');
                                _boton_carrito.classList.add('btn', 'btn-primary');
                                _boton_carrito.innerHTML  = 'Ver ' + v.resultado.bodegas.datos[ii].tipo_empresa;
                                _boton_carrito._datos     = v.resultado.bodegas.datos[ii].id;
                                _boton_carrito._nombre    = v.resultado.bodegas.datos[ii].nombre;
                                _boton_carrito.addEventListener('click',function(a)
                                {
                                  a.preventDefault();
                                  if(typeof gtag != 'undefined')
                                    gtag('event', 'Empresa', {'id': this._datos,'nombre':this._nombre});
                                  
                                  location.href=this.getAttribute('href')+'?id='+btoa(this._datos);
                                },false);

                            var _boton_compartir = $r.create('button');
                                _boton_compartir.classList.add('btn','btn-link','float-right');
                                _boton_compartir.innerHTML = '<i class="las la-share"></i>';

                        _swiperPasos.appendChild(_card);
                          _card.appendChild(_card_footer);
                            _card_footer.appendChild(_boton_carrito);
                            _card_footer.appendChild(_boton_compartir);

                        // renderizamos los elementos
                        _e.d.contenedor_home_swiper_bodegas_recomendados.appendChild(_swiperPasos);
                        _swiperPasos = null;
                        _card = null;
                      }
                    }
                    // slide destacado de 
                    _variables.swiper_home = tns(
                      {
                        "container": _e.d.contenedor_home_swiper_bodegas_recomendados,
                        "items": 1,
                        "mouseDrag": true,
                        "swipeAngle": false,
                        "speed": 400,
                        "controls":false,
                        "prevButton":false,
                        "nextButton":false,
                        "nav":false
                      }
                    );
                  }

                  $r.precarga.remove();
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
  Programacion para desabilitar los forms
*/
var _form = $r.select('.deshabilitado');
for (var i = 0; i < _form.length; i++)
  _form[i].addEventListener('submit',function(a){a.preventDefault(); return false;},false);


/*
  Programacion para las sumas o restas
*/

_variables.tiempoSumaResta = 0;
_e.d.__suma_cantidad_carrito.addEventListener('click', function(){
  // sumamos o restamos producto del ecommerce
  clearTimeout(_variables.tiempoSumaResta);
  _e.d.__cantidad_interna_cantidades.value = parseFloat(_e.d.__cantidad_interna_cantidades.value) + 1;
  _variables.tiempoSumaResta = setTimeout(function(){$__suma_producto_a_ecommerce();},400)
}, false);

_e.d.__resta_cantidad_carrito.addEventListener('click', function(){
  // sumamos o restamos producto del ecommerce
  clearTimeout(_variables.tiempoSumaResta);
  _e.d.__cantidad_interna_cantidades.value = parseFloat(_e.d.__cantidad_interna_cantidades.value) - 1;
  if(_e.d.__cantidad_interna_cantidades.value <= 0)
    _e.d.__cantidad_interna_cantidades.value = 0;
  _variables.tiempoSumaResta = setTimeout(function(){$__suma_producto_a_ecommerce();},400)
}, false);