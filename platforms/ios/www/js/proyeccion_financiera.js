var proyeccionFinanciera;
var maxAnosPF = 20;
var tasaGadm = 0.17;
var tasaGadq = 0.77;
var tasaGadq2 = 0.13;
var tasaGadq4 = 0.12;
var tasaGadqExc = 0.005;
var proyeccionMensual = 0.004381;
var tecnicoMensual = 0.003674809;
var factorMort = 0.08533724;
var factorV = 0.9569378;
var factorMorb = 0.03332;

db.transaction(function(tx){
	var q = "SELECT Ano, Factor FROM VIDA_PF_Factores_Sel ORDER BY Ano ASC";
	tx.executeSql(q, [], function(tx, res){
		for(var i = 0; i < res.rows.length; i++){
			factoresSel[res.rows.item(i).Ano] = parseFloat(res.rows.item(i).Factor);
		}
		q = "SELECT Edad, BAS, BIT, CII, CMA, TIBA, CATH, CATM, BAE, GFCC FROM VIDA_PF_Factores ORDER BY Edad ASC";
		tx.executeSql(q, [], function(tx, res){
			for(var i = 0; i < res.rows.length; i++){
				var obj = res.rows.item(i);
				if(factoresPF[parseInt(obj.Edad)] == null)
					factoresPF[parseInt(obj.Edad)] = [];
				factoresPF[parseInt(obj.Edad)]['BAS'] = (obj.BAS == null ? 0 : parseFloat(obj.BAS));
				factoresPF[parseInt(obj.Edad)]['BIT'] = (obj.BIT == null ? 0 : parseFloat(obj.BIT));
				factoresPF[parseInt(obj.Edad)]['CII'] = (obj.CII == null ? 0 : parseFloat(obj.CII));
				factoresPF[parseInt(obj.Edad)]['CMA'] = (obj.CMA == null ? 0 : parseFloat(obj.CMA));
				factoresPF[parseInt(obj.Edad)]['TIBA'] = (obj.TIBA == null ? 0 : parseFloat(obj.TIBA));
				factoresPF[parseInt(obj.Edad)]['CATH'] = (obj.CATH == null ? 0 : parseFloat(obj.CATH.toFixed(8)));
				factoresPF[parseInt(obj.Edad)]['CATM'] = (obj.CATM == null ? 0 : parseFloat(obj.CATM.toFixed(8)));
				factoresPF[parseInt(obj.Edad)]['GE'] = (obj.BAE == null ? 0 : parseFloat(obj.BAE.toFixed(8)));
				factoresPF[parseInt(obj.Edad)]['GFC'] = (obj.GFCC == null ? 0 : parseFloat(obj.GFCC));
			}
			q = "SELECT Num_Hijos, GFH FROM VIDA_PF_Factores_GFH ORDER BY Num_Hijos ASC";
			tx.executeSql(q, [], function(tx, res){
				for(var i = 0; i < res.rows.length; i++){
					factoresPFgfh[res.rows.item(i).Num_Hijos] = res.rows.item(i).GFH;
				}
			});
		});
	});
});

