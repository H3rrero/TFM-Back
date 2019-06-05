var mongoose = require('mongoose');
var UserProject = mongoose.model('UserProjectApp');
var Project = mongoose.model('ProjectApp');
var User = mongoose.model('UserApp');


exports.findAllUserProjects = function (res) {
    UserProject.find(function (err, userProject) {
        if (err) res.send(500, err.message);

        res.status(200).jsonp(userProject);
    });

};

exports.findByUser = function (res,req) {
    var exist = false;
    UserProject.count({ user: req.params.user }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
if(!exist){
    UserProject.find({ user: req.params.user }, function (err, userProject) {
        if (err) return res.status(500).send(err.message);
        var projects = [];
        var oneTry = true;
        userProject.forEach(function (u) {
            Project.findOne({ id: u.project }, function (err, project) {
                projects.push(project);
                UserProject.count({ user: req.params.user }, function (err, c) {
                    console.log("valor de c: " + c);
                    console.log("valor de eventos: " + projects.length);
                    if (projects.length == c && oneTry) {
                        oneTry = false;
                        res.status(200).jsonp(projects);
                    }
                })
            })

        })

    });
  } else {
    var error = {
      codigo: 2,
      message: "No existe."
    }
    res.status(200).jsonp(error);
  }})
}

exports.findByProject = function (res,req) {
    var exist = false;
    UserProject.count({project: req.params.project }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        var error = {
            codigo: 2,
            message: "Ese proyecto no tiene tareas."
        }
if(!exist){
    UserProject.find({ project: req.params.project }, function (err, userProject) {
        if (err) return res.status(500).send(err.message);
        var usuarios = [];
        var oneTry = true;
        userProject.forEach(function (u) {
            User.findOne({ id: u.user }, function (err, user) {
                console.log(user);
                usuarios.push(user);
                UserProject.count({ project: req.params.project }, function (err, c) {
                    if (usuarios.length == c && oneTry) {
                        oneTry = false;
                        res.status(200).jsonp(usuarios);
                    }
                })
            })

        })

    });
  } else {
    var error = {
      codigo: 2,
      message: "No existe."
    }
    res.status(200).jsonp(error);
  }})
}



exports.usersWithoutProject = function (res,req) {
    var exist = false;
    var ret = [];
    var us = [];
    var oneTry = true;
    User.find(function (err, users) {
        if (err) res.send(500, err.message);

users.forEach(element => {
  UserProject.count({ user:element.id }, function (err, c) {
    console.log("valor de c: " + c);
    if(c == 0){
      ret.push(element);
    }
    us.push(element);
    User.count(function (err, count) {
      console.log("us.length == count");
      console.log(us.length == count);
      if (us.length == count && oneTry ) {
        oneTry = false;
       res.status(200).jsonp(ret);
    }
    })
  })
});
    });
}

exports.addUserProject = function (res,req) {
    var exist = false;

    var userProject = new UserProject({
        user: req.body.user,
        project: req.body.project,

    });

    userProject.save(function (err, tvshow) {
        if (err) return res.status(500).send(err.message);
        res.status(200).jsonp(userProject);
    });
}

exports.findByProjectAndUser = function (res,req) {
    var exist = false;

    UserProject.count({ user: req.params.user,project: req.params.project }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
      if(!exist){
        UserProject.find({ user: req.params.user, event: req.params.event }, function (err, usersProjects) {
                if (err) return res.status(500).send(err.message);

                res.status(200).jsonp(usersProjects);

            })
          } else {
            var error = {
              codigo: 2,
              message: "No existe."
            }
            res.status(200).jsonp(error);
          }
    })
}
exports.deleteUserProject = function (res,req) {
    var exist = false;

    UserProject.count({ user: req.params.user,project: req.params.project }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        if(!exist){
        UserProject.remove({ user: req.params.user,project: req.params.project }, function (err) {
                if (err) return res.send(500, err.message);

                res.status(200).jsonp({message: "Ha sido eliminado."});
            });
        } else {
            var error = {
                codigo: 2,
                message: "No existe."
            }
            res.status(200).jsonp(error);
        }
    })
}
exports.updateUserProject = function (res,req) {
    var exist = false;

    UserProject.count({ user: req.params.user,project: req.params.project }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        if (!exist) {
            UserProject.findOne({ user: req.params.user,project: req.params.project}, function (err, userProject) {
                if (err) return handleError(err);
                userProject.set({ user: req.body.user });
                userProject.set({ project: req.body.project });
                
                userProject.save(function (err, tvshow) {
                    if (err) return res.status(500).send(err.message);
                    res.status(200).jsonp(userProject);
                });
            });
        } else {
            var error = {
                codigo: 2,
                message: "No existe."
            }
            res.status(200).jsonp(error);
        }
    })
}