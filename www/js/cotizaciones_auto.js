var autoCoberturas;
//localStorage.removeItem('AUTO');

$(document).on('change', '#auto_aseguradora', function(){
	var id = $(this).val();
	var opt = '<option value="0">Seleccionar paquete...</option>';
	for(var i in autoCoberturas){
		if(autoCoberturas[i].Id_Aseguradora == id){
			opt += '<option value="' + autoCoberturas[i].Id_Plan + '">' + autoCoberturas[i].Plan + '</option>';
		}
	}
	//console.log(opt);
	$('#auto_cobertura').html(opt);
	if(id != 0){
		db.transaction(function(tx){
			$('#alertMsg').html('Actualizando Información...');
			$('#loader').css('display','block');
			var q = 'SELECT DISTINCT(c.Id_Zona), z.Nombre FROM AUTOS_Cotizador AS c, AUTOS_Zonas AS z WHERE c.Id_Zona = z.Id_Zona AND c.Id_Aseguradora = ' + id + ' ORDER BY z.Nombre';
			//console.log(q);
			tx.executeSql(q, [], function(tx, res){
				opt = '<option value="0">Seleccionar zona...</option>';
				for(var i = 0; i < res.rows.length; i++){
					opt += '<option value="' + res.rows.item(i).Id_Zona + '">' + res.rows.item(i).Nombre + '</option>';
				}
				$('#auto_zona').html(opt);
				$('#loader').css('display','none');
			});
		});
	}
	else{
		$('#auto_zona').html('<option value="0">Seleccionar zona...</option>');
		$('#auto_zona').change();
	}
});

$(document).on('change', '#auto_zona', function(){
	var idaseguradora = $('#auto_aseguradora').val();
	var id = $(this).val();
	if(id != 0){
		db.transaction(function(tx){
			$('#alertMsg').html('Actualizando Información...');
			$('#loader').css('display','block');
			var q = 'SELECT DISTINCT(c.Id_Marca), m.Nombre FROM AUTOS_Cotizador AS c, AUTOS_Marcas AS m WHERE c.Id_Marca = m.Id_Marca AND c.Id_Aseguradora = ' + idaseguradora + ' AND Id_Zona = ' + id + ' ORDER BY m.Nombre';
			tx.executeSql(q, [], function(tx, res){
				opt = '<option value="0">Seleccionar marca...</option>';
				for(var i = 0; i < res.rows.length; i++){
					opt += '<option value="' + res.rows.item(i).Id_Marca + '">' + res.rows.item(i).Nombre + '</option>';
				}
				$('#auto_marca').html(opt);
				$('#loader').css('display','none');
			});
		});
	}
	else{
		$('#auto_marca').html('<option value="0">Seleccionar marca...</option>');
		$('#auto_marca').change();
	}
});

$(document).on('change', '#auto_marca', function(){
	var idaseguradora = $('#auto_aseguradora').val();
	var idzona = $('#auto_zona').val();
	var id = $(this).val();
	if(id != 0){
		db.transaction(function(tx){
			$('#alertMsg').html('Actualizando Información...');
			$('#loader').css('display','block');
			var q = "SELECT DISTINCT(m.Id_Modelo), m.Nombre FROM AUTOS_Modelos AS m, AUTOS_Cotizador AS c ";
        	q += "WHERE c.Id_Modelo = m.Id_Modelo AND Id_Aseguradora = " + idaseguradora + " ";
			q += "AND Id_Zona = " + idzona + " AND Id_Marca = " + id + " ";
			q += "ORDER BY Nombre DESC";
			tx.executeSql(q, [], function(tx, res){
				opt = '<option value="0">Seleccionar modelo...</option>';
				for(var i = 0; i < res.rows.length; i++){
					opt += '<option value="' + res.rows.item(i).Id_Modelo + '">' + res.rows.item(i).Nombre + '</option>';
				}
				$('#auto_modelo').html(opt);
				$('#loader').css('display','none');
			});
		});
	}
	else{
		$('#auto_modelo').html('<option value="0">Seleccionar modelo...</option>');
		$('#auto_modelo').change();
	}
});

