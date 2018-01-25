	function submenuShow(){		
		$('#wrapperMenu').css('display', 'inline-block');
	}
	
	function submenuHide(){
		$('#wrapperMenu').css('display', 'none');
	}
	
	function submenuChange(){
		//quitar class selected del UL que permite mostrar el submenu
		var submenuOld = $('ul.submenu.selected');
		submenuOld.removeClass('selected');
		//quitar clase selected al div.wrapper correcto
		$('.wrapperOpcion.selected').removeClass('selected');
		//quitar class selected del LI que marca de color la subopcion seleccionada
		var old = $('.submenu li.selected');
		old.removeClass('selected');
	}
	
	function submenuCartera(){
		$('#headerTitulo').html('CARTERA');
		var html = '';
		//html += '<li class="opcionMenu wSubmenu">';
		html += '<li class="opcionMenu ">';
		html += '<div id="wrapperPolizas" class="wrapperOpcion">';
		html += '<a href="polizas.html" class="link"></a>';
		html += '<span style="display:block; padding:10px;"><a>P&Oacute;LIZAS</a></span>';
		html += '</div>';
		/*html += '<ul id="opcionesPolizas" class="submenu ">';
		html += '<li id="opcionMet99">';
		html += '<a href="polizas_met99.html" class="link"></a>';
		html += '<a>MET99</a>';
		html += '</li>';
		html += '<li id="opcionAuto">';
		html += '<a href="polizas_auto.html" class="link"></a>';
		html += '<a>AUTO</a>';
		html += '</li>';
		html += '<li id="opcionGmm">';
		html += '<a href="polizas_gmm.html" class="link"></a>';
		html += '<a>GMM</a>';
		html += '</li>';
		html += '</ul>';*/
		html += '</li>';
		html += '<li class="opcionMenu wSubmenu">';
		html += '<div id="wrapperCotizaciones" class="wrapperOpcion">';
		html += '<a href="cotizaciones_sugeridas.html" class="link"></a>';
		html += '<span style="display:block; padding:10px;"><a>COTIZACIONES</a></span>';
		html += '</div>';
		html += '<ul id="opcionesCotizaciones" class="submenu">';
		html += '<li id="opcionCotSug">';
		html += '<a href="cotizaciones_sugeridas.html" class="link"></a>';
		html += '<a>SUGERIDAS</a>';
		html += '</li>';
		html += '<li id="opcionCotPen">';
		html += '<a href="cotizaciones_pendientes.html" class="link"></a>';
		html += '<a>PENDIENTES</a>';
		html += '</li>';
		html += '</ul>';
		html += '</li>';
		html += '<li class="opcionMenu">';
		html += '<div id="wrapperAgendar" class="wrapperOpcion">';
		html += '<a href="agendar.html" class="link"></a>';
		html += '<span style="display:block; padding:10px;"><a>AGENDAR</a></span>';
		html += '</div>';
		html += '</li>';
		html += '<li class="opcionMenu">';
		html += '<div id="wrapperPostventa" class="wrapperOpcion">';
		html += '<a href="postventa.html" class="link"></a>';
		html += '<span style="display:block; padding:10px;"><a>POSTVENTA</a></span>';
		html += '</div>';
		html += '</li>';
		$('#menu').html(html);
	}
	
	function submenuCotizaciones(){
		$('#headerTitulo').html('COTIZACIONES');
		var html = '';
		html += '<li class="opcionMenu" class="selected">';
		html += '<div id="wrapperMet99" class="wrapperOpcion">';
		html += '<a href="cotizaciones_met99.html" class="link"></a>';
		html += '<span style="display:block; padding:10px;"><a>MET99</a></span>';
		html += '</div>';
		html += '</li>';
		html += '<li class="opcionMenu">';
		html += '<div id="wrapperAuto" class="wrapperOpcion">';
		html += '<a href="cotizaciones_auto.html" class="link"></a>';
		html += '<span style="display:block; padding:10px;"><a>AUTO</a></span>';
		html += '</div>';
		html += '</li>';
		html += '<li class="opcionMenu">';
		html += '<div id="wrapperGmm" class="wrapperOpcion">';
		html += '<a href="cotizaciones_gmm.html" class="link"></a>';
		html += '<span style="display:block; padding:10px;"><a>GMM</a></span>';
		html += '</div>';
		html += '</li>';
		html += '<li class="opcionMenu">';
		html += '<div  id="wrapperRealizadas" class="wrapperOpcion">';
		html += '<a href="cotizaciones_realizadas.html" class="link"></a>';
		html += '<span style="display:block; padding:10px;"><a>REALIZADAS</a></span>';
		html += '</div>';
		html += '</li>';
		$('#menu').html(html);
	}
	
	function submenuAgenda(){
		$('#headerTitulo').html('AGENDA');
		var html = '';
		html += '<li class="opcionMenu">';
		html += '<div id="wrapperMiAgenda" class="wrapperOpcion">';
		html += '<a href="mi_agenda.html" class="link"></a>';
		html += '<span style="display:block; padding:10px;"><a>MI AGENDA</a></span>';
		html += '</div>';
		html += '</li>';
		html += '<li class="opcionMenu">';
		html += '<div id="wrapperVentas" class="wrapperOpcion">';
		html += '<a href="visitas_ventas.html" class="link"></a>';
		html += '<span style="display:block; padding:10px;"><a>VISITAS DE VENTAS</a></span>';
		html += '</div>';
		html += '</li>';
		html += '<li class="opcionMenu">';
		html += '<div id="wrapperServicio" class="wrapperOpcion">';
		html += '<a href="visitas_servicio.html" class="link"></a>';
		html += '<span style="display:block; padding:10px;"><a>VISITAS DE SERVICIO</a></span>';
		html += '</div>';
		html += '</li>';
		/*html += '<li class="opcionMenu">';
		html += '<div id="wrapperAgendar" class="wrapperOpcion">';
		html += '<a href="agenda_agendar.html" class="link"></a>';
		html += '<span style="display:block; padding:10px;"><a>AGENDAR</a></span>';
		html += '</div>';
		html += '</li>';*/
		$('#menu').html(html);
	}
	
	function submenuHerramientas(){
		$('#headerTitulo').html('HERRAMIENTAS');
		var html = '';
		html += '<li class="opcionMenu" class="selected">';
		html += '<div id="wrapperCentros" class="wrapperOpcion">';
		html += '<a href="centros.html" class="link"></a>';
		html += '<span style="display:block; padding:10px;"><a>CENTROS DE TRABAJO</a></span>';
		html += '</div>';
		html += '</li>';
		html += '<li class="opcionMenu">';
		html += '<div id="wrapperDocumentacion" class="wrapperOpcion">';
		html += '<a href="documentacion.html" class="link"></a>';
		html += '<span style="display:block; padding:10px;"><a>DOCUMENTACION</a></span>';
		html += '</div>';
		html += '</li>';
		html += '<li class="opcionMenu">';
		html += '<div id="wrapperPresentador" class="wrapperOpcion">';
		html += '<a href="presentador.html" class="link"></a>';
		html += '<span style="display:block; padding:10px;"><a>PRESENTADOR</a></span>';
		html += '</div>';
		html += '</li>';
		$('#menu').html(html);
	}