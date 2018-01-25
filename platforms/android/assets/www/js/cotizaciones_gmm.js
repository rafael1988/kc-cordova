var gmmMpos;
//localStorage.removeItem('GMM');

/*
db.transaction(function(tx){
	var q = 'SELECT Nombre, Valor FROM Parametros';
	tx.executeSql(q, [], function(tx, res){
		for(var i = 0; i < res.rows.length; i++){
			if(res.rows.item(i).Nombre == 'PorcentajeIVA'){
				iva = (res.rows.item(i).Valor / 100) + 1;
			}
			else if(res.rows.item(i).Nombre == 'GMM_DerechoPoliza'){
				derechoPoliza = res.rows.item(i).Valor;
			}
			else if(res.rows.item(i).Nombre == 'SalarioMensual'){
				salarioMes = res.rows.item(i).Valor;
			}
			else if(res.rows.item(i).Nombre == 'SalarioDiario'){
				salarioDiario = res.rows.item(i).Valor;
			}
		}
	});
});
*/

$(document).on('change', '#gmm_estado', function(){
	var id = $(this).val();
	var opt = '';
	//console.log(gmmMpos);
	for(var i in gmmMpos){
		//console.log(i);
		if(id == gmmMpos[i].Id_Estado){
			opt += '<option value="{\'Id_Municipio\':' + gmmMpos[i].Id_Municipio + ',\'Region\':' + gmmMpos[i].Region + '}">' + gmmMpos[i].Municipio + '</option>';
		}
	}
	$('#gmm_municipio').html(opt);
});

