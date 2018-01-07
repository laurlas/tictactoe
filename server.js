require('./Board.js');
require('./Player.js');
require('./Game.js');
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
                let gameId = gameCount++;
                games[gameId]= new Game(gameId, players[pair.x], players[pair.o]);
                games[gameId].start();
            }
        }
        else if(msg.action==='move'){
            games[msg.board.currentGame].board.lines=msg.board.lines;
            games[msg.board.currentGame].continue();
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

