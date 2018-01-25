var ocupSus = [];
//var ocupaciones;
//localStorage.removeItem('MET99');
//localStorage.removeItem('MET99_sa');
//localStorage.removeItem('MET99_prima');

function fillFormMet99SA(){
	if(form != ''){
		//console.log(form);
		var jsonS = localStorage.getItem(form);
		if(jsonS != null && jsonS.indexOf('sa_bas') > 0){
			//console.log(jsonS);
			var json = JSON.parse(jsonS);
			var bas = json['sa_bas'].replace(/,/g,"");
			if(bas == null || bas == ''){
				$('#sa_bas').val(100000);
			}
			else{
				$('#sa_bas').val(bas);
			}
			$('#sa_bas').change();
			
			var excedente = json['prima_excedente_total'];
			if(excedente != null &&  excedente != undefined){
				$('#prima_excedente_total').val(excedente)
			}
			
			if(json.check_conyuge == 'true'){
				$('#met99_nombre_conyuge').prop('disabled', false);
				$('#met99_nombre_conyuge').val(json.met99_nombre_conyuge);
				$('#met99_edad_conyuge').prop('disabled', false);
				$('#met99_edad_conyuge').val(json.met99_edad_conyuge);
				$('#sa_bacy').prop('disabled', false);
				$('#sa_bcacy').prop('disabled', false);
				$('#sa_gfc').prop('disabled', false);
			}
			
			var inputs = $('body').find(':input');
			/*for(var i = 0; i < inputs.length; i++){
				var input = inputs[i];
				console.log(input.getAttribute('id'));
			}*/
			var setInputs = function(i){
				var input = inputs[i];
				var id = input.getAttribute('id');
				var that = $('#' + id);
				//var id = that.attr('id');
				var val = json[id];
				if(that.is(':checkbox')){
					if(val == 'true'){
						//console.log(id);
						if(id == 'sa_bit'){
							that.click();
						}
						else{
							that.prop('checked', true);
						}
						$('#' + id + '_txt').prop('disabled', false);
						$('#' + id + '_sexo').prop('disabled', false);
						$('#' + id + '_edad').prop('disabled', false);
						$('#' + id + '_edad').val(15);
						$('#' + id + '_hijos').prop('disabled', false);
						$('#' + id + '_extra').prop('disabled', false);
						$('#' + id + '_basico').prop('disabled', false);
					}
				}
				else if(that.is(':radio')){
					if(val == 'true'){
						that.prop('checked', true);
						that.click();
					}
				}
				else if(that.is('select')){
					if(val != null && val != ''){
						var checkid = id.split('_');
						checkid = checkid[0] + '_' + checkid[1];
						if($('#' + checkid).prop('checked')){
							$('#' + id + ' option[value="' + val + '"]').prop('selected', true);
							$('#' + id + ' option[value="' + val + '"]').change();
						}
					}
				}
				else if(val != null && val != ''){
					if(id.indexOf('_tarifa') == -1 && id.indexOf('_te') == -1 && id.indexOf('_ep') == -1 && id.indexOf('_pa') == -1){
					//if(id.indexOf('_txt') > 0){
						val = val.replace(/,/g,"");
						//console.log(id);
						//console.log(val);
						var checkid = id.split('_');
						checkid = checkid[0] + '_' + checkid[1];
						if($('#' + checkid).prop('checked')){
							that.val(val);
							that.change();
						}
					}
				}
			
				if(++i < inputs.length){
					//console.log(i);
					setTimeout(function(){
						setInputs(i)
					},5);
				}
				else{
					setPrimaTotal();
					$('#loader').hide();
				}
			};
			setInputs(0);
			/*
			$('body').find(':input').each(function(i,obj){
				var that = $(this);
				var id = that.attr('id');
				var val = json[id];
				if(that.is(':checkbox')){
					if(val == 'true'){
						//console.log(id);
						if(id == 'sa_bit'){
							that.click();
						}
						else{
							that.prop('checked', true);
						}
						$('#' + id + '_txt').prop('disabled', false);
						$('#' + id + '_sexo').prop('disabled', false);
						$('#' + id + '_edad').prop('disabled', false);
						$('#' + id + '_edad').val(15);
						$('#' + id + '_hijos').prop('disabled', false);
						$('#' + id + '_extra').prop('disabled', false);
						$('#' + id + '_basico').prop('disabled', false);
					}
				}
				else if(that.is(':radio')){
					if(val == 'true'){
						that.prop('checked', true);
						that.click();
					}
				}
				else if(that.is('select')){
					if(val != null && val != ''){
						var checkid = id.split('_');
						checkid = checkid[0] + '_' + checkid[1];
						if($('#' + checkid).prop('checked')){
							$('#' + id + ' option[value="' + val + '"]').prop('selected', true);
							$('#' + id + ' option[value="' + val + '"]').change();
						}
					}
				}
				else if(val != null && val != ''){
					if(id.indexOf('_tarifa') == -1 && id.indexOf('_te') == -1 && id.indexOf('_ep') == -1 && id.indexOf('_pa') == -1){
					//if(id.indexOf('_txt') > 0){
						val = val.replace(/,/g,"");
						//console.log(id);
						//console.log(val);
						var checkid = id.split('_');
						checkid = checkid[0] + '_' + checkid[1];
						if($('#' + checkid).prop('checked')){
							that.val(val);
							that.change();
						}
					}
				}
			});
			*/
		}
		else{
			$('#sa_bas').val(100000);
			$('#sa_bas').change();
			$('#loader').hide();
		}
	}
	else{
		$('#loader').hide();
	}
}


