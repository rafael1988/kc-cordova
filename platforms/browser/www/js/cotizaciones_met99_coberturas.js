$(document).on('click', '.check_cober', function(){
	var that = $(this);
	console.log('check_cober ' + that.attr('id'));
	setInitialVals(that);
});

$(document).on('click', '#sa_cma', function(){
	//$('#sa_tiba').prop('checked', false);
	if($(this).prop('checked') && $('#sa_tiba').prop('checked')){
		$('#sa_tiba').click();
	}
	//setInitialVals($('#sa_tiba'));
	setInitialVals($(this))
});

$(document).on('click', '#sa_tiba', function(){
	//$('#sa_cma').prop('checked', false);
	if($(this).prop('checked') && $('#sa_cma').prop('checked')){
		$('#sa_cma').click();
	}
	//setInitialVals($('#sa_cma'));
	setInitialVals($(this))
});

$(document).on('click', '#sa_gfa', function(){
	setGFA();
});

function setGFA(){
	var that = $('#sa_gfa');
	if(that.prop('checked')){
		var min = salarioDiario*30*20;
		//console.log(min);
		var bas35 = parseFloat($('#sa_bas').val().replace(/,/g,""))*.35;
		//console.log(bas35);
		if(min < bas35){
			setInitialVals(that);
			//setCoberturaVals(that);
		}
		else{
			alert("El 35% de la suma asegurada basica debe ser mayor a $" + addCommas(min));
			that.prop('checked',false);
			var id = that.attr('id');
			$('#' + id + '_txt').val('');
			$('#' + id + '_pa').val('');
		}
	}
	else{
		setInitialVals(that);
	}
}

$(document).on('click', '#sa_ap', function(){
	var id = $(this).attr('id');
	if($(this).prop('checked')){
		$('#' + id + '_extra').prop('disabled', false);
		$('#' + id + '_basico').prop('disabled', false);
		$('#' + id + '_basico').prop('checked', true);
		$('#' + id + '_basico').click();
	}
	else{
		$('#' + id + '_extra').prop('disabled', true);
		$('#' + id + '_extra').prop('checked', false);
		$('#' + id + '_basico').prop('disabled', true);
		$('#' + id + '_basico').prop('checked', false);
		$('#sa_ap_pa').val('');
		$('#sa_ap_txt').val('');
	}
});

$(document).on('click', '.ap', function(){
	var id = $(this).attr('id');
	if(id == 'sa_ap_basico'){
		$('#sa_ap_pa').val(189);
		$('#sa_ap_txt').val(1000);
	}
	else{
		$('#sa_ap_pa').val(227.37);
		$('#sa_ap_txt').val(1203);
	}
	$('#sa_ap_pa').change();
});

function setInitialVals(that){
	var id = that.attr('id');
	//console.log(id);
	if(that.prop('checked')){
		$('#' + id + '_txt').prop('disabled', false);
		setInitialSA($('#' + id + '_txt'));
		//console.log('setinitialvals');
		$('#' + id + '_txt').change();
		/*$('#' + id + '_edad').prop('disabled', false);
		$('#' + id + '_edad').val(15);
		$('#' + id + '_hijos').prop('disabled', false);
		$('#' + id + '_hijos').val(1);
		$('#' + id + '_extra').prop('disabled', false);
		$('#' + id + '_basico').prop('disabled', false);*/
	}
	else{
		$('#' + id + '_txt').prop('disabled', true);
		$('#' + id + '_txt').val('');
		$('#' + id + '_pa').val('');
		/*$('#' + id + '_edad').prop('disabled', true);
		$('#' + id + '_edad').val('');
		$('#' + id + '_hijos').prop('disabled', true);
		$('#' + id + '_hijos').val('');
		$('#' + id + '_extra').prop('disabled', true);
		$('#' + id + '_extra').prop('checked', false);
		$('#' + id + '_basico').prop('disabled', true);
		$('#' + id + '_basico').prop('checked', false);*/
	}
}

