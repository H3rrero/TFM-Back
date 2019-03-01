let express = require('express');
let cors = require('cors');
let app = express();
let bodyParser = require('body-parser');
const user = require("./entities/users");
const phase = require('./entities/phases');
const task = require('./entities/tasks');
const project = require('./entities/projects');
const state = require('./entities/states');
var jwt = require('jsonwebtoken')

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.listen(3000 , function () {
  console.log('Example app listening on port 3000!');
});

let corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

////////////////////Datos de prueba hasta que se haga BBDD////////////////////////
let projects =[new project(0,'proyecto prueba','descripcion de prueba',600)];
let states = [new state(0,'Backlog')
              ,new state(1,'Desarrollo')
              ,new state(2,'Pruebas')
              ,new state(3,'Pruebas Finalizadas')
              ,new state(4,'Produccion')
              ,new state(5,'Terminada')];
let users = [new user(0, "admin",'admin', 'Alejandro', 'Fernandez')
  , new user(1, "user1",'user1', 'Pedro', 'Picapiedra')
  , new user(2, "user2",'user2', 'Juan', 'Fernandez')
  , new user(3, "user3",'user3', 'Pelayo', 'Iglesias')
  , new user(4, "user4",'user4', 'Amir', 'Jimenez')
  , new user(5, "user5",'user5', 'Lara', 'Casasola')
  , new user(6, "user6",'user6', 'Maria', 'Garcia')
  , new user(7, "user7",'user7', 'Jose', 'Herrero')
  , new user(8, "user8",'user8', 'Laura', 'Perez')];
let userp = new user(0, "admin",'admin', 'Alejandro', 'Fernandez');
let taskp = new task(1, 'Titulo de prueba 2','Alejandro Fernandez Herrero', 'Descripcion de prueba','2019-02-01T00:00:00.000Z','2019-02-01T00:00:00.000Z','pruebas','30',["Comentario de prueba 1","comentario de prueba 2"]);
let phases = [new phase(0,0, "Sprint 1",'2019', '0', '1','2019','0','15','0.75',70,60,60)
            ,new phase(1,0, "Sprint 2",'2019', '0', '16','2019','1','28','0.40',110,60,45)
            ,new phase(2, 0,"Sprint 3",'2019', '1', '1','2019','1','16','0.12',0,60,0) 
          ,new phase(3,0, "Sprint 4",'2019', '1', '17','2019','2','15','0.15',0,60,0)
        ,new phase(4, 0,"Sprint 5",'2019', '2', '2','2019','2','17','0.05',0,60,0)
        ,new phase(5,0, "Sprint 6",'2019', '2', '18','2019','3','3','0.05',0,60,0)
        ,new phase(6, 0,"Sprint 7",'2019', '3', '4','2019','3','18','0.12',0,60,0) 
        ,new phase(7,0, "Sprint 8",'2019', '3', '19','2019','4','4','0.15',0,60,0)
      ,new phase(8, 0,"Sprint 9",'2019', '4', '5','2019','4','20','0.05',0,60,0)
      ,new phase(9, 0,"Sprint 10",'2019', '4', '21','2019','5','5','0.05',0,60,0)];
                    //id, title,              assigned,                      description,             dateI,                      dateF,                    phase,hours,planHours,coments,                                       userId,state,terminated
