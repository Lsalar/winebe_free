function $_hace_secciones(_url)
{

};

/*
	*
	*
	*@function: agregar producto de ecommerce
	*
	*
*/
function $__agrega_producto_a_ecommerce(a)
{
	a.stopPropagation();
	var _itemSel 	= this._datos;
	var _encontrado = false; // si no se encontro se agrega

	// verificamos si tenemos carrito creado.
	if(typeof _variables.carrito == 'undefined')
		_variables.carrito = new Array();

	if(_variables.carrito.length > 0)
	{
		for (var oo = 0; oo < _variables.carrito.length; oo++)
		{
			if(_variables.carrito[oo].id == _itemSel.id)
			{
				_variables.carrito[oo].cantidad = parseFloat(_variables.carrito[oo].cantidad) + 1;
				var __precio = parseFloat(_variables.carrito[oo].precio);
				
				if(parseFloat(_variables.carrito[oo].es_oferta) == 1)
				  __precio = parseFloat(_variables.carrito[oo].precio) - ((parseFloat(_variables.carrito[oo].precio) * parseFloat(_variables.carrito[oo].porcentaje_descuento)) / 100);
				
				_variables.carrito[oo].total 	= parseFloat(__precio) * parseFloat(_variables.carrito[oo].cantidad);
				_encontrado = true;

				alert('<div class="toast toast-success"> <p>Item agregado al carrito (x'+_variables.carrito[oo].cantidad+')</p> </div>', 4000);
				break;
			}
		}

	}

	if(_encontrado == false) // si no existe lo creamos
	{
		_itemSel.cantidad = 1; // cantidad
		_variables.carrito.push($__creaOI(_itemSel)); // creamos un objeto nuevo
		alert('<div class="toast toast-success"> <p>Item agregado al carrito</p> </div>', 4000);
	}

	$__actualizamos_carrito_local();
};
function $__suma_producto_a_ecommerce()
{
	if(parseFloat(_variables.vinoseleccionado.stock) > 0)
	{
		var _itemSel 	= _variables.vinoseleccionado;
			
			if($r.validacion.numero(parseFloat(_e.d.__cantidad_interna_cantidades.value)) === false)
			{
				_e.d.__cantidad_interna_cantidades.value = 0;
				alert('<div class="toast toast-error"> <p>Se encontro un error al cargar el item<br>intente nuevamente</p> </div>', 4000);
				return false;
			}
			_itemSel.cantidad = parseFloat(_e.d.__cantidad_interna_cantidades.value);

			if(_itemSel.cantidad <= 0)
			{
				_itemSel.cantidad = 0;
				if(_variables.carrito.length > 0)
				{
					for (var oo = 0; oo < _variables.carrito.length; oo++) 
					{
						if(_variables.carrito[oo].id == _itemSel.id)
						{
							_encontradopos = oo;
							break;
						}
					}

				}
				if(_itemSel.cantidad <=0)
				{
					_variables.carrito.splice(_encontradopos,1);
					alert('<div class="toast toast-error"> <p>Item eliminado del pedido</p> </div>', 2000);
					$__actualizamos_carrito_local();
					return false;
				}
			}
		
		var _encontrado 	= false; // si no se encontro se agrega
		var _encontradopos 	= 0; // si no se encontro se agrega

		// verificamos si tenemos carrito creado.
		if(typeof _variables.carrito == 'undefined')
			_variables.carrito = new Array();

		if(_variables.carrito.length > 0)
		{
			for (var oo = 0; oo < _variables.carrito.length; oo++) 
			{
				if(_variables.carrito[oo].id == _itemSel.id)
				{
					_variables.carrito[oo].cantidad = parseFloat(_itemSel.cantidad);

					var __precio = parseFloat(_variables.carrito[oo].precio);
				
					if(parseFloat(_variables.carrito[oo].es_oferta) == 1)
					  __precio = parseFloat(_variables.carrito[oo].precio) - ((parseFloat(_variables.carrito[oo].precio) * parseFloat(_variables.carrito[oo].porcentaje_descuento)) / 100);
					
					_variables.carrito[oo].total 	= parseFloat(__precio) * parseFloat(_variables.carrito[oo].cantidad);

					_encontradopos = oo;
					_encontrado = true;

					alert('<div class="toast toast-success"> <p>Item agregado al carrito (x'+_variables.carrito[oo].cantidad+')</p> </div>', 4000);
					break;
				}
			}

		}

		if(_encontrado == false) // si no existe lo creamos
		{
			_itemSel.cantidad = 1; // cantidad
			_variables.carrito.push($__creaOI(_itemSel)); // creamos un objeto nuevo
			alert('<div class="toast toast-success"> <p>Item agregado al carrito</p> </div>', 4000);

			if(typeof gtag != 'undefined')
    			gtag('event', 'Item', _itemSel);
		};


		$__actualizamos_carrito_local();
	}
	else
	{
		for (var oo = 0; oo < _variables.carrito.length; oo++) 
		{
			if(_variables.carrito[oo].id == _variables.vinoseleccionado.id)
			{
				_variables.carrito.splice(oo,1);
				$__actualizamos_carrito_local();
				break;
			}
		}
		alert('<div class="toast toast-error"> <p>Producto sin stock</p> </div>', 4000);
	}
};