function fillFormMet99Prima(){
	if(form != ''){
		//console.log(form);
		var jsonS = localStorage.getItem(form);
		if(jsonS != null && jsonS.indexOf('prima_prima') > 0){
			//console.log(jsonS);
			var json = JSON.parse(jsonS);
			var prima15 = json['prima_prima'].replace(",","");
			if(prima15 == null || prima15 == ''){
				$('#prima_prima').val(200);
			}
			else{
				$('#prima_prima').val(prima15);
			}
			var excedente = json['prima_excedente_anual'];
			if(excedente != null &&  excedente != undefined){
				$('#prima_excedente_anual').val(excedente)
			}
			$('#prima_prima').change();
			
			if(json.prima_check_conyuge == 'true'){
				//console.log(factoresCy);
				//$('#prima_check_conyuge').click();
				//console.log(factoresCy);
				$('#prima_check_conyuge').prop('checked', true);
				$('#prima_met99_nombre_conyuge').prop('disabled', false);
				$('#prima_met99_nombre_conyuge').val(json.prima_met99_nombre_conyuge);
				$('#prima_met99_edad_conyuge').prop('disabled', false);
				$('#prima_met99_edad_conyuge').val(json.prima_met99_edad_conyuge);
				//$('#prima_met99_edad_conyuge').change();
				//console.log(factoresCy);
				$('#prima_bacy').prop('disabled', false);
				$('#prima_bcacy').prop('disabled', false);
				$('#prima_gfc').prop('disabled', false);
			}
			$('body').find(':input').each(function(i,obj){
				var that = $(this);
				var id = that.attr('id');
				var val = json[id];
				//console.log(id);
				if(that.is(':checkbox') && id != 'prima_check_conyuge'){
					if(val == 'true'){
						//console.log(id);
						/*if(id == 'sa_bit'){
							that.click();
						}
						else{
							that.prop('checked', true);
						}
						//$('#' + id + '_txt').prop('disabled', false);
						$('#' + id + '_sexo').prop('disabled', false);
						$('#' + id + '_edad').prop('disabled', false);
						$('#' + id + '_edad').val(15);
						$('#' + id + '_hijos').prop('disabled', false);
						$('#' + id + '_extra').prop('disabled', false);
						$('#' + id + '_basico').prop('disabled', false);*/
						that.click();
					}
				}
				else if(that.is(':radio')){
					if(val == 'true'){
						that.prop('checked', true);
						that.click();
					}
				}
				else if(that.is('select')){
					if(val != null && val != ''){
						var checkid = id.split('_');
						checkid = checkid[0] + '_' + checkid[1];
						if($('#' + checkid).prop('checked')){
							$('#' + id + ' option[value="' + val + '"]').prop('selected', true);
							$('#' + id + ' option[value="' + val + '"]').change();
						}
					}
				}
				else if(val != null && val != ''){
					if(id.indexOf('_edad') > 0 && id != 'prima_met99_edad_conyuge'){
						//console.log(id + ' ' + val);
						var checkid = id.split('_');
						checkid = checkid[0] + '_' + checkid[1];
						if($('#' + checkid).prop('checked')){
							that.val(val);
							that.change();
						}
					}
				}
			});
		}
		else{
			$('#prima_prima').val(200);
			$('#prima_prima').change();
		}
	}
}


