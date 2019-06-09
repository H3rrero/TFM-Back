var mongoose = require('mongoose');
var Phase = mongoose.model('PhaseApp');


exports.findAllPhases = function (res) {
    Phase.find(function (err, phases) {
        if (err) res.send(500, err.message);

        console.log('GET /phases')
        res.status(200).jsonp(phases);
    });

};


exports.findById = function (res,req) {
    var exist = false;
    Phase.count({ id: req.params.phase }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        
            Phase.find({ id: req.params.phase }, function (err, phase) {
                if (err) return res.send(500, err.message);

                console.log('GET /phase/' + req.params.id);
                res.status(200).jsonp(phase);
            });
         
    })
};

exports.addPhase = function (res,req) {
    var exist = false;
    Phase.count({ id: req.body.id }, function (err, c) {
        if (c > 0) {
            exist = true;
        }
    }).then(function () {
        var phase = new Phase({
            id: req.body.name + req.body.proyectId ,
            proyectId: req.body.proyectId,
            name: req.body.name,
            dateI: req.body.dateI,
            dateF: req.body.dateF,
            completed: req.body.completed,
            hours: req.body.hours,
            totalHours: req.body.totalHours,
            completedHours: req.body.completedHours
        });
        var error = {
            codigo: 2,
            message: "Esa identificador de phase ya se esta usando."
        }

        if (!exist) {
            phase.save(function (err, tvshow) {
                if (err) return res.status(500).send(err.message);
                res.status(200).jsonp(phase);
            });
        } else {
            res.status(200).jsonp(error);
        }
    })
}

exports.updatePhase = function (res,req) {
    var exist = false;
    Phase.count({ id: req.params.phase }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        if (!exist) {
            Phase.findOne({ id: req.params.phase }, function (err, phase) {
                if (err) return handleError(err);
                console.log(phase.name);
                phase.set({ id: req.body.name + req.body.proyectId });
                phase.set({ proyectId: req.body.proyectId });
                phase.set({ name: req.body.name });
                phase.set({ dateI: req.body.dateI });
                phase.set({ dateF: req.body.dateF });
                phase.set({ completed: req.body.completed });
                phase.set({ hours: req.body.hours });
                phase.set({ totalHours: req.body.totalHours });
                phase.set({ completedHours: req.body.completedHours });
                phase.save(function (err, tvshow) {
                    if (err) return res.status(500).send(err.message);
                    res.status(200).jsonp(phase);
                });
            });
        } else {
            var error = {
                codigo: 2,
                message: "Esa fase no existe."
            }
            res.status(200).jsonp(error);
        }
    })
}



exports.deletePhase = function (res,req) {
    var exist = false;

    Phase.count({ id: req.params.phase }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        if(!exist){
        Phase.remove({ id: req.params.phase }, function (err) {
                if (err) return res.send(500, err.message);

                res.status(200).jsonp({message: "La fase ha sido eliminada."});
            });
        } else {
            var error = {
                codigo: 2,
                message: "La fase no existe."
            }
            res.status(200).jsonp(error);
        }
    })
}

exports.findPhaseByProject = function (res,req) {
    var exist = false;

    Phase.count({proyectId: req.params.project}, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        var error = {
            codigo: 2,
            message: "Esa proyecto no tiene fases."
        }

        if (!exist) {
            Phase.find({proyectId: req.params.project}, function (err, phases) {
                if (err) return res.send(500, err.message);
                phases.sort(function(a,b){
                    return new Date(a.dateI) - new Date(b.dateI);
                });
                res.status(200).jsonp(phases);
            });
        }else {
            res.status(200).jsonp(error);
        }
    })
}
