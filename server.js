const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({server});
let players = [];
let games = [];

let count=0;
let gameCount=0;

wss.on('connection', function connection(ws) {
    ws.player='none';
    ws.partner='none';
    let id = count++;
    players[id]=new Player(id, ws);

    ws.on('message', function incoming(message) {
        msg=JSON.parse(message);
        if(msg.action==='newGame'){
            players[id].name=msg.name;
            let pair = assignplayers();
            if(pair) {
                let gameId = count++;
                gameCount++;
                games[gameId]= new Game(gameCount, players[pair.x], players[pair.o]);
                games[gameId].start();
            }
        }
    });
    ws.on('close', function close(ws) {
        delete players[id];
        console.log('close');
    });
});

server.listen(8098, function listening() {
    console.log('Listening on %d', server.address().port);
});

function assignplayers(){
    let count=0;
    let x={};
    let o={};
    for (player in players) {
        if(players[player].assigned===false && players[player].name!==""){
            if(count===0){
                x=player;
                count++;
            }
            else if(count===1){
                o=player;
                count++;
                break;
            }
        }
    }
    if(count===2){
        return {'x':x,'o':o};
    }
    else{
        return false;
    }
}
class Game{
    constructor(id,x,o) {
        this.id= id;
        this.board= new Board();
        this.x= x;
        this.o= o;
        this.x.assigned=true;
        this.o.assigned=true;
        console.log(players);
    }
    start(){
        this.x.send(JSON.stringify({"action":"start","player":"x","game":this.id}));
        this.o.send(JSON.stringify({"action":"start","player":"o","game":this.id}));
    }
}
class Player{
    constructor(id,ws , name) {
        this.id=id;
        this.ws=ws;
        this.assigned=false;
        if(typeof name !== 'undefined'){
            this.name = name;
        }
        else {
            this.name = "";
        }
    }
}
class Board {
    constructor(lines) {
        if(typeof lines !== 'undefined'){
            this.lines = lines;
        }
        else {
            this.lines = [
                "", "", "",
                "", "", "",
                "", "", ""
            ];
        }
    }

}