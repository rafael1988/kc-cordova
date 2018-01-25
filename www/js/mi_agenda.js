$(document).on('click', '.btnCalendario', function(){
	$('.btnCalendario').removeClass('hidden');
	$(this).addClass('hidden');
});

$(document).on('click', '#btnAgendaDiaria', function(){
	agendaDiaria();
});

$(document).on('click', '#btnAgendaSemanal', function(){
	drawCalendarWeek();
});

$(document).on('click', '#btnAgendaMensual', function(){
	drawCalendarMonth();
});

$(document).on('click','#calendarioSiguiente',function(){
	if($('#btnAgendaSemanal').hasClass('hidden')){
		d.setDate(d.getDate() + 7);
		drawCalendarWeek();
	}
	else if($('#btnAgendaMensual').hasClass('hidden')){
		d.setMonth(d.getMonth() + 1);
		d.setDate(1);
		drawCalendarMonth();
	}
	else if($('#btnAgendaDiaria').hasClass('hidden')){
		d.setDate(d.getDate() + 1);
		agendaDiaria();
	}
});
$(document).on('click','#calendarioAnterior',function(){
	if($('#btnAgendaSemanal').hasClass('hidden')){
		d.setDate(d.getDate() - 7);
		drawCalendarWeek();
	}
	else if($('#btnAgendaMensual').hasClass('hidden')){
		d.setMonth(d.getMonth() - 1);
		d.setDate(1);
		drawCalendarMonth();
	}
	else if($('#btnAgendaDiaria').hasClass('hidden')){
		d.setDate(d.getDate() - 1);
		agendaDiaria();
	}
});

var d = new Date();
var meses = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
var mesesAbrev = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
var diaSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
var tblinit = '<table id="tblCalendario">';
	tblinit += '<tr class="header">';
	tblinit += '<td><div><a>Lunes</a></div></td>';
	tblinit += '<td><div><a>Martes</a></div></td>';
	tblinit += '<td><div><a>Miercoles</a></div></td>';
	tblinit += '<td><div><a>Jueves</a></div></td>';
	tblinit += '<td><div><a>Viernes</a></div></td>';
	tblinit += '<td><div><a>Sabado</a></div></td>';
	tblinit += '<td><div><a>Domingo</a></div></td>';
	tblinit += '</tr>';
			
