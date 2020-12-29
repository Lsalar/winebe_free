$r.dom();

if($__verificamos_carrito_local() == true)
  _variables.carrito = JSON.parse($r.tls('ZWNvbW1lcmNld2luZWJl'));

$__carga_evento_carrito();

if(location.href.indexOf('?q=') > -1)
{
  var _aBuscar = decodeURIComponent(location.href.split('?q=')[1]);
  if(_aBuscar.trim().length > 2 )
  {
    _e.d._intra_buscador.value = _aBuscar.trim();
    var _obd =  {
                    "url": $r.conf_ajax.absoluta+$r.conf_ajax.url.proceso, 
                    "metodo": $r.conf_ajax.metodo.post, 
                    "datos": "h=_desde_buscador&q="+_aBuscar,
                    "recibe": function(v,b)
                    {
                      _e.d._tab_items.querySelector('.badge').innerHTML = "Sin resultados para: <span class='text-bold'>" + _aBuscar + "</span>";
                      if(v.aviso == true)
                      {
                        if(typeof v.resultado.productos != 'undefined')
                        {
                          if(v.resultado.productos.datos.length > 0)
                          {
                            _e.d._tab_items.querySelector('.badge').setAttribute('data-badge',v.resultado.productos.datos.length);
                            $__inserta_ecommerce_maquetado(v, '_muestra_contenido_resultado_busqueda_items', 'horizontal');
                            _e.d._tab_items.querySelector('.badge').innerHTML = "Resultados para: <span class='text-bold'>" + _aBuscar + "</span>";

                            /* Completamos los datos para filtrar segun el resultado que llega */
                            var _filtradorC   = new Array();
                            var _filtradorT   = new Array();
                            var _filtradorCR  = new Array();
                            for (var jj = 0; jj < v.resultado.productos.datos.length; jj++) 
                            {
                              if(_filtradorC.indexOf(v.resultado.productos.datos[jj].categoria.trim()) == -1)
                              {
                                _filtradorC.push(v.resultado.productos.datos[jj].categoria.trim())
                                
                                var _option = $r.create('option');
                                    _option.value = v.resultado.productos.datos[jj].categoria.trim();
                                    _option.innerText = v.resultado.productos.datos[jj].categoria.trim();
                                _e.d._filtro_categoria.appendChild(_option);
                                    
                                    _option = null;
                              }

                              if(_filtradorT.indexOf(v.resultado.productos.datos[jj].tipo.trim()) == -1)
                              {
                                _filtradorT.push(v.resultado.productos.datos[jj].tipo.trim())
                                
                                var _option = $r.create('option');
                                    _option.value = v.resultado.productos.datos[jj].tipo.trim();
                                    _option.innerText = v.resultado.productos.datos[jj].tipo.trim();
                                _e.d._filtro_tipo.appendChild(_option);
                                    
                                    _option = null;
                              }

                              if(_filtradorCR.indexOf(v.resultado.productos.datos[jj].crianza.trim()) == -1)
                              {
                                _filtradorCR.push(v.resultado.productos.datos[jj].crianza.trim())
                                
                                var _option = $r.create('option');
                                    _option.value = v.resultado.productos.datos[jj].crianza.trim();
                                    _option.innerText = v.resultado.productos.datos[jj].crianza.trim();
                                _e.d._filtro_crianza.appendChild(_option);
                                    
                                    _option = null;
                              }

                            };

                          }
                          else
                          {
                            _e.d._muestra_contenido_resultado_busqueda_items.innerHTML = '<span class="alerta_de_vacio"> No se encontraron productos para esta busqueda </span>';
                          }
                        }
                        else
                        {
                            _e.d._muestra_contenido_resultado_busqueda_items.innerHTML = '<span class="alerta_de_vacio"> No se encontraron productos para esta busqueda </span>';
                        }

                        // if(typeof v.resultado.bodegas != 'undefined')
                        // {
                        //   if(v.resultado.bodegas.datos.length > 0)
                        //   {
                        //     _e.d._tab_empresas.querySelector('.badge').setAttribute('data-badge',v.resultado.productos.datos.length);
                        //   }
                        // }
                      }
                      else
                      {
                          _e.d._muestra_contenido_resultado_busqueda_items.innerHTML = '<span class="alerta_de_vacio"> No se encontraron productos para esta busqueda </span>';
                      }
                    }
                };
    $r.ajax2(_obd);

    if(typeof gtag != 'undefined')
      gtag('event', 'Buscador', {'palabra': _aBuscar});
  

    _func_filtrador = function(a)
    {
      if(document.getElementById('aviso_especial_filtro'))
        document.getElementById('aviso_especial_filtro').remove();
      var afil = _e.d._muestra_contenido_resultado_busqueda_items.querySelectorAll('div[data-filtro]');
      var afildisponibles = 0;
      var _encontrados = 0;


      if(_e.d._filtro_categoria.value != '-')
        afildisponibles ++;
      if(_e.d._filtro_tipo.value != '-')
        afildisponibles ++;
      if(_e.d._filtro_crianza.value != '-')
        afildisponibles ++;
      if(_e.d.filtro_escombo.checked == true)
        afildisponibles ++;

      for (var ooi = 0; ooi < afil.length; ooi++) 
      {
        var _tieneAlguno = 0;

        if( _e.d._filtro_categoria.value.toLowerCase().trim()  == afil[ooi].getAttribute('data-filtro-categoria').toLowerCase().trim() )
          _tieneAlguno++;
        if( _e.d._filtro_tipo.value.toLowerCase().trim()       == afil[ooi].getAttribute('data-filtro-tipo').toLowerCase().trim() )
          _tieneAlguno++;
        if( _e.d._filtro_crianza.value.toLowerCase().trim()    == afil[ooi].getAttribute('data-filtro-crianza').toLowerCase().trim() )
          _tieneAlguno++;

        if(_e.d.filtro_escombo.checked)
          if(afil[ooi].getAttribute('data-filtro-bulto') == 1)
            _tieneAlguno++;

        if(afildisponibles == _tieneAlguno)
        {
          _encontrados ++;
          afil[ooi].removeAttribute('style');
        }
        else
          afil[ooi].style.display = 'none';
      }

      if(_encontrados == 0)
      {
        var _aviso            = $r.create('span');
            _aviso.innerHTML  = 'No se encontraron productos para esta busqueda';
            _aviso.classList.add('alerta_de_vacio');
            _aviso.setAttribute('id','aviso_especial_filtro');

        _e.d._muestra_contenido_resultado_busqueda_items.appendChild(_aviso);
      }

      afil            = null;
      afildisponibles = null;
      _encontrados    = null;
    }

    _e.d._filtro_categoria.addEventListener('change',_func_filtrador,false);
    _e.d._filtro_tipo.addEventListener('change',_func_filtrador,false);
    _e.d._filtro_crianza.addEventListener('change',_func_filtrador,false);
    _e.d.filtro_escombo.addEventListener('change',_func_filtrador,false);
  }
}



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

/*
  Programacion para los modals
*/
var _modal = $r.select('.cerrar-modal');
for (var i = 0; i < _modal.length; i++) 
{
  _modal[i].addEventListener('click',function(a)
  {
    a.preventDefault();
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

        $r.select('div[data-step-finalizacion="'+this.getAttribute('href').split('#')[1]+'"]')[0].style.display = 'block';
        this.parentNode.classList.add('active');
      return false;
    }, false)
}
_menu = null;

var _volver = $r.select('span[data-volver]');
for (var i = 0; i < _volver.length; i++) 
  _volver[i].addEventListener('click', function(a) {history.go(-1); }, false);
_volver = null;