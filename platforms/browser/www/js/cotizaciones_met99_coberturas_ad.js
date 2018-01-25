$(document).on('click', '.check_adicional', function(){
	var that = $(this);
	setInitialAdVals(that);
	//setAdicionalVals(that); se manda llamar desde met99_sa.onchange_edad triggered by setInitialVals 
});

$(document).on('click', '.check_cancer', function(){
	//console.log('hola');
	var count = 0;
	$('body').find('.check_cancer').each(function(i, obj){
		if($(this).prop('checked')){
			count++;
		}
	});
	if(count >= 4){
		alert("Solo puedes tener hasta 3 coberturas activas para cancer adicionales al titular.");
		$(this).prop('checked', false);
		setInitialAdVals($(this));
	}
});

function setInitialAdVals(that){
	var id = that.attr('id');
	//console.log(id);
	if(that.prop('checked')){
		$('#' + id + '_txt').prop('disabled', false);
		setInitialSA($('#' + id + '_txt'));
		//$('#' + id + '_txt').change(); //se utilizaba para llamar setAdicionalVals. Triggerd abajo, _edad.change
		$('#' + id + '_edad').prop('disabled', false);
		$('#' + id + '_edad').val(15);
		$('#' + id + '_edad').change();
		//$('#' + id + '_hijos').prop('disabled', false); //se cambio hijos de texto a select
		//$('#' + id + '_hijos').val(1); //se cambio hijos de texto a select
		$('#' + id + '_extra').prop('disabled', false);
		$('#' + id + '_basico').prop('disabled', false);
		$('#' + id + '_sexo').prop('disabled', false);

	}
	else{
		$('#' + id + '_txt').prop('disabled', true);
		$('#' + id + '_txt').val('');
		$('#' + id + '_pa').val('');
		$('#' + id + '_edad').prop('disabled', true);
		$('#' + id + '_edad').val('');
		//$('#' + id + '_hijos').prop('disabled', true);
		//$('#' + id + '_hijos').val('');
		$('#' + id + '_extra').prop('disabled', true);
		$('#' + id + '_extra').prop('checked', false);
		$('#' + id + '_basico').prop('disabled', true);
		$('#' + id + '_basico').prop('checked', false);
		$('#' + id + '_sexo').prop('disabled', true);
	}
}

$(document).on('focus', '.saCoberturaAd', function(){
	$(this).val($(this).val().replace(/,/g,""));
	$(this).data('oldVal', $(this).val());
});
$(document).on('blur', '.saCoberturaAd', function(){
	var prevPrima = parseFloat($(this).data('oldVal'));
	if($(this).val() == prevPrima){
		$(this).val(addCommas(prevPrima.toFixed(2)))
	}
});
$(document).on('change', '.saCoberturaAd', function(){
	var val = $(this).val().replace(/,/g,"");
	var old = $(this).data('oldVal');
	if(isNaN(val) || val == ""){
		$(this).val(old);
		val = old;
	}
	else if(!(val % 1 === 0)){
		val = parseInt(val);
		$(this).val(val);
	}
	var that = $(this);
	var id = $(this).attr('id');
	var checkid = id.replace('_txt', '');
	var checkbox = $('#' + checkid);
	if(parseFloat(val) <= parseFloat($('#sa_bas').val().replace(/,/g,""))){
		setAdicionalVals(checkbox);
	}
	else{
		that.val($('#sa_bas').val());
		setAdicionalVals(checkbox);
	}
});

$(document).on('change', '.sexo_adicional', function(){
	var id = $(this).attr('id');
	var checkid = id.replace('_sexo', '');
	getFactorBac(checkid);
	setAdicionalVals($('#' + checkid));
});

$(document).on('change', '.edad_adicional', function(){
	var edad = $(this).val();
	if(isNaN(edad) || edad < 15){
		$(this).val(15);
		edad = 15;
	}
	else if(edad > 70){
		$(this).val(70);
		edad = 70;
	}
	else if(!(edad % 1 === 0)){
		edad = parseInt(edad);
		$(this).val(edad);
	}
	var id = $(this).attr('id');
	var checkid = id.replace('_edad', '');
	setRangoEdadAdicional($(this));
	getFactorBac(checkid);
	setAdicionalVals($('#' + checkid));
});

$(document).on('focus', '.edad_po', function(){
	$(this).data('oldVal', $(this).val());
});

$(document).on('change', '.edad_po', function(){
	var val = $(this).val();
	var prevEdad = $(this).data('oldVal');
	//console.log("edadpo val: " + val);
	//console.log("edadpo prev: " + prevEdad);
	if(isNaN(val) || val == ""){
		console.log("isNan");
		$(this).val(prevEdad);
	}
	else if(!(val % 1 === 0)){
		val = parseInt(val);
		$(this).val(val);
	}
	setRangoEdadAdicional($(this));
});