function drawCalendarMonth(){
	$('#alertMsg').html('Buscando citas...');
	$('#loader').show();
	var m = d.getMonth() + 1;
	var a = d.getFullYear();
	var html = tblinit;
				
	var ddm = 1;
	var dem = getDaysInMonth(m,a);
	var primerDia = getDayOfWeek(new Date(a,m-1,1));
	var numWeeks = Math.ceil((dem + primerDia) / 7);
	for(var i = 0; i < numWeeks; i++){				
		html += '<tr>';
		for(var j = 0; j < 7; j++){
			html += '<td>';
			if(i > 0){
				if(ddm <= dem){
					html += getCellHtml(ddm++);
				}
			}
			else if(j >= primerDia){
				html += getCellHtml(ddm++);
			}
			html += '</td>';
		}
		html += '</tr>';
	}
	html += '</table>';
	$('#calendario').html(html);
	$('#txtCal').html(getNameMonth(m) + ' ' + a);
	db.transaction(function(tx){
		var q = 'SELECT fecha, hora, Descripcion FROM kc_agenda JOIN CAT_Motivo_Visita ON motivo = Id_Motivo_Visita WHERE fecha >= "' + a + '-' + (m < 10 ? '0' + m:m) + '-01' + '" AND fecha <= "' + a + '-' + (m < 10 ? '0' + m:m) + '-31' + '" AND (estatus = 1 OR estatus = 2) ORDER BY fecha, hora';
		//var q = 'SELECT fecha, hora, Descripcion FROM kc_agenda JOIN CAT_Motivo_Visita ON motivo = Id_Motivo_Visita WHERE fecha >= "' + a + '-' + (m < 10 ? '0' + m:m) + '-01' + '" AND fecha <= "' + a + '-' + (m < 10 ? '0' + m:m) + '-31' + '" ORDER BY fecha, hora';
		console.log(q);
		tx.executeSql(q, [], function(tx, res){
			for(var i = 0; i < res.rows.length; i++){
				var dia = parseInt(res.rows.item(i).fecha.split('-')[2]);
				//console.log('hola' + dia);
				var act = '<span><a>' + res.rows.item(i).hora + '&nbsp;&nbsp;&nbsp;' + res.rows.item(i).Descripcion + '</a></span>';
				$('#actividades' + dia).append(act);
			}
			$('#loader').hide();
		});
	});
}
function getCellHtml(ddm){
	var html = '<div>';
	html += '<span class="dia">';
	html += ddm;
	html += '</span>';
	html += '<div class="actividades" id="actividades' + ddm + '"></div>';
	html += '</div>';
	return html;
}
function getDaysInMonth(m,a){
	return new Date(a,m,0).getDate();
}			
function getDayOfWeek(d){
	var dia = d.getDay();
	return ((dia == 0) ? 6 : dia - 1);
}
function getNameMonth(m){
	return meses[m - 1];
}
function drawCalendarWeek(){
	$('#alertMsg').html('Buscando citas...');
	$('#loader').show();
	var html = tblinit
	var rango = '';
	var tmp = new Date(d.getTime());
	var iniM, iniY, iniD, finM, finY, finD;
	for(var i = 1; i <= 7; i++){
		tmp.setDate(tmp.getDate() - tmp.getDay() + i);
		html += '<td class="semanal">';
		//d.setDate(d.getDate() - d.getDay() + i);
		if(i == 1){
			iniM = tmp.getMonth() + 1;
			iniY = tmp.getFullYear();
			iniD = tmp.getDate();
			rango += tmp.getDate() + ' ' + mesesAbrev[tmp.getMonth()];
		}
		else if(i == 7){
			finM = tmp.getMonth() + 1;
			finY = tmp.getFullYear();
			finD = tmp.getDate();
			rango += ' - ' + tmp.getDate() + ' ' + mesesAbrev[tmp.getMonth()];
		}
		html += getCellHtml(tmp.getDate());
		html += '</td>';
	}
	html += '</tr>';
	$('#calendario').html(html);
	$('#txtCal').html(rango);
	db.transaction(function(tx){
		var fechaIni = iniY + '-' + (iniM < 10 ? '0' + iniM : iniM) + '-' + (iniD < 10 ? '0' + iniD : iniD);
		var fechaFin = finY + '-' + (finM < 10 ? '0' + finM : finM) + '-' + (finD < 10 ? '0' + finD : finD);
		var q = 'SELECT fecha, hora, Descripcion FROM kc_agenda JOIN CAT_Motivo_Visita ON motivo = Id_Motivo_Visita WHERE fecha >= "' + fechaIni + '" AND fecha <= "' + fechaFin + '" AND (estatus = 1 OR estatus = 2) ORDER BY fecha, hora';
		console.log(q);
		tx.executeSql(q, [], function(tx, res){
			for(var i = 0; i < res.rows.length; i++){
				var dia = parseInt(res.rows.item(i).fecha.split('-')[2]);
				console.log('hola' + dia);
				var act = '<span><a>' + res.rows.item(i).hora + '&nbsp;&nbsp;&nbsp;' + res.rows.item(i).Descripcion + '</a></span>';
				$('#actividades' + dia).append(act);
			}
			$('#loader').hide();
		});
	});
}		

function miAgenda(){
	var html = '';
	html += '<div style="display:inline-block; width:100%;">';
	html += '<div style="float:left;">';
	html += '<h2>MI AGENDA</h2>';
	html += '</div>';
	html += '<div id="wrapperBtnSimple"> ';
	html += '<div id="btnAgendaDiaria" class="btnSimple btnCalendario hidden">';
	html += '<a>DIA</a>';
	html += '</div>';
	html += '<div id="btnAgendaSemanal" class="btnSimple btnCalendario">';
	html += '<a>SEMANA</a>';
	html += '</div>';
	html += '<div id="btnAgendaMensual" class="btnSimple btnCalendario">';
	html += '<a>MES</a>';
	html += '</div>';
	html += '<div style="margin-left:5px; float:left;">';
	html += '<div class="btnSimple" style="margin-left:0;">';
	html += '<a href="#" class="linkJS" id="calendarioAnterior"></a>';
	html += '<img src="img/back_w.png"/>';
	html += '</div>';
	html += '<div class="btnSimple" style="background:#c8e4f4; margin-left:0; width: 110px; text-align: center;">';
	html += '<a id="txtCal" style="color:black;">09/07/2015</a>';
	html += '</div>';
	html += '<div class="btnSimple" style="margin-left:0;">';
	html += '<a href="#" class="linkJS" id="calendarioSiguiente"></a>';
	html += '<img src="img/next_w.png"/>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '<div id="calendario" style="margin-top:5px;">';
	html += '</div>';
	$('#content').html(html);
	d = new Date();	
	agendaDiaria();
}

