module.exports =
    class Projects {
        constructor(id,proyectId, name, yeari, monthi, dayi,yearf, monthf, dayf, completed,hours,totalHours,completedHours) {
            this.id = id;
            this.proyectId = proyectId;
            this.name = name;
            this.yeari = yeari;
            this.monthi = monthi;
            this.dayi = dayi;
            this.yearf = yearf;
            this.monthf = monthf;
            this.dayf = dayf;
            this.completed = completed;
            this.hours = hours;
            this.totalHours = totalHours;
            this.completedHours = completedHours;
        }
       
    }