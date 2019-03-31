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
       
    }