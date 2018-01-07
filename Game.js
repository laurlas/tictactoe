class Game{
    constructor(id,x,o) {
        this.id= id;
        this.board= new Board();
        this.board.currentGame=this.id;
        this.x= x;
        this.o= o;
        this.x.assigned=true;
        this.o.assigned=true;
        this.turn="x";
    }
    start(){
        this.x.ws.send(JSON.stringify({"action":"start","board":this.board, "turn":this.turn}));
        this.board.currentPlayer="o";
        this.o.ws.send(JSON.stringify({"action":"start","board":this.board, "turn":this.turn}));
    }
    continue(){
        if(this.turn==="x"){
            this.turn="o"
        }
        else {
            this.turn="x"
        }
        this.board.currentPlayer="x";
        this.x.ws.send(JSON.stringify({"action":"continue","board":this.board, "turn":this.turn}));
        this.board.currentPlayer="o";
        this.o.ws.send(JSON.stringify({"action":"continue","board":this.board, "turn":this.turn}));
    }
}

if (typeof global !== 'undefined') {
    global.Game = Game;
}