function generarEstructura(){
	 proyeccionFinanciera = {
		ano: [], mes: [], edadCalculo: [], edadReal: [], edadCyg: [], edadBac: [], edadCac1: [], edadCac2: [], edadCac3: [], edadAP1: [],
		edadAP2: [], edadAP3: [], edadAP4: [], edadGfc1: [], edadGfc2: [], edadGfc3: [], cancelCat: [], cancelBcacy: [], cancelCac1: [],
		cancelCac2: [], cancelCac3: [], cancelAP1: [], cancelAP2: [], cancelAP3: [], cancelAP4: [], pc: [], primasExcBit: [], primasExcCii: [],
		primasExcCma: [], primasExcCat: [], primasExcBcacy: [], primasExcCac1: [], primasExcCac2: [], primasExcCac3: [], primasExcAPT: [],
		primasExcAP1: [], primasExcAP2: [], primasExcAP3: [], primasExcAP4: [], primasExcExcedente: [], primasExcTotal: [], gadm: [],
		gadq: [], gadqExc: [], sobrante: [], sobrPExc: [], facsel: [], qTit: [], qReal: [], qCyg: [], qBac: [], qCii: [], qTiba: [], qCma: [],
		qGe: [], qGfh: [], qBit: [], qCat: [], qBcacy: [], qCac1: [], qCac2: [], qCac3: [], qGfc1: [], qGfc2: [], qGfc3: [], saBit: [],
		mBas: [], mGfa: [], mGe: [], mBacy: [], mBac: [], mGfc: [], mCma: [], mCii: [], mTiba: [], mBit: [], mGfh: [], mCat: [], mBcacy: [],
		mCac1: [], mCac2: [], mCac3: [], mAPTotal: [], mGfc1: [], mGfc2:[], mGfc3: [], pft: [], cpmn: [], /*cpma: [],*/ coi: [], reserva: [],
		inversion: []
	};
	for(var i = 1; i <= maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			proyeccionFinanciera.ano.push(i);
			proyeccionFinanciera.mes.push(j);
		}
	}
}

