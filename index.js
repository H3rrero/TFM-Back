let express = require('express');
let cors = require('cors');
let app = express();
let bodyParser = require('body-parser');
const user = require("./users");
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


let users = [new user(0, "admin",'admin', 'Alejandro', 'Fernandez')
  , new user(1, "user1",'user1', 'Pedro', 'Picapiedra')];
let userp = new user(0, "admin",'admin', 'Alejandro', 'Fernandez');
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
        } else if (entidad == 'local')
          return res.send(users);
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