function agendaDiaria(){
	$('#alertMsg').html('Buscando citas...');
	$('#loader').show();
	var html = '';
	html += '<div style="background:#8fc6e8; padding:5px 10px;">';
	html += '<a id="txtDiaCal" style="font-weight:bold; text-">Lunes 7 de septiembre de 2015</a>';
	html += '</div>';
	html += '<ul id="busquedaCartera" style="margin:0;">';
	html += '</ul>';
	$('#calendario').html(html);
	var m = d.getMonth();
	var a = d.getFullYear();
	$('#txtCal').html(d.getDate() + ' ' + mesesAbrev[m] + ' ' + a);
	$('#txtDiaCal').html(diaSemana[getDayOfWeek(d)] + ' ' + d.getDate() + ' de ' + meses[m].toLowerCase() + ' de ' + a);
	db.transaction(function(tx){
		m++;
		var q = 'SELECT k.rowid, nombre, motivo, fecha, hora, duracion, lugar, Descripcion, Id_Motivo_Visita FROM kc_agenda AS k JOIN CAT_Motivo_Visita AS m ON motivo = Id_Motivo_Visita AND fecha ="' + a + '-' + (m < 10 ? '0'+m : m) + '-' + (d.getDate() < 10 ? '0'+d.getDate() : d.getDate()) + '" AND (estatus = 1 OR estatus = 2) ORDER BY hora';
		//var q = 'SELECT k.rowid, nombre, motivo, fecha, hora, duracion, lugar, Descripcion, Id_Motivo_Visita FROM kc_agenda AS k JOIN CAT_Motivo_Visita AS m ON motivo = Id_Motivo_Visita AND fecha ="' + a + '-' + (m < 10 ? '0'+m : m) + '-' + (d.getDate() < 10 ? '0'+d.getDate() : d.getDate()) + '" ORDER BY hora';
		//console.log(q);
		tx.executeSql(q, [], function(tx, res){
			html = '';
			for(var i = 0; i < res.rows.length; i++){
				html += '<li>';
				html += '<div class="wrapperResultados">';
				html += '<div class="datos">';
				html += '<span style="display:block">';
				html += '<span style="display:block; float:left; margin-right:20px;">';
				html += '<a>Hora: </a><a style="font-weight:bold;">' + res.rows.item(i).hora + '</a>';
				html += '</span>';
				html += '</span>';
				html += '<span style="display:block">';
				html += '<a style="font-weight:bold;">' + res.rows.item(i).nombre + '</a>';
				html += '</span>';
				html += '<span style="display:block">';
				html += '<a>Motivo: </a><a style="font-weight:bold;">' + res.rows.item(i).Descripcion + '</a>';
				html += '</span>';
				html += '<span class="citaLugarWrapper" style="display:block">';
				html += '<a>Lugar: </a><a style="font-weight:bold;" class="citaLugar">' + res.rows.item(i).lugar + '</a>';
				html += '</span>';
				html += '<span style="display:block">';
				html += '<a href="#" class="btnGoogleMaps" style="color:#00529b; font-weight:bold;">GOOGLE MAPS</a>';
				html += '</span>';
				html += '</div>';
				html += '<ul id="buttonsResultados">';
				html += '<li>';
				html += '<div class="button">';
				html += '<a href="#" class="linkJS btnCitaRealizada" idcita="' + res.rows.item(i).rowid + '"></a>';
				html += '<img src="img/btn_resultados.png"/>';
				html += '<a>REALIZADA</a>';
				html += '</div>';
				html += '</li>';
				html += '<li>';
				html += '<div class="button">';
				html += '<a href="#" class="linkJS btnCitaCancelada" idcita="' + res.rows.item(i).rowid + '"></a>';
				html += '<img src="img/eliminar.png"/>';
				html += '<a>CANCELAR</a>';
				html += '</div>';
				html += '</li>';
				html += '<li>';
				html += '<div class="button">';
				html += '<a href="#" class="linkJS btnCitaReagendar" idcita="' + res.rows.item(i).rowid + '"></a>';
				html += '<img src="img/agenda.png"/>';
				html += '<a>REAGENDAR</a>';
				html += '</div>';
				html += '</li>';
				html += '</ul>';
				html += '</div>';
				html += '</li>';
			}
			$('#busquedaCartera').html(html);
			$('#loader').hide();
		});
	});
}