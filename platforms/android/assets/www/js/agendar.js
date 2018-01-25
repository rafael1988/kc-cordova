function agendar_cartera(){
	$('#alertMsg').html('Cargando informaci&oacute;n');
	$('#loader').show();
	//var id =  parseInt(localStorage.getItem('idCartera'));
	var id =  localStorage.getItem('idCartera');
	db.transaction(function(tx){
		var q = 'SELECT * FROM ' + localStorage.getItem('tipoCartera') + '_Carteras WHERE CAST(id_poliza AS String) = "' + id + '" LIMIT 1';
		//console.log(id);
		tx.executeSql(q, [], function(tx, res){
			if(res.rows.length > 0){
				var obj = res.rows.item(0);
				var html = '';
				html += '<div style="display:inline-block; width:100%;">';
				html += '<div style="float:left;">';
				html += '<h2>AGENDAR</h2>';
				html += '</div>';
				html += '<div id="wrapperBtnSimple">';
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
				html +='<td><span><a>' + (obj.Nombre == undefined ? obj.Nombre_Asegurado : obj.Nombre) + '</a><input type="hidden" name="agenda_nombre" id="agenda_nombre" value="' + (obj.Nombre == undefined ? obj.Nombre_Asegurado : obj.Nombre) + '" /><input type="hidden" name="agenda_poliza" id="agenda_poliza" value="' + (obj.Poliza == undefined ? obj.poliza : obj.Poliza) + '"></span></td>';
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
				html +='<td><span><input id="agenda_fecha" name="agenda_fecha" class="formulario" readonly/></span></td>';
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
				html +='<td><span><input type="text" name="agenda_lugar" id="agenda_lugar" class="formulario" value="' + obj.Domicilio + '" /></span></td>';
				html +='</tr>';
				html +='</table>';
				html +='</div>';
				$('#content').html(html);
				$('#agenda_fecha').datepicker({dateFormat:"dd/mm/yy"});
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

function agendar(n,m){
	var html = '';
	html += '<div style="display:inline-block; width:100%;">';
	html += '<div style="float:left;">';
	html += '<h2>AGENDAR</h2>';
	html += '</div>';
	html += '<div id="wrapperBtnSimple">';
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
	html +='<td><span><input type="text" name="agenda_nombre" id="agenda_nombre" class="formulario" value="' + n + '" /><input type="hidden" name="agenda_poliza" id="agenda_poliza" value=""></span></td>';
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
	html +='<td><span><input id="agenda_fecha" name="agenda_fecha" class="formulario" readonly/></span></td>';
	html +='</tr>';
	html +='<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html +='<td><a>Hora</a></td>';
	html +='<td>';
	html += '<select id="agenda_hora" name="agenda_hora">';
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

function guardarCita(n, m, f, h, d, l, j, s){
	if(s == 0) localStorage.setItem('com.kc.citaspendientes', '1');
	db.transaction(function(tx){
		var q = "INSERT INTO kc_agenda (nombre, motivo, fecha, hora, duracion, lugar, json, synced, estatus) VALUES ('" + n + "', " + m + ", '" + f + "', '" + h + "', '" + d + "','" + l + "', '" + j + "'," + s + ", 1)";
		console.log(q);
		tx.executeSql(q);
	});
}

function reagendarCita(n, m, f, h, d, l, j, id, s){
	if(s == 0) localStorage.setItem('com.kc.citaspendientes', '1');
	db.transaction(function(tx){
		var q = "UPDATE kc_agenda SET nombre = '" + n + "', motivo = " + m + ", fecha = '" + f + "', hora = '" + h + "', duracion = '" + d + "', lugar = '" + l + "', json = '" + j + "', synced = " + s + ", estatus = 2 WHERE rowid = " + id;
		console.log(q);
		tx.executeSql(q);
		miAgenda();
	});
}

function updateCita(id, estatus){ //cita realizada - cita cancelada | cita reagendada en  btnAgendarVV.click
	$('#alertMsg').html('Guardando cambios...');
	$('#loader').show();
	db.transaction(function(tx){
		var q = "SELECT json FROM kc_agenda WHERE rowid = " + id;
		tx.executeSql(q, [], function(tx, res){
			var json = JSON.parse(res.rows.item(0).json);
			console.log(json);
			json.Token = JSON.parse(localStorage.getItem('datosAgente')).Token;
			if(json.VisitaVentas != null && json.VisitaVentas != undefined){
				var vv = JSON.parse(json.VisitaVentas);
				console.log(vv);
				var tmpD = new Date();
				tmpD.setDate(d.getDate() + 5);
				var m = tmpD.getMonth() + 1;
				var vigencia = tmpD.getFullYear() + '' + (m < 10 ? '0'+ m : m) + '' + (tmpD.getDate() < 10 ? '0'+tmpD.getDate() : tmpD.getDate());
				vv[0].Vigencia = vigencia;
				json.VisitaVentas = JSON.stringify(vv);
				var dvv = JSON.parse(json.DetallesVisitaVentas);
				dvv[0].Id_Estatus_Visita = estatus;
				json.DetallesVisitaVentas = JSON.stringify(dvv);
				var callback = function(){
					var conn = checkConnection(); //kc.js
					if(conn == Connection.NONE){
						db.transaction(function(tx){
							q = "UPDATE kc_agenda SET json = '" + JSON.stringify(json) + "', estatus = " + estatus + ", synced = 0 WHERE rowid = " + id;
							tx.executeSql(q, [], function(tx, res){
								agendaDiaria(); //incluye loader.hide 
							});
						});
					}
					else{
						var url = 'http://187.174.229.88/triton/datos/AgendasDVV/';
						$.ajax({
							url: url, 
							dataType: 'jsonp',
							timeout: 10000,
							data: json,
							type: 'POST',
							success: function(d){
								console.log(d);
								d = JSON.parse(d);
								console.log(d);
								if(d.success == true && d.data == "OK"){
									db.transaction(function(tx){
										//q = 'DELETE FROM kc_agenda WHERE rowid = ' + id;
										q = "UPDATE kc_agenda SET json = '" + JSON.stringify(json) + "', estatus = " + estatus + ", synced = 1 WHERE rowid = " + id;
										tx.executeSql(q, [], function(tx, res){
											agendaDiaria(); //incluye loader.hide 
										});
									});
								}
								else{
									db.transaction(function(tx){
										q = "UPDATE kc_agenda SET json = '" + JSON.stringify(json) + "', estatus = " + estatus + ", synced = 0 WHERE rowid = " + id;
										tx.executeSql(q, [], function(tx, res){
											$('#loader').hide();
											alert("No se han podido guardar los cambios en el servidor.");
											agendaDiaria(); //incluye loader.hide 
										});
									});
								}
							},
							error: function(xhr, e, status){
								db.transaction(function(tx){
									q = "UPDATE kc_agenda SET json = '" + JSON.stringify(json) + "', estatus = " + estatus + ", synced = 0 WHERE rowid = " + id;
									tx.executeSql(q, [], function(tx, res){
										agendaDiaria(); //incluye loader.hide 
									});
								});
							}
						});
					}
				};
				cordovaReady(callback); //kc.js
			}
			else{
				var vs = JSON.parse(json.DetallesVisitaServicio);
				vs[0].Id_Estatus_Visita = estatus;
				json.DetallesVisitaServicio = JSON.stringify(vs);
				var callback = function(){
					var conn = checkConnection(); //kc.js
					if(conn == Connection.NONE){
						db.transaction(function(tx){
							q = "UPDATE kc_agenda SET json = '" + JSON.stringify(json) + "', estatus = " + estatus + ", synced = 0 WHERE rowid = " + id;
							tx.executeSql(q, [], function(tx, res){
								agendaDiaria(); //incluye loader.hide 
							});
						});
					}
					else{
						var url = 'http://187.174.229.88/triton/datos/AgendasDVS/';
						$.ajax({
							url: url, 
							dataType: 'jsonp',
							timeout: 10000,
							data: json,
							type: 'POST',
							success: function(d){
								d = JSON.parse(d);
								console.log(d);
								if(d.success == true && d.data == "OK"){
									db.transaction(function(tx){
										//q = 'DELETE FROM kc_agenda WHERE rowid = ' + id;
										q = "UPDATE kc_agenda SET json = '" + JSON.stringify(json) + "', estatus = " + estatus + ", synced = 1 WHERE rowid = " + id;
										tx.executeSql(q, [], function(tx, res){
											agendaDiaria(); //incluye loader.hide 
										});
									});
								}
								else{
									db.transaction(function(tx){
										q = "UPDATE kc_agenda SET json = '" + JSON.stringify(json) + "', estatus = " + estatus + ", synced = 0 WHERE rowid = " + id;
										tx.executeSql(q, [], function(tx, res){
											$('#loader').hide();
											alert("No se han podido guardar los cambios en el servidor.");
											agendaDiaria(); //incluye loader.hide 
										});
									});
								}
							},
							error: function(xhr, e, status){
								db.transaction(function(tx){
									q = "UPDATE kc_agenda SET json = '" + JSON.stringify(json) + "', estatus = " + estatus + ", synced = 0 WHERE rowid = " + id;
									tx.executeSql(q, [], function(tx, res){
										agendaDiaria(); //incluye loader.hide 
									});
								});
							}
						});
					}
				};
				cordovaReady(callback); //kc.js
			}
		});
	});
}

$(document).on('click', '.btnCitaRealizada', function(){
	var id = $(this).attr('idcita');
	updateCita(id, 3);
});

$(document).on('click', '.btnCitaCancelada', function(){
	var c = confirm("¿Estas seguro que deseas cancelar la cita?");
	if(c){
		var id = $(this).attr('idcita');
		updateCita(id, 4);
	}
});

$(document).on('click', '.btnCitaReagendar', function(){
	var id = $(this).attr('idcita');
	$('#alertMsg').html('Obteniendo la informaci&oacute;n...');
	$('#loader').show();
	db.transaction(function(tx){
		var q = "SELECT json, Descripcion, nombre, fecha, hora, duracion, motivo, lugar FROM kc_agenda AS k LEFT JOIN CAT_Motivo_Visita AS m ON motivo = Id_Motivo_Visita WHERE k.rowid = " + id;
		tx.executeSql(q, [], function(tx, res){
			var obj = res.rows.item(0);
			var json = JSON.parse(res.rows.item(0).json);
			console.log(json);
			if(json.VisitaVentas != null && json.VisitaVentas != undefined){
				visitasVentasReagendar(obj.nombre, obj.fecha, obj.hora, obj.duracion, obj.motivo, obj.Descripcion, JSON.parse(json.VisitaVentas)[0].Numero_Poliza, obj.lugar, id);
				$('#loader').hide();
			}
			else{
				visitaServicioReagendar(obj.nombre, obj.fecha, obj.hora, obj.duracion, obj.motivo, obj.Descripcion, JSON.parse(json.DetallesVisitaServicio)[0].Id_Agenda, obj.lugar, id);
				$('#loader').hide();
			}
		});
	});
});

$(document).on('click', '#btnBackReagendar', function(){
	miAgenda();
});

$(document).on('click', '.btnGoogleMaps', function(){
	$('#alertMsg').html('Obteniendo la informaci&oacute;n...');
	$('#loader').show();
	var lugar = $(this).parent().parent().children('.citaLugarWrapper').children('.citaLugar').html();
	//console.log(lugar);
	var datos = {
		address: lugar,
		key: "AIzaSyBG8GEQesKynk9UMdMfezKF5m8z6xw3QXU"
	};
	$.ajax({
		url: "https://maps.googleapis.com/maps/api/geocode/json", 
		timeout: 10000,
		data: datos,
		type: 'GET',
		success: function(d){
			//console.log(d);
			if(d.status == "OK"){
				var html = '';
				$.each(d.results, function(i, obj){
					html += '<tr><td><input type="radio" name="radioLocations" value="' + obj.geometry.location.lat + ',' + obj.geometry.location.lng + '" id="loc' + i + '"> <label for="loc' + i + '"><a>' + obj.formatted_address + '</a></label></td></tr>';
				});
				$('#loader').hide();
				$('#googleMapsTbl').html(html);
				$('#googleMapsForm').show();
				$('#enviosBackground').show();
			}
			else if(d.status == "ZERO_RESULTS"){
				$('#loader').hide();
				alert("Google maps no ha podido encontrar una ubicacion correspondiente al lugar guardado");
			}
			else{
				$('#loader').hide();
				alert("Ha ocurrido un error. Intentalo mas tarde");
			}
		},
		error: function(xhr, e, status){
			$('#loader').hide();
			alert("Ha ocurrido un error. Verifica que estes conectado a internet.");
		}
	});
});

$(document).on('click', '#confirmGM', function(){
	var loc = $("input[name=radioLocations]:checked").val();
	if(loc == undefined || loc == null || loc == ""){
		alert("Es necesario que eligas una ubicacion.");
	}
	else{
		var url = "http://maps.google.com/maps?q=loc:" + loc;
		var callback = function(){
			cordova.InAppBrowser.open(url, "_system");
		};
		cordovaReady(callback);
	}
});

$(document).on('click', '#closeGM', function(){
	$('#googleMapsForm').hide();
	$('#enviosBackground').hide();
});