function $__creaOI(_itemSel)
{
	var __precio = parseFloat(_itemSel.precio);			
	if(parseFloat(_itemSel.es_oferta) == 1)
		__precio = parseFloat(_itemSel.precio) - ((parseFloat(_itemSel.precio) * parseFloat(_itemSel.porcentaje_descuento)) / 100);
	
	return {  "precio":				parseFloat(_itemSel.precio),
		      "nombre":             _itemSel.nombre.match(/[a-zA-Z]+/g).join(' '),
		      "id":             	_itemSel.id,
		      "productor":        	_itemSel.productor,
		      "empresa":        	_itemSel.id_empresa,
		      "cantidad":       	parseFloat(_itemSel.cantidad),
		      "empresa":       		_itemSel.id_empresa,
		      "es_oferta":       	_itemSel.es_oferta,
		      "es_combo":       	_itemSel.es_combo,
		      "stock":       		_itemSel.stock,
		      "porcentaje_descuento":       	_itemSel.porcentaje_descuento,
		      "foto":       		_itemSel.foto,
		      "total":              (parseFloat(__precio) * parseFloat(_itemSel.cantidad))};
};


/*
	*
	*
	*@function: Valida el usuario al inicio de la app, para saber hacia donde redireccionar
	*
	*
*/
function $_valida_usuario()
{
	var $res = false;
	if($r.vls('__wnbusr') == true)
	{
	    var uprov = atob($r.tls('__wnbusr'));
	        uprov = JSON.parse(uprov);
	    
	    if(typeof uprov == 'object')
	    	if($r.validacion.numero(uprov.id) == true)
	    		$res = uprov;
	}
	
	return $res;
}

/*
	*
	*
	*@function: funcion que pone precarga previa y pasa a la siguiente sección
	*
	*
*/
function $_pasa_seccion(seccion, precarga = false)
{
	if(precarga == true)
	{
		setTimeout(function(seccion){
			location.href = seccion+'.html';
		},1000,seccion);
	}
	else
		location.href = seccion+'.html';
}

