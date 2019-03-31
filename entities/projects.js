module.exports =
    class Projects {
        constructor(id, name, description, planHours,deleted) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.planHours = planHours;
            this.deleted = deleted;
        }
        validar() {

            if ( this.id == undefined ||
                this.name == undefined ||
                this.description == undefined ||
                this.planHours == undefined ||
                this.deleted == undefined ) {

                return false;
            }
            else
                return true;

        }
    }