$(document).on('focus', '#prima_prima', function(){
	$(this).val($(this).val().replace(/,/g,""));
	$(this).data('oldVal', $(this).val());
});
$(document).on('keydown', '#prima_prima', function(e){
	if((e.which < 48 || e.which > 57) && e.which != 8 && e.which != 13 && e.which != 9){
		e.preventDefault();
	}
});
$(document).on('paste', '#prima_prima', function(e){
	e.preventDefault();
});
$(document).on('change', '#prima_prima', function(){
	var val = $(this).val();
	var prevPrima = parseFloat($(this).data('oldVal'));
	if(isNaN(val) || val == ""){
		$('#prima_prima').val(prevPrima);
	}
	else if(!(val % 1 === 0)){
		val = parseInt(val);
		$('#prima_prima').val(val);
	}
	var primaQuincenal = parseFloat($('#prima_prima').val());
	$('#prima_prima').val(addCommas(primaQuincenal.toFixed(2)));
	var excedente = parseFloat($('#prima_excedente_anual').val().replace(/,/g,""));
	var prima_anual = primaQuincenal*24;
	var prima_final = prima_anual - excedente;
	$('#prima_anual_total').val(addCommas(prima_final.toFixed(2)));
	$('#prima_bas').val(prima_final); //se le agregan las comas en el setPrimasSA
	//$('#prima_bas').change();
	setPrimaBAS();
	if(setPrimasSA()){
		//var prevPrima = $(this).data('oldVal');
		$('#prima_prima').val(addCommas(prevPrima.toFixed(2)));
		prima_anual = parseFloat(prevPrima)*24;
		prima_final = prima_anual - excedente;
		$('#prima_anual_total').val(addCommas(prima_final.toFixed(2)));
		$('#prima_bas').val(prima_final); //se le agregan las comas en el setPrimasSA
		setPrimaBAS();
		setPrimasSA();
	}
});
$(document).on('blur', '#prima_prima', function(){
	var prevPrima = parseFloat($(this).data('oldVal'));
	if($(this).val() == prevPrima){
		$(this).val(addCommas(prevPrima.toFixed(2)))
	}
});

$(document).on('focus', '#prima_excedente_anual', function(){
	$(this).val($(this).val().replace(/,/g,""));
	$(this).data('oldVal', $(this).val());
});
$(document).on('blur', '#prima_excedente_anual', function(){
	var prevPrima = parseFloat($(this).data('oldVal'));
	if($(this).val() == prevPrima){
		$(this).val(addCommas(prevPrima.toFixed(2)))
	}
});
$(document).on('change', '#prima_excedente_anual', function(){
	var val = $(this).val();
	var prevPrima = parseFloat($(this).data('oldVal'));
	if(isNaN(val) || val == ""){
		$('#prima_excedente_anual').val(prevPrima);
	}
	else if(!(val % 1 === 0)){
		val = parseInt(val);
		$('#prima_excedente_anual').val(val);
	}
	var excedente = parseFloat($('#prima_excedente_anual').val());
	$('#prima_excedente_anual').val(addCommas(excedente.toFixed(2)));
	var primaQuincenal = parseFloat($('#prima_prima').val().replace(/,/g,""));
	var prima_anual = primaQuincenal*24;
	var prima_final = prima_anual - excedente;
	$('#prima_anual_total').val(addCommas(prima_final.toFixed(2)));
	$('#prima_bas').val(prima_final); //se le agregan las comas en el setPrimasSA
	setPrimaBAS();
	if(setPrimasSA()){
		$('#prima_excedente_anual').val(addCommas(prevPrima.toFixed(2)));
		prima_final = prima_anual - prevPrima;
		$('#prima_anual_total').val(addCommas(prima_final.toFixed(2)));
		$('#prima_bas').val(prima_final); //se le agregan las comas en el setPrimasSA
		setPrimaBAS();
		setPrimasSA();
	}
});

$(document).on('change', '#prima_bas', function(){
	setPrimaBAS();
});

function setPrimaBAS(){
	var that = $('#prima_bas');
	var id = that.attr('id');
	setTarifa(id, 1);
	setEP(id, 1);
	setTarifaEP(that);
	//setSumaAseguradaPrima(id);
	var prima = parseFloat(that.val());
	var tep = parseFloat($('#' + id + '_te').val());
	var sa = prima*1000/tep;
	$('#' + id + '_sa').val(Math.round(sa));
}

