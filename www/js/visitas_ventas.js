$(document).on('click', '#btnSigVV', function(){
	var q =  'SELECT Nombre, vc.id_poliza, vc.Poliza, Domicilio, vc.Prima, Reserva, cat.clave_cobertura AS cat, ';
		q += 'gfa.clave_cobertura AS gfa, ge.clave_cobertura AS ge FROM VIDA_Carteras AS vc ';
		q += 'LEFT JOIN VIDA_Carteras_Coberturas AS cat ON (vc.id_poliza = cat.id_poliza AND cat.clave_cobertura = "VCAT") ';
		q += 'LEFT JOIN VIDA_Carteras_Coberturas AS gfa ON (vc.id_poliza = gfa.id_poliza AND gfa.clave_cobertura = "VGFT") ';
		q += 'LEFT JOIN VIDA_Carteras_Coberturas AS ge ON (vc.id_poliza = ge.id_poliza AND ge.clave_cobertura = "VGE") ';
	var clause = false;
	var where = '';
	if($('#vv_prima').val() != ''){
		where += ' vc.Prima ' + $('#vv_mm_prima').val() + ' ' + $('#vv_prima').val() + ' AND';
		clause = true;
	}
	if($('#vv_reserva').val() != ''){
		where += ' Reserva ' + $('#vv_mm_reserva').val() + ' ' + $('#vv_reserva').val() + ' AND';
		clause = true;
	}
	if($('#vv_retenedor').val() != 0){
		where += ' Id_Retenedor = ' + $('#vv_retenedor').val() + ' AND';
		clause = true;
	}
	if($('#vv_coberturas_cat').prop('checked')){
		where += ' cat IS NULL AND';
		clause = true;
	}
	else if($('#vv_coberturas_gfa').prop('checked')){
		where += ' gfa IS NULL AND';
		clause = true;
	}
	else if($('#vv_coberturas_ge').prop('checked')){
		where += ' ge IS NULL AND';
		clause = true;
	}
	if(clause){
		q += 'WHERE' + where;
		q = q.substring(0, q.length - 3);	
	}
	q += ' LIMIT 50';
	console.log(q);
	visitasVentasClientes(q);
});

$(document).on('click', '#btnBackVV', function(){
	visitasVentas();
});

$(document).on('click', '.agendarVV', function(){
	//var id = $(this).attr('idpoliza');
	var parent = $(this).parent().parent().parent().parent().children('.datos');
	var nombre = parent.children('.vvNombreWrapper').children('.vvNombre').html();
	var poliza = parent.children('.vvPolizaWrapper').children('.vvPoliza').html();
	var lugar = parent.children('.vvLugarWrapper').children('.vvLugar').html();
	visitasVentasAgendar(nombre, poliza, lugar);
});