$(document).on('change', '#gmm_suma_asegurada', function(){
	var tmp = $(this).val();
	var json = JSON.parse(tmp.replace(/'/g, '"'));
	//salario minimo * 30 = 2103 CAMBIAR!! Esperando a tabla
	var txt = '$' + addCommas(json.Suma_Asegurada * salarioMes);
	$('#gmm_equivalente_txt').html(txt);
	$('#gmm_equivalente').val(txt);
});

$(document).on('click', '.addGmm', function(){
	if($('#gmm_nombre_nuevo').val() != '' && $('#gmm_edad_nuevo').val() != ''){
		var n = $('#gmm_num_adicionales').val();
		$('#gmm_num_adicionales').val(++n);
		var html = '<tr>';
		html += '<td><input type="hidden" id="gmm_nombre_' + n + '" value="' + $('#gmm_nombre_nuevo').val() + '"/><a>' + $('#gmm_nombre_nuevo').val() + '</td>';
		html += '<td><input type="hidden" id="gmm_sexo_' + n + '" value="' + $('#gmm_sexo_nuevo').val() + '"/><a>' + $('#gmm_sexo_nuevo option:selected').text() + '</a></td>';
		html += '<td><input type="hidden" id="gmm_edad_' + n + '" value="' + $('#gmm_edad_nuevo').val() + '"/><a>' + $('#gmm_edad_nuevo').val() + '</a></td>';
		html += '<td><div class="deleteGmm" style="display:inline-block;"><img src="img/eliminar.png" style="height:20px;" /></div></td>'
		html += '</tr>';
		$('#gmm_adicionales tr:last').before(html);
		$('#gmm_nombre_nuevo').val('');
		//$('#gmm_sexo_nuevo').val('Femenino');
		$('#gmm_edad_nuevo').val('');
	}
	else{
		alert('Todos los campos son obligatorios.');
	}
});

$(document).on('click', '.deleteGmm', function(){
	var tr = $(this).parent().parent();
	tr.remove();
});

$(document).on('click', '#limpiarGMM', function(){
	//console.log('hola');
	localStorage.removeItem('GMM');
	cotizaciones_gmm();
});

function cotizaciones_gmm(){
	var html = '';
	html += '<div style="display:inline-block; width:100%;">';
	html += '<div style="float:left;">';
	html += '<h2>COTIZACI&Oacute;N NUEVA GMM</h2>';
	html += '</div>';
	html += '<div id="wrapperBtnSimple">';
	html += '<div id="limpiarGMM" class="btnSimple">';
	html += '<img src="img/limpiar_w.png" />';
	html += '<a>LIMPIAR</a>';
	html += '</div>';
	html += '<div class="btnSimple">';
	html += '<img src="img/next_w.png" />';
	html += '<a id="guardarCotizacionGMM" class="linkJS" href="cotizaciones_gmm_resumen.html"></a>';
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
	html += '<td style="width:25%"><a>Nombre</a></td>';
	html += '<td><span><input type="text" id="nombre" class="formulario" /><input type="hidden" id="poliza"></span></td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td style="max-width:200px"><a>Edad</a></td>';
	html += '<td><span><input type="tel" inputmode="numeric" pattern="[0-9]*" id="gmm_edad" class="txtedad formulario"  /></span></td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td><a>Sexo</a></td>';
	html += '<td>';
	html += '<select name="gmm_sexo" id="gmm_sexo">';
	html += '<option value="2">Femenino</option>';
	html += '<option value="1">Masculino</option>';
	html += '</select>';
	html += '</td>';
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Estado</a></td>';
	html += '<td>';
	html += '<select name="gmm_estado" id="gmm_estado">';
	html += '</select>';
	html += '</td>';
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Municipio</a></td>';
	html += '<td>';
	html += '<select name="gmm_municipio" id="gmm_municipio">';
	html += '</select>';
	html += '</td>';
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Plan</a></td>';
	html += '<td>';
	html += '<select name="gmm_plan" id="gmm_plan">';
	html += '</select>';
	html += '</td>';
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Suma asegurada</a></td>';
	html += '<td>';
	html += '<select name="gmm_suma_asegurada" id="gmm_suma_asegurada">';
	html += '</select>';
	html += '</td>';
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Equivalente a</a></td>';
	html += '<td><span><a id="gmm_equivalente_txt">$00.00</a><input type="hidden" name="gmm_equivalente" id="gmm_equivalente"/></span></td>';
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Deducible</a></td>';
	html += '<td>';
	html += '<select name="gmm_deducible" id="gmm_deducible">';
	html += '</select>';
	html += '</td>';
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Coaseguro</a></td>';
	html += '<td>';
	html += '<select name="gmm_coaseguro" id="gmm_coaseguro">';
	html += '</select>';
	html += '</td>';
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Forma de pago</a></td>';
	html += '<td>';
	html += '<select name="gmm_forma_pago" id="gmm_forma_pago">';
	html += '</select>';
	html += '</td>';
	html += '</tr>';
	html += '</table>';
	html += '</div>';
	html += '<div class="parrafo">';
	html += '<div style="background:#8fc6e8; padding:5px 10px;">';
	html += '<a style="font-weight:bold;">Adicionales</a>';
	html += '</div>';
	html += '<table id="gmm_adicionales" cellspacing="0" cellpadding="5" style="width:100%;">';
	html += '<tr>';
	html += '<td><a>NOMBRE</a></td>';
	html += '<td><a>GENERO</a></td>';
	html += '<td><a>EDAD</a></td>';
	html += '<td><input type="hidden" id="gmm_num_adicionales" value="0"/></td>';
	html += '</tr>';
	var json = localStorage.getItem('GMM');
	var equivalente;
	if(json != null){
		json = JSON.parse(json);
		equivalente = json.gmm_equivalente;
		if(json.gmm_num_adicionales > 0){
			for(var i = 1; i <= json.gmm_num_adicionales; i++){
				if(json['gmm_nombre_' + i] != '' && json['gmm_nombre_' + i] != null){
					html += '<tr>';
					html += '<td><input type="hidden" id="gmm_nombre_' + i + '" value="' + json['gmm_nombre_' + i] + '"><a>' + json['gmm_nombre_' + i] + '</a></td>';
					html += '<td><input type="hidden" id="gmm_sexo_' + i +'" value="' + json['gmm_sexo_' + i] + '"><a>';
					if(json['gmm_sexo_' + i] == 2)
						html += 'Femenino';
					else
						html += 'Masculino';
					html += '</a></td><td>';
					html += '<input type="hidden" id="gmm_edad_' + i + '" value="' + json['gmm_edad_' + i] + '"><a>' + json['gmm_edad_' + i] + '</a></td>';
					html += '<td><div class="deleteGmm" style="display:inline-block;"><img src="img/eliminar.png" style="height:20px;"></div></td>';
					html += '</tr>';
				}
			}
		}
	}
	html += '<tr>';
	html += '<td><input type="text" id="gmm_nombre_nuevo" class="formulario" /></td>';
	html += '<td>';
	html += '<select name="gmm_sexo_nuevo" id="gmm_sexo_nuevo">';
	html += '<option value="2">Femenino</option>';
	html += '<option value="1">Masculino</option>';
	html += '</select>';
	html += '</td>';
	html += '<td><input type="tel" id="gmm_edad_nuevo" class="txtedad formulario" inputmode="numeric" pattern="[0-9]*" /></td>';
	html += '<td><div class="addGmm" style="display:inline-block;"><img src="img/btn_resultados.png" style="height:20px;" /></div></td>';
	html += '</tr>';
	html += '</table>';
	html += '</div>';
	$('#content').html(html);
	db.transaction(function(tx){
		var q = "SELECT Id_Estado, Nombre FROM GMM_Estados ORDER BY Nombre";
		tx.executeSql(q, [], function(tx, res){
			var len = res.rows.length;
			var opt = '';
        	for (var i=0; i<len; i++){
        		opt += '<option value="' + res.rows.item(i).Id_Estado + '">' + res.rows.item(i).Nombre + '</option>';
        	}
        	$('#gmm_estado').html(opt);
        	checkDbTrans();
		}, errorDefault);
	});
	db.transaction(function(tx){
		var q = "SELECT Id_Estado, Id_Municipio, Ciudad_Municipio, Region FROM GMM_Municipios ORDER BY Ciudad_Municipio";
		tx.executeSql(q, [], function(tx, res){
			var len = res.rows.length;
			var opt = '';
			gmmMpos = '[';
			var idEdo = 1;
			var json = localStorage.getItem('GMM');
			if(json != null){
				json = JSON.parse(json);
				if(json.gmm_estado != undefined && json.gmm_estado != null)
					idEdo = json.gmm_estado;
			}
        	for (var i=0; i<len; i++){
        		if(res.rows.item(i).Id_Estado == idEdo){
        			opt += '<option value="{\'Id_Municipio\':' + res.rows.item(i).Id_Municipio + ',\'Region\':' + res.rows.item(i).Region + '}">' + res.rows.item(i).Ciudad_Municipio + '</option>';
        		}
        		gmmMpos += '{';
        		gmmMpos += '"Id_Estado" : ' + res.rows.item(i).Id_Estado + ',';
        		gmmMpos += '"Id_Municipio" : ' + res.rows.item(i).Id_Municipio + ',';
        		gmmMpos += '"Region" : ' + res.rows.item(i).Region + ',';
        		gmmMpos += '"Municipio" : "' + res.rows.item(i).Ciudad_Municipio + '"';
        		gmmMpos += '},'; 
        	}
        	gmmMpos = gmmMpos.substring(0, gmmMpos.length - 1);
        	gmmMpos += ']';
        	gmmMpos = JSON.parse(gmmMpos);
        	//console.log(gmmMpos);
        	$('#gmm_municipio').html(opt);
        	checkDbTrans();
		}, errorDefault);
	});
	db.transaction(function(tx){
		var q = "SELECT Id_Plan, Nombre FROM GMM_CAT_Planes ORDER BY id";
		tx.executeSql(q, [], function(tx, res){
			var len = res.rows.length;
			var opt = '';
        	for (var i=0; i<len; i++){
        		opt += '<option value="' + res.rows.item(i).Id_Plan + '">' + res.rows.item(i).Nombre + '</option>';
        	}
        	$('#gmm_plan').html(opt);
        	checkDbTrans();
		}, errorDefault);
	});
	db.transaction(function(tx){
		var q = "SELECT Id_Suma_Asegurada, Factor, Descripcion, Suma_Asegurada FROM GMM_Sumas_Aseguradas ORDER BY Id_Suma_Asegurada";
		tx.executeSql(q, [], function(tx, res){
			var opt = '';
			var sa = 0;
			for(var i = 0; i < res.rows.length; i++){
				if(i == 0) sa = res.rows.item(i).Suma_Asegurada;
				opt += '<option value="{\'Factor\':' + res.rows.item(i).Factor + ',\'Suma_Asegurada\':' + res.rows.item(i).Suma_Asegurada + '}">' + res.rows.item(i).Descripcion + '</option>';                          
			}
			$('#gmm_suma_asegurada').html(opt);
			if(equivalente != null){
				$('#gmm_equivalente_txt').html(equivalente);
				$('#gmm_equivalente').val(equivalente);
			} 
			else{
				var eq = '$' + addCommas(sa * salarioMes);
				$('#gmm_equivalente_txt').html(eq);
				$('#gmm_equivalente').val(eq);
			}
			checkDbTrans();
		}, errorDefault);
	});
	db.transaction(function(tx){
		var q = "SELECT Id_Deducible, Factor, Descripcion FROM GMM_Deducibles WHERE Id_Tipo_Cobertura = 1 ORDER BY Id_Deducible";
		tx.executeSql(q, [], function(tx, res){
			var opt = '';
			for(var i = 0; i < res.rows.length; i++){
				opt += '<option value="' + res.rows.item(i).Factor + '">' + addCommas(res.rows.item(i).Descripcion) + '</option>';
			}
			$('#gmm_deducible').html(opt);
			checkDbTrans();
		}, errorDefault);
	});
	db.transaction(function(tx){
		var q = "SELECT Id_Coaseguro, Factor, Descripcion FROM GMM_Coaseguros WHERE Id_Tipo_Cobertura = 1 ORDER BY Id_Coaseguro";
		tx.executeSql(q, [], function(tx, res){
			var opt = '';
			for(var i = 0; i < res.rows.length; i++){
				opt += '<option value="' + res.rows.item(i).Factor + '">' + res.rows.item(i).Descripcion + '</option>';
			}
			$('#gmm_coaseguro').html(opt);
			checkDbTrans();
		}, errorDefault);
	});
	db.transaction(function(tx){
		var q = "SELECT Id_Forma_Pago, Factor, Descripcion FROM GMM_Formas_Pagos ORDER BY Descripcion";
		tx.executeSql(q, [], function(tx, res){
			var opt = '';
			for(var i = 0; i < res.rows.length; i++){
				opt += '<option value="{\'Id_Forma_Pago\':' + res.rows.item(i).Id_Forma_Pago + ',\'Factor\':' + res.rows.item(i).Factor + '}">' + res.rows.item(i).Descripcion + '</option>';
			}
			$('#gmm_forma_pago').html(opt);
			checkDbTrans();
		}, errorDefault);
	});
	/*db.transaction(function(tx){
		var q = "";
	});*/
	dbTrans = 7;
}

function cotizaciones_gmm_resumen(){
	var id =  parseInt(localStorage.getItem('idResumenGmm'));
	$('#alertMsg').html('Actualizando Información...');
	$('#loader').show();
	var obj;
	db.transaction(function(tx){
		var q = 'SELECT nombre, form FROM kc_cotizaciones WHERE rowid = ' + id;
		console.log(q);
		tx.executeSql(q, [], function(tx, res){
			var nombre = res.rows.item(0).nombre;
			var json = res.rows.item(0).form;
			json = JSON.parse(json);
			json = json.GMM;
			obj = json;
			//console.log(json);
			var sye_adicionales = '';
			for(var i = 1; i <= json.gmm_num_adicionales; i++){
				sye_adicionales += ' OR (Id_Genero = ' + json['gmm_sexo_' + i] + ' AND Edad = ' + json['gmm_edad_' + i] + ')';
			}
			q = 'SELECT Id_Genero, Edad, Monto FROM GMM_Tarifas_Base WHERE (Id_Genero = ' + json.gmm_sexo + ' AND Edad = ' + json.gmm_edad + ')' + sye_adicionales;
			//console.log(q);
			tx.executeSql(q, [], function(tx, res){
				var monto = 0;
				var resMonto = res;
				for(var i = 0; i < resMonto.rows.length; i++){
					if(resMonto.rows.item(i).Id_Genero == json.gmm_sexo && resMonto.rows.item(i).Edad == json.gmm_edad){
						monto = resMonto.rows.item(i).Monto;
					}	
				}
				//console.log('Monto titular: ' + monto);
				var jsonMpo = JSON.parse(json.gmm_municipio.replace(/'/g, '"'));
				q = 'SELECT Factor FROM GMM_Regiones WHERE Id_Region = ' + jsonMpo.Region + ' AND Id_Plan = ' + json.gmm_plan;
				console.log(q);
				tx.executeSql(q, [], function(tx, res){
					var factor_region = res.rows.item(0).Factor;
					console.log("region: " + factor_region);
					var jsonSA = JSON.parse(json.gmm_suma_asegurada.replace(/'/g, '"'));
					var jsonFP = JSON.parse(json.gmm_forma_pago.replace(/'/g, '"'));
					var html2 = '';
					html2 += '<div style="display:inline-block; width:100%;">';
					html2 += '<div style="float:left;">';
					html2 += '<h2>RESUMEN DE LA COTIZACI&Oacute;N</h2>';
					html2 += '</div>';
					html2 += '<div id="wrapperBtnSimple">';
					html2 += '<div class="btnSimple">';
					html2 += '<img src="img/agenda_w.png" />';
					html2 += '<a class="link" href="agenda_agendar.html?n=' + nombre + '&m=Cotización GMM"></a>';
					html2 += '<a>AGENDAR</a>';
					html2 += '</div>';
					html2 += '<div class="btnSimple">';
					html2 += '<img src="img/next_w.png" />';
					html2 += '<a class="linkJS btnEnviarCoti" tipocotizacion="Gmm" id="btnEnviarGMM" href="#"></a>';
					html2 += '<a>ENVIAR</a>';
					html2 += '</div>';
					/*html2 += '<div class="btnSimple">';
					html2 += '<img src="img/next_w.png" />';
					html2 += '<a class="link" href="cotizaciones_gmm.html"></a>';
					html2 += '<a>IMPRIMIR</a>';
					html2 += '</div>';*/
					html2 += '<div class="btnSimple">';
					html2 += '<img src="img/limpiar_w.png" />';
					html2 += '<a class="link" href="cotizaciones_gmm.html"></a>';
					html2 += '<a>ELIMINAR</a>';
					html2 += '</div>';
					html2 += '</div>';
					html2 += '</div>';
					
					var html = '';
					html += '<div class="parrafo">';
					html += '<div style="background:#8fc6e8; padding:5px 10px;">';
					html += '<a style="font-weight:bold;">Datos generales del titular</a>';
					html += '</div>';
					html += '<table cellspacing="0" style="width:100%;">';
					html += '<tr>';
					html += '<td style="width:60%"><a>Nombre del titular</a></td>';
					html += '<td><a>' + json.nombre + '</a></td>';
					html += '</tr>';
					html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					html += '<td><a>G&eacute;nero</a></td>';
					html += '<td><a>' + json.gmm_sexo_txt + '</a></td>';
					html += '</tr>';
					html += '<tr>';
					html += '<td style="max-width:200px"><a>Edad</a></td>';
					html += '<td><a>' + json.gmm_edad + '</a></td>';
					html += '</tr>';
					html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					html += '<td><a>Prima</a></td>';
					var prima_neta = (monto * jsonSA.Factor * json.gmm_deducible * json.gmm_coaseguro * factor_region) + 395 + 30;
					obj['prima_titular'] = parseFloat(prima_neta.toFixed(2));
					html += '<td><a>$' + addCommas(prima_neta.toFixed(2)) + '</a></td>';
					html += '</tr>';
					html += '</table>';
					html += '</div>';
					
					obj['adicionales'] = [];
					var primas_adicionales = [];
					if(json.gmm_num_adicionales > 0){
						for(var i = 1; i <= json.gmm_num_adicionales; i++){
							if(json['gmm_nombre_' + i] != '' && json['gmm_nombre_' + i] != null){
								html += '<div class="parrafo">';
								html += '<div style="background:#8fc6e8; padding:5px 10px;">';
								html += '<a style="font-weight:bold;">Datos generales adicional ' + i + '</a>';
								html += '</div>';
								html += '<table cellspacing="0" style="width:100%;">';
								html += '<tr>';
								html += '<td  style="width:60%"><a>Nombre</a></td>';
								html += '<td><a>' + json['gmm_nombre_' + i] + '</a></td>';
								html += '</tr>';
								html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
								html += '<td><a>G&eacute;nero</a></td>';
								if(json['gmm_sexo_' + i] == 2)
									html += '<td><a>Femenino</a></td>';
								else 
									html += '<td><a>Masculino</a></td>';
								html += '</tr>';
								html += '<tr>';
								html += '<td style="max-width:200px"><a>Edad</a></td>';
								html += '<td><a>' + json['gmm_edad_' + i] + '</a></td>';
								html += '</tr>';
								html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
								html += '<td><a>Prima</a></td>';
								for(var j = 0; j < resMonto.rows.length; j++){
									if(resMonto.rows.item(j).Id_Genero == json['gmm_sexo_' + i] && resMonto.rows.item(j).Edad == json['gmm_edad_' + i]){
										monto = resMonto.rows.item(j).Monto;
									}	
								}
								//console.log("monto ad " + i + ": " + monto);
								var prima_tmp = (monto * jsonSA.Factor * json.gmm_deducible * json.gmm_coaseguro * factor_region) + 395 + 30;
								primas_adicionales.push(prima_tmp);
								html += '<td><a>$' + addCommas(prima_tmp.toFixed(2)) + '</a></td>';
								html += '</tr>';
								html += '</table>';
								html += '</div>';
								var item = {
									nombre: json['gmm_nombre_' + i],
									sexo: (json['gmm_sexo_' + i] == 2 ? "Femenino" : "Masculino"),
									edad: json['gmm_edad_' + i],
									prima: parseFloat(prima_tmp.toFixed(2))
								};
								obj['adicionales'].push(item);
							}
						}
					}
					//console.log("adicionales completos");
					var datos_coti = '';
					datos_coti += '<div class="parrafo">';
					datos_coti += '<div style="background:#8fc6e8; padding:5px 10px;">';
					datos_coti += '<a style="font-weight:bold;">Datos de la cotizacion</a>';
					datos_coti += '</div>';
					datos_coti += '<table cellspacing="0" style="width:100%;">';
					datos_coti += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					datos_coti += '<td  style="width:60%"><a>Estado</a></td>';
					datos_coti += '<td><a>' + json.gmm_estado_txt + '</a></td>';
					datos_coti += '</tr>';
					datos_coti += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					datos_coti += '<td><a>Municipio</a></td>';
					datos_coti += '<td><a>' + json.gmm_municipio_txt + '</a></td>';
					datos_coti += '</tr>';
					datos_coti += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					datos_coti += '<td><a>Plan</a></td>';
					datos_coti += '<td><a>' + json.gmm_plan_txt + '</a></td>';
					datos_coti += '</tr>';
					datos_coti += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					datos_coti += '<td><a>Suma asegurada</a></td>';
					datos_coti += '<td><a>' + json.gmm_suma_asegurada_txt + '</a></td>';
					datos_coti += '</tr>';
					datos_coti += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					datos_coti += '<td><a>Deducible</a></td>';
					datos_coti += '<td><a>' + json.gmm_deducible_txt + '</a></td>';
					datos_coti += '</tr>';
					datos_coti += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					datos_coti += '<td><a>Coaseguro</a></td>';
					datos_coti += '<td><a>' + json.gmm_coaseguro_txt + '</a></td>';
					datos_coti += '</tr>';
					/*datos_coti += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					datos_coti += '<td><a>Monto</a></td>';
					datos_coti += '<td><a>$' + addCommas(monto.toFixed(2)) + '</a></td>';
					datos_coti += '</tr>';*/
					datos_coti += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					datos_coti += '<td><a>Recargo por forma de pago</a></td>';
					var recargo = prima_neta * jsonFP.Factor;
					obj['recargo'] = parseFloat(recargo.toFixed(2));
					datos_coti += '<td><a>$' + addCommas(recargo.toFixed(2)) + '</a></td>';
					datos_coti += '</tr>';
					datos_coti += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					datos_coti += '<td><a>Derecho de poliza</a></td>';
					var derecho_poliza = derechoPoliza * (1 + parseInt(json.gmm_num_adicionales));
					obj['derecho_poliza'] = derecho_poliza;
					datos_coti += '<td><a>$' + derecho_poliza + '</a></td>';
					datos_coti += '</tr>';
					datos_coti += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					datos_coti += '<td><a>Subtotal</a></td>';
					var adicionales_total = 0;
					for(var i = 0; i < primas_adicionales.length; i++){
						adicionales_total += primas_adicionales[i];
					}
					var subtotal = prima_neta + recargo + derecho_poliza + adicionales_total;
					obj['subtotal'] = parseFloat(subtotal.toFixed(2));
					datos_coti += '<td><a>$' + addCommas(subtotal.toFixed(2)) + '</a></td>';
					datos_coti += '</tr>';
					datos_coti += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					datos_coti += '<td><a>Total</a></td>';
					var total = subtotal * iva;
					obj['iva'] = parseFloat((subtotal * (iva - 1)).toFixed(2));
					obj['total'] = parseFloat(total.toFixed(2));
					datos_coti += '<td><a>$' + addCommas(total.toFixed(2)) + '</a></td>';
					datos_coti += '</tr>';
					datos_coti += '</table>';
					datos_coti += '</div>';
					
					html2 += datos_coti + html;
					$('#content').html(html2);
					$('#loader').hide();
					localStorage.setItem('GMM_temp', JSON.stringify(obj));
				});
			});	
		});
	}, errorDefault);
}