module.exports =
    class Tasks {
        constructor(id, title,assigned, description, dateI, dateF,phase,hours,coments,userId,state) {
            this.id = id;
            this.title = title;
            this.assigned = assigned;
            this.description = description;
            this.dateI = dateI;
            this.dateF = dateF;
            this.state = state;
            this.hours = hours;
            this.coments = coments;
            this.userId = userId;
            this.phase = phase;
        }
        validar() {

            if ( this.id == undefined ||
                this.title == undefined ||
                this.assigned == undefined ||
                this.description == undefined ||
                this.dateI == undefined ||
                this.dateF == undefined ||
                this.phase == undefined ||
                this.hours == undefined ||
                this.coments == undefined ) {

                return false;
            }
            else
                return true;

        }
    }