/*
	*
	*
	*@function: Inserta maquetado de ecommerce
	*
	*
*/
function $__inserta_ecommerce_maquetado(v, dnde, dise = 'vertical')
{
	switch(dise)
	{
		case "vertical":
			_e.d[dnde].innerHTML = '';
			for (var ii = 0; ii < v.resultado.productos.datos.length; ii++) 
	          {
	            var _swiperPasos = $r.create('div');
	                _swiperPasos.setAttribute('data-swiper-pasos','');
	                
	                _swiperPasos.setAttribute('data-filtro','');
	                
	                _swiperPasos.setAttribute('data-filtro-categoria',v.resultado.productos.datos[ii].categoria);
	                _swiperPasos.setAttribute('data-filtro-tipo',v.resultado.productos.datos[ii].tipo);
	                _swiperPasos.setAttribute('data-filtro-crianza',v.resultado.productos.datos[ii].crianza);
	                _swiperPasos.setAttribute('data-filtro-bulto',v.resultado.productos.datos[ii].es_combo);


	            var _card = $r.create('div');
	            
	            var _chip = 'oferta' 
	            var __precio = v.resultado.productos.datos[ii].precio;

	            var _chipC = '';
	           	
	           	var __texto_promo_visible = 'd-none';
	                if(v.resultado.productos.datos[ii].stock <= 0)
	                {
	                	_chip = 'sin stock';
	                  	_card.classList.add('sin-stock');
	                }
	                else if(parseFloat(v.resultado.productos.datos[ii].es_oferta) == 1)
	                {
	                	_chip = 'oferta';
	                  	_card.classList.add('off-promo');
	                  	__precio = parseFloat(v.resultado.productos.datos[ii].precio) - ((parseFloat(v.resultado.productos.datos[ii].precio) * parseFloat(v.resultado.productos.datos[ii].porcentaje_descuento)) / 100);
	                  	__texto_promo_visible = 'd-block';
	                }

	                if(parseFloat(v.resultado.productos.datos[ii].es_combo) == 1)
	                {
	                	_chipC = 'x bulto';
	                  	_card.classList.add('combo');
	                }

	                _card.classList.add('card');
	                _card.innerHTML = ' <div class="card-image centrada">\
		                					<span class="chip comuni-general">'+_chip+'</span>\
		                					<span class="chip xbulto">'+_chipC+'</span>\
		                                    <img loading="lazy" class="img-responsive img-fit-cover" src="'+ v.resultado.productos.datos[ii].foto +'" alt="'+ v.resultado.productos.datos[ii].nombre +'">\
	                                    </div>\
	                                    <div class="card-header">\
	                                      <div class="card-title h6 text-ellipsis">'+ v.resultado.productos.datos[ii].nombre +'</div>\
	                                      <div class="card-subtitle text-gray text-ellipsis">'+ v.resultado.productos.datos[ii].productor +'</div>\
	                                    </div>\
	                                    <div class="card-precio">\
	                                      <div class="width-100 card-title h5">$ '+ $r.precio(__precio,2,',','.') +'</div>\
	                                      <del class="width-100 h9 text-error '+ __texto_promo_visible+'">$ '+ $r.precio(v.resultado.productos.datos[ii].precio,2,',','.') +'</del>\
	                                    </div>';

	                _card._datos    = v.resultado.productos.datos[ii];
	                _card.addEventListener('click',function(){ _variables.vinoseleccionado = this._datos; },false);
	                _card.addEventListener('click',$__carga_info_interna_vino,false);

	            var _card_footer = $r.create('div');
	                _card_footer.classList.add('card-footer');

	                var _boton_carrito = $r.create('button');
	                    _boton_carrito.classList.add('btn','btn-primary', 'width-100');

	                    if(v.resultado.productos.datos[ii].stock <= 0)
	                      _boton_carrito.innerHTML  = '<i class="lar la-sad-cry"></i>';
	                    else
	                      _boton_carrito.innerHTML  = '<i class="las la-shopping-cart"></i> Agregar';

	                      // sumamos cantidad 1 como modelo inicial de pedido para cuando lo agregamos al carrito
	                      v.resultado.productos.datos[ii].cantidad = 1;
	                    
	                    _boton_carrito._datos     = v.resultado.productos.datos[ii];
	                    
	                    if(v.resultado.productos.datos[ii].stock <= 0)
	                    {
		                      _boton_carrito.addEventListener('click',function(a){
		                      	a.preventDefault();
		                      	a.stopPropagation();
		                      	alert('<div class="toast toast-error"> <p>Producto sin stock</p> </div>', 4000);
		                      },false);
	                    }
	                    else
	                    	_boton_carrito.addEventListener('click',$__agrega_producto_a_ecommerce,false);

	                var _boton_compartir = $r.create('button');
	                    _boton_compartir.classList.add('btn','btn-link', 'width-50');
	                    _boton_compartir.innerHTML = '<i class="las la-share"></i> share';

	                var _boton_ficha = $r.create('button');
	                    _boton_ficha.classList.add('btn','btn-link', 'width-100');
	                    _boton_ficha.innerHTML = 'ver detalle';
	                    _boton_ficha._datos    = v.resultado.productos.datos[ii];
	                    _boton_ficha.addEventListener('click',function(){ _variables.vinoseleccionado = this._datos; },false);
	                    _boton_ficha.addEventListener('click',$__carga_info_interna_vino,false);

	            _swiperPasos.appendChild(_card);
	              _card.appendChild(_card_footer);
	                _card_footer.appendChild(_boton_carrito);
	                // _card_footer.appendChild(_boton_compartir);
	                _card_footer.appendChild(_boton_ficha);

	            // renderizamos los elementos
	            _e.d[dnde].appendChild(_swiperPasos);
	            _swiperPasos = null;
	            _card = null;
	          }
		break;
		default:
			_e.d[dnde].innerHTML = '';
			for (var ii = 0; ii < v.resultado.productos.datos.length; ii++) 
			{
				/*<div class="tile">
                  
                </div>*/

				var _swiperPasos = $r.create('div');
	                _swiperPasos.setAttribute('data-swiper-pasos','');
	                
	                _swiperPasos.setAttribute('data-filtro','');
	                
	                _swiperPasos.setAttribute('data-filtro-categoria',v.resultado.productos.datos[ii].categoria);
	                _swiperPasos.setAttribute('data-filtro-tipo',v.resultado.productos.datos[ii].tipo);
	                _swiperPasos.setAttribute('data-filtro-crianza',v.resultado.productos.datos[ii].crianza);
	                _swiperPasos.setAttribute('data-filtro-bulto',v.resultado.productos.datos[ii].es_combo);

				var _card 		= $r.create('div');

				var _chip 		= 'oferta' 
				var _chipC 		= 'combo' 
				var __precio 	= v.resultado.productos.datos[ii].precio;
					
					var __texto_promo_visible = 'd-none';
				    if(v.resultado.productos.datos[ii].stock <= 0)
				    {
				    	_chip = 'sin stock';
				      	_card.classList.add('sin-stock');
				    }
				    else if(parseFloat(v.resultado.productos.datos[ii].es_oferta) == 1)
				    {
				    	_chip = 'oferta';
				      	_card.classList.add('off-promo');
				      	__precio = parseFloat(v.resultado.productos.datos[ii].precio) - ((parseFloat(v.resultado.productos.datos[ii].precio) * parseFloat(v.resultado.productos.datos[ii].porcentaje_descuento)) / 100);
				      	__texto_promo_visible = 'd-block';
				    }

				    if(parseFloat(v.resultado.productos.datos[ii].es_combo) == 1)
	                {
	                	_chipC = 'x bulto';
	                  	_card.classList.add('combo');
	                }

				    _card.classList.add('tile','tile-centered');
				    _card.innerHTML = ' <div class="tile-icon">\
				    						<span class="chip comuni-general">'+_chip+'</span>\
				    						<span class="chip xbulto">'+_chipC+'</span>\
						                    <figure class="figure"><img loading="lazy" class="img-responsive img-fit-cover" src="'+ v.resultado.productos.datos[ii].foto +'" alt="'+ v.resultado.productos.datos[ii].nombre +'">\</figure>\
						                </div>\
						                <div class="tile-content">\
						                    <p class="tile-title text-ellipsis">'+ v.resultado.productos.datos[ii].nombre +'</p>\
						                    <p class="tile-subtitle text-gray text-ellipsis">'+ v.resultado.productos.datos[ii].productor +'</p>\
											<div class="width-100 card-title text-left h5">$ '+ $r.precio(__precio,2,',','.') +'</div>\
											<del class="width-100 text-left h9 text-error '+ __texto_promo_visible+'">$ '+ $r.precio(v.resultado.productos.datos[ii].precio,2,',','.') +'</del>\
						                </div>';
					
					_card._datos    = v.resultado.productos.datos[ii];
	                _card.addEventListener('click',function(){ _variables.vinoseleccionado = this._datos; },false);
	                _card.addEventListener('click',$__carga_info_interna_vino,false);

				var _card_footer = $r.create('div');
				    _card_footer.classList.add('tile-action');

				    var _boton_carrito = $r.create('button');
				        _boton_carrito.classList.add('btn','btn-primary');

				        if(v.resultado.productos.datos[ii].stock <= 0)
				        {
				          _boton_carrito.innerHTML  = '<i class="lar la-sad-cry"></i>';
				        }
				        else
				          _boton_carrito.innerHTML  = '<i class="las la-plus"></i>';

				          // sumamos cantidad 1 como modelo inicial de pedido para cuando lo agregamos al carrito
				          v.resultado.productos.datos[ii].cantidad = 1;
				        
				        _boton_carrito._datos     = v.resultado.productos.datos[ii];

				        if(v.resultado.productos.datos[ii].stock <= 0)
				        {
				        	_boton_carrito.addEventListener('click',function(a){
				        		a.preventDefault();
				        		a.stopPropagation();
		                      	alert('<div class="toast toast-error"> <p>Producto sin stock</p> </div>', 4000);
		                      },false);
				        }
				        else
				        	_boton_carrito.addEventListener('click',$__agrega_producto_a_ecommerce,false);

				    var _boton_compartir = $r.create('button');
				        _boton_compartir.classList.add('btn','btn-link');
				        _boton_compartir.innerHTML = '<i class="las la-share"></i> share';

				    var _boton_ficha = $r.create('button');
				        _boton_ficha.classList.add('btn','btn-link');
				        _boton_ficha.innerHTML = '<i class="lar la-comment"></i>';
				        _boton_ficha._datos    = v.resultado.productos.datos[ii];
				        _boton_ficha.addEventListener('click',function(){ _variables.vinoseleccionado = this._datos; },false);
				        _boton_ficha.addEventListener('click',$__carga_info_interna_vino,false);

				_swiperPasos.appendChild(_card);
				  _card.appendChild(_card_footer);
				    _card_footer.appendChild(_boton_carrito);
				    // _card_footer.appendChild(_boton_compartir);
				    _card_footer.appendChild(_boton_ficha);

				// renderizamos los elementos
				_e.d[dnde].appendChild(_swiperPasos);
				_swiperPasos = null;
				_card = null;
			}
		break;
	}
};