$(document).on('click', '#btnGuardarAgendaVV', function(){
	if($('#agenda_fecha').val() == '' || $('#agenda_lugar').val() == ''){
		alert("Todos los campos son obligatorios.");
	}
	else{
		$('#alertMsg').html('Registrando cita...');
		$('#loader').show();
		var estatus = $(this).attr('idestatus');
		var json = localStorage.getItem('datosAgente');
		json = JSON.parse(json);
		//var url = 'http://187.174.229.88/triton/datos/AgendasDVV/';
		var url = 'http://tritonv2.grupokc.com.mx/triton/datos/AgendasDVV/';
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
		var tmpD = new Date();
		tmpD.setDate(d.getDate() + 5);
		var m = tmpD.getMonth() + 1;
		var vigencia = tmpD.getFullYear() + '' + (m < 10 ? '0'+ m : m) + '' + (tmpD.getDate() < 10 ? '0'+tmpD.getDate() : tmpD.getDate());
		var fechaTmp = $('#agenda_fecha').val().split("/");
		var fechaFormat = fechaTmp[2] + '-' + fechaTmp[1] + '-' + fechaTmp[0];
		//var fecha = fechaFormat + ' ' + hora;
		var fecha = $('#agenda_fecha').val() + ' ' + hora;
		var VisitaVentas = {
			Id_Agente: localStorage.getItem('com.kc.idusuario'),
			Nombre_Asegurado: $('#agenda_nombre').val(),
			Numero_Poliza: $('#agenda_poliza').val(),
			Vigencia: vigencia, //enviar fecha actual + 5 dias
			Id_Motivo_Visita: $('#agenda_motivo').val(),
			Id_Agenda_Visita: 0,
		};
		var DetallesVisitaVentas = {
			Fecha: fecha,
			Duracion: $('#agenda_duracion').val(),
			Lugar: $('#agenda_lugar').val(),
			Id_Estatus_Visita: estatus
		};
	
		var datos = {
			Token: json.Token,
			VisitaVentas: JSON.stringify([VisitaVentas]),
			DetallesVisitaVentas: JSON.stringify([DetallesVisitaVentas])
		};
		console.log(datos);
		var callback = function(){
			var conn = checkConnection(); //kc.js
			if(conn == Connection.NONE){
				if(estatus == 1)
					guardarCita($('#agenda_nombre').val(), $('#agenda_motivo').val(), fechaFormat, $('#agenda_hora').val(), $('#agenda_duracion').val(), $('#agenda_lugar').val(), JSON.stringify(datos),0);
				else
					reagendarCita($('#agenda_nombre').val(), $('#agenda_motivo').val(), fechaFormat, $('#agenda_hora').val(), $('#agenda_duracion').val(), $('#agenda_lugar').val(), JSON.stringify(datos), $('#idcita').val(),0);
				$('#loader').hide();
				alert("La cita ha sido agendada");
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
							if(estatus == 1)
								guardarCita($('#agenda_nombre').val(), $('#agenda_motivo').val(), fechaFormat, $('#agenda_hora').val(), $('#agenda_duracion').val(), $('#agenda_lugar').val(), JSON.stringify(datos),1);
							else
								reagendarCita($('#agenda_nombre').val(), $('#agenda_motivo').val(), fechaFormat, $('#agenda_hora').val(), $('#agenda_duracion').val(), $('#agenda_lugar').val(), JSON.stringify(datos), $('#idcita').val(),1);
							$('#loader').hide();
							alert("La cita ha sido agendada");
						}
						else{
							$('#loader').hide();
							alert("La cita no ha podido ser agendada.");
						}
					},
					error: function(){
						$('#loader').hide();
						alert("La cita no ha podido sincronizar con el servidor.");
						if(estatus == 1)
							guardarCita($('#agenda_nombre').val(), $('#agenda_motivo').val(), fechaFormat, $('#agenda_hora').val(), $('#agenda_duracion').val(), $('#agenda_lugar').val(), JSON.stringify(datos),0);
						else
							reagendarCita($('#agenda_nombre').val(), $('#agenda_motivo').val(), fechaFormat, $('#agenda_hora').val(), $('#agenda_duracion').val(), $('#agenda_lugar').val(), JSON.stringify(datos), $('#idcita').val(),0);
					}
				});
			}
		};
		cordovaReady(callback); //kc.js
	}
});

function visitasVentasClientes(q){
	$('#alertMsg').html('Buscando clientes...');
	$('#loader').show();
	db.transaction(function(tx){
		tx.executeSql(q, [], function(tx, res){
			$('#loader').hide();
			var html = '';
			html += '<div style="display:inline-block; width:100%;">';
			html += '<div style="float:left;">';
			html += '<h2>VISITAS DE VENTAS</h2>';
			html += '</div>';
			html += '<div id="wrapperBtnSimple">';
			html += '<div class="btnSimple">';
			html += '<img src="img/back_w.png" />';
			html += '<a class="linkJS" id="btnBackVV" href="#"></a>';
			html += '<a>REGRESAR</a>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			html += '<div>';
			html += '<ul id="busquedaCartera">';
			for(var i = 0; i < res.rows.length; i++){
				html += '<li>';
				html += '<div class="wrapperResultados">';
				html += '<div class="datos">';
				html += '<span style="display:block" class="vvNombreWrapper">';
				html += '<a style="font-weight:bold;" class="vvNombre">' + res.rows.item(i).Nombre + '</a>';
				html += '</span>';
				html += '<span style="display:block" class="vvPolizaWrapper">';
				html += '<a>P&oacute;liza: </a><a style="font-weight:bold;" class="vvPoliza">' + res.rows.item(i).Poliza + '</a>';
				html += '</span>';
				html += '<span style="display:block">';
				html += '<a>Prima: </a><a style="font-weight:bold;">$' + addCommas(res.rows.item(i).Prima) + '</a>';
				html += '</span>';
				html += '<span style="display:block">';
				html += '<a>Reserva: </a><a style="font-weight:bold;">$' + addCommas(res.rows.item(i).Reserva) + '</a>';
				html += '</span>';
				/*html += '<span style="display:block">';
				html += '<a>Vigencia: </a><a style="font-weight:bold;">VIGENCIA</a>';
				html += '</span>';*/
				html += '<span style="display:block" class="vvLugarWrapper">';
				html += '<a>Lugar: </a><a style="font-weight:bold;" class="vvLugar">' + res.rows.item(i).Domicilio + '</a>';
				html += '</span>';
				/*html += '<span style="display:block">';
				html += '<a style="color:#00529b; font-weight:bold;">GOOGLE MAPS</a>';
				html += '</span>';*/
				html += '</div>';
				html += '<ul id="buttonVisitaServicio">';
				html += '<li>';
				html += '<div class="button">';
				html += '<a href="#" class="agendarVV linkJS" idpoliza="' + res.rows.item(i).id_poliza + '" ></a>';
				html += '<img src="img/agenda.png"/>';
				html += '<a>AGENDAR</a>';
				html += '</div>';
				html += '</li>';
				html += '</ul>';
				html += '</div>';
				html += '</li>';
			}
			html += '</ul>';
			//console.log(res.rows.item(0));
			if(res.rows.length == 0){
				html += '<div class="noData">';
				html += '<a>No se encontraron clientes que cumplan los requisitos ingresados.</a>';
				html += '</div>';
			}
			html += '</div>';
			$('#content').html(html);
		});
	}, errorDefault);
}