$(document).on('click', '#prima_cma', function(){
	var that = $(this);
	if(that.prop('checked')){
		$('#prima_tiba').prop('checked', false);
		$('#prima_tiba_txt').val('');
		$('#prima_tiba_sa').val('');
	}
	setCheckboxPrimaVals(that);
});

$(document).on('click', '.checkbox_prima_po', function(){
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
		poDisabled(id);
		setPrimasSA();
	}
});

function poDisabled(id){
	$('#' + id + '_edad').prop('disabled', true);
	$('#' + id + '_edad').val('');
	$('#' + id + '_txt').val('');
	$('#' + id + '_extra').prop('disabled', true);
	$('#' + id + '_extra').prop('checked', false);
	$('#' + id + '_basico').prop('disabled', true);
	$('#' + id + '_basico').prop('checked', false);
}

$(document).on('click', '.prima_po_basico', function(){
	var id = $(this).attr('id');
	id = id.replace('_basico','');
	$('#' + id + '_txt').val(189);
	$('#' + id).removeClass('primaMax227');
	$('#' + id).addClass('primaMax189');
	if(setPrimasSA()){
		$('#' + id).prop('checked', false);
		poDisabled(id);
	}
});

$(document).on('click', '.prima_po_extra', function(){
	var id = $(this).attr('id');
	id = id.replace('_extra','');
	$('#' + id + '_txt').val(227.37);
	$('#' + id).removeClass('primaMax189');
	$('#' + id).addClass('primaMax227');
	if(setPrimasSA()){
		$('#' + id).prop('checked', false);
		poDisabled(id);
	}
});


$(document).on('click', '#prima_tiba', function(){
	var that = $(this);
	if(that.prop('checked')){
		$('#prima_cma').prop('checked', false);
		$('#prima_cma_txt').val('');
		$('#prima_cma_sa').val('');
	}
	setCheckboxPrimaVals(that);
});

$(document).on('click', '.checkbox_prima_std', function(){
	setCheckboxPrimaVals($(this));
});

function setCheckboxPrimaVals(that){
	var id = that.attr('id');
	if(that.prop('checked')){
		var val = that.val();
		if(factores[val] != undefined){
			setTarifa(id, val);
			setEP(id, val);
			setTarifaEP(that);
			var sabas = parseFloat($('#prima_bas_sa').val().replace(/,/g,""));
			var teptmp = parseFloat($('#' + id + '_te').val());
			var res = getMaxSAPrima(that, teptmp, sabas);
			$('#' + id + '_sa').val(res[0]);
			$('#' + id + '_txt').val(res[1]);
		}
		else{
			alert("No se encuentran dentro de los limites de edad para poder aplicar esta cobertura");
			that.prop('checked', false);
			$('#' + id + '_sa').val('');
			$('#' + id + '_txt').val('');
		}
	}
	else{
		$('#' + id + '_sa').val('');
		$('#' + id + '_txt').val('');
	}
	if(setPrimasSA()){
		that.prop('checked', false);
		$('#' + id + '_sa').val('');
		$('#' + id + '_txt').val('');
	}
}

