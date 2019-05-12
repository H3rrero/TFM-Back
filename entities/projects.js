module.exports =
    class Projects {
        constructor(id, name, description, planHours,fechaInicio, fechaFin, deleted) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.planHours = planHours;
            this.fechaInicio = fechaInicio;
            this.fechaFin = fechaFin;
            this.deleted = deleted;
        }
        validar() {

            if ( this.id == undefined ||
                this.name == undefined ||
                this.name.trim() == "" ||
                this.description == undefined ||
                this.description.trim() == "" ||
                this.planHours == undefined ||
                this.planHours < 0 ||
                this.deleted == undefined ||
                this.fechaInicio == undefined ||
                new Date(this.fechaInicio)  == 'Invalid Date' ||
                new Date(this.fechaFin)  == 'Invalid Date' || 
                this.fechaFin == undefined ||
                typeof this.deleted !== "boolean") {

                return false;
            }
            else
                return true;

        }
    }