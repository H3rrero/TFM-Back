var mongoose = require('mongoose');
var Task = mongoose.model('TaskApp');
var Phase = mongoose.model('PhaseApp');
var UserPhase = mongoose.model('UserPhaseApp');


exports.findAllTasks = function (res) {
    Task.find(function (err, tasks) {
        if (err) res.send(500, err.message);

        console.log('GET /users')
        res.status(200).jsonp(tasks);
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
    Task.count({ id: req.params.task }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        
            Task.find({ id: req.params.task }, function (err, task) {
                if (err) return res.send(500, err.message);

                console.log('GET /user/' + req.params.id);
                res.status(200).jsonp(task);
            });
         
    })
};

exports.addTask = function (res,req) {
    var exist = false;
    Task.count({ id: req.body.id }, function (err, c) {
        if (c > 0) {
            exist = true;
        }
    }).then(function () {
        var task = new Task({
            id: req.body.title+req.body.projectId,
            projectId: req.body.projectId,
            title: req.body.title,
            assigned: req.body.assigned,
            description: req.body.description,
            dateI: req.body.dateI,
            dateF: req.body.dateF,
            state: req.body.state,
            hours: req.body.hours,
            planHours: req.body.planHours,
            coments: req.body.coments,
            userId: req.body.userId,
            phase: req.body.phase,
            deleted: req.body.deleted,
            finish: req.body.finish,
        });
        var error = {
            codigo: 2,
            message: "Esa tarea ya existe, por favor selecciona otro."
        }

        if (!exist) {
            task.save(function (err, tvshow) {
                if (err) return res.status(500).send(err.message);
                res.status(200).jsonp(task);
            });
        } else {
            res.status(200).jsonp(error);
        }
    })
}

exports.updateTask = function (res,req) {
    var exist = false;
    Task.count({ id: req.params.task }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        if (!exist) {
            Task.findOne({ id: req.params.task }, function (err, task) {
                if (err) return handleError(err);
                let newHours = req.body.hours - task.hours;
                updatePhases(req.body.phase,newHours,task.state,req.body.state,task.planHours,task.phase,false,task.projectId);
                addHoursPhase(req.body.userId,req.body.phase,newHours);
                task.set({ id: req.body.title+req.body.projectId });
                task.set({ projectId: req.body.projectId });
                task.set({ title: req.body.title });
                task.set({ assigned: req.body.assigned });
                task.set({ description: req.body.description });
                task.set({ dateI: req.body.dateI });
                task.set({ dateF: req.body.dateF });
                task.set({ state: req.body.state });
                task.set({ hours: req.body.hours });
                task.set({ planHours: req.body.planHours });
                task.set({ coments: req.body.coments });
                task.set({ userId: req.body.userId });
                task.set({ phase: req.body.phase });
                task.set({ deleted: req.body.deleted });
                task.set({ finish: req.body.finish });
                task.save(function (err, tvshow) {
                    if (err) return res.status(500).send(err.message);
                    res.status(200).jsonp(task);
                });
            });
        } else {
            var error = {
                codigo: 2,
                message: "Esa tarea no existe."
            }
            res.status(200).jsonp(error);
        }
    })
}

exports.findTaskByProject = function (res,req) {
    var exist = false;
    Task.count({projectId: req.params.project}, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        var error = {
            codigo: 2,
            message: "Ese proyecto no tiene tareas."
        }

        if (!exist) {
            Task.find({projectId: req.params.project}, function (err, tasks) {
                if (err) return res.send(500, err.message);

                res.status(200).jsonp(tasks);
            });
        }else {
            res.status(200).jsonp(error);
        }
    })
}

exports.findTaskByPhase = function (res,req) {
    var exist = false;

    Task.count({phase: req.params.phase}, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        var error = {
            codigo: 2,
            message: "Esa fase no tiene tareas."
        }

        if (!exist) {
            Task.find({phase: req.params.phase}, function (err, tasks) {
                if (err) return res.send(500, err.message);
                tasks.sort(function(a,b){
                    return new Date(a.dateF) - new Date(b.dateF);
                });
                res.status(200).jsonp(tasks);
            });
        }else {
            res.status(200).jsonp(error);
        }
    }) 
}