function getMaxSAPrima(that, tep, sabas, primas, ids){
	var res = [];
	sabas = parseFloat(sabas);
	var salarioMin = salarioDiario*30*20;
	if(sabas > 6000000 && that.hasClass('primaMax6m')){
		res.push(6000000);
		var primatmp = parseFloat((6000000*parseFloat(tep)/1000).toFixed(2));
		res.push(primatmp);	
	}
	else if(sabas > 1000000 && that.hasClass('primaMax1m')){
		res.push(1000000);
		var primatmp = parseFloat((1000000*parseFloat(tep)/1000).toFixed(2));
		res.push(primatmp);	
	}
	else if(sabas > 100000 && that.hasClass('primaMax100')){
		res.push(100000);
		var primatmp = parseFloat((100000*parseFloat(tep)/1000).toFixed(2));
		res.push(primatmp);	
	}
	else if(sabas > 30000 && that.hasClass('primaMax30')){
		res.push(30000);
		var primatmp = parseFloat((30000*parseFloat(tep)/1000).toFixed(2));
		res.push(primatmp);	
	}
	else if(that.hasClass('primaMax180')){
		var sa = 180000;
		if((sabas*.35) < sa){
			sa = Math.round(sabas*.35);
		}
		res.push(sa);
		var primatmp = parseFloat((sa*parseFloat(tep)/1000).toFixed(2));
		res.push(primatmp);	
	}
	else if(that.hasClass('primaMax189')){
		res.push(1000);
		res.push(189);
	}
	else if(that.hasClass('primaMax227')){
		res.push(1203);
		res.push(227.37);
	}
	else if(sabas < ((salarioMin*10)+180000) && that.attr('id') == 'prima_bacy' && $('#prima_gfc').prop('checked')){
		var sagfc = 180000;
		if((sabas*.35) < sagfc){
			sagfc = Math.round(sabas*.35);
		}
		var sabacy = sabas - sagfc;
		res.push(sabacy);
		var primatmp = parseFloat((sabacy*parseFloat(tep)/1000).toFixed(2));
		res.push(primatmp);
	}
	else if(sabas > (salarioMin*10) && that.hasClass('primaMaxSal2')){
		res.push(salarioMin*10);
		var primatmp = parseFloat((salarioMin*10*parseFloat(tep)/1000).toFixed(2));
		res.push(primatmp);
	}
	else if(that.attr('id') == 'prima_bit'){
		if(primas != null && primas != undefined){
			var total = 0;
			for(var i = 0; i < primas.length; i++){
				if($('#' + ids[i]).hasClass('primaBit')){
					total += parseFloat(primas[i]);
				}
			}
			var prima = parseFloat((total*parseFloat(tep)/100).toFixed(2));
			res.push(total);
			res.push(prima);
		}
		else{
			res.push(0);
			var primatmp = parseFloat((sabas*parseFloat(tep)/1000).toFixed(2));
			res.push(primatmp);	
		}
	}
	else{
		res.push(sabas);
		var primatmp = parseFloat((sabas*parseFloat(tep)/1000).toFixed(2));
		res.push(primatmp);	
	}
	return res;
}

function setPrimasSA(){
	var primaTotal = parseFloat($('#prima_anual_total').val().replace(/,/g,""));
	var tepbas = parseFloat($('#prima_bas_te').val());
	var sabas = $('#prima_bas_sa').val().replace(/,/g,"");
	var primaBas = $('#prima_bas').val().replace(/,/g,"");
	var sustractor = '1'; 
	for(var i = 1; i < sabas.length; i++){
		sustractor += '0';
	}
	sabas = parseFloat(sabas);
	primaBas = parseFloat(primaBas);
	sustractor = parseFloat(sustractor);
		
	var primas = [];
	primas.push(primaBas);
	var teps = [];
	teps.push(tepbas);
	var ids = [];
	ids.push('prima_bas');
	var sumas = [];
	sumas.push(sabas);
	$('.checkbox_prima_all').each(function(i, item){
		var that = $(this);
		if(that.prop('checked')){
			var id = that.attr('id');
			ids.push(id);
			var prima = parseFloat($('#' + id + '_txt').val().replace(/,/g,""));
			primas.push(prima);
			var tep = parseFloat($('#' + id + '_te').val());
			teps.push(tep);
			var sa = parseFloat($('#' + id + '_sa').val().replace(/,/g,""));
			sumas.push(sa);
		}
	});
	
	while(sustractor > 0.1){
		var primaSumatoria = 0;
		for(var i = 0; i < primas.length; i++){
			primaSumatoria += primas[i];
		}
		if(primaSumatoria > primaTotal){
			while(primaSumatoria > primaTotal){
				sabas = sabas - sustractor;
				primaSumatoria = 0;
				for(var i = 0; i < primas.length; i++){
					/*if(sabas < sumas[i]){
						sumas[i] = sabas;
						primas[i] = parseFloat((sabas*teps[i]/1000).toFixed(2));
					}*/
					var that = $('#' + ids[i]);
					var res = getMaxSAPrima(that, teps[i], sabas, primas, ids);
					sumas[i] = res[0];
					primas[i] = res[1];
					primaSumatoria += parseFloat(primas[i].toFixed(2));
				}
			}
		}
		else{
			while(primaSumatoria < primaTotal){
				sabas += sustractor;
				primaSumatoria = 0;
				for(var i = 0; i < primas.length; i++){
					var that = $('#' + ids[i]);
					var res = getMaxSAPrima(that, teps[i], sabas, primas, ids);
					sumas[i] = res[0];
					primas[i] = res[1];
					primaSumatoria += parseFloat(primas[i].toFixed(2));
				}
			}
		}
		sustractor = sustractor/10;
	}
	var error = false;
	if(checkMinSAPrima('prima_bas', sabas)){
		error = true;
	}
	for(var i = 1; i < primas.length; i++){
		if(checkMinSAPrima(ids[i], sumas[i])){
			error = true;
		}
	}
	if(!error){
		$('#prima_bas_sa').val(addCommas(sabas.toFixed(2)));
		$('#prima_bas').val(addCommas(primas[0].toFixed(2)));
		for(var i = 1; i < primas.length; i++){
			var tmpid = ids[i];
			$('#' + tmpid + '_sa').val(addCommas(sumas[i].toFixed(2)));
			$('#' + tmpid + '_txt').val(addCommas(primas[i].toFixed(2)));
		}
	}
	else{
		alert("La prima es insuficiente para esta combinación o se ha salido de los límites permitidos, por favor intente con otra.");
	}
	//console.log(error);
	return error;
}