function visitasVentasAgendar(n, p, l){
	var html = '';
	html += '<div style="display:inline-block; width:100%;">';
	html += '<div style="float:left;">';
	html += '<h2>VISITAS DE VENTAS</h2>';
	html += '</div>';
	html += '<div id="wrapperBtnSimple">';
	html += '<div class="btnSimple">';
	html += '<img src="img/back_w.png" />';
	html += '<a class="linkJS" id="btnBackVV" href="#"></a>';
	html += '<a>REGRESAR</a>';
	html += '</div>';
	html += '<div class="btnSimple">';
	html += '<img src="img/agenda_w.png" />';
	html += '<a class="linkJS" id="btnGuardarAgendaVV" idestatus="1" href="#"></a>';
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
	html +='<td><span><a>' + n + '</a><input type="hidden" name="agenda_nombre" id="agenda_nombre" value="' + n + '" /><input type="hidden" name="agenda_poliza" id="agenda_poliza" value="' + p + '"></span></td>';
	html +='</tr>';
	html +='<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html +='<td><a>Motivo de la cita</a></td>';
	html +='<td>';
	html += '<select name="agenda_motivo" id="agenda_motivo">';
	html += '<option value="1">Entrega de documentos</option>';
	html += '<option value="2">Firma de p&oacute;liza</option>';
	html += '<option value="3">A&ntilde;adir coberturas</option>';
	html += '<option value="4">Presentar productos</option>';
	html += '<option value="5">Otro</option>';
	html += '</select>';
	html += '</td>';
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
	html +='<td><span><input type="text" name="agenda_lugar" id="agenda_lugar" class="formulario" value="' + l + '" /></span></td>';
	html +='</tr>';
	html +='</table>';
	html +='</div>';
			
	$('#content').html(html);
	$('#agenda_fecha').datepicker({dateFormat:"dd/mm/yy"});
}

