var http = require('http');
var request = require('request');
var jsdom = require('jsdom');

var MY_APP = {};
MY_APP["json_data"] =  {"partido": "--",
                        "equipo_uno": {"nombre": "--", 
                                       "icono": ""},
                        "equipo_dos": {"nombre": "--", 
                                       "icono": ""},
                        "estadio": "--",
                        "fecha": "--",
                        "hora": "--",
                        "entradas": "--",
                        "arbitro": "--"};

function getNextMatchData(){
    request('http://www.franjeado.com/stats.php', function (e, r, body) {
        if (!e && r.statusCode == 200) {
            jsdom.env({
                html: 'http://www.franjeado.com/stats.php',
                scripts: [
                    'http://code.jquery.com/jquery-1.5.min.js'
                ],
                done: function(errors, window) {
                    var $ = window.$;
                    var json_data = MY_APP["json_data"];
                    // Eliminamos la viñeta que tiene antes del texto
                    $('body > div > table > tr:eq(1) > td > table > tr > td > table:first > tr > td:eq(1) > p > strong').remove();
                    // Eliminamos el link del enlace a la extensión OlimpiaNextMatch para Google Chrome
                    $('body > div > table > tr:eq(1) > td > table > tr > td > table:first > tr > td:eq(1) > p > span').remove();
                    $('body > div > table > tr:eq(1) > td > table > tr > td > table:first > tr > td:eq(1) > p > span').remove();
                    
                    // Siguiente partido
                    json_data["partido"]    = $('body > div > table > tr:eq(1) > td > table > tr > td > table:first > tr > td:eq(1) > p' ).text().trim();
                    // Nombre e icono del equipo local
                    json_data["equipo_uno"] = {"nombre" : 
                        $('body > div > table > tr:eq(1) > td > table > tr > td > table:first > tr > td:eq(1) > div > table > tr:first > td > div > table > tr > td:eq(1) > div ' ).text().trim() , 
                                               "icono" : 
                        $('body > div > table > tr:eq(1) > td > table > tr > td > table:first > tr > td:eq(1) > div > table > tr:first > td > div > table > tr > td:first > div > img' ).attr("src")};
                    // Nombre e icono del equipo visitante
                    json_data["equipo_dos"] = {"nombre" : 
                        $('body > div > table > tr:eq(1) > td > table > tr > td > table:first > tr > td:eq(1) > div > table > tr:first > td > div > table > tr > td:eq(3) > div ' ).text().trim() , 
                                               "icono" : 
                        $('body > div > table > tr:eq(1) > td > table > tr > td > table:first > tr > td:eq(1) > div > table > tr:first > td > div > table > tr > td:last > div > img' ).attr("src")};
                    // Estadio
                    json_data["estadio"] = $('body > div > table > tr:eq(1) > td > table > tr > td > table:first > tr > td:eq(1) > div > table > tr:eq(2) > td:first > div ' ).text().trim();
                    // Fecha
                    json_data["fecha"] = $('body > div > table > tr:eq(1) > td > table > tr > td > table:first > tr > td:eq(1) > div > table > tr:eq(2) > td:eq(1) > div ' ).text().trim();
                    // Hora
                    json_data["hora"] = $('body > div > table > tr:eq(1) > td > table > tr > td > table:first > tr > td:eq(1) > div > table > tr:eq(2) > td:eq(2) > div ' ).text().trim();
                    // Entradas
                    json_data["entradas"] = $('body > div > table > tr:eq(1) > td > table > tr > td > table:first > tr > td:eq(1) > div > table > tr:eq(4) > td:first > div ' ).text().trim();
                    // Arbitro
                    json_data["arbitro"] = $('body > div > table > tr:eq(1) > td > table > tr > td > table:first > tr > td:eq(1) > div > table > tr:eq(4) > td:eq(1) > div ' ).text().trim();

                    // Retornamos en el response los datos en formato JSON
                    //res.end(JSON.stringify(json_data));
                    console.log("json_data updated");
                }
            });
        } else { console.log("json_data NOT updated");  }

    });

}

// Actualizar datos cada 2 minutos
setInterval(getNextMatchData, 120000);

http.createServer(function (req, res) {

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
    res.writeHead(200, {'Access-Control-Allow-Headers': 'X-KEY'});
    res.end(JSON.stringify(MY_APP["json_data"]));

}).listen(process.env['app_port'] || 3000);
console.log('Server running @nodester:' + (process.env['app_port'] || 3000);
