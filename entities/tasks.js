module.exports =
    class Tasks {
        constructor(id, title,assigned, description, dateI, dateF,phase) {
            this.id = id;
            this.title = title;
            this.assigned = assigned;
            this.description = description;
            this.dateI = dateI;
            this.dateF = dateF;
            this.phase = phase;
        }
       
    }