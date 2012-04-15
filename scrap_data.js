var http = require('http');

function getNextMatchData(){

    var data = 5;
    var request = require('request');
    request('http://www.franjeado.com/stats.php', function (error, response, body) {
        if (!error && response.statusCode == 200) {
        //console.log(body) // Print the google web page.
            data = body;
            res.write(data);
        }
    })
    var json_data = {}; //$(data).text();
                
     /*         
    json_data["partido"] = doc.html.body.div.table.tr[1].td.table.tr.td.table[0].tr.td[1].p.getText().trim();
    json_data["equipo_uno"] = doc.html.body.div.table.tr[1].td.table.tr.td.table[0].tr.td[1].div.table.tr[0].td.div.table.tr.td[1].div.getText().trim();
    json_data["equipo_dos"] = doc.html.body.div.table.tr[1].td.table.tr.td.table[0].tr.td[1].div.table.tr[0].td.div.table.tr.td[3].div.getText().trim();  
    json_data["estadio"] = doc.html.body.div.table.tr[1].td.table.tr.td.table[0].tr.td[1].div.table.tr[2].td[0].div.getText().trim();
    json_data["fecha"] = doc.html.body.div.table.tr[1].td.table.tr.td.table[0].tr.td[1].div.table.tr[2].td[1].div.getText().trim();
    json_data["hora"] = doc.html.body.div.table.tr[1].td.table.tr.td.table[0].tr.td[1].div.table.tr[2].td[2].div.getText().trim();
    json_data["entradas"] = doc.html.body.div.table.tr[1].td.table.tr.td.table[0].tr.td[1].div.table.tr[4].td[0].div.getText().trim();
    json_data["arbitro"] = doc.html.body.div.table.tr[1].td.table.tr.td.table[0].tr.td[1].div.table.tr[4].td[1].div.getText().trim();
    */

    //return json_data;
    return data;

}

var request = require('request');
var $$ = require('jquery');
var jsdom = require('jsdom');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});

    request('http://www.franjeado.com/stats.php', function (e, r, body) {
        if (!e && r.statusCode == 200) {
            jsdom.env({
                html: 'http://www.franjeado.com/stats.php',
                scripts: [
                    'http://code.jquery.com/jquery-1.5.min.js'
                ],
                done: function(errors, window) {
                    var $ = window.$;
                    var json_data = {};
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
                    res.end(JSON.stringify(json_data));
                }
            });

        } else {
            var json_data = {"partido": "--",
                             "equipo_uno": {"nombre": "--", 
                                            "icono": ""},
                             "equipo_dos": {"nombre": "--", 
                                            "icono": ""},
                             "estadio": "--",
                             "fecha": "--",
                             "hora": "--",
                             "entradas": "--",
                             "arbitro": "--"};
            res.end(JSON.stringify(json_data));
        }

    });

}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
