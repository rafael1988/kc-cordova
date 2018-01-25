function cotizaciones_sugeridas(){
	$('#alertMsg').html('Cargando informaci&oacute;n');
	$('#loader').show();
	//var id =  parseInt(localStorage.getItem('idCartera'));
	var id =  localStorage.getItem('idCartera');
	var tipo = localStorage.getItem('tipoCartera');
	if(tipo == 'VIDA'){
		db.transaction(function(tx){
			var q = 'SELECT id_poliza, poliza, nombre FROM ' + tipo + '_Carteras WHERE CAST(id_poliza AS String) = "' + id + '" LIMIT 1';
			console.log(q);
			tx.executeSql(q, [], function(tx, res){
				var html = '';
				if(res.rows.length > 0){
					html += '<h2>COTIZACIONES SUGERIDAS</h2>';
					html += '<div class="parrafo">';
					html += '<div style="background:#8fc6e8; padding:5px 10px;">';
					html += '<a style="font-weight:bold;">Informaci&oacute;n del asegurado</a>';
					html += '</div>';
					html += '<table cellspacing="0" style="width:100%;">';
					html += '<tr>';
					html += '<td><a>Nombre</a></td>';
					html += '<td><a id="nombreWrapper">' + res.rows.item(0).Nombre + '</a><input type="hidden" id="idpoliza" value="' + res.rows.item(0).id_poliza + '"></td>';
					html += '</tr>';
					html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					html += '<td><a>MET99</a></td>';
					html += '<td><a>' + res.rows.item(0).Poliza + '</a></td>';
					html += '</tr>';
					html += '</table>';
					html += '</div>';
					var idpoliza = res.rows.item(0).id_poliza;
					q = 'SELECT * FROM VIDA_Carteras_Coberturas WHERE id_poliza = ' + idpoliza;
					//console.log(q);
					tx.executeSql(q, [], function(tx,res){
						html += '<div class="parrafo">';
						html += '<div style="background:#8fc6e8; padding:5px 10px;">';
						html += '<a style="font-weight:bold;">Coberturas</a>';
						html += '</div>';
						html += '<table cellspacing="0" style="width:100%;">';
						html += '<tr>';
						html += '<td style="width:25%"><a>COBERTURA</a></td>';
						html += '<td style="width:25%"><a>SUMA ASEGURADA</a></td>';
						html += '<td style="width:25%"><a>EXTRA PRIMA</a></td>';
						html += '<td style="width:25%"><a>PRIMA TOTAL</a></td>';
						html += '</tr>';
						for(var i = 0; i < res.rows.length; i++){
							html += '<tr>';
							html += '<td><a>' + res.rows.item(i).clave_cobertura + '</a></td>';
							html += '<td><a>$' + addCommas(res.rows.item(i).suma_asegurada) + '</a></td>';
							html += '<td><a>$' + addCommas(res.rows.item(i).extraprima) + '</a></td>';
							html += '<td><a>$' + addCommas(res.rows.item(i).prima) + '</a></td>';
							html += '</tr>';
						}
						html += '</table>';
						html += '</div>';
						html += '<ul id="buttonsCoti" style="width:120px;">';
						html += '<li>';
						html += '<div class="btnSugeridos">';
						html += '<a class="linkJS" id="btnSugMet99" href="cotizaciones_met99.html"></a>';
						html += '<img src="img/btn_sugeridos.png" />';
						html += '<a>COTIZAR MET99</a>';
						html += '</div>';
						html += '</li>';
						html += '</ul>';
						$('#content').html(html);	
						$('#loader').hide();
					});
				}
				else{
					html += '<div class="noData">';
					html += '<a>No se encontraron datos sobre esta poliza.</a>';
					html += '</div>';
					$('#content').html(html);	
					$('#loader').hide();
				}
			});
		});	
	}
	else if(tipo == 'GMM'){
		db.transaction(function(tx){
			var q = 'SELECT * FROM ' + tipo + '_Carteras WHERE Id_Poliza = ' + id + ' LIMIT 1';
			tx.executeSql(q, [], function(tx, res){
				var html = '';
				if(res.rows.length > 0){
					html += '<h2>COTIZACIONES SUGERIDAS</h2>';
					html += '<div class="parrafo">';
					html += '<div style="background:#8fc6e8; padding:5px 10px;">';
					html += '<a style="font-weight:bold;">Informaci&oacute;n de la cobertura</a>';
					html += '</div>';
					html += '<table cellspacing="0" style="width:100%;">';
					html += '<tr>';
					html += '<td><a>Nombre</a></td>';
					html += '<td><a id="nombreWrapper">' + res.rows.item(0).Nombre_Asegurado + '</a></td>';
					html += '</tr>';
					html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					html += '<td><a>GMM</a></td>';
					html += '<td><a>' + res.rows.item(0).poliza + '</a><input type="hidden" id="idpoliza" value="' + res.rows.item(0).Id_Poliza + '"></td>';
					html += '</tr>';
					html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					html += '<td><a>Plan</a></td>';
					html += '<td><a>' + res.rows.item(0).Plan + '</a></td>';
					html += '</tr>';
					html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					html += '<td><a>Deducible</a></td>';
					html += '<td><a>' + res.rows.item(0).Deducible + '</a></td>';
					html += '</tr>';
					html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					html += '<td><a>Coaseguro</a></td>';
					html += '<td><a>' + res.rows.item(0).Coaseguro + '</a></td>';
					html += '</tr>';
					html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					html += '<td><a>Forma de pago</a></td>';
					html += '<td><a>' + res.rows.item(0).FormaPago + '</a></td>';
					html += '</tr>';
					html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					html += '<td><a>Suma Asegurada</a></td>';
					html += '<td><a>$' + addCommas(res.rows.item(0).Suma_Asegurada.toFixed(2)) + '</a></td>';
					html += '</tr>';
					html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					html += '<td><a>Prima</a></td>';
					html += '<td><a>$' + addCommas(res.rows.item(0).Prima.toFixed(2)) + '</a></td>';
					html += '</tr>';
					html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					html += '<td><a>Primas pendientes</a></td>';
					html += '<td><a>$' + addCommas(res.rows.item(0).Primas_Pendientes.toFixed(2)) + '</a></td>';
					html += '</tr>';
					html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
					html += '<td><a>Estatus</a></td>';
					html += '<td><a>' + res.rows.item(0).Estatus_Polliza + '</a></td>';
					html += '</tr>';
					html += '</table>';
					html += '</div>';
					html += '<ul id="buttonsCoti" style="width:120px;">';
					html += '<li>';
					html += '<div class="btnSugeridos">';
					html += '<a class="linkJS" id="btnSugGMM" href="cotizaciones_gmm.html"></a>';
					html += '<img src="img/btn_sugeridos.png" />';
					html += '<a>COTIZAR GMM</a>';
					html += '</div>';
					html += '</li>';
					html += '</ul>';
					$('#content').html(html);	
					$('#loader').hide();
				}
				else{
					html += '<div class="noData">';
					html += '<a>No se encontraron datos sobre esta poliza.</a>';
					html += '</div>';
					$('#content').html(html);	
					$('#loader').hide();
				}
			});
		});
	}
	else{
		db.transaction(function(tx){
			var q = 'SELECT * FROM ' + tipo + '_Carteras WHERE Id_Poliza = ' + id + ' LIMIT 1';
			tx.executeSql(q, [], function(tx, res){
				var html = '';
				if(res.rows.length > 0){
					var obj = res.rows.item(0);
					html += '<h2>COTIZACIONES SUGERIDAS</h2>';
					//html += '<div class="noData">';
					//html += '<a>No existen datos para este tipo de cobertura.</a>';
					//html += '</div>';
					html += '<div class="parrafo">';
					html += '<div style="background:#8fc6e8; padding:5px 10px;">';
					html += '<a style="font-weight:bold;">Informaci&oacute;n de la cobertura</a>';
					html += '</div>';
					html += '<table cellspacing="0" style="width:100%;">';
					html += '<tr>';
					html += '<td><a>Nombre</a></td>';
					html += '<td><a id="nombreWrapper">' + obj.Nombre_Asegurado + '</a></td>';
					html += '</tr>';
					html += '<tr>';
					html += '<td><a>RFC</a></td>';
					html += '<td><a>' + obj.RFC + '</a></td>';
					html += '</tr>';
					html += '<tr>';
					html += '<td><a>N&uacute;mero de P&oacute;liza</a></td>';
					html += '<td><a>' + formatNull(obj.Poliza) + '</a><input type="hidden" id="idpoliza" value="' + obj.Id_Poliza + '"></td>';
					html += '</tr>';
					html += '<tr>';
					html += '<td><a>Fecha de emisi&oacute;n</a></td>';
					html += '<td><a>' + stripTime(obj.Fecha_Emision) + '</a></td>';
					html += '</tr>';
					html += '<tr>';
					html += '<td><a>Aseguradora</a></td>';
					html += '<td><a>' + obj.Aseguradora + '</a></td>';
					html += '</tr>';
					html += '<tr>';
					html += '<td><a>Plan</a></td>';
					html += '<td><a>' + obj.Plan + '</a></td>';
					html += '</tr>';
					html += '<tr>';
					html += '<td><a>Prima</a></td>';
					html += '<td><a>$' + addCommas(obj.Prima.toFixed(2)) + '</a></td>';
					html += '</tr>';
					html += '<tr>';
					html += '<td><a>Descripci&oacute;n del veh&iacute;culo</a></td>';
					html += '<td><a>' + obj.Marca + ' ' + obj.Tipo + ' ' + obj.Modelo + '</a></td>';
					html += '</tr>';
					html += '</table>';
					html += '</div>';
					html += '<ul id="buttonsCoti" style="width:120px;">';
					html += '<li>';
					html += '<div class="btnSugeridos">';
					html += '<a class="linkJS" id="btnSugAuto" href="cotizaciones_auto.html"></a>';
					html += '<img src="img/btn_sugeridos.png" />';
					html += '<a>COTIZAR AUTO</a>';
					html += '</div>';
					html += '</li>';
					html += '</ul>';
					$('#content').html(html);	
					$('#loader').hide();
				}
				else{
					html += '<div class="noData">';
					html += '<a>No se encontraron datos sobre esta poliza.</a>';
					html += '</div>';
					$('#content').html(html);	
					$('#loader').hide();
				}
			});
		});
	}
}