$(document).on('click', '.btnAgendarVS', function(){
	var parent = $(this).parent().parent().parent().parent().children('.datos');
	var n = parent.children('.vsWrapperNombre');
	var m = parent.children('.vsWrapperMotivo');
	visitaServicioAgendar(n.children('.vsNombre').html(), m.children('.vsMotivo').html(), m.children('.vsIdMotivo').val(), $(this).attr('idagenda'));
});

$(document).on('click', '#btnBackVS', function(){
	visitasServicio();
});

$(document).on('click', '#btnGuardarAgendaVS', function(){
	if($('#agenda_fecha').val() == '' || $('#agenda_lugar').val() == ''){
		alert("Todos los campos son obligatorios.");
	}
	else{
		$('#alertMsg').html('Registrando cita...');
		$('#loader').show();
		var estatus = $(this).attr('idestatus');
		var json = localStorage.getItem('datosAgente');
		json = JSON.parse(json);
		//var url = 'http://187.174.229.88/triton/datos/AgendasDVS/';
		var url = 'http://tritonv2.grupokc.com.mx/triton/datos/AgendasDVS/';
		var hora = $('#agenda_hora').val();
		var tmp = hora.split(":");
		var h = tmp[0];
		var uso = ':00 a.m.';
		if(parseInt(tmp[0]) > 12){
			h = parseInt(tmp[0]) - 12;
			h = "0" + h;
			uso = ":00 p.m.";
		}
		else if(parseInt(tmp[0]) < 10){
			h = tmp[0];
		}
		hora = h + ":" + tmp[1] + uso;
		var fechaTmp = $('#agenda_fecha').val().split("/");
		var fechaFormat = fechaTmp[2] + '-' + fechaTmp[1] + '-' + fechaTmp[0];
		//var fecha = fechaFormat + ' ' + hora;
		var fecha = $('#agenda_fecha').val() + ' ' + hora;
		var DetallesVisitaServicio = {
			Id_Agenda: $('#idagenda').val(),
			Fecha: fecha,
			Duracion: $('#agenda_duracion').val(),
			Lugar: $('#agenda_lugar').val(),
			Id_Estatus_Visita: estatus
		};
	
		var datos = {
			Token: json.Token,
			DetallesVisitaServicio: JSON.stringify([DetallesVisitaServicio])
		};
		console.log(datos);
		var callback = function(){
			var conn = checkConnection(); //kc.js
			if(conn == Connection.NONE){
				if(estatus == 1){
					guardarCita($('#agenda_nombre').val(), $('#agenda_motivo').val(), fechaFormat, $('#agenda_hora').val(), $('#agenda_duracion').val(), $('#agenda_lugar').val(), JSON.stringify(datos),0);            
					db.transaction(function(tx){
						var q = 'DELETE FROM Agendas WHERE Id_Agenda = ' + $('#idagenda').val();
						console.log(q);
						tx.executeSql(q, [], function(){
							visitasServicio(); //incluye loader.hide
						});
					});
				}
				else{
					reagendarCita($('#agenda_nombre').val(), $('#agenda_motivo').val(), fechaFormat, $('#agenda_hora').val(), $('#agenda_duracion').val(), $('#agenda_lugar').val(), JSON.stringify(datos), $('#idcita').val(),0);            
				}
			}
			else{
				$.ajax({
					url: url, 
					dataType: 'jsonp',
					timeout: 10000,
					data: datos,
					type: 'POST',
					success: function(d){
						d = JSON.parse(d);
						console.log(d);
						if(d.success == true && d.data == "OK"){
							if(estatus == 1){
								guardarCita($('#agenda_nombre').val(), $('#agenda_motivo').val(), fechaFormat, $('#agenda_hora').val(), $('#agenda_duracion').val(), $('#agenda_lugar').val(), JSON.stringify(datos),1);            
								db.transaction(function(tx){
									var q = 'DELETE FROM Agendas WHERE Id_Agenda = ' + $('#idagenda').val();
									console.log(q);
									tx.executeSql(q, [], function(){
										visitasServicio(); //incluye loader.hide
									});
								});
							}
							else{
								reagendarCita($('#agenda_nombre').val(), $('#agenda_motivo').val(), fechaFormat, $('#agenda_hora').val(), $('#agenda_duracion').val(), $('#agenda_lugar').val(), JSON.stringify(datos), $('#idcita').val(),1);            
							}
						}
						else{
							if(estatus == 1){
								guardarCita($('#agenda_nombre').val(), $('#agenda_motivo').val(), fechaFormat, $('#agenda_hora').val(), $('#agenda_duracion').val(), $('#agenda_lugar').val(), JSON.stringify(datos),0);            
								db.transaction(function(tx){
									var q = 'DELETE FROM Agendas WHERE Id_Agenda = ' + $('#idagenda').val();
									console.log(q);
									tx.executeSql(q, [], function(){
										$('#loader').hide();
										alert("La cita no ha podido ser agendanda.");
										visitasServicio(); //incluye loader.hide
									});
								});
							}
							else{
								reagendarCita($('#agenda_nombre').val(), $('#agenda_motivo').val(), fechaFormat, $('#agenda_hora').val(), $('#agenda_duracion').val(), $('#agenda_lugar').val(), JSON.stringify(datos), $('#idcita').val(),0);            
							}
						}
					}
				});
			}
		};
		cordovaReady(callback); //kc.js
	}
});

