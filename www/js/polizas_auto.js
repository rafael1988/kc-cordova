function auto(){
	$('#loader').show();
	$('#alertMsg').html('Obteniendo informaci&oacute;n...');
	var html = '';
	var id =  localStorage.getItem('idCartera');
	db.transaction(function(tx){
		var q = 'SELECT * FROM AUTOS_Carteras WHERE CAST(Id_Poliza AS String) = "' + id + '" LIMIT 1';
		tx.executeSql(q, [], function(tx, res){
			if(res.rows.length > 0){
				var obj = res.rows.item(0);
				html += '<h2>AUTO</h2>';
				//html += '<div class="noData">';
				//html += '<a>No existen datos para este tipo de cobertura.</a>';
				//html += '</div>';
				html += '<div class="parrafo">';
				html += '<div style="background:#8fc6e8; padding:5px 10px;">';
				html += '<a style="font-weight:bold;">Datos generales del asegurado</a>';
				html += '</div>';
				html += '<table cellspacing="0" style="width:100%;">';
				html += '<tr>';
				html += '<td style="width:18%;"><a>Nombre</a></td>';
				html += '<td><a>' + obj.Nombre_Asegurado + '</a></td>';
				html += '</tr>';
				html += '<tr>';
				html += '<td><a>RFC</a></td>';
				html += '<td><a>' + obj.RFC + '</a></td>';
				html += '</tr>';
				html += '<tr>';
				html += '<td><a>Direcci&oacute;n particular</a></td>';
				html += '<td><a>' + obj.Domicilio + '</a></td>';
				html += '</tr>';
				html += '<tr>';
				html += '<td><a>Tel&eacute;fono</a></td>';
				html += '<td><a>' + obj.Telefono + '</a></td>';
				html += '</tr>';
				html += '<tr>';
				html += '<td><a>Correo electr&oacute;nico</a></td>';
				html += '<td><a>' + formatNull(obj.Correo_Electronico) + '</a></td>';
				html += '</tr>';
				html += '<tr>';
				html += '<td><a>Perfil de Facebook</a></td>';
				html += '<td><a>' + formatNull(obj.Perfil_Facebook) + '</a></td>';
				html += '</tr>';
				html += '</table>';
				html += '</div>';
				html += '<div class="parrafo">';
				html += '<div style="background:#8fc6e8; padding:5px 10px;">';
				html += '<a style="font-weight:bold;">Datos generales de la p&oacute;liza</a>';
				html += '</div>';
				html += '<table cellspacing="0" style="width:100%;">';
				html += '<tr>';
				html += '<td style="width:18%;"><a>N&uacute;mero de P&oacute;liza</a></td>';
				html += '<td><a>' + formatNull(obj.Poliza) + '</a></td>';
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
		}, errorDefault);
	});
}	