var jwt = require('jsonwebtoken');
var UsersDb = require('../db/usersdb');


exports.findAllUsers = function (req, res) {

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
			UsersDb.findAllUsers(res);
		}
	  })
	
};

exports.login = async (req, res) => {
	UsersDb.login(res,req);
}
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
			UsersDb.findById(res,req);
		}
	  })
};

exports.addUser = function (req, res) {

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
			UsersDb.addUser(res,req);
		}
	  })

};
exports.updateUser = function (req, res) {
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
			UsersDb.updateUser(res,req);
		}
	  })
};

exports.changePassword = function (req, res) {
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
			UsersDb.changePassword(res,req);
		}
	  })
};

exports.findUsersByProject = function (req, res) {
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
			UsersDb.findUserByProject(res,req);
		}
	  })
};

exports.findByIdAndMail = function (req, res) {
	UsersDb.findIdAndMail(res,req);
};

exports.checkQuestion = function (req, res) {
	UsersDb.checkQuestion(res,req);	
};