function visitasServicio(){
	$('#alertMsg').html('Obteniendo visitas de servicio...');
	$('#loader').show();
	db.transaction(function(tx){
		var q = 'SELECT Id_Agenda, Nombre_Asegurado, Numero_Poliza, Vigencia, Descripcion AS Motivo, m.Id_Motivo_Visita FROM Agendas AS a LEFT JOIN CAT_Motivo_Visita AS m ON a.Id_Motivo_Visita = m.Id_Motivo_Visita';
		tx.executeSql(q, [], function(tx, res){
			var html = '';
			html += '<h2>VISITAS DE SERVICIO</h2>';
			html += '<div style="margin-top:5px;">';
			html += '<ul id="visitaServicio" style="margin:0;">';
			for(var i = 0; i < res.rows.length; i++){
				html += '<li>';
				html += '<div class="wrapperResultados">';
				html += '<div class="datos">';
				html += '<span class="vsWrapperNombre" style="display:block">';
				html += '<a style="font-weight:bold;" class="vsNombre">' + res.rows.item(i).Nombre_Asegurado + '</a>';
				html += '</span>';
				html += '<span style="display:block">';
				html += '<a>P&oacute;liza: </a><a style="font-weight:bold;">' + res.rows.item(i).Numero_Poliza + '</a>';
				html += '</span>';
				html += '<span style="display:block">';
				var vigencia = res.rows.item(i).Vigencia.split("/");
				html += '<a>Vigencia: </a><a style="font-weight:bold;">' + vigencia[1] + '/' + vigencia[0] + '/' + vigencia[2] + '</a>';
				html += '</span>';
				html += '<span class="vsWrapperMotivo" style="display:block">';
				html += '<a>Motivo: </a><a style="font-weight:bold;" class="vsMotivo">' + res.rows.item(i).Motivo + '</a><input type="hidden" class="vsIdMotivo" value="' + res.rows.item(i).Id_Motivo_Visita + '">';
				html += '</span>';
				html += '</div>';
				html += '<ul id="buttonVisitaServicio">';
				html += '<li>';
				html += '<div class="button">';
				html += '<a idagenda="' + res.rows.item(i).Id_Agenda + '" class="btnAgendarVS linkJS"></a>';
				html += '<img src="img/agenda.png"/>';
				html += '<a>AGENDAR</a>';
				html += '</div>';
				html += '</li>';
				html += '</ul>';
				html += '</div>';
				html += '</li>';
			}
			html += '</ul>';
			html += '</div>';
			$('#content').html(html);
			$('#loader').hide();
		});
	}, errorDefault);
}

function visitaServicioAgendar(n, m, idm, id){
	var html = '';
	html += '<div style="display:inline-block; width:100%;">';
	html += '<div style="float:left;">';
	html += '<h2>VISITAS DE SERVICIO</h2>';
	html += '</div>';
	html += '<div id="wrapperBtnSimple">';
	html += '<div class="btnSimple">';
	html += '<img src="img/back_w.png" />';
	html += '<a class="linkJS" id="btnBackVS" href="#"></a>';
	html += '<a>REGRESAR</a>';
	html += '</div>';
	html += '<div class="btnSimple">';
	html += '<img src="img/agenda_w.png" />';
	html += '<a class="linkJS" id="btnGuardarAgendaVS" idestatus="1" href="#"></a>';
	html += '<a>GUARDAR</a>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html +='<div class="parrafo">';
	html +='<div style="background:#8fc6e8; padding:5px 10px;">';
	html +='<a style="font-weight:bold;">Datos de la cita</a>';
	html +='</div>';
	html +='<table cellspacing="0" cellpadding="5" style="width:100%;">';
	html +='<tr>';
	html +='<td style="max-width:200px"><a>Nombre</a></td>';
	html +='<td><span><a>' + n + '</a><input type="hidden" name="agenda_nombre" id="agenda_nombre" value="' + n + '" /><input type="hidden" name="idagenda" id="idagenda" value="' + id + '"></span></td>';
	html +='</tr>';
	html +='<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html +='<td><a>Motivo de la cita</a></td>';
	html +='<td><span><a>' + m + '</a><input type="hidden" name="agenda_motivo" id="agenda_motivo" value="' + idm + '"></span></td>';
	html +='</tr>';
	html +='<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html +='<td><a>Dia</a></td>';
	html +='<td><span><input name="agenda_fecha" id="agenda_fecha" class="formulario" readonly/></span></td>';
	html +='</tr>';
	html +='<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html +='<td><a>Hora</a></td>';
	html +='<td>';
	html += '<select name="agenda_hora" id="agenda_hora">';
	for(var i = 7; i < 20; i++){
		html += '<option value="' + (i < 10 ? '0'+i : i) + ':00' + '">' + (i < 10 ? '0'+i : i) + ':00' + '</option>';
		html += '<option value="' + (i < 10 ? '0'+i : i) + ':30' + '">' + (i < 10 ? '0'+i : i) + ':30' + '</option>';
	}
	html += '</select>';
	html += '</td>';
	html +='</tr>';
	html +='<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html +='<td><a>Duracion</a></td>';
	html +='<td>';
	html += '<select name="agenda_duracion" id="agenda_duracion">';
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			if(!(i == 0 && j == 0)){
				var min = j*15;
				if(min == 0) min = '00';
				html += '<option value="' + i + ':' + min + '">' + i + ':' + min + '</option>';
			}
		}
	}
	html += '</select>';
	html += '</td>';
	html +='</tr>';
	html +='<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html +='<td><a>Lugar</a></td>';
	html +='<td><span><input type="text" name="agenda_lugar" id="agenda_lugar" class="formulario" /></span></td>';
	html +='</tr>';
	html +='</table>';
	html +='</div>';
			
	$('#content').html(html);
	$('#agenda_fecha').datepicker({dateFormat:"dd/mm/yy"});
}