function generarPF(){
	var met99 = localStorage.getItem('MET99_temp');
	if(met99 != null && met99 != undefined && met99 != ''){
		var json = JSON.parse(met99);
		//para pruebas, insertare manualmente el objeto sa/prima al json. En pruebas reales ya debe ir insertado.
		//json['coberturas'] = JSON.parse(localStorage.getItem('MET99_sa').replace(/sa_/g,''));
		//json.coberturas['edad_conyuge'] = json.coberturas.met99_edad_conyuge;
		
		generarEstructura();
		generarEdades(json);
		//generarCancelaciones('cancelCat', 'edadReal', 10 + (json.met99_sexo == 1 ? 1 : 0));
		generarCancelaciones('cancelCat', 'edadReal', (json.MET99.met99_sexo == 1 ? 11 : 10));
		//generarCancelaciones('cancelBcacy', 'edadCyg', 10 + (json.met99_sexo == 1 ? 0 : 1));
		generarCancelaciones('cancelBcacy', 'edadCyg', (json.MET99.met99_sexo == 1 ? 10 : 11));
		//generarCancelaciones('cancelCac1', 'edadCac1', 10 + (json.coberturas.cac1_sexo == 11 ? 1 : 0));
		generarCancelaciones('cancelCac1', 'edadCac1', checkEdad(json.coberturas.cac1_sexo));
		//generarCancelaciones('cancelCac2', 'edadCac2', 10 + (json.coberturas.cac1_sexo == 11 ? 1 : 0));
		generarCancelaciones('cancelCac2', 'edadCac2', checkEdad(json.coberturas.cac1_sexo));
		//generarCancelaciones('cancelCac3', 'edadCac3', 10 + (json.coberturas.cac1_sexo == 11 ? 1 : 0));
		generarCancelaciones('cancelCac3', 'edadCac3', checkEdad(json.coberturas.cac1_sexo));
		generarCancelaciones('cancelAP1', 'edadAP1', 13);
		generarCancelaciones('cancelAP2', 'edadAP2', 13);
		generarCancelaciones('cancelAP3', 'edadAP3', 13);
		generarCancelaciones('cancelAP4', 'edadAP4', 13);
		generarPC(parseFloat(json.coberturas.prima_anual_total) + parseFloat(json.coberturas.prima_excedente_total), json.coberturas.prima);
		generarPrimasExcluidas(json.coberturas.bit_pa, 'primasExcBit', 'edadCalculo', 7);
		generarPrimasExcluidas(json.coberturas.cii_pa, 'primasExcCii', 'edadCalculo', 6);
		generarPrimasExcluidas((json.coberturas.cma == 'false' ? json.coberturas.tiba_pa : json.coberturas.cma_pa), 'primasExcCma', 'edadCalculo', (json.coberturas.cma == 'false' ? 9 : 8));
		generarPrimasExcluidas(json.coberturas.cat_pa, 'primasExcCat', 'edadReal', 10 + (json.MET99.met99_sexo == 1 ? 1 : 0));
		generarPrimasExcluidas(json.coberturas.bcacy_pa, 'primasExcBcacy', 'edadCyg', 10 + (json.MET99.met99_sexo == 1 ? 0 : 1));
		generarPrimasExcluidas(json.coberturas.cac1_pa, 'primasExcCac1', 'edadCac1', 10 + (json.coberturas.cac1_sexo == 11 ? 1 : 0));
		generarPrimasExcluidas(json.coberturas.cac2_pa, 'primasExcCac2', 'edadCac2', 10 + (json.coberturas.cac2_sexo == 11 ? 1 : 0));
		generarPrimasExcluidas(json.coberturas.cac3_pa, 'primasExcCac3', 'edadCac3', 10 + (json.coberturas.cac3_sexo == 11 ? 1 : 0));
		generarPrimasExcluidas(json.coberturas.ap_pa, 'primasExcAPT', 'edadReal', 13);
		generarPrimasExcluidas(json.coberturas.po1_pa, 'primasExcAP1', 'edadAP1', 13);
		generarPrimasExcluidas(json.coberturas.po2_pa, 'primasExcAP2', 'edadAP2', 13);
		generarPrimasExcluidas(json.coberturas.po3_pa, 'primasExcAP3', 'edadAP3', 13);
		generarPrimasExcluidas(json.coberturas.po4_pa, 'primasExcAP4', 'edadAP4', 13);
		if(json.coberturas.prima == undefined) //cotizacion por prima
			generarPrimaExcedente(parseFloat(json.coberturas.prima_excedente_total), json.coberturas.prima);
		else
			generarPrimaExcedente(parseFloat(json.coberturas.prima_excedente_total) / 12, json.coberturas.prima);
		generarPrimaExcluidaTotal();
		generarGadm();
		generarGadq();
		generarGadqExc();
		generarSobrante();
		generarSobranteExcedente();
		generarFactoresSel();
		generarFactoresMortalidad('qTit', 'BAS', 'edadCalculo');
		generarFactoresMortalidad('qReal', 'BAS', 'edadReal');
		generarFactoresMortalidad('qCyg', 'BAS', 'edadCyg');
		generarFactoresMortalidad('qBac', 'BAS', 'edadBac');
		generarFactoresMortalidad('qCii', 'CII', 'edadCalculo');
		generarFactoresMortalidad('qTiba', 'TIBA', 'edadCalculo');
		generarFactoresMortalidad('qCma', 'CMA', 'edadCalculo');
		generarFactoresMortalidad('qGe', 'GE', 'edadCalculo');
		generarFactoresMortalidad('qBit', 'BIT', 'edadCalculo');
		generarFactoresMortalidad('qCat', (json.MET99.met99_sexo == 1 ? 'CATM' : 'CATH'), 'edadReal');
		generarFactoresMortalidad('qBcacy', (json.MET99.met99_sexo == 1 ? 'CATH' : 'CATM'), 'edadCyg');
		generarFactoresMortalidad('qCac1', (json.coberturas.cac1_sexo == 11 ? 'CATM' : 'CATH'), 'edadCac1');
		generarFactoresMortalidad('qCac2', (json.coberturas.cac2_sexo == 11 ? 'CATM' : 'CATH'), 'edadCac2');
		generarFactoresMortalidad('qCac3', (json.coberturas.cac3_sexo == 11 ? 'CATM' : 'CATH'), 'edadCac3');
		generarFactoresMortalidad('qGfc1', 'GFC', 'edadGfc1');
		generarFactoresMortalidad('qGfc2', 'GFC', 'edadGfc2');
		generarFactoresMortalidad('qGfc3', 'GFC', 'edadGfc3');
		generarFactorMortalidadGFH(json.coberturas.gfh, json.coberturas.gfh_hijos);
		generarSABit(json.coberturas.bit, json.coberturas.bit_txt);
		var ep = JSON.parse(json.MET99.met99_ocupacion.replace(/'/g, '"'));
		generarCostoMortalidadVida('mBas', 'qTit', json.coberturas.bas, checkPrima(ep.BAS));
		generarCostoMortalidadVida('mGfa', 'qTit', json.coberturas.gfa_txt, checkPrima(ep.BAS));
		generarCostoMortalidadVida('mGe', 'qTit', json.coberturas.ge_txt, checkPrima(ep.BAS));
		generarCostoMortalidadVida('mBacy', 'qCyg', json.coberturas.bacy_txt, 0);
		generarCostoMortalidadVida('mGfc1', 'qGfc1', json.coberturas.gfc1_txt, 0);
		generarCostoMortalidadVida('mGfc2', 'qGfc2', json.coberturas.gfc2_txt, 0);
		generarCostoMortalidadVida('mGfc3', 'qGfc3', json.coberturas.gfc3_txt, 0);
		generarCostoMortalidadVida('mGfc', 'qCyg', json.coberturas.gfc_txt, 0);
		generarCostoMortalidadVida('mBac', 'qBac', json.coberturas.bac_txt, 0);
		generarCostoMortalidad('mCma', 'qCma', json.coberturas.cma_txt, (checkPrima(ep.TIBA) == 0 ? 1 : ep.TIBA));
		generarCostoMortalidad('mTiba', 'qTiba', json.coberturas.tiba_txt, (checkPrima(ep.TIBA) == 0 ? 1 : ep.TIBA));
		generarCostoMortalidad('mCii', 'qCii', json.coberturas.cii_txt, (checkPrima(ep.CII) == 0 ? 1 : ep.CII));
		generarCostoMortalidad('mBit', 'qBit', json.coberturas.bit_txt, (checkPrima(ep.CII) == 0 ? 1 : ep.CII));
		generarCostoMortalidad('mGfh', 'qGfh', json.coberturas.gfh_txt, 1);
		generarCostoMortalidad('mCat', 'qCat', json.coberturas.cat_txt, 1);
		generarCostoMortalidad('mBcacy', 'qBcacy', json.coberturas.bcacy_txt, 1);
		generarCostoMortalidad('mCac1', 'qCac1', json.coberturas.cac1_txt, 1);
		generarCostoMortalidad('mCac2', 'qCac2', json.coberturas.cac2_txt, 1);
		generarCostoMortalidad('mCac3', 'qCac3', json.coberturas.cac3_txt, 1);
		generarCostoMortalidadAP(checkPrima(json.coberturas.ap_txt), checkPrima(json.coberturas.po1_txt), checkPrima(json.coberturas.po2_txt), checkPrima(json.coberturas.po3_txt), checkPrima(json.coberturas.po4_txt));
		calcularPFT(checkPrima(ep.BAS));
		calcularCPMN(json.coberturas.bas);
		calcularCOI();
		calcularFondoReserva();
		calcularFondoInversion();
	}
}

function generarEdades(json){	
	var cob = json.coberturas;
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			proyeccionFinanciera.edadCalculo.push(parseInt(json.MET99.met99_edad_calculada) + i);
			proyeccionFinanciera.edadReal.push(parseInt(json.MET99.met99_edad) + i);
			proyeccionFinanciera.edadCyg.push((checkEdad(cob.edad_conyuge) == 0 ? 0 : parseInt(cob.edad_conyuge) + i));
			proyeccionFinanciera.edadBac.push((checkEdad(cob.bac_edad) == 0 ? 0 : parseInt(cob.bac_edad) + i));
			proyeccionFinanciera.edadCac1.push((checkEdad(cob.cac1_edad) == 0 ? 0 : parseInt(cob.cac1_edad) + i));
			proyeccionFinanciera.edadCac2.push((checkEdad(cob.cac2_edad) == 0 ? 0 : parseInt(cob.cac2_edad) + i));
			proyeccionFinanciera.edadCac3.push((checkEdad(cob.cac3_edad) == 0 ? 0 : parseInt(cob.cac3_edad) + i));
			proyeccionFinanciera.edadAP1.push((checkEdad(cob.po1_edad) == 0 ? 0 : parseInt(cob.po1_edad) + i));
			proyeccionFinanciera.edadAP2.push((checkEdad(cob.po2_edad) == 0 ? 0 : parseInt(cob.po2_edad) + i));
			proyeccionFinanciera.edadAP3.push((checkEdad(cob.po3_edad) == 0 ? 0 : parseInt(cob.po3_edad) + i));
			proyeccionFinanciera.edadAP4.push((checkEdad(cob.po4_edad) == 0 ? 0 : parseInt(cob.po4_edad) + i));
			proyeccionFinanciera.edadGfc1.push((checkEdad(cob.gfc1_edad) == 0 ? 0 : parseInt(cob.gfc1_edad) + i));
			proyeccionFinanciera.edadGfc2.push((checkEdad(cob.gfc2_edad) == 0 ? 0 : parseInt(cob.gfc2_edad) + i));
			proyeccionFinanciera.edadGfc3.push((checkEdad(cob.gfc3_edad) == 0 ? 0 : parseInt(cob.gfc3_edad) + i));
		}
	}
}

