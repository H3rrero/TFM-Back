    exports = module.exports = function (app, mongoose) {
        var stateSchema = new mongoose.Schema({
            id: { type: String },
            name: { type: String },
            projectId:{type: String},
            order:{type: Number}
        });
    
        mongoose.model('StateApp', stateSchema);
    
    };