exports.deleteTask = function (res,req) {
    var exist = false;
    Task.count({ id: req.params.task }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        if(!exist){
        Task.remove({ id: req.params.task }, function (err) {
                if (err) return res.send(500, err.message);

                res.status(200).jsonp({message: "La tarea ha sido eliminada."});
            });
        } else {
            var error = {
                codigo: 2,
                message: "La tarea no existe."
            }
            res.status(200).jsonp(error);
        }
    })

}
exports.findTasksByPhaseAndProject = function (res,req) {
    var exist = false;
    Task.count({phase: req.params.phase,projectId: req.params.project}, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        var error = {
            codigo: 2,
            message: "Esa fase no tiene tareas."
        }

        if (!exist) {
            Task.find({phase: req.params.phase,projectId: req.params.project}, function (err, tasks) {
                if (err) return res.send(500, err.message);
                tasks.sort(function(a,b){
                    return new Date(a.dateF) - new Date(b.dateF);
                });
                res.status(200).jsonp(tasks);
            });
        }else {
            res.status(200).jsonp(error);
        }
    })

}
exports.checkQuestion = function (res,req) {
    var exist = false;

}
exports.checkQuestion = function (res,req) {
    var exist = false;

}
function addHoursPhase(user,phase,hours) {
	var exist = false;
	UserPhase.count({ user: user,phase: phase }, function (err, c) {
		if (c == 0) {
			exist = true;
		}
	}).then(function () {
		if (!exist) {
			UserPhase.findOne({ user: user, phase:phase}, function (err, userPhase) {
				if (err) return handleError(err);
				userPhase.set({ user: user });
				userPhase.set({ phase: phase });
				userPhase.set({ hours: userPhase.hours + hours });
				userPhase.save(function (err, tvshow) {
					if (err) return res.status(500).send(err.message);
				});
			});
		} else {
			var userPhase = new UserPhase({
				user: user,
				phase: phase,
				hours: hours
		});
		userPhase.save(function (err, tvshow) {
				if (err) return res.status(500).send(err.message);
		});
		}
	})
}
function updatePhases(idPhase,hours,state,newState,planHours,newPhase,isNew,project,user) {
    Phase.find({proyectId: project}, function (err, phases) {
          if (err) return res.send(500, err.message);
  
          phases.forEach(element => {
              if(idPhase == newPhase){
                  if (element.id == idPhase){
                      if(isNew){
                          element.totalHours = parseInt(element.totalHours) +  parseInt(hours);
                          element.completed = ( parseInt(element.hours)/ parseInt(element.totalHours)).toFixed(2);
                       
                      }else{
                          element.hours = element.hours + hours;
                          element.completed = ( parseInt(element.hours)/ parseInt(element.totalHours)).toFixed(2);
                   
                       
                      }
                      if(state != 'Terminada' && newState == 'Terminada'){
                          element.completedHours = parseInt(element.completedHours) + parseInt(planHours);
                       
                      }
                      if(state == 'Terminada' && newState != 'Terminada'){
                          element.completedHours =  parseInt(element.completedHours) - parseInt(planHours);
                      }
                  }
              }else if(element.id == idPhase){
                  
                  element.totalHours = parseInt(element.totalHours) + parseInt(planHours);
              }else if(element.id == newPhase){
                  element.totalHours = parseInt(element.totalHours) - parseInt(planHours);
              }
              updatePhase(element);
          });
      });
  }
  function updatePhase(p) {
	Phase.findOne({ id: p.id }, function (err, phase) {
		if (err) return handleError(err);
		console.log(phase.name);
		phase.set({ id: p.id });
		phase.set({ proyectId: p.proyectId });
		phase.set({ name: p.name });
		phase.set({ dateI: p.dateI });
		phase.set({ dateF: p.dateF });
		phase.set({ completed: p.completed });
		phase.set({ hours: p.hours });
		phase.set({ totalHours: p.totalHours });
		phase.set({ completedHours: p.completedHours });
		phase.save(function (err, tvshow) {
			if (err) return res.status(500).send(err.message);
		});
	});
}