let tasks = [new task(0, 'Titulo de prueba 1','Alejandro Fernandez Herrero', 'Descripcion de prueba', '2019-02-01T00:00:00.000Z','2019-02-11T00:00:00.000Z',0,'20','20',["Comentario de prueba 1","comentario de prueba 2"],0,'Terminada',false)
            ,new task(1, 'Titulo de prueba 2','Pedro picapiedra', 'Descripcion de prueba','2019-01-01T00:00:00.000Z','2019-01-11T00:00:00.000Z',0,'50','40',["Comentario de prueba 1","comentario de prueba 2"],1,'Terminada',false)
            ,new task(2, 'Titulo de prueba 3','Pedro picapiedra', 'Descripcion de prueba', '2019-03-01T00:00:00.000Z','2019-03-03T00:00:00.000Z',1,'40','30',["Comentario de prueba 1","comentario de prueba 2"],1,'Terminada',false)
            ,new task(3, 'Titulo de prueba 4','Juan fernandez', 'Descripcion de prueba', '2019-03-04T00:00:00.000Z','2019-03-07T00:00:00.000Z',1,'40','15',["Comentario de prueba 1","comentario de prueba 2"],1,'Terminada',false)
            ,new task(4, 'Chat fase 2','Juan Fernandez', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-03-13T00:00:00.000Z',2,'0','30',["Comentario de prueba 1","comentario de prueba 2"],2,'Produccion',false)
            ,new task(5, 'Documentar codigo','Juan Fernandez', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-03-13T00:00:00.000Z',2,'0','30',["Comentario de prueba 1","comentario de prueba 2"],2,'Produccion',false)
            ,new task(6, 'Recubrimientos metodos','Juan Fernandez', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-03-13T00:00:00.000Z',3,'0','30',["Comentario de prueba 1","comentario de prueba 2"],2,'Pruebas',false)
            ,new task(7, 'Hacer pl de nueva fase','Juan Fernandez', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-03-13T00:00:00.000Z',3,'0','30',["Comentario de prueba 1","comentario de prueba 2"],2,'Desarrollo',false)
            ,new task(8, 'Maquetacion nueva fase','', 'Descripcion de prueba','2019-01-01T00:00:00.000Z','2019-01-11T00:00:00.000Z',4,'0','40',["Comentario de prueba 1","comentario de prueba 2"],-1,'sin asignar',false)
            ,new task(9, 'Hacer curso vuejs','', 'Descripcion de prueba', '2019-03-01T00:00:00.000Z','2019-03-03T00:00:00.000Z',4,'0','20',["Comentario de prueba 1","comentario de prueba 2"],-1,'sin asignar',false)
            ,new task(10, 'Cambiar maquetacion nueva fase','', 'Descripcion de prueba', '2019-03-04T00:00:00.000Z','2019-03-07T00:00:00.000Z',5,'0','30',["Comentario de prueba 1","comentario de prueba 2"],-1,'sin asignar',false)
            ,new task(11, 'Presentacion nueva fase','', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-03-13T00:00:00.000Z',5,'0','30',["Comentario de prueba 1","comentario de prueba 2"],-1,'sin asignar',false)
            ,new task(12, 'Cambiar documentacion','', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-03-13T00:00:00.000Z',6,'0','50',["Comentario de prueba 1","comentario de prueba 2"],-1,'sin asignar',false)
            ,new task(13, 'Pruebas soapui','', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-03-13T00:00:00.000Z',6,'0','10',["Comentario de prueba 1","comentario de prueba 2"],-1,'sin asignar',false)
            ,new task(14, 'Hacer documentacion tecnica','', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-03-13T00:00:00.000Z',7,'0','30',["Comentario de prueba 1","comentario de prueba 2"],-1,'sin asignar',false)
            ,new task(15, 'Preparar reunion con cliente','', 'Descripcion de prueba', '2019-03-04T00:00:00.000Z','2019-03-07T00:00:00.000Z',7,'0','30',["Comentario de prueba 1","comentario de prueba 2"],-1,'sin asignar',false)
            ,new task(16, 'Documento fase 3','', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-03-13T00:00:00.000Z',8,'0','30',["Comentario de prueba 1","comentario de prueba 2"],-1,'sin asignar',false)
            ,new task(17, 'Implementar interfaz chat','', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-03-13T00:00:00.000Z',8,'0','30',["Comentario de prueba 1","comentario de prueba 2"],-1,'sin asignar',false)
            ,new task(18, 'Nueva pantalla','', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-03-13T00:00:00.000Z',9,'0','30',["Comentario de prueba 1","comentario de prueba 2"],-1,'sin asignar',false)
            ,new task(19, 'Documentacion nueva pantalla','', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-03-13T00:00:00.000Z',9,'0','30',["Comentario de prueba 1","comentario de prueba 2"],-1,'sin asignar',false)
           ,new task(20, 'Titulo de prueba 5','Juan fernandez', 'Descripcion de prueba', '2019-03-04T00:00:00.000Z','2019-03-07T00:00:00.000Z',1,'30','15',["Comentario de prueba 1","comentario de prueba 2"],1,'Produccion',false)]; 

  app.post('/login', (req, res) => {
    var username = req.body.username
    var password = req.body.password
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
    res.send(user)
  })

  app.get('/', function (req, res) {
    res.send('APlicacion para el TFM de Alejandro Fernández Herrero');
  });
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
        else if(entidad == 'projects')
          return res.send(projects);
        else if(entidad=='states')
          return res.send(states);
        else
          res.send("Seleccione una entidad valida");
    }
  })
});

  //Get que devuelve todos los elementos de una entidad
  app.get('/:entidad/:id', function (req, res) {
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
          let id = req.params.id;
          if (entidad == 'users') {
            return res.send(users);
          } 
          else if (entidad == 'phases')
            return res.send(phases[id]);
          else if(entidad == 'tasks')
            return res.send(tasks[id]);
          else if(entidad == 'projects')
            return res.send(projects[id]);
          else if(entidad=='states')
            return res.send(states[id]);
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
            if (element.id == id) {
              let pl = new task(element.id, req.body.title,req.body.assigned,req.body.description,req.body.dateI,req.body.dateF,req.body.phase,req.body.hours,req.body.planHours,req.body.coments,req.body.userId,req.body.state,req.body.deleted);
              if(pl.validar()){
                let newHours = req.body.hours - plac[i].hours;
                plac[i] = pl;
                enviada = true;
                updatePhases(req.body.phase,newHours,element.state,req.body.state,element.planHours,false);
                return  res.send(plac[i]);
              }
            }
            else if (i == plac.length - 1 && !enviada)
              return res.send({ estado: "seleccione un id valido" });
          });
        } else if (entidad == 'phases') {
          phases.forEach(function (element, i, plac) {
            if (element.id == id) {
              let pl = new phase(element.id,req.body.proyectId,req.body.name,req.body.yeari,req.body.monthi,req.body.dayi,req.body.yearf,req.body.monthf,req.body.dayf,req.body.completed,req.body.hours,req.body.totalHours,req.body.completedHours);
              plac[i] = pl;
              enviada = true;
              return  res.send(plac[i]);
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
          res.send(userp);
        }
        else
          res.send({ estado: "entidad no valida" });
    }
  })


});
function updatePhases(idPhase,hours,state,newState,planHours,isNew) {
  for (let index = 0; index < phases.length; index++) {
    const element = phases[index];
    if (element.id == idPhase){
      if(isNew){
        element.totalHours = element.totalHours + hours;
        element.completed = (element.hours/element.totalHours).toFixed(2);
        phases[index] = element;
      }else{
        element.hours = element.hours + hours;
        element.completed = (element.hours/element.totalHours).toFixed(2);
     
        phases[index] = element;
      }
      if(state != 'Terminada' && newState == 'Terminada'){
        element.completedHours = parseInt(element.completedHours) + parseInt(planHours);
      }
      if(state == 'Terminada' && newState != 'Terminada'){
        console.log("element.completedHours");
        console.log( element.completedHours);
        console.log("planHours");
        console.log(planHours);
        element.completedHours = element.completedHours - planHours;
      }
    }
    
  }
}

