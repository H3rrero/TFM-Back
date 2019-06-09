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
    State.count({ id: req.body.name + req.body.projectId }, function (err, c) {
        if (c > 0) {
            exist = true;
        }
    }).then(function () {
        var state = new State({
            id: req.body.name + req.body.projectId,
            name: req.body.name,
            projectId: req.body.projectId,
            order: req.body.order,
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
                state.set({ id: req.body.name + req.body.projectId});
                state.set({ name: req.body.name });
                state.set({ projectId: req.body.projectId });
                state.set({ order: req.body.order });
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


exports.findByProject = function (res,req) {
    var exist = false;

    State.count({projectId: req.params.projectId}, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        var error = {
            result: false,
            message: "Ese proyecto no existe, por favor selecciona otro."
        }

        if (!exist) {
            State.find({projectId: req.params.projectId}, function (err, states) {
                if (err) return res.send(500, err.message);
                states.sort((a, b) => parseFloat(a.order) - parseFloat(b.order));
                res.status(200).jsonp(states);
            });
        }else {
            res.status(200).jsonp(error);
        }
    }) 
}

exports.deleteState = function (res,req) {
    var exist = false;
    console.log( req);
    State.count({ id: req.params.state }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        if(!exist){
            State.remove({ id: req.params.state }, function (err) {
                if (err) return res.send(500, err.message);

                res.status(200).jsonp({message: "El estado ha sido eliminado."});
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