    exports = module.exports = function (app, mongoose) {
        var projectsSchema = new mongoose.Schema({
            id: { type: String },
            name: { type: String },
            description: { type: String },
            planHours: { type: Number },
            fechaInicio: { type: String },
            fechaFin: { type: String },
            deleted: { type: Boolean }
        });
    
        mongoose.model('ProjectApp', projectsSchema);
    
    };