function checkEdad(val){
	if(val == null || val == '' || val == undefined){
		val = 0;
	}
	return parseInt(val);
}

function generarCancelaciones(k, e, idtarifa){
	var cancelacion = limiteEdades[idtarifa].Cancelacion;
	//console.log(idtarifa + ' ' + cancelacion);
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			if(proyeccionFinanciera[e][(i*12)+j-1] > cancelacion)
				proyeccionFinanciera[k].push(1);
			else
				proyeccionFinanciera[k].push(0);
		}
	}
}

function generarPC(primaAnual, primaQuincenal){
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			if(primaQuincenal == undefined){ //el campo prima (primaQuincenal) no existe en cotizacion por SA.
				proyeccionFinanciera.pc.push(getPrima(parseFloat(primaAnual), j));
			}
			else{
				proyeccionFinanciera.pc.push(parseFloat((primaAnual/12).toFixed(2)));
			}
		}
	}
}

function generarPrimasExcluidas(val, k, e, idtarifa){
	var cancelacion = limiteEdades[idtarifa].Cancelacion;
	//console.log(idtarifa + ' ' + cancelacion);
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			if(proyeccionFinanciera[e][(i*12)+j-1] > cancelacion){
				proyeccionFinanciera[k].push(getPrima(checkPrima(val), j));
			}
			else{
				proyeccionFinanciera[k].push(0);
			}
		}
	}
}

