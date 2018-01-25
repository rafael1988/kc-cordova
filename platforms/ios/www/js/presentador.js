function presentador(){
	$('#alertMsg').html('Obteniendo informaci&oacute;n...');
	$('#loader').show();
	var html = '';
	html += '<h2 style="border-bottom-style:solid; border-width:1px; border-color:#939597;">DOCUMENTACI&Oacute;N</h2>';
	html += '<div id="wrapperDocumentosPresentador" style="padding-top:15px;">';
	//html += '<ul id="documentosPresentador">';
	html += '<ul id="visitaServicio">';
	html += '</ul>';
	html += '</div>';
	$('#content').html(html);
	db.transaction(function(tx){
		var q = "SELECT documento_nombre, documento_Descripcion, documento_Detalle, documento_URL FROM Presentador_Documentos ORDER BY documento_Detalle";
		tx.executeSql(q, [], function(tx, res){
			var html = '';
			for(var i = 0; i < res.rows.length; i++){
				/*html += '<li>';
				html += '<div>';
				html += '<a href="#" class="linkJS documentoPresentadores" doc_url="' + res.rows.item(i).documento_URL + '"></a>';
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
				html += '<a href="#" doc_url="' + res.rows.item(i).documento_URL + '" class="documentoPresentadores linkJS"></a>';
				html += '<img style="width:40px;" src="img/btn_resultados.png"><a>DESCARGAR</a></div></li></ul></div></li>';
			}
			$('#visitaServicio').html(html);
			$('#loader').hide();
		});
	}, function(){
		$('#loader').hide();
	});
}

$(document).on('click', '.documentoPresentadores', function(){
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