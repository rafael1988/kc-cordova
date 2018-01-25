var CorreosVIDA = {
	TipoCotizacion: "VIDA",
	NumeroAgente: "123456789",
	NombreAgente: "JUAN PEREZ GARCIA",
	Promotoria: "GKCAS",
	Producto: "met99",
	NombreTitular: "JOSE VALDVIA HERNANDEZ",
	EmailTitular: "",
	RFC: "",
	Habito: "NO FUMA",
	EdadReal: 33,
	EdadCalculo: 33,
	Ocupacion: "ACTOR",
	Suscripcion: "Suscripción Manual",
	Sexo: "Masculino",
	PrimaExedenteAnual: 10.50,
	PrimaTotalAnual: 1005.00,
	PrimaTotalMensual: 83.75,
	PrimaTotalQuincenal: 41.88,
	PrimaDiaria: 2.792,
	FormaPago: "ANUAL",
	MensajeExtraprima: "La prima incluye el monto de las extraprimas"
};

$(document).on('click', '.btnEnviarCoti', function(){
	var tipo = $(this).attr('tipocotizacion');
	if(tipo == 'Met99'){
		var obj = JSON.parse(localStorage.getItem('MET99_temp'));
		$('#nombreEnvio').html(obj.MET99.nombre);
		$('#tipoEnvio').val(tipo);
	}
	else if(tipo == 'Gmm'){
		var obj = JSON.parse(localStorage.getItem('GMM_temp'));
		$('#nombreEnvio').html(obj.nombre);
		$('#tipoEnvio').val(tipo);
	}
	else if(tipo == 'Auto'){
		var obj = JSON.parse(localStorage.getItem('Auto_temp'));
		$('#nombreEnvio').html(obj.nombre);
		$('#tipoEnvio').val(tipo);
	}
	$('#mailEnvio').val('');
	$('.enviosPopup').show();
});

$(document).on('click', '#closeEnvios', function(){
	closeEnvios();
});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

$(document).on('keydown', '#mailEnvio', function(e){
	if(e.which == 32)
		e.preventDefault();
});

$(document).on('click', '#confirmEnvios', function(){
	var mail = $('#mailEnvio').val();
	if(mail == ''){
		alert('El campo de correo electronico es obligatorio.');
	}
	else if(!validateEmail(mail)){
		alert("Correo electronico invalido.");
	}
	else{
		var tipo = $('#tipoEnvio').val();
		if(tipo == 'Met99'){
			var obj = JSON.parse(localStorage.getItem('MET99_temp'));
			obj.MET99['correo'] = mail;
			localStorage.setItem('MET99_temp', JSON.stringify(obj));
			closeEnvios();
			enviarMet99();
		}
		else if(tipo == 'Gmm'){
			var obj = JSON.parse(localStorage.getItem('GMM_temp'));
			obj['correo'] = mail;
			localStorage.setItem('GMM_temp', JSON.stringify(obj));
			closeEnvios();
			enviarGMM();
		}
		else if(tipo == 'Auto'){
			var obj = JSON.parse(localStorage.getItem('Auto_temp'));
			obj['correo'] = mail;
			localStorage.setItem('Auto_temp', JSON.stringify(obj));
			closeEnvios();
			enviarAuto();
		}
		
	}
});

function closeEnvios(){
	$('.enviosPopup').hide();
}

