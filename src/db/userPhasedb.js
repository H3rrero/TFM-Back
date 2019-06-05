var mongoose = require('mongoose');
var UserPhase = mongoose.model('UserPhaseApp');


exports.findAllUserPhases = function (res) {
    UserPhase.find(function (err, userPhase) {
        if (err) res.send(500, err.message);

        res.status(200).jsonp(userPhase);
    });

};

exports.addUserPhase = function (res,req) {
    var userPhase = new UserPhase({
        user: req.body.user,
        phase: req.body.phase,
        hours: req.body.hours
    });

    userPhase.save(function (err, tvshow) {
        if (err) return res.status(500).send(err.message);
        res.status(200).jsonp(userPhase);
    });
}

exports.getHoursByUser = function (res,req) {
    var exist = false;
    var users=[];
    var userHours = {};
    UserPhase.count({ user: req.params.user }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
      if(!exist){
        UserPhase.find({ user: req.params.user}, function (err, usersPhases) {
                if (err) return res.status(500).send(err.message);
                userHours["hours"] = 0;
                usersPhases.forEach(element => {
                  users.push(element);
                  userHours["name"] = req.params.user;
                  userHours["y"] = userHours["hours"] + element.hours;
                  if(users.length == usersPhases.length){
                    res.status(200).jsonp(userHours);
                  }
                });
               

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



exports.updateUserPhase = function (res,req) {
    var exist = false;

    UserPhase.count({ user: req.params.user,phase: req.params.phase }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        if (!exist) {
            UserPhase.findOne({ user: req.params.user,phase: req.params.phase}, function (err, userPhase) {
                if (err) return handleError(err);
                userPhase.set({ user: req.body.user });
                userPhase.set({ phase: req.body.phase });
                userPhase.set({ hours: req.body.hours });
                userPhase.save(function (err, tvshow) {
                    if (err) return res.status(500).send(err.message);
                    res.status(200).jsonp(userPhase);
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

exports.findByPhaseAndUser = function (res,req) {
    var exist = false;
    var exist = false;
    var userHours = {};
   
    UserPhase.count({ user: req.params.user,phase: req.params.phase }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
      if(!exist){
        UserPhase.find({ user: req.params.user, phase: req.params.phase }, function (err, usersPhases) {
                if (err) return res.status(500).send(err.message);
                if(usersPhases[0] != undefined){
                userHours["name"] = req.params.user;
                console.log(usersPhases);
                userHours["y"] = usersPhases[0].hours;
                res.status(200).jsonp(userHours);
                }else{
                  var error = {
                    codigo: 2,
                    message: "No existe."
                  }
                  res.status(200).jsonp(error);
                }

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

exports.deleteUserPhase = function (res,req) {
    var exist = false;

    UserPhase.count({ user: req.params.user,phase: req.params.phase }, function (err, c) {
        if (c == 0) {
            exist = true;
        }
    }).then(function () {
        if(!exist){
     UserPhase.remove({ user: req.params.user,phase: req.params.phase }, function (err) {
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