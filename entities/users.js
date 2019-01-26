module.exports =
    class Users {
        constructor(id, username,password, firstName, lastName,token) {
            this.id = id;
            this.username = username;
            this.password = password;
            this.firstname = firstName;
            this.lastname = lastName;
            this.token = token;
            this.type = "users";
        }
       
    }