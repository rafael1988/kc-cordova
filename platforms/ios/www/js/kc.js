var form = '';
var dbTrans = 0;
var count = 0;
function fillForm(){
	if(form != ''){
		var jsonS = localStorage.getItem(form);
		if(jsonS != null){
			var json = JSON.parse(jsonS);
			//console.log(json);
			$('body').find(':input').each(function(i,obj){
				var that = $(this);
				var id = that.attr('id');
				var val = json[id];
				//console.log(val);
				if(val == 'true' && (that.is(':checkbox') || that.is(':radio'))){
					that.prop('checked', true);
				}
				else if((val != null && val != '' && val != undefined) && that.is('select')){
					//console.log(id);
					//console.log(val);
					$('#' + id + ' option[value="' + val + '"]').prop('selected', true);
					$('#' + id + ' option[value="' + val + '"]').change();
				}
				else if(val != null && val != '' && val != undefined){
					that.val(val);
				}

			});

		}
	}
	dbTrans = 0;
	count = 0;
}

function checkDbTrans(){
	if(++count >= dbTrans){
		fillForm();
	}
}

function getCookie(c_name){
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1){
  		c_start = c_value.indexOf(c_name + "=");
  	}
	if (c_start == -1){
  		c_value = null;
 	}
	else{
  		c_start = c_value.indexOf("=", c_start) + 1;
  		var c_end = c_value.indexOf(";", c_start);
  		if (c_end == -1){
			c_end = c_value.length;
		}
		c_value = unescape(c_value.substring(c_start,c_end));
	}
	return c_value;
}

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function stripTime(datetime){
	if(datetime != null)
		return datetime.substr(0, datetime.length - 11);
	else
		return "";
}

function stripAccents(s) {
  if(!stripAccents.translate_re) stripAccents.translate_re = /[üÜáéíóúÁÉÍÓÚñÑ]/g;
  var translate = {
    "á": "a", "ó": "o", "ü": "u",
    "Á": "A", "Ó": "O", "Ü": "U",
    "é": "e", "í": "i", "ú": "u",
    "É": "E", "Í": "I", "Ú": "U",
    "ñ": "n", "Ñ": "N"   // probably more to come
  };
  return ( s.replace(stripAccents.translate_re, function(match) { 
    return translate[match]; 
  }) );
}

function formatNull(s){
	return (s == null ? '' : s);
}

// Funcion default para errores en los querys generados porque no existe la estructura esperada en las tablas
function errorDefault(tx, err) {
	var html = '<div class="noData">';
	html += '<a>Esta funci&oacute;n no se encuentra disponible. Favor de comunicarse con la agencia.</a>';
	html += '</div>';
    $('#content').html(html);	
	$('#loader').hide();
}

/********************************************* PHONEGAP *************************************************************/
document.addEventListener("online", onOnline, false);
function onOnline(){
	if(localStorage.getItem('com.kc.citaspendientes') != null){
		console.log("Existen citas pendientes!");
		var callback = function(){
			db.transaction(function(tx){
				var q = "SELECT rowid, json FROM kc_agenda WHERE synced = 0";
				tx.executeSql(q, [], function(tx, res){
					if(res.rows.length == 0){
						localStorage.removeItem('com.kc.citaspendientes');
					}
					console.log("No de citas: " + res.rows.length);
					var syncAgenda = function(i, json, id){
						console.log(i);
						console.log(JSON.stringify(json));
						console.log(id);
						setTimeout(function(){
							var url = 'http://187.174.229.88/triton/datos/AgendasDVS/';
							if(json.VisitaVentas != null && json.VisitaVentas != undefined){
								url = 'http://187.174.229.88/triton/datos/AgendasDVV/';
							}
							$.ajax({
								url: url, 
								dataType: 'jsonp',
								timeout: 10000,
								data: json,
								type: 'POST',
								success: function(d){
									console.log(d);
									d = JSON.parse(d);
									if(d.success == true && d.data == "OK"){
										db.transaction(function(tx){
											var sql = 'UPDATE kc_agenda SET synced = 1 WHERE rowid = ' + id;
											console.log(sql);
											tx.executeSql(sql);
										});
									}
								}
							});
						},i*3000);
					};
					for(var i = 0; i < res.rows.length; i++){
						var json = JSON.parse(res.rows.item(i).json);
						json.Token = JSON.parse(localStorage.getItem('datosAgente')).Token;
						syncAgenda(i, json, res.rows.item(i).rowid);	
					}
				});
			});
		};
		cordovaReady(callback);
	}
	else{
		console.log("no hay citas pendientes! :)");
	}
}

