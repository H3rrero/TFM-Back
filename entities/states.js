module.exports =
    class States {
        constructor(id, name) {
            this.id = id;
            this.name = name;
        }
        validar() {

            if ( this.id == undefined ||
                this.name == undefined ||
                this.name.trim() == "" ) {

                return false;
            }
            else
                return true;

        }
    }