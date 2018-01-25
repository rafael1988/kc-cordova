function documentacion(){
	$('#alertMsg').html('Obteniendo informaci&oacute;n...');
	$('#loader').show();
	var html = '';
	html += '<h2 style="border-bottom-style:solid; border-width:1px; border-color:#939597;">DOCUMENTACI&Oacute;N</h2>';
	html += '<div style="border-bottom-style:solid; border-width:1px; border-color:#939597; padding:10px 0;">';
	html += '<div>';
	html += '<select name="documentacion_retenedor" id="documentacion_retenedor"><option value="0">Seleccionar retenedor...</option></select>';
	html += '</div>';
	html += '<div>';
	html += '<select name="documentacion_retenedor_centros" id="documentacion_retenedor_centros"><option value="0">Seleccionar centro de trabajo...</option></select>';
	html += '</div>';
	html += '</div>';	
	html += '<div id="wrapperDocumentosRetenedor" style="padding-top:15px;">';
	//html += '<ul id="documentosRetenedor">';
	html += '<ul id="visitaServicio">';
	html += '</ul>';
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
			$('#documentacion_retenedor').html(opt);
			//var opt1 = $('#centros_retenedor option').first().val();
			//console.log(opt1);
			$('#loader').hide();
		});
	}, function(){
		$('#loader').hide();
	});
}

$(document).on('change', '#documentacion_retenedor', function(){
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

			//var q = "SELECT Id_Retenedores_Centro_Trabajo, Nombre FROM VIDA_Retenedores_Centro_Trabajo WHERE Id_Retenedor = " + id + " ORDER BY Nombre";
			var q = "SELECT Id_Retenedores_Centro_Trabajo, Nombre FROM VIDA_Retenedores_Centro_Trabajo WHERE CAST(Id_Retenedor AS String) = " + id + " ORDER BY Nombre";
			tx.executeSql(q, [], function(tx, res){


				console.log('res.rows.length: ' + res.rows.length);


				var opt = '<option value="0">Seleccionar centro de trabajo...</option>';
				for(var i = 0; i < res.rows.length; i++){
					opt += "<option value='" + res.rows.item(i).Id_Retenedores_Centro_Trabajo + "'>" + res.rows.item(i).Nombre + "</option>";
				}
				$('#documentacion_retenedor_centros').html(opt);
				$('#loader').hide();
			});
		}, errorDefault);
	}
});

$(document).on('change', '#documentacion_retenedor_centros', function(){
	var id = $(this).val();
	if(id != 0){
		$('#alertMsg').html('Actualizando informaci&oacute;n...');
		$('#loader').show();
		db.transaction(function(tx){
			var q = "SELECT documento_nombre, documento_Descripcion, documento_Detalle, documento_URL FROM Retenedores_Documentos WHERE Id_Retenedores_Centro_Trabajo = " + id + " ORDER BY documento_Detalle";
			tx.executeSql(q, [], function(tx, res){
				var html = '';
				for(var i = 0; i < res.rows.length; i++){
					/*html += '<li>';
					html += '<div>';
					html += '<a href="#" class="linkJS documentoRetenedores" doc_url="' + res.rows.item(i).documento_URL + '"></a>';
					html += '<a>' + res.rows.item(i).documento_Detalle + '</a>';
					html += '</div>';
					html += '</li>';*/
					html += '<li>';
					html += '<div class="wrapperResultados">';
					html += '<div class="datos">';
					html += '<span style="display:block">';
					html += '<a>Nombre: </a>';
					html += '<a style="font-weight:bold;">' + res.rows.item(i).documento_nombre + '</a>';
					html += '</span>';
					html += '<span style="display:block">';
					html += '<a>Descripci&oacute;n: </a>';
					html += '<a style="font-weight:bold;">' + res.rows.item(i).documento_Descripcion + '</a>';
					html += '</span>';
					html += '<span style="display:block">';
					html += '<a>Detalle: </a>';
					html += '<a style="font-weight:bold;">' + res.rows.item(i).documento_Detalle + '</a>';
					html += '</span>';
					html += '</div>';
					html += '<ul id="buttonVisitaServicio">';
					html += '<li>';
					html += '<div class="button">';
					html += '<a href="#" doc_url="' + res.rows.item(i).documento_URL + '" class="documentoRetenedores linkJS"></a>';
					html += '<img style="width:40px;" src="img/btn_resultados.png"><a>DESCARGAR</a></div></li></ul></div></li>';
				}
				$('#visitaServicio').html(html);
				$('#loader').hide();
			});
		}, errorDefault);
	}
	else{
		$('#visitaServicio').empty();
	}
});

$(document).on('click', '.documentoRetenedores', function(){
	var url = $(this).attr('doc_url');
	console.log(url);
	var callback = function(){
		var conn = checkConnection(); //kc.js
		if(conn == Connection.NONE){
			alert("Es necesario que tengas una conexion a internet para poder descargar el documento.");
		}
		else{
			var token = JSON.parse(localStorage.getItem('datosAgente')).Token;
			cordova.InAppBrowser.open(url + "&Token=" + token, "_system");
		}
	};
	cordovaReady(callback); //kc.js
});