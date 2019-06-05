exports = module.exports = function (app, mongoose) {
    
    var userProjectSchema = new mongoose.Schema({
        user: { type: String },
        project: { type: String }
    });

    mongoose.model('UserProjectApp', userProjectSchema);

};