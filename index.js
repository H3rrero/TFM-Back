let express = require('express');
let cors = require('cors');
let app = express();
let bodyParser = require('body-parser');
const usuario = require('./entities/usuarios');
const phase = require('./entities/phases');
const task = require('./entities/tasks');
const project = require('./entities/projects');
const state = require('./entities/states');
var jwt = require('jsonwebtoken')

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//process.env.PORT
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

let corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

////////////////////Datos de prueba hasta que se haga BBDD////////////////////////
let projects =[new project(0,'proyecto prueba','descripcion de prueba',600,false),
              new project(1,'proyecto prueba 2','descripcion de prueba 2',600,false)];
let states = [new state(0,'Backlog')
              ,new state(1,'Desarrollo')
              ,new state(2,'Pruebas')
              ,new state(3,'Pruebas Finalizadas')
              ,new state(4,'Produccion')
              ,new state(5,'Terminada')];
let users = [new usuario(0,0, "admin",'admin', 'Alejandro', 'Fernandez','admin',"",false)
  , new usuario(1,0, "man1",'man1', 'Pedro', 'Picapiedra','manager',"",false)
  , new usuario(2,0, "user2",'user2', 'Juan', 'Fernandez','user',"",true)
  , new usuario(3,0, "user3",'user3', 'Pelayo', 'Iglesias','user',"",false)
  , new usuario(4,0, "user4",'user4', 'Amir', 'Jimenez','user',"",false)
  , new usuario(5,0, "user5",'user5', 'Lara', 'Casasola','user',"",false)
  , new usuario(6,0, "user6",'user6', 'Maria', 'Garcia','user',"",false)
  , new usuario(7,0, "user7",'user7', 'Jose', 'Herrero','user',"",false)
  , new usuario(8,0, "user8",'user8', 'Laura', 'Perez','user',"",false)
  ,new usuario(9,1, "user9",'user9', 'Pedro', 'Garcia','user',"",false)
  , new usuario(10,1, "user10",'user10', 'Maria', 'Herrero','user',"",false)
  , new usuario(11,1, "user11",'user11', 'Juan', 'Perez','user',"",false)];
//let userp = new user(8,0, "user8",'user8', 'Laura', 'Perez','user',"",false);
                    //id, title,assigned,description,dateI,dateF,phase,hours,planHours,coments,userId,state,deleted
//let taskp = new task(0, '','', '', '','',0,'0','0',[],0,'',false);
let phases = [new phase(0,0, "Sprint 1",'2019-01-01T00:00:00.000Z','2019-01-16T00:00:00.000Z','1.95',71,60,42)
            ,new phase(1,0, "Sprint 2",'2019-01-17T00:00:00.000Z','2019-01-30T00:00:00.000Z','0.40',77,66,45)
            ,new phase(2, 0,"Sprint 3",'2019-02-01T00:00:00.000Z','2019-03-06T00:00:00.000Z','0.12',15,60,12) 
            ,new phase(3, 0,"Sprint 4",'2019-03-07T00:00:00.000Z','2019-04-29T00:00:00.000Z','0.12',0,60,0)]; 
                    //id, title,              assigned,                      description,             dateI,                      dateF,                    phase,hours,planHours,coments,                                       userId,state,deleted
