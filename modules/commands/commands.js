class Command {
    prefix = "!";
    command = "cmd";
    input = "";
    constructor(data){
        this.input = data;
    };

    fullCommand() {
        return this.prefix + this.command;    
    }
}


class Join extends Command {
    constructor(){
        super();
        this.command = "join";
    }
}


class Leave extends Command {
    constructor(){
        super();
        this.command = "leave"
    }
}


class Pause extends Command {
    constructor(){
        super();
        this.command = "pause"
    }
}  


class Play extends Command {
    constructor(){
        super();
        this.command = "play"
    }
}


class Skip extends Command {
    constructor(){
        super();
        this.command = "skip"
    }
}

class SeekF extends Command {
    constructor(){
        super();
        this.command = "seekf"
    }
}


class SeekB extends Command {
    constructor(){
        super();
        this.command = "seekb[]"
    }
}

class Queue extends Command {
    constructor(){
        super();
        this.command = "queue"
    }
}

class ClearQueue extends Command {
    constructor(){
        super();
        this.command = "clearqueue"
    }
}


class Help extends Command {
    constructor(){
        super();
        this.command = "help"
    }
}


module.exports = {
    Join,
    Leave,
    Pause,
    Play,
    Skip,
    SeekF,
    SeekB,
    Queue,
    ClearQueue,
}