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
const { RateLimiterRedis } = require('rate-limiter-flexible');

if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  var redis = require("redis");
  var redisClient = redis.createClient(rtg.port, rtg.hostname);
  redisClient.auth(rtg.auth.split(":")[1]);
} else {
  var redis = require("redis");
  var redisClient = redis.createClient({
    enable_offline_queue: false,
  });
}

const maxWrongAttemptsByIPperDay = 100;
const maxConsecutiveFailsByUsernameAndIP = 5;

const limiterSlowBruteByIP = new RateLimiterRedis({
  redis: redisClient,
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsByIPperDay,
  duration: 60 * 60 * 24,
  blockDuration: 5, 
});

const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterRedis({
  redis: redisClient,
  keyPrefix: 'login_fail_consecutive_username_and_ip',
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: 60*2, 
  blockDuration: 60, });

const getUsernameIPkey = (username, ip) => `${username}_${ip}`;

 function authorise(username, password) {
  for (let index = 0; index <= users.length; index++) {
    const element = users[index];

    if(index == users.length){
      return {isLoggedIn:false,exists:false};
    }
    else{
      if( (username === element.username && password === element.password)){
       var tokenData = {
          username: username
          // ANY DATA
        }
      
        var token = jwt.sign(tokenData, 'Secret Password', {
          expiresIn: 60 * 60 * 24 // expires in 24 hours
        })
        element.token = token;
        element.isLoggedIn=true;

        return element;
      }else if(username === element.username){
        return {isLoggedIn:false,exists:true};
      }
    }
  }
}

var startTime;

async function loginRoute(req, res) {
  const ipAddr = req.connection.remoteAddress;
  const usernameIPkey = getUsernameIPkey(req.body.username, ipAddr);

  const [resUsernameAndIP, resSlowByIP] = await Promise.all([
    limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
    limiterSlowBruteByIP.get(ipAddr),
  ]);
  let retrySecs = 0;
  console.log(resSlowByIP);
  // Check if IP or Username + IP is already blocked
  if (resSlowByIP !== null && resSlowByIP.remainingPoints <= 0) {
    retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
  } else if (resUsernameAndIP !== null && resUsernameAndIP.remainingPoints <= 0) {
    retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
  }
  console.log(retrySecs);
  console.log(resUsernameAndIP);
  console.log(usernameIPkey);
  if (retrySecs > 0) {
    console.log(resUsernameAndIP);
    console.log(usernameIPkey);
   /* if(resUsernameAndIP.consumedPoints == 5 && startTime == undefined){
      startTime = new Date();
    }else{
      endTime = new Date();
      var timeDiff = endTime - startTime; //in ms
      // strip the ms
      timeDiff /= 1000;

      // get seconds 
      var seconds = Math.round(timeDiff);
      if(60 * 5 <= seconds){
        await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
        startTime = undefined;
        await loginRoute(req,res);
      }
    }*/
    res.set('Retry-After', String(retrySecs));
    res.status(429).send({error:'Too Many Requests',rol:'nan'});
  } else {
    const user = authorise(req.body.username, req.body.password);
    if (!user.isLoggedIn ) {
      // Consume 1 point from limiters on wrong attempt and block if limits reached
      try {
        const promises = [limiterSlowBruteByIP.consume(ipAddr)];
        if (user.exists) {
          // Count failed attempts by Username + IP only for registered users
          promises.push(limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey));
        }
        

        await promises;
        res.status(400).send({error:'email or password is wrong',rol:'nan'});
      } catch (rlRejected) {
        if (rlRejected instanceof Error) {
          throw rlRejected;
        } else {
          res.set('Retry-After', String(Math.round(rlRejected.msBeforeNext / 1000)) || 1);
          res.status(429).send({error:'Too Many Requests',rol:'nan'});
        }
      }
    }

    if (user.isLoggedIn) {
      if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
        // Reset on successful authorisation
        await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
      }
      res.send(user);
    }
  }
}

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

redisClient.on('error', function(err) {
  console.log('Redis error: ' + err);
});

redisClient.on("ready",function () {
  console.log("Redis is ready");
});

//process.env.PORT
app.listen(process.env.PORT, function () {
  console.log('Example app listening on port 3000!'); 
});