function checkPrima(val){
	if(val == null || val == '' || val == undefined){
		val = 0;
	}
	return parseFloat(val);
}

function getPrima(prima, mes){ //por si piden que se haga anual o mensualmente, tener la funcion preparada
	var res = 0;
	if(mes == 1)
		res = prima;
	return res;
}

function generarPrimaExcedente(excedente, primaQuincenal){
	//var e = parseFloat(excedente) / 12;
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			if(primaQuincenal == undefined){ //el campo prima (primaQuincenal) no existe en cotizacion por SA.
				proyeccionFinanciera.primasExcExcedente.push(getPrima(excedente, j)); 
			}
			else{
				proyeccionFinanciera.primasExcExcedente.push(excedente); 
			}
		}
	}
}

function generarPrimaExcluidaTotal(){
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			var res = proyeccionFinanciera.primasExcBit[(i*12)+j-1];
			res += proyeccionFinanciera.primasExcCii[(i*12)+j-1];
			res += proyeccionFinanciera.primasExcCma[(i*12)+j-1];
			res += proyeccionFinanciera.primasExcCat[(i*12)+j-1];
			res += proyeccionFinanciera.primasExcBcacy[(i*12)+j-1];
			res += proyeccionFinanciera.primasExcCac1[(i*12)+j-1];
			res += proyeccionFinanciera.primasExcCac2[(i*12)+j-1];
			res += proyeccionFinanciera.primasExcCac3[(i*12)+j-1];
			res += proyeccionFinanciera.primasExcAPT[(i*12)+j-1];
			res += proyeccionFinanciera.primasExcAP1[(i*12)+j-1];
			res += proyeccionFinanciera.primasExcAP2[(i*12)+j-1];
			res += proyeccionFinanciera.primasExcAP3[(i*12)+j-1];
			res += proyeccionFinanciera.primasExcAP4[(i*12)+j-1];
			res += proyeccionFinanciera.primasExcExcedente[(i*12)+j-1];
			proyeccionFinanciera.primasExcTotal.push(res);
		}
	}
}

