function cotizaciones_pendientes(){
	$('#alertMsg').html('Cargando informaci&oacute;n');
	$('#loader').show();
	var id =  parseInt(localStorage.getItem('idCartera'));
	var tipo = localStorage.getItem('tipoCartera');
	db.transaction(function(tx){
		var q = 'SELECT rowid, nombre, tipo, fecha, form FROM kc_cotizaciones WHERE poliza = "' + id + '" ORDER BY rowid desc';
		//console.log(q);
		tx.executeSql(q, [], function(tx, res){
			var html = '';
			html += '<h2>COTIZACIONES PENDIENTES</h2>';
			html += '<ul id="cotizacionesPendientes">';
			for(var i = 0; i < res.rows.length; i++){
				html += '<li class="cotizacion' + res.rows.item(i).rowid + '">';
				html += '<div class="wrapperResultados">';
				html += '<div class="datos">';
				html += '<span style="display:block">';
				html += '<a style="font-weight:bold;">' + res.rows.item(i).nombre + '</a>';
				html += '</span>';
				html += '<span style="display:block">';
				html += '<a>Seguro: </a><a style="font-weight:bold;">' + res.rows.item(i).tipo + '</a>';
				html += '</span>';
				html += '<span style="display:block">';
				html += '<a>Fecha: </a><a style="font-weight:bold;">' + res.rows.item(i).fecha + '</a>';
				html += '</span>';
				html += '</div>';
				html += '<ul id="buttonsPend">';
				html += '<li>';
				html += '<div class="button">';
				html += '<a href="cotizaciones_' + res.rows.item(i).tipo.toLowerCase() + '_resumen.html?id=' + res.rows.item(i).rowid + '" class="link"></a>';
				html += '<img src="img/lupa.png" />     ';      
				html += '<a>VER</a>';
				html += '</div>';
				html += '</li>';
				html += '<li>';
				html += '<div class="button">';
				html += '<a href="cotizaciones_pendientes.html?id=' + res.rows.item(i).rowid + '" class="linkJS eliminarCoti"></a>';
				html += '<img src="img/eliminar.png" />';          
				html += '<a>ELIMINAR</a>';
				html += '</div>';
				html += '</li>';
				html += '</ul>';
				html += '</div>';
				html += '</li>';
			}
			html += '</ul>';
			$('#content').html(html);
			$('#loader').hide();
		});
	});
}