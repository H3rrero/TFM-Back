var express = require('express');
app = express();
bodyParser = require("body-parser");
methodOverride = require("method-override");
port = 9001;
var cors = require('cors')

var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

var models = require('./src/models/user')(app, mongoose);
var modelsPhase = require('./src/models/phase')(app, mongoose);
var modelsState = require('./src/models/state')(app, mongoose);
var modelsProject = require('./src/models/project')(app, mongoose);
var modelsTask = require('./src/models/task')(app, mongoose);
var modelsUserProject = require('./src/models/userProject')(app, mongoose);
var modelsUserPhase = require('./src/models/userPhase')(app, mongoose);
var userCtrl = require('./src/controllers/users');
var phaseCtrl = require('./src/controllers/phases');
var stateCtrl = require('./src/controllers/states');
var projectCtrl = require('./src/controllers/projects');
var tasksCtrl = require('./src/controllers/tasks');
var userProjectCtrl = require('./src/controllers/userProjects');
var userPhaseCtrl = require('./src/controllers/userPhases');

var router = express.Router();
app.listen(process.env.PORT, function () {
    console.log('Example app listening on port 3000!'); 
  });
app.use(router);

router.get('/', function (req, res) {
    res.send('Aplicacion para el TFM de Alejandro Fernández Herrero');
});

//mongodb+srv://h3rrero:19Omedines94!@cluster0-exdvb.mongodb.net/TfmProjectApp?retryWrites=true&w=majority
//mongodb://localhost/TfmProjectApp
mongoose.connect('mongodb+srv://h3rrero:19Omedines94!@cluster0-exdvb.mongodb.net/TfmProjectApp?retryWrites=true&w=majority', function (err, res) {
    if (err) {
        console.log('ERROR: connecting to Database. ' + err);
    }

});

router.route('/login')
    .post(userCtrl.login);

router.route('/users')
    .get(userCtrl.findAllUsers)
    .post(userCtrl.addUser);

router.route('/users/:user')
    .get(userCtrl.findById)
    .put(userCtrl.updateUser);

router.route('/users/checkmail/:user/:mail')
    .get(userCtrl.findByIdAndMail);

router.route('/users/checkanswer/:user/:answer')
    .get(userCtrl.checkQuestion);

router.route('/usersbyproject/:project')
    .get(userCtrl.findUsersByProject);

router.route('/usersWithoutProject')
    .get(userProjectCtrl.usersWithoutProject);    

router.route('/phases')
    .get(phaseCtrl.findAllPhases)
    .post(phaseCtrl.addPhase);

router.route('/phases/:phase')
    .get(phaseCtrl.findById)
    .put(phaseCtrl.updatePhase)
    .delete(phaseCtrl.deletePhase);

router.route('/phasebyproject/:project')
    .get(phaseCtrl.findPhaseByProject);

router.route('/states')
    .get(stateCtrl.findAllStates)
    .post(stateCtrl.addState);

router.route('/states/:state')
    .get(stateCtrl.findById)
    .put(stateCtrl.updateState);

router.route('/projects')
    .get(projectCtrl.findAllProjects)
    .post(projectCtrl.addProject);

router.route('/projects/:project')
    .get(projectCtrl.findById)
    .put(projectCtrl.updateProject)
    .delete(projectCtrl.deleteProject);

router.route('/tasks')
    .get(tasksCtrl.findAllTasks)
    .post(tasksCtrl.addTask);

router.route('/tasks/:task')
    .get(tasksCtrl.findById)
    .put(tasksCtrl.updateTask)
    .delete(tasksCtrl.deleteTask);

router.route('/taskbyproject/:project')
    .get(tasksCtrl.findTasksByProject);

router.route('/taskbyphase/:phase')
    .get(tasksCtrl.findTasksByPhase);

router.route('/taskbyphaseandproject/:phase/:project')
    .get(tasksCtrl.findTasksByPhaseAndProject);

router.route('/userProjects')
    .get(userProjectCtrl.findAllUserProjects)
    .post(userProjectCtrl.addUserProject);

router.route('/userProjects/projects/:user')
    .get(userProjectCtrl.findByUser);
router.route('/userProjects/users/:project')
    .get(userProjectCtrl.findByProject);
router.route('/userProjects/users/:user/:project')
    .get(userProjectCtrl.findByProjectAndUser)
    .delete(userProjectCtrl.deleteUserProject)
    .put(userProjectCtrl.updateUserProject);

router.route('/userPhases')
    .get(userPhaseCtrl.findAllUserPhases)
    .post(userPhaseCtrl.addUserPhase);

router.route('/userPhases/:user')
    .get(userPhaseCtrl.getHoursByUser);

router.route('/userPhases/:user/:phase')
    .put(userPhaseCtrl.updateUserPhase);

router.route('/userPhases/:user/:phase')
    .get(userPhaseCtrl.findByPhaseAndUser)
    .delete(userPhaseCtrl.deleteUserPhase);