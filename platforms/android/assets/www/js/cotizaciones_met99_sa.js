//var factores;
/*
db.transaction(function(tx){
	var q = 'select id_tarifa, edad, factor from vida_factores where id_tarifa = 10 or id_tarifa = 11 order by edad, id_tarifa';
	tx.executeSql(q, [], function(tx, res){
		for(var i = 0; i < res.rows.length; i++){
			if(factoresCancer[res.rows.item(i).edad] == null){
				factoresCancer[res.rows.item(i).edad] = [];
			}
			factoresCancer[res.rows.item(i).edad][res.rows.item(i).id_tarifa] = res.rows.item(i).factor;
		}
		q = 'select edad, factor from vida_factores where id_tarifa = 19 order by edad';
		tx.executeSql(q, [], function(tx, res){
			for(var i = 0; i < res.rows.length; i++){
				factoresGfh[res.rows.item(i).edad] = res.rows.item(i).factor;
			}
			q = 'SELECT ea.Id_Cobertura, id_tarifa, Minima, Maxima, Cancelacion FROM VIDA_Edades_Aceptacion AS ea, ';
        	q += 'VIDA_Coberturas_tarifas AS ct WHERE ea.Id_Cobertura = ct.Id_Cobertura ORDER BY ea.Id_Cobertura, id_tarifa';
        	tx.executeSql(q, [], function(tx,res){
        		for(var i = 0; i < res.rows.length; i++){
        			var json = '{';
        			json += '"Minima": ' + res.rows.item(i).Minima + ',';
        			json += '"Maxima": ' + res.rows.item(i).Maxima + ',';
        			json += '"Cancelacion": ' + res.rows.item(i).Cancelacion;
        			json += '}';
        			//console.log(json);
        			limiteEdades[res.rows.item(i).id_tarifa] = JSON.parse(json);
        		}
        		q = 'select edad, factor from vida_factores where id_tarifa = 4 order by edad';
				tx.executeSql(q, [], function(tx, res){
					for(var i = 0; i < res.rows.length; i++){
						factoresGfc[res.rows.item(i).edad] = res.rows.item(i).factor;
					}
					q = 'select edad, factor from vida_factores where id_tarifa = 5 order by edad';
					tx.executeSql(q, [], function(tx, res){
						for(var i = 0; i < res.rows.length; i++){
							factoresBac[res.rows.item(i).edad] = res.rows.item(i).factor;
						}
					});
					//console.log(factoresGfc);
				});
        	});
		});
	});
});
*/
$(document).on('change','#met99_edad_conyuge', function(){
	var edad = $(this).val();
	if(isNaN(edad) || edad < 15){
		$(this).val(15);
		edad = 15;
	}
	else if(edad > 70){
		$(this).val(70);
		edad = 70;
	}
	//console.log(edad);
	db.transaction(function(tx){
		var q = 'SELECT id_tarifa, factor FROM VIDA_Factores WHERE edad = ' + edad;
		tx.executeSql(q, [], function(tx, res){
			for(var i = 0; i < res.rows.length; i++){
				factoresCy[res.rows.item(i).id_tarifa] = res.rows.item(i).factor;
			}
			onEdadConyugeChange();
			//console.log(factoresCy);
		});
	});
});

