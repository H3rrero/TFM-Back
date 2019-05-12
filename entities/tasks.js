module.exports =
    class Tasks {
        constructor(id,projectId, title,assigned, description, dateI, dateF,phase,hours,planHours,coments,userId,state,deleted,finish) {
            this.id = id;
            this.projectId = projectId;
            this.title = title;
            this.assigned = assigned;
            this.description = description;
            this.dateI = dateI;
            this.dateF = dateF;
            this.state = state;
            this.hours = hours;
            this.planHours = planHours;
            this.coments = coments;
            this.userId = userId;
            this.phase = phase;
            this.deleted = deleted;
            this.finish = finish;
        }
        validar(oldDateI, oldDateF) {
            if ( this.id == undefined ||
                this.title == undefined ||
                this.title.trim() == "" ||
                this.assigned == undefined ||
                this.description == undefined ||
                this.dateI == undefined ||
                this.dateF == undefined ||
                new Date(this.dateI)  == 'Invalid Date' ||
                new Date(this.dateF)  == 'Invalid Date' || 
                !this.validateDate||
                this.state == undefined ||
                this.state.trim() == "" ||
                this.phase == undefined ||
                this.phase <-1 ||
                this.hours == undefined ||
                parseInt(this.hours) < 0 ||
                this.planHours == undefined ||
                parseInt(this.planHours) < 0 ||
                this.userId == undefined ||
                this.userId < -1||
                this.deleted == undefined ||
                typeof this.deleted !== "boolean" ||
                this.finish == undefined ||
                typeof this.finish !== "boolean" ||
                this.coments == undefined 
                 ) {

                return false;
            }
            else
                return true;

        }
        validateDate(oldDateI, oldDateF){
            if((this.dateI!=oldDateI || this.dateF!= oldDateF) && (new Date(this.dateF) < new Date(this.dateI) ||
            new Date(this.dateI) < new Date())){
                return false;
            }else{
                return true;
            }
        }
    }