var db;

var er = 0;
var ok1 = 0;
var ok2 = 0;
var ok3 = 0;
var intAux = 0;

function openDB() {
    //db = sqlitePlugin.openDatabase({name:'kc.db', location:2});
    db = sqlitePlugin.openDatabase({name: 'kc.db', iosDatabaseLocation: 'default'});
    console.log("db opend");
    //localStorage.removeItem('lastUpdate');
    /*if(localStorage.getItem('lastUpdate') == null){
     db.transaction(createTables, errorCB, successCB);
     }*/
    db.transaction(createTables, errorCB, successCB);
}
function createTables(tx) {
    console.log("create tables...");
    if (localStorage.getItem('lastUpdate') != null && location.href.indexOf("busqueda.html") >= 0) {
        console.log('estamos en busqueda.html');
        var q = 'select id_tarifa, edad, factor from vida_factores where id_tarifa = 10 or id_tarifa = 11 order by edad, id_tarifa';
        console.log(q);
        tx.executeSql(q, [], function (tx, res) {
            console.log("hola 1");
            for (var i = 0; i < res.rows.length; i++) {
                if (factoresCancer[res.rows.item(i).edad] == null) {
                    factoresCancer[res.rows.item(i).edad] = [];
                }
                factoresCancer[res.rows.item(i).edad][res.rows.item(i).id_tarifa] = res.rows.item(i).factor;
            }
            q = 'select edad, factor from vida_factores where id_tarifa = 19 order by edad';
            console.log(q);
            tx.executeSql(q, [], function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    factoresGfh[res.rows.item(i).edad] = res.rows.item(i).factor;
                }
                q = 'SELECT ea.Id_Cobertura, id_tarifa, Minima, Maxima, Cancelacion FROM VIDA_Edades_Aceptacion AS ea, ';
                q += 'VIDA_Coberturas_tarifas AS ct WHERE ea.Id_Cobertura = ct.Id_Cobertura ORDER BY ea.Id_Cobertura, id_tarifa';
                console.log(q);
                tx.executeSql(q, [], function (tx, res) {
                    for (var i = 0; i < res.rows.length; i++) {
                        var json = '{';
                        json += '"Minima": ' + res.rows.item(i).Minima + ',';
                        json += '"Maxima": ' + res.rows.item(i).Maxima + ',';
                        json += '"Cancelacion": ' + res.rows.item(i).Cancelacion;
                        json += '}';
                        //console.log(json);
                        limiteEdades[res.rows.item(i).id_tarifa] = JSON.parse(json);
                        //console.log(JSON.stringify(limiteEdades));
                    }
                    q = 'select edad, factor from vida_factores where id_tarifa = 4 order by edad';
                    console.log(q);
                    tx.executeSql(q, [], function (tx, res) {
                        for (var i = 0; i < res.rows.length; i++) {
                            factoresGfc[res.rows.item(i).edad] = res.rows.item(i).factor;
                        }
                        q = 'select edad, factor from vida_factores where id_tarifa = 5 order by edad';
                        console.log(q);
                        tx.executeSql(q, [], function (tx, res) {
                            for (var i = 0; i < res.rows.length; i++) {
                                factoresBac[res.rows.item(i).edad] = res.rows.item(i).factor;
                            }
                            q = 'SELECT Nombre, Valor FROM Parametros';
                            console.log(q);
                            tx.executeSql(q, [], function (tx, res) {
                                for (var i = 0; i < res.rows.length; i++) {
                                    if (res.rows.item(i).Nombre == 'PorcentajeIVA') {
                                        iva = (res.rows.item(i).Valor / 100) + 1;
                                    }
                                    else if (res.rows.item(i).Nombre == 'GMM_DerechoPoliza') {
                                        derechoPoliza = res.rows.item(i).Valor;
                                    }
                                    else if (res.rows.item(i).Nombre == 'SalarioMensual') {
                                        salarioMes = res.rows.item(i).Valor;
                                    }
                                    else if (res.rows.item(i).Nombre == 'SalarioDiario') {
                                        salarioDiario = res.rows.item(i).Valor;
                                    }
                                }
                                q = "SELECT Ano, Factor FROM VIDA_PF_Factores_Sel ORDER BY Ano ASC";
                                console.log(q);
                                tx.executeSql(q, [], function (tx, res) {
                                    for (var i = 0; i < res.rows.length; i++) {
                                        factoresSel[res.rows.item(i).Ano] = parseFloat(res.rows.item(i).Factor);
                                    }
                                    q = "SELECT Edad, BAS, BIT, CII, CMA, TIBA, CATH, CATM, BAE, GFCC FROM VIDA_PF_Factores ORDER BY Edad ASC";
                                    console.log(q);
                                    tx.executeSql(q, [], function (tx, res) {
                                        for (var i = 0; i < res.rows.length; i++) {
                                            var obj = res.rows.item(i);
                                            if (factoresPF[parseInt(obj.Edad)] == null)
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
                                        console.log(q);
                                        tx.executeSql(q, [], function (tx, res) {
                                            for (var i = 0; i < res.rows.length; i++) {
                                                factoresPFgfh[res.rows.item(i).Num_Hijos] = res.rows.item(i).GFH;
                                            }
                                            //tx.executeSql('DROP TABLE IF EXISTS kc_cotizaciones');
                                            tx.executeSql('CREATE TABLE IF NOT EXISTS kc_cotizaciones (nombre, tipo, fecha, poliza, form)');
                                            //tx.executeSql('DROP TABLE IF EXISTS kc_agenda');
                                            tx.executeSql('CREATE TABLE IF NOT EXISTS kc_agenda (nombre, motivo, fecha, hora, duracion, lugar, json, synced, estatus)');
                                            console.log("finished");
                                            /*
                                             q = "SELECT COUNT(*) AS count FROM Carteras_Maestro";
                                             tx.executeSql(q, [], function(tx, res){
                                             console.log("Count CM: " + res.rows.item(0).count);
                                             q = "SELECT COUNT(*) AS count FROM VIDA_Carteras";
                                             tx.executeSql(q, [], function(tx, res){
                                             console.log("Count CM: " + res.rows.item(0).count);
                                             });
                                             });
                                             */
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }
}
/*
 function openDB(){
 db = window.openDatabase("Kc", "1.0", "Kc Database", 2 * 1024 * 1024);
 console.log("db opend");
 //localStorage.removeItem('lastUpdate');
 //if(localStorage.getItem('lastUpdate') == null){
 //	db.transaction(createTables, errorCB, successCB);
 //}
 db.transaction(createTables, errorCB, successCB);
 }
 function createTables(tx){
 //tx.executeSql('DROP TABLE IF EXISTS kc_cotizaciones');
 tx.executeSql('CREATE TABLE IF NOT EXISTS kc_cotizaciones (nombre, tipo, fecha, poliza, form)');
 //tx.executeSql('DROP TABLE IF EXISTS kc_agenda');
 tx.executeSql('CREATE TABLE IF NOT EXISTS kc_agenda (nombre, motivo, fecha, hora, duracion, lugar, json)');
 }
 */

// Transaction error callback
//
function errorCB(tx, err) {
    alert("Error processing SQL: " + err);
    console.log('SQL ERROR: ' + err);
}

// Transaction success callback
//
function successCB() {
    console.log("successss!");
}

/*
 function createTables(tx){
 tx.executeSql('DROP TABLE IF EXISTS Coberturas_tarifas');
 tx.executeSql('DROP TABLE IF EXISTS Tarifas');
 tx.executeSql('DROP TABLE IF EXISTS Planes');
 tx.executeSql('DROP TABLE IF EXISTS Ocupaciones');
 tx.executeSql('DROP TABLE IF EXISTS Geolocalizaciones');
 tx.executeSql('DROP TABLE IF EXISTS Factores');
 tx.executeSql('DROP TABLE IF EXISTS Retenedores');
 tx.executeSql('DROP TABLE IF EXISTS Carteras_coberturas');
 tx.executeSql('DROP TABLE IF EXISTS Carteras');
 tx.executeSql('DROP TABLE IF EXISTS Agentes');

 tx.executeSql('CREATE TABLE IF NOT EXISTS Coberturas_tarifas (id UNIQUE, Id_Cobertura_Tarifa INTEGER PRIMARY KEY, id_cobertura, id_tarifa)');
 tx.executeSql('CREATE TABLE IF NOT EXISTS Tarifas (id UNIQUE, id_tarifa INTEGER PRIMARY KEY, nombre)');
 tx.executeSql('CREATE TABLE IF NOT EXISTS Planes (id UNIQUE, id_plan INTEGER PRIMARY KEY, clave, descripcion)');
 tx.executeSql('CREATE TABLE IF NOT EXISTS Ocupaciones (id UNIQUE, id_ocupacion, clave, descripcion, tipo, BAS, TIBA, CII, BIT, BGE, GFA)');
 tx.executeSql('CREATE TABLE IF NOT EXISTS Geolocalizaciones (id UNIQUE, Id_Geolocalizacion INTEGER PRIMARY KEY, Id_Retenedor, Descripcion, Longitud, Latitud, Activo, Oportunidades)');
 tx.executeSql('CREATE TABLE IF NOT EXISTS Factores (id UNIQUE, id_factor INTEGER PRIMARY KEY, id_tarifa, edad, factor)');
 tx.executeSql('CREATE TABLE IF NOT EXISTS Retenedores (id UNIQUE, id_retenedor INTEGER PRIMARY KEY, nombre, clave, unidad_pago)');
 tx.executeSql('CREATE TABLE IF NOT EXISTS Carteras_coberturas (id INTEGER PRIMARY KEY, id_poliza, producto, poliza, clave_cobertura, prima, extraprima, suma_asegurada)');
 tx.executeSql('CREATE TABLE IF NOT EXISTS Carteras (id UNIQUE, id_poliza, nombre, rfc, _plan, poliza, fecha_emision, suma_asegurada, prima, id_retenedor, fecha_ultimo_descuento, prima_excedente, concepto_descuento, reserva, signo_reserva, recibos_pendientes, primas_pendientes, estatus_poliza, domicilio, ciudad, cp, estado, telefono, prima_incremento, fecha_emision_incremento, suma_asegurada_incremento, fecha_emision_dividendos, importe_dividendos, numero_cheque_dividendos, fondo_Inversion, digito_verificador, OportunidadVenta, Nombre_Retenedor)');
 tx.executeSql('CREATE TABLE IF NOT EXISTS Agentes (id UNIQUE, id_agente INTEGER PRIMARY KEY, clave, password, nombre, activo, fecha_sincronizacion)');
 }
 */
var defDate = '2000-01-01';
function syncDB(token) {
    var fecha = defDate;
    if (localStorage.getItem('lastUpdate') != null) {
        fecha = localStorage.getItem('lastUpdate');
    }


    //adb -d shell 'run-as com.vdmas.kc cat /data/data/com.vdmas.kc/databases/kc.db > /sdcard/kc.sqlite'

    //var url = 'http://triton.grupokc.com.mx/Triton/Datos/tablas/' + token + '/1/' + fecha + '?callback=?';
    //var url = 'http://187.174.229.88/triton/datos/tablas/' + token + '/1/' + fecha + '?callback=?';
    //var url = 'http://tritonv2.grupokc.com.mx/triton/datos/tablas/' + token + '/1/' + fecha + '?callback=?';
    var url = 'http://tritonv2.grupokc.com.mx/datos/tablas/' + token + '/1/' + fecha + '?callback=?';
    console.log(url);
    $.getJSON(url, function (d) {
        var json = JSON.parse(d);
        //console.log(json['data'].length);
        if (!json['success']) {
            alert(json['error']);
        }
        else if (json['data'].length > 0) {
            //numTblsUpdated = json['data'].length;
            var tablas = {}; //variable local para verificar que no se repitan las tablas
            $.each(json['data'], function (i, item) {
                //populateTable(item['Nombre'], token, fecha, 1);
                if (tablas[item['Nombre']] == null || tablas[item['Nombre']] == undefined) {
                    tablas[item['Nombre']] = true;
                    numTblsUpdated++;
                    addConnection(item['Nombre'], token, fecha, 1, null);
                }
            });
            console.log('tablas a update: ' + numTblsUpdated);
        }
        else {
            //console.log('hey yo');
            DBUpdated();
        }
    });
}

var maxConns = 6;
var currConns = 0;
var waitingConns = [];
var brokenConns = [];
var tblsToUpdate = {};
function addConnection(tbl, token, fecha, pag, maxPags) {
    var connection = {
        table: tbl,
        token: token,
        fecha: fecha,
        pagina: pag,
        maxPags: maxPags,
        retry: false
    };
    waitingConns.push(connection);
    checkConnections();
}
function checkConnections() {
    if (maxConns > currConns) {
        if (waitingConns.length > 0) {
            var nextConn = waitingConns.shift(); //shift regresa y remueve el primer elemento del array
            currConns++;
            populateTable(nextConn.table, nextConn.token, nextConn.fecha, nextConn.pagina, nextConn.maxPags, nextConn.retry);
        }
    }
}
function addBrokenConnection(tbl, token, fecha, pag, maxPags) {
    var connection = {
        table: tbl,
        token: token,
        fecha: fecha,
        pagina: pag,
        maxPags: maxPags,
        retry: true
    };
    brokenConns.push(connection);
}
function retryConnections() {
    numTblsUpdated = brokenConns.length;
    count = 0;
    waitingConns = brokenConns;
    brokenConns = [];
    checkConnections();
    $('#loader').show();
}

function addTable(tbl, maxPags) {
    var table = {
        count: 0,
        max: maxPags
    };
    tblsToUpdate[tbl] = table;
}
function tblUpdated(tbl) {
    if (tblsToUpdate[tbl] != null && tblsToUpdate[tbl] != undefined) {
        tblsToUpdate[tbl].count = tblsToUpdate[tbl].count + 1;
        //console.log(tbl + " " + tblsToUpdate[tbl].count + " / " + tblsToUpdate[tbl].max );
        if (tblsToUpdate[tbl].count >= tblsToUpdate[tbl].max) {
            console.log(tbl + " " + tblsToUpdate[tbl].count + " / " + tblsToUpdate[tbl].max);
            //marcar tabla como terminada
            count++; //variable global
            DBUpdated(tbl);
        }
    }
}

function populateTable(tbl, token, fecha, pag, maxPags, retry) {
    //console.log("PopulateTbl " + tbl + " " + pag);
    if (!retry && maxPags != null && pag < maxPags) {
        addConnection(tbl, token, fecha, pag + 1, maxPags);
    }

    /*if(tbl == 'AUTOS_Cotizador'){
        console.log('### AUTOS_Cotizador - pag: ' + pag + ' - ' + intAux++)
    }*/

    //var url = 'http://triton.grupokc.com.mx/Triton/Datos/' + tbl + '/' + token + '/' + pag + '/' + fecha + '/?callback=?';
    //var url = 'http://187.174.229.88/triton/datos/' + tbl + '/' + token + '/' + pag + '/' + fecha + '/?callback=?';
    //var url = 'http://tritonv2.grupokc.com.mx/triton/datos/' + tbl + '/' + token + '/' + pag + '/' + fecha + '/?callback=?';
    var url = 'http://tritonv2.grupokc.com.mx/datos/' + tbl + '/' + token + '/' + pag + '/' + fecha + '/?callback=?';
    $.ajax({
        url: url,
        dataType: 'jsonp',
        timeout: 120000,
        error: function (jqXHR, txt, et) {
            flagErrors = true;
            //txtTblerrors += tbl + ', ';
            if (tblsWithErrors[tbl] != null && tblsWithErrors[tbl] != undefined) {
                tblsWithErrors[tbl] = tblsWithErrors[tbl] + 1;
            }
            else {
                tblsWithErrors[tbl] = 1;
            }
            currConns--;
            checkConnections();
            addBrokenConnection(tbl, token, fecha, pag, maxPags);
            if (retry) {
                count++;
                DBUpdated();
            }
            else {
                tblUpdated(tbl);
            }
            console.log(jqXHR);
            console.log('populateTable - er: ' + er++);
            /*DBUpdated(tbl);
             console.log('e:' + tbl);
             console.log(jqXHR);
             console.log(txt);
             console.log(et);*/
        },
        success: function (d) {
            $('#alertMsg').html('Sincronizando ' + tbl + '...');
            //$('#alertMsg').html('Sincronizando ' + tbl + '...' + '<br/>' + 'P&aacute;g.: ' + pag);
            //$('#alertMsg').html('Sincronizando ' + tbl + '...' + '<br/>' + 'P&aacute;g.: ' + pag + '<br/>' + 'Ciclo: ' + intAux++);
            var json = JSON.parse(d);
            currConns--;
            checkConnections();
            if (!json['success']) {
                alert(json['error']);
            }
            else if (json['data'].length > 0) {
                var fieldsQuery = '(';
                var fieldsQuery2 = ' VALUES (';
                var keys = [];
                for (var key in json['data'][0]) {
                    fieldsQuery += key + ',';
                    fieldsQuery2 += '?,';
                    keys.push(key);
                }
                fieldsQuery = fieldsQuery.substring(0, fieldsQuery.length - 1);
                fieldsQuery += ')';
                fieldsQuery2 = fieldsQuery2.substring(0, fieldsQuery2.length - 1);
                fieldsQuery2 += ')';
                fieldsQuery = fieldsQuery.replace(/\//g, '_');
                fieldsQuery2 = fieldsQuery2.replace(/\//g, '_');
                //fieldsQuery += fieldsQuery2;

                if (pag == 1) {
                    if (json['paginas'] != null && json['paginas'] != undefined && json['paginas'] > pag) {
                        addConnection(tbl, token, fecha, pag + 1, json['paginas']);
                        addTable(tbl, json['paginas']);
                    }
                    else {
                        addTable(tbl, 0);
                    }
                    db.transaction(function (tx) {
                        //tx.executeSql('DELETE FROM ' + tbl);
                        tx.executeSql('DROP TABLE IF EXISTS ' + tbl);
                        tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tbl + ' ' + fieldsQuery);
                    }, function () {
                        console.log('Error creando Tbl ' + tbl);
                        console.log('CREATE TABLE IF NOT EXISTS ' + tbl + ' ' + fieldsQuery);
                    }, function () {
                        db.transaction(function (tx) {
                            var q = 'INSERT INTO ' + tbl + ' ' + fieldsQuery + fieldsQuery2;
                            $.each(json['data'], function (i, item) {
                                var values = [];
                                for (var i = 0; i < keys.length; i++) {
                                    values.push(item[keys[i]]);
                                }
                                tx.executeSql(q, values);
                            });
                        }, function () {
                            console.log('Error en: Tbl ' + tbl + ' pag ' + pag);
                        }, function () {
                            //console.log('Tbl ' + tbl + ' pag ' + pag + ' terminada');
                            /*if(json['paginas'] == pag || json['paginas'] == null || json['paginas'] == undefined){
                             DBUpdated(tbl);
                             }*/
                            if (retry) {
                                count++;
                                DBUpdated();
                            }
                            else {
                                tblUpdated(tbl);
                            }
                        });
                    });

                    console.log('populateTable - ok1: ' + tbl + ' - pag: ' + pag + ' - ' + ok1++);
                }
                else {
                    db.transaction(function (tx) {
                        var q = 'INSERT INTO ' + tbl + ' ' + fieldsQuery + fieldsQuery2;
                        $.each(json['data'], function (i, item) {
                            var values = [];
                            for (var i = 0; i < keys.length; i++) {
                                values.push(item[keys[i]]);
                            }
                            tx.executeSql(q, values);
                        });
                    }, function () {
                        console.log('Error en: Tbl ' + tbl + ' pag ' + pag);
                    }, function () {
                        //console.log('Tbl ' + tbl + ' pag ' + pag + ' terminada');
                        /*if(json['paginas'] == pag || json['paginas'] == null || json['paginas'] == undefined){
                         DBUpdated(tbl);
                         }*/
                        if (retry) {
                            count++;
                            DBUpdated();
                        }
                        else {
                            tblUpdated(tbl);
                        }
                    });
                    console.log('populateTable - ok2: ' + tbl + ' - pag: ' + pag + ' - ' + ok2++);
                }
                /*
                 if(json['paginas'] > pag){
                 //populateTable(tbl, token, fecha, pag + 1);
                 currConns--;
                 checkConnections(null, null, null, null, null);
                 //checkConnections(tbl, token, fecha, pag + 1);
                 }*/
            }
            else {
                //DBUpdated(tbl);
                count++;
                DBUpdated();

                console.log('populateTable - ok3: ' + tbl + ' - pag: ' + pag + ' - ' + ok3++);
            }
        }
    });
}

var count = 0;
var numTblsUpdated = 0;
//var txtTblerrors = '';
var tblsWithErrors = {};
var flagErrors = false;
function DBUpdated(tbl) {
    //console.log(count);
    //console.log(tbl);
    if (count >= numTblsUpdated) {
        console.log("finished updating");
        if (flagErrors) {
            var txtTblErrors = '';
            for (var k in tblsWithErrors) {
                txtTblErrors += k + '(' + tblsWithErrors[k] + '), ';
            }
            tblsWithErrors = {};
            count = 0;
            numTblsUpdated = 0;
            flagErrors = false;
            $('#loader').hide();
            var r = confirm('La(s) tabla(s) ' + txtTblErrors + 'no han podido ser actualizadas correctamente. ¿Desea intentar cargarlas nuevamente?');
            if (r) {
                retryConnections();
            }
            return;
        }
        else {
            db.close();
            var d = new Date();
            localStorage.setItem('lastUpdate', d.yyyymmdd());
            d.setDate(d.getDate() + 45);
            var obj = JSON.parse(localStorage.getItem('datosAgente'));
            obj['fechaLimiteBD'] = d.getTime();
            localStorage.setItem('datosAgente', JSON.stringify(obj));
            tblsWithErrors = {};
            count = 0;
            numTblsUpdated = 0;
            flagErrors = false;
            $('#loader').hide();
            var href = location.href;
            //console.log("href = " + href);
            var index = href.indexOf('busqueda.html');
            //console.log("indexof = " + index);
            if (index >= 0) {
                console.log("estamos en busqueda.html");
                location.reload();
            }
            else {
                console.log("estamos en login.html");
                location.replace('busqueda.html');
            }
        }
    }
}

Date.prototype.yyyymmdd = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]); // padding
};

function deleteDB() {
    localStorage.removeItem('datosAgente');

    localStorage.removeItem('lastUpdate');

    localStorage.removeItem("com.kc.idusuario");
    localStorage.removeItem("com.kc.idusuario.pwd");

    db = sqlitePlugin.deleteDatabase({name: 'kc.db', iosDatabaseLocation: 'default'});
    console.log("db deleted");
}