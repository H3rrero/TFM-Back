module.exports =
    class Usuario {
        constructor(id,projectId,username,password, firstName, lastName,rol,token,deleted) {
            this.id = id;
            this.username = username;
            this.password = password;
            this.firstname = firstName;
            this.lastname = lastName;
            this.token = token;
            this.projectId = projectId;
            this.rol = rol;
            this.deleted = deleted;
            this.type = "users";
        }
        validar() {

            if ( this.id == undefined ||
                this.username == undefined ||
                this.username.trim() == "" ||
                this.password == undefined ||
                this.password.trim() == "" ||
                this.firstname == undefined ||
                this.firstname.trim() == "" ||
                this.lastname == undefined ||
                this.lastname.trim() == "" ||
                this.rol == undefined ||
                this.rol.trim() == ""  ||
                typeof this.deleted !== "boolean" ||
                this.projectId < -1 ) {

                return false;
            }
            else
                return true;

        }
    }