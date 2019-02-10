let express = require('express');
let cors = require('cors');
let app = express();
let bodyParser = require('body-parser');
const user = require("./entities/users");
const phase = require('./entities/phases');
const task = require('./entities/tasks');
const project = require('./entities/projects');
var jwt = require('jsonwebtoken')

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

let corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

////////////////////Datos de prueba hasta que se haga BBDD////////////////////////
let users = [new user(0, "admin",'admin', 'Alejandro', 'Fernandez')
  , new user(1, "user1",'user1', 'Pedro', 'Picapiedra')];
let userp = new user(0, "admin",'admin', 'Alejandro', 'Fernandez');
let taskp = new task(1, 'Titulo de prueba 2','Alejandro Fernandez Herrero', 'Descripcion de prueba','2019-02-01T00:00:00.000Z','2019-02-01T00:00:00.000Z','pruebas','30',["Comentario de prueba 1","comentario de prueba 2"]);
let phases = [new phase(0, "Start prototype prueba",'2019', '0', '1','2019','0','25','0.75')
            ,new phase(1, "Develop",'2019', '0', '26','2019','1','24','0.40')
            ,new phase(2, "Prototype done",'2019', '1', '25','2019','3','25','0.12') 
          ,new phase(3, "Test prototype",'2019', '3', '27','2019','4','15','0.15')
        ,new phase(4, "Run acceptance test",'2019', '4', '16','2019','5','30','0.05')];

let tasks = [new task(0, 'Titulo de prueba 1','Alejandro Fernandez Herrero', 'Descripcion de prueba', '2019-02-01T00:00:00.000Z','2019-02-01T00:00:00.000Z','desarrollo','20',["Comentario de prueba 1","comentario de prueba 2"],0)
            ,new task(1, 'Titulo de prueba 2','Alejandro Fernandez Herrero', 'Descripcion de prueba','2019-02-01T00:00:00.000Z','2019-02-01T00:00:00.000Z','pruebas','30',["Comentario de prueba 1","comentario de prueba 2"],0)
            ,new task(2, 'Titulo de prueba 3','Pedro picapiedra', 'Descripcion de prueba', '2019-02-01T00:00:00.000Z','2019-02-01T00:00:00.000Z','pruebas finalizadas','40',["Comentario de prueba 1","comentario de prueba 2"],1)
          ,new task(3, 'Titulo de prueba 4','Pedro picapiedra', 'Descripcion de prueba', '2019-02-01T00:00:00.000Z','2019-02-01T00:00:00.000Z','produccion','50',["Comentario de prueba 1","comentario de prueba 2"],1)
        ,new task(4, 'Titulo de prueba 5','Pedro picapiedra', 'Descripcion de prueba', '2019-02-01T00:00:00.000Z','2019-02-01T00:00:00.000Z','produccion','60',["Comentario de prueba 1","comentario de prueba 2"],1)]; 

  app.post('/login', (req, res) => {
    var username = req.body.username
    var password = req.body.password
   console.log(username)
   console.log(password)
    if( !(username === 'admin' && password === 'admin')){
      res.status(401).send({
        error: 'usuario o contraseña inválidos'
      })
      return
    }
   
    var tokenData = {
      username: username
      // ANY DATA
    }
   
    var token = jwt.sign(tokenData, 'Secret Password', {
       expiresIn: 60 * 60 * 24 // expires in 24 hours
    })
    users[0].token = token;
    let user = users[0];
    console.log(user);
    res.send(user)
  })

  //Get que devuelve todos los elementos de una entidad
app.get('/:entidad', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  var token = req.headers['authorization']
  if(!token){
      res.status(401).send({
        error: "Es necesario el token de autenticación"
      })
      return
  }

  token = token.replace('Bearer ', '')

  jwt.verify(token, 'Secret Password', function(err, user) {
    if (err) {
      res.status(401).send({
        error: 'Token inválido'
      })
    } else {
        let entidad = req.params.entidad;

        if (entidad == 'users') {
          return res.send(users);
        } 
        else if (entidad == 'phases')
          return res.send(phases);
        else if(entidad == 'tasks')
          return res.send(tasks);
        else
          res.send("Seleccione una entidad valida");
    }
  })
});

//Put que modifica una entidad
app.put('/:entidad/:id', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  let id = req.params.id;
  let entidad = req.params.entidad;
  var token = req.headers['authorization'];
  let enviada = false;
  if(!token){
      res.status(401).send({
        error: "Es necesario el token de autenticación"
      })
      return
  }

  token = token.replace('Bearer ', '')

  jwt.verify(token, 'Secret Password', function(err, user) {
    if (err) {
      res.status(401).send({
        error: 'Token inválido'
      })
    } else {

        if (entidad == 'tasks') {
          tasks.forEach(function (element, i, plac) {
            console.log(element.id);
            console.log(id);
            console.log( req.body);
            if (element.id == id) {
              let pl = new task(element.id, req.body.title,req.body.assigned,req.body.description,req.body.dateI,req.body.dateF,req.body.phase,req.body.hours,req.body.coments,req.body.userId);
              console.log(pl);
              if(pl.validar()){
                plac[i] = pl;
                enviada = true;
                return  res.send(plac[i]);
              }
            }
            else if (i == plac.length - 1 && !enviada)
              return res.send({ estado: "seleccione un id valido" });
          });
        } 
        else
          res.send("Seleccione una entidad valida");
    }
  })
});

//Post que introduce una nueva entidad 
app.post('/:entidad/register', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  var token = req.headers['authorization']
  if(!token){
      res.status(401).send({
        error: "Es necesario el token de autenticación"
      })
      return
  }

  token = token.replace('Bearer ', '')

  jwt.verify(token, 'Secret Password', function(err, user) {
    if (err) {
      res.status(401).send({
        error: 'Token inválido'
      })
    } else {
        let entidad = req.params.entidad;
        if (entidad == 'users') {
          userp.id = users.length;
          userp.username = req.body.username;
          userp.password = req.body.password;
          userp.firstname = req.body.firstname;
          userp.lastname = req.body.lastname;
          users.push(userp);
          console.log("users: "+ users)
          res.send(userp);
        }
        else
          res.send({ estado: "entidad no valida" });
    }
  })


});

