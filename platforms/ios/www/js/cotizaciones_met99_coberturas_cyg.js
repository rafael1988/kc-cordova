$(document).on('click', '#check_conyuge', function(){
	if($(this).prop('checked')){
		$('.txtconyuge').prop('disabled', false);
		$('#met99_edad_conyuge').val(15);
		$('#met99_edad_conyuge').change();
		$('.check_conyuge_all').prop('disabled', false);
	}
	else{
		$('.txtconyuge').prop('disabled', true);
		$('.txtconyuge').val('');
		$('.check_conyuge_all').prop('checked', false);
		$('.check_conyuge_all').prop('disabled', true);
		checkConyuge($('#sa_bacy'));
		checkConyuge($('#sa_gfc'));
		checkConyuge($('#sa_bcacy'));
	}
});

//$(document).on(met99_edad_conyuge change) cotizaciones_met99_sa.js
function onEdadConyugeChange(){
	$('.check_conyuge_all').each(function(i,obj){
		var that = $(this);
		if(that.prop('checked')){
			//setConyugeVals(that);
			checkCygLimiteEdades(that);
		}
	});
	//var that = $('#sa_gfc');
	//if(that.prop('checked'))
	//	setConyugeVals(that);
}

$(document).on('click', '.check_conyuge', function(){
	checkConyuge($(this));
	/*var that = $(this);
	var id = that.attr('id');
	if(that.prop('checked')){
		$('#' + id + '_txt').prop('disabled', false);
		setInitialSA($('#' + id + '_txt')); //cotizaciones_met99_coberturas
		//setConyugeVals(that);
		checkCygLimiteEdades(that);
	}
	else{
		$('#' + id + '_txt').prop('disabled', true);
		$('#' + id + '_txt').val('');
	}*/
});

function checkConyuge(that){
	var id = that.attr('id');
	if(that.prop('checked')){
		$('#' + id + '_txt').prop('disabled', false);
		setInitialSA($('#' + id + '_txt')); //cotizaciones_met99_coberturas
		//setConyugeVals(that);
		checkCygLimiteEdades(that);
	}
	else{
		$('#' + id + '_txt').prop('disabled', true);
		$('#' + id + '_txt').val('');
		$('#' + id + '_pa').change();
		$('#' + id + '_pa').val('');
	}
}

function checkCygLimiteEdades(that){
	var rangos = limiteEdades[that.val()];
	if(parseInt($('#met99_edad_conyuge').val()) > rangos.Maxima){
		alert("La edad de la persona no se encuentra dentro de los limites permitidos de la cobertura.");
		that.prop('checked',false);
		var id =  that.attr('id');
		$('#' + id + '_txt').prop('disabled', true);
		$('#' + id + '_txt').val('');
		$('#' + id + '_pa').change();
	}
	else{
		setConyugeVals(that);
	}
}

$(document).on('click', '#sa_bacy', function(){
	checkConyuge($(this));
	checkBacyGfc(1);
});
$(document).on('change', '#sa_bacy_txt', function(){
	var val = $(this).val().replace(/,/g,"");
	var old = $(this).data('oldVal');
	if(isNaN(val) || val == ""){
		$(this).val(old);
	}
	else if(!(val % 1 === 0)){
		val = parseInt(val);
		$(this).val(val);
	}
	checkBacyGfc(2);
	onCoberturaCygChange($(this));
});

$(document).on('click', '#sa_gfc', function(){
	setGFC();
	checkBacyGfc(3);
});

function setGFC(){
	var that = $('#sa_gfc');
	var id = that.attr('id');
	if(that.prop('checked')){
		var min = salarioDiario*30*20;
		//console.log(min);
		var bas35 = parseFloat($('#sa_bas').val().replace(/,/g,""))*.35;
		//console.log(bas35);
		if(min < bas35){
			$('#' + id + '_txt').prop('disabled', false);
			setInitialSA($('#' + id + '_txt')); //cotizaciones_met99_coberturas
			setConyugeVals(that);
		}
		else{
			alert("El 35% de la suma asegurada basica debe ser mayor a $" + addCommas(min));
			that.prop('checked',false);
			$('#' + id + '_txt').val('');
			$('#' + id + '_pa').val('');
		}
	}
	else{
		$('#' + id + '_txt').prop('disabled', true);
		$('#' + id + '_txt').val('');
		$('#' + id + '_pa').val('');
	}
}

$(document).on('change', '#sa_gfc_txt', function(){
	var val = $(this).val().replace(/,/g,"");
	var old = $(this).data('oldVal');
	if(isNaN(val) || val == ""){
		$(this).val(old);
	}
	else if(!(val % 1 === 0)){
		val = parseInt(val);
		$(this).val(val);
	}
	var bas = parseFloat($('#sa_bas').val().replace(/,/g,""));
	var bas35 = bas*0.35;
	var sa = parseFloat($(this).val());
	if(sa > bas35){
		$(this).val(bas35.toFixed(2));
	}
	checkBacyGfc(4);
	setConyugeVals($('#sa_gfc'));
});

