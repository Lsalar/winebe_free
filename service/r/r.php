<?php
	/* Clase de LfPHP para hacer conexion y consultas */
	@include('define.rd');
	class rei
	{
		const SALT	=	'xxxxxxxx!';
		const VALD	=	['SELECT','UPDATE','INSERT','DELETE'];
/*
	****************
	*****
		* Clases de Base de datos
	*****
	****************
*/
		public function conectar($conn = __conector__)
		{ 
			$con = json_decode($conn);
			if($con->con != "")
			{
				$connect = mysqli_connect($con->con, $con->usuario, $con->clave, $con->base);
				if(!$connect)
					header("Location: ".__url_sin_internet__);
				else
					return $connect;
			}
			else
				header("Location: ".__url_sin_internet__);
		}
		
		public function QRY($c, $sql = '', $ultima_consulta = 0, $debug = 0)
		{
			$re['estado'] = false;
			$sql = trim($sql);
			if($sql != '')
			{
				$pattern = '/^(SELECT|HASH|UPDATE|INSERT|WITH|DELETE)[\s\S]+?\s*?$/';
				preg_match($pattern, $sql, $mtch);
				if(count($mtch)>0)
				{
					if( in_array(strtoupper($mtch[1]), self::VALD) )
					{
						switch (strtoupper($mtch[1])) {
							case 'SELECT':
								$res 			= 	@mysqli_query($c, $sql);
								if(!$res)
									$re['estado'] 		= false;
								else
								{
									$cant 			= @mysqli_num_rows($res);
									$re['cantidad'] = $cant;
									for ($i=0; $i<$cant; $i++)
										$re['datos'][$i] = @mysqli_fetch_array($res, MYSQLI_ASSOC);

									$re['estado'] 		= true;
								}

								$re['afectadas'] 	= $c->affected_rows;
								$re['error'] 		= $c->error;
							break;
							case 'INSERT':
							case 'UPDATE':
								$res 	= @mysqli_query($c, $sql);
								$re['afectadas'] = $c->affected_rows;
								if(strtoupper($mtch[1]) == 'INSERT')
									$re['ultimo_id'] = @mysqli_insert_id($c);
								
								$re['error'] 	= $c->error;
								$re['estado']	= (!$res) ? false :  true;
							break;

							case 'HASH':
								$re['res'] = SELF::encrypta($sql);
							break;
							default:
								$re['estado'] = 'No se identifico una sentencia SQL valida, para eliminar un campo de la base, utilice el update  neko.';
							break;
						}
					}
					else
						$re['estado'] = 'Error de consulta al validar la query';
				}
				else
					$re['estado'] = 'Error de consulta, verifique el formato de la query';
			}

			if($debug == 1 && gettype($re) == 'array')
			{
				$re['debug']['sql'] 		= $sql;
				$re['debug']['match']		= $mtch;
			}
			
			if($ultima_consulta == 1)
				SELF::cerrarConexion($c);
			
			return $re;
		}

		public function traeDatos($res, $modelo = MYSQLI_ASSOC)
		{
			return @mysqli_fetch_array($res, $modelo);
		}
		public function cerrarConexion($c)
		{
			return @mysqli_close($c);
		}
		public function ultimo_id($c)
		{
			return @mysqli_insert_id($c);
		}

/*
	****************
	*****
		* Clases de variables generales y DB
	*****
	****************
*/
		public function proyecto()
		{
			return __proyecto__;
		}
		public function cantidadDeDatos($res)
		{
			return @mysqli_num_rows($res);
		}

		public function datosTotales()
		{
			return $this->total_consultas; 
		}

/*
	****************
	*****
		* Clases de validaciones y encriptaciones
	*****
	****************
*/
	    public static function encrypta($password) {
	        return hash('sha512', self::SALT . $password);
	    }
	    public static function verifica($password, $hash) {
	        return ($hash == self::encrypta($password));
	    }

/*
	****************
	*****
		* Verificaciones y seguridad
	*****
	****************
*/
	    public function verifica_cabeceras($cabecera)
	    {
	    	// verificamos la cabecera
	    	$seguro['rd'] = false;
	    	$seguro['gr'] = false;
			foreach ( $cabecera as $nombre => $valor) 
			{
				// verificamos si tiene RD Seguridad
				if(strtolower($nombre) == 'rdigitalseg')
				{
					if($valor == base64_encode('RdigitalWinebe'))
						$seguro['rd'] = true;
				}
				
				// verificamos si grulla tiene seguridad
				if($nombre == 'GrullaUsrSeg')
				{
					$seguro['gr'] = true;
					$seguro['grhash'] = $valor;
				}

				if($nombre == 'GrullaUsrTkn')
				{
					$seguro['us'] = true;
					$seguro['ushash'] = $valor;
				}

			}
			return $seguro;
	    }

	    public function verifica_tablas($tabla, $sql)
	    {
	    	// confiamos que tenemos datos de usuarios.
			$arrTablas		= explode(',', $tabla);
			$tienePermiso	= false;
			$r['error']		= true;
			
			// verificamos la cantidad de tablas disponibles.
			if(count($arrTablas)>0)
			{
				for ($artc=0; $artc < count($arrTablas); $artc++)
				{
				    if(preg_match("/(".$arrTablas[$artc].")+/i",$sql))
				    {
					    $tienePermiso	= true;
					    $r['error']		= false;
						$r['aviso']		= true;
					    break;
				    }
				}
			}
			
			if($tienePermiso == false)
			{
				$r['error'] = true;
				$r['aviso'] = 'El usuario no tiene permisos de tablas.';
			}

			unset($arrTablas);
			unset($tienePermiso);
			return $r;
	    }

	    public function verifica_usos($uso, $sql)
	    {
	    	// confiamos que tenemos datos de usuarios.

			switch (intval($uso)) 
			{
				case 1:
					if(preg_match("/(insert)+/i",$sql))
						return false;
					elseif(preg_match("/(update)+/i",$sql))
						return false;
					elseif(preg_match("/(delete)+/i",$sql))
						return false;
					elseif(preg_match("/(drop)+/i",$sql))
						return false;
					elseif(preg_match("/(truncate)+/i",$sql))
						return false;
				break;
				case 2:
					if(preg_match("/(update)+/i",$sql))
						return false;
					elseif(preg_match("/(delete)+/i",$sql))
						return false;
					elseif(preg_match("/(drop)+/i",$sql))
						return false;
					elseif(preg_match("/(truncate)+/i",$sql))
						return false;
				break;
				case 3:
					if(preg_match("/(delete)+/i",$sql))
						return false;
					elseif(preg_match("/(drop)+/i",$sql))
						return false;
					elseif(preg_match("/(truncate)+/i",$sql))
						return false;
				break;
				case 4:
					if(preg_match("/(drop)+/i",$sql))
						return false;
					elseif(preg_match("/(truncate)+/i",$sql))
						return false;
				break;
				default:
					return false;
				break;
			}
			
			return true;
	    }

	}
?>