function busqueda(){
	var html = '';
	html += '<h2 style="border-bottom-style:solid; border-width:1px; border-color:#939597;">BUSCADOR</h2>';
	html += '<div style="width:300px; max-width:100%; margin:30px auto;">';
	html += '<div style="border-bottom-style:solid; border-width:1px; border-color:#000;">';
	html += '<input id="busqueda" placeholder="Nombre, Póliza, RFC o Retenedor"  type="text" style="width:100%; border:none; outline:none;" />';
	html += '</div>';
	html += '<div style="margin-top:5px; height:30px;">';
	html += '<a id="btnBuscar" href="#" style="font-size:20px; font-weight:bold; color:#00529b; float:right;">BUSCAR</a>';
	html += '<img src="img/lupa.png" style="height:22px; float:right;" />';
	html += '</div>';
	html += '</div>';
	html += '<div id="divBusquedaResultados" style="display:none;">';
	html += '<h2>RESULTADOS DE LA B&Uacute;SQUEDA</h2>';
	html += '<ul id="busquedaCartera"></ul>';
	html += '</div>';
	$('#content').html(html);
}
		
function getCartera(b){
	b = stripAccents(b);
    //console.log(b);
    $('#alertMsg').html('Buscando...');
	$('#loader').show();
    db.transaction(function(tx){
	    var q = "SELECT id, Id_Poliza, Nombre, RFC, Poliza, Nombre_Retenedor, Linea_Negocio FROM Carteras_Maestro WHERE nombre LIKE '%" + b + "%' OR rfc LIKE '" + b + "%' OR nombre_retenedor LIKE '%" + b + "%' OR poliza LIKE '" + b + "' LIMIT 30";               
		console.log(q);
		tx.executeSql(q, [], function(tx, res){
			var len = res.rows.length;
			console.log("count busqueda: " + len);
			var html = '';
	        for (var i=0; i<len; i++){
	    		html += '<li>';
				html += '<div class="wrapperResultados">';
				html += '<div class="datos">';
				html += '<span style="display:block">';
				html += '<a style="font-weight:bold;">' + res.rows.item(i).Nombre + '</a>';
				html += '</span>';
				html += '<span style="display:block">';
				html += '<a>RFC: </a><a style="font-weight:bold;">' + res.rows.item(i).RFC + '</a>';
				html += '</span>';
				html += '<span style="display:block">';
				html += '<a>Tipo de poliza: </a><a style="font-weight:bold;">' + res.rows.item(i).Linea_Negocio + '</a>';
				html += '</span>';
				html += '<span style="display:block">';
				//html += '<a>Seguro y p&oacute;liza: </a><a style="font-weight:bold;">' + res.rows.item(i).Plan + ' ' + res.rows.item(i).Poliza + '</a>';
				html += '<a>P&oacute;liza: </a><a style="font-weight:bold;">' + res.rows.item(i).Poliza + '</a>';
				html += '</span>';
				html += '<span style="display:block">';
				html += '<a>Retenedor: </a><a style="font-weight:bold;">' + res.rows.item(i).Nombre_Retenedor + '</a>';
				html += '</span>';
				html += '</div>';
				html += '<ul id="buttonsResultados">';
				html += '<li>';
				html += '<div class="button">';
				var url = 'polizas';
				//console.log(res.rows.item(i).Linea_Negocio);
				//if(res.rows.item(i).Linea_Negocio == 'VIDA') url = 'polizas_met99';
				//else if(res.rows.item(i).Linea_Negocio == 'GMM') url = 'polizas_gmm';
				html += '<a href="' + url + '.html?id=' + res.rows.item(i).Id_Poliza + '&poliza=' + res.rows.item(i).Linea_Negocio + '" class="linkJS btnConsulta"></a>';
				html += '<img src="img/btn_resultados.png" />';
				html += '<a>VER</a>';
				html += '</div>';
				html += '</li>';
				html += '<li>';
				html += '<div class="button">';
				html += '<a href="cotizaciones_sugeridas.html?id=' + res.rows.item(i).Id_Poliza + '&poliza=' + res.rows.item(i).Linea_Negocio + '" class="linkJS btnConsulta"></a>';
				html += '<img src="img/btn_resultados.png" />';
				html += '<a>COTIZACIÓN</a>';
				html += '</div>';
				html += '</li>';
				html += '<li>';
				html += '<div class="button">';
				html += '<a href="agendar.html?id=' + res.rows.item(i).Id_Poliza + '&poliza=' + res.rows.item(i).Linea_Negocio + '" class="linkJS btnConsulta"></a>';
				html += '<img src="img/btn_resultados.png" />';
				html += '<a>AGENDA</a>';
				html += '</div>';
				html += '</li>';
				html += '</ul>';
				html += '</div>';
				html += '</li>';
	        }
	        $('#divBusquedaResultados').css('display','block');
	        $('#busquedaCartera').html(html);
	        $('#loader').hide();
	        history.replaceState(null,'','busqueda.html?b=' + b);
		}, errorDefault);
	});
}

$(function(){
	$(document).on('keyup','#busqueda', function(e){
    	if(e.which == 13){
    		$(this).blur();
    	}
    });
    
    $(document).on('blur', '#busqueda', function(e){
    	var busqueda = $(this).val();
    	if(busqueda.length > 2)
    		getCartera(busqueda);
    	else
    		$('#busquedaCartera').html('');
    });
    
    $(document).on('click', '#btnBuscar', function(e){
    	e.preventDefault();
    	$('#busqueda').blur();
    });
});
	