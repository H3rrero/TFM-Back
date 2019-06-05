    exports = module.exports = function (app, mongoose) {
        var stateSchema = new mongoose.Schema({
            id: { type: String },
            name: { type: String }
        });
    
        mongoose.model('StateApp', stateSchema);
    
    };