$(document).on('change', '#auto_modelo', function(){
	var idaseguradora = $('#auto_aseguradora').val();
	var idzona = $('#auto_zona').val();
	var idmarca = $('#auto_marca').val();
	var id = $(this).val();
	if(id != 0){
		db.transaction(function(tx){
			$('#alertMsg').html('Actualizando Información...');
			$('#loader').css('display','block');
			var q = 'SELECT DISTINCT(c.Id_Tipo), Nombre FROM AUTOS_Cotizador AS c, AUTOS_Tipos AS t WHERE c.Id_Tipo = t.Id_Tipo ';
			q += 'AND Id_Aseguradora = ' + idaseguradora + ' AND Id_Zona = ' + idzona + ' AND Id_Marca = ' + idmarca + ' ';
			q += 'AND Id_Modelo = ' + id + ' ORDER BY Nombre';
			tx.executeSql(q, [], function(tx, res){
				opt = '<option value="0">Seleccionar tipo...</option>';
				for(var i = 0; i < res.rows.length; i++){
					opt += '<option value=' + res.rows.item(i).Id_Tipo + '>' + res.rows.item(i).Nombre + '</option>';
				}
				$('#auto_tipo').html(opt);
				$('#auto_tipo').change();
				$('#loader').css('display','none');
			});
		});
	}
	else{
		$('#auto_tipo').html('<option value="0">Seleccionar tipo...</option>');
		$('#auto_tipo').change();
	}
});

$(document).on('change', '#auto_tipo', function(){
	var idaseguradora = $('#auto_aseguradora').val();
	var idzona = $('#auto_zona').val();
	var idmarca = $('#auto_marca').val();
	var idmodelo = $('#auto_modelo').val();
	var id = $(this).val();
	if(id != 0){
		db.transaction(function(tx){
			$('#alertMsg').html('Actualizando Información...');
			$('#loader').css('display','block');
			var q = 'SELECT Id_Cotizacion, Descripcion FROM AUTOS_Cotizador WHERE Id_Aseguradora = ' + idaseguradora
			q += ' AND Id_Zona = ' + idzona + ' AND Id_Marca = ' + idmarca + ' AND Id_Modelo = ' + idmodelo + ' AND Id_Tipo = ' + id + ' ORDER BY Descripcion';
			//console.log(q);
			tx.executeSql(q, [], function(tx, res){
				opt = '<option value="0">Seleccionar descripcion...</option>';
				for(var i = 0; i < res.rows.length; i++){
					opt += '<option value=' + res.rows.item(i).Id_Cotizacion + '>' + res.rows.item(i).Descripcion + '</option>';
				}
				$('#auto_descripcion').html(opt);
				$('#loader').css('display','none');
			});
		});
	}
	else{
		$('#auto_descripcion').html('<option value="0">Seleccionar descripcion...</option>');
	}
});

$(document).on('click', '#limpiarAuto', function(){
	localStorage.removeItem('AUTO');
	cotizaciones_auto();
});

