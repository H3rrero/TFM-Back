var jwt = require('jsonwebtoken');
var UserPhasedb = require('../db/userPhasedb');

exports.findAllUserPhases = function (req, res) {

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
        UserPhasedb.findAllUserPhases(res);
		}
	  })

};
exports.addUserPhase = function (req, res) {

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
      UserPhasedb.addUserPhase(res,req);
  }
  })

  
};
exports.getHoursByUser = function (req, res) {
    var token = req.headers['authorization'];
    
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
        UserPhasedb.getHoursByUser(res,req);
		}
	  })
};

exports.updateUserPhase = function (req, res) {
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
			UserPhasedb.updateUserPhase(res,req);
		}
	  })

};

exports.findByPhaseAndUser = function (req, res) {
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
        UserPhasedb.findByPhaseAndUser(res,req);
  }
  })



};

exports.deleteUserPhase = function (req, res) {
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
			UserPhasedb.deleteUserPhase(res,req);
		}
	  })

};