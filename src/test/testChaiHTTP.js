let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url= 'http://localhost:3000';
var auth = '';
describe('Login: ',()=>{

	it('Login', (done) => {
		chai.request(url)
			.post('/login')
			.send({ username: "admin", password: "admin"})
			.end( function(err,res){
                console.log(res.body)
                auth = res.body.token;
				expect(res).to.have.status(200);
				done();
			});
	});

});
setTimeout(() => {
    //Pruebas para usuarios
   describe('get all users: ',()=>{
        it('should get all users', (done) => {
            chai.request(url)
                .get('/users')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('get user by id: ',()=>{
        it('should get user by id', (done) => {
            chai.request(url)
                .get('/users/man1')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
   /* describe('Add user: ',()=>{

        it('Add user', (done) => {
            chai.request(url)
                .post('/users')
                .send({ id: "user23",username: "user23",password: "user23",question:"¿nombre de tu primera mascota?",answer:"rodolfo",
                mail:"jandromix@hotmail.com",firstname: "Juan",lastname: "Catenaria",token: "",projectId: -1, rol: "user", deleted: false,type: "users"})
                .set('Authorization', auth)
                .end( function(err,res){
                    expect(res).to.have.status(200);
                    done();
                });
        });
    
    });*/
    describe('Update user: ',()=>{

        it('Update user', (done) => {
            chai.request(url)
                .put('/users/user5')
                .send({  id: "user5",username: "user5",password: "user5",firstname: "Lara",lastname: "Casasola",token: "",projectId: "proyecto prueba",
                rol: "user",deleted: false,answer: "rodolfo",mail: "jandromix@hotmail.com",question: "¿nombre de tu primera mascota?"})
                .set('Authorization', auth)
                .end( function(err,res){
                    expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('get users by project: ',()=>{
        it('shouldget user by project', (done) => {
            chai.request(url)
                .get('/usersbyproject/proyecto prueba')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('get users without project: ',()=>{
        it('should get users without project', (done) => {
            chai.request(url)
                .get('/usersWithoutProject')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    //Pruebas proyectos
    describe('get all projects: ',()=>{
        it('should get all projects', (done) => {
            chai.request(url)
                .get('/projects')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('get project by id: ',()=>{
        it('should get project by id', (done) => {
            chai.request(url)
                .get('/projects/proyecto prueba')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('Add project: ',()=>{
        it('Add project', (done) => {
            chai.request(url)
                .post('/projects')
                .send({ id:"proyecto prueba 3",name: "proyecto prueba 3",description: "descripcion de prueba 3",planHours: 600,
                  fechaInicio: "2019-01-01T00:00:00.000Z",fechaFin: "2019-05-29T00:00:00.000Z",deleted: false})
                .set('Authorization', auth)
                .end( function(err,res){
                    expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('delete project by id: ',()=>{
        it('should delete project by id', (done) => {
            chai.request(url)
                .del('/projects/proyecto prueba 3')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('Update project: ',()=>{

        it('Update project', (done) => {
            chai.request(url)
                .put('/projects/proyecto prueba')
                .send({ id: "proyecto prueba",name: "proyecto prueba",description: "descripcion de prueba td",planHours: 600,
                    fechaInicio: "2019-01-01T00:00:00.000Z",fechaFin: "2019-06-30T00:00:00.000Z",deleted: false})
                .set('Authorization', auth)
                .end( function(err,res){
                    expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    //Pruebas de phases
    describe('get all phases: ',()=>{
        it('should get all phases', (done) => {
            chai.request(url)
                .get('/phases')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('get phase by id: ',()=>{
        it('should get phase by id', (done) => {
            chai.request(url)
                .get('/phases/Sprint 4proyecto prueba')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('get phases by project: ',()=>{
        it('should get phases by project', (done) => {
            chai.request(url)
                .get('/phasebyproject/proyecto prueba')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('Add phase: ',()=>{
        it('Add phase', (done) => {
            chai.request(url)
                .post('/phases')
                .send({id:"Sprint prueba 67",proyectId:"proyecto prueba",name: "Sprint 67",dateI: "2019-03-07T00:00:00.000Z",
                dateF: "2019-05-29T00:00:00.000Z",completed: "0.12",hours: 0,totalHours: 60,completedHours: 0})
                .set('Authorization', auth)
                .end( function(err,res){
                    expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('delete phase by id: ',()=>{
        it('should delete phase by id', (done) => {
            chai.request(url)
                .del('/phases/Sprint 67proyecto prueba')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('Update phase: ',()=>{

        it('Update phase', (done) => {
            chai.request(url)
                .put('/phases/Sprint 4proyecto prueba')
                .send({  id: "Sprint 4proyecto prueba",proyectId: "proyecto prueba",name: "Sprint 4",dateI: "2019-03-07T00:00:00.000Z",
                dateF: "2019-06-29T00:00:00.000Z",completed: 0,hours: 0,totalHours: 66,completedHours: 0})
                .set('Authorization', auth)
                .end( function(err,res){
                    expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    //Pruebas de states
    describe('get all states: ',()=>{
        it('should get all states', (done) => {
            chai.request(url)
                .get('/states')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('get state by id: ',()=>{
        it('should get state by id', (done) => {
            chai.request(url)
                .get('/states/Produccionproyecto prueba')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('Add state: ',()=>{
        it('Add state', (done) => {
            chai.request(url)
                .post('/states')
                .send({	name:"Backlog5",projectId: "proyecto prueba",order:"11"})
                .set('Authorization', auth)
                .end( function(err,res){
                    expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('delete state by id: ',()=>{
        it('should delte state by id', (done) => {
            chai.request(url)
                .get('/states/Backlog5proyecto prueba')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('Update state: ',()=>{

        it('Update state', (done) => {
            chai.request(url)
                .put('/states/Produccionproyecto prueba')
                .send({  name: "Produccion",projectId: "proyecto prueba",order: 5})
                .set('Authorization', auth)
                .end( function(err,res){
                    expect(res).to.have.status(200);
                    done();
                });
        });
    
    })
    //Pruebas de tareas
    describe('get all tasks: ',()=>{
        it('should get all tasks', (done) => {
            chai.request(url)
                .get('/tasks')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('get task by id: ',()=>{
        it('should get task by id', (done) => {
            chai.request(url)
                .get('/tasks/Nueva pantalla juegosproyecto prueba')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('get tasks by phase: ',()=>{
        it('should get tasks by phase', (done) => {
            chai.request(url)
                .get('/taskbyphase/Sprint 4proyecto prueba')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('get tasks by phase and project: ',()=>{
        it('should get tasks by phase and project', (done) => {
            chai.request(url)
                .get('/taskbyphaseandproject/Produccion/proyecto prueba')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('Add task: ',()=>{
        it('Add task', (done) => {
            chai.request(url)
                .post('/tasks')
                .send({projectId: "proyecto prueba",title: "Documentacion requisitos 33",assigned: "Juan Fernandez",
                description: "Descripcion de prueba",dateI: "2019-03-11T00:00:00.000Z",dateF: "2019-03-24T00:00:00.000Z",
                state: "Produccion",hours: "10",planHours: "6",coments: [ "Comentario de prueba 1","comentario de prueba 2"],
                userId: "user2",phase: "Sprint 4proyecto prueba",deleted: false,finish: false})
                .set('Authorization', auth)
                .end( function(err,res){
                    expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('delete task by id: ',()=>{
        it('should delete task by id', (done) => {
            chai.request(url)
                .get('/tasks/Documentacion requisitos 33proyecto prueba')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('Update task: ',()=>{

        it('Update task', (done) => {
            chai.request(url)
                .put('/tasks/Chat fase 2proyecto prueba')
                .send( {coments: ["Comentario de prueba 1","comentario de prueba 2"],projectId: "proyecto prueba",
                    title: "Chat fase 2",assigned: "Juan Fernandez",description: "Descripcion de prueba",
                    dateI: "2019-03-11T00:00:00.000Z",dateF: "2019-01-15T00:00:00.000Z",state: "Terminada",
                    hours: 6,planHours: 6,userId: "user2",phase: "Sprint pruebaproyecto prueba", deleted: false,finish: false
                })
                .set('Authorization', auth)
                .end( function(err,res){
                    expect(res).to.have.status(200);
                    done();
                });
        });
    
    })
    //test usersproject
    describe('get all usersproject: ',()=>{
        it('should get all usersproject', (done) => {
            chai.request(url)
                .get('/userProjects')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('get projects by user: ',()=>{
        it('should get projects by user', (done) => {
            chai.request(url)
                .get('/userProjects/projects/man1')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('get users by project: ',()=>{
        it('should get users by project', (done) => {
            chai.request(url)
                .get('/userProjects/users/proyecto prueba')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('get by users and project: ',()=>{
        it('should get by users and project', (done) => {
            chai.request(url)
                .get('/userProjects/users/man1/proyecto prueba')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('Add usersproject: ',()=>{
        it('Add usersproject', (done) => {
            chai.request(url)
                .post('/userProjects')
                .send({
                    user:"user21",
                    project:"proyecto prueba"
                })
                .set('Authorization', auth)
                .end( function(err,res){
                    expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('delete by users and project: ',()=>{
        it('should delete by users and project', (done) => {
            chai.request(url)
                .del('/userProjects/users/user21/proyecto prueba')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('Update userProjects: ',()=>{

        it('Update userProjects', (done) => {
            chai.request(url)
                .put('/userProjects/users/man1/proyecto prueba')
                .send({
                    user:"man1",
                    project:"proyecto prueba"
                })
                .set('Authorization', auth)
                .end( function(err,res){
                    expect(res).to.have.status(200);
                    done();
                });
        });
    
    })
    //test de userphase
    describe('get all usersphase: ',()=>{
        it('should get all usersphase', (done) => {
            chai.request(url)
                .get('/userPhases')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('get phases by user: ',()=>{
        it('should get phases by user', (done) => {
            chai.request(url)
                .get('/userPhases/man1')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('get by user and phase: ',()=>{
        it('should get by user and phase', (done) => {
            chai.request(url)
                .get('/userPhases/man1/Sprint 2proyecto prueba')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
   
    describe('Add usersphase: ',()=>{
        it('Add usersphase', (done) => {
            chai.request(url)
                .post('/userProjects')
                .send({
                    user:"user8",
                    phase:"Sprint pruebaproyecto prueba 2",
                    hours:5
                })
                .set('Authorization', auth)
                .end( function(err,res){
                    expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
    describe('delete userphase: ',()=>{
        it('should delete usersphase', (done) => {
            chai.request(url)
                .del('/userPhases/user8/Sprint pruebaproyecto prueba 2')
                .set('Authorization', auth)
                .end( function(err,res){
                   expect(res).to.have.status(200);
                    done();
                });
        });
    
    });
}, 100);
