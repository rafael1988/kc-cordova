function postventa(){
	var id =  parseInt(localStorage.getItem('idCartera'));
	var tipo = localStorage.getItem('tipoCartera');
	db.transaction(function(tx){
		//var q = 'SELECT Nombre_Asegurado, Correo_Electronico, RFC, Poliza FROM ' + tipo + '_Carteras WHERE id_poliza = ' + id + ' LIMIT 1';   
		var q = 'SELECT * FROM Carteras_Maestro WHERE CAST(id_poliza AS String) = "' + id + '" AND Linea_Negocio = "' + tipo + '"';
		console.log(q);                 
		tx.executeSql(q, [], function(tx,res){
			var html = '';
			html +='<h2>SERVICIOS POSTVENTA</h2>';
			html +='<div class="parrafo">';
			html +='<div style="background:#8fc6e8; padding:5px 10px;">';
			html +='<a style="font-weight:bold;">Datos del asegurado</a>';
			html +='</div>';
			html +='<table cellspacing="0" style="width:100%;">';
			html +='<tr>';
			html +='<td style="max-width:200px"><a>Nombre</a></td>';
			html +='<td><a>' + res.rows.item(0).Nombre + '</a></td>';
			html +='</tr>';
			html +='<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
			html +='<td><a>Correo electronico</a></td>';
			html +='<td><a>' + formatNull(res.rows.item(0).Correo_Electronico) + '</td>';
			html +='</tr>';
			html +='<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
			html +='<td><a>RFC</a></td>';
			html +='<td><a>' + res.rows.item(0).RFC + '</a></td>';
			html +='</tr>';
			html +='<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
			html +='<td><a>Póliza</a></td>';
			html +='<td><a id="poliza">' + formatNull(res.rows.item(0).Poliza) + '</a></td>';
			html +='</tr>';
			html +='<tr>';
			html +='<td><a>Retenedor</a></td>';
			html +='<td><a>' + formatNull(res.rows.item(0).Nombre_Retenedor) + '</a></td>';
			html +='</tr>';
			html +='</table>';
			html +='</div>';
			html +='<ul id="buttonsCoti" style="width:120px;">';
			html +='<li>';
			html +='<div class="btnSugeridos">';
			html +='<a class="linkJS" id="btnDuplicadoPoliza" href="#"></a>';
			html +='<img src="img/mail.png"/>';
			html +='<a>DUPLICADO DE P&Oacute;LIZA ' + tipo + '</a>';
			html +='</div>';
			html +='</li>';
			/*html +='<li>';
			html +='<div class="btnSugeridos">';
			html +='<a class="link" href="#"></a>';
			html +='<img src="img/mail.png"/>';
			html +='<a>&Uacute;LTIMO INCREMENTO ' + tipo + '</a>';
			html +='</div>';
			html +='</li>';
			html +='<li>';
			html +='<div class="btnSugeridos">';
			html +='<a class="link" href="#"></a>';
			html +='<img src="img/mail.png"/>';
			html +='<a>&Uacute;LTIMA INCLUSI&Oacute;N ' + tipo + '</a>';
			html +='</div>';
			html +='</li>';
			html +='<li>';
			html +='<div class="btnSugeridos">';
			html +='<a class="link" href="#"></a>';
			html +='<img src="img/mail.png"/>';
			html +='<a>&Uacute;LTIMO RETIRO ' + tipo + '</a>';
			html +='</div>';
			html +='</li>';*/
			html +='</ul>';
			
			$('#content').html(html);
		});
	});
}

$(document).on('keydown', '#mailPostventa', function(e){
	if(e.which == 32)
		e.preventDefault();
});
$(document).on('click', '#postCorreo', function(){
	$('#mailPostventa').prop('disabled', false);
});

$(document).on('click', '#postDescarga', function(){
	$('#mailPostventa').prop('disabled', true);
});

$(document).on('click', '#closePostventa', function(){
	closePostventa();
});

function closePostventa(){
	$('#postventaForm').hide();
	$('#enviosBackground').hide();
}

$(document).on('click', '#btnDuplicadoPoliza', function(){
	$('#postCorreo').prop('disabled', false);
	$('#postDescarga').prop('disabled', false);
	$('#postventaForm').show();
	$('#enviosBackground').show();
});

$(document).on('click', '#confirmPostventa', function(){
	var mail = $('#mailPostventa').val();
	console.log($('#postCorreo').prop('checked'));
	if($('#postCorreo').prop('checked') && (mail == '' || !validateEmail(mail))){
		alert("Correo invalido.");
	}
	else{
		closePostventa();
		$('#alertMsg').html('Obteniendo informaci&oacute;n...');
		$('#loader').show();
		var poliza = $('#poliza').html();
		var token = JSON.parse(localStorage.getItem('datosAgente')).Token;
		var datos = {
			Token: token,
			Pagina: 1,
			fecha_actualizacion: poliza
		};
		console.log(token);
		console.log(poliza);
		var callback = function(){
			if(checkConnection() == Connection.NONE){
				$('#loader').hide();
				alert("Es necesario que cuentes con una conexion de internet.");
			}
			else{
				$.ajax({
					//url: 'http://187.174.229.88/triton/datos/ObtenDetallesPoliza',
					url: 'http://tritonv2.grupokc.com.mx/triton/datos/ObtenDetallesPoliza',
					data: datos,
					dataType: 'jsonp',
					timeout: 30000,
					success: function(d){
						d = JSON.parse(d);
						console.log(JSON.stringify(d));
						if(d.data.length > 0){
							if($('#postCorreo').prop('checked')){
								$('#alertMsg').html('Enviando correo...');
								var url = d.data[0].documento_URL_EnviaCorreo + '&Token=' + token + '&EmailEnvio=' + mail + '&callback=?'
								console.log(url);
								$.ajax({
									url: url,
									dataType: 'jsonp',
									timeout: 10000,
									//jsonpCallback: postventaHandler,
									success: function(d){
										$('#loader').hide();
										d = JSON.parse(d);
										if(d.data == "OK"){
											alert("El documento ha sido enviado.");
										}
										else{
											alert('No se ha podido enviar el documento por correo.');
										}
									},
									error: function(){
										$('#loader').hide();
										alert('Ha ocurrido un error, no se ha podido enviar el documento por correo.');
									}
								});
							}
							else{
								$('#loader').hide();
								var url = d.data[0].documento_URL + '&Token=' + token 
								//var callback2 = function(){
									cordova.InAppBrowser.open(url, "_system");
								//};
								//cordovaReady(callback2);
							}
						}
						else{
							$('#loader').hide();
							alert("No existen documentos disponibles para esta persona");
						}
					},
					error: function(){
						$('#loader').hide();
						alert('No se han podido obtener los documentos. Verifica que tu conexion a internet sea estable.');
					}
				});
			}
		};
		cordovaReady(callback);
	}
});