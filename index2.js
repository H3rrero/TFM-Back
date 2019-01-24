let express = require('express');
let cors = require('cors');
let app = express();
let bodyParser = require('body-parser');
let place = require("./users.js").default;
let local = require("./localBusiness.js");
let js2xmlparser = require("js2xmlparser");

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.listen(3000, function () {

});
let corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

let places = [new place(0, "place 1", 'omedines nº18', '60', '678956436')
  , new place(1, "place 2", 'ciaño nº18', '66', '789956436')];
let localBusiness = [new local(0, "local 1", 'omedines nº18', '60', '678956436', '12', '24', 'restaurant@ht.es')
  , new local(1, "local 2", 'omedines nº18', '60', '678956436', '12', '24', 'restaurant@ht.es')];


//Get basico con la información del servidor
app.get('/', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.sendFile('index.html', { root: __dirname })
});

//Get que devuelve todos los elementos de una entidad
app.get('/:entidad', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  let type = req.headers['accept'];
  changeHeaders(type, res);
  let entidad = req.params.entidad;
  if (entidad == 'places') {
    sendEntity(type, res, places);
  } else if (entidad == 'local')
    sendEntity(type, res, localBusiness);
  else
    res.send("Seleccione una entidad valida");
});

//Get que devuelve una entidad en concreto
app.get('/:entidad/:id', function (req, res) {
  let entidad = req.params.entidad;
  let id = req.params.id;
  let type = req.headers['accept'];
  changeHeaders(type, res);
  if (entidad == 'places')
    places.forEach(function (element, i, plac) {
      if (element.id == id)
        sendEntity(type, res, element);
      else if (i == plac.length - 1)
        res.send("Seleccione un id valido");
    });
  else if (entidad == 'local')
    localBusiness.forEach(function (element, i, local) {
      if (element.id == id)
        sendEntity(type, res, element);
      else if (i == local.length - 1)
        res.send("Seleccione un id valido");
    });
  else
    res.send("Seleccione una entidad valida");
});

//Delete que elimina una entidad en concreto
app.delete('/:entidad/:id', function (req, res) {
  let entidad = req.params.entidad;
  let id = req.params.id;
  if (entidad == 'places')
    places.forEach(function (element, i, plac) {
      if (element.id == id) {
        res.send(`El elemento con identificador ${element.id} ha sido eliminado`);
        plac.splice(i, 1);
      }
      else if (i == plac.length - 1)
        res.send("Seleccione un id valido");
    });
  else if (entidad == 'local')
    localBusiness.forEach(function (element, i, local) {
      if (element.id == id) {
        res.send(`El elemento con identificador ${element.id} ha sido eliminado`);
        local.splice(i, 1);

      }
      else if (i == local.length - 1)
        res.send("Seleccione un id valido");
    });
  else
    res.send("Seleccione una entidad valida");
});

//Post que introduce una nueva entidad 
app.post('/:entidad', function (req, res) {
  let entidad = req.params.entidad;
  let type = req.headers['accept'];
  changeHeaders(type, res);
  if (entidad == 'places') {
    let pl = new place(places.length, req.body.name, req.body.address, req.body.maximumAttendeeCapacity, req.body.telephone);
    if (pl.validar()) {
      places.push(pl);
      sendEntity(type, res, pl);
    }
    else {
      res.send({ estado: "campos no validos" });
    }
  }
  else if (entidad == 'local') {

    let lc = new local(localBusiness.length, req.body.name, req.body.address, req.body.maximumAttendeeCapacity, req.body.telephone
      , req.body.openingHour, req.body.closeHour, req.body.email);
    if (lc.validar()) {
      localBusiness.push(lc);
      sendEntity(type, res, lc);
    }
    else {
      res.send({ estado: "campos no validos" });
    }
  }
  else
    res.send({ estado: "entidad no valida" });
});

//Put que modifica una entidad
app.put('/:entidad/:id', function (req, res) {
  let entidad = req.params.entidad;
  let id = req.params.id;
  let type = req.headers['accept'];
  changeHeaders(type, res);
  if (entidad == 'places') {
    places.forEach(function (element, i, plac) {
      if (element.id == id) {
        let pl = new place(element.id, req.body.name, req.body.address, req.body.maximumAttendeeCapacity, req.body.telephone);
        if (pl.validar()) {
          plac[i] = pl;
          return sendEntity(type, res, plac[i]);
        } else {
          res.send({ estado: "campos no validos" });
        }
      }
      else if (i == plac.length - 1)
        return res.send({ estado: "seleccione un id valido" });
    });
  }
  else if (entidad == 'local') {
    localBusiness.forEach(function (element, i, loc) {
      if (element.id == id) {
        let lc = new local(element.id, req.body.name, req.body.address, req.body.maximumAttendeeCapacity, req.body.telephone
          , req.body.openingHour, req.body.closeHour, req.body.email);
        if (lc.validar()) {
          loc[i] = lc;
          return sendEntity(type, res, loc[i]);
        } else {
          res.send({ estado: "campos no validos" });
        }
      }
      else if (i == local.length - 1)
        return res.send({ estado: "seleccione un id valido" });
    });
  }
  else
    return res.send({ estado: "seleccione una entidad valida" });
});

//Cambia el content type de la respuesta en funcion de la cabecera accept del cliente
function changeHeaders(type, res) {
  if (type == "application/xml")
    res.setHeader("Content-Type", "application/xml");
  else if (type == "application/json")
    res.setHeader("Content-Type", "application/json");
  else
    res.setHeader("Content-Type", "application/json");
}

//Devuelve la entidad en json o xml dependiendo de la cabecera accept del cliente
function sendEntity(type, res, entidad) {
  if (type == "application/xml")
    return res.send(js2xmlparser.parse("places", entidad));
  else if (type == "application/json")
    return res.send(entidad);
  else
    return res.send(entidad);
}