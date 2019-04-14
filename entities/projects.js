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
                this.name.trim() == "" ||
                this.description == undefined ||
                this.description.trim() == "" ||
                this.planHours == undefined ||
                this.planHours < 0 ||
                this.deleted == undefined ||
                typeof this.deleted !== "boolean") {

                return false;
            }
            else
                return true;

        }
    }