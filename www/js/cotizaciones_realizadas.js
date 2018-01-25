$(document).on('click', '.eliminarCoti', function(){
	var href = $(this).attr('href');
    var id = href.split("=")[1];
    var c = confirm("¿Estás seguro que deseas eliminar este registro?");
    if(c){
	    db.transaction(function(tx){
	    	var q = 'DELETE FROM kc_cotizaciones WHERE rowid = ' + id;
   		 	console.log(q);
   	 		tx.executeSql(q, [], function(tx, res){
   	 			$('.cotizacion' + id).remove();
    			//console.log("hola");
    		});
    	});
    }
});

$(document).on('keyup', '#filtroCR', function(){
	var val = $(this).val();
	$('.cotiRealizadas tbody').find('.nombreCR').each(function(i, obj){
		var nom = $(this).html();
		var id = $(this).parent().parent().attr('idcotizacion');
		if(nom.toUpperCase().indexOf(val.toUpperCase()) > -1){
			$('.cotizacion' + id).removeClass('hidden');
		}
		else{
			$('.cotizacion' + id).addClass('hidden');
		}
	});
});

function cotizaciones_realizadas(){
	var html = '';
	db.transaction(function(tx){
		var q = 'SELECT rowid, nombre, tipo, fecha, form FROM kc_cotizaciones ORDER BY rowid desc';
		tx.executeSql(q, [], function(tx, res){
			var len = res.rows.length;
			var html = '';
			html += '<div style="display:inline-block; width:100%;">';
			html += '<div style="float:left;">';
			html += '<h2>COTIZACIONES REALIZADAS</h2>';
			html += '</div>';
			html += '<div id="wrapperBtnSimple">';
			html += '<input type="text" id="filtroCR" class="itxtBorder" placeholder="Buscar...">';
			html += '</div>';
			html += '</div>';
			html += '<table class="cotiRealizadas">';
			html += '<thead>';
			html += '<tr>';
			html += '<td>';
			html += '<a>NOMBRE</a>';
			html += '</td>';
			html += '<td>';
			html += '<a>SEGURO</a>';
			html += '</td>';
			html += '<td>';
			html += '<a>FECHA</a>';
			html += '</td>';
			html += '<td>';
			html += '</td>';
			html += '</tr>';
			html += '</thead>';
			html += '<tbody>';
			for(var i = 0; i < len; i++){
				var even = '';
				/*if(i % 2 != 0){
					even = 'class="even"';
				}*/
				html += '<tr idcotizacion="' + res.rows.item(i).rowid + '" class="cotizacion' + res.rows.item(i).rowid + '">';
				html += '<td>';
				html += '<a class="nombreCR">' + res.rows.item(i).nombre + '</a>';
				html += '</td>';
				html += '<td>';
				html += '<a>' + res.rows.item(i).tipo + '</a>';
				html += '</td>';
				html += '<td >';
				var fecha = res.rows.item(i).fecha;
				var fechaComponents = fecha.split('-');
				html += '<a>' + fechaComponents[2] + '/' + fechaComponents[1] + '/' + fechaComponents[0] + '</a>';
				html += '</td>';
				html += '<td >';
				html += '<ul id="buttonsPend">';
				html += '<li>';
				html += '<div class="button">';
				html += '<a href="cotizaciones_' + res.rows.item(i).tipo.toLowerCase() + '_resumen.html?id=' + res.rows.item(i).rowid + '" class="link"></a>';
				html += '<img src="img/lupa.png" />';
				html += '<a>VER</a>';
				html += '</div>';
				html += '</li>';
				html += '<li>';
				html += '<div class="button">';
				html += '<a href="cotizaciones_realizadas.html?id=' + res.rows.item(i).rowid + '" class="linkJS eliminarCoti"></a>';
				html += '<img src="img/eliminar.png"/>';
				html += '<a>ELIMINAR</a>';
				html += '</div>';
				html += '</li>';
				html += '</ul>';
				html += '</td>';
				html += '</tr>';
				html += '<tr class="btn cotizacion' + res.rows.item(i).rowid + '">';
				html += '<td colspan="4" style="">';
				html += '<ul id="buttonsPend">';
				html += '<li>';
				html += '<div class="button">';
				html += '<a href="cotizaciones_' + res.rows.item(i).tipo.toLowerCase() + '_resumen.html?id=' + res.rows.item(i).rowid + '" class="link"></a>';
				html += '<img src="img/lupa.png"/>';
				html += '<a>VER</a>';
				html += '</div>';
				html += '</li>';
				html += '<li>';
				html += '<div class="button">';
				html += '<a href="cotizaciones_realizadas.html?id=' + res.rows.item(i).rowid + '" class="linkJS eliminarCoti"></a>';
				html += '<img src="img/eliminar.png"/>';
				html += '<a>ELIMINAR</a>';
				html += '</div>';
				html += '</li>';
				html += '</ul>';
				html += '</td>';
				html += '</tr>';
			}
			html += '</tbody>';
			html += '</table>';
			$('#content').html(html);
		});
	});
}