function cotizaciones_auto(){
	$('#alertMsg').html('Cargando informaci&oacute;n');
	$('#loader').show();
	var html = '';
	html += '<div style="display:inline-block; width:100%;">';
	html += '<div style="float:left;">';
	html += '<h2>COTIZACI&Oacute;N NUEVA AUTO</h2>';
	html += '</div>';
	html += '<div id="wrapperBtnSimple">';
	html += '<div id="limpiarAuto" class="btnSimple">';
	html += '<img src="img/limpiar_w.png" />';
	html += '<a>LIMPIAR</a>';
	html += '</div>';
	html += '<div class="btnSimple">';
	html += '<img src="img/next_w.png" />';
	//html += '<a class="linkDB" href="cotizaciones_auto_resumen.html"></a>';
	html += '<a id="guardarCotizacionAuto" class="linkJS" href="cotizaciones_auto_resumen.html"></a>';
	html += '<a>SIGUIENTE</a>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '<div class="parrafo">';
	html += '<div style="background:#8fc6e8; padding:5px 10px;">';
	html += '<a style="font-weight:bold;">Informaci&oacute;n del asegurado</a>';
	html += '</div>';
	html += '<table cellspacing="0" cellpadding="5" style="width:100%;">';
	html += '<tr>';
	html += '<td style="width:25%;"><a>Nombre</a></td>';
	html += '<td><span><input type="text" id="nombre" class="formulario" /><input type="hidden" id="poliza"></span></td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td style="max-width:200px"><a>Edad</a></td>';
	html += '<td><span><input type="tel" class="txtedad formulario" id="auto_edad" inputmode="numeric" pattern="[0-9]*" /></span></td>';
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Aseguradora</a></td>';
	html += '<td>';
	html += '<select name="auto_aseguradora" id="auto_aseguradora">';
	html += '</select>';
	html += '</td>';	
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Zona</a></td>';
	html += '<td>';
	html += '<select name="auto_zona" id="auto_zona">';
	html += '<option value="0">Seleccionar zona...</option>';
	html += '</select>';
	html += '</td>';
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Marca</a></td>';
	html += '<td>';
	html += '<select name="auto_marca" id="auto_marca">';
	html += '<option value="0">Seleccionar marca...</option>';
	html += '</select>';
	html += '</td>';
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Modelo</a></td>';
	html += '<td>';
	html += '<select name="auto_modelo" id="auto_modelo">';
	html += '<option value="0">Seleccionar modelo...</option>';
	html += '</select>';
	html += '</td>';
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Tipo</a></td>';
	html += '<td>';
	html += '<select name="auto_tipo" id="auto_tipo">';
	html += '<option value="0">Seleccionar tipo...</option>';
	html += '</select>';
	html += '</td>';
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Descripci&oacute;n </a></td>';
	html += '<td>';
	html += '<select name="auto_descripcion" id="auto_descripcion">';
	html += '<option value="0">Seleccionar descripcion...</option>';
	html += '</select>';
	html += '</td>';
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Paquete</a></td>';
	html += '<td>';
	html += '<select name="auto_cobertura" id="auto_cobertura">';
	html += '</select>';
	html += '</td>';
	html += '</tr>';
	html += '</table>';
	html += '</div>';
	$('#content').html(html);
	db.transaction(function(tx){
		var q = "SELECT Id_Aseguradora, Nombre FROM AUTOS_Aseguradoras WHERE Activo = 'true' ORDER BY Nombre";
		//var q = "SELECT a.Id_Aseguradora, Nombre FROM AUTOS_Aseguradoras AS a, AUTOS_Cotizador AS c WHERE c.Id_Aseguradora = a.Id_Aseguradora AND a.Activo = 'true' GROUP BY a.Id_Aseguradora ORDER BY Nombre";
		tx.executeSql(q, [], function(tx, res){
			var len = res.rows.length;
			var opAse = '<option value="0">Seleccionar aseguradora...</option>';
        	for (var i=0; i<len; i++){
        		opAse += '<option value="' + res.rows.item(i).Id_Aseguradora + '">' + res.rows.item(i).Nombre + '</option>';
        	}
        	$('#auto_aseguradora').html(opAse);
        	var json = localStorage.getItem('AUTO');
        	if(json != null){
        		json = JSON.parse(json);
        		//console.log(json);
        		$('#nombre').val(json.nombre);
        		$('#poliza').val(json.poliza);
        		$('#auto_edad').val(json.auto_edad);
        	}
        	if(json != null && json.auto_aseguradora != null && json.auto_aseguradora != 0 && json.auto_aseguradora != ""){
        		//console.log(json.auto_aseguradora);
				$('#auto_aseguradora option[value="' + json.auto_aseguradora + '"]').prop('selected', true);
				var q = "SELECT DISTINCT(z.Id_Zona), z.Nombre FROM AUTOS_Zonas AS z, AUTOS_Cotizador AS c ";
				q += "WHERE c.Id_Zona = z.Id_Zona AND Id_Aseguradora = " + json.auto_aseguradora + " ORDER BY Nombre";
				tx.executeSql(q, [], function(tx, res){
					var len = res.rows.length;
					var opZo = '<option value="0">Seleccionar Zona...</option>';
		      		for (var i=0; i<len; i++){
			   			opZo += '<option value="' + res.rows.item(i).Id_Zona + '">' + res.rows.item(i).Nombre + '</option>';
		       		}
		       		$('#auto_zona').html(opZo);
		       		if(json.auto_zona != 0 && json.auto_zona != "" && json.auto_zona != null){
		       			$('#auto_zona option[value="' + json.auto_zona + '"]').prop('selected', true);
		       			q = "SELECT DISTINCT(m.Id_Marca), m.Nombre FROM AUTOS_Marcas AS m, AUTOS_Cotizador AS c ";
		       			q += "WHERE c.Id_Marca = m.Id_Marca AND Id_Aseguradora = " + json.auto_aseguradora + " ";
						q += "AND Id_Zona = " + json.auto_zona + " ORDER BY Nombre";
						tx.executeSql(q, [], function(tx, res){
							var opMa = '<option value="0">Seleccionar Marca...</option>';
        					for (var i=0; i<res.rows.length; i++){
        						opMa += '<option value="' + res.rows.item(i).Id_Marca + '">' + res.rows.item(i).Nombre + '</option>';
        					}
        					$('#auto_marca').html(opMa);
        					if(json.auto_marca != 0 && json.auto_marca != "" && json.auto_marca != null){
        						$('#auto_marca option[value="' + json.auto_marca + '"]').prop('selected', true);
        						q = "SELECT DISTINCT(m.Id_Modelo), m.Nombre FROM AUTOS_Modelos AS m, AUTOS_Cotizador AS c ";
        						q += "WHERE c.Id_Modelo = m.Id_Modelo AND Id_Aseguradora = " + json.auto_aseguradora + " ";
								q += "AND Id_Zona = " + json.auto_zona + " AND Id_Marca = " + json.auto_marca + " ";
								q += "ORDER BY Nombre DESC";
								tx.executeSql(q, [], function(tx, res){
									var opMo = '<option value="0">Seleccionar Modelo...</option>';
        							for (var i=0; i<res.rows.length; i++){
        								opMo += '<option value="' + res.rows.item(i).Id_Modelo + '">' + res.rows.item(i).Nombre + '</option>';
        							}
        							$('#auto_modelo').html(opMo);
									if(json.auto_modelo != 0 && json.auto_modelo != "" && json.auto_modelo != null){
        								$('#auto_modelo option[value="' + json.auto_modelo + '"]').prop('selected', true);
        								var q = 'SELECT DISTINCT(c.Id_Tipo), Nombre FROM AUTOS_Cotizador AS c, AUTOS_Tipos AS t WHERE c.Id_Tipo = t.Id_Tipo ';
										q += 'AND Id_Aseguradora = ' + json.auto_aseguradora + ' AND Id_Zona = ' + json.auto_zona + ' AND Id_Marca = ' + json.auto_marca + ' ';
										q += 'AND Id_Modelo = ' + json.auto_modelo + ' ORDER BY Nombre';
										tx.executeSql(q, [], function(tx, res){
											var opTi = '<option value="0">Seleccionar tipo...</option>';
											for(var i = 0; i < res.rows.length; i++){
												opTi += '<option value=' + res.rows.item(i).Id_Tipo + '>' + res.rows.item(i).Nombre + '</option>';
											}
											$('#auto_tipo').html(opTi);
											if(json.auto_tipo != 0 && json.auto_tipo != "" && json.auto_tipo != null){
	        									$('#auto_tipo option[value="' + json.auto_tipo + '"]').prop('selected', true);
    	    									q = 'SELECT Id_Cotizacion, Descripcion ';
        										q += 'FROM AUTOS_Cotizador WHERE Id_Aseguradora = ' + json.auto_aseguradora + ' ';
												q += 'AND Id_Zona = ' + json.auto_zona + ' AND Id_Marca = ' + json.auto_marca + ' ';
												q += 'AND Id_Modelo = ' + json.auto_modelo + " AND Id_Tipo = " + json.auto_tipo + " ORDER BY Descripcion";
												//console.log(q);
												tx.executeSql(q, [], function(tx, res){
													opDe = '<option value="0">Seleccionar Descripcion...</option>';
													for(var i = 0; i < res.rows.length; i++){
														opDe += '<option value=' + res.rows.item(i).Id_Cotizacion + '>' + res.rows.item(i).Descripcion + '</option>';
													}
													$('#auto_descripcion').html(opDe);
													$('#loader').hide();
												});
											}
											else{
												$('#loader').hide();
											}
										});
        							}
        							else{
										$('#loader').hide();
									}
								});
        					}
        					else{
								$('#loader').hide();
							}
						});
		       		}
		       		else{
						$('#loader').hide();
					}
				});
        	}
        	else{
				$('#loader').hide();
			}
		});
	}, errorDefault);
	db.transaction(function(tx){
		var q = "SELECT Id_Plan, Id_Aseguradora, Nombre FROM AUTOS_Planes ORDER BY Nombre";
		tx.executeSql(q, [], function(tx, res){
			var len = res.rows.length;
			var opt = '<option value="0">Seleccionar paquete...</option>';
			autoCoberturas = '[';
			var idAseguradora = 0;
			var json = localStorage.getItem('AUTO');
			if(json != null){
				json = JSON.parse(json);
				idAseguradora = json.auto_aseguradora;
			}
        	for (var i=0; i<len; i++){
        		if(res.rows.item(i).Id_Aseguradora == idAseguradora){
        			opt += '<option value="' + res.rows.item(i).Id_Plan + '">' + res.rows.item(i).Nombre + '</option>';
        		}
        		autoCoberturas += '{';
        		autoCoberturas += '"Id_Aseguradora" : ' + res.rows.item(i).Id_Aseguradora + ',';
        		autoCoberturas += '"Id_Plan" : ' +  res.rows.item(i).Id_Plan + ',';
        		autoCoberturas += '"Plan" : "' + res.rows.item(i).Nombre + '"},';
        	}
        	autoCoberturas = autoCoberturas.substring(0, autoCoberturas.length - 1);
        	autoCoberturas += ']';
        	autoCoberturas = JSON.parse(autoCoberturas);
        	$('#auto_cobertura').html(opt);
        	//checkDbTrans();
		});
	});
	//dbTrans = 5;
}