function setRangoEdadAdicional(that){
	var id = that.attr('id');
	id = id.replace('_edad','');
	var idtarifa = $('#' + id).val();
	var rangos = limiteEdades[idtarifa];
	var edad = that.val();
	if(edad > rangos.Maxima){
		that.val(rangos.Maxima);
	}
	else if(edad < rangos.Minima){
		that.val(rangos.Minima);
	}
}

$(document).on('change', '#sa_bac_edad', function(){
	var edad = $(this).val();
	if(isNaN(edad) || edad < 15){
		$(this).val(15);
		edad = 15;
	}
	else if(edad > 70){
		$(this).val(70);
		edad = 70;
	}
	else if(!(edad % 1 === 0)){
		edad = parseInt(edad);
		$(this).val(edad);
	}
	//console.log(edad);
	db.transaction(function(tx){
		var q = 'SELECT factor FROM VIDA_Factores WHERE edad = ' + edad + ' AND id_tarifa = 5';
		tx.executeSql(q, [], function(tx, res){
			var tarifaBac;
			for(var i = 0; i < res.rows.length; i++){
				tarifaBac = res.rows.item(i).factor;
			}
			//console.log('bac_edad onchange ' + tarifaBac);
			$('#sa_bac_tarifa').val(tarifaBac);
			setAdicionalVals($('#sa_bac'));
		});
	});
});

function getFactorBac(id){
	//console.log('getFactorBac');
	//console.log(id);
	var tarifa = $('#' + id + '_sexo').val();
	//console.log('idtarifa ' + tarifa);
	var edad = $('#' + id + '_edad').val();
	//console.log('edad ' + edad);
	var bac = factoresCancer[edad][tarifa];
	$('#' + id + '_tarifa').val(bac);
}

$(document).on('click', '#sa_gfh', function(){
	setGFH();
});

function setGFH(){
	var that = $('#sa_gfh');
	var id = that.attr('id');
	if(that.prop('checked')){
		var min = salarioDiario*30*20;
		//console.log(min);
		var bas35 = parseFloat($('#sa_bas').val().replace(/,/g,""))*.35;
		//console.log(bas35);
		if(min < bas35){
			$('#' + id + '_txt').prop('disabled', false);
			setInitialSA($('#' + id + '_txt')); //cotizaciones_met99_coberturas
			$('#' + id + '_hijos').prop('disabled', false);
			$('#' + id + '_hijos').change();
			//setAdicionalVals(that); //se llama en _hijos.change ^
		}
		else{
			that.prop('checked',false);
			$('#' + id + '_txt').prop('disabled', true);
			$('#' + id + '_txt').val('');
			$('#' + id + '_hijos').prop('disabled', true);
		}
	}
	else{
		$('#' + id + '_txt').prop('disabled', true);
		$('#' + id + '_txt').val('');
		$('#' + id + '_pa').val('');
		$('#' + id + '_hijos').prop('disabled', true);
	}
}

$(document).on('focus', '#sa_gfh_txt', function(){
	$(this).val($(this).val().replace(/,/g,""));
	$(this).data('oldVal', $(this).val());
});
$(document).on('blur', '#sa_gfh_txt', function(){
	var prevPrima = parseFloat($(this).data('oldVal'));
	if($(this).val() == prevPrima){
		$(this).val(addCommas(prevPrima.toFixed(2)))
	}
});
$(document).on('change', '#sa_gfh_txt', function(){
	var val = $(this).val().replace(/,/g,"");
	var old = $(this).data('oldVal');
	if(isNaN(val) || val == ""){
		val = old;
		$(this).val(old);
	}
	else if(!(val % 1 === 0)){
		val = parseInt(val);
		$(this).val(val);
	}
	//console.log('hola');
	var bas = parseFloat($('#sa_bas').val().replace(/,/g,""));
	var bas35 = bas*0.35;
	var sa = parseFloat(val);
	if(sa > bas35){
		$(this).val(bas35.toFixed(2));
	}
	setAdicionalVals($('#sa_gfh'));
});

$(document).on('change', '#sa_gfh_hijos', function(){
	var val = $(this).val();
	$('#sa_gfh_tarifa').val(factoresGfh[val]);
	setAdicionalVals($('#sa_gfh'));
});

$(document).on('click', '.check_gfc', function(){
	//console.log('.check_gfc clicked');
	setGFCAd($(this));
});

