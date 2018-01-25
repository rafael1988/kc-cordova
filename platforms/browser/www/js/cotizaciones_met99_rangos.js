$(document).on('change', '.min10', function(){
	setMinSA($(this).attr('id'),10000);
});

$(document).on('change', '.min15', function(){
	setMinSA($(this).attr('id'),15000);
});


$(document).on('change', '.min30', function(){
	setMinSA($(this).attr('id'),30000);
});

$(document).on('change', '.minSal', function(){
	var salario = salarioDiario*30*20;
	setMinSA($(this).attr('id'),salario);
});

function setMinSA(id, min){
	var sa = $('#' + id).val();
	var check = $('#' + id.replace('_txt',''));
	if(check.prop('checked') && sa < min){
		$('#' + id).val(min);
	}
}

$(document).on('change', '.max100m', function(){
	var mon = $(this).val();
	if(!(isNaN(mon)) && mon > 100000000){
		$(this).val(100000000);
	}
});

$(document).on('change', '.max6m', function(){
	var mon = $(this).val();
	if(!(isNaN(mon)) && mon > 6000000){
		$(this).val(6000000);
	}
});

$(document).on('change', '.max3m', function(){
	var mon = $(this).val();
	if(!(isNaN(mon)) && mon > 3000000){
		$(this).val(3000000);
	}
});

$(document).on('change', '.max1m', function(){
	var mon = $(this).val();
	if(!(isNaN(mon)) && mon > 1000000){
		$(this).val(1000000);
	}
});

$(document).on('change', '.maxSal', function(){
	var mon = $(this).val();
	var sa = salarioDiario*30*20;
	if(!(isNaN(mon)) && mon > sa){
		$(this).val(sa);
	}
});

$(document).on('change', '.maxSal2', function(){
	var mon = $(this).val();
	var sa = salarioDiario*30*200;
	if(!(isNaN(mon)) && mon > sa){
		$(this).val(sa);
	}
});

$(document).on('change', '.max180', function(){
	var mon = $(this).val();
	if(!(isNaN(mon)) && mon > 180000){
		$(this).val(180000);
	}
});

$(document).on('change', '.max100', function(){
	var mon = $(this).val();
	if(!(isNaN(mon)) && mon > 100000){
		$(this).val(100000);
	}
});

$(document).on('change', '.max30', function(){
	var mon = $(this).val();
	if(!(isNaN(mon)) && mon > 30000){
		$(this).val(30000);
	}
});



$(document).on('change', '.max999', function(){
	var mon = $(this).val();
	if(!(isNaN(mon)) && mon > 999999999){
		$(this).val(999999999);
	}
});