$(document).on('change','#met99_ocupacion', function(){
	var tmp = $(this).val();
	var json = JSON.parse(tmp.replace(/'/g, '"'));
	$('#met99_suscripcion').html(ocupSus[json.id]);
	$('#met99_suscripcion_txt').val(ocupSus[json.id]);
});

$(document).on('change', '#met99_edad', function(){
	var edad = $(this).val();
	console.log("edad: " + edad);
	if(isNaN(edad) || edad == "" || edad < 15){
		$(this).val(15);
	}
	else if(edad > 70){
		$(this).val(70);
	}
	else if(!(edad % 1 === 0)){
		edad = parseInt(edad);
		$(this).val(edad);
	}
	calcularEdad();
});

$(document).on('change', '#met99_sexo', function(){
	calcularEdad();
});

$(document).on('change', '#met99_fuma', function(){
	calcularEdad();
});


function calcularEdad(){
	var edad = $('#met99_edad').val();
	var sexo = $('#met99_sexo').val();
	var fuma = $('#met99_fuma').val();
	var edad_cal = edad;
	if(sexo == 2 && fuma == 1){
		edad_cal = edad - 2;
	}
	else if(sexo == 1 && fuma == 2){
		edad_cal = edad - 3;
	}
	else if(sexo == 1 && fuma == 1){
		edad_cal = edad - 5;
	}
	if(edad_cal < 15){
		edad_cal = 15;
	}
	$('#met99_edad_calculada').val(edad_cal);
}

$(document).on('click', '#btnLimpiar', function(){
	$('#nombre').val('');
	$('#met99_edad').val('15');
	$('#met99_sexo').val(1).change();
	$('#met99_fuma').val(1).change();
	$('#met99_ocupacion :nth-child(1)').prop('selected', true).change();
	localStorage.removeItem('MET99_prima');
	localStorage.removeItem('MET99_sa');
});

$(document).on('click', '#btnLimpiarSA', function(){
	localStorage.removeItem('MET99_sa');
	cotizaciones_met99_sa();
});

$(document).on('click', '#btnLimpiarPrima', function(){
	localStorage.removeItem('MET99_prima');
	cotizaciones_met99_prima();
});

function cotizaciones_met99(){
	var html = '';
	html += '<div style="display:inline-block; width:100%;">';
	html += '<div style="float:left;">';
	html += '<h2>COTIZACI&Oacute;N NUEVA MET99</h2>';
	html += '</div>';
	html += '<div id="wrapperBtnSimple"> ';
	html += '<div class="btnSimple">';
	html += '<a href="#" class="linkJS" id="btnLimpiar"></a>';
	html += '<img src="img/limpiar_w.png" />';
	html += '<a>LIMPIAR</a>';
	html += '</div>';
	html += '<div class="btnSimple">';
	html += '<img src="img/next_w.png" />';
	html += '<a class="linkJS" id="btn_met99_prima" href="cotizaciones_met99_prima.html"></a>';
	html += '<a>POR PRIMA</a>';
	html += '</div>';
	html += '<div class="btnSimple">';
	html += '<img src="img/next_w.png" />';
	html += '<a id="btn_met99_sa" class="linkJS" href="cotizaciones_met99_sa.html"></a>';
	html += '<a>POR SA</a>';
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
	html += '<td><span><input type="tel" id="met99_edad" class="formulario txtedad" value="15" inputmode="numeric" pattern="[0-9]*" /></span></td>';
	/*html += '<td><select name="met99_edad" id="met99_edad">';
	for(var i = 15; i <= 70; i++){
		html += '<option value="' + i + '">' + i + '</option>';
	}
	html += '</select></td>';*/
	html += '</tr>';
	html += '<tr style="display:none;">';
	html += '<td style="max-width:200px"><a>Edad calculada</a></td>';
	html += '<td><span><input type="text" id="met99_edad_calculada" disabled/></span></td>';
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Sexo</a></td>';
	html += '<td>';
	html += '<select name="met99_sexo" id="met99_sexo">';
	html += '<option value="1">Femenino</option>';
	html += '<option value="2">Masculino</option>';
	html += '</select>';
	html += '</td>';
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Fuma</a></td>';
	html += '<td>';
	html += '<select name="met99_fuma" id="met99_fuma">';
	html += '<option value="1">NO</option>';
	html += '<option value="2">SI</option>';
	html += '</select>';
	html += '</td>';
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Ocupaci&oacute;n</a></td>';
	html += '<td>';
	html += '<select name="met99_ocupacion" id="met99_ocupacion">';
	html += '</select>';
	html += '</td>';
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Suscripci&oacute;n</a></td>';
	html += '<td><span><a id="met99_suscripcion"></a></span><input type="hidden" name="met99_suscripcion_txt" id="met99_suscripcion_txt"></td>';
	html += '</tr>';
	html += '</table>';
	html += '</div>';
	$('#content').html(html);
	$('#alertMsg').html('Cargando informaci&oacute;n');
	$('#loader').show();
	dbTrans = 1;
	db.transaction(function(tx){
		//var q = "SELECT id, descripcion, tipo, BAS, TIBA, CII, BIT, BGE, GFA FROM VIDA_Ocupaciones ORDER BY descripcion";
		var q = "SELECT id, descripcion, tipo, BAS, TIBA, CII, BIT FROM VIDA_Ocupaciones ORDER BY descripcion";
		tx.executeSql(q, [], function(tx, res){
			var len = res.rows.length;
			var opt = '';
        	for (var i=0; i<len; i++){
        		//opt += '<option value="' + res.rows.item(i).id_ocupacion + '">' + res.rows.item(i).descripcion + '</option>';
        		//opt += '<option value="' + res.rows.item(i).id + '">' + res.rows.item(i).descripcion + '</option>';
        		ocupSus[res.rows.item(i).id] = res.rows.item(i).tipo;
        		if(i == 0){
        			$('#met99_suscripcion').html(res.rows.item(i).tipo);
        			$('#met99_suscripcion_txt').val(res.rows.item(i).tipo);
        		}
        		var val = '{';
        		val += '\'id\' : ' + res.rows.item(i).id + ',';
        		//ocupaciones += '"descripcion" : "' + res.rows.item(i).descripcion + '",';
        		//ocupaciones += '"tipo" : "' + res.rows.item(i).tipo + '",';
        		val += '\'BAS\' : ' + res.rows.item(i).BAS + ',';
        		val += '\'TIBA\' : ' + res.rows.item(i).TIBA + ',';
        		val += '\'CII\' : ' + res.rows.item(i).CII + '';
        		//val += '\'BIT\' : ' + res.rows.item(i).BIT + ',';
        		//val += '\'BGE\' : ' + res.rows.item(i).BGE + ',';
        		//val += '\'GFA\' : ' + res.rows.item(i).GFA + '';
        		val += '}'; 
        		opt += '<option value="' + val + '">' + res.rows.item(i).descripcion + '</option>';
        	}
        	//ocupaciones = ocupaciones.substring(0, ocupaciones.length - 1);
        	//ocupaciones += ']';
        	//ocupaciones = JSON.parse(ocupaciones);
        	$('#met99_ocupacion').html(opt);
        	//console.log(ocupSus);
        	checkDbTrans();
			$('#loader').hide();
		}, errorDefault);
	});
	calcularEdad();
}


function cotizaciones_met99_resumen(){
	$('#alertMsg').html('Cargando informaci&oacute;n');
	$('#loader').show();
	var id = localStorage.getItem('idResumenM99');
	db.transaction(function(tx){
		var q = "SELECT form FROM kc_cotizaciones WHERE rowid = " + id;
		tx.executeSql(q, [], function(tx, res){
			var json = JSON.parse(res.rows.item(0).form);
			localStorage.setItem('MET99_temp', JSON.stringify(json));
			var html = '';
			html += '<div style="display:inline-block; width:100%;">';
			html += '<div style="float:left;">';
			html += '<h2>RESUMEN DE LA COTIZACI&Oacute;N</h2>';
			html += '</div>';
			html += '<div id="wrapperBtnSimple">';
			html += '<div class="btnSimple">';
			html += '<img src="img/agenda_w.png" />';
			html += '<a class="link"  href="agenda_agendar.html?n=' + json.MET99.nombre + '&m=Cotización"></a>';
			html += '<a>AGENDAR</a>';
			html += '</div>';
			html += '<div class="btnSimple">';
			html += '<img src="img/next_w.png" />';
			html += '<a class="linkJS btnEnviarCoti" tipocotizacion="Met99" href="#" id="btnEnviarMet99"></a>';
			html += '<a>ENVIAR</a>';
			html += '</div>';
			html += '<div class="btnSimple">';
			html += '<a class="link" href="proyeccion_financiera.html"></a>';
			html += '<a>PROYECCI&Oacute;N FINANCIERA</a>';
			html += '</div>';			
			html += '</div>';
			html += '</div>';
			html += '<div class="parrafo">';
			html += '<div style="background:#8fc6e8; padding:5px 10px;">';
			html += '<a style="font-weight:bold;">Datos generales</a>';
			html += '</div>';
			html += '<table cellspacing="0" style="width:100%;">';
			html += '<tr>';
			html += '<td style="width:34%"><a>Edad</a></td>';
			html += '<td><a>' + json.MET99.met99_edad + '</a></td>';
			html += '</tr>';
			html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
			html += '<td><a>Sexo</a></td>';
			html += '<td><a>' + json.MET99.met99_sexo_txt + '</a></td>';
			html += '</tr>';
			html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
			html += '<td><a>Fuma</a></td>';
			html += '<td><a>' + json.MET99.met99_fuma_txt + '</a></td>';
			html += '</tr>';
			html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
			html += '<td><a>Ocupaci&oacute;n</a></td>';
			html += '<td><a>' + json.MET99.met99_ocupacion_txt + '</a></td>';
			html += '</tr>';
			html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
			html += '<td><a>Suscripci&oacute;n</a></td>';
			html += '<td><a>' + json.MET99.met99_suscripcion_txt + '</a></td>';
			html += '</tr>';
			html += '</table>';
			html += '</div>';
			
			htmlCob = '<div class="parrafo">';
			htmlCob += '<div style="background:#8fc6e8; padding:5px 10px;">';
			htmlCob += '<a style="font-weight:bold;">Prima total</a>';
			htmlCob += '</div>';
			htmlCob += '<table cellspacing="0" style="width:100%;">';
			htmlCob += '<tr>';
			htmlCob += '<td style="width:34%"><a>DIARIA</a></td>';
			htmlCob += '<td style="width:33%"><a>QUINCENAL</a></td>';
			htmlCob += '<td style="width:33%"><a>MENSUAL</a></td>';
			htmlCob += '</tr>';
			htmlCob += '<tr>';
			var prima_anual_total = parseFloat(json.coberturas.prima_anual_total);
			var prima_excedente_total = parseFloat(json.coberturas.prima_excedente_total);
			var pat = prima_anual_total + prima_excedente_total;
			htmlCob += '<td><a>$' + addCommas((pat/360).toFixed(2)) + '</a></td>';
			htmlCob += '<td><a>$' + addCommas((pat/24).toFixed(2)) + '</a></td>';
			htmlCob += '<td><a>$' + addCommas((pat/12).toFixed(2)) + '</a></td>';
			htmlCob += '</tr>';
			htmlCob += '</table>';
			htmlCob += '</div>';
			htmlCob += '<div class="parrafo">';
			htmlCob += '<div style="background:#8fc6e8; padding:5px 10px;">';
			htmlCob += '<a style="font-weight:bold;">Coberturas</a>';
			htmlCob += '</div>';
			htmlCob += '<table cellspacing="0" style="width:100%;">';
			htmlCob += '<tr>';
			htmlCob += '<td style="width:34%"><a>NOMBRE DE LA COBERTURA</a></td>';
			htmlCob += '<td style="width:33%"><a>SUMA ASEGURADA</a></td>';
			htmlCob += '<td style="width:33%"><a>EXTRA PRIMA</a></td>';
			htmlCob += '<td style="width:33%"><a>PRIMA TOTAL</a></td>';
			htmlCob += '</tr>';
			htmlCob += '<tr>';
			var ep = parseFloat(json.coberturas.bas_ep);
			var extraprima = parseFloat(json.coberturas.bas) * ep / 12000;
			htmlCob += '<td><a>BAS</a></td>';
			htmlCob += '<td><a>$' + addCommas(json.coberturas.bas) + '</a></td>';
			htmlCob += '<td><a>$' + addCommas(extraprima.toFixed(2)) + '</a></td>';
			htmlCob += '<td><a>$' + addCommas((json.coberturas.bas_pa/12).toFixed(2)) + '</a></td>';
			htmlCob += '</tr>';
			var ep_total = extraprima;
			for(var k in json.coberturas){
				if(k.indexOf('_pa') > 0 && k != 'bas_pa'){
					var cob = k.replace('_pa','');
					if(json.coberturas[cob] != 'false'){
						var sa = parseFloat(json.coberturas[cob + '_txt']);
						if(json.coberturas[cob + '_ep'] != undefined && json.coberturas[cob + '_ep'] != ''){
							prima = parseFloat(json.coberturas[cob + '_pa']);
							if(parseFloat(json.coberturas[cob + '_ep']) == 0){
								ep = 0
							}
							else{
								ep = prima / (12 * parseFloat(json.coberturas[cob + '_ep']));
							}
						}
						else{
							ep = 0;
							prima = parseFloat(json.coberturas[cob + '_pa']);
						}
						ep_total += ep;
						htmlCob += '<tr>';
						htmlCob += '<td><a style="text-transform:uppercase;">' + cob + '</a></td>';
						htmlCob += '<td><a>$' + addCommas(sa.toFixed(2)) + '</a></td>';
						htmlCob += '<td><a>$' + addCommas(ep.toFixed(2)) + '</a></td>';
						htmlCob += '<td><a>$' + addCommas((prima/12).toFixed(2)) + '</a></td>';
						htmlCob += '</tr>';
					}
				}
			}
			htmlCob += '</table>';
			htmlCob += '</div>';
			
			htmlDatos = '<div class="parrafo">';
			htmlDatos += '<div style="background:#8fc6e8; padding:5px 10px;">';
			htmlDatos += '<a style="font-weight:bold;">Datos de la cotizaci&oacute;n</a>';
			htmlDatos += '</div>';
			htmlDatos += '<table cellspacing="0" style="width:100%;">';
			htmlDatos += '<tr>';
			htmlDatos += '<td style="width:20%"><a>PLAN</a></td>';
			htmlDatos += '<td style="width:20%"><a>PRIMA EXCEDENTE</a></td>';
			htmlDatos += '<td style="width:20%"><a>PRIMA</a></td>';
			htmlDatos += '<td style="width:20%"><a>EXTRA PRIMA</a></td>';
			htmlDatos += '<td style="width:20%"><a>PRIMA TOTAL</a></td>';
			htmlDatos += '</tr>';
			htmlDatos += '<tr>';
			htmlDatos += '<td ><a>MET99</a></td>';
			htmlDatos += '<td><a>$' + addCommas(json.coberturas.prima_excedente_total) + '</a></td>';
			htmlDatos += '<td><a>$' + addCommas(parseFloat(json.coberturas.prima_anual_total).toFixed(2)) + '</a></td>';
			htmlDatos += '<td><a>$' + addCommas(ep_total.toFixed(2)) + '</a></td>';
			htmlDatos += '<td><a>$' + addCommas((parseFloat(json.coberturas.prima_anual_total) + parseFloat(json.coberturas.prima_excedente_total)).toFixed(2)) + '</a></td>';
			htmlDatos += '</tr>';
			htmlDatos += '</table>';
			htmlDatos += '</div>';
			$('#content').html(html + htmlDatos + htmlCob);
			$('#loader').hide();
		});
	});
}

function cotizaciones_met99_pf(){
	var json = JSON.parse(localStorage.getItem('MET99_temp'));
	//console.log(json);
	var html = '';
	html += '<div style="display:inline-block; width:100%;">';
	html += '<h2>PROYECCI&Oacute;N FINANCIERA DE VALOR EN EFECTIVO</h2>';
	html += '</div>';
	html += '<table cellspacing="0" style="width:100%;">';
	html += '<tr style="background:#8fc6e8; font-weight:bold; font-size:13px; text-align:center;">';
	html += '<td>A&Ntilde;O DE VIGENCIA<br/>DEL SEGURO</td>';
	html += '<td>SUMA ASEGURADA<br/>ALCANZADA</td>';
	html += '<td>PRIMA ANUAL</td>';
	html += '<td>VALOR EFECTIVO AL<br/>FINAL DEL A&Ntilde;O</td>';
	html += '<td>FONDO DE<br/>INVERSI&Oacute;N</td>';
	html += '<td>SA POR<br/>FALLECIMIENTO</td>';
	html += '</tr>';
	var sa = parseFloat(parseFloat(json.coberturas.bas).toFixed(2));
	/*for(var k in json.coberturas){
		if(k.indexOf('_pa') > 0 && k != 'bas_pa'){
			var cob = k.replace('_pa','');
			if(json.coberturas[cob] != 'false'){
				sa += parseFloat(parseFloat(json.coberturas[cob+'_txt']).toFixed(2));
			}
		}
	}*/
	var saTxt = addCommas(sa);
	var pa = parseFloat(json.coberturas.prima_anual_total) + parseFloat(json.coberturas.prima_excedente_total.replace(/,/g,''));
	//var pa = parseFloat(json.coberturas.bas_pa) + parseFloat(json.coberturas.prima_excedente_total.replace(/,/g,''));
	var paTxt = addCommas(pa);
	
	for(var i = 1; i <= 20; i++){
		html += '<tr style="font-size:13px; text-align:center;">';
		html += '<td>' + i + '</td>';
		html += '<td>' + saTxt + '</td>';
		html += '<td>' + paTxt + '</td>';
		var res = (proyeccionFinanciera.reserva[(i*12)-1] > 0 ? proyeccionFinanciera.reserva[(i*12)-1] : 0);
		var inv = proyeccionFinanciera.inversion[(i*12)-1];
		html += '<td>' + addCommas(res) + '</td>';
		html += '<td>' + addCommas(inv) + '</td>';
		html += '<td>' + addCommas((sa + res + inv).toFixed(2)) + '</td>';
		html += '</tr>';
	}
	html += '</table>';
	$('#content').html(html);
	/*
			var html = '';
			html += '<div style="display:inline-block; width:100%;">';
			html += '<h2>PROYECCI&Oacute;N FINANCIERA DE VALOR EN EFECTIVO</h2>';
			html += '</div>';
			html += '<div class="parrafo" style="width:100%; overflow-x:scroll;">';
			html += '<table cellspacing="0">';
			html += '<tr style="background:#8fc6e8; font-weight:bold; font-size:14px; text-align:center;">';
			html += '<td>A&ntilde;o</td>';
			html += '<td>Mes</td>';
			html += '<td>E.calculo</td>';
			html += '<td>E.real</td>';
			html += '<td>E.conyuge</td>';
			html += '<td>E.adicional</td>';
			html += '<td>E.Cac1</td>';
			html += '<td>E.Cac2</td>';
			html += '<td>E.Cac3</td>';
			html += '<td>E.AP1</td>';
			html += '<td>E.AP2</td>';
			html += '<td>E.AP3</td>';
			html += '<td>E.AP4</td>';
			html += '<td>E.GFC1</td>';
			html += '<td>E.GFC2</td>';
			html += '<td>E.GFC3</td>';
			html += '<td>C.Cat</td>';
			html += '<td>C.Bcacy</td>';
			html += '<td>C.Cac1</td>';
			html += '<td>C.Cac2</td>';
			html += '<td>C.Cac3</td>';
			html += '<td>C.AP1</td>';
			html += '<td>C.AP2</td>';
			html += '<td>C.AP3</td>';
			html += '<td>C.AP4</td>';
			html += '<td>PC</td>';
			html += '<td>P.E.BIT</td>';
			html += '<td>P.E.CII</td>';
			html += '<td>P.E.CMA</td>';
			html += '<td>P.E.CAT</td>';
			html += '<td>P.E.BCACY</td>';
			html += '<td>P.E.CAC1</td>';
			html += '<td>P.E.CAC2</td>';
			html += '<td>P.E.CAC3</td>';
			html += '<td>P.E.APT</td>';
			html += '<td>P.E.AP1</td>';
			html += '<td>P.E.AP2</td>';
			html += '<td>P.E.AP3</td>';
			html += '<td>P.E.AP4</td>';
			html += '<td>P.E.Excedente</td>';
			html += '<td>P.E.Total</td>';
			html += '<td>Gadm</td>';
			html += '<td>Gadq</td>';
			html += '<td>GadqExc</td>';
			html += '<td>Sobrante</td>';
			html += '<td>Sobrate P.E.</td>';
			html += '<td>Facsel</td>';
			html += '<td>qTit</td>';
			html += '<td>qReal</td>';
			html += '<td>qConyuge</td>';
			html += '<td>qBac</td>';
			html += '<td>qCII</td>';
			html += '<td>qTIBA</td>';
			html += '<td>qCMA</td>';
			html += '<td>qGE</td>';
			html += '<td>qGFH</td>';
			html += '<td>qBIT</td>';
			html += '<td>qCAT</td>';
			html += '<td>qBCACY</td>';
			html += '<td>qCAC1</td>';
			html += '<td>qCAC2</td>';
			html += '<td>qCAC3</td>';
			html += '<td>qGFC1</td>';
			html += '<td>qGFC2</td>';
			html += '<td>qGFC3</td>';
			html += '<td>saBIT</td>';
			html += '<td>M.BAS</td>';
			html += '<td>M.GFA</td>';
			html += '<td>M.GE</td>';
			html += '<td>M.BACY</td>';
			html += '<td>M.BAC</td>';
			html += '<td>M.GFC</td>';
			html += '<td>M.CMA</td>';
			html += '<td>M.CII</td>';
			html += '<td>M.TIBA</td>';
			html += '<td>M.BIT</td>';
			html += '<td>M.GFH</td>';
			html += '<td>M.CAT</td>';
			html += '<td>M.BCACY</td>';
			html += '<td>M.CAC1</td>';
			html += '<td>M.CAC2</td>';
			html += '<td>M.CAC3</td>';
			html += '<td>M.APTotal</td>';
			html += '<td>M.GFC1</td>';
			html += '<td>M.GFC2</td>';
			html += '<td>M.GFC3</td>';
			html += '<td>PFT</td>';
			html += '<td>CPMN</td>';
			html += '<td>COI</td>';
			html += '<td>Reserva</td>';
			html += '<td>Inversion</td>';
			html += '</tr>';
			for(var i = 0; i < 240; i++){
				html += '<tr style="font-size:12px; text-align:right;">';
				for(var k in proyeccionFinanciera){
					html += '<td>' + addCommas(proyeccionFinanciera[k][i]) + '</td>';
				}
				html += '</tr>';
			}
			html += '</table>';
			html += '</div>';
			$('#content').html(html);
	*/
}