//$(document).on('click', '#btnEnviarMet99', function(){
function enviarMet99(){
	$('#alertMsg').html('Enviando informaci&oacute;n');
	$('#loader').show();
	var datos = JSON.parse(localStorage.getItem('datosAgente'));
	var obj = JSON.parse(localStorage.getItem('MET99_temp'));
	CorreosVIDA['NumeroAgente'] = localStorage.getItem('com.kc.idusuario');
	CorreosVIDA['NombreAgente'] = datos.Mensaje;
	CorreosVIDA['Promotoria'] = datos.Promotoria;
	CorreosVIDA['NombreTitular'] = obj.MET99.nombre;
	CorreosVIDA['EmailTitular'] = obj.MET99.correo;
	CorreosVIDA['Habito'] = (obj.MET99.met99_fuma == "1" ? "NO FUMA" : "FUMA");
	CorreosVIDA['EdadReal'] = parseInt(obj.MET99.met99_edad);
	CorreosVIDA['EdadCalculo'] = parseInt(obj.MET99.met99_edad_calculada);
	CorreosVIDA['Ocupacion'] = obj.MET99.met99_ocupacion_txt;
	CorreosVIDA['Suscripcion'] = obj.MET99.met99_suscripcion_txt;
	CorreosVIDA['Sexo'] = obj.MET99.met99_sexo_txt;
	CorreosVIDA['PrimaExedenteAnual'] = formatFloat(obj.coberturas.prima_excedente_total);
	CorreosVIDA['PrimaTotalAnual'] = formatFloat(obj.coberturas.prima_anual_total) + CorreosVIDA['PrimaExedenteAnual'];
	CorreosVIDA['PrimaTotalMensual'] = formatFloat(CorreosVIDA['PrimaTotalAnual'] / 12);
	CorreosVIDA['PrimaTotalQuincenal'] = formatFloat(CorreosVIDA['PrimaTotalAnual'] / 24);
	CorreosVIDA['PrimaDiaria'] = formatFloat(CorreosVIDA['PrimaTotalAnual'] / 360);
	
	//console.log(CorreosVIDA);
	var CoberturasCorreosVIDA = [];
	var sabas = formatFloat(obj.coberturas.bas);
	//var pabas = formatFloat(obj.coberturas.bas_pa);
	var pabas = parseFloat(obj.coberturas.prima_anual_total) + parseFloat(obj.coberturas.prima_excedente_total.replace(/,/g,''));
	var extraprima = formatFloat(sabas * parseFloat(obj.coberturas.bas_ep) / 12000);
	var item = {
		IdCorreoVIDA: 0,
		NombreCobertura: nombresCoberturas['bas'],
		SumaAsegurada: sabas,
		PrimaAnual: pabas,
		ExtraPrima: extraprima
	};
	CoberturasCorreosVIDA.push(item);
	for(var k in obj.coberturas){
		if(k.indexOf('_pa') > 0 && k != 'bas_pa'){
			var cob = k.replace('_pa','');
			if(obj.coberturas[cob] != 'false'){
				if(obj.coberturas[cob + '_ep'] != undefined && obj.coberturas[cob + '_ep'] != ''){
					if(parseFloat(obj.coberturas[cob + '_ep']) == 0){
						ep = 0
					}
					else{
						ep = parseFloat(obj.coberturas[cob + '_pa']) / (12 * parseFloat(obj.coberturas[cob + '_ep']));
					}
				}
				else{
					ep = 0;
				}
				item = {
					IdCorreoVIDA: 0,
					NombreCobertura: nombresCoberturas[cob],
					SumaAsegurada: formatFloat(obj.coberturas[cob + '_txt']),
					PrimaAnual: formatFloat(obj.coberturas[cob + '_pa']),
					ExtraPrima: formatFloat(ep)
				};
				CoberturasCorreosVIDA.push(item);
			}
		}
	}
	console.log(CoberturasCorreosVIDA);
	generarPF();
	var ProyeccionFinancieraCorreosVIDA = [];
	for(var i = 1; i <= 20; i++){
		var res = (proyeccionFinanciera.reserva[(i*12)-1] > 0 ? proyeccionFinanciera.reserva[(i*12)-1] : 0);
		var inv = proyeccionFinanciera.inversion[(i*12)-1];
		item = {
			IdCorreoVIDA: 0,
			AnioVigencia: i + "",
			SumaAseguradaAlcanzada: sabas,
			PrimaAnual: pabas,
			ValorEfectivoFinal: res,
			FondoInversion: inv,
			SAPorFallecimiento: formatFloat(sabas + res + inv)
		};
		ProyeccionFinancieraCorreosVIDA.push(item);
	}

	var envios = {
		CorreosVIDA: [CorreosVIDA],
		CoberturasCorreosVIDA: CoberturasCorreosVIDA,
		ProyeccionFinancieraCorreosVIDA: ProyeccionFinancieraCorreosVIDA
	};
	
	var datos = { Token: datos.Token, DetallesCotizacion: JSON.stringify(envios)};
	//var url =  "http://187.174.229.88/triton/datos/EnvioCotizacion?callback=enviosResponseHandler&_dc=1437679621249";
	var url =  "http://tritonv2.grupokc.com.mx/datos/EnvioCotizacion?callback=enviosResponseHandler&_dc=1437679621249";
	console.log(datos);
	$.ajax({
		url: url, 
		//dataType: 'jsonp',
		type: 'POST',
		timeout: 60000,
		data: datos,
		success: function(d){
			/*$('#loader').hide();
			console.log("Respuesta: " + d);
			d = JSON.parse(d);
			if(d.data == 'OK'){
				alert("La cotizacion ha sido enviada.");
			}
			else{
				alert("La cotizacion no ha podido ser enviada.");
			}*/
		},
		error: function(xhr, status, e){
			console.log("Este mensaje lo escribo yo //// status: " + status);
			console.log("Desde la consola //// e:" + e);
			$('#loader').hide();
			alert("Ha ocurrido un error. Verifica tu conexión a internet.");
		}
	});
//});
}

