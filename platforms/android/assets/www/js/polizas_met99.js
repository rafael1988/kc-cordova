function met99(){
	//var id =  parseInt(localStorage.getItem('idCartera'));
	var id =  localStorage.getItem('idCartera');
	$('#loader').show();
	$('#alertMsg').html('Obteniendo informaci&oacute;n...');
	db.transaction(function(tx){
		var q = 'SELECT * FROM VIDA_Carteras WHERE CAST(id_poliza AS String) = "' + id + '" LIMIT 1';
		console.log(q);
		tx.executeSql(q, [], function(tx, res){
			//console.log(res.rows.length);
			var html = '';
			if(res.rows.length > 0){
				html += '<h2>MET99</h2>';
				html += '<div class="parrafo">';
				html += '<div style="background:#8fc6e8; padding:5px 10px;">';
				html += '<a style="font-weight:bold;">Datos generales del asegurado</a>';
				html += '</div>';
				html += '<table cellspacing="0" style="width:100%;">';
				html += '<tr>';
				html += '<td style="width:18%; min-width:120px;"><a>Nombre</a></td>';
				html += '<td><a>' + res.rows.item(0).Nombre + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>RFC</a></td>';
				html += '<td><a>' + res.rows.item(0).RFC + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Direcci&oacute;n particular</a></td>';
				html += '<td><a>' + res.rows.item(0).Domicilio + ', ' + res.rows.item(0).Ciudad + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Tel&eacute;fono</a></td>';
				html += '<td><a>' + res.rows.item(0).Telefono + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Correo electr&oacute;nico</a></td>';
				html += '<td><a>' + formatNull(res.rows.item(0).Correo_Electronico) + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Domicilio de trabajo</a></td>';
				html += '<td><a></a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Perfil de Facebook</a></td>';
				html += '<td><a>' + formatNull(res.rows.item(0).Perfil_Facebook) + '</a></td>';
				html += '</tr>';
				html += '</table>';
				html += '</div>';
				html += '<div class="parrafo">';
				html += '<div style="background:#8fc6e8; padding:5px 10px; position:relative">';
				html += '<a href="#" class="linkJS toggleParrafo"></a>';
				html += '<a style="font-weight:bold;">Datos generales de la póliza</a>';
				html += '<div class="arrowWrapper">';
				html += '<img src="img/arrow.png" />';
				html += '</div>';
				html += '</div>';
				html += '<table cellspacing="0" style="width:100%;" class="toggler">';
				html += '<tr>';
				html += '<td style="width:18%; min-width:120px;"><a>N&uacute;mero de p&oacute;liza</a></td>';
				html += '<td><a>' + res.rows.item(0).Poliza + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Plan</a></td>';
				html += '<td><a>' + res.rows.item(0).Plan + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Emisi&oacute;n</a></td>';
				html += '<td><a>' + stripTime(res.rows.item(0).Fecha_Emision) + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Suma asegurada b&aacute;sica</a></td>';
				html += '<td><a>$' + addCommas(res.rows.item(0).Suma_Asegurada) + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Prima</a></td>';
				html += '<td><a>$' + addCommas(res.rows.item(0).Prima) + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Prima excedente</a></td>';
				html += '<td><a>$' + addCommas(res.rows.item(0).Prima_Excedente) + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Retenedor</a></td>';
				html += '<td><a>' + res.rows.item(0).Nombre_Retenedor + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Concepto de descuento</a></td>';
				html += '<td><a>' + res.rows.item(0).Concepto_Descuento + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Estatus de la p&oacute;liza</a></td>';
				html += '<td><a>' + res.rows.item(0).Estatus_Poliza + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Referencia bancaria</a></td>';
				html += '<td><a>' + res.rows.item(0).Digito_Verificador + '</a></td>';
				html += '</tr>';
				html += '</table>';
				html += '</div>';
				html += '<div class="parrafo">';
				html += '<div style="background:#8fc6e8; padding:5px 10px; position:relative">';
				html += '<a href="#" class="linkJS toggleParrafo"></a>';
				html += '<a style="font-weight:bold;">Información financiera</a>';
				html += '<div class="arrowWrapper">';
				html += '<img src="img/arrow.png" />';
				html += '</div>';
				html += '</div>';
				html += '<table cellspacing="0" style="width:100%;" class="toggler">';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td style="width:18%; min-width:120px;"><a>Fecha del &uacute;ltimo descuento</a></td>';
				html += '<td><a>' + stripTime(res.rows.item(0).Fecha_Ultimo_Descuento) + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Monto de la reserva</a></td>';
				html += '<td><a>$' + addCommas(res.rows.item(0).Reserva) + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Reserva al 60%</a></td>';
				html += '<td><a>$' + addCommas((res.rows.item(0).Reserva * .6).toFixed(2)) + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Inversi&oacute;n</a></td>';
				html += '<td><a>$' + addCommas(res.rows.item(0).Fondo_Inversion) + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>RP</a></td>';
				html += '<td><a>' + addCommas(res.rows.item(0).Recibos_Pendientes) + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>PP</a></td>';
				html += '<td><a>$' + addCommas(res.rows.item(0).Primas_Pendientes) + '</a></td>';
				html += '</tr>';
				html += '</table>';
				html += '</div>';
				html += '<div class="parrafo">';
				html += '<div style="background:#8fc6e8; padding:5px 10px; position:relative">';
				html += '<a href="#" class="linkJS toggleParrafo"></a>';
				html += '<a style="font-weight:bold;">&Uacute;ltimo incremento</a>';
				html += '<div class="arrowWrapper">';
				html += '<img src="img/arrow.png" />';
				html += '</div>';
				html += '</div>';
				html += '<table cellspacing="0" style="width:100%;" class="toggler">';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td style="width:18%; min-width:120px;"><a>Fecha de emisi&oacute;n</a></td>';
				html += '<td><a>' + stripTime(res.rows.item(0).Fecha_Emision_Incremento) + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Suma asegurada</a></td>';
				html += '<td><a>' + addCommas(res.rows.item(0).Suma_Asegurada_Incremento) + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Prima</a></td>';
				html += '<td><a>$' + addCommas(res.rows.item(0).Prima_Incremento) + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Nombre del agente</a></td>';
				html += '<td><a>' + formatNull(res.rows.item(0).Nombre_Agente_Incremento) + '</a></td>';
				html += '</tr>';
				html += '</table>';
				html += '</div>';	
				html += '<div class="parrafo">';
				html += '<div style="background:#8fc6e8; padding:5px 10px; position:relative">';
				html += '<a href="#" class="linkJS toggleParrafo"></a>';
				html += '<a style="font-weight:bold;">&Uacute;ltimo retiro de dividendos</a>';
				html += '<div class="arrowWrapper">';
				html += '<img src="img/arrow.png" />';
				html += '</div>';
				html += '</div>';
				html += '<table cellspacing="0" style="width:100%;" class="toggler">';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td style="width:18%; min-width:120px;"><a>Fecha de emisi&oacute;n</a></td>';
				html += '<td><a>' + stripTime(res.rows.item(0).Fecha_Emision_Dividendos) + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Importe</a></td>';
				html += '<td><a>$' + addCommas(res.rows.item(0).Importe_Dividendos) + '</a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Nombre del agente</a></td>';
				html += '<td><a>' + formatNull(res.rows.item(0).Nombre_Agente_Dividendos) + '</a></td>';
				html += '</tr>';
				html += '</table>';
				html += '</div>';
				html += '<div class="parrafo">';
				html += '<div style="background:#8fc6e8; padding:5px 10px; position:relative">';
				html += '<a href="#" class="linkJS toggleParrafo"></a>';
				html += '<a style="font-weight:bold;">&Uacute;ltimo retiro de inversi&oacute;n</a>';
				html += '<div class="arrowWrapper">';
				html += '<img src="img/arrow.png" />';
				html += '</div>';
				html += '</div>';
				html += '<table cellspacing="0" style="width:100%;" class="toggler">';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td style="width:18%; min-width:120px;"><a>Fecha de emisi&oacute;n</a></td>';
				html += '<td><a></a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Importe</a></td>';
				html += '<td><a></a></td>';
				html += '</tr>';
				html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
				html += '<td><a>Nombre del agente</a></td>';
				html += '<td><a></a></td>';
				html += '</tr>';
				html += '</table>';
				html += '</div>';
				var idpoliza = res.rows.item(0).id_poliza;
				q = 'SELECT * FROM VIDA_Carteras_Coberturas WHERE id_poliza = ' + idpoliza;
				console.log(q);
				tx.executeSql(q, [], function(tx,res){
					html += '<div class="parrafo">';
					html += '<div style="background:#8fc6e8; padding:5px 10px; position:relative">';
					html += '<a href="#" class="linkJS toggleParrafo"></a>';
					html += '<a style="font-weight:bold;">Coberturas</a>';
					html += '<div class="arrowWrapper">';
					html += '<img src="img/arrow.png" />';
					html += '</div>';
					html += '</div>';
					html += '<table cellspacing="0" style="width:100%;" class="toggler">';
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
					html += '</div>';
					$('#content').html(html);	
					$('#loader').hide();
				}, errorDefault);
			}
			else{
				html += '<div class="noData">';
				html += '<a>No se encontraron datos sobre esta poliza.</a>';
				html += '</div>';
				$('#content').html(html);	
				$('#loader').hide();
			}
		}, errorDefault);
	}, errorCB);
}