function setInitialSA(that){
	var sabas = $('#sa_bas').val();
	sabas = parseFloat(sabas.replace(/,/g,""));
	var salarioMin = salarioDiario*30*20;
	if(sabas > 6000000 && that.hasClass('max6m')){
		that.val(6000000);
	}
	if(sabas > 3000000 && that.hasClass('max3m')){
		that.val(3000000);
	}
	else if(sabas > 1000000 && that.hasClass('max1m')){
		that.val(1000000);
	}
	else if(that.hasClass('max180')){
		var sa = 180000;
		if((sabas*.35) < sa){
			sa = Math.round(sabas*.35);
		}
		that.val(sa);	
	}
	else if(sabas > 100000 && that.hasClass('max100')){
		that.val(100000);
	}
	else if(sabas > 30000 && that.hasClass('max30')){
		that.val(30000);
	}
	else if(sabas > (salarioMin*10) && that.hasClass('maxSal2')){
		that.val(salarioMin*10);
	}
	else{
		that.val(sabas);
	}
	/*if(that.hasClass('min10')){
		that.val(10000);
	}
	else if(that.hasClass('min30')){
		that.val(30000);
	}
	else if(that.hasClass('minSal')){
		that.val(salarioDiario*30*20);
	}*/
}

$(document).on('focus', '#prima_excedente_total', function(){
	$(this).val($(this).val().replace(/,/g,""));
	$(this).data('oldVal', $(this).val());
});
$(document).on('blur', '#prima_excedente_total', function(){
	/*var prevPrima = parseFloat($(this).data('oldVal'));
	if($(this).val() == prevPrima){
		$(this).val(addCommas(prevPrima.toFixed(2)))
	}*/
	var prima =parseFloat($(this).val());
	if(isNaN(prima) || prima === ""){
		var old = $(this).data('oldVal');
		$(this).val(addCommas(parseFloat(old).toFixed(2)));
	}
	else{
		$(this).val(addCommas(prima.toFixed(2)));
	}
	setPrimaTotal();
});

$(document).on('focus', '#sa_bas', function(){
	$(this).val($(this).val().replace(/,/g,""));
	$(this).data('oldVal', $(this).val());
});
$(document).on('blur', '#sa_bas', function(){
	var prevPrima = parseFloat($(this).data('oldVal'));
	if($(this).val() == prevPrima){
		$(this).val(addCommas(prevPrima.toFixed(2)))
	}
});
$(document).on('change', '#sa_bas', function(){
	var val = $(this).val();
	var old = $(this).data('oldVal');
	if(isNaN(val) || val == ""){
		$(this).val(old);
	}
	else if(!(val % 1 === 0)){
		val = parseInt(val);
		$(this).val(val);
	}
	var id = $(this).attr('id');
	setTarifa(id, 1);
	setEP(id, 1);
	setTarifaEP($(this));
	var sa = parseFloat($(this).val());
	if(sa < 30000){
		sa = 30000;
		$(this).val(30000);
	}
	else if(limiteBasGfaGe){
		var ge = $('#sa_ge_txt').val();
		ge = (ge == "" ? 0 : ge.replace(/,/g,""));
		ge = parseInt(ge);
		var gfa = $('#sa_gfa_txt').val();
		gfa = (gfa == "" ? 0 : gfa.replace(/,/g,""));
		gfa = parseInt(gfa);
		if(sa + ge + gfa > 3000000){
			if($('#sa_gfa').prop('checked')){
				$('#sa_bas').val(1410000);
				sa = 1410000;
				$('#sa_ge_txt').val(1410000);
				$('#sa_gfa_txt').val(180000);
				$('#sa_ge_txt').change();
				$('#sa_gfa_txt').change();
			}
			else if($('#sa_ge').prop('checked')){
				$('#sa_bas').val(1500000);
				sa = 1500000;
				$('#sa_ge_txt').val(1500000);
				$('#sa_ge_txt').change();
			}
		}
	}
	//console.log(sa);
	var tep = parseFloat($('#' + id + '_te').val());
	//console.log(tep);
	var pa = sa * tep / 1000;
	//console.log(pa);
	//$('#sa_bas').val(addCommas(sa.toFixed(2)));
	$(this).val(addCommas(sa.toFixed(2)));
	$('#' + id + '_pa').val(addCommas(pa.toFixed(2)));
	$('#' + id + '_pa').change();
	setGFA();
	checkBacyGfc(2); //coberturas_cyg
	$('.saCobertura').change();
});

$(document).on('change', '#sa_gfa_txt', function(){
	var val = $(this).val();
	val = val.replace(/,/g,"");
	var old = $(this).data('oldVal');
	if(isNaN(val) || val == ""){
		$(this).val(old);
	}
	else if(!(val % 1 === 0)){
		val = parseInt(val);
		$(this).val(val);
	}
	var bas35 = parseFloat($('#sa_bas').val().replace(/,/g,""))*.35;
	var sa = parseFloat($(this).val());
	if(sa > bas35){
		$(this).val(bas35);
	}
	checkLimiteBasGfaGe();
});

