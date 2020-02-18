
const http = require("http");
const fs = require("fs");

/*
fs.writeFile("index.html", "Hola mundo", () =>{
    console.log("Archivo creado");
}); */

const axios = require("axios");
const url = "https://gist.githubusercontent.com/josejbocanegra/c6c2c82a091b880d0f6062b0a90cce88/raw/9ed13fd53a144528568d1187c1d34073b36101fd/categories.json";

//Obtener la información de la url
function f(callback) {
    axios.get(url).then(
        response => {
            callback(response.data);
        }
    ).catch(error => {
        console.log(error);
    });
}

//Leer un archivo
function read(archivo, callback) {
    fs.readFile(archivo, (err, data) => {
        callback(data);
    });
}


//let = "hola";
//XMLDocument.replace("{{placeholder}}",contenido);

function crearWeb(callback) {
    http.createServer((req, res) => {
        callback(res)
        ///
    }).listen(8080);
}
//primero leemos el json
f(json => {
    //luego leemos el index
    read("index.html", html => {
        //luego leemos el item del acordeón
        read("item.html", texto => {
            //leemos la estructura de una tarjeta
            read("tarjeta.html", tarjeta => {
                //y por ultimo creamos la web
                crearWeb(res => {
                    const t = texto.toString();
                    let h = html.toString();
                    const card = tarjeta.toString();
                    let rta = "";
                    
                   
                    for (let i = 0; i < json.length; i++) {
                        let actual = json[i];
                        let nombreclase = actual.name;
                        let productos = actual.products;
                        let totaltarjetas = "";
                        let id = "collapse" + i;
                        let idheading = "heading" + i;

                        for (let j = 0; j < productos.length; j++) {
                            let producto = productos[j];
                            let nombreprod = producto.name;
                            let descripcion = producto.description;
                            let precio = producto.price;
                            let imagen = producto.image;
                            let copiatarjeta = "";
                            copiatarjeta = card;
                            copiatarjeta = copiatarjeta.replace(/{{titulo}}/g,nombreprod);
                            copiatarjeta = copiatarjeta.replace("{{texto}}",descripcion);
                            copiatarjeta = copiatarjeta.replace("{{costo}}",precio);
                            copiatarjeta = copiatarjeta.replace("{{rutaimagen}}",imagen);
                            totaltarjetas += copiatarjeta;
                            
                        }
                        let itemtarjeta = "";
                        itemtarjeta = t;
                        itemtarjeta = itemtarjeta.replace("{{tituloclase}}",nombreclase);
                        itemtarjeta = itemtarjeta.replace("{{tarjetas}}",totaltarjetas);
                        itemtarjeta = itemtarjeta.replace(/{{id}}/g,id);
                        itemtarjeta = itemtarjeta.replace(/{{idheading}}/g,idheading);

                        rta += itemtarjeta;
                        
                    }

                    h = h.replace("{{items}}",rta);
                    //console.log(h);
                    res.write(h);
                    res.end();
                });
            });
        });
    });
});