function cotizaciones_auto_resumen(){
	var id =  parseInt(localStorage.getItem('idResumenAuto'));
	$('#alertMsg').html('Generando cotizaci&oacute;n...');
	$('#loader').show();
	db.transaction(function(tx){
		var q = 'SELECT nombre, form FROM kc_cotizaciones WHERE rowid = ' + id;
		console.log(q);
		tx.executeSql(q, [], function(tx, res){
			var json = res.rows.item(0).form;
			json = JSON.parse(json);
			json = json.AUTO;
			var jsonDesc = JSON.parse(json.auto_descripcion.replace(/'/g, '"'));
			var html = '';
			html += '<div style="display:inline-block; width:100%;">';
			html += '<div style="float:left;">';
			html += '<h2>COTIZACI&Oacute;N NUEVA AUTO</h2>';
			html += '</div>';
			html += '<div id="wrapperBtnSimple">';
			html += '<div class="btnSimple">';
			html += '<img src="img/agenda_w.png" />';
			html += '<a class="link" href="agenda_agendar.html?n=' + res.rows.item(0).nombre + '&m=Cotización auto"></a>';
			html += '<a>AGENDAR</a>';
			html += '</div>';
			html += '<div class="btnSimple">';
			html += '<img src="img/next_w.png" />';
			html += '<a class="linkJS btnEnviarCoti" tipocotizacion="Auto" href="#" id="btnEnviarAuto"></a>';
			html += '<a>ENVIAR</a>';
			html += '</div>';
			/*html += '<div class="btnSimple">';
			html += '<img src="img/next_w.png" />';
			html += '<a class="link" href="cotizaciones_auto.html"></a>';
			html += '<a>IMPRIMIR</a>';
			html += '</div>';*/
			html += '<div class="btnSimple">';
			html += '<img src="img/limpiar_w.png" />';
			html += '<a class="link" href="cotizaciones_auto.html"></a>';
			html += '<a>ELIMINAR</a>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			html += '<div class="parrafo">';
			html += '<div style="background:#8fc6e8; padding:5px 10px;">';
			html += '<a style="font-weight:bold;">Informaci&oacute;n del asegurado</a>';
			html += '</div>';
			html += '<table cellspacing="0" style="width:100%;">';
			html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
			html += '<td style="width:50%;"><a>Aseguradora</a></td>';
			html += '<td><a>' + json.auto_aseguradora_txt + '</a></td>';
			html += '</tr>';
			html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
			html += '<td><a>Zona</a></td>';
			html += '<td><a>' + json.auto_zona_txt + '</a></td>';
			html += '</tr>';
			html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
			html += '<td><a>Marca</a></td>';
			html += '<td><a>' + json.auto_marca_txt + '</a></td>';
			html += '</tr>';
			html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
			html += '<td><a>Modelo</a></td>';
			html += '<td><a>' + json.auto_modelo_txt + '</a></td>';
			html += '</tr>';
			html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
			html += '<td><a>Descripci&oacute;n </a></td>';
			html += '<td><a>' + json.auto_descripcion_txt + '</a></td>';
			html += '</tr>';
			html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
			html += '<td><a>Paquete</a></td>';
			html += '<td><a>' + json.auto_cobertura_txt + '</a></td>';
			html += '</tr>';
			q = 'SELECT Costo FROM AUTOS_Costos WHERE Id_Cotizacion = ' + json.auto_descripcion + ' AND Id_Plan = ' + json.auto_cobertura;
			console.log(q);
			tx.executeSql(q, [], function(tx, res){
				if(res.rows.length > 0){
					json['costo'] = res.rows.item(0).Costo;
					html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					html += '<td><a>Costo</a></td>';
					html += '<td><a>$' + addCommas(res.rows.item(0).Costo) + '</a></td>';
					html += '</tr>';
					html += '</table>'
					html += '</div>';
					q = 'SELECT co.Nombre, sa.Valor FROM AUTOS_Coberturas AS co, AUTOS_Sumas_Aseguradas AS sa, AUTOS_Planes_Coberturas AS pc ';
					q += 'WHERE co.Id_Cobertura = pc.Id_Cobertura AND pc.Id_Suma_Asegurada = sa.Id_Suma_Asegurada ';
					q+= 'AND pc.Id_Plan = ' + json.auto_cobertura + ' ORDER BY co.Nombre';
					//console.log(q);
					tx.executeSql(q, [], function(tx, res){
						html += '<div class="parrafo">';
						html += '<div style="background:#8fc6e8; padding:5px 10px;">';
						html += '<a style="font-weight:bold;">Coberturas incluidas</a>';
						html += '</div>';
						html += '<table cellspacing="0" style="width:100%;">';
						json['coberturas'] = [];
						for(var i = 0; i < res.rows.length; i++){
							html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
							html += '<td style="width:50%;"><a>' + res.rows.item(i).Nombre + '</a></td>';
							html += '<td><a>$' + addCommas(res.rows.item(i).Valor) + '</a></td>';
							html += '</tr>';
							var item = {
								nombre: res.rows.item(i).Nombre,
								valor: res.rows.item(i).Valor
							};
							json['coberturas'].push(item);
						}
						html += '</table>'
						html += '</div>';
						$('#content').html(html);
						$('#loader').hide();
						localStorage.setItem('Auto_temp', JSON.stringify(json));
					});
				}
				else{
					html += '</table>'
					html += '</div>';
					html += '<div class="noData">';
					html += '<a>No se encontraron costos para esta cotizaci&oacute;n.</a>';
					html += '</div>';
					$('#content').html(html);
					$('#loader').hide();
				}
			});
		});
	}, errorDefault);
}