let tasks = [new task(0, 'Titulo de prueba 1','Alejandro Fernandez Herrero', 'Descripcion de prueba', '2019-02-01T00:00:00.000Z','2019-01-02T00:00:00.000Z',0,'10','6',["Comentario de prueba 1","comentario de prueba 2"],0,'Terminada',false,false)
            ,new task(1, 'Titulo de prueba 2','Pedro picapiedra', 'Descripcion de prueba','2019-01-01T00:00:00.000Z','2019-01-04T00:00:00.000Z',0,'3','6',["Comentario de prueba 1","comentario de prueba 2"],1,'Terminada',false,false)
            ,new task(2, 'Titulo de prueba 3','Pedro picapiedra', 'Descripcion de prueba', '2019-03-01T00:00:00.000Z','2019-01-07T00:00:00.000Z',0,'12','6',["Comentario de prueba 1","comentario de prueba 2"],1,'Terminada',false,false)
            ,new task(3, 'Titulo de prueba 4','Pedro picapiedra', 'Descripcion de prueba', '2019-03-04T00:00:00.000Z','2019-01-10T00:00:00.000Z',0,'2','6',["Comentario de prueba 1","comentario de prueba 2"],1,'Terminada',false,false)
            ,new task(4, 'Chat fase 2','Juan Fernandez', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-01-15T00:00:00.000Z',0,'6','6',["Comentario de prueba 1","comentario de prueba 2"],2,'Terminada',false,false)
            ,new task(5, 'Documentar codigo','Juan Fernandez', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-01-16T00:00:00.000Z',0,'6','6',["Comentario de prueba 1","comentario de prueba 2"],2,'Terminada',false,false)
            ,new task(6, 'Recubrimientos metodos','Juan Fernandez', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-01-08T00:00:00.000Z',0,'12','6',["Comentario de prueba 1","comentario de prueba 2"],2,'Terminada',false,false)
            ,new task(7, 'Hacer pl de nueva fase','Alejandro Fernandez', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-01-08T00:00:00.000Z',0,'9','6',["Comentario de prueba 1","comentario de prueba 2"],0,'Terminada',false,false)
            ,new task(8, 'Maquetacion nueva fase','Pelayo Iglesias', 'Descripcion de prueba','2019-01-01T00:00:00.000Z','2019-01-07T00:00:00.000Z',0,'5','6',["Comentario de prueba 1","comentario de prueba 2"],3,'Terminada',false,false)
            ,new task(9, 'Hacer curso vuejs','Pelayo Iglesias', 'Descripcion de prueba', '2019-03-01T00:00:00.000Z','2019-01-15T00:00:00.000Z',0,'6','6',["Comentario de prueba 1","comentario de prueba 2"],3,'Terminada',false,false)
            ,new task(10, 'Cambiar maquetacion nueva fase','Pelayo Iglesias', 'Descripcion de prueba', '2019-03-04T00:00:00.000Z','2019-01-18T00:00:00.000Z',1,'6','6',["Comentario de prueba 1","comentario de prueba 2"],3,'Terminada',false,false)
            ,new task(11, 'Presentacion nueva fase','Amir Jimenez', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-01-19T00:00:00.000Z',1,'10','6',["Comentario de prueba 1","comentario de prueba 2"],4,'Terminada',false,false)
            ,new task(12, 'Cambiar documentacion','Amir Jimenez', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-01-19T00:00:00.000Z',1,'9','6',["Comentario de prueba 1","comentario de prueba 2"],4,'Terminada',false,false)
            ,new task(13, 'Pruebas soapui','Amir Jimenez', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-01-18T00:00:00.000Z',1,'2','6',["Comenario de prueba 1","comentario de prueba 2"],4,'Terminada',false,false)
            ,new task(14, 'Hacer documentacion tecnica','Amir Jimenez', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-01-22T00:00:00.000Z',1,'4','6',["Comentario de prueba 1","comentario de prueba 2"],4,'Terminada',false,false)
            ,new task(15, 'Preparar reunion con cliente','Amir Jimenez', 'Descripcion de prueba', '2019-03-04T00:00:00.000Z','2019-01-23T00:00:00.000Z',1,'5','6',["Comentario de prueba 1","comentario de prueba 2"],4,'Terminada',false,false)
            ,new task(16, 'Documento fase 3','Lara Casasola', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-01-23T00:00:00.000Z',1,'12','6',["Comentario de prueba 1","comentario de prueba 2"],5,'Terminada',false,false)
            ,new task(17, 'Implementar interfaz chat','Lara Casasola', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-01-28T00:00:00.000Z',1,'3','6',["Comentario de prueba 1","comentario de prueba 2"],5,'Terminada',false,false)
            ,new task(18, 'Nueva pantalla','Maria Garcia', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-01-28T00:00:00.000Z',1,'6','6',["Comentario de prueba 1","comentario de prueba 2"],6,'Terminada',false,false)
            ,new task(19, 'Documentacion nueva pantalla','Maria Garcia', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-01-30T00:00:00.000Z',1,'10','6',["Comentario de prueba 1","comentario de prueba 2"],6,'Terminada',false,false)
           ,new task(20, 'Titulo de prueba 5','Jose Herrero', 'Descripcion de prueba', '2019-03-04T00:00:00.000Z','2019-01-30T00:00:00.000Z',1,'10','6',["Comentario de prueba 1","comentario de prueba 2"],7,'Terminada',false,false)
           ,new task(21, 'Documento fase 4','', 'Descripcion de prueba', '2019-02-011T00:00:00.000Z','2019-02-14T00:00:00.000Z',2,'12','6',["Comentario de prueba 1","comentario de prueba 2"],1,'Terminada',false,false)
           ,new task(22, 'Implementar interfaz juegos','', 'Descripcion de prueba', '2019-02-021T00:00:00.000Z','2019-02-23T00:00:00.000Z',2,'3','6',["Comentario de prueba 1","comentario de prueba 2"],1,'Terminada',false,false)
           ,new task(23, 'Nueva pantalla juegos','', 'Descripcion de prueba', '2019-03-01T00:00:00.000Z','2019-03-03T00:00:00.000Z',2,'6','6',["Comentario de prueba 1","comentario de prueba 2"],1,'Pruebas',false,false)
           ,new task(24, 'Documentacion genral','', 'Descripcion de prueba', '2019-03-02T00:00:00.000Z','2019-03-05T00:00:00.000Z',2,'10','6',["Comentario de prueba 1","comentario de prueba 2"],1,'Pruebas',false,false)
           ,new task(25, 'Redaccion de requisitos','', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-03-13T00:00:00.000Z',-1,'6','6',["Comentario de prueba 1","comentario de prueba 2"],-1,'sin asignar',false,false)
           ,new task(26, 'Documentacion requisitos','', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-03-13T00:00:00.000Z',-1,'10','6',["Comentario de prueba 1","comentario de prueba 2"],-1,'sin asignar',false,false)
           ,new task(27, 'Redaccion de requisitos','Juan Fernandez', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-03-24T00:00:00.000Z',3,'6','6',["Comentario de prueba 1","comentario de prueba 2"],2,'Produccion',false,false)
           ,new task(28, 'Documentacion requisitos','Juan Fernandez', 'Descripcion de prueba', '2019-03-011T00:00:00.000Z','2019-03-24T00:00:00.000Z',3,'10','6',["Comentario de prueba 1","comentario de prueba 2"],2,'Produccion',false,false)]; 

  app.post('/login', (req, res) => {
    var username = req.body.username
    var password = req.body.password
    users.forEach(element => {
      if( (username === element.username && password === element.password)){
        var tokenData = {
          username: username
          // ANY DATA
        }
       
        var token = jwt.sign(tokenData, 'Secret Password', {
           expiresIn: 60 * 60 * 24 // expires in 24 hours
        })
        element.token = token;
        res.send(element)
      }
     
    });
    res.status(401).send({
      error: 'usuario o contraseña inválidos'
    })
    return
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
        else if(entidad == 'tasks'){
          return res.send(tasks);}
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
            return res.send(users[id]);
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
app.get('/tasks/tasksByPhase/:id', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  let id = req.params.id;
  var token = req.headers['authorization'];
  let tasksP = [];
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

         tasks.forEach(function (element, i, plac) {
            if (element.phase == id) {
              tasksP.push(plac[i]);
            }
            if(plac.length == i+1)
            {
              tasksP.sort(function(a,b){
                return new Date(a.dateF) - new Date(b.dateF);
              });
              return  res.send(tasksP);
            }
          });
         
    }
  })
});
  //Put que modifica una entidad
  app.get('/tasks/usersByProject/:id', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    let id = req.params.id;
    var token = req.headers['authorization'];
    let usersP = [];
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
  
           users.forEach(function (element, i, plac) {
              if (element.project == id) {
                usersP.push(plac[i]);
              }
              if(plac.length == i+1)
              {
                return  res.send(usersP);
              }
            });
           
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
              let pl = new task(element.id, req.body.title,req.body.assigned,req.body.description,req.body.dateI,req.body.dateF,req.body.phase,req.body.hours,req.body.planHours,req.body.coments,req.body.userId,req.body.state,req.body.deleted,req.body.finish);
              if(pl.validar()){
                let newHours = req.body.hours - plac[i].hours;
                plac[i] = pl;
                enviada = true;
                updatePhases(req.body.phase,newHours,element.state,req.body.state,element.planHours,element.phase,false);
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
        }else if (entidad == 'projects') {
          projects.forEach(function (element, i, plac) {
            if (element.id == id) {
              let pl = new project(element.id,req.body.name,req.body.description,req.body.planHours,req.body.deleted);
              plac[i] = pl;
              enviada = true;
              return  res.send(plac[i]);
            }
            else if (i == plac.length - 1 && !enviada)
              return res.send({ estado: "seleccione un id valido" });
          });
        } else if (entidad == 'users') {
          users.forEach(function (element, i, plac) {
            if (element.id == id) {
              
              let userp = new usuario(0,0, "admin",'admin', 'Alejandro', 'Fernandez','admin',"",false);
              userp.id = element.id;
              userp.username = req.body.username;
              userp.password = req.body.password;
              userp.firstname = req.body.firstname;
              userp.lastname = req.body.lastname;
              userp.token = req.body.token;
              userp.rol = req.body.rol;
              userp.projectId = req.body.projectId;
              userp.deleted = req.body.deleted; 
              plac[i] = userp;
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
         let userp = new usuario(0,0, "admin",'admin', 'Alejandro', 'Fernandez','admin',"",false);
          userp.id = users.length;
          userp.username = req.body.username;
          userp.password = req.body.password;
          userp.firstname = req.body.firstname;
          userp.lastname = req.body.lastname;
          userp.token = req.body.token;
          userp.rol = req.body.rol;
          userp.projectId = req.body.projectId;
          userp.deleted = req.body.deleted;
          console.log(" req.body.projectId;")
          console.log( req.body.projectId);
          users.push(userp);
          res.send(userp);
        }else if (entidad == 'tasks') {
          let taskp = new task(0, '','', '', '','',0,'0','0',[],0,'',false);
          
          taskp.id = tasks.length;

          taskp.title = req.body.title;
          taskp.assigned = req.body.assigned;
          taskp.description = req.body.description;
          taskp.dateI = req.body.dateI;
          taskp.dateF = req.body.dateF;
          taskp.phase = -1;
          taskp.hours = 0;
          taskp.planHours = req.body.planHours;
          taskp.coments = req.body.coments;
          taskp.userId = req.body.userId;
          taskp.state = req.body.state;
          taskp.deleted = false;
          taskp.finish = false;
          if(taskp.validar()){
            tasks.push(taskp);
            res.send(tasks);
          }else{
            res.send({ estado: "falta algun campo obligatorio" });
          }
        }else if (entidad == 'phase') {
          let phasep = new phase(0,0, "",'','','',0,0,0);
          
          phasep.id = phases.length;
          phasep.name = req.body.name;
          phasep.proyectId = req.body.proyectId;
          phasep.dateI = req.body.dateI;
          phasep.dateF = req.body.dateF;
          phasep.completed = req.body.completed;
          phasep.hours = req.body.hours;
          phasep.totalHours = req.body.totalHours;
          phasep.completedHours = req.body.completedHours;

          if(phasep.validar()){
            phases.push(phasep);
            res.send(phases);
          }else{
            res.send({ estado: "falta algun campo obligatorio" });
          }
        }else if (entidad == 'project') {
          let projectp = new project(0,'','',0,false);
          
          projectp.id = projects.length;
          projectp.name = req.body.name;
          projectp.description = req.body.description;
          projectp.planHours = req.body.planHours;
          projectp.deleted = req.body.deleted;

          if(projectp.validar()){
            projects.push(projectp);
            res.send(projects);
          }else{
            res.send({ estado: "falta algun campo obligatorio" });
          }
        }
        else
          res.send({ estado: "entidad no valida" });
    }
  })


});
function updatePhases(idPhase,hours,state,newState,planHours,newPhase,isNew) {
  for (let index = 0; index < phases.length; index++) {
    const element = phases[index];
    if(idPhase == newPhase){
    if (element.id == idPhase){
      if(isNew){
        element.totalHours = parseInt(element.totalHours) +  parseInt(hours);
        element.completed = ( parseInt(element.hours)/ parseInt(element.totalHours)).toFixed(2);
       
      }else{
        element.hours = element.hours + hours;
        element.completed = ( parseInt(element.hours)/ parseInt(element.totalHours)).toFixed(2);
     
       
      }
      if(state != 'Terminada' && newState == 'Terminada'){
        element.completedHours = parseInt(element.completedHours) + parseInt(planHours);
       
      }
      if(state == 'Terminada' && newState != 'Terminada'){
        element.completedHours =  parseInt(element.completedHours) - parseInt(planHours);
      }
    }
  }else if(element.id == idPhase){
    
    element.totalHours = parseInt(element.totalHours) + parseInt(planHours);
  }else if(element.id == newPhase){
    element.totalHours = parseInt(element.totalHours) - parseInt(planHours);
  }
  phases[index] = element;
  }
}

