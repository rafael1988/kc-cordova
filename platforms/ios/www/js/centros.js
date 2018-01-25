function centros(){
	$('#alertMsg').html('Obteniendo informaci&oacute;n...');
	$('#loader').show();
	var html = '';
	html += '<h2 style="border-bottom-style:solid; border-width:1px; border-color:#939597;">CENTROS DE TRABAJO</h2>';
	html += '<div style="border-bottom-style:solid; border-width:1px; border-color:#939597; padding:10px 0;">';
	html += '<div>';
	html += '<select name="centros_retenedor" id="centros_retenedor"><option value="0">Seleccionar retenedor...</option></select>';
	html += '</div>';
	html += '<div>';
	html += '<select name="centros_retenedor_centros" id="centros_retenedor_centros"><option value="0">Seleccionar centro de trabajo...</option></select>';
	html += '</div>';
	html += '</div>';	
	html += '<div id="wrapperDetallesCentro" style="padding-top:15px;">';
	html += '<div id="detallesCentro">';
	html += '</div>';
	html += '<div id="mapaWrapper">';
	html += '</div>';
	html += '</div>';
	$('#content').html(html);
	db.transaction(function(tx){
		//var q = "SELECT Id_Retenedor, Nombre FROM VIDA_Retenedores ORDER BY nombre";
		var q = "SELECT DISTINCT Id_Retenedor, Nombre FROM VIDA_Retenedores ORDER BY nombre";
		tx.executeSql(q, [], function(tx,res){

			console.log('VIDA_Retenedores - res.rows.length: ' + res.rows.length);

			var opt = '<option value="0">Seleccionar retenedor...</option>';
			for(var i = 0; i < res.rows.length; i++){
				opt += '<option value="' + res.rows.item(i).Id_Retenedor + '">' + res.rows.item(i).Nombre + '</option>';
				//console.log('value: ' + res.rows.item(i).Id_Retenedor + ' : ' + res.rows.item(i).Nombre );
			}
			$('#centros_retenedor').html(opt);
			//var opt1 = $('#centros_retenedor option').first().val();
			//console.log(opt1);
			$('#loader').hide();
		});
	}, function(){
		$('#loader').hide();
	});
}

$(document).on('change', '#centros_retenedor', function(){
	var id = $(this).val();

	console.log('id#centros_retenedor: ' + id);

	if(id == 0){
		$('#centros_retenedor_centros').html('<option value="0">Seleccionar centro de trabajo...</option>');
	}
	else{
		$('#alertMsg').html('Actualizando informaci&oacute;n...');
		$('#loader').show();
		db.transaction(function(tx){

			/*strSQL = "SELECT Id_Retenedores_Centro_Trabajo, Id_Retenedor, Nombre, Direccion, Colonia, Delegacion, CP, Telefono1, Telefono2, Telefono3, Longitud, Latitud FROM VIDA_Retenedores_Centro_Trabajo ";
			console.log(strSQL);
			tx.executeSql(strSQL, [], function(tx,r){

				console.log('VIDA_Retenedores_Centro_Trabajo - r.rows.length: ' + r.rows.length);

				for(var i = 0; i < r.rows.length; i++) {
					console.log("VIDA_Retenedores_Centro_Trabajo: " +
						r.rows.item(i).Id_Retenedores_Centro_Trabajo + " : " +
						r.rows.item(i).Id_Retenedor + " : " +
						r.rows.item(i).Nombre + " : " +
						r.rows.item(i).Colonia + " : " +
						r.rows.item(i).Delegacion + " : " +
						r.rows.item(i).CP + " : " +
						r.rows.item(i).Telefono1 + " : " +
						r.rows.item(i).Telefono2 + " : " +
						r.rows.item(i).Telefono3 + " : " +
						r.rows.item(i).Longitud + " : " +
						r.rows.item(i).Latitud
					);
					//idpoliza = r.rows.item(i).id_poliza;
				}
			}, errorDefault);*/


			//var q = "SELECT Id_Retenedores_Centro_Trabajo, Id_Retenedor, Nombre, Direccion, Colonia, Delegacion, CP, Telefono1, Telefono2, Telefono3, Longitud, Latitud FROM VIDA_Retenedores_Centro_Trabajo WHERE Id_Retenedor = " + id + " ORDER BY Nombre";
			var q = "SELECT Id_Retenedores_Centro_Trabajo, Id_Retenedor, Nombre, Direccion, Colonia, Delegacion, CP, Telefono1, Telefono2, Telefono3, Longitud, Latitud FROM VIDA_Retenedores_Centro_Trabajo WHERE CAST(Id_Retenedor AS String) = " + id + " ORDER BY Nombre";
			tx.executeSql(q, [], function(tx, res){


				console.log('res.rows.length: ' + res.rows.length);


				var opt = '<option value="0">Seleccionar centro de trabajo...</option>';
				for(var i = 0; i < res.rows.length; i++){
					var obj = {
						nombre: res.rows.item(i).Nombre,
						direccion: res.rows.item(i).Direccion + ', <br>' + res.rows.item(i).Colonia + ', <br>' + res.rows.item(i).Delegacion + ', <br>' + res.rows.item(i).CP,
						telefonos: res.rows.item(i).Telefono1 + ',<br>' + res.rows.item(i).Telefono2 + ',<br>' + res.rows.item(i).Telefono3,
						lat: res.rows.item(i).Latitud,
						lng: res.rows.item(i).Longitud
					};
					opt += "<option value='" + JSON.stringify(obj) + "'>" + res.rows.item(i).Nombre + "</option>";
				}
				$('#centros_retenedor_centros').html(opt);
				$('#loader').hide();
			});
		}, errorDefault);
	}
});

$(document).on('change', '#centros_retenedor_centros', function(){
	var val = $(this).val();
	if(val != 0){
		var json = JSON.parse(val);
		var html = '';
		html += '<a style="font-weight:bold;">' + json.nombre + '</a>';
		html += '<br/>';
		html += '<a>' + json.direccion + '</a>';
		html += '<br/><br/>';
		html += '<a>Tel&eacute;fonos:</a><br>';
		html += '<a>' + json.telefonos + '</a><br/>';
		html += '<a href="#" class="linkJS" lat="' + json.lat + '" lng="' + json.lng + '" id="centrosGM" style="font-weight:bold; color:#00529b; position:relative; width:auto; height:auto; top:auto; left:auto;">GOOGLE MAPS</a>';
		$('#detallesCentro').html(html);
	}
});

$(document).on('click', '#centrosGM', function(){
	var url = "http://maps.google.com/maps?q=loc:" + $(this).attr('lat') + ',' + $(this).attr('lng');
	var callback = function(){
		//cordova.InAppBrowser.open(url, "_system");
		window.open(url, '_blank');
	};
	cordovaReady(callback);
});