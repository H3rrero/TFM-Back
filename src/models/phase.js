    exports = module.exports = function (app, mongoose) {
        var phasesSchema = new mongoose.Schema({
            id: { type: String },
            proyectId: { type: String },
            name: { type: String },
            dateI: { type: String },
            dateF: { type: String },
            completed: { type: Number },
            hours: { type: Number },
            totalHours: { type: Number },
            completedHours: { type: Number }
        });
    
        mongoose.model('PhaseApp', phasesSchema);
    
    };