function visitaServicioReagendar(n, f, h, d, idm, m, ag, l, id){
	var html = '';
	html += '<div style="display:inline-block; width:100%;">';
	html += '<div style="float:left;">';
	html += '<h2>VISITAS DE SERVICIO</h2>';
	html += '</div>';
	html += '<div id="wrapperBtnSimple">';
	html += '<div class="btnSimple">';
	html += '<img src="img/back_w.png" />';
	html += '<a class="linkJS" id="btnBackReagendar" href="#"></a>';
	html += '<a>REGRESAR</a>';
	html += '</div>';
	html += '<div class="btnSimple">';
	html += '<img src="img/agenda_w.png" />';
	html += '<a class="linkJS" id="btnGuardarAgendaVS" idestatus="2" href="#"></a>';
	html += '<a>GUARDAR</a>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html +='<div class="parrafo">';
	html +='<div style="background:#8fc6e8; padding:5px 10px;">';
	html +='<a style="font-weight:bold;">Datos de la cita</a>';
	html +='</div>';
	html +='<table cellspacing="0" cellpadding="5" style="width:100%;">';
	html +='<tr>';
	html +='<td style="max-width:200px"><a>Nombre</a></td>';
	html +='<td><span><a>' + n + '</a><input type="hidden" name="agenda_nombre" id="agenda_nombre" value="' + n + '" /><input type="hidden" name="idagenda" id="idagenda" value="' + ag + '"><input type="hidden" name="idcita" id="idcita" value="' + id + '"></span></td>';
	html +='</tr>';
	html +='<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html +='<td><a>Motivo de la cita</a></td>';
	html +='<td><span><a>' + m + '</a><input type="hidden" name="agenda_motivo" id="agenda_motivo" value="' + idm + '"></span></td>';
	html +='</tr>';
	html +='<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html +='<td><a>Dia</a></td>';
	var fecha = f.split("-");
	html +='<td><span><input name="agenda_fecha" id="agenda_fecha" class="formulario" value="' + fecha[0] + '/' + fecha[1] + '/' + fecha[2] + '" readonly/></span></td>';
	html +='</tr>';
	html +='<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html +='<td><a>Hora</a></td>';
	html +='<td>';
	html += '<select name="agenda_hora" id="agenda_hora">';
	for(var i = 7; i < 20; i++){
		html += '<option value="' + (i < 10 ? '0'+i : i) + ':00' + '">' + (i < 10 ? '0'+i : i) + ':00' + '</option>';
		html += '<option value="' + (i < 10 ? '0'+i : i) + ':30' + '">' + (i < 10 ? '0'+i : i) + ':30' + '</option>';
	}
	html += '</select>';
	html += '</td>';
	html +='</tr>';
	html +='<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html +='<td><a>Duracion</a></td>';
	html +='<td>';
	html += '<select name="agenda_duracion" id="agenda_duracion">';
	for(var i = 0; i < 4; i++){
		for(var j = 0; j < 4; j++){
			if(!(i == 0 && j == 0)){
				var min = j*15;
				if(min == 0) min = '00';
				html += '<option value="' + i + ':' + min + '">' + i + ':' + min + '</option>';
			}
		}
	}
	html += '</select>';
	html += '</td>';
	html +='</tr>';
	html +='<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html +='<td><a>Lugar</a></td>';
	html +='<td><span><input type="text" name="agenda_lugar" id="agenda_lugar" class="formulario" value="' + l + '" /></span></td>';
	html +='</tr>';
	html +='</table>';
	html +='</div>';
			
	$('#content').html(html);
	$('#agenda_duracion').val(d);
	$('#agenda_hora').val(h);
	$('#agenda_fecha').datepicker({dateFormat:"dd/mm/yy"});
}