function checkMinSAPrima(id, sa){
	var under = false;
	var that = $('#' + id);
	var salarioMin = salarioDiario*30*20;
	sa = parseFloat(sa);
	if(sa < 30000 && that.hasClass('primaMinSA30')){
		under = true;
	}
	else if(sa < salarioMin && that.hasClass('primaMinSASal')){
		under = true;
	}
	/*else if(sa < 15000 && that.hasClass('primaMinSA15')){ //de momento no se necesita, xq siempre tendria la misma cantidad que sabas y si sabas es menor a 30, cae en el primer if
		under = true;
	}*/ 
	return under;
}
/*
$(document).on('click', '.checkbox_prima', function(){
	var that = $(this);
	if(that.prop('checked')){
		var id = that.attr('id');
		var val = that.val();
		setTarifa(id, val);
		setEP(id, val);
		setTarifaEP(that);
		var tep = parseFloat($('#' + id + '_te').val());
		var tepbas = parseFloat($('#prima_bas_te').val());
		var primaTotal = parseFloat($('#prima_anual_total').val());
		var primaCobertura = primaTotal/2;
		var sa = primaCobertura*1000/tep;
		var sabas = 0;
		while(sabas < sa){
			sa = primaCobertura*1000/tep;
			console.log('CII: ' + sa);
			var primaBas = primaTotal - primaCobertura;
		 	sabas = primaBas*1000/tepbas;
			console.log('BAS: ' + sabas);
			primaCobertura = primaCobertura - 1000;
		}
		console.log("-------------------------------");
		while(sabas > sa){
			primaCobertura += 100;
			var primaBas = primaTotal - primaCobertura;
			sa = primaCobertura*1000/tep;
			console.log('CII: ' + sa);
			sabas = primaBas*1000/tepbas;
			console.log('BAS: ' + sabas);
		}
		console.log("-------------------------------");
		while(sabas < sa){
			primaCobertura -= 10;
			var primaBas = primaTotal - primaCobertura;
			sa = primaCobertura*1000/tep;
			console.log('CII: ' + sa);
			sabas = primaBas*1000/tepbas;
			console.log('BAS: ' + sabas);
		}
		console.log("-------------------------------");
		while(sabas > sa){
			primaCobertura += 1;
			var primaBas = primaTotal - primaCobertura;
			sa = primaCobertura*1000/tep;
			console.log('CII: ' + sa);
			sabas = primaBas*1000/tepbas;
			console.log('BAS: ' + sabas );
		}
		console.log("-------------------------------");
		while(sabas < sa){
			primaCobertura = parseFloat((primaCobertura - 0.1).toFixed(1));
			var primaBas = primaTotal - primaCobertura;
			sa = primaCobertura*1000/tep;
			console.log('CII: ' + sa + ' prima ' + primaCobertura);
			sabas = primaBas*1000/tepbas;
			console.log('BAS: ' + sabas + ' prima ' + primaBas);
		}
		console.log("-------------------------------");
		while(sabas > sa){
			primaCobertura = parseFloat((primaCobertura + 0.01).toFixed(2));
			var primaBas = primaTotal - primaCobertura;
			sa = primaCobertura*1000/tep;
			console.log('CII: ' + sa + ' prima ' + primaCobertura);
			sabas = primaBas*1000/tepbas;
			console.log('BAS: ' + sabas + ' prima ' + primaBas);
		}
	}
});
*/

