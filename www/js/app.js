if(_e.d.__card_noty_body)
{
  /*
    Agregamos el maquetado inicial
  */
  var _divTitle     = $r.create('div');
      _divTitle.classList.add('tile','tile-centered');
  var _divTitleIcon = $r.create('div');
      _divTitleIcon.classList.add('tile-icon','image-precarga')
  var _divTitleCont = $r.create('div');
      _divTitleCont.classList.add('tile-content','text-precarga');

    _divTitle.appendChild(_divTitleIcon);
    _divTitle.appendChild(_divTitleCont);

    /* Title icono */
    _divTitleIcon.innerHTML = '<div class="example-tile-icon"></div>';
    _divTitleCont.innerHTML = ' <p class="tile-title text-precarga-line"></p>\
                                <p class="tile-subtitle text-precarga-line"></p>';

  _e.d.__card_noty_body.innerHTML = '';
  _e.d.__card_noty_body.appendChild(_divTitle);


  var _obd =  {
              "url": $r.conf_ajax.absoluta+$r.conf_ajax.url.proceso, 
              "metodo": $r.conf_ajax.metodo.post, 
              "datos": "h=_trae_push_mios&_usr="+JSON.stringify($_valida_usuario()), 
              "recibe": function(v,b)
              {
                if(v.aviso == true)
                {
                  _e.d.__card_noty_body.innerHTML = '';
                  if(v.resultado.cantidad > 0)
                  {
                    for (var i = 0; i < v.resultado.datos.length; i++) 
                    {

                      if(v.resultado.datos[i].link.indexOf('.html') > -1)
                      {
                        var _divTitle     = $r.create('a');
                          if(v.resultado.datos[i].param != '')
                            _divTitle.setAttribute('href',v.resultado.datos[i].link+'?d='+v.resultado.datos[i].param);
                          else
                            _divTitle.setAttribute('href',v.resultado.datos[i].link);
                      }
                      else
                        var _divTitle     = $r.create('div');

                          _divTitle.classList.add('tile','tile-centered');
                      var _divTitleIcon = $r.create('div');
                          _divTitleIcon.classList.add('tile-icon')
                      var _divTitleCont = $r.create('div');
                          _divTitleCont.classList.add('tile-content');
                      var _divDivider   = $r.create('div');
                          _divDivider.classList.add('divider');

                        _divTitle.appendChild(_divTitleIcon);
                        _divTitle.appendChild(_divTitleCont);

                        var _visto ='';
                        if( parseFloat(v.resultado.datos[i].visto) == 0 )
                          _visto = 'text-bold';
                        /* Title icono */
                        _divTitleIcon.innerHTML = '<div class="example-tile-icon"><i class="'+v.resultado.datos[i].line_icon+' centered"></i></div>';
                        _divTitleCont.innerHTML = ' <p class="tile-title '+_visto+' text-left">'+v.resultado.datos[i].titulo+'</p>\
                                                    <p class="tile-subtitle text-left">'+v.resultado.datos[i].texto+'</p>';


                      _e.d.__card_noty_body.appendChild(_divTitle);
                      
                      if((i+1) < v.resultado.datos.length)
                        _e.d.__card_noty_body.appendChild(_divDivider);


                      _divTitle      = null;
                      _divTitleIcon  = null;
                      _divTitleCont  = null;
                      _visto         = null;
                    } // fin lde for 
                  }// fin del if
                  else
                  {
                    var _divTitle     = $r.create('div');
                        _divTitle.classList.add('tile','tile-centered');
                    var _divTitleIcon = $r.create('div');
                        _divTitleIcon.classList.add('tile-icon')
                    var _divTitleCont = $r.create('div');
                        _divTitleCont.classList.add('tile-content');

                      
                      _divTitle.appendChild(_divTitleCont);

                      /* Title icono */
                      _divTitleIcon.innerHTML = '<div class="example-tile-icon"></div>';
                      _divTitleCont.innerHTML = ' <p class="tile-title text-bold text-left">Todavía no hay notificaciones.</p>\
                                                  <p class="tile-subtitle text-left"></p>';

                    _e.d.__card_noty_body.innerHTML = '';
                    _e.d.__card_noty_body.appendChild(_divTitle);
                  }
                }
                else
                {
                  var _divTitle     = $r.create('div');
                        _divTitle.classList.add('tile','tile-centered');
                    var _divTitleIcon = $r.create('div');
                        _divTitleIcon.classList.add('tile-icon')
                    var _divTitleCont = $r.create('div');
                        _divTitleCont.classList.add('tile-content');

                      
                      _divTitle.appendChild(_divTitleCont);

                      /* Title icono */
                      _divTitleIcon.innerHTML = '<div class="example-tile-icon"></div>';
                      _divTitleCont.innerHTML = ' <p class="tile-title text-bold text-left">Todavía no hay notificaciones.</p>\
                                                  <p class="tile-subtitle text-left"></p>';

                    _e.d.__card_noty_body.innerHTML = '';
                    _e.d.__card_noty_body.appendChild(_divTitle);
                }
              }
          };
  $r.ajax2(_obd);


  _variables._usuario = $_valida_usuario();
  if(_variables._usuario == false)
    _variables._usuario = {"nombre":'Invitado'};

  _e.d._nombre_usuario_menu.innerHTML = _variables._usuario.nombre;
  _e.d._nombre_avatar_menu.setAttribute('data-initial',_variables._usuario.nombre.slice(0,2));


  var _buscador_function = function(a)
  {
    a.preventDefault();
      var _error = false;
      if( this.querySelector('input[name="buscador"]').value.trim().length < 2 )
      {
        this.querySelector('input[name="buscador"]').focus();
        _error = "Ingrese una palabra más larga" 
      }

      if(_error == false)
        location.href="resultados.html?q="+encodeURIComponent(this.querySelector('input[name="buscador"]').value.trim());
      else
        alert('<div class="toast toast-error"> <p>'+_error+'</p> </div>', 4000);

    return false;
  }
  var _buscadores = $r.select('form[data-buscador]');
  for (var jj = 0; jj < _buscadores.length; jj++) 
  {
    _buscadores[jj].addEventListener('submit',_buscador_function,false);
  }

  
}