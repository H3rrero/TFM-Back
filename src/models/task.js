        exports = module.exports = function (app, mongoose) {
            var tasksSchema = new mongoose.Schema({
                id: { type: String },
                projectId: { type: String },
                title: { type: String },
                assigned: { type: String },
                description: { type: String },
                dateI: { type: String },
                dateF: { type: String },
                state: { type: String },
                hours: { type: Number },
                planHours: { type: Number },
                coments: { type: Array },
                userId: { type: String },
                phase: { type: String },
                deleted: { type: Boolean },
                finish: { type: Boolean }
            });
        
            mongoose.model('TaskApp', tasksSchema);
        
        };