function enviosResponseHandler(d){
	$('#loader').hide();
	console.log("Respuesta: " + d);
	d = JSON.parse(d);
	if(d.data == 'OK'){
		alert("La cotizacion ha sido enviada.");
	}
	else{
		alert("La cotizacion no ha podido ser enviada.");
	}
}

function formatFloat(n){
	return parseFloat(parseFloat(n).toFixed(2));
}

var nombresCoberturas = {};
nombresCoberturas['bas'] = "Beneficio Básico por fallecimiento (BAS)";
nombresCoberturas['bit'] = "Beneficio Invalidez Total y Permanente (BIT)";
nombresCoberturas['cii'] = "Cobertura Indemnización por Invalidez Total y Permanente (CII)";
nombresCoberturas['cma'] = "Muerte Accidental Asegurado (CMA)";
nombresCoberturas['tiba'] = "Triple Indemnización por Muerte Accidental y/o pérdidas orgánicas (TIBA)";
nombresCoberturas['cat'] = "Beneficio de cancer del titular (CAT)";
nombresCoberturas['gfa'] = "Gastos Funerarios Asegurado (GFA)";
nombresCoberturas['ge'] = "Beneficio de Garantia Escolar (GE)";
nombresCoberturas['ap'] = "Accidentes Personales Titular (AP)";
nombresCoberturas['eg'] = "Enfermedades Titular (EG)";
nombresCoberturas['cr'] = "Cirugias Programadas Titular (CR)";
nombresCoberturas['bacy'] = "Beneficio Adicional Cónyuge (BACY)";
nombresCoberturas['gfc'] = "Gastos Funerarios Cónyuge (GFC)";
nombresCoberturas['bcacy'] = "Beneficio de cancer Cónyuge (BCAC)";
nombresCoberturas['bac'] = "Beneficio Adicional Complementario (BAC)";
nombresCoberturas['cac1'] = "Cáncer Complementario 1 (CAC1)";
nombresCoberturas['cac2'] = "Cáncer Complementario 2 (CAC2)";
nombresCoberturas['cac3'] = "Cáncer Complementario 3 (CAC3)";
nombresCoberturas['gfh'] = "Gastos Funerarios Hijos (GFH)";
nombresCoberturas['gfc1'] = "Gastos Funerarios Complementario 1 (GFC1)";
nombresCoberturas['gfc2'] = "Gastos Funerarios Complementario 2 (GFC2)";
nombresCoberturas['gfc3'] = "Gastos Funerarios Complementario 3 (GFC3)";
nombresCoberturas['po1'] = "Accidentes Personales Complementario 1 (PO1)";
nombresCoberturas['po2'] = "Accidentes Personales Complementario 2 (PO2)";
nombresCoberturas['po3'] = "Accidentes Personales Complementario 3 (PO3)";
nombresCoberturas['po4'] = "Accidentes Personales Complementario 4 (PO4)";
//console.log(nombresCoberturas);

  /***************************************************************************************************************************/
 /**************************************************** GMM *****************************************************************/
/*************************************************************************************************************************/

var CorreosGMM = {
	TipoCotizacion: "GMM",
	NumeroAgente: "123456789",
	NombreAgente: "JUAN PEREZ GARCIA",
	Promotoria: "GKCAS",
	Producto: "MédicaLife Familiar",
	NombreTitular: "JOSE VALDVIA HERNANDEZ",
	EmailTitular: "",
	RFC: "",
	Edad: 33,
	Sexo: "Masculino",
	Estado: "AGUASCALIENTES",
	Municipio: "TODOS",
	Plan: "GMM",
	SumaAsegurada: 2220420.00,
	Deducible: 1000.00,
	CoaseguroAdicional: "10%",
	FormaPago: "ANUAL",
	RecargoFormaPago: 0.00,
	DerechoDePoliza: 782.61,
	SubTotal: 48179.67,
	IVA: 7708.75,
	ImporteTotal: 0,
	PrimaNetaAnual: 47397.06,
	PrimaTotal: 55888.42,
	DescripciónPlan_CoberturasSolicitadas: ""
};