function generarGadm(){
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			var gadm = (proyeccionFinanciera.pc[(i*12)+j-1] - proyeccionFinanciera.primasExcTotal[(i*12)+j-1])*tasaGadm;
			proyeccionFinanciera.gadm.push(parseFloat(gadm.toFixed(2)));
		}
	}
}

function generarGadq(){
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			var gadq = 0;
			if(i == 0)
				gadq = (proyeccionFinanciera.pc[(i*12)+j-1] - proyeccionFinanciera.primasExcTotal[(i*12)+j-1])*tasaGadq;
			else if(i < 3)
				gadq = (proyeccionFinanciera.pc[(i*12)+j-1] - proyeccionFinanciera.primasExcTotal[(i*12)+j-1])*tasaGadq2;
			else
				gadq = (proyeccionFinanciera.pc[(i*12)+j-1] - proyeccionFinanciera.primasExcTotal[(i*12)+j-1])*tasaGadq4;
			proyeccionFinanciera.gadq.push(parseFloat(gadq.toFixed(2)));
		}
	}
}

function generarGadqExc(){
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			if(i < 3){
				var gadqExc = proyeccionFinanciera.primasExcTotal[(i*12)+j-1]*tasaGadqExc;
				//proyeccionFinanciera.gadqExc.push(parseFloat(gadqExc.toFixed(2)));
				proyeccionFinanciera.gadqExc.push(gadqExc);
			}
			else{
				proyeccionFinanciera.gadqExc.push(0);
			}
		}
	}
}

function generarSobrante(){
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			var sobrante = proyeccionFinanciera.pc[(i*12)+j-1] - proyeccionFinanciera.gadm[(i*12)+j-1] - proyeccionFinanciera.gadq[(i*12)+j-1] - proyeccionFinanciera.primasExcTotal[(i*12)+j-1];
			proyeccionFinanciera.sobrante.push(parseFloat(sobrante.toFixed(2)));
		}
	}
}

function generarSobranteExcedente(){
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			var sobrante = proyeccionFinanciera.primasExcTotal[(i*12)+j-1] - proyeccionFinanciera.gadqExc[(i*12)+j-1];
			proyeccionFinanciera.sobrPExc.push(parseFloat(sobrante.toFixed(2)));
		}
	}
}

function generarFactoresSel(){
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			proyeccionFinanciera.facsel.push(factoresSel[i + 1]);
		}
	}
}

function generarFactoresMortalidad(k, t, e){
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			var edad = proyeccionFinanciera[e][(i*12)+j-1];
			if(edad == 0)
				proyeccionFinanciera[k].push(0);
			else
				proyeccionFinanciera[k].push(factoresPF[edad][t]);
		}
	}
}

function generarFactorMortalidadGFH(gfh, hijos){
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			if(gfh == 'false')
				proyeccionFinanciera.qGfh.push(0);
			else
				proyeccionFinanciera.qGfh.push(factoresPFgfh[hijos]);
		}
	}
}

function generarSABit(bit, saBit){
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			var total = 0;
			if(bit != 'false'){
				total = checkPrima(saBit);
				total -= proyeccionFinanciera.primasExcCat[i*12]; //si se activa el pago mensual, se utilizaria -= (proyeccionFinanciera.primasExcCat[(i*12)+j-1] * 12)
				total -= proyeccionFinanciera.primasExcCac1[i*12];
				total -= proyeccionFinanciera.primasExcCac2[i*12];
				total -= proyeccionFinanciera.primasExcCac3[i*12];
				total -= proyeccionFinanciera.primasExcAP1[i*12];
				total -= proyeccionFinanciera.primasExcAP2[i*12];
				total -= proyeccionFinanciera.primasExcAP3[i*12];
				total -= proyeccionFinanciera.primasExcAP4[i*12];
				total = parseFloat(total.toFixed(2));
				if(total < 0) total = 0;
			}
			proyeccionFinanciera.saBit.push(total);
		}
	}
}