function setGFCAd(that){
	//var that = $('#sa_gfh');
	var id = that.attr('id');
	if(that.prop('checked')){
		var min = salarioDiario*30*20;
		//console.log(min);
		var bas35 = parseFloat($('#sa_bas').val().replace(/,/g,""))*.35;
		//console.log(bas35);
		if(min < bas35){
			$('#' + id + '_txt').prop('disabled', false);
			setInitialSA($('#' + id + '_txt')); //cotizaciones_met99_coberturas
			$('#' + id + '_edad').prop('disabled', false);
			$('#' + id + '_edad').val(15);
			$('#' + id + '_edad').change();
			//setAdicionalVals(that);  //se llama en _edad.change ^
		}
		else{
			that.prop('checked',false);
			$('#' + id + '_txt').prop('disabled', true);
			$('#' + id + '_txt').val('');
			$('#' + id + '_edad').prop('disabled', true);
			$('#' + id + '_edad').val('');
		}
	}
	else{
		$('#' + id + '_txt').prop('disabled', true);
		$('#' + id + '_txt').val('');
		$('#' + id + '_edad').prop('disabled', false);
		$('#' + id + '_edad').val('');
		$('#' + id + '_pa').val('');
	}
}

$(document).on('focus', '.txt_gfc', function(){
	$(this).val($(this).val().replace(/,/g,""));
	$(this).data('oldVal', $(this).val());
});
$(document).on('blur', '.txt_gfc', function(){
	var prevPrima = parseFloat($(this).data('oldVal'));
	if($(this).val() == prevPrima){
		$(this).val(addCommas(prevPrima.toFixed(2)))
	}
});
$(document).on('change', '.txt_gfc', function(){
	var val = $(this).val().replace(/,/g,"");
	var old = $(this).data('oldVal');
	if(isNaN(val) || val == ""){
		val = old;
		$(this).val(old);
	}
	else if(!(val % 1 === 0)){
		val = parseInt(val);
		$(this).val(val);
	}
	//console.log('hola');
	var bas = parseFloat($('#sa_bas').val().replace(/,/g,""));
	var bas35 = bas*0.35;
	var sa = parseFloat(val);
	if(sa > bas35){
		$(this).val(bas35.toFixed(2));
	}
	var id = $(this).attr('id');
	var checkid = id.replace('_txt', '');
	setAdicionalVals($('#' + checkid));
});

$(document).on('change', '.edad_gfc', function(){
	var edad = $(this).val();
	if(isNaN(edad) || edad < 15){
		$(this).val(15);
		edad = 15;
	}
	else if(edad > 70){
		$(this).val(70);
		edad = 70;
	}
	else if(!(edad % 1 === 0)){
		edad = parseInt(edad);
		$(this).val(edad);
	}
	setRangoEdadAdicional($(this));
	var val = $(this).val();
	var id = $(this).attr('id');
	var checkid = id.replace('_edad', '');
	$('#' + checkid + '_tarifa').val(factoresGfc[val]);
	setAdicionalVals($('#' + checkid));
});

function setAdicionalVals(that){
	//console.log('setaditionalvals');
	if(that.prop('checked')){
		var id = that.attr('id');
		var tarifa = parseFloat($('#' + id + '_tarifa').val());
		var sa = parseFloat($('#' + id + '_txt').val().replace(/,/g,""));
		var pa = tarifa * sa / 1000;
		$('#' + id + '_txt').val(addCommas(sa.toFixed(2)));
		$('#' + id + '_pa').val(addCommas(pa.toFixed(2)));
		$('#' + id + '_pa').change();
	}
}

$(document).on('click', '.check_po', function(){
	var id = $(this).attr('id');
	if($(this).prop('checked')){
		$('#' + id + '_edad').prop('disabled', false);
			$('#' + id + '_edad').val(15);
		$('#' + id + '_extra').prop('disabled', false);
		$('#' + id + '_basico').prop('disabled', false);
		$('#' + id + '_basico').prop('checked', true);
		$('#' + id + '_basico').click();
	}
	else{
		$('#' + id + '_edad').prop('disabled', true);
		$('#' + id + '_edad').val('');
		$('#' + id + '_extra').prop('disabled', true);
		$('#' + id + '_extra').prop('checked', false);
		$('#' + id + '_basico').prop('disabled', true);
		$('#' + id + '_basico').prop('checked', false);
		$('#' + id + '_pa').val('');
		$('#' + id + '_txt').val('');
	}
});

$(document).on('click', '.po_basico', function(){
	var id = $(this).attr('id');
	id = id.replace('_basico','');
	$('#' + id + '_pa').val(189);
	$('#' + id + '_txt').val(1000);
	$('#' + id + '_pa').change();
});

$(document).on('click', '.po_extra', function(){
	var id = $(this).attr('id');
	id = id.replace('_extra','');
	$('#' + id + '_pa').val(227.37);
	$('#' + id + '_txt').val(1203);
	$('#' + id + '_pa').change();
});

/*
$(document).on('change', ' limite_edad_txt', function(){
	console.log('hola');
	var id = $(this).attr('id');
	id = id.replace('_edad','');
	var idtarifa = $('#' + id).val();
	var rangos = limiteEdades[idtarifa];
	var edad = $(this).val();
	if(edad > rangos.Maxima){
		$(this).val(rangos.Maxima);
	}
	else if(edad < rangos.Minima){
		$(this).val(rangos.Minima);
	}
});
*/