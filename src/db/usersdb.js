var mongoose = require('mongoose');
var User = mongoose.model('UserApp');
var bcrypt = require('bcryptjs');
var mailService = require('../services/mailService');
var loginService = require('../services/loginService');
var generator = require('generate-password');


exports.findAllUsers = function (res) {
    User.find(function (err, users) {
        if (err) res.send(500, err.message);
        console.log(users);
        console.log('GET /users')
        res.status(200).jsonp(users);
    });

};
exports.login = function (res,req) {
    var exist = false;
	User.count({username: req.body.username}, function (err, c) {
		if (c == 0) {
			exist = true;
		}
	}).then(function () {
		if (!exist) {
			User.find({username: req.body.username}, function (err, user) {
				if (err) return res.send(500, err.message);

			loginService.loginRoute(req, res, user[0]);
			});
		}else {
			res.status(400).send({error:'email or password is wrong',rol:'nan'});
		}
	})
};

exports.findById = function (res,req) {
    var exist = false;
    User.count({username: req.params.user}, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        var error = {
            codigo: 2,
            message: "Ese nombre de usuario no existe, por favor selecciona otro."
        }
    
        if (!exist) {
            User.find({username: req.params.user}, function (err, user) {
                if (err) return res.send(500, err.message);
    
                res.status(200).jsonp(user);
            });
        }else {
            res.status(200).jsonp(error);
        }
    })
};

exports.addUser = function (res,req) {
    var exist = false;
    User.count({ username: req.body.username }, function (err, c) {
        if (c > 0) {
            exist = true;
        }
    }).then(function () {
        var user = new User({
            id: req.body.username,
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            question: req.body.question,
            answer: req.body.answer,
            mail: req.body.mail,
            token: req.body.token,
            projectId: req.body.projectId,
            rol: req.body.rol,
            deleted: req.body.deleted
        });
        var error = {
            codigo: 2,
            message: "Ese nombre de usuario ya existe, por favor selecciona otro."
        }

        if (!exist) {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(user.password, salt, function(err, hash) {
                    user.password = hash;
                    user.save(function (err, tvshow) {
                        if (err) return res.status(500).send(err.message);
                        res.status(200).jsonp(user);
                    });
                });
        });
        } else {
            res.status(200).jsonp(error);
        }
    })
}

exports.updateUser = function (res,req) {
    var exist = false;
    User.count({ username: req.params.user }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        if (!exist) {
            User.findOne({ username: req.params.user }, function (err, user) {
                if (err) return handleError(err);
                console.log(user);
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(req.body.password, salt, function(err, hash) {
                        user.set({ id: req.body.username });
                        user.set({ username: req.body.username });
                        user.set({ password: hash });
                        user.set({ firstname: req.body.firstname });
                        user.set({ lastname: req.body.lastname });
                        user.set({ question: req.body.question });
                        user.set({ answer: req.body.answer });
                        user.set({ mail: req.body.mail });
                        user.set({ token: req.body.token });
                        user.set({ projectId: req.body.projectId });
                        user.set({ rol: req.body.rol });
                        user.set({ deleted: req.body.deleted });
                        user.save(function (err, tvshow) {
                            if (err) return res.status(500).send(err.message);
                            res.status(200).jsonp(user);
                        });
                    });
            });
                
            });
        } else {
            var error = {
                codigo: 2,
                message: "Ese nombre de usuario no existe."
            }
            res.status(200).jsonp(error);
        }
    })
}

exports.findUserByProject = function (res,req) {
    var exist = false;
    User.count({projectId: req.params.project}, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        var error = {
            codigo: 2,
            message: "Ese proyecto no tiene usuarios."
        }

        if (!exist) {
            User.find({projectId: req.params.project}, function (err, users) {
                if (err) return res.send(500, err.message);

                res.status(200).jsonp(users);
            });
        }else {
            res.status(200).jsonp(error);
        }
    })
}

exports.findIdAndMail = function (res,req) {
    var exist = false;

    User.count({username: req.params.user, mail:req.params.mail}, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        var error = {
            result: false,
            message: "Ese nombre de usuario no existe, por favor selecciona otro."
        }

        if (!exist) {
            User.find({username: req.params.user, mail:req.params.mail}, function (err, user) {
                if (err) return res.send(500, err.message);
                res.status(200).jsonp({result:true, question:user[0].question});
            });
        }else {
            res.status(200).jsonp(error);
        }
    }) 
}

exports.checkQuestion = function (res,req) {
    var exist = false;
	var password = generator.generate({
    length: 10,
    numbers: true
	});
			User.count({username: req.params.user, answer:req.params.answer}, function (err, c) {
				if (c == 0) {
					exist = true;
				}
			}).then(function () {
				var error = {
					result: false,
					message: "Esa respuesta es incorrecta."
				}
				if (!exist) {
					User.findOne({username: req.params.user, answer:req.params.answer}, function (err, user) {
						if (err) return res.send(500, err.message);
						bcrypt.genSalt(10, function(err, salt) {
							bcrypt.hash(password, salt, function(err, hash) {
								user.set({ password: hash });
								user.save(function (err, tvshow) {
									if (err) return res.status(500).send(err.message);
									mailService.sendMail(user.mail,password);
									res.status(200).jsonp({result:true, message:"respuesta correcta"});
								});
							});
					});
					});
				}else {
					res.status(200).jsonp(error);
				}
			})
}