function generarCostoMortalidadVida(k, q, sa, ep){
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			var res = (checkPrima(sa) * ((proyeccionFinanciera[q][(i*12)+j-1] * proyeccionFinanciera.facsel[(i*12)+j-1]) + (ep/1000))) * factorMort * factorV;
			proyeccionFinanciera[k].push(parseFloat(res.toFixed(2)));
		}
	}
}

function generarCostoMortalidad(k, q, sa, ep){
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			var res = checkPrima(sa) * proyeccionFinanciera[q][(i*12)+j-1] * ep * factorMort * factorV;
			if(k == 'mGfh')
				proyeccionFinanciera[k].push(parseFloat(res.toFixed(9)));
			else
				proyeccionFinanciera[k].push(parseFloat(res.toFixed(2)));
		}
	}
}

function generarCostoMortalidadAP(pot, po1, po2, po3, po4){
	var cancelacion = limiteEdades[13].Cancelacion;
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			var apt = pot;
			var ap1 = po1;
			var ap2 = po2;
			var ap3 = po3; 
			var ap4 = po4;
			if(apt != 1000) apt *= 1.3162;
			if(ap1 != 1000) ap1 *= 1.3162;
			if(ap2 != 1000) ap2 *= 1.3162;
			if(ap3 != 1000) ap3 *= 1.3162;
			if(ap4 != 1000) ap4 *= 1.3162;
			if(proyeccionFinanciera.edadReal[(i*12)+j-1] > cancelacion) apt = 0;
			if(proyeccionFinanciera.edadAP1[(i*12)+j-1] > cancelacion) ap1 = 0;
			if(proyeccionFinanciera.edadAP2[(i*12)+j-1] > cancelacion) ap2 = 0;
			if(proyeccionFinanciera.edadAP3[(i*12)+j-1] > cancelacion) ap3 = 0;
			if(proyeccionFinanciera.edadAP4[(i*12)+j-1] > cancelacion) ap4 = 0;
			var res = (apt + ap1 + ap2 + ap3 + ap4) * factorMorb * factorMort * factorV;
			proyeccionFinanciera.mAPTotal.push(parseFloat(res.toFixed(9)));
		}
	}
}

function calcularPFT(epBas){
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			if(i < 5){
				var pc = proyeccionFinanciera.pc[(i*12)+j-1];
				if(pc == 0) pc = proyeccionFinanciera.pc[(i*12)]*(i + 1); //si pc es 0 quiere decir que es pago anual
				else if(proyeccionFinanciera.pc[1] > 0) pc *= ((i*12) + j); //si pc no es igual a 0, quiere decir que o es pago mensual o es primer mes del año en pago anual. Si es pago mensual el 2o mes sera > 0.
				else pc *= (i + 1);
				//no se necesita revisar en un if si la ep es 0, xq si es 0 simplemente se elimina esa parte de la ecuacion
				var pft = ((pc * proyeccionFinanciera.qTit[(i*12)+j-1] * proyeccionFinanciera.facsel[(i*12)+j-1]) + (pc*epBas/1000)) * factorMort * factorV;
				proyeccionFinanciera.pft.push(parseFloat(pft.toFixed(2)));
			}
			else{
				proyeccionFinanciera.pft.push('');
			}
		}
	}
}

function calcularCPMN(sabas){
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			proyeccionFinanciera.cpmn.push('');
		}
	}
	var res = 0;
	if(sabas < 500000){
		res = sabas * 30 / 365 * proyeccionFinanciera.qTit[0];
	}
	else{
		res = 500000 * 30 / 365 * proyeccionFinanciera.qTit[0];
	}
	proyeccionFinanciera.cpmn[0] = parseFloat(res.toFixed(6));
	proyeccionFinanciera.cpmn[1] = parseFloat(res.toFixed(6));
}

