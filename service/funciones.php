<?php
	header('Access-Control-Allow-Origin: *');
	require_once 'vendor/autoload.php'; // You have to require the library from your Composer vendor folder
    
	// @ini_set('display_errors', 1);
	// @ini_set('display_startup_errors', 1);
	// @error_reporting(E_ALL);

	// incluimos el grulla SDK
	@include('cnn.php');
	
	/* Comienza la programacion comun */
	$h 			= (isset($_POST['h'])) ? $_POST['h'] : false;
	
	$SEGURA		= $rd::verifica_cabeceras(getallheaders());
	$r['aviso'] = false;
	$r['error'] = true;
	$dpost 		= $_POST;	
	$debug 		= 1;
	// La seguridad por parte de RD
	if($SEGURA['rd'] == true )
	{}
	
	{
		function crea_notificacion($c, $rd, $ardatos)
		{
			$sql = 'INSERT INTO `_winebe_notificaciones` (`titulo`, `texto`, `line_icon`, `visto`, `link`, `param`, `dni_usuario`) 
					VALUES 
						("'.$ardatos['titulo'].'",
						 "'.$ardatos['texto'].'",
						 "'.$ardatos['line_icon'].'",
						 0,
						 "'.$ardatos['link'].'",
						 "'.$ardatos['param'].'",
						 '.$ardatos['dni_usuario'].');';
			return $rd::QRY($c,$sql,0,0);
		};

	}

	if($h != false)
	{
		switch ($h) 
		{
			case '__logout':
				session_destroy();
			break;
			case '__ingresa_login':
				
			break;
			
			case '__trae_destacados_home':
				$c = $rd::conectar();
				if($c)
				{
					// traemos los datos generales destacados
					$sql = 'SELECT * FROM _winebe_productos WHERE id IN (SELECT id_vino_empresa FROM _winebe_vinos_destacados WHERE habilitado = 1 ORDER BY id_empresa ASC)';
					$res = $rd::QRY($c,$sql,0,$debug);
					if($res['estado'] == true)
					{
						$r['aviso'] = true;
						$r['error'] = false;
						$r['resultado']['productos'] = $res;
					}


					// traemos los datos generales destacados
					$sql = 'SELECT * FROM _winebe_empresas WHERE id IN (SELECT id_empresa FROM _winebe_empresas_recomendadas WHERE habilitado = 1 ORDER BY orden ASC)';
					$res = $rd::QRY($c,$sql,0,$debug);
					if($res['estado'] == true)
					{
						$r['aviso'] = true;
						$r['error'] = false;
						$r['resultado']['bodegas'] = $res;
					}
				}
			break;

			case '__trae_empresa_elegida':
				$c 	= $rd::conectar();
				$id = floatval(base64_decode($_POST['id']));
				if($c)
				{
					// traemos los datos generales destacados
					$sql = 'SELECT * FROM _winebe_productos WHERE id_empresa = '.$id.' AND habilitado = 1 ORDER BY nombre ASC, precio ASC, stock DESC;';
					$res = $rd::QRY($c,$sql,0,$debug);
					if($res['estado'] == true)
					{
						$r['aviso'] = true;
						$r['error'] = false;
						$r['resultado']['productos'] = $res;
					}


					// traemos los datos generales destacados
					$sql = 'SELECT * FROM _winebe_empresas WHERE id = '.$id.' LIMIT 0,1';
					$res = $rd::QRY($c,$sql,0,$debug);
					if($res['estado'] == true)
					{
						$r['aviso'] = true;
						$r['error'] = false;
						$r['resultado']['bodegas'] = $res;
					}
				}
			break;

			case '__trae_metodo_de_pago':
				$c 	= $rd::conectar();
				$id = floatval(base64_decode($_POST['id']));
				if($c)
				{
					// traemos los datos generales destacados
					$sql = 'SELECT * FROM _winebe_formas_pagos WHERE id_empresa = '.$id;
					$res = $rd::QRY($c,$sql,0,$debug);
					if($res['estado'] == true)
					{
						$r['aviso'] = true;
						$r['error'] = false;
						$r['resultado'] = $res;
					}
				}
			break;

			case '_registra_usuario':
				{
					$nombre_apellido	= addslashes($_POST['login_basico_nombre_apellido']);
					$email				= addslashes($_POST['login_basico_email']);
					$edad				= addslashes($_POST['login_basico_edad']);
					$dni				= floatval($_POST['login_basico_dni']);
				}

				// hacemos registro de usuario si el DNI no existe en la base 
				$c 	= $rd::conectar();
				if($c)
				{
					$idLoginUsuario = 0; // si es ceo significa que no esta detectado el usuario
					// traemos los datos generales destacados
					$sql = 'SELECT * FROM _winebe_usuario WHERE documento = '.$dni.' LIMIT 0,1';
					$res = $rd::QRY($c,$sql,0,$debug);
					if($res['estado'] == 1)
					{
						if($res['cantidad'] == 0)
						{
							$sql = 'INSERT INTO `_winebe_usuario` 
										(`id_login`, `via_logueo`, `foto`, `nombre`, `apellido`, `fecha_nacimiento`, `documento`, `email`, `telefono`, `wsp`, `id_device`, `habilitado`, `mayor_18`, `b`, `c`) 
									VALUES (
										'.floatval(date('su')).', 
										1,
										"-",
										"'.$nombre_apellido.'",
										" ",
										"'.$edad.'",
										"'.$dni.'",
										"'.$email.'",
										"0",
										"-",
										"mobile",
										1,
										1,
										"'.date('Y-m-d H:i:s').'",
										"-");';
							$res = $rd::QRY($c,$sql,0,$debug);
							
							$idLoginUsuario = $res['ultimo_id'];
						}
						else
							$idLoginUsuario = $res['datos'][0]->id;
					}
				}
			break;

			case '_genera_pedido':
				// Validamos del lado del php los datos del usuario
				{					
				    $tipo				=	floatval($dpost['tipo']); 				// => 1
				    $usuario_asoc_dni	= 	json_decode($dpost['_usr'])->dni;
				    $usuario_asoc_mail	= 	json_decode($dpost['_usr'])->email;
				    $cod				= 	addslashes($dpost['_desc']);

				    if($tipo == 1)
				    {
					    $piso				=	addslashes($dpost['piso']); 				// => 
					    $cp					=	addslashes($dpost['cp']); 				// => 1419
					    $altura				=	floatval($dpost['altura']); 			// => 5455
					    $calle				=	addslashes($dpost['calle']); 			// => Artigas 5255
					    $personal_celular	=	floatval($dpost['personal_celular']); 	// => 33435008
					    $personal_email		=	addslashes($dpost['personal_email']); 	// => leandro@reiatsu.com.ar
					    $dni				=	floatval($dpost['dni']); 				// => 33445566
					    $edad				=	addslashes($dpost['edad']); 				// => 1987-12-16
					    $nombre_apellido	=	addslashes($dpost['nombre_apellido']); 	// => Lean
				    }
				    else if($tipo == 2)
				    {
				    	$piso				=	addslashes($dpost['piso']); 				// => 
					    $cp					=	addslashes($dpost['cp_mp']); 				// => 1419
					    $altura				=	floatval($dpost['altura_mp']); 			// => 5455
					    $calle				=	addslashes($dpost['calle_mp']); 			// => Artigas 5255
					    $personal_celular	=	'000'; 	// => 33435008
					    $personal_email		=	addslashes($dpost['email']); 	// => leandro@reiatsu.com.ar
					    $dni				=	floatval($dpost['docNumber']); 				// => 33445566
					    $edad				=	'2020-00-00'; 				// => 1987-12-16
					    $nombre_apellido	=	addslashes($dpost['cardholderName']); 	// => Lean	
				    }
				    else if($tipo == 3)
				    {
				    	$piso				=	addslashes($dpost['transferencia_piso']); 				// => 
					    $cp					=	addslashes($dpost['transferencia_cp']); 				// => 1419
					    $altura				=	floatval($dpost['transferencia_altura']); 			// => 5455
					    $calle				=	addslashes($dpost['transferencia_calle']); 			// => Artigas 5255
					    $personal_celular	=	floatval($dpost['transferencia_personal_celular']); 	// => 33435008
					    $personal_email		=	addslashes($dpost['transferencia_personal_email']); 	// => leandro@reiatsu.com.ar
					    $dni				=	floatval($dpost['transferencia_dni']); 				// => 33445566
					    $edad				=	addslashes($dpost['transferencia_edad']); 				// => 1987-12-16
					    $nombre_apellido	=	addslashes($dpost['transferencia_nombre_apellido']); 	// => Lean
				    }
				    
				    $carrito			=	json_decode($dpost['carrito'],false); 			// => [{"precio":1700,"nombre":"Nicolas Catena Zapata","id":"2","productor":"Catena Zapata","cantidad":9,"empresa":"1","foto":"assets/internos/czapata.jpg","total":15300},{"precio":1700,"nombre":"Nicolas Catena Zapata","id":"3","productor":"Catena Zapata","cantidad":6,"empresa":"1","foto":"assets/internos/czapata.jpg","total":10200}]
					
					$r['tipo'] 			 = $tipo;
				}
				
				// verificamos el carrito de compras que este todo en orden.
				if(gettype($carrito) != 'array')
					$r['aviso'] = false;

				// hacemos registro de usuario si el DNI no existe en la base 
				$c 	= $rd::conectar();
				if($c)
				{
					// traemos el cupon de descuento en caso de encontrarse
					$discount = false;
					if($cod != '')
					{
						$sql = 'SELECT * FROM __codigos_descuentos 
								WHERE 
										codigo		= "'.$cod.'" AND
										disponible 	= 1 
										LIMIT 0,1';
						$res = $rd::QRY($c,$sql,0,$debug);
						if($res['estado'] == 1)
						{
							if($res['cantidad'] > 0)
							{
								$discount 				= $res['datos'][0];
								$carrito[0]->descuento 	= $discount;
								
								$dpost['carrito'] = json_encode($carrito,false);

								$sql = 'UPDATE __codigos_descuentos 
										SET disponible = 0
										WHERE 
												codigo		= "'.$discount['codigo'].'" AND 
												id			= '.$discount['id'];
								$res = $rd::QRY($c,$sql,0,$debug);
							}
						}
					}
					

					$idLoginUsuario = 0; // si es ceo significa que no esta detectado el usuario
					
					// traemos los datos generales destacados
					$sql = 'SELECT * FROM _winebe_usuario WHERE documento = '.$usuario_asoc_dni.' LIMIT 0,1';
					$res = $rd::QRY($c,$sql,0,$debug);
					if($res['estado'] == 1)
					{
						if($res['cantidad'] == 0)
						{
							$sql = 'INSERT INTO `_winebe_usuario` 
										(`id_login`, `via_logueo`, `foto`, `nombre`, `apellido`, `fecha_nacimiento`, `documento`, `email`, `telefono`, `wsp`, `id_device`, `habilitado`, `mayor_18`, `b`, `c`) 
									VALUES (
										0, 
										1,
										"-",
										"'.$nombre_apellido.'",
										" ",
										"'.$edad.'",
										"'.$dni.'",
										"'.$personal_email.'",
										"'.$personal_celular.'",
										"-",
										"mobile",
										1,
										1,
										"'.date('Y-m-d H:i:s').'",
										"-");';
							$res = $rd::QRY($c,$sql,0,$debug);
							
							$idLoginUsuario = $res['ultimo_id'];
						}
						else
							$idLoginUsuario = $res['datos'][0]->id;
					}
					
					// hacemos guardado de datos en pedidos con el tipo que corresponda.
					if($tipo == 1)
						$codigo = base64_encode(date('YmdHisu'));

					$sql = 'INSERT INTO `_winebe_transacciones` 
								(`nombre_completo`,
								 `fecha_nacimiento`,
								 `dni`,
								 `calle`,
								 `altura`,
								 `codigo_postal`,
								 `piso_nro`,
								 `tipo_transaccion`,
								 `nro_transaccion`,
								 `fecha_transaccion`,
								 `hora_transaccion`,
								 `email`,
								 `telefono`,
								 `id_usuario_login`,
								 `pedido`) 
							VALUES 
								(
								 "'.$nombre_apellido.'",
								 "'.$edad.'",
								 "'.$dni.'",
								 "'.$calle.'",
								 "'.$altura.'",
								 "'.$cp.'",
								 "'.$piso.'",
								 "'.$tipo.'",
								 "'.$codigo.'",
								 "'.date('Y-m-d').'",
								 "'.date('H:i:s').'",
								 "'.$personal_email.'",
								 "'.$personal_celular.'",
								 "'.$usuario_asoc_dni.'",
								 "'.addslashes($dpost['carrito']).'")';
							
					$guardado_carrito = $rd::QRY($c,$sql,0,$debug);

					$procesapago = false;
					if($guardado_carrito['estado'] == 1)
						if($guardado_carrito['afectadas'] == 1)
							$procesapago = true;
					
					// preparamos aviso de respuesta para el usuario correspondiente
					if($tipo == 2 && $procesapago == true)
					{
						// cargamo las dependencias de mp
						include('vendor/autoload.php');

						// datos de configuracion de mp
						$client_id 		= '1331932105048374';
						$access_token 	= 'APP_USR-1331932105048374-042919-cd7b42c2af3b9f12834ae67981694a26-7428978';
						// procesamos el pago de mercadopago.
						// Cargamos los items que se le van a aenviar a mercadopago y sumamos el total a cobrar
						$totalMP = 0;
						$totalCA = 0;
						
						// buscamos la informacion de los productos y pisamos los costos para evitar problemas de hackeos
						// traemos los datos generales destacados
						for ($i=0; $i < count($carrito); $i++) 
							$arrayProd[$i] = $carrito[$i]->id;
						
						$sql = 'SELECT id,precio FROM _winebe_productos WHERE id IN ('. implode(',', $arrayProd) .')';
						$acomodaPreProd = $rd::QRY($c,$sql,0,$debug);

						if($acomodaPreProd['estado'] == 1)
						{
							if($acomodaPreProd['cantidad'] > 0)
							{
								// bubleamos carrito
								for ($i=0; $i < count($carrito); $i++)
								{
									// bucleamos productos que encontramos del carrito
									for ($ii=0; $ii < $acomodaPreProd['cantidad']; $ii++)
									{
										if($acomodaPreProd['datos'][$ii]->id == $carrito[$i]->id)
										{
											$carrito[$i]->precio = $acomodaPreProd['datos'][$ii]->precio;
											$carrito[$i]->total = floatval($carrito[$i]->precio) * floatval($carrito[$i]->cantidad);
											break;
										};
									};
								};
							}
						}

						for ($i=0; $i < count($carrito); $i++) 
						{
							$productos[$i]["id"] 			= $carrito[$i]->id;
							$productos[$i]["title"] 		= $carrito[$i]->nombre;
							$productos[$i]["quantity"] 		= $carrito[$i]->cantidad;
							$productos[$i]["unit_price"] 	= $carrito[$i]->precio;

							$totalMP = $totalMP + $carrito[$i]->total;
							$totalCA = $totalCA + $carrito[$i]->cantidad;
						};

						// generamos el carrito de compra con los items
							$persona["first_name"] 					= $nombre_apellido;
						// realizamos el pago. 
						/* 
							* * * * * 
								MERCADOPAGO FUNCIONALIDAD 
							* * * * *
						*/

						// Datos de tarjeta enviados desde la consola.
							$monto 			= $totalMP;

							if($discount != false)
							{
								if(floatval($discount['tipo']) == 1)
									$aplicaDescuento = $totalMP * floatval($discount['descuento'])/100;
								else
									$aplicaDescuento = floatval($discount['descuento']);

								$monto = $totalMP - $aplicaDescuento;
							}

							$metodopago 	= trim(strip_tags($dpost["paymentMethodId"]));
							$email 			= trim(strip_tags($dpost["email"]));
							$card_token_id 	= $dpost["token"];


							// Construimos el array objeto de medio de pago para pasarle a MP
							$payment_data = array(
							    "token" => $card_token_id,
							    "installments" => intval($dpost['installments']),
							    "transaction_amount" =>floatval($monto),
							    "external_reference"=> "WB".date('Ymd'),
								"statement_descriptor"=>"Winebe desde App",
							    "description" => "[App] e-commerce",
							    "payment_method_id" => $metodopago,
							    "payer" => array ("email" => $email ),
							    "additional_info"=> array(
									"items" => $productos,
									"payer" => $persona
								)
							);
						// Ejecutamos el medio de pago
							$mp 		= new MP ($access_token);
							$payment 	= $mp->post("/v1/payments", $payment_data);
							
						    // Imprime el estado del pago
						    $r['mp']['aviso']  		= false;
							$r['mp']['response']  	= 'Error al procesar el pago';
							$r['mp']['id']			= 0;
						    
						    if($payment['response']['status'] == "approved")
							{
								$r['mp']['aviso']  		= true;
								$r['mp']['response']  	= $payment['response'];
								$r['mp']['id']			= $payment['response']['id'];

								// Hacemos una actualizacion de los datos que corresponden a la compra desde mercadopago
								if($procesapago == true)
								{
									$sql = 'UPDATE _winebe_transacciones SET 
												nro_transaccion = '.base64_encode($r['mp']['id']).',
												estado			= 11
											WHERE 
												dni = "'.$dni.'" AND
												id	= '.$guardado_carrito['ultimo_id'];
									$r['recong'] = $rd::QRY($c,$sql,0,$debug);

									$r['aviso'] = true;

									/*
										Envio de push internos
									*/
									$ardatos['titulo']			= 'Compra realizada';
									$ardatos['texto']			= 'El código de MercadoPago para su compra es: '.$r['mp']['id'];
									$ardatos['line_icon']		= 'las la-list-alt';
									$ardatos['link']			= 'pedidos.html';
									$ardatos['param']			= $codigo;
									$ardatos['dni_usuario']		= $usuario_asoc_dni;
									crea_notificacion($c,$rd,$ardatos);
								}
							}

							$r['mp']['rs'] = $payment['response']['status'];		
					}
					else if($tipo == 3)
					{
						// procesamos el aviso de transferencia bancaria.
						$r['aviso'] 		= true;
						$r['reservador'] 	= true;

						$sql = 'UPDATE _winebe_transacciones SET 
									nro_transaccion 	= "'.base64_encode($dpost['transferencia_transaccion']).'",
									fecha_transaccion 	= "'.$dpost['transferencia_fecha'].'",
									hora_transaccion 	= "'.$dpost['transferencia_hora'].'"
								WHERE 
									dni = "'.$dni.'" AND
									id	= '.$guardado_carrito['ultimo_id'];
						$r['recong'] = $rd::QRY($c,$sql,0,$debug);

						$r['aviso'] = true;

						/*
							Envio de push internos
						*/
						$ardatos['titulo']			= 'Pedido reservado';
						$ardatos['texto']			= 'El código de su pedido es: '.base64_decode($codigo);
						$ardatos['line_icon']		= 'las la-list-alt';
						$ardatos['link']			= 'pedidos.html';
						$ardatos['param']			= $codigo;
						$ardatos['dni_usuario']		= $usuario_asoc_dni;
						crea_notificacion($c,$rd,$ardatos);
					}
					else if($tipo == 1 && $procesapago == true)
					{
						$r['aviso'] 		= true;
						$r['reservador'] 	= true;

						/*
							Envio de push internos
						*/
						$ardatos['titulo']			= 'Pedido reservado';
						$ardatos['texto']			= 'El código de su pedido es: '.base64_decode($codigo);
						$ardatos['line_icon']		= 'las la-list-alt';
						$ardatos['link']			= 'pedidos.html';
						$ardatos['param']			= $codigo;
						$ardatos['dni_usuario']		= $usuario_asoc_dni;
						crea_notificacion($c,$rd,$ardatos);
					}
				}
			break;

			case '_trae_push_mios':
				$usuario_asoc_dni	= 	json_decode($dpost['_usr'])->dni;
				$usuario_asoc_mail	= 	json_decode($dpost['_usr'])->email;

				// hacemos registro de usuario si el DNI no existe en la base 
				$c 	= $rd::conectar();
				if($c)
				{
					$idLoginUsuario = 0; // si es ceo significa que no esta detectado el usuario
					// traemos los datos generales destacados
					$sql = 'SELECT * FROM _winebe_notificaciones WHERE dni_usuario = "'.$usuario_asoc_dni.'" ORDER BY visto ASC, id DESC LIMIT 0,20';
					$res = $rd::QRY($c,$sql,0,$debug);
					if($res['estado'] == 1)
					{
						if($res['cantidad'] > 0)
						{
							$r['aviso'] = true;
							$r['error'] = false;
							$r['resultado'] = $res;
						}
					}
				}
			break;

			case '__trae_info_pedido':
				$usuario_asoc_dni	= 	json_decode($dpost['_usr'])->dni;
				$usuario_asoc_mail	= 	json_decode($dpost['_usr'])->email;
				$id					=	addslashes($dpost['id']);
				// hacemos registro de usuario si el DNI no existe en la base 
				$c 	= $rd::conectar();
				if($c)
				{
					$idLoginUsuario = 0; // si es ceo significa que no esta detectado el usuario
					// traemos los datos generales destacados
					$sql = 'SELECT * FROM _winebe_transacciones WHERE id_usuario_login = "'.$usuario_asoc_dni.'" AND nro_transaccion = "'.base64_encode($id).'" LIMIT 0,1';
					$res = $rd::QRY($c,$sql,0,$debug);
					if($res['estado'] == 1)
					{
						if($res['cantidad'] > 0)
						{
							$r['aviso'] = true;
							$r['error'] = false;
							$r['resultado'] = $res;
						}
					}
				}
			break;

			case '__trae_bodegas':
				
				$c 	= $rd::conectar();
				if($c)
				{
					// traemos los datos generales destacados
					$sql = 'SELECT * FROM _winebe_empresas ORDER BY id ASC';
					$res = $rd::QRY($c,$sql,0,$debug);
					if($res['estado'] == 1)
					{
						if($res['cantidad'] > 0)
						{
							$r['aviso'] = true;
							$r['error'] = false;
							$r['resultado'] = $res;
						}
					}
				}
			break;

			case '__trae_bodegas_especificas':
				
				$c 	= $rd::conectar();
				if($c)
				{
					$bod = addslashes($_POST['bod']);
					// traemos los datos generales destacados
					$sql = 'SELECT * FROM _winebe_empresas WHERE id IN ('. $bod .') ORDER BY id ASC';
					$res = $rd::QRY($c,$sql,0,$debug);
					if($res['estado'] == 1)
					{
						if($res['cantidad'] > 0)
						{
							$r['aviso'] = true;
							$r['error'] = false;
							$r['resultado'] = $res;
						}
					}
				}
			break;

			case '__trae_info_pedidos':
				$usuario_asoc_dni	= 	json_decode($dpost['_usr'])->dni;
				$usuario_asoc_mail	= 	json_decode($dpost['_usr'])->email;
				// hacemos registro de usuario si el DNI no existe en la base 
				$c 	= $rd::conectar();
				if($c)
				{
					$idLoginUsuario = 0; // si es ceo significa que no esta detectado el usuario
					// traemos los datos generales destacados
					$sql = 'SELECT * FROM _winebe_transacciones WHERE id_usuario_login = "'.$usuario_asoc_dni.'" ORDER BY estado ASC, id DESC LIMIT 0,50';
					$res = $rd::QRY($c,$sql,0,$debug);
					if($res['estado'] == 1)
					{
						if($res['cantidad'] > 0)
						{
							$r['aviso'] = true;
							$r['error'] = false;
							$r['resultado'] = $res;
						}
					}
				}
			break;

			case "_desde_buscador":
				// hacemos registro de usuario si el DNI no existe en la base 
				$q	= addslashes(strip_tags($_POST['q']));
				$c 	= $rd::conectar();

				// inicializamos un filtro
				$idFiltrados[0] = 0;
				
				if($c)
				{
					$idLoginUsuario = 0; // si es ceo significa que no esta detectado el usuario
					// traemos los datos generales destacados
					$sql = 'SELECT * FROM _winebe_productos 
							WHERE 
								(
									nombre		= "'.$q.'" OR
									productor	= "'.$q.'" OR
									variedad	= "'.$q.'" OR
									crianza		= "'.$q.'" OR
									categoria	= "'.$q.'" OR
									temperatura	= "'.$q.'"
								) AND
								habilitado = 1 AND stock > 0
							ORDER BY nombre ASC';
					$res = $rd::QRY($c,$sql,0,$debug);
					if($res['estado'] == 1)
					{
						if($res['cantidad'] > 0)
						{
							$r['aviso'] = true;
							$r['error'] = false;
							$r['resultado']['productos'] = $res;

							for ($ll=0; $ll < count($res['datos']); $ll++)
								array_push($idFiltrados, $res['datos'][$ll]['id']);
						}
					}

					$sql = 'SELECT * FROM _winebe_productos 
							WHERE 
								(
									nombre		LIKE "%'.$q.'%" OR
									productor	LIKE "%'.$q.'%" OR
									variedad	LIKE "%'.$q.'%" OR
									crianza		LIKE "%'.$q.'%" OR
									corte		LIKE "%'.$q.'%" OR
									categoria	LIKE "%'.$q.'%" OR
									temperatura	LIKE "%'.$q.'%"
								) AND
								id NOT IN ('. implode(',', $idFiltrados) .') AND 
								habilitado = 1 AND 
								stock > 0
							ORDER BY nombre ASC';
					$res = $rd::QRY($c,$sql,0,$debug);
					if($res['estado'] == 1)
					{
						if($res['cantidad'] > 0)
						{
							$r['aviso'] = true;
							$r['error'] = false;
							
							if(isset($r['resultado']) != false)
								if( isset($r['resultado']['productos']) != false)
									for ($ll=0; $ll < count($res['datos']); $ll++) 
										array_push($r['resultado']['productos']['datos'],$res['datos'][$ll]);
							if(isset($r['resultado']) == false)
								$r['resultado']['productos'] = $res;
						}
					}

					// traemos los datos generales destacados
					$sql = 'SELECT * FROM _winebe_empresas WHERE nombre LIKE "%'.$q.'%"';
					$res = $rd::QRY($c,$sql,0,$debug);
					if($res['estado'] == true)
					{
						$r['aviso'] = true;
						$r['error'] = false;
						$r['resultado']['bodegas'] = $res;
					}

				}
			break;

			case "__verifica_cupon_desc":
				// hacemos registro de usuario si el DNI no existe en la base 
				$q	= addslashes(strip_tags($_POST['cod']));
				$c 	= $rd::conectar();

				if($c)
				{
					// traemos los datos generales destacados
					$sql = 'SELECT * FROM __codigos_descuentos 
							WHERE 
									codigo		= "'.$q.'" AND
									disponible 	= 1 
									LIMIT 0,1';
					$res = $rd::QRY($c,$sql,0,$debug);
					if($res['estado'] == 1)
					{
						if($res['cantidad'] > 0)
						{
							$r['aviso'] = true;
							$r['error'] = false;
							$r['resultado']= $res;
						}
					}
				}
			break;
			default:
				# code...
			break;
		}
	};
	echo json_encode($r);
?>