$(document).on('change', '#sa_ge_txt', function(){
	//console.log('hola');
	var val = $(this).val();
	val = val.replace(/,/g,"");
	var old = $(this).data('oldVal');
	if(isNaN(val) || val == ""){
		$(this).val(old);
	}
	else if(!(val % 1 === 0)){
		val = parseInt(val);
		$(this).val(val);
	}
	checkLimiteBasGfaGe();
});

function checkLimiteBasGfaGe(){
	//console.log(limiteBasGfaGe);
	if(limiteBasGfaGe){
		var bas = parseInt($('#sa_bas').val());
		var ge = parseInt($('#sa_ge_txt').val() == '' ? 0 : $('#sa_ge_txt').val());
		var gfa = parseInt($('#sa_gfa_txt').val() == '' ? 0 : $('#sa_gfa_txt').val());
		var suma = bas + ge + gfa;
		if(suma > 3000000){
			//console.log('over 3m');
			if($('#sa_gfa').prop('checked')){
				$('#sa_bas').val(1410000);
				$('#sa_ge_txt').val(1410000);
				$('#sa_gfa_txt').val(180000);
				$('#sa_bas').change();
				$('#sa_ge_txt').change();
				$('#sa_gfa_txt').change();
			}
			else if($('#sa_ge').prop('checked')){
				$('#sa_bas').val(1500000);
				$('#sa_ge_txt').val(1500000);
				$('#sa_bas').change();
				$('#sa_ge_txt').change();
			}
		}
	}
}
/*
$(document).on('click', '.check_tarifa', function(){
	var that = $(this);
	if(that.prop('checked')){
		setCoberturaVals(that);
	}
});
*/

$(document).on('focus', '.saCobertura', function(){
	$(this).val($(this).val().replace(/,/g,""));
	$(this).data('oldVal', $(this).val());
});
$(document).on('blur', '.saCobertura', function(){
	var prevPrima = parseFloat($(this).data('oldVal'));
	if($(this).val() == prevPrima){
		$(this).val(addCommas(prevPrima.toFixed(2)))
	}
});
$(document).on('change', '.saCobertura', function(){
	//console.log('saCobertura');
	var that = $(this);
	//console.log(that.val());
	var id = that.attr('id');
	var checkid = id.replace("_txt", "");
	//checar que este activado. xq saCobertura onchange se activa con sabas onchange
	if($('#' + checkid).prop('checked')){
		var val = that.val();
		if(id != "sa_gfa_txt" && id != "sa_ge_txt"){
			val = val.replace(/,/g,"");
			//that.val(val);
			var old = that.data('oldVal');
			if(isNaN(val) || val == ""){
				that.val(old);
				val = old
			}
			else if(!(val % 1 === 0)){
				val = parseInt(val);
				$(this).val(val);
			}
		}

		var sabas = $('#sa_bas').val().replace(/,/g,"");
		//if(that.val() != '' && parseFloat(that.val()) <= parseFloat($('#sa_bas').val())){
		if(parseFloat(val) <= parseFloat(sabas)){
			//console.log(that.val() + ' <= ' + $('#sa_bas').val());
			setCoberturaVals($('#' + checkid));
		}
		//else if(that.val() != ''){
		else{
			that.val(sabas);
			that.change();
		}
	}
});

function setCoberturaVals(that){
	var id = that.attr('id');
	var val = that.val();
	if(factores[val] != undefined){
		setTarifa(id, val);
		setEP(id, val);
		setTarifaEP(that);
		setPrimaAnual(id);
	}
	else{
		alert("No se encuentran dentro de los limites de edad para poder aplicar esta cobertura");
		that.click();
	}
}

function setTarifa(id, val){
	//console.log(id + ' tarifa ' + factores[val]);
	$('#' + id + '_tarifa').val(factores[val]);
}

function setEP(id, val){
	var ep = 0;
	//if(val == 1 || val == 2 || val == 13){ 
	if(val == 1 || val == 2 || val == 12){ //algunos ids cambiaron
		ep = (extraPrimas.BAS == null) ? 0 : extraPrimas.BAS;
	}
	else if(val == 7 || val == 6){
	//else if(val == 8 || val == 7){
		ep = (extraPrimas.CII == null) ? 0: extraPrimas.CII;
	}
	else if(val == 8 || val == 9){
	//else if(val == 9 || val == 10){
		ep = (extraPrimas.TIBA == null) ? 0: extraPrimas.TIBA;
	}
	$('#' + id + '_ep').val(ep);
}