function cotizaciones_met99_sa(){
	var json = localStorage.getItem('MET99');
	if(json != null){
	json = JSON.parse(json);
	extraPrimas = JSON.parse(json.met99_ocupacion.replace(/'/g, '"'));
	//console.log(extraPrimas);
	var html = '';
	html += '<div style="display:inline-block; width:100%;">';
	html += '<div style="float:left;">';
	html += '<h2>COTIZACI&Oacute;N NUEVA MET99</h2>';
	html += '</div>';
	html += '<div id="wrapperBtnSimple"> ';
	html += '<div class="btnSimple">';
	html += '<a class="linkJS" id="btnLimpiarSA" href="cotizaciones_met99.html"></a>';
	html += '<img src="img/limpiar_w.png" />';
	html += '<a>LIMPIAR</a>';
	html += '</div>';
	/*html += '<div class="btnSimple">';
	html += '<a class="link" href="cotizaciones_met99.html"></a>';
	html += '<img src="img/back_w.png" />';
	html += '<a>REGRESAR</a>';
	html += '</div>';*/
	html += '<div class="btnSimple">';
	html += '<img src="img/next_w.png" />';
	html += '<a class="linkJS" id="guardarMet99SA" href="cotizaciones_met99_resumen.html"></a>';
	html += '<a>SIGUIENTE</a>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '<div class="parrafo">';
	html += '<div style="background:#8fc6e8; padding:5px 10px;">';
	html += '<a style="font-weight:bold;">Por suma asegurada</a>';
	html += '</div>';
	html += '<table cellspacing="0" cellpadding="5" style="width:100%;">';
	html += '<tr>';
	html += '<td style="width:25%; min-width:120px;"><a>Suma asegurada BAS</a></td>';
	html += '<td><span><a>$</a><input type="text" name="sa_bas" id="sa_bas" class="epMillar txtnumero" step="10000" style="width:90%; border:none; outline:none;" /></span></td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td><a>Prima Anual BAS</a></td>';
	html += '<td>';
	html += '<span><a>$</a><input type="text" disabled class="txtnoborder bit prima_anual" id="sa_bas_pa" style="width:90%;"/></span>';
	html += '<input type="hidden" disabled class="txtnoborder" id="sa_bas_tarifa"/><input type="hidden" disabled class="txtnoborder" id="sa_bas_ep"/><input type="hidden" disabled class="txtnoborder" id="sa_bas_te"/>';
	html += '</td>';
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Prima excedente anual</a></td>';
	html += '<td><span style="float:left;"><a>$</a></span><input type="text" style="width:90%" class="txtnumero txtnoborder" id="prima_excedente_total" name="prima_excedente_total" value="0.00"></td>';
	html += '</tr>';
	html += '<tr style="border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<td><a>Prima anual total</a></td>';
	html += '<td><span style="float:left;"><a>$</a></span><input type="text" disabled style="width:90%" class="txtnoborder" id="prima_anual_total"></td>';
	html += '</tr>';
	html += '</table>';
	html += '</div>';
	html += '<div class="parrafo">';
	html += '<div style="padding:5px 10px; border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<a style="font-weight:bold;">TITULAR</a>';
	html += '</div>';
	html += '<ul class="formulario">';
	html += '<li>';
	html += '<table class="noBorder" cellpadding="3">';
	html += '<tr>';
	html += '<td>';
	html += '<input type="checkbox" class="epTantos limite_edad_titular" id="sa_bit" name="sa_bit" value="7"/>';
	html += '<label for="sa_bit"><a>BIT</a></label>&nbsp;&nbsp;';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder prima_anual" id="sa_bit_pa"/>';
	html += '</td>';
	html += '</tr>';
	html += '<tr><td style="visibility:hidden;"></td></tr>';
	/*html += '<tr style="display:none;">';
	html += '<td>';
	html += '</td>';
	html += '<td>';
	html += '</td>';
	html += '</tr>';*/
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += '<input type="hidden" disabled class="txtnoborder" id="sa_bit_te"/><input type="hidden" disabled class="txtnoborder" id="sa_bit_tarifa"/><input type="hidden" disabled class="txtnoborder" id="sa_bit_ep"/>';
	html += '</td>';
	html += '<td style="display:none;">';
	html += '<a>SA: $</a>';
	html += '<input type="text" id="sa_bit_txt" name="sa_bit_txt" />';
	html += '</td>';
	html += '</tr>';
	html += '<tr >';
	html += '<td>';
	html += '<input type="checkbox" class="check_cober check_tarifa epTantos check_sa limite_edad_titular" id="sa_cii" name="sa_cii" value="6" />';
	html += '<label for="sa_cii"><a>CII</a></label>&nbsp;&nbsp;';
	html += '</td>';
	html += '<td>';
	html += '<a>SA: $</a>';
	html += '<input type="text" id="sa_cii_txt" name="sa_cii_txt" class="itxtBorder txtnumero saCobertura min30" />';
	html += '</td>';
	html += '</tr>';
	/*html += '<tr style="display:none;">';
	html += '<td>';
	html += '</td>';
	html += '<td>';
	html += '</td>';
	html += '</tr>';*/
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += '<input type="hidden" disabled class="txtnoborder" id="sa_cii_tarifa"/>';
	html += '<input type="hidden" disabled class="txtnoborder" id="sa_cii_te"/>';
	html += '<input type="hidden" disabled class="txtnoborder" id="sa_cii_ep"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder prima_anual" id="sa_cii_pa"/>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>';
	html += '<input type="checkbox" class="check_cober check_tarifa epTantos check_sa limite_edad_titular" id="sa_cma" name="sa_cma" value="8" />';
	html += '<label for="sa_cma"><a>CMA</a></label>&nbsp;&nbsp;';
	html += '</td>';
	html += '<td>';
	html += '<a>SA: $</a>';
	html += '<input type="text" id="sa_cma_txt" name="sa_cma_txt" class="itxtBorder txtnumero saCobertura min30" />';
	html += '</td>';
	html += '</tr>';
	/*html += '<tr style="display:none;">';
	html += '<td>';
	html += '</td>';
	html += '<td>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';*/
	html += '<td style="visibility:hidden;">';
	html += '<input type="hidden" disabled class="txtnoborder" id="sa_cma_te"/><input type="hidden" disabled class="txtnoborder" id="sa_cma_tarifa"/><input type="hidden" disabled class="txtnoborder" id="sa_cma_ep"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder  prima_anual" id="sa_cma_pa"/>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>';
	html += '<input type="checkbox" class="check_cober check_tarifa epTantos check_sa limite_edad_titular" id="sa_tiba" name="sa_tiba" value="9"/>';
	html += '<label for="sa_tiba"><a>TIBA</a></label>&nbsp;&nbsp;';
	html += '</td>';
	html += '<td>';
	html += '<a>SA: $</a>';
	html += '<input type="text" id="sa_tiba_txt" name="sa_tiba_txt" class="itxtBorder txtnumero saCobertura min30" />';
	html += '</td>';
	html += '</tr>';
	/*html += '<tr style="display:none;">';
	html += '<td>';
	html += '</td>';
	html += '<td>';
	html += '</td>';
	html += '</tr>';*/
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += '<input type="text" disabled class="txtnoborder" id="sa_tiba_te"/><input type="hidden" disabled class="txtnoborder" id="sa_tiba_tarifa"/><input type="hidden" disabled class="txtnoborder" id="sa_tiba_ep"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder prima_anual" id="sa_tiba_pa"/>';
	html += '</td>';
	html += '</tr>';
	html += '</table>';
	html += '</li>';
	html += '<li>';
	html += '<table class="noBorder" cellpadding="3">';
	html += '<tr>';
	html += '<td>';
	html += '<input type="checkbox" class="check_cober check_tarifa check_bit check_sa limite_edad_titular" id="sa_cat" name="sa_cat" value="10"/>';
	html += '<label for="sa_cat"><a>CAT</a></label>&nbsp;&nbsp;';
	html += '</td>';
	html += '<td>';
	html += '<a>SA: $</a>';
	html += '<input type="text" id="sa_cat_txt" name="sa_cat_txt" class="itxtBorder txtnumero saCobertura min30 max1m " />';
	html += '</td>';
	html += '</tr>';
	/*html += '<tr style="display:none;">';
	html += '<td>';
	html += '</td>';
	html += '<td>';
	html += '</td>';
	html += '</tr>';*/
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += '<input type="hidden" disabled class="txtnoborder" id="sa_cat_te"/><input type="hidden" disabled class="txtnoborder" id="sa_cat_tarifa"/><input type="hidden" disabled class="txtnoborder" id="sa_cat_ep"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder bit prima_anual" id="sa_cat_pa"/>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>';
	//sa_gfa no lleva las clases check_cober y check_tarifa xq tiene q cumplir requerimientos especiales
	//en caso de q se cumplan estos requerimientos, se realizaran las funciones de estas clases manualmente
	html += '<input type="checkbox" class="epMillar check_bit check_sa limite_edad_titular" id="sa_gfa" name="sa_gfa" value="2" />';
	html += '<label for="sa_gfa"><a>GFA</a></label>&nbsp;&nbsp;';
	html += '</td>';
	html += '<td>';
	html += '<a>SA: $</a>';
	html += '<input type="text" id="sa_gfa_txt" name="sa_gfa_txt" class="itxtBorder txtnumero saCobertura minSal max180 " />';
	html += '</td>';
	html += '</tr>';
	/*html += '<tr style="display:none;">';
	html += '<td>';
	html += '</td>';
	html += '<td>';
	html += '</td>';
	html += '</tr>';*/
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += '<input type="hidden" disabled class="txtnoborder" id="sa_gfa_te"/><input type="hidden" disabled class="txtnoborder" id="sa_gfa_tarifa"/><input type="hidden" disabled class="txtnoborder" id="sa_gfa_ep"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder bit prima_anual" id="sa_gfa_pa"/>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>';
	html += '<input type="checkbox" class="check_cober check_tarifa epMillar check_bit check_sa limite_edad_titular" id="sa_ge" name="sa_ge" value="12" />';
	html += '<label for="sa_ge"><a>GE</a></label>&nbsp;&nbsp;';
	html += '</td>';
	html += '<td>';
	html += '<a>SA: $</a>';
	html += '<input type="text" id="sa_ge_txt" class="itxtBorder txtnumero saCobertura min10 " />';
	html += '</td>';
	html += '</tr>';
	/*html += '<tr style="display:none;">';
	html += '<td>';
	html += '</td>';
	html += '<td>';
	html += '</td>';
	html += '</tr>';*/
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += '<input type="text" disabled class="txtnoborder" id="sa_ge_te"/><input type="hidden" disabled class="txtnoborder" id="sa_ge_tarifa"/><input type="hidden" disabled class="txtnoborder" id="sa_ge_ep"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder prima_anual bit" id="sa_ge_pa"/>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>';
	html += '<input type="checkbox" class="check_sa limite_edad_titular" id="sa_ap" name="sa_ap" value="13" />';
	html += '<label for="sa_ap"><a>AP</a></label>&nbsp;&nbsp;';
	html += '</td>';
	html += '<td>';
	html += '<input type="radio" name="sa_ap" class="ap" id="sa_ap_basico" value="15" /><label for="sa_ap_basico"><a>B&aacute;sico</a></label>&nbsp;&nbsp;';
	html += '<input type="radio" name="sa_ap" class="ap" id="sa_ap_extra" value="14" /><label for="sa_ap_extra"><a>Extra</a></label>';
	html += '</td>';
	html += '</tr>';
	/*html += '<tr style="display:none;">';
	html += '<td>';
	html += '</td>';
	html += '<td>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';*/
	html += '<td style="visibility:hidden;">';
	html += '<input type="hidden" disabled class="txtnoborder" id="sa_ap_te"/><input type="hidden" disabled class="txtnoborder" id="sa_ap_tarifa"/><input type="hidden" disabled class="txtnoborder" id="sa_ap_ep"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder prima_anual" id="sa_ap_pa"/>';
	html += '<input type="hidden" id="sa_ap_txt">';
	html += '</td>';
	html += '</tr>';
	html += '</table>';
	html += '</li>';
	html += '<li>';
	html += '<table class="noBorder" cellpadding="3">';
	html += '<tr>';
	html += '<td>';
	html += '<input type="checkbox" class="check_cober check_tarifa epMillar check_sa" id="sa_eg" name="sa_eg" value="15" />';
	html += '<label for="sa_eg"><a>EG</a></label>&nbsp;&nbsp;';
	html += '</td>';
	html += '<td>';
	html += '<a>SA: $</a>';
	html += '<input type="text" id="sa_eg_txt" class="itxtBorder txtnumero saCobertura min30 max100 " />';
	html += '</td>';
	html += '</tr>';
	/*html += '<tr style="display:none;">';
	html += '<td>';
	html += '</td>';
	html += '<td>';
	html += '</td>';
	html += '</tr>';*/
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += '<input type="hidden" disabled class="txtnoborder" id="sa_eg_te"/><input type="hidden" disabled class="txtnoborder" id="sa_eg_tarifa"/><input type="hidden" disabled class="txtnoborder" id="sa_eg_ep"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder prima_anual" id="sa_eg_pa"/>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>';
	html += '<input type="checkbox" class="check_cober check_tarifa epMillar check_sa" id="sa_cr" name="sa_cr" value="17" />';
	html += '<label for="sa_cr"><a>CR</a></label>&nbsp;&nbsp;';
	html += '</td>';
	html += '<td>';
	html += '<a>SA: $</a>';
	html += '<input type="text" id="sa_cr_txt" class="itxtBorder txtnumero saCobertura min15 max30 " />';
	html += '</td>';
	html += '</tr>';
	/*html += '<tr style="display:none;">';
	html += '<td>';
	html += '</td>';
	html += '<td>';
	html += '</td>';
	html += '</tr>';*/
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += '<input type="hidden" disabled class="txtnoborder" id="sa_cr_te"/><input type="hidden" disabled class="txtnoborder" id="sa_cr_tarifa"/><input type="hidden" disabled class="txtnoborder" id="sa_cr_ep"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder prima_anual" id="sa_cr_pa"/>';
	html += '</td>';
	html += '</tr>';
	html += '</table>';
	html += '</li>';
	html += '</ul>';
	html += '</div>';
//*****************************************************************************************************************************************/
	html += '<div class="parrafo">';
	html += '<div style="padding:5px 10px; border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<a style="font-weight:bold;">CONYUGE</a>';
	html += '<div style="float:left;"><input type="checkbox" id="check_conyuge"/></div>';
	html += '</div>';
	html += '<table cellspacing="0" cellpadding="5" style="width:100%; table-layout:fixed;">';
	html += '<tr>';
	html += '<td style="width:200px"><a>Nombre</a></td>';
	html += '<td><span><input type="text" id="met99_nombre_conyuge" class="txtconyuge formulario"/></span></td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td style="width:25%"><a>Edad</a></td>';
	html += '<td><span><input type="tel" id="met99_edad_conyuge" class="txtconyuge txtedad formulario" min="15" max="70"  inputmode="numeric" pattern="[0-9]*" /></span></td>';
	html += '</tr>';
	html += '</table>';
	html += '<ul class="formulario">';
	html += '<table class="noBorder" cellpadding="3">';
	html += '<tr >';
	html += '<td>';
	html += '<input type="checkbox" class="/*check_conyuge*/ check_conyuge_all check_bit check_sa" id="sa_bacy" name="sa_bacy" value="3" />';
	html += '<label for="sa_bacy"><a>BACY</a></label>&nbsp;&nbsp;';
	html += '</td>';
	html += '<td>';
	html += '<a>SA: $</a>';
	html += '<input type="text" id="sa_bacy_txt" name="sa_bacy_txt" class="itxtBorder txtnumero saCoberturaCyg min30 maxSal2 " />';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += 'T:<input type="text" disabled class="txtnoborder" id="sa_bacy_tarifa"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder bit prima_anual" id="sa_bacy_pa"/>';
	html += '</td>';
	html += '</tr>';
	html += '<tr >';
	html += '<td>';
	html += '<input type="checkbox" class="check_conyuge_all check_bit check_sa" id="sa_gfc" name="sa_gfc" value="4" />';
	html += '<label for="sa_gfc"><a>GFC</a></label>&nbsp;&nbsp;';
	html += '</td>';
	html += '<td>';
	html += '<a>SA: $</a>';
	html += '<input type="text" id="sa_gfc_txt" name="sa_gfc_txt" class="itxtBorder txtnumero saCoberturaCyg minSal max180 " />';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += 'T:<input type="text" disabled class="txtnoborder" id="sa_gfc_tarifa"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder bit prima_anual" id="sa_gfc_pa"/>';
	html += '</td>';
	html += '</tr>';
	html += '<tr >';
	html += '<td>';
	html += '<input type="checkbox" class="check_conyuge check_conyuge_all check_cancer check_bit check_sa" id="sa_bcacy" name="sa_bcacy" value="11" />';
	html += '<label for="sa_bcacy"><a>BCAC</a></label>&nbsp;&nbsp;';
	html += '</td>';
	html += '<td>';
	html += '<a>SA: $</a>';
	html += '<input type="text" id="sa_bcacy_txt" name="sa_bcacy_txt" class="itxtBorder txtnumero saCoberturaCyg min30 max1m " />';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += 'T:<input type="text" disabled class="txtnoborder" id="sa_bcacy_tarifa"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder bit prima_anual" id="sa_bcacy_pa"/>';
	html += '</td>';
	html += '</tr>';
	html += '</table>';
	html += '</ul>';
	html += '</div>';
	
	html += '<div class="parrafo">';
	html += '<div style="padding:5px 10px; border-bottom-style:solid; border-width:1px; border-color:#939597;">';
	html += '<a style="font-weight:bold;">ADICIONALES</a>';
	html += '</div>';
	html += '<div style="margin-bottom:20px;">';
	html += '<span style="display:block; padding:5px 10px;">';
	html += '<a style="font-weight:bold;">Complementaria</a>';
	html += '</span>';
	html += '<table class="noBorder" cellpadding="3">';
	html += '<tr>';
	html += '<td>';
	html += '<input type="checkbox" class="check_adicional check_adicional_all check_bit check_sa" id="sa_bac" name="sa_bac" />';
	html += '<label for="sa_bac"><a>BAC</a></label>';
	html += '</td>';
	html += '<td>';
	html += '<a>SA: $</a>';
	html += '<input type="text" id="sa_bac_txt" class="itxtBorder txtnumero min30 max999 saCoberturaAd " />';
	html += '</td>';
	html += '<td>';
	html += '<a>Edad: </a>';
	html += '<input type="tel" id="sa_bac_edad" class="itxtBorder txtedad small"  inputmode="numeric" pattern="[0-9]*" />';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += 'T:<input type="text" disabled class="txtnoborder" id="sa_bac_tarifa"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder bit prima_anual" id="sa_bac_pa"/>';
	html += '</td>';
	html += '</tr>';
	html += '</table>';
	html += '</div>';
	html += '<div style="margin-bottom:20px;">';
	html += '<span style="display:block; padding:5px 10px;">';
	html += '<a style="font-weight:bold;">C&aacute;ncer</a>';
	html += '</span>';
	html += '<table class="noBorder" cellpadding="3">';
	html += '<tr>';
	html += '<td>';
	html += '<input type="checkbox" class="check_adicional check_adicional_all check_cancer check_bit check_sa" value="11" id="sa_cac1" name="sa_cac1" />';
	html += '<label for="sa_cac1"><a>CAC1</a></label>';
	html += '</td>';
	html += '<td>';
	html += '<a>SA: $</a>';
	html += '<input type="text" id="sa_cac1_txt" class="itxtBorder txtnumero saCoberturaAd min30 max1m " />';
	html += '</td>';
	html += '<td>';
	html += '<select id="sa_cac1_sexo" class="sexo_adicional">';
	html += '<option value="11">Mujer</option>';
	html += '<option value="10">Hombre</option>';
	html += '</select>';
	html += '</td>';
	html += '<td>';
	html += '<a>Edad: </a>';
	html += '<input type="tel" id="sa_cac1_edad" class="itxtBorder txtedad small edad_adicional limite_edad_txt" inputmode="numeric" pattern="[0-9]*"  />';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += 'T:<input type="text" disabled class="txtnoborder" id="sa_cac1_tarifa"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder bit prima_anual" id="sa_cac1_pa"/>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>';
	html += '<input type="checkbox" class="check_adicional check_adicional_all check_cancer check_bit check_sa" value="11" id="sa_cac2" name="sa_cac2" />';
	html += '<label for="sa_cac2"><a>CAC2</a></label>';
	html += '</td>';
	html += '<td>';
	html += '<a>SA: $</a>';
	html += '<input type="text" id="sa_cac2_txt" class="itxtBorder txtnumero saCoberturaAd min30 max1m " />';
	html += '</td>';
	html += '<td>';
	html += '<select id="sa_cac2_sexo" class="sexo_adicional">';
	html += '<option value="11">Mujer</option>';
	html += '<option value="10">Hombre</option>';
	html += '</select>';
	html += '</td>';
	html += '<td>';
	html += '<a>Edad: </a>';
	html += '<input type="tel" id="sa_cac2_edad" class="itxtBorder txtedad small edad_adicional limite_edad_txt" inputmode="numeric" pattern="[0-9]*"  />';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += 'T:<input type="text" disabled class="txtnoborder" id="sa_cac2_tarifa"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder bit prima_anual" id="sa_cac2_pa"/>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>';
	html += '<input type="checkbox" class="check_adicional check_adicional_all check_cancer check_bit check_sa" value="11" id="sa_cac3" name="sa_cac3" />';
	html += '<label for="sa_cac3"><a>CAC3</a></label>';
	html += '</td>';
	html += '<td>';
	html += '<a>SA: $</a>';
	html += '<input type="text" id="sa_cac3_txt" class="itxtBorder txtnumero saCoberturaAd min30 max1m" />';
	html += '</td>';
	html += '<td>';
	html += '<select id="sa_cac3_sexo" class="sexo_adicional">';
	html += '<option value="11">Mujer</option>';
	html += '<option value="10">Hombre</option>';
	html += '</select>';
	html += '</td>';
	html += '<td>';
	html += '<a>Edad: </a>';
	html += '<input type="tel" id="sa_cac3_edad" class="itxtBorder txtedad small edad_adicional limite_edad_txt" inputmode="numeric" pattern="[0-9]*"  />';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += 'T:<input type="text" disabled class="txtnoborder" id="sa_cac3_tarifa"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder bit prima_anual" id="sa_cac3_pa"/>';
	html += '</td>';
	html += '</tr>';
	html += '</table>';
	html += '</div>';
	html += '<div style="margin-bottom:20px;">';
	html += '<span style="display:block; padding:5px 10px;">';
	html += '<a style="font-weight:bold;">Gastos funerarios</a>';
	html += '</span>';
	html += '<table class="noBorder" cellpadding="3">';
	html += '<tr>';
	html += '<td>';
	html += '<input type="checkbox" class="check_adicional_all check_bit check_sa" id="sa_gfh" name="sa_gfh" />';
	html += '<label for="sa_gfh"><a>GFH</a></label>';
	html += '</td>';
	html += '<td>';
	html += '<a>SA: $</a>';
	html += '<input type="text" id="sa_gfh_txt" class="itxtBorder txtnumero minSal max180 " />';
	html += '</td>';
	html += '<td>';
	//html += '<a>#hijos: </a>';
	//html += '<input type="text" id="sa_gfh_hijos" class="itxtBorder small" />';
	html += '<select name="sa_gfh_hijos" id="sa_gfh_hijos">';
	html += '<option value="1">1 hijo</option>';
	html += '<option value="2">2 hijos</option>';
	html += '<option value="3">3 hijos</option>';
	html += '<option value="4">4 hijos</option>';
	html += '<option value="5">5 hijos</option>';
	html += '<option value="6">6 hijos</option>';
	html += '<option value="7">7 hijos</option>';
	html += '<option value="8">8 hijos</option>';
	html += '<option value="9">9 hijos</option>';
	html += '<option value="10">10 hijos</option>';
	html += '</select>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += 'T:<input type="text" disabled class="txtnoborder" id="sa_gfh_tarifa"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder bit prima_anual" id="sa_gfh_pa"/>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>';
	html += '<input type="checkbox" class="check_gfc check_bit check_sa" value="4" id="sa_gfc1" name="sa_gfc1" />';
	html += '<label for="sa_gfc1"><a>GFC1</a></label>';
	html += '</td>';
	html += '<td>';
	html += '<a>SA: $</a>';
	html += '<input type="text" id="sa_gfc1_txt" class="itxtBorder txtnumero txt_gfc minSal max180 " />';
	html += '</td>';
	html += '<td>';
	html += '<a>Edad: </a>';
	html += '<input type="tel" id="sa_gfc1_edad" class="itxtBorder txtedad small edad_gfc limite_edad_txt" inputmode="numeric" pattern="[0-9]*"  />';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += 'T:<input type="text" disabled class="txtnoborder" id="sa_gfc1_tarifa"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder bit prima_anual" id="sa_gfc1_pa"/>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>';
	html += '<input type="checkbox" class="check_gfc check_bit check_sa" value="4" id="sa_gfc2" name="sa_gfc2" />';
	html += '<label for="sa_gfc2"><a>GFC2</a></label>';
	html += '</td>';
	html += '<td>';
	html += '<a>SA: $</a>';
	html += '<input type="text" id="sa_gfc2_txt" class="itxtBorder txtnumero txt_gfc minSal max180 " />';
	html += '</td>';
	html += '<td>';
	html += '<a>Edad: </a>';
	html += '<input type="tel" id="sa_gfc2_edad" class="itxtBorder txtedad small edad_gfc limite_edad_txt" inputmode="numeric" pattern="[0-9]*"  />';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += 'T:<input type="text" disabled class="txtnoborder" id="sa_gfc2_tarifa"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder bit prima_anual" id="sa_gfc2_pa"/>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>';
	html += '<input type="checkbox" class="check_gfc check_bit check_sa" value="4" id="sa_gfc3" name="sa_gfc3" />';
	html += '<label for="sa_gfc3"><a>GFC3</a></label>';
	html += '</td>';
	html += '<td>';
	html += '<a>SA: $</a>';
	html += '<input type="text" id="sa_gfc3_txt" class="itxtBorder txtnumero txt_gfc minSal max180 " />';
	html += '</td>';
	html += '<td>';
	html += '<a>Edad: </a>';
	html += '<input type="tel" id="sa_gfc3_edad" class="itxtBorder txtedad small edad_gfc limite_edad_txt" inputmode="numeric" pattern="[0-9]*"  />';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += 'T:<input type="text" disabled class="txtnoborder" id="sa_gfc3_tarifa"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder bit prima_anual" id="sa_gfc3_pa"/>';
	html += '</td>';
	html += '</tr>';
	html += '</table>';
	html += '</div>';
	html += '<div style="margin-bottom:20px;">';
	html += '<span style="display:block; padding:5px 10px;">';
	html += '<a style="font-weight:bold;">Accidentes personales</a>';
	html += '</span>';
	html += '<table class="noBorder" cellpadding="3">';
	html += '<tr>';
	html += '<td>';
	html += '<input type="checkbox" class="check_po check_bit check_sa" value="14" id="sa_po1" name="sa_po1" />';
	html += '<label for="sa_po1"><a>PO1</a></label>&nbsp;&nbsp;';
	html += '</td>';
	html += '<td>';
	html += '<a>Edad: </a>';
	html += '<input type="tel" id="sa_po1_edad" class="itxtBorder txtedad small limite_edad_txt edad_po" inputmode="numeric" pattern="[0-9]*"  />';
	html += '</td>';
	html += '<td>';
	html += '<input type="radio" name="sa_po1" id="sa_po1_basico" class="po_basico" /><label for="sa_po1_basico"><a>B&aacute;sico</a></label>&nbsp;&nbsp;';
	html += '<input type="radio" name="sa_po1" id="sa_po1_extra" class="po_extra" /><label for="sa_po1_extra"><a>Extra</a></label>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += 'T:<input type="text" disabled class="txtnoborder" id="sa_po1_tarifa"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder bit prima_anual" id="sa_po1_pa"/>';
	html += '<input type="hidden" id="sa_po1_txt">';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>';
	html += '<input type="checkbox" class="check_po check_bit check_sa" value="14" id="sa_po2" name="sa_po2" />';
	html += '<label for="sa_po2"><a>PO2</a></label>&nbsp;&nbsp;';
	html += '</td>';
	html += '<td>';
	html += '<a>Edad: </a>';
	html += '<input type="tel" id="sa_po2_edad" class="itxtBorder txtedad small limite_edad_txt edad_po" inputmode="numeric" pattern="[0-9]*"  />';
	html += '</td>';
	html += '<td>';
	html += '<input type="radio" name="sa_po2" id="sa_po2_basico" class="po_basico" /><label for="sa_po2_basico"><a>B&aacute;sico</a></label>&nbsp;&nbsp;';
	html += '<input type="radio" name="sa_po2" id="sa_po2_extra" class="po_extra" /><label for="sa_po2_extra"><a>Extra</a></label>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += 'T:<input type="text" disabled class="txtnoborder" id="sa_po2_tarifa"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder bit prima_anual" id="sa_po2_pa"/>';
	html += '<input type="hidden" id="sa_po2_txt">';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>';
	html += '<input type="checkbox" class="check_po check_bit check_sa" value="14" id="sa_po3" name="sa_po3" />';
	html += '<label for="sa_po3"><a>PO3</a></label>&nbsp;&nbsp;';
	html += '</td>';
	html += '<td>';
	html += '<a>Edad: </a>';
	html += '<input type="tel" id="sa_po3_edad" class="itxtBorder txtedad small limite_edad_txt edad_po" inputmode="numeric" pattern="[0-9]*"  />';
	html += '</td>';
	html += '<td>';
	html += '<input type="radio" name="sa_po3" id="sa_po3_basico" class="po_basico" /><label for="sa_po3_basico"><a>B&aacute;sico</a></label>&nbsp;&nbsp;';
	html += '<input type="radio" name="sa_po3" id="sa_po3_extra" class="po_extra" /><label for="sa_po3_extra"><a>Extra</a></label>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += 'T:<input type="text" disabled class="txtnoborder" id="sa_po3_tarifa"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder bit prima_anual" id="sa_po3_pa"/>';
	html += '<input type="hidden" id="sa_po3_txt">';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td>';
	html += '<input type="checkbox" class="check_po check_bit check_sa" value="14" id="sa_po4" name="sa_po4" />';
	html += '<label for="sa_po4"><a>PO4</a></label>&nbsp;&nbsp;';
	html += '</td>';
	html += '<td>';
	html += '<a>Edad: </a>';
	html += '<input type="tel" id="sa_po4_edad" class="itxtBorder txtedad small limite_edad_txt edad_po" inputmode="numeric" pattern="[0-9]*"  />';
	html += '</td>';
	html += '<td>';
	html += '<input type="radio" name="sa_po4" id="sa_po4_basico" class="po_basico" /><label for="sa_po4_basico"><a>B&aacute;sico</a></label>&nbsp;&nbsp;';
	html += '<input type="radio" name="sa_po4" id="sa_po4_extra" class="po_extra" /><label for="sa_po4_extra"><a>Extra</a></label>';
	html += '</td>';
	html += '</tr>';
	html += '<tr>';
	html += '<td style="visibility:hidden;">';
	html += 'T:<input type="text" disabled class="txtnoborder" id="sa_po4_tarifa"/>';
	html += '</td>';
	html += '<td>';
	html += '<a>PA: $</a><input type="text" disabled class="itxtBorder bit prima_anual" id="sa_po4_pa"/>';
	html += '<input type="hidden" id="sa_po4_txt">';
	html += '</td>';
	html += '</tr>';
	html += '</table>';
	html += '</div>';
	html += '</div>';
	$('#content').html(html);
	//checkDbTrans();
	$('#alertMsg').html('Cargando informaci&oacute;n');
	$('#loader').show();
	edadTitular = json.met99_edad;
	if(json.met99_sexo == "1"){
		$('#sa_cat').val(11);
		$('#sa_bcacy').val(10);
		$('#sa_eg').val(16);
		$('#sa_cr').val(18);
	}
	if(json.met99_edad < 18){
		$('#sa_bas').addClass('max3m');
		$('#sa_cii_txt').addClass('max3m');
		$('#sa_cma_txt').addClass('max3m');
		$('#sa_tiba_txt').addClass('max3m');
		$('#sa_ge_txt').addClass('max3m');
		limiteBasGfaGe = true;
	}
	else{
		$('#sa_bas').addClass('max100m');
		$('#sa_cii_txt').addClass('max6m');
		$('#sa_cma_txt').addClass('max6m');
		$('#sa_tiba_txt').addClass('max6m');
		$('#sa_ge_txt').addClass('max100m');
	}
	$('body').find(':input').each(function(i,obj){
		var that = $(this);
		if(that.hasClass('itxtBorder') || that.is(':radio') || that.hasClass('txtconyuge') || that.hasClass('check_conyuge_all') || that.is('select'))
			that.prop('disabled', true);
	});
	db.transaction(function(tx){
		var q = 'SELECT * FROM VIDA_Factores WHERE (edad = ' + json.met99_edad_calculada + ' AND id_tarifa <> 10 AND id_tarifa <> 11)';
		q += ' OR (edad = ' + json.met99_edad + ' AND (id_tarifa = 10 OR id_tarifa = 11))';
		//console.log(q);
		tx.executeSql(q, [], function(tx, res){
			for(var i = 0; i < res.rows.length; i++){
				factores[res.rows.item(i).id_tarifa] = res.rows.item(i).factor;
			}
			//inicializo bas, xq las demas coberturas dependen de ella para su max.
        	//se inicializa despues de sacar los factores para tener el factor de bas
        	//$('#sa_bas').val(100000);
			//$('#sa_bas').change();
			var obj = localStorage.getItem('MET99_sa');
			if(obj != null && obj != undefined){
				obj = JSON.parse(obj);
				if(obj.met99_edad_conyuge != undefined && obj.met99_edad_conyuge != ""){
					q = 'SELECT id_tarifa, factor FROM VIDA_Factores WHERE edad = ' + obj.met99_edad_conyuge;
					console.log(q);
					tx.executeSql(q, [], function(tx, res){
						for(var i = 0; i < res.rows.length; i++){
							factoresCy[res.rows.item(i).id_tarifa] = res.rows.item(i).factor;
						}
						//console.log(factoresCy);
						fillFormMet99SA();
						//$('#loader').hide();
					});
				}
				else{
					fillFormMet99SA();
					//$('#loader').hide();
				}	
			}
			else{
				fillFormMet99SA();
				//$('#loader').hide();
			}
		});
	});
	}
	else{
		history.back();
	}
}