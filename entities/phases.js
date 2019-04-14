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
                this.name.trim() == "" ||
                this.dateI == undefined ||
                new Date(this.dateI)  == 'Invalid Date' ||
                new Date(this.dateF)  == 'Invalid Date' || 
                this.dateF == undefined ||
                parseFloat(this.completed) == undefined ||
                parseFloat(this.completed) >= 0 ||
                this.hours == undefined ||
                this.hours < 0 ||
                this.totalHours == undefined ||
                this.totalHours < 0 ||
                this.completedHours == undefined ||
                this.completedHours < 0) {

                return false;
            }
            else
                return true;

        }
    }