////////////////////Datos de prueba hasta que se haga BBDD////////////////////////
let projects =[new project(0,'proyecto prueba','descripcion de prueba',600,'2019-01-01T00:00:00.000Z','2019-05-29T00:00:00.000Z',false),
              new project(1,'proyecto prueba 2','descripcion de prueba 2',600,'2019-01-01T00:00:00.000Z','2019-05-29T00:00:00.000Z',false)];
let states = [new state(0,'Backlog')
              ,new state(1,'Desarrollo')
              ,new state(2,'Pruebas')
              ,new state(3,'Pruebas Finalizadas')
              ,new state(4,'Produccion')
              ,new state(5,'Terminada')];
let users = [new usuario(0,0, "admin",'admin', 'Alejandro', 'Fernandez','admin',"",false)
  , new usuario(1,0, "man1",'man1', 'Pedro', 'Picapiedra','manager',"",false)
  , new usuario(2,0, "user2",'user2', 'Juan', 'Fernandez','user',"",false)
  , new usuario(3,0, "user3",'user3', 'Pelayo', 'Iglesias','user',"",false)
  , new usuario(4,0, "user4",'user4', 'Amir', 'Jimenez','user',"",false)
  , new usuario(5,0, "user5",'user5', 'Lara', 'Casasola','user',"",false)
  , new usuario(6,0, "user6",'user6', 'Maria', 'Garcia','user',"",false)
  , new usuario(7,0, "user7",'user7', 'Jose', 'Herrero','user',"",false)
  , new usuario(8,0, "user8",'user8', 'Laura', 'Perez','user',"",false)
  ,new usuario(9,1, "user9",'user9', 'Pedro', 'Garcia','user',"",false)
  , new usuario(10,1, "user10",'user10', 'Maria', 'Herrero','manager',"",false)
  , new usuario(11,1, "user11",'user11', 'Juan', 'Perez','user',"",false)
  ,new usuario(12,-1, "user12",'user6', 'Maria', 'Garcia','user',"",false)
  , new usuario(13,-1, "user13",'user7', 'Jose', 'Herrero','user',"",false)
  , new usuario(14,-1, "user14",'user8', 'Laura', 'Perez','user',"",false)
  ,new usuario(15,-1, "user15",'user9', 'Pedro', 'Garcia','user',"",false)
  , new usuario(16,-1, "user16",'user10', 'Maria', 'Herrero','user',"",false)
  , new usuario(17,-1, "user17",'user11', 'Juan', 'Perez','user',"",false)];
//let userp = new user(8,0, "user8",'user8', 'Laura', 'Perez','user',"",false);
                    //id, title,assigned,description,dateI,dateF,phase,hours,planHours,coments,userId,state,deleted
//let taskp = new task(0, '','', '', '','',0,'0','0',[],0,'',false);
let phases = [new phase(0,0, "Sprint 1",'2019-01-01T00:00:00.000Z','2019-01-16T00:00:00.000Z','1.95',71,60,42)
            ,new phase(1,0, "Sprint 2",'2019-01-17T00:00:00.000Z','2019-01-30T00:00:00.000Z','0.40',77,66,45)
            ,new phase(2, 0,"Sprint 3",'2019-02-01T00:00:00.000Z','2019-03-06T00:00:00.000Z','0.12',15,60,12) 
            ,new phase(3, 0,"Sprint 4",'2019-03-07T00:00:00.000Z','2019-05-29T00:00:00.000Z','0.12',0,60,0)]; 
                    //id, title,              assigned,                      description,             dateI,                      dateF,                    phase,hours,planHours,coments,                                       userId,state,deleted
