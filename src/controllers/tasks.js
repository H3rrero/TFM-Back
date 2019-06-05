var jwt = require('jsonwebtoken');
var TasksDb = require('../db/tasksdb');


exports.findAllTasks = function (req, res) {
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
			TasksDb.findAllTasks(res);
		}
	  })
	
};
exports.findById = function (req, res) {
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
			TasksDb.findById(res,req);
		}
	  })
};
exports.addTask = function (req, res) {
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
			TasksDb.addTask(res,req);
		}
	  })
};
exports.updateTask = function (req, res) {
	var exist = false;
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
			TasksDb.updateTask(res,req);
		}
	  })

};

exports.findTasksByProject = function (req, res) {
	var exist = false;
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
			TasksDb.findTaskByProject(res,req);
		}
	  })
};

exports.findTasksByPhase = function (req, res) {
	var exist = false;
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
			TasksDb.findTaskByPhase(res,req);
		}
	  })
};

exports.deleteTask = function (req, res) {
	var exist = false;
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
			TasksDb.deleteTask(res,req);
		}
	  })

};

exports.findTasksByPhaseAndProject = function (req, res) {
	var exist = false;
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
			TasksDb.findTasksByPhaseAndProject(res,req);
		}
	  })
};



