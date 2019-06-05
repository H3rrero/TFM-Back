 exports = module.exports = function (app, mongoose) {
    
        var usersSchema = new mongoose.Schema({
            id: { type: String },
            username: { type: String },
            password: { type: String },
            firstname: { type: String },
            lastname: { type: String },
            question:{type: String},
            answer:{type: String},
            mail:{type: String},
            token: { type: String },
            projectId: { type: String },
            rol: { type: String },
            deleted: { type: Boolean },
        });
    
        mongoose.model('UserApp', usersSchema);
    
    };