function calcularCOI(){
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			var total = 0;
			total += proyeccionFinanciera.mBas[(i*12)+j-1]; 
			total += proyeccionFinanciera.mGfa[(i*12)+j-1];
			total += proyeccionFinanciera.mGe[(i*12)+j-1];
			total += proyeccionFinanciera.mBacy[(i*12)+j-1];
			total += proyeccionFinanciera.mBac[(i*12)+j-1];
			total += proyeccionFinanciera.mGfc[(i*12)+j-1];
			total += proyeccionFinanciera.mCma[(i*12)+j-1];
			total += proyeccionFinanciera.mCii[(i*12)+j-1];
			total += proyeccionFinanciera.mTiba[(i*12)+j-1]; 
			total += proyeccionFinanciera.mBit[(i*12)+j-1];
			total += proyeccionFinanciera.mGfh[(i*12)+j-1];
			total += proyeccionFinanciera.mCat[(i*12)+j-1];
			total += proyeccionFinanciera.mBcacy[(i*12)+j-1];
			total += proyeccionFinanciera.mCac1[(i*12)+j-1];
			total += proyeccionFinanciera.mCac2[(i*12)+j-1];
			total += proyeccionFinanciera.mCac3[(i*12)+j-1];
			total += proyeccionFinanciera.mAPTotal[(i*12)+j-1];
			total += proyeccionFinanciera.mGfc1[(i*12)+j-1];
			total += proyeccionFinanciera.mGfc2[(i*12)+j-1];
			total += proyeccionFinanciera.mGfc3[(i*12)+j-1];
			total = parseFloat(total.toFixed(2));
			proyeccionFinanciera.coi.push(total);
		}
	}
}

function calcularFondoReserva(){
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			var res = 0;
			if(i == 0 && j == 1){
				res = proyeccionFinanciera.sobrante[0] - proyeccionFinanciera.coi[0] - proyeccionFinanciera.cpmn[0] - proyeccionFinanciera.pft[0];
			}
			else if(proyeccionFinanciera.reserva[(i*12)+j-2] > 0){
				res = (proyeccionFinanciera.reserva[(i*12)+j-2] * (1 + proyeccionMensual)) + proyeccionFinanciera.sobrante[(i*12)+j-1] - proyeccionFinanciera.coi[(i*12)+j-1] - checkPrima(proyeccionFinanciera.cpmn[(i*12)+j-1]) - checkPrima(proyeccionFinanciera.pft[(i*12)+j-1]);	
			}
			else{
				res = (proyeccionFinanciera.reserva[(i*12)+j-2] * (1 + tecnicoMensual)) + proyeccionFinanciera.sobrante[(i*12)+j-1] - proyeccionFinanciera.coi[(i*12)+j-1] - checkPrima(proyeccionFinanciera.cpmn[(i*12)+j-1]) - checkPrima(proyeccionFinanciera.pft[(i*12)+j-1]);
			}
			proyeccionFinanciera.reserva.push(parseFloat(res.toFixed(2)));
			//proyeccionFinanciera.reserva.push(Math.floor(res * 100) / 100);
			//proyeccionFinanciera.reserva.push(Number(res.toString().match(/^\d+(?:\.\d{0,2})?/)));
			//proyeccionFinanciera.reserva.push(Math.round10(res,-2));
		}
	}
}

function calcularFondoInversion(){
	for(var i = 0; i < maxAnosPF; i++){
		for(var j = 1; j <= 12; j++){
			var res = 0;
			if(i == 0 && j == 1){
				res = proyeccionFinanciera.sobrPExc[0];
			}
			else{
				res = (proyeccionFinanciera.inversion[(i*12)+j-2] * (1 + proyeccionMensual)) + proyeccionFinanciera.sobrPExc[(i*12)+j-1];
				//res = (proyeccionFinanciera.inversion[(i*12)+j-2] * (1 + proyeccionMensual)) + proyeccionFinanciera.sobrPExc[(i*12)];
			}
			proyeccionFinanciera.inversion.push(parseFloat(res.toFixed(2)));
		}
	}
}

function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }