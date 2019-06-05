var jwt = require('jsonwebtoken');
var StatesDb = require('../db/statesdb');

exports.findAllStates = function (req, res) {
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
			StatesDb.findAllStates(res);
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
			StatesDb.findById(res,req);
		}
	  })
};
exports.addState = function (req, res) {
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
			StatesDb.addState(res,req);
		}
	  })

};
exports.updateState = function (req, res) {
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
			StatesDb.updateState(res,req);
		}
	  })
	

};