let tasks = [new task(0,0, 'Titulo de prueba 1','Alejandro Fernandez Herrero', 'Descripcion de prueba', '2019-02-01T00:00:00.000Z','2019-01-02T00:00:00.000Z',0,'10','6',["Comentario de prueba 1","comentario de prueba 2"],0,'Terminada',false,false)
            ,new task(1,0, 'Titulo de prueba 2','Pedro picapiedra', 'Descripcion de prueba','2019-01-01T00:00:00.000Z','2019-01-04T00:00:00.000Z',0,'3','6',["Comentario de prueba 1","comentario de prueba 2"],1,'Terminada',false,false)
            ,new task(2,0, 'Titulo de prueba 3','Pedro picapiedra', 'Descripcion de prueba', '2019-03-01T00:00:00.000Z','2019-01-07T00:00:00.000Z',0,'12','6',["Comentario de prueba 1","comentario de prueba 2"],1,'Terminada',false,false)
            ,new task(3,0, 'Titulo de prueba 4','Pedro picapiedra', 'Descripcion de prueba', '2019-03-04T00:00:00.000Z','2019-01-10T00:00:00.000Z',0,'2','6',["Comentario de prueba 1","comentario de prueba 2"],1,'Terminada',false,false)
            ,new task(4,0, 'Chat fase 2','Juan Fernandez', 'Descripcion de prueba', '2019-03-11T00:00:00.000Z','2019-01-15T00:00:00.000Z',0,'6','6',["Comentario de prueba 1","comentario de prueba 2"],2,'Terminada',false,false)
            ,new task(5,0, 'Documentar codigo','Juan Fernandez', 'Descripcion de prueba', '2019-03-11T00:00:00.000Z','2019-01-16T00:00:00.000Z',0,'6','6',["Comentario de prueba 1","comentario de prueba 2"],2,'Terminada',false,false)
            ,new task(6,0, 'Recubrimientos metodos','Juan Fernandez', 'Descripcion de prueba', '2019-03-11T00:00:00.000Z','2019-01-08T00:00:00.000Z',0,'12','6',["Comentario de prueba 1","comentario de prueba 2"],2,'Terminada',false,false)
            ,new task(7,0, 'Hacer pl de nueva fase','Alejandro Fernandez', 'Descripcion de prueba', '2019-03-11T00:00:00.000Z','2019-01-08T00:00:00.000Z',0,'9','6',["Comentario de prueba 1","comentario de prueba 2"],0,'Terminada',false,false)
            ,new task(8,0, 'Maquetacion nueva fase','Pelayo Iglesias', 'Descripcion de prueba','2019-01-01T00:00:00.000Z','2019-01-07T00:00:00.000Z',0,'5','6',["Comentario de prueba 1","comentario de prueba 2"],3,'Terminada',false,false)
            ,new task(9,0, 'Hacer curso vuejs','Pelayo Iglesias', 'Descripcion de prueba', '2019-03-01T00:00:00.000Z','2019-01-15T00:00:00.000Z',0,'6','6',["Comentario de prueba 1","comentario de prueba 2"],3,'Terminada',false,false)
            ,new task(10,0, 'Cambiar maquetacion nueva fase','Pelayo Iglesias', 'Descripcion de prueba', '2019-03-04T00:00:00.000Z','2019-01-18T00:00:00.000Z',1,'6','6',["Comentario de prueba 1","comentario de prueba 2"],3,'Terminada',false,false)
            ,new task(11,0, 'Presentacion nueva fase','Amir Jimenez', 'Descripcion de prueba', '2019-03-11T00:00:00.000Z','2019-01-19T00:00:00.000Z',1,'10','6',["Comentario de prueba 1","comentario de prueba 2"],4,'Terminada',false,false)
            ,new task(12,0, 'Cambiar documentacion','Amir Jimenez', 'Descripcion de prueba', '2019-03-11T00:00:00.000Z','2019-01-19T00:00:00.000Z',1,'9','6',["Comentario de prueba 1","comentario de prueba 2"],4,'Terminada',false,false)
            ,new task(13,0, 'Pruebas soapui','Amir Jimenez', 'Descripcion de prueba', '2019-03-11T00:00:00.000Z','2019-01-18T00:00:00.000Z',1,'2','6',["Comenario de prueba 1","comentario de prueba 2"],4,'Terminada',false,false)
            ,new task(14,0, 'Hacer documentacion tecnica','Amir Jimenez', 'Descripcion de prueba', '2019-03-11T00:00:00.000Z','2019-01-22T00:00:00.000Z',1,'4','6',["Comentario de prueba 1","comentario de prueba 2"],4,'Terminada',false,false)
            ,new task(15,0, 'Preparar reunion con cliente','Amir Jimenez', 'Descripcion de prueba', '2019-03-04T00:00:00.000Z','2019-01-23T00:00:00.000Z',1,'5','6',["Comentario de prueba 1","comentario de prueba 2"],4,'Terminada',false,false)
            ,new task(16,0, 'Documento fase 3','Lara Casasola', 'Descripcion de prueba', '2019-03-11T00:00:00.000Z','2019-01-23T00:00:00.000Z',1,'12','6',["Comentario de prueba 1","comentario de prueba 2"],5,'Terminada',false,false)
            ,new task(17,0, 'Implementar interfaz chat','Lara Casasola', 'Descripcion de prueba', '2019-03-11T00:00:00.000Z','2019-01-28T00:00:00.000Z',1,'3','6',["Comentario de prueba 1","comentario de prueba 2"],5,'Terminada',false,false)
            ,new task(18,0, 'Nueva pantalla','Maria Garcia', 'Descripcion de prueba', '2019-03-11T00:00:00.000Z','2019-01-28T00:00:00.000Z',1,'6','6',["Comentario de prueba 1","comentario de prueba 2"],6,'Terminada',false,false)
            ,new task(19,0, 'Documentacion nueva pantalla','Maria Garcia', 'Descripcion de prueba', '2019-03-11T00:00:00.000Z','2019-01-30T00:00:00.000Z',1,'10','6',["Comentario de prueba 1","comentario de prueba 2"],6,'Terminada',false,false)
           ,new task(20,0, 'Titulo de prueba 5','Jose Herrero', 'Descripcion de prueba', '2019-03-04T00:00:00.000Z','2019-01-30T00:00:00.000Z',1,'10','6',["Comentario de prueba 1","comentario de prueba 2"],7,'Terminada',false,false)
           ,new task(21,0, 'Documento fase 4','', 'Descripcion de prueba', '2019-02-11T00:00:00.000Z','2019-02-14T00:00:00.000Z',2,'12','6',["Comentario de prueba 1","comentario de prueba 2"],1,'Terminada',false,false)
           ,new task(22,0, 'Implementar interfaz juegos','', 'Descripcion de prueba', '2019-02-21T00:00:00.000Z','2019-02-23T00:00:00.000Z',2,'3','6',["Comentario de prueba 1","comentario de prueba 2"],1,'Terminada',false,false)
           ,new task(23,0, 'Nueva pantalla juegos','', 'Descripcion de prueba', '2019-03-01T00:00:00.000Z','2019-03-03T00:00:00.000Z',2,'6','6',["Comentario de prueba 1","comentario de prueba 2"],1,'Pruebas',false,false)
           ,new task(24,0, 'Documentacion genral','', 'Descripcion de prueba', '2019-03-02T00:00:00.000Z','2019-03-05T00:00:00.000Z',2,'10','6',["Comentario de prueba 1","comentario de prueba 2"],1,'Pruebas',false,false)
           ,new task(25,0, 'Redaccion de requisitos','', 'Descripcion de prueba', '2019-03-11T00:00:00.000Z','2019-03-13T00:00:00.000Z',-1,'6','6',["Comentario de prueba 1","comentario de prueba 2"],-1,'sin asignar',false,false)
           ,new task(26,0, 'Documentacion requisitos','', 'Descripcion de prueba', '2019-03-11T00:00:00.000Z','2019-03-13T00:00:00.000Z',3,'10','6',["Comentario de prueba 1","comentario de prueba 2"],-1,'sin asignar',false,false)
           ,new task(27,0, 'Redaccion de requisitos','Juan Fernandez', 'Descripcion de prueba', '2019-03-11T00:00:00.000Z','2019-03-24T00:00:00.000Z',3,'6','6',["Comentario de prueba 1","comentario de prueba 2"],2,'Produccion',false,false)
           ,new task(28,0, 'Documentacion requisitos','Juan Fernandez', 'Descripcion de prueba', '2019-03-11T00:00:00.000Z','2019-03-24T00:00:00.000Z',3,'10','6',["Comentario de prueba 1","comentario de prueba 2"],2,'Produccion',false,false)]; 

  

  app.post('/login', async (req, res) => {
    try {
      await loginRoute(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  });

  app.get('/', function (req, res) {
    res.send('Aplicacion para el TFM de Alejandro Fernández Herrero');
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

  //delete que elimina un elemento de una entidad
  app.delete('/:entidad/:id', function (req, res) {
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
          if(entidad == 'projects'){
            console.log("he entrado");
            for( var i = 0; i < projects.length; i++){ 
              console.log( projects[i].id);
              console.log(id);
              if ( projects[i].id == id) {
                console.log("eliminado");
                projects.splice(i, 1); 
              }
           }
            return res.send(projects);
          }
          else
            res.send("Seleccione una entidad valida");
      }
    })
  });

  //get que devuleve los usuarios de un proyecto
  app.get('/usersbyproject/:id', function (req, res) {
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
          let id = req.params.id;
          let ret =[];
           console.log("he entrado");
            for( var i = 0; i < users.length; i++){ 
              console.log( users[i].id);
              console.log(id);
              if ( users[i].projectId == id) {
                console.log("eliminado");
                ret.push(users[i]);
              }
           }
            return res.send(ret);
          
      }
    })
  });

   //delete que elimina un elemento de una entidad
   app.get('/tasksbyproject/:id', function (req, res) {
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
          let id = req.params.id;
          let ret =[];
           console.log("he entrado");
            for( var i = 0; i < tasks.length; i++){ 
              console.log( tasks[i].id);
              console.log(id);
              if ( tasks[i].projectId == id) {
                console.log("eliminado");
                ret.push(tasks[i]);
              }
           }
            return res.send(ret);
          
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
  //obtiene los usuarios de un proyecto
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
            let state = req.body.state;
            if(req.body.userId != -1 && req.body.state == "sin asignar")
              state = "Backlog";
            if (element.id == id) {
              let pl = new task(element.id,req.body.projectId ,req.body.title,req.body.assigned,req.body.description,req.body.dateI,req.body.dateF,req.body.phase,req.body.hours,req.body.planHours,req.body.coments,req.body.userId,state,req.body.deleted,req.body.finish);
              if(pl.validar(req.body.dateI,req.body.dateF)){
                  let newHours = req.body.hours - plac[i].hours;
                  plac[i] = pl;
                  enviada = true;
                  updatePhases(req.body.phase,newHours,element.state,req.body.state,element.planHours,element.phase,false);
                  return  res.send(plac[i]);
              } else{
                return res.send({ estado: "Alguno de los campos proporcionados no es correcto" });
              }
            }
            else if (i == plac.length - 1 && !enviada)
              return res.send({ estado: "seleccione un id valido" });
          });
        } else if (entidad == 'phases') {
          phases.forEach(function (element, i, plac) {
            if (element.id == id) {
              let pl = new phase(element.id,req.body.proyectId,req.body.name,req.body.yeari,req.body.monthi,req.body.dayi,req.body.yearf,req.body.monthf,req.body.dayf,req.body.completed,req.body.hours,req.body.totalHours,req.body.completedHours);
              if(pl.validar()){
                plac[i] = pl;
                enviada = true;
                return  res.send(plac[i]);
              }else{
                return res.send({ estado: "Alguno de los campos proporcionados no es correcto" });
              }
            }
            else if (i == plac.length - 1 && !enviada)
              return res.send({ estado: "seleccione un id valido" });
          });
        }else if (entidad == 'projects') {
          projects.forEach(function (element, i, plac) {
            if (element.id == id) {
              let pl = new project(element.id,req.body.name,req.body.description,req.body.planHours,req.body.fechaInicio,req.body.fechaFin,req.body.deleted);
              if(pl.validar()){
                plac[i] = pl;
                enviada = true;
                return  res.send(plac[i]);
              }else{
                return res.send({ estado: "Alguno de los campos proporcionados no es correcto" });
              }
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
              if(userp.validar()){
                plac[i] = userp;
                enviada = true;
              return  res.send(plac[i]);
              }else{
                return res.send({ estado: "Alguno de los campos proporcionados no es correcto" });
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
          if(userp.validar()){
            users.push(userp);
            res.send(userp);
          }else{
            return res.send({ estado: "Alguno de los campos proporcionados no es correcto" });
          }
        }else if (entidad == 'tasks') {
          let taskp = new task(0, '','', '', '','',0,'0','0',[],0,'',false);
          
          taskp.id = tasks.length;
          taskp.projectId = req.body.projectId;
          taskp.title = req.body.title;
          taskp.assigned = req.body.assigned;
          taskp.description = req.body.description;
          taskp.dateI = req.body.dateI;
          taskp.dateF = req.body.dateF;
          taskp.phase = req.body.phase;
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
            return res.send({ estado: "Alguno de los campos proporcionados no es correcto" });
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
            return res.send({ estado: "Alguno de los campos proporcionados no es correcto" });
          }
        }else if (entidad == 'project') {
          let projectp = new project(0,'','',0,false);
          
          projectp.id = projects.length;
          projectp.name = req.body.name;
          projectp.description = req.body.description;
          projectp.planHours = req.body.planHours;
          projectp.fechaInicio = req.body.fechaInicio;
          projectp.fechaFin = req.body.fechaFin;
          projectp.deleted = req.body.deleted;

          if(projectp.validar()){
            projects.push(projectp);
            res.send(projects);
          }else{
            return res.send({ estado: "Alguno de los campos proporcionados no es correcto" });
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