$(document).on('click', '#prima_check_conyuge', function(){
	if($(this).prop('checked')){
		$('.txtconyuge').prop('disabled', false);
		$('#prima_met99_edad_conyuge').val(15);
		$('#prima_met99_edad_conyuge').change();
		$('.prima_check_conyuge_all').prop('disabled', false);
	}
	else{
		$('.txtconyuge').prop('disabled', true);
		$('.txtconyuge').val('');
		$('.prima_check_conyuge_all').prop('disabled', true);
		$('.prima_check_conyuge_all').prop('checked', false);
		$('.prima_txt_conyuge').val('');
		setPrimasSA();
	}
});

$(document).on('focus', '#prima_met99_edad_conyuge', function(){
	$(this).data('oldVal', $(this).val());
});
$(document).on('change','#prima_met99_edad_conyuge', function(){
	var edad = $(this).val();
	var prevEdad = $(this).data('oldVal');
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
	db.transaction(function(tx){
		var q = 'SELECT id_tarifa, factor FROM VIDA_Factores WHERE edad = ' + edad;
		tx.executeSql(q, [], function(tx, res){
			for(var i = 0; i < res.rows.length; i++){
				factoresCy[res.rows.item(i).id_tarifa] = res.rows.item(i).factor;
			}
			edadConyugePrimaChange();
			if(setPrimasSA()){
				$('#prima_met99_edad_conyuge').val(prevEdad);
				$('#prima_met99_edad_conyuge').change();
			}
		});
	});
});

function edadConyugePrimaChange(){
	$('.prima_check_conyuge_all').each(function(i,obj){
		var that = $(this);
		if(that.prop('checked')){
			var overUnder = checkLimiteEdadesPrima(that);
			if(overUnder){
				that.prop('checked',false);
				$('#' + that.attr('id') + '_sa').val('');
				$('#' + that.attr('id') + '_txt').val('');
			}
			else{
				setCheckboxAdPrimaVals(that,factoresCy[that.val()]);
			}
		}
	});
}

function checkLimiteEdadesPrima(that){
	var overUnder = false
	var rangos = limiteEdades[that.val()];
	if(parseInt($('#prima_met99_edad_conyuge').val()) > rangos.Maxima){
		overUnder = true;
	}
	return overUnder;
}

$(document).on('click', '.prima_check_conyuge_std', function(){
	if($(this).prop('checked')){
		var overUnder = checkLimiteEdadesPrima($(this));
		if(overUnder){
			unsetCheckboxConyugePrimaVals($(this));
		}
		else{
			setCheckboxAdPrimaVals($(this),factoresCy[$(this).val()]);
			if(setPrimasSA()){
				unsetCheckboxConyugePrimaVals($(this));
			}	
		}
	}
	else{
		unsetCheckboxConyugePrimaVals($(this));
		setPrimasSA();
	}
});

//function setCheckboxAdPrimaVals(that, arregloFactores, index){
function setCheckboxAdPrimaVals(that, tarifa){
	var id = that.attr('id');
	//var tarifa = arregloFactores[index];
	$('#' + id + '_te').val(tarifa);
	var sabas = parseFloat($('#prima_bas_sa').val().replace(/,/g,""));
	var res = getMaxSAPrima(that, tarifa, sabas);
	$('#' + id + '_sa').val(res[0]);
	$('#' + id + '_txt').val(res[1]);
}

function unsetCheckboxConyugePrimaVals(that){
	that.prop('checked',false);
	$('#' + that.attr('id') + '_sa').val('');
	$('#' + that.attr('id') + '_txt').val('');
}