//$(document).on('click', '#btnEnviarGMM', function(){
function enviarGMM(){
	$('#alertMsg').html('Enviando informaci&oacute;n');
	$('#loader').show();
	var datos = JSON.parse(localStorage.getItem('datosAgente'));
	var obj = JSON.parse(localStorage.getItem('GMM_temp'));
	CorreosGMM['NumeroAgente'] = localStorage.getItem('com.kc.idusuario');
	CorreosGMM['NombreAgente'] = datos.Mensaje;
	CorreosGMM['Promotoria'] = datos.Promotoria;
	CorreosGMM['NombreTitular'] = obj.nombre;
	CorreosGMM['EmailTitular'] = obj.correo;
	CorreosGMM['Edad'] = parseInt(obj.gmm_edad);
	CorreosGMM['Sexo'] = obj.gmm_sexo_txt;
	CorreosGMM['Estado'] = obj.gmm_estado_txt;
	CorreosGMM['Municipio'] = obj.gmm_municipio_txt;
	CorreosGMM['Plan'] = obj.gmm_plan_txt;
	CorreosGMM['SumaAsegurada'] = parseFloat(obj.gmm_equivalente.replace('$','').replace(/,/g,''));
	CorreosGMM['Deducible'] = parseFloat(obj.gmm_deducible_txt.replace('$','').replace(/,/g,'').replace(' ',''));
	CorreosGMM['CoaseguroAdicional'] = obj.gmm_coaseguro_txt;
	CorreosGMM['FormaPago'] = obj.gmm_forma_pago_txt;
	CorreosGMM['RecargoFormaPago'] = obj.recargo;
	CorreosGMM['DerechoDePoliza'] = obj.derecho_poliza;
	CorreosGMM['SubTotal'] = obj.subtotal;
	CorreosGMM['IVA'] = obj.iva;
	CorreosGMM['PrimaNetaAnual'] = obj.prima_titular;
	CorreosGMM['PrimaTotal'] = obj.total;
	CorreosGMM['DescripciónPlan_CoberturasSolicitadas'] = "Estado: " + obj.gmm_estado_txt + ". Municipio: " + obj.gmm_municipio_txt + ". Plan: " + obj.gmm_plan_txt;
	CorreosGMM['DescripciónPlan_CoberturasSolicitadas'] += ". Suma Asegurada: " + obj.gmm_suma_asegurada_txt + ". Deducible: " + obj.gmm_deducible_txt;
	CorreosGMM['DescripciónPlan_CoberturasSolicitadas'] += ". Coaseguro: " + obj.gmm_coaseguro_txt;
	console.log(CorreosGMM);
	var AdicionalesCorreosGMM = [];
	for(var i = 0; i < obj.adicionales.length; i++){
		var item = {
			IdCorreoGMM: 0,
			NombreSolicitante: obj.adicionales[i].nombre,
			SexoSolicitante: obj.adicionales[i].sexo,
			EdadSolicitante: parseInt(obj.adicionales[i].edad),
			PrimaAnual: obj.adicionales[i].prima
		};
		AdicionalesCorreosGMM.push(item);
	}
	
	var envios = {
		CorreosGMM: [CorreosGMM],
		CoberturasAdicionalesCorreosGMM: [],
		AdicionalesCorreosGMM: AdicionalesCorreosGMM
	};
	//console.log(envios);
	//console.log(JSON.stringify(envios));
	var datos = { Token: datos.Token, DetallesCotizacion: JSON.stringify(envios)};
	//var url =  "http://187.174.229.88/triton/datos/EnvioCotizacion?callback=enviosResponseHandler&_dc=1437679621249";
	var url =  "http://tritonv2.grupokc.com.mx/datos/EnvioCotizacion?callback=enviosResponseHandler&_dc=1437679621249";
	console.log(datos);
	$.ajax({
		url: url, 
		//dataType: 'jsonp',
		type: 'POST',
		timeout: 60000,
		data: datos,
		success: function(d){
			/*$('#loader').hide();
			console.log("Respuesta: " + d);
			//d = JSON.parse(d);
			if(d.data == 'OK'){
				alert("La cotizacion ha sido enviada.");
			}
			else{
				alert("La cotizacion no ha podido ser enviada.");
			}*/
		},
		error: function(xhr, status, e){
			console.log("status: " + status);
			console.log("e:" + e);
			$('#loader').hide();
			alert("Ha ocurrido un error. Verifica tu conexión a internet.");
		}
	});
//});
}

  /***************************************************************************************************************************/
 /**************************************************** AUTO ****************************************************************/