function visitasVentasReagendar(n, f, h, d, idm, m, p, l, id){
	var html = '';
	html += '<div style="display:inline-block; width:100%;">';
	html += '<div style="float:left;">';
	html += '<h2>VISITAS DE VENTAS</h2>';
	html += '</div>';
	html += '<div id="wrapperBtnSimple">';
	html += '<div class="btnSimple">';
	html += '<img src="img/back_w.png" />';
	html += '<a class="linkJS" id="btnBackReagendar" href="#"></a>';
	html += '<a>REGRESAR</a>';
	html += '</div>';
	html += '<div class="btnSimple">';
	html += '<img src="img/agenda_w.png" />';
	html += '<a class="linkJS" id="btnGuardarAgendaVV" idestatus="2" href="#"></a>';
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
	html +='<td><span><a>' + n + '</a><input type="hidden" name="agenda_nombre" id="agenda_nombre" value="' + n + '" /><input type="hidden" name="agenda_poliza" id="agenda_poliza" value="' + p + '"><input type="hidden" name="idcita" id="idcita" value="' + id + '"></span></td>';
	html +='</tr>';
	html +='<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html +='<td><a>Motivo de la cita</a></td>';
	html +='<td><span><a>' + m + '</a><input type="hidden" name="agenda_motivo" id="agenda_motivo" value="' + idm + '"></span></td>';
	html +='</tr>';
	html +='<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html +='<td><a>Dia</a></td>';
	var fecha = f.split("-");
	html +='<td><span><input name="agenda_fecha" id="agenda_fecha" class="formulario" value="' + fecha[2] + '/' + fecha[1] + '/' + fecha[0] + '" readonly/></span></td>';
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

function visitasVentas(){
	var html = '';
	html += '<div style="display:inline-block; width:100%;">';
	html += '<div style="float:left;">';
	html += '<h2>VISITAS DE VENTAS</h2>';
	html += '</div>';
	html += '<div id="wrapperBtnSimple">';
	html += '<div class="btnSimple">';
	html += '<img src="img/next_w.png" />';
	html += '<a class="linkJS" id="btnSigVV" href="#"></a>';
	html += '<a>SIGUIENTE</a>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '<div class="parrafo">';
	html += '<table cellspacing="0" cellpadding="5" style="width:100%;">';
	html += '<tbody>';
	html += '<tr><td></td><td></td></tr>';
	/*html += '<tr>';
	html += '<td><a>&Uacute;ltimo incremento</a></td>';
	html += '<td><span><input type="date" style="width:100%; border:none; outline:none;"/></span></td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td><a>&Uacute;ltima inclusi&oacute;n</a></td>';
	html += '<td><span><input type="date" style="width:100%; border:none; outline:none;"/></span></td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td><a>&Uacute;ltimo retiro de dividendos</a></td>';
	html += '<td><span><input type="date" style="width:100%; border:none; outline:none;"/></span></td>';
	html += '</tr>';*/
	html += '<tr>';
	html += '<td style="width:25%;"><a>Prima</a></td>';
	html += '<td>';
	html += '<select name="vv_mm_prima" id="vv_mm_prima" style="width:auto;">';
	html += '<option value=">="> &gt;= </option>';
	html += '<option value="<="> &lt;= </option>';
	html += '</select>';
	html += '<span style="display:inline;"><input type="number" id="vv_prima" name="vv_prima" class="formulario" style="width:75%;" /></span>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td><a>Reserva</a></td>';
	html += '<td>';
	html += '<select name="vv_mm_reserva" id="vv_mm_reserva" style="width:auto;">';
	html += '<option value=">="> &gt;= </option>';
	html += '<option value="<="> &lt;= </option>';
	html += '</select>';
	html += '<span style="display:inline;"><input type="number" id="vv_reserva" name="vv_reserva" class="formulario" style="width:75%;" /></span>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td><a>Retenedor</a></td>';
	html += '<td><select name="vv_retenedor" id="vv_retenedor"><option value="0">Seleccionar retenedor...</option></select></td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td><a>Asegurados</a></td>';
	html += '<td>';
	html += '<span><input type="radio" name="vv_asegurados" id="vv_asegurados_todos"/><a><label for="vv_asegurados_todos"> Todos los asegurados</label></a></span>';
	html += '<span><input type="radio" name="vv_asegurados" id="vv_asegurados_mios"/><a><label for="vv_asegurados_mios"> Mis asegurados</label></a></span>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td><a>Que no tengan las coberturas</a></td>';
	html += '<td>';
	html += '<span>';
	html += '<input type="radio" name="vv_nocoberturas" id="vv_coberturas_cat"/><a><label for="vv_coberturas_cat"> CAT</label></a>';
	html += '<input type="radio" name="vv_nocoberturas" id="vv_coberturas_gfa"/><a><label for="vv_coberturas_gfa"> GFA</label></a>';
	html += '<input type="radio" name="vv_nocoberturas" id="vv_coberturas_ge"/><a><label for="vv_coberturas_ge"> GE</label></a>';
	html += '</span>';
	html += '</td>';
	html += '</tr>';
	html += '</tbody>';
	html += '</table>';
	html += '</div>';
	$('#content').html(html);
	db.transaction(function(tx){
		var q = "SELECT Id_Retenedor, Nombre FROM VIDA_Retenedores ORDER BY Nombre";
		tx.executeSql(q, [], function(tx, res){
			var html = '<option value="0">Seleccionar retenedor...</option>';
			for(var i = 0; i < res.rows.length; i++){
				html += '<option value="' + res.rows.item(i).Id_Retenedor + '">' + res.rows.item(i).Nombre + '</option>';
			}
			$('#vv_retenedor').html(html);
		});
	});
}