var jwt = require('jsonwebtoken');
var ProjectsDb = require('../db/projectsdb');

exports.findAllProjects = function (req, res) {
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
			ProjectsDb.findAllProjects(res,req);
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
			ProjectsDb.findById(res,req);
		}
	  })

};
exports.addProject = function (req, res) {
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
			ProjectsDb.addProject(res,req);
		}
	  })

};
exports.updateProject = function (req, res) {
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
			ProjectsDb.updateProject(res,req);
		}
	  })

};

exports.deleteProject = function (req, res) {
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
			ProjectsDb.deleteProject(req,res);
		}
	  })

};
