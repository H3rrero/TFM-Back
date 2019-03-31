module.exports =
    class Phase {
        constructor(id,proyectId, name, dateI,dateF,completed,hours,totalHours,completedHours) {
            this.id = id;
            this.proyectId = proyectId;
            this.name = name;
            this.dateI = dateI;
            this.dateF = dateF;
            this.completed = completed;
            this.hours = hours;
            this.totalHours = totalHours;
            this.completedHours = completedHours;
        }
        validar() {

            if ( this.id == undefined ||
                this.proyectId == undefined ||
                this.name == undefined ||
                this.dateI == undefined ||
                this.dateF == undefined ||
                this.completed == undefined ||
                this.hours == undefined ||
                this.totalHours == undefined ||
                this.completedHours == undefined) {

                return false;
            }
            else
                return true;

        }
    }