var mongoose = require('mongoose');
var State = mongoose.model('StateApp');


exports.findAllStates = function (res) {
    State.find(function (err, states) {
        if (err) res.send(500, err.message);

        console.log('GET /sattes')
        res.status(200).jsonp(states);
    });

};


exports.findById = function (res,req) {
    var exist = false;
    State.count({ id: req.params.state }, function (err, c) {
        console.log("he pasado");
        console.log(c);
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        
            State.find({ id: req.params.state }, function (err, state) {
                if (err) return res.send(500, err.message);

                console.log('GET /state/' + req.params.id);
                res.status(200).jsonp(state);
            });
         
    })
};

exports.addState = function (res,req) {
    var exist = false;
    State.count({ id: req.body.name }, function (err, c) {
        if (c > 0) {
            exist = true;
        }
    }).then(function () {
        var state = new State({
            id: req.body.name,
            name: req.body.name,
        });
        var error = {
            codigo: 2,
            message: "Esa identificador de estado ya se esta usando."
        }

        if (!exist) {
            state.save(function (err, tvshow) {
                if (err) return res.status(500).send(err.message);
                res.status(200).jsonp(state);
            });
        } else {
            res.status(200).jsonp(error);
        }
    })
}

exports.updateState = function (res,req) {
    var exist = false;
    State.count({ id: req.params.state }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        if (!exist) {
            State.findOne({ id: req.params.state }, function (err, state) {
                if (err) return handleError(err);
                console.log(state.name);
                state.set({ id: req.body.name });
                state.set({ name: req.body.name });
                state.save(function (err, tvshow) {
                    if (err) return res.status(500).send(err.message);
                    res.status(200).jsonp(state);
                });
            });
        } else {
            var error = {
                codigo: 2,
                message: "Ese estado no existe."
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
