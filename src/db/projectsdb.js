var mongoose = require('mongoose');
var Project = mongoose.model('ProjectApp');


exports.findAllProjects = function (res) {
    Project.find(function (err, projects) {
        if (err) res.send(500, err.message);

        console.log('GET /projects')
        res.status(200).jsonp(projects);
    });

};


exports.findById = function (res,req) {
    var exist = false;
    Project.count({ id: req.params.project }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        
        Project.find({ id: req.params.project }, function (err, project) {
                if (err) return res.send(500, err.message);

                res.status(200).jsonp(project);
            });
         
    })
};

exports.addProject = function (res,req) {
    var exist = false;
    Project.count({ id: req.body.id }, function (err, c) {
        if (c > 0) {
            exist = true;
        }
    }).then(function () {
        var project = new Project({
            id: req.body.name,
            name: req.body.name,
            description: req.body.description,
            planHours: req.body.planHours,
            fechaInicio: req.body.fechaInicio,
            fechaFin: req.body.fechaFin,
            deleted: req.body.deleted,
        });
        var error = {
            codigo: 2,
            message: "Esa identificador de proyecto ya se esta usando."
        }

        if (!exist) {
            project.save(function (err, tvshow) {
                if (err) return res.status(500).send(err.message);
                res.status(200).jsonp(project);
            });
        } else {
            res.status(200).jsonp(error);
        }
    })
}

exports.updateProject = function (res,req) {
    var exist = false;
    Project.count({ id: req.params.project }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        if (!exist) {
            Project.findOne({ id: req.params.project }, function (err, project) {
                if (err) return handleError(err);
                console.log(project.name);
                project.set({ id: req.body.name });
                project.set({ name: req.body.name });
                project.set({ description: req.body.description });
                project.set({ planHours: req.body.planHours });
                project.set({ fechaInicio: req.body.fechaInicio });
                project.set({ fechaFin: req.body.fechaFin });
                project.set({ deleted: req.body.deleted });
                project.save(function (err, tvshow) {
                    if (err) return res.status(500).send(err.message);
                    res.status(200).jsonp(project);
                });
            });
        } else {
            var error = {
                codigo: 2,
                message: "Ese proyecto no existe."
            }
            res.status(200).jsonp(error);
        }
    })
}



exports.deleteProject = function (res,req) {
    var exist = false;

    Project.count({ id: req.params.project }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        if(!exist){
        Project.remove({ id: req.params.project }, function (err) {
                if (err) return res.send(500, err.message);

                res.status(200).jsonp({message: "El proyecto ha sido eliminado."});
            });
        } else {
            var error = {
                codigo: 2,
                message: "Ese proyecto no existe."
            }
            res.status(200).jsonp(error);
        }
    })
}

