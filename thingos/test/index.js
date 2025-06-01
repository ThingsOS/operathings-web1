function check() {

    var url = document.getElementById("url").value;
    var meth = document.getElementById("meth").value;
    var json = document.getElementById("Body").value;
    var reps = document.getElementById("responses");

    var clearJSON;
    if(json) {
        try {
            clearJSON = beautyBody();
            document.getElementById("Body").value = clearJSON;
        }
        catch(e) {
            console.error(e);
            alert("JSON FORMATO INCORRECTO.");
            return;
        }
    }

    var reps = document.getElementById("responses");
    reps.getElementsByClassName("resbody")[0].innerHTML  = "Procesando...";
    var heads = {};
    var headers = document.getElementsByTagName("aheader");

    for(var i = 0; i < headers.length; i++) {
        var key = headers[i].getElementsByClassName("key")[0].value;
        var value = headers[i].getElementsByClassName("value")[0].value;
        if(key != "" && typeof key != "undefined") {
            heads[key] = value;
        }
    }

    var time = 0;
    var timeOut = setInterval(function() {time++}, 1)

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

        var reps = document.getElementById("responses");
        var cgs = document.getElementById("changes");
        var state = xhttp.readyState;
        var status = xhttp.statusText;
        var stext = estados[state];

        var nexo = `Estado: ${state} - ${stext} <b>${time} ms</b> <br> Reply: ${xhttp.status} ${status}`;

        //cgs.innerHTML = '';
        //cgs.setAttribute('status', false);

        var ele = reps.appendChild(reply);

        ele.getElementsByClassName("status")[0].innerHTML = nexo;

        if (xhttp.readyState === 4) {

            var head_ = xhttp.getAllResponseHeaders();
            console.log(head_);
            var body_ = xhttp.responseText;

            /* Si el resultado es JSON, intenta mostrar el código con separaciones. */
            try {
                var bobj = JSON.parse(body_);
                body_ = JSON.stringify(bobj);
                body_ = beautyfyJSON_HTML(body_);
                cgs.innerHTML = '<ul> La respuesta ha sido modificada para una vista JSON comprenisble. Haga click aquí para ver la versión de texto original. <ul>'
            }
            catch(e) {
                console.log('Cuerpo no transformado a json.')
            }

            //heads_ = getRes
            //http.

            ele.getElementsByClassName("resbody")[0].innerHTML = "<b>" + head_ + "</b> <br><br>" +body_;

            clearTimeout(timeOut);

        }
    }

    console.log(meth + " " + url);
    console.log(heads);

    xhttp.open(meth, url, true);
    xhttp.withCredentials = true;
    for(key in heads) {
        xhttp.setRequestHeader(key, heads[key]);
    }

    xhttp.send(json);
}

var header = null;
var header_n = 0;
var reply = null;

function _beautyfyJSON_HTML(jsonStr) {

    if(typeof jsonStr == 'object') {
        jsonStr = JSON.stringify(jsonStr);
    }

    regeStr = '', // A EMPTY STRING TO EVENTUALLY HOLD THE FORMATTED STRINGIFIED OBJECT
    f = {
            brace: 0
        }; // AN OBJECT FOR TRACKING INCREMENTS/DECREMENTS,
           // IN PARTICULAR CURLY BRACES (OTHER PROPERTIES COULD BE ADDED)

    regeStr = jsonStr.replace(/({|}[,]*|[^{}:]+:[^{}:,]*[,{]*)/g, function (m, p1) {
    var rtnFn = function() {
            return '<div style="text-indent: ' + (f['brace'] * 20) + 'px;">' + p1 + '</div>';
        },
        rtnStr = 0;
        if (p1.lastIndexOf('{') === (p1.length - 1)) {
            rtnStr = rtnFn();
            f['brace'] += 1;
        } else if (p1.indexOf('}') === 0) {
             f['brace'] -= 1;
            rtnStr = rtnFn();
        } else {
            rtnStr = rtnFn();
        }
        return rtnStr;
    });

    return regeStr;

}
function beautyfyJSON_HTML(jsonStr) {
    var o = JSON.parse(jsonStr);
    var s = JSON.stringify(o, null, 3);
    return '<pre>' +  s  + '</pre>';
}
function beautyfyJSON(stringJSON) {
    var obj = JSON.parse(stringJSON);
    return JSON.stringify(obj, null, 3);
}

function goOn() {
    var headers = document.getElementsByTagName("aheader");
    header_n = headers.length;
    header = "<aheader>" + headers[0].innerHTML + "</aheader>";
    reply = document.getElementsByTagName("REPLY")[0];
}

var estados = [];
estados.push("UNINITIALIZED");
estados.push("LOADING");
estados.push("LOADED");
estados.push("INTERACTIVE");
estados.push("COMPLETED");

function addHead() {

    document.getElementsByTagName("headers")[0].innerHTML += header;

}

function delHead() {

}

function beautyBody() {
    const json = document.getElementById("Body").value;
    const str = beautyfyJSON(json);
    document.getElementById("Body").value = str;
    return str;
}

function save() {
    const url = document.getElementById("url").value;
    const json = beautyBody();
    localStorage.setItem(url, json);
}

function loadURLprefs() {

    /*const url = document.getElementById("url").value;
    var bodyDefault = sessionStorage.getItem(url);
    if(bodyDefault) {
        document.getElementById("Body").value = bodyDefault;
    }*/

}

function load() {
    const url = document.getElementById("url").value;
    var bodyDefault = localStorage.getItem(url);
    if(bodyDefault) {
        document.getElementById("Body").value = bodyDefault;
    }
}