$(document).on('click', '#prima_bcacy', function(){
	if($(this).prop('checked')){
		var count = checkCoberturasCancerPrima();
		if(count >= 4){
			unsetCheckboxConyugePrimaVals($(this));
		}
		else{
			var overUnder = checkLimiteEdadesPrima($(this));
			if(overUnder){
				unsetCheckboxConyugePrimaVals($(this));
			}
			else{
				setCheckboxAdPrimaVals($(this),factoresCy[$(this).val()]);
				if(setPrimasSA()){
					unsetCheckboxConyugePrimaVals($(this));
				}	
			}
		}
	}
	else{
		unsetCheckboxConyugePrimaVals($(this));
		setPrimasSA();
	}
});

function checkCoberturasCancerPrima(){
	var count = 0;
	$('body').find('.prima_check_cancer_all').each(function(i, obj){
		if($(this).prop('checked')){
			count++;
		}
	});
	return count;
}

$(document).on('click', '.prima_check_cancer_std', function(){
	if($(this).prop('checked')){
		var count = checkCoberturasCancerPrima();
		if(count >= 4){
			unsetCheckboxConyugePrimaVals($(this));
			//unsetCamposAdicionalesPrima($(this).attr('id'));//no se necesita xq no se han activado en esta instancia
		}
		else{
			var id = $(this).attr('id');
			setCamposAdicionalesPrima(id);
			var edad = parseInt($('#' + id + '_edad').val());
			var idtarifa = parseInt($('#' + id + '_sexo').val());
			setCheckboxAdPrimaVals($(this), factoresCancer[edad][idtarifa]);
			if(setPrimasSA()){
				unsetCheckboxConyugePrimaVals($(this));
				unsetCamposAdicionalesPrima(id);
			}	
		}
	}
	else{
		unsetCheckboxConyugePrimaVals($(this));
		unsetCamposAdicionalesPrima($(this).attr('id'));
		setPrimasSA();
	}
});

$(document).on('change', '.prima_sexo_cancer', function(){
	var id = $(this).attr('id');
	id = id.replace('_sexo','');
	var edad = parseInt($('#' + id + '_edad').val());
	var idtarifa = parseInt($('#' + id + '_sexo').val());
	setCheckboxAdPrimaVals($('#' + id), factoresCancer[edad][idtarifa]);
	if(setPrimasSA()){
		if(idtarifa == 11) idtarifa = 10;
		else idtarifa = 11;
		setCheckboxAdPrimaVals($('#' + id), factoresCancer[edad][idtarifa]);
		setPrimasSA();
	}
});

$(document).on('focus', '.prima_edad_cancer', function(){
	$(this).data('oldVal', $(this).val());
});
$(document).on('change', '.prima_edad_cancer', function(){
	var val = $(this).val();
	var prevEdad = $(this).data('oldVal');
	if(isNaN(val) || val == ""){
		$(this).val(prevEdad);
	}
	else if(!(val % 1 === 0)){
		val = parseInt(val);
		$(this).val(val);
	}
	setRangoEdadAdicional($(this));
	var id = $(this).attr('id');
	id = id.replace('_edad','');
	var edad = parseInt($('#' + id + '_edad').val());
	var idtarifa = parseInt($('#' + id + '_sexo').val());
	setCheckboxAdPrimaVals($('#' + id), factoresCancer[edad][idtarifa]);
	if(setPrimasSA()){
		edad = $(this).data('oldVal');
		$(this).val(edad);
		setCheckboxAdPrimaVals($('#' + id), factoresCancer[edad][idtarifa]);
		setPrimasSA();
	}
});

$(document).on('click', '#prima_bac', function(){
	if($(this).prop('checked')){
		setCamposAdicionalesPrima($(this).attr('id'));
		setCheckboxAdPrimaVals($(this), factoresBac[parseInt($('#prima_bac_edad').val())]);
		if(setPrimasSA()){
			unsetCheckboxConyugePrimaVals($(this));
			unsetCamposAdicionalesPrima($(this).attr('id'));
		}	
	}
	else{
		unsetCheckboxConyugePrimaVals($(this));
		unsetCamposAdicionalesPrima($(this).attr('id'));
		setPrimasSA();
	}
});