function checkBacyGfc(flag){ //flag = 1 > bacy checkd, flag = 2 > bacy changd, flag = 3 > gfc checkd, flag = 4 > gfc changd
	if($('#sa_gfc').prop('checked') && $('#sa_bacy').prop('checked')){
		//console.log('checkBacyGfc ' + flag);
		var bas = parseFloat($('#sa_bas').val().replace(/,/g,""));
		var gfc = parseFloat($('#sa_gfc_txt').val().replace(/,/g,""));
		//console.log($('#sa_gfc_txt').val());
		var bacy = parseFloat($('#sa_bacy_txt').val().replace(/,/g,""));
		//console.log(bacy);
		if((gfc + bacy) > bas){
			console.log('over bas');
			//flag = 1 no rebasa el limite de bas UPDATE: cambio inicial de min a max sa, si rebasa el limite
			if(flag == 1){
				var max = bas - gfc;
				$('#sa_bacy_txt').val(addCommas(max.toFixed(2)));
				$('#sa_bacy_txt').change();
			}
			else if(flag == 2){
				var min = salarioDiario*30*20;
				var max = bas - bacy;
				var bas35 = bas*0.35;
				if(max < min){
					$('#sa_gfc').prop('checked',false);
					$('#sa_gfc_txt').prop('disabled', true);
					$('#sa_gfc_txt').val('');
					$('#sa_gfc_pa').val('');
				}
				else if(bas35 > max){
					$('#sa_gfc_txt').val(addCommas(max.toFixed(2)));
				}
				else{
					$('#sa_gfc_txt').val(addCommas(bas35.toFixed(2)));
				}
			}
			else if(flag == 3){
				//console.log('gfc checkd');
				var max = bas - bacy;
				if(max < gfc){
					//alert("La suma de la cobertura BACY y la cobertura GFC debe ser menor a la suma asegurada basica.");
					$('#sa_gfc').prop('checked',false);
					$('#sa_gfc_txt').prop('disabled', true);
					$('#sa_gfc_txt').val('');
					$('#sa_gfc_pa').val('');
				}
			}
			else if(flag == 4){
				var newgfc = bas - bacy;
				$('#sa_gfc_txt').val(addCommas(newgfc.toFixed(2)));
			}
		}
	}
}
/*
$(document).on('change', '.saCoberturaCyg', function(){
	var that = $(this);
	var id = $(this).attr('id');
	var checkid = id.replace('_txt', '');
	var checkbox = $('#' + checkid);
	if(that.val() != '' && parseFloat(that.val()) <= parseFloat($('#sa_bas').val())){
		setConyugeVals(checkbox);
	}
	else if(that.val() != ''){
		that.val($('#sa_bas').val());
		setConyugeVals(checkbox);
	}
});
*/
$(document).on('focus', '.saCoberturaCyg', function(){
	$(this).val($(this).val().replace(/,/g,""));
	$(this).data('oldVal', $(this).val());
});

$(document).on('blur', '.saCoberturaCyg', function(){
	var prevPrima = parseFloat($(this).data('oldVal'));
	if($(this).val() == prevPrima){
		$(this).val(addCommas(prevPrima.toFixed(2)))
	}
});
$(document).on('change', '#sa_bcacy_txt', function(){
	var val = $(this).val();
	var old = $(this).data('oldVal');
	if(isNaN(val) || val == ""){
		$(this).val(old);
	}
	else if(!(val % 1 === 0)){
		val = parseInt(val);
		$(this).val(val);
	}
	onCoberturaCygChange($(this));
});

function onCoberturaCygChange(that){
	var id = that.attr('id');
	var checkid = id.replace('_txt', '');
	var checkbox = $('#' + checkid);
	var val = that.val().replace(/,/g,"");
	var sabas = $('#sa_bas').val().replace(/,/g,"");
	if(val != '' && parseFloat(val) <= parseFloat(sabas)){
		setConyugeVals(checkbox);
	}
	else if(val != ''){
		that.val(sabas);
		setConyugeVals(checkbox);
	}
}

function setConyugeVals(that){
	if(that.prop('checked')){//no siempre se va a cumplir este if, ej: gfc
		var id = that.attr('id');
		var val = that.val();
		var tarifa = factoresCy[val];
		$('#' + id + '_tarifa').val(tarifa);
		var sa = parseFloat($('#' + id + '_txt').val().replace(/,/g,""));
		var pa = tarifa * sa / 1000;
		$('#' + id + '_txt').val(addCommas(sa.toFixed(2)));
		$('#' + id + '_pa').val(addCommas(pa.toFixed(2)));
		//$('#' + id + '_pa').val(pa);
		$('#' + id + '_pa').change();
	}
}