var deviceReady = false;
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady(){
	openDB();
	deviceReady = true;
}

function cordovaReady(callback){
	if(deviceReady){
	//if(true){
		callback();
	}
	else{
		setTimeout(function(){
			cordovaReady(callback)
		}, 500);
	}
}
/*
var Connection = {
	NONE : false
};
//*/
function checkConnection() {
	return navigator.connection.type;
	//return true;
}
/********************************************* PHONEGAP *************************************************************/

/*
function saveForm(){
	var jsonS = '{';
	$("body").find(":input").each(function(i, obj){
		var that = $(this);
		var id = that.attr("id");
		var val = that.val();
		jsonS += '"' + id + '" : "' + val + '",';
	});
	jsonS = jsonS.substring(0, jsonS.length -1);
	jsonS += '}';
	localStorage.setItem(form, jsonS);
	//var json = JSON.parse(jsonS);
	//console.log(json);
}
*/
$(function(){
	//var obj = JSON.parse(localStorage.getItem('datosAgente'));
	//obj.loginDia = 10;
	//obj.loginContador = 9;
	//localStorage.setItem('datosAgente', JSON.stringify(obj));
	
	$(document).on('click','#aMenuResponsive', function(){
		$('ul#menu').toggleClass('responsiveShow');
	});
	$(document).on('click','#aFooterResponsive', function(){
		$('div#menuPrincipal').toggleClass('responsiveShow');
	});
	$(document).on('click', '#menuInferior li.tab', function(){
		var that = $(this);
		var old = $('#menuInferior li.selected');
		old.removeClass('selected');
		that.addClass('selected');
	});
	/*
	$(document).on('click', '.wrapperRegresar', function(){
		history.back();
	});
	*/
	$(document).on('click', '#btnRegresarMain', function(){
		history.back();
	});
	
	$(document).on('focus', ':text,:input[type="tel"]', function(e){
		$('#header').css('position', 'absolute');
		$('#footer').css('position', 'relative');
		$('#mainContent').css('min-height','100%');
	});
	$(document).on('blur', ':text,:input[type="tel"]', function(e){
		$('#header').css('position', 'fixed');
		$('#footer').css('position', 'fixed');
		$('#mainContent').css('min-height','0');
	});
	
	$(document).on('keyup', ':text', function(e){
		if(e.which == 13 || e.which == 9){
			$(this).blur();
		}
	});
	$(document).on('keyup', ':input[type="tel"]', function(e){
		if(e.which == 13 || e.which == 9){
			$(this).blur();
		}
	});
	$(document).on('blur', ':input[type="tel"]', function(e){
		$(this).change();
	});
	
	$(document).on('keyup', '.txtedad', function(){
		var val = $(this).val();
		if((val != "" && isNaN(val)) || val.length > 2){
			console.log('keyup: isNaN');
			console.log("keyup: " + val);
			$(this).val($(this).data('previousVal'));
		}
	});
	$(document).on('input', '.txtedad', function(){
		var val = $(this).val();
		if((val != "" && isNaN(val)) || val.length > 2){
			console.log('oninput: isNaN');
			console.log("oninput: " + val);
			$(this).val($(this).data('previousVal'));
		}
	});
	$(document).on('keydown', '.txtedad', function(){
		$(this).data('previousVal', $(this).val());
	});
	
	$(document).on('keyup', '.txtnumero', function(){
		var val = $(this).val().replace(/,/g,"");
		if(val != "" && isNaN(val)){
			console.log('keyup: isNaN');
			console.log("keyup: " + val);
			$(this).val($(this).data('previousVal'));
		}
	});
	$(document).on('input', '.txtnumero', function(){
		var val = $(this).val().replace(/,/g,"");
		var val = $(this).val();
		if(val != "" && isNaN(val)){
			console.log('oninput: isNaN');
			console.log("oninput: " + val);
			$(this).val($(this).data('previousVal'));
		}
	});
	$(document).on('keydown', '.txtnumero', function(){
		$(this).data('previousVal', $(this).val());
	});
	
	$(document).on('click', '.toggleParrafo', function(){
		var tbl = $(this).parent().parent().children('table');
		tbl.toggle();
	});
	$(document).on('click', '#mpBd', function(){
		var r = confirm('¿Estás seguro que quieres actualizar la base de datos? La actualización puede tardar hasta varios minutos.');
		if(r){
			$('#loader').css('display','block');
			//syncDB(getCookie('token'));
			syncDB(JSON.parse(localStorage.getItem('datosAgente')).Token);
		}
	});
	
	
	//////////////////////////////////////////////
	$(document).on('click', '#mpDeletedDB', function(){
		var r = confirm('¿Estás seguro que deseas eliminar la base de datos?');
		if(r){
			//$('#loader').css('display','block');
			deleteDB();
		}
	});
	//////////////////////////////////////////////


	$(document).on('click', '.btnConsulta', function(){
		var obj = JSON.parse(localStorage.getItem('datosAgente'));
		var numConsultas = parseInt(obj.Consultas)
		obj.Consultas = --numConsultas;
		//obj.Consultas = numConsultas - 50;
		localStorage.setItem('datosAgente', JSON.stringify(obj));
		if(obj.Consultas > 0){
   		 	var href = $(this).attr('href');
   		 	var args = href.split("?");
   	 		//console.log(window.location.href);
    		var currArgs = getLocationUrl();
    		//console.log(currArgs[0]);
    		if(href != '#' && args[0] != currArgs[0]){
    			loadContent(args);
    			history.pushState(null, '', href);
    		}
    	}
    	else{
    		alert("Has llegado al limite maximo de consultas. Es necesario que te vuelvas a registrar");
    		window.location.href = 'index.html'
    	}
    });
	$(document).on('click', 'a.link', function(e){
   	 	e.preventDefault();
    	var href = $(this).attr('href');
    	var args = href.split("?");
    	//console.log(window.location.href);
    	var currArgs = getLocationUrl();
    	//console.log(currArgs[0]);
    	if(href != '#' && args[0] != currArgs[0]){
    		loadContent(args);
    		history.pushState(null, '', href);
    	}
    });
    
    $(document).on('click', 'a.linkDB', function(e){
   	 	e.preventDefault();
    	var href = $(this).attr('href');
    	//var args = href.split("?");
    	//console.log(href);
    	if(href != '#'){
   		 	saveForm();
   		 	formToDB(href);
    		//loadContent(args); //estos dos metodos estan incluidos en formToDB();
    		//history.pushState(null, '', href);
    	}
    });
    
    $(document).on('click', 'a.linkJS', function(e){
   	 	e.preventDefault();
    });
    //MET99 BOTON POR SUMA ASEGURADA
    $(document).on('click', '#btn_met99_sa', function(e){
		//e.preventDefault();
		var sus = $('#met99_suscripcion').html();
		if(sus == 'Rechazo'){
			alert('No se puede realizar una cotizcion para la ocupación seleccionada.');
		}
		else if($('#met99_edad').val() == '' || $('#nombre').val() == ''){
			alert('Todos los campos son obligatorios.');
		}
		else{
			var href = $(this).attr('href');
			var args = href.split("?");
			loadContent(args);
    		history.pushState(null, '', href);
		}
	});
	//MET99 BOTON POR PRIMA
    $(document).on('click', '#btn_met99_prima', function(e){
		//e.preventDefault();
		var sus = $('#met99_suscripcion').html();
		if(sus == 'Rechazo'){
			alert('No se puede realizar una cotizcion para la ocupación seleccionada.');
		}
		else if($('#met99_edad').val() == '' || $('#nombre').val() == ''){
			alert('Todos los campos son obligatorios.');
		}
		else{
			var href = $(this).attr('href');
			var args = href.split("?");
			loadContent(args);
    		history.pushState(null, '', href);
		}
	});
	//BOTON COTIZACION POR AUTOS
	$(document).on('click', '#guardarCotizacionAuto', function(){
		var aseg = $('#auto_aseguradora').val();
		var zona = $('#auto_zona').val();
		var marca = $('#auto_marca').val();
		var mod = $('#auto_modelo').val();
		var desc = $('#auto_descripcion').val();
		var paq = $('#auto_cobertura').val();
		if(aseg == 0 || zona == 0 || marca == 0 || mod == 0 || desc == 0 || paq == 0 || $('#nombre').val() == '' || $('#auto_edad').val() == ''){
			alert('Todos los campos son obligatorios');
		}
		else{
			saveForm();
   			formToDB($(this).attr('href'));
		}
	});
	
	
	$(document).on('click', '#btnSugAuto', function(){
		localStorage.removeItem('AUTO');
		var obj = {
			nombre: $('#nombreWrapper').html(),
			poliza: $('#idpoliza').val()
		};
		localStorage.setItem('AUTO', JSON.stringify(obj));
		var href = $(this).attr('href');
	    var args = href.split("?");
	    loadContent(args);
	    history.pushState(null, '', href);
	});
	//BOTON COTIZACION POR GMM
	$(document).on('click', '#guardarCotizacionGMM', function(){
		/*var ready = true;
		$(document).find('[type=text]').each(function(i, obj){
			if(obj.value == ''){
				ready = false;
			}
		});*/
		if($('#nombre').val() == '' || $('#gmm_edad').val() == ''){
			alert('Todos los campos son obligatorios');
		}
		else{
			saveForm();
   			formToDB($(this).attr('href'));
		}
	});
	
	$(document).on('click', '#btnSugGMM', function(){
		localStorage.removeItem('GMM');
		var obj = {
			nombre: $('#nombreWrapper').html(),
			poliza: $('#idpoliza').val()
		};
		localStorage.setItem('GMM', JSON.stringify(obj));
		var href = $(this).attr('href');
	    var args = href.split("?");
	    loadContent(args);
	    history.pushState(null, '', href);
	});
	//GUARDAR COTIZACION POR ME99 SA
	$(document).on('click', '#guardarMet99SA', function(){
		saveForm();
		var json = JSON.parse(localStorage.getItem('MET99'));
		var jsonCob = JSON.parse(localStorage.getItem('MET99_sa').replace(/sa_/g,'').replace(/met99_edad_conyuge/,'edad_conyuge'));
		jsonCob.prima_anual_total = jsonCob.prima_anual_total.replace(/,/g,"");
		jsonCob.prima_excedente_total = jsonCob.prima_excedente_total.replace(/,/g,'');
		jsonCob.prima_anual_total = parseFloat(jsonCob.prima_anual_total) - parseFloat(jsonCob.prima_excedente_total);
		jsonCob.bas = jsonCob.bas.replace(/,/g,"");
		jsonCob.bas_pa = jsonCob.bas_pa.replace(/,/g,"");
		for(var k in jsonCob){
			if(k.indexOf('_pa') > 0 && k != 'bas_pa'){
				var cob = k.replace('_pa','');
				jsonCob[cob + '_txt'] = jsonCob[cob + '_txt'].replace(/,/g,"");
				jsonCob[cob + '_pa'] = jsonCob[cob + '_pa'].replace(/,/g,"");
			}
		}
		json['coberturas'] = jsonCob;
		//console.log(json);
		localStorage.setItem('MET99_temp', JSON.stringify(json));
		var href = $(this).attr('href');
    	//var args = href.split("?");
   		formToDB(href);
   		//loadContent(args);
    	//history.pushState(null, '', href);
    	
	});
	//GUARDAR COTIZACION POR ME99 SA
	$(document).on('click', '#guardarMet99Prima', function(){
		saveForm();
		var json = JSON.parse(localStorage.getItem('MET99'));
		var jsonCob = JSON.parse(localStorage.getItem('MET99_prima').replace(/prima_/g,'').replace(/anual_total/,'prima_anual_total').replace(/excedente_anual/,'prima_excedente_total').replace(/met99_edad_conyuge/,'edad_conyuge').replace(/_txt/g,'_pa').replace(/_sa/g, '_txt').replace(/"bas"/,'"bas_pa"').replace(/bas_txt/,'bas').replace(/sexo_pa/g,'sexo_txt').replace(/hijos_pa/g,'hijos_txt'));
		jsonCob.prima_anual_total = jsonCob.prima_anual_total.replace(/,/g,"");
		jsonCob.prima_excedente_total = jsonCob.prima_excedente_total.replace(/,/g,'');
		jsonCob.bas = jsonCob.bas.replace(/,/g,"");
		jsonCob.bas_pa = jsonCob.bas_pa.replace(/,/g,"");
		for(var k in jsonCob){
			if(k.indexOf('_pa') > 0 && k != 'bas_pa'){
				var cob = k.replace('_pa','');
				jsonCob[cob + '_txt'] = jsonCob[cob + '_txt'].replace(/,/g,"");
				jsonCob[cob + '_pa'] = jsonCob[cob + '_pa'].replace(/,/g,"");
			}
		}
		json['coberturas'] = jsonCob;
		//console.log(json);
		localStorage.setItem('MET99_temp', JSON.stringify(json));
   		var href = $(this).attr('href');
    	//var args = href.split("?");
   		formToDB(href);
   		//loadContent(args);
    	//history.pushState(null, '', href);
	});
	
	$(document).on('click', '#btnSugMet99', function(){
		localStorage.removeItem('MET99');
		localStorage.removeItem('MET99_sa');
		localStorage.removeItem('MET99_prima');
		var obj = {
			nombre: $('#nombreWrapper').html(),
			poliza: $('#idpoliza').val()
		};
		localStorage.setItem('MET99', JSON.stringify(obj));
		var href = $(this).attr('href');
	    var args = href.split("?");
	    loadContent(args);
	    history.pushState(null, '', href);
	});
    
    function saveForm(){
    	if(form != ''){
    		var jsonS = '{';
			$("body").find(":input").each(function(i, obj){
				var that = $(this);
				var id = that.attr("id");
				var val = that.val();
				if(that.is(":checkbox") || that.is(':radio')){
					jsonS += '"' + id + '" : "' + that.is(":checked") + '",';
				}
				else if(that.is('select')){
					jsonS += '"' + id + '" : "' + val + '",';	
					jsonS += '"' + id + '_txt" : "' + $('#' + id + ' option:selected').text() + '",';	
				}
				else{
					jsonS += '"' + id + '" : "' + val + '",';	
				}
			});
			jsonS = jsonS.substring(0, jsonS.length -1);
			jsonS += '}';
			localStorage.setItem(form, jsonS);
			//var json = JSON.parse(jsonS);
			//console.log(json);
		}
    }
    
    function deleteForm(){
    	//console.log(form);
    	if(form != ''){
    		localStorage.removeItem(form);
    		localStorage.removeItem(form + '_prima');
    		localStorage.removeItem(form + '_sa');
    	}
    }
    
    function formToDB(href){
    	if(form != ''){
    		if(form.indexOf("_") > 0){
    			form = form.substring(0, form.indexOf("_"));
    		}
    		var json = '{ "' + form + '" : ' + localStorage.getItem(form);
    		if(localStorage.getItem(form + '_prima') != null || localStorage.getItem(form + '_sa') != null){
    			//json += ', "' + form + '_prima" : ' + localStorage.getItem(form + '_prima');
    			var obj = JSON.parse(localStorage.getItem('MET99_temp'));
    			json += ', "coberturas" : ' + JSON.stringify(obj.coberturas);
    		}
    		/*if(localStorage.getItem(form + '_sa') != null){
    			json += ', "' + form + '_sa" : ' + localStorage.getItem(form + '_sa');
    		}*/
    		json += '}';
    		//console.log(json);
    		var tmp = JSON.parse(json);
    		var tmpF = form;
    		//console.log(tmp);
    		//console.log(tmp[form].nombre);
    		db.transaction(function(tx){
    			var q = 'INSERT INTO kc_cotizaciones (nombre, tipo, fecha, poliza, form) VALUES (?,?,?,?,?)';
    			var d = new Date();
    			tx.executeSql(q, [tmp[tmpF].nombre, tmpF, d.yyyymmdd(), tmp[tmpF].poliza, json], function(tx, res){
    				deleteForm();
    				form = '';
    				href = href + '?id=' + res.insertId;
    				var args = href.split("?");
    				loadContent(args);
    				history.pushState(null, '', href);
    			});
    		}, errorCB);
    	}
    }
    
    Date.prototype.yyyymmdd = function() {
   		var yyyy = this.getFullYear().toString();
   		var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
   		var dd  = this.getDate().toString();
   		return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]); // padding
  	};
    		
    window.onpopstate = function(event) {
		/*var url = window.location.href;
		//console.log("pathname: "+ url);
		var tmp = url.split("/");
		//console.log(tmp);
		var args = tmp[tmp.length - 1];
		args = args.split("?");*/
		loadContent(getLocationUrl());
	};
	
	function getLocationUrl(){
		var url = window.location.href;
		//console.log("pathname: "+ url);
		var tmp = url.split("/");
		//console.log(tmp);
		var args = tmp[tmp.length - 1];
		args = args.split("?");
		return args
	}
	
	//saveForm();
	/*function saveForm(){
		for(var i in localStorage){
    		console.log(i + "->" + localStorage[i]);
		}
	}*/
	function loadContent(args){
		var pag = args[0];
		//var keyVals;
		//var id;
		if((pag == 'polizas.html' || pag == 'postventa.html' || pag == 'agendar.html' || pag == 'cotizaciones_sugeridas.html') && args.length > 1){
			var keyVals = args[1].split('&');
			//console.log(keyVals);
			var id = keyVals[0].split('=')[1];
			if(id == 'null') id = 0;
			localStorage.setItem('idCartera', id);
			if(keyVals.length > 1){
				var tipo = keyVals[1].split('=')[1];
				//console.log(linea);
				localStorage.setItem('tipoCartera', tipo);
			}
		}
		//console.log(pag);
		/*if(pag == 'polizas_met99.html'){
			saveForm();
			form = '';
			submenuChange();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpCartera').addClass('selected');
			$('#wrapperPolizas').addClass('selected');
			$('#opcionesPolizas').addClass('selected');
			$('#opcionMet99').addClass('selected');
			submenuShow();
			met99();
		}
		else if(pag == 'polizas_auto.html'){
			saveForm();
			form = '';
			submenuChange();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpCartera').addClass('selected');
			$('#opcionesPolizas').addClass('selected');
			$('#opcionAuto').addClass('selected');
			submenuShow();
			auto();
		}
		else if(pag == 'polizas_gmm.html'){
			saveForm();
			form = '';
			submenuChange();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpCartera').addClass('selected');
			$('#opcionesPolizas').addClass('selected');
			$('#opcionGmm').addClass('selected');
			submenuShow();
			gmm();
		}*/
		if(pag == 'polizas.html'){
			saveForm();
			form = '';
			submenuCartera();
			//submenuChange();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#wrapperPolizas').addClass('selected');
			if(localStorage.getItem('tipoCartera') == 'VIDA'){
				met99();
			}
			else if(localStorage.getItem('tipoCartera') == 'GMM'){
				gmm();
			}
			else{
				auto();
			}
		}
		else if(pag == 'cotizaciones_sugeridas.html'){
			saveForm();
			form = '';
			submenuCartera();
			//submenuChange();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpCartera').addClass('selected');
			$('#wrapperCotizaciones').addClass('selected');
			$('#opcionesCotizaciones').addClass('selected');
			$('#opcionCotSug').addClass('selected');
			cotizaciones_sugeridas();
		}
		else if(pag == 'cotizaciones_pendientes.html'){
			saveForm();
			form = '';
			submenuCartera();
			//submenuChange();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpCartera').addClass('selected');
			$('#opcionesCotizaciones').addClass('selected');
			$('#opcionCotPen').addClass('selected');
			cotizaciones_pendientes();
		}
		else if(pag == 'agendar.html'){
			saveForm();
			form = '';
			submenuCartera();
			//submenuChange();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpCartera').addClass('selected');
			$('#wrapperAgendar').addClass('selected');
			agendar_cartera();
		}
		else if(pag == 'postventa.html'){
			saveForm();
			form = '';
			submenuCartera();
			//submenuChange();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpCartera').addClass('selected');
			$('#wrapperPostventa').addClass('selected');
			postventa();
		}
		else if(pag == 'busqueda.html'){
			saveForm();
			form = '';
			//submenuCartera();
			$('#headerTitulo').html('CARTERA');
			submenuHide();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpCartera').addClass('selected');
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpCartera').addClass('selected');
			busqueda();
			if(args.length > 1){
				var b = args[1].split('=')[1];
				b = b.replace('%20', ' ');
				getCartera(b);
				$('#busqueda').val(b);
			}
		}
		else if(pag == 'cotizaciones_met99.html'){
			saveForm();
			form = 'MET99';
			submenuCotizaciones();
			//submenuChange();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpCotizaciones').addClass('selected');
			$('#wrapperMet99').addClass('selected');
			cotizaciones_met99();
		}
		else if(pag == 'cotizaciones_met99_prima.html'){
			saveForm();
			form = 'MET99_prima';
			submenuCotizaciones();
			//submenuChange();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpCotizaciones').addClass('selected');
			$('#wrapperMet99').addClass('selected');
			cotizaciones_met99_prima();
		}
		else if(pag == 'cotizaciones_met99_sa.html'){
			saveForm();
			form = 'MET99_sa';
			submenuCotizaciones();
			//submenuChange();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpCotizaciones').addClass('selected');
			$('#wrapperMet99').addClass('selected');
			cotizaciones_met99_sa();
		}
		else if(pag == 'cotizaciones_met99_resumen.html'){
			saveForm();
			form = '';
			submenuCotizaciones();
			//submenuChange();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpCotizaciones').addClass('selected');
			$('#wrapperMet99').addClass('selected');
			if(args.length > 1){
				var id = args[1].split('=')[1];
				localStorage.setItem('idResumenM99', id);
			}
			cotizaciones_met99_resumen();
		}
		else if(pag == 'proyeccion_financiera.html'){
			saveForm();
			form = '';
			submenuCotizaciones();
			//submenuChange();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpCotizaciones').addClass('selected');
			$('#wrapperMet99').addClass('selected');
			generarPF();
			cotizaciones_met99_pf();
		}
		else if(pag == 'cotizaciones_auto.html'){
			saveForm();
			form = 'AUTO';
			submenuCotizaciones();
			//submenuChange();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpCotizaciones').addClass('selected');
			$('#wrapperAuto').addClass('selected');
			cotizaciones_auto();
		}
		else if(pag == 'cotizaciones_auto_resumen.html'){
			saveForm();
			form = '';
			submenuCotizaciones();
			//submenuChange();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpCotizaciones').addClass('selected');
			$('#wrapperAuto').addClass('selected');
			if(args.length > 1){
				var id = args[1].split('=')[1];
				localStorage.setItem('idResumenAuto', id);
			}
			cotizaciones_auto_resumen();
		}
		else if(pag == 'cotizaciones_gmm.html'){
			saveForm();
			form = 'GMM';
			submenuCotizaciones();
			//submenuChange();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpCotizaciones').addClass('selected');
			$('#wrapperGmm').addClass('selected');
			cotizaciones_gmm();
		}
		else if(pag == 'cotizaciones_gmm_resumen.html'){
			saveForm();
			form = '';
			submenuCotizaciones();
			//submenuChange();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpCotizaciones').addClass('selected');
			$('#wrapperGmm').addClass('selected');
			if(args.length > 1){
				var id = args[1].split('=')[1];
				localStorage.setItem('idResumenGmm', id);
			}
			cotizaciones_gmm_resumen();
		}
		else if(pag == 'cotizaciones_realizadas.html'){
			saveForm();
			form = '';
			submenuCotizaciones();
			//submenuChange();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpCotizaciones').addClass('selected');
			$('#wrapperRealizadas').addClass('selected');
			cotizaciones_realizadas();
		}
		else if(pag == 'mi_agenda.html'){
			saveForm();
			form = '';
			submenuAgenda();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpAgenda').addClass('selected');
			$('#wrapperMiAgenda').addClass('selected');
			miAgenda();
		}
		else if(pag == 'visitas_ventas.html'){
			saveForm();
			form = '';
			submenuAgenda();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpAgenda').addClass('selected');
			$('#wrapperVentas').addClass('selected');
			visitasVentas();
		}
		else if(pag == 'visitas_servicio.html'){
			saveForm();
			form = '';
			submenuAgenda();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpAgenda').addClass('selected');
			$('#wrapperServicio').addClass('selected');
			visitasServicio();
		}
		else if(pag == 'agenda_agendar.html'){
			saveForm();
			form = '';
			submenuAgenda();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpAgenda').addClass('selected');
			$('#wrapperAgendar').addClass('selected');
			var n = '', m = '';
			if(args.length > 1){
				var keyVals = args[1].split('&');
				n = keyVals[0].split('=')[1];
				if(keyVals.length > 1){
					m = keyVals[1].split('=')[1];
				}
			}
			agendar(n,m);
		}
		else if(pag == 'centros.html'){
			saveForm();
			form = '';
			submenuHerramientas();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpHerramientas').addClass('selected');
			$('#wrapperCentros').addClass('selected');
			centros();
		}
		else if(pag == 'documentacion.html'){
			saveForm();
			form = '';
			submenuHerramientas();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpHerramientas').addClass('selected');
			$('#wrapperDocumentacion').addClass('selected');
			documentacion();
		}
		else if(pag == 'presentador.html'){
			saveForm();
			form = '';
			submenuHerramientas();
			submenuShow();
			$('#menuInferior li.selected').removeClass('selected');
			$('#mpHerramientas').addClass('selected');
			$('#wrapperPresentador').addClass('selected');
			presentador();
		}
		else if(pag == 'privacidad.html'){
			saveForm();
			form = '';
			submenuHide();
			$('#menuInferior li.selected').removeClass('selected');
			privacidad();
		}
		$('body').scrollTop(0);
		
	}
	
});