$(document).on('focus', '#prima_bac_edad', function(){
	$(this).data('oldVal', $(this).val());
});
$(document).on('change', '#prima_bac_edad', function(){
	var val = $(this).val();
	var prevEdad = $(this).data('oldVal');
	if(isNaN(val) || val == ""){
		$(this).val(prevEdad);
	}
	else if(!(val % 1 === 0)){
		val = parseInt(val);
		$(this).val(val);
	}
	setRangoEdadAdicional($(this));
	setCheckboxAdPrimaVals($('#prima_bac'), factoresBac[parseInt($(this).val())]);
	if(setPrimasSA()){
		//var prevEdad = $(this).data('oldVal');
		$(this).val(prevEdad);
		setCheckboxAdPrimaVals($('#prima_bac'), factoresBac[parseInt($(this).val())]);
		setPrimasSA();
	}
});

$(document).on('click', '#prima_gfh', function(){
	if($(this).prop('checked')){
		setCamposAdicionalesPrima($(this).attr('id'));
		setCheckboxAdPrimaVals($(this), factoresGfh[parseInt($('#prima_gfh_hijos').val())]);
		if(setPrimasSA()){
			unsetCheckboxConyugePrimaVals($(this));
			unsetCamposAdicionalesPrima($(this).attr('id'));
		}	
	}
	else{
		unsetCheckboxConyugePrimaVals($(this));
		unsetCamposAdicionalesPrima($(this).attr('id'));
		setPrimasSA();
	}
});

$(document).on('focus', '#prima_gfh_hijos', function(){
	$(this).data('oldVal', $(this).val());
});
$(document).on('change', '#prima_gfh_hijos', function(){
	setCheckboxAdPrimaVals($('#prima_gfh'), factoresGfh[parseInt($(this).val())]);
	if(setPrimasSA()){
		var oldVal = $(this).data('oldVal');
		$(this).val(oldVal);
		setCheckboxAdPrimaVals($('#prima_gfh'), factoresGfh[parseInt($(this).val())]);
		setPrimasSA();
	}
});

$(document).on('click', '.prima_check_gfc_std', function(){
	if($(this).prop('checked')){
		var id = $(this).attr('id');
		setCamposAdicionalesPrima(id);
		var edad = parseInt($('#' + id + '_edad').val());
		setCheckboxAdPrimaVals($(this), factoresGfc[edad]);
		if(setPrimasSA()){
			unsetCheckboxConyugePrimaVals($(this));
			unsetCamposAdicionalesPrima(id);
		}	
	}
	else{
		unsetCheckboxConyugePrimaVals($(this));
		unsetCamposAdicionalesPrima($(this).attr('id'));
		setPrimasSA();
	}
});

$(document).on('focus', '.prima_edad_gfc', function(){
	$(this).data('oldVal', $(this).val());
});
$(document).on('change', '.prima_edad_gfc', function(){
	var val = $(this).val();
	var prevEdad = $(this).data('oldVal');
	if(isNaN(val) || val == ""){
		$(this).val(prevEdad);
	}
	else if(!(val % 1 === 0)){
		val = parseInt(val);
		$(this).val(val);
	}
	setRangoEdadAdicional($(this));
	var id = $(this).attr('id');
	id = id.replace('_edad','');
	var edad = parseInt($('#' + id + '_edad').val());
	setCheckboxAdPrimaVals($('#' + id), factoresGfc[edad]);
	if(setPrimasSA()){
		edad = $(this).data('oldVal');
		$(this).val(edad);
		setCheckboxAdPrimaVals($('#' + id), factoresGfc[edad]);
		setPrimasSA();
	}
});

function setCamposAdicionalesPrima(id){
	$('#' + id + '_edad').prop('disabled', false);
	$('#' + id + '_edad').val(15);
	$('#' + id + '_extra').prop('disabled', false);
	$('#' + id + '_basico').prop('disabled', false);
	$('#' + id + '_sexo').prop('disabled', false);
	$('#' + id + '_hijos').prop('disabled', false);
}

function unsetCamposAdicionalesPrima(id){
	$('#' + id + '_edad').prop('disabled', true);
	$('#' + id + '_edad').val('');
	$('#' + id + '_extra').prop('disabled', true);
	$('#' + id + '_extra').prop('checked', false);
	$('#' + id + '_basico').prop('disabled', true);
	$('#' + id + '_basico').prop('checked', false);
	$('#' + id + '_sexo').prop('disabled', true);
	$('#' + id + '_hijos').prop('disabled', false);
}