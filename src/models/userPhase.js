exports = module.exports = function (app, mongoose) {
    
    var userPhaseSchema = new mongoose.Schema({
        user: { type: String },
        phase: { type: String },
        hours: { type: Number }
    });

    mongoose.model('UserPhaseApp', userPhaseSchema);

};