function $__inserta_ecommerce_maquetado_historial(v, dnde, dise = 'vertical')
{
	var _totalContado = 0;
	  _e.d[dnde].innerHTML = '';
	  for (var ii = 0; ii < v.length; ii++) 
	  {
		var _swiperPasos = $r.create('div');
	        _swiperPasos.setAttribute('data-swiper-pasos','');

	    var _card     = $r.create('div');

	    var _chip     = 'oferta' 
	    var _chipC    = 'combo' 
	    var __precio  = v[ii].precio;
	      
	      var __texto_promo_visible = 'd-none';
	        if(v[ii].stock <= 0)
	        {
	          _chip = 'sin stock';
	            _card.classList.add('sin-stock');
	        }
	        else if(parseFloat(v[ii].es_oferta) == 1)
	        {
	          _chip = 'oferta';
	            _card.classList.add('off-promo');
	            __precio = parseFloat(v[ii].precio) - ((parseFloat(v[ii].precio) * parseFloat(v[ii].porcentaje_descuento)) / 100);
	            __texto_promo_visible = 'd-block';
	        }

	        if(parseFloat(v.resultado.productos.datos[ii].es_combo) == 1)
            {
            	_chipC = 'x bulto';
              	_card.classList.add('combo');
            }

	        _card.classList.add('tile','tile-centered');
	        _card.innerHTML = ' <div class="tile-icon">\
	                            <span class="chip comuni-general">'+_chip+'</span>\
	                            <span class="chip xbulto">'+_chipC+'</span>\
	                                    <figure class="figure"><img loading="lazy" class="img-responsive img-fit-cover" src="'+ v[ii].foto +'" alt="'+ v[ii].nombre +'">\</figure>\
	                                </div>\
	                                <div class="tile-content">\
	                                    <p class="tile-title text-ellipsis">'+ v[ii].nombre +'</p>\
	                                    <p class="tile-subtitle text-gray text-ellipsis">'+ v[ii].productor +'</p>\
	                                    <div class="width-100 card-title text-left h5">$ '+ $r.precio((__precio*v[ii].cantidad),2,',','.') +'</div>\
	                                    <i class="width-100 text-left h9 text-gray d-block">$ '+ $r.precio(v[ii].precio,2,',','.') +' (x'+v[ii].cantidad+')</i>\
	                            </div>';
	      
	      _card._datos    = v[ii];
	      _card.addEventListener('click',function(){ _variables.vinoseleccionado = this._datos; },false);
	      _card.addEventListener('click',$__carga_info_interna_vino_simple,false);

	    
	    _swiperPasos.appendChild(_card);
	    
	    // renderizamos los elementos
	    _e.d[dnde].appendChild(_swiperPasos);
	    _swiperPasos = null;
	    _card = null;

	    _totalContado = _totalContado + v[ii].total;
	}
}