function setTarifaEP(that){
	var id = that.attr('id');
	var tarifa = parseFloat($('#' + id + '_tarifa').val());
	//console.log(tarifa);
	var ep = parseFloat($('#' + id + '_ep').val());
	//console.log(ep);
	var tarifaEp = tarifa;
	//console.log(tarifaEp);
	if(that.hasClass('epTantos') && ep > 0){
		tarifaEp = tarifa * ep;
	}
	else if(that.hasClass('epMillar') && ep > 0){
		tarifaEp = tarifa + ep;
	}
	//console.log(tarifaEp);
	$('#' + id + '_te').val(tarifaEp);
}

function setPrimaAnual(id){
	var tmpsa = $('#' + id + '_txt').val();
	var sa = parseFloat(tmpsa.replace(/,/g,""));
	//console.log(sa);
	var tep = parseFloat($('#' + id + '_te').val());
	//console.log(tep);
	var pa = sa * tep / 1000;
	//console.log(pa);
	$('#' + id + '_txt').val(addCommas(sa.toFixed(2)));
	$('#' + id + '_pa').val(addCommas(pa.toFixed(2)));
	//$('#' + id + '_pa').val(pa.toFixed(2));
	$('#' + id + '_pa').change();
}

$(document).on('click', '#sa_bit', function(){
	var that = $(this);
	if(that.prop('checked')){
		var id = that.attr('id');
		var val = that.val();
		setTarifa(id, val);
		setEP(id, val);
		setTarifaEP(that);
		setBit();
	}
	else{
		$('#sa_bit_pa').val('');
	}
	setPrimaTotal();
});

$(document).on('change', '.bit', function(){
	//console.log($(this).attr('id'));
	setBit();
});

$(document).on('click', '.check_bit', function(){
	if(!$(this).prop('checked')) //para que no llame dos veces a setBit() > check_bit + bit
		setBit();
});

function setBit(){
	if($('#sa_bit').prop('checked')){
		var total = 0;
		$('body').find('.bit').each(function(i, obj){
			var id = $(this).attr('id');
			var checkid = id.replace('_pa','');
			var checkbox = $('#' + checkid);
			var val = 0;
			if(checkid == "sa_bas" || checkbox.prop('checked')){
				//console.log(checkid + ' ' + checkbox.prop('checked'));
				val = $(this).val() == "" ? 0 : $(this).val();
				val = (val == 0 ? 0 : val.replace(/,/g,""));
			}
			//console.log(val);
			total += parseFloat(val);
		});
		//console.log(total);
		var te = parseFloat($('#sa_bit_te').val());
		//console.log(te);
		var pa = total*te/100;
		$('#sa_bit_txt').val(total);
		$('#sa_bit_pa').val(addCommas(pa.toFixed(2)));
	}
}

$(document).on('click', '.check_sa', function(){
	if(!$(this).prop('checked')){
		setPrimaTotal();
	}
});

$(document).on('change', '.prima_anual', function(){
	setPrimaTotal();
});

function setPrimaTotal(){
	var total = 0;
	$('body').find('.prima_anual').each(function(i,obj){
		var id = $(this).attr('id');
		var checkid = id.replace('_pa','');
		var checkbox = $('#' + checkid);
		var val = 0;
		if(checkid == "sa_bas" || checkbox.prop('checked')){
			val = $(this).val() == "" ? 0 : $(this).val();
			val = (val == 0 ? 0 : val.replace(/,/g,""));
		}
		total += parseFloat(val);
	});
	var excedente = parseFloat($('#prima_excedente_total').val().replace(/,/g,""));
	total += excedente;
	$('#prima_anual_total').val(addCommas(total.toFixed(2)));
}

$(document).on('click', '.limite_edad_titular', function(){
	//console.log($(this).val());
	var rangos = limiteEdades[$(this).val()];
	//console.log(edadTitular);
	//console.log(rangos.Maxima);
	if(edadTitular > rangos.Maxima){
		$(this).prop('checked',false);
		var id =  $(this).attr('id');
		$('#' + id + '_txt').prop('disabled', true);
		$('#' + id + '_txt').val('');
		$('#' + id + '_extra').prop('disabled', true);
		$('#' + id + '_extra').prop('checked', false);
		$('#' + id + '_basico').prop('disabled', true);
		$('#' + id + '_basico').prop('checked', false);
	}
});