/*************************************************************************************************************************/

var CorreosAUTO = {
	TipoCotizacion: "AUTO",
	NumeroAgente: "123456789",
	NombreAgente: "JUAN PEREZ GARCIA",
	Promotoria: "GKCAS",
	Aseguradora: "BANORTE",
	NombreTitular: "JOSE VALDVIA HERNANDEZ",
	EmailTitular: "",
	RFC: "",
	Edad: 33,
	DetalleVehiculo: "SONIC LTZ ABC A/C",
	Zona: "Ciudad de México",
	Marca: "ACURA",
	Modelo: "2015",
	DescripcionAutomovil: "ILX LUXURY CA CE CB CD CQ AUT 4 Cil. 4 Pts.",
	Paquete: "AMPLIA",
	Vigencia: "",
	NumeroCotizacion: "0165130908",
	Costo: 10470.64,
	PrimaNeta: 5834.20,
	TasaFinPF: 0,
	GastosExpedicion: 0,
	SubTotal: 0,
	IVA: 0,
	ImporteTotal: 0,
	TarifaAplicada: ""
};

//$(document).on('click', '#btnEnviarAuto', function(){
function enviarAuto(){
	$('#alertMsg').html('Enviando informaci&oacute;n');
	$('#loader').show();
	var datos = JSON.parse(localStorage.getItem('datosAgente'));
	var obj = JSON.parse(localStorage.getItem('Auto_temp'));
	CorreosAUTO['NumeroAgente'] = localStorage.getItem('com.kc.idusuario');
	CorreosAUTO['NombreAgente'] = datos.Mensaje;
	CorreosAUTO['Promotoria'] = datos.Promotoria;
	CorreosAUTO['Aseguradora'] = obj.auto_aseguradora_txt;
	CorreosAUTO['NombreTitular'] = obj.nombre;
	CorreosAUTO['EmailTitular'] = obj.correo;
	CorreosAUTO['Edad'] = parseInt(obj.auto_edad);
	CorreosAUTO['DetalleVehiculo'] = obj.auto_tipo_txt;
	CorreosAUTO['Zona'] = obj.auto_zona_txt;
	CorreosAUTO['Marca'] = obj.auto_marca_txt;
	CorreosAUTO['Modelo'] = obj.auto_modelo_txt;
	CorreosAUTO['DescripcionAutomovil'] = obj.auto_descripcion_txt;
	CorreosAUTO['Paquete'] = obj.auto_cobertura_txt;
	CorreosAUTO['NumeroCotizacion'] = obj.auto_descripcion;
	CorreosAUTO['Costo'] = formatFloat(obj.costo);
	CorreosAUTO['PrimaNeta'] = formatFloat(obj.costo);
	
	var CoberturasCorreosAUTO = [];
	for(var i = 0; i < obj.coberturas.length; i++){
		var item = {
			IdCorreoAUTO: 0,
			NombreRiesgo: obj.coberturas[i].nombre,
			SumaAsegurada: formatFloat(obj.coberturas[i].valor),
			Deducible: "",
			Prima: 0
		};
		CoberturasCorreosAUTO.push(item);
	}
	
	var envios = {
		CorreosAUTO: [CorreosAUTO],
		CoberturasCorreosAUTO: CoberturasCorreosAUTO,
		FormasPagoCorreosAUTO: []
	};
	var datos = { Token: datos.Token, DetallesCotizacion: JSON.stringify(envios)};
	//var url =  "http://187.174.229.88/triton/datos/EnvioCotizacion?callback=enviosResponseHandler&_dc=1437679621249";
	var url =  "http://tritonv2.grupokc.com.mx/datos/EnvioCotizacion?callback=enviosResponseHandler&_dc=1437679621249";
	console.log(datos);
	$.ajax({
		url: url, 
		//dataType: 'jsonp',
		type: 'POST',
		timeout: 60000,
		data: datos,
		success: function(d){
			/*$('#loader').hide();
			console.log("Respuesta: " + d);
			//d = JSON.parse(d);
			if(d.data == 'OK'){
				alert("La cotizacion ha sido enviada.");
			}
			else{
				alert("La cotizacion no ha podido ser enviada.");
			}*/
		},
		error: function(xhr, status, e){
			console.log(xhr);
			console.log("status: " + status);
			console.log("e:" + e);
			$('#loader').hide();
			alert("Ha ocurrido un error. Verifica tu conexión a internet.");
		}
	});
//});
}