function $__carga_info_interna_vino(a)
{
	a.stopPropagation();
	var __precio = parseFloat(this._datos.precio);
	var __encontrado = false;
	if(parseFloat(this._datos.es_oferta) == 1)
      	__precio = parseFloat(this._datos.precio) - ((parseFloat(this._datos.precio) * parseFloat(this._datos.porcentaje_descuento)) / 100);

    /*
		Verificamos si existe el producto y le sumamos las cantidades.
    */
    if(typeof _variables.carrito == 'undefined')
		_variables.carrito = new Array();

	if(_variables.carrito.length > 0)
	{
		for (var oo = 0; oo < _variables.carrito.length; oo++) 
		{
			if(_variables.carrito[oo].id == this._datos.id)
			{
				_e.d.__cantidad_interna_cantidades.value = parseFloat(_variables.carrito[oo].cantidad);
				__encontrado = true;
				break;
			}
		}
	}
	
	if(__encontrado == false)
		_e.d.__cantidad_interna_cantidades.value = 0


	/*
		Comenzamos a mostrar la informacion detallada
	*/
	_e.d.interna_vinos_precio.innerHTML 			= '$ ' + $r.precio(__precio,2,',','.'); 
	_e.d.interna_vinos_bodega.innerHTML 			= this._datos.productor;
	_e.d.interna_vinos_imagen.style.backgroundImage	= 'url('+this._datos.foto+')';
	_e.d.interna_vinos_vino.innerHTML 				= this._datos.nombre;
	_e.d.interna_vinos_icategoria.innerHTML 		= this._datos.categoria || '-';
	_e.d.interna_vinos_ivariedad.innerHTML 			= this._datos.variedad || '-';
	_e.d.interna_vinos_itemperatura.innerHTML 		= this._datos.temperatura || '-';
	_e.d.interna_vinos_icorte.innerHTML 			= this._datos.corte || '-';
	_e.d.interna_vinos_ilugarelaboracion.innerHTML 	= this._datos.lugar_elaboracion || '-';
	_e.d.interna_vinos_ialtura.innerHTML 			= this._datos.altura || '-';
	_e.d.interna_vinos_icrianza.innerHTML 			= this._datos.crianza || '-';
	_e.d.interna_vinos_iproductor.innerHTML 		= this._datos.productor || '-';
	_e.d.interna_vinos_ienvase.innerHTML 			= this._datos.id_envase || '-';
	_e.d.interna_vinos_ienologo.innerHTML 			= this._datos.enologo || '-';
	_e.d.interna_vinos_detalle.innerHTML 			= this._datos.descripcion || '-';

	_e.d.modal_interna_vinos.classList.add('active');
};

function $__carga_info_interna_vino_simple(a)
{
	a.stopPropagation();
	var __precio = parseFloat(this._datos.precio);
	var __encontrado = false;
	if(parseFloat(this._datos.es_oferta) == 1)
      	__precio = parseFloat(this._datos.precio) - ((parseFloat(this._datos.precio) * parseFloat(this._datos.porcentaje_descuento)) / 100);

    /*
		Verificamos si existe el producto y le sumamos las cantidades.
    */
    if(typeof _variables.carrito == 'undefined')
		_variables.carrito = new Array();

	if(_variables.carrito.length > 0)
	{
		for (var oo = 0; oo < _variables.carrito.length; oo++) 
		{
			if(_variables.carrito[oo].id == this._datos.id)
			{
				_e.d.__cantidad_interna_cantidades.value = parseFloat(_variables.carrito[oo].cantidad);
				__encontrado = true;
				break;
			}
		}
	}
	
	if(__encontrado == false)
		_e.d.__cantidad_interna_cantidades.value = 0


	/*
		Comenzamos a mostrar la informacion detallada
	*/
	_e.d.interna_vinos_precio.innerHTML 			= '$ ' + $r.precio(__precio,2,',','.'); 
	_e.d.interna_vinos_bodega.innerHTML 			= this._datos.productor;
	_e.d.interna_vinos_imagen.style.backgroundImage	= 'url('+this._datos.foto+')';
	_e.d.interna_vinos_vino.innerHTML 				= this._datos.nombre;

	_e.d.modal_interna_vinos.classList.add('active');
};


function $__actualizamos_carrito_local()
{
	$r.cls('ZWNvbW1lcmNld2luZWJl', JSON.stringify(_variables.carrito));
	$__verificamos_carrito_local();
};
function $__verificamos_carrito_local()
{
	var _apto = false;

	if($r.vls('ZWNvbW1lcmNld2luZWJl'))
	{
		if(typeof JSON.parse($r.tls('ZWNvbW1lcmNld2luZWJl')) == 'object')
		{
			var _carrito = JSON.parse($r.tls('ZWNvbW1lcmNld2luZWJl'));
			/* Buscamos carritos menues que tengan opcion de medalla */
			var _badge = $r.select('span[data-ver-carrito]');
			if(_carrito.length > 0)
			{
					_apto = true;
				var _cantidad = 0;
				/* obtenemos las cantidades reales */
				if(_carrito.length > 0)
					for (var oo = 0; oo < _carrito.length; oo++) 
						_cantidad = parseFloat(_cantidad) + parseFloat(_carrito[oo].cantidad);

				for (var i = 0; i < _badge.length; i++) 
				{
					_badge[i].classList.add('badge');
					_badge[i].setAttribute('data-badge', _cantidad);
				}
			}
			else
			{
				for (var i = 0; i < _badge.length; i++) 
				{
					_badge[i].classList.remove('badge');
					_badge[i].removeAttribute('data-badge');
				}	
			}
		}
	}

	return _apto;
};

/*
	Agrega funcion carrito
*/
function $__carga_evento_carrito()
{
	var _carrito = $r.select('span[data-ver-carrito]');
		for (var i = 0; i < _carrito.length; i++)
			_carrito[i].addEventListener('click', function(){ location.href='carrito.html'; }, false);
	_carrito = null;
}





function $_acomoda_datos_usuario_en_forms()
{
	_variables._usuario = $_valida_usuario();
	if(_variables._usuario != false)
	{
		_e.d.nombre_apellido.value	= _variables._usuario.nombre;
		_e.d.dni.value	 			= _variables._usuario.dni;
		_e.d.personal_email.value	= _variables._usuario.email;

		_e.d.cardholderName.value	= _variables._usuario.nombre;
		_e.d.docNumber.value	 	= _variables._usuario.dni;
		_e.d.email.value			= _variables._usuario.email;

		_e.d.transferencia_nombre_apellido.value	= _variables._usuario.nombre;
		_e.d.transferencia_dni.value	 			= _variables._usuario.dni;
		_e.d.transferencia_email.value				= _variables._usuario.email;
	}
}