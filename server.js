require('./Board.js');
require('./Player.js');
require('./Game.js');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const mysql = require('mysql');

const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tictactoe"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

});

let players = [];
let games = [];

let count=0;
let gameCount=0;

wss.on('connection', function connection(ws) {
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
        if(msg.action==='existingGame'){
            players[id].name=msg.name;
            let game = findJoinableGame();
            if(game===false){
                sendRestart(players[id]);
            }
            else{
                if(game.x==""){
                    game.x=players[id];
                }
                else if(game.o==""){
                    game.o=players[id];
                }
                game.switchPlayers(false);
            }
        }
        else if(msg.action==='move'){
            if(games[msg.board.currentGame].board.moveIsValid(msg.board)){
                games[msg.board.currentGame].board.lines=msg.board.lines;
                let winner=games[msg.board.currentGame].board.gameEnded();

                if(winner!==false){
                    games[msg.board.currentGame].sendWinners(winner, con);
                }
                else{
                    games[msg.board.currentGame].switchPlayers(true);
                }
            }
            else{
                games[msg.board.currentGame].switchPlayers(false);
            }
        }
    });
    ws.on('close', function close(ws) {
        removePlayerFromGame(id);
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
function removePlayerFromGame(player) {
    for (game in games) {
        if (games[game].x.id === player) {
            games[game].x = "";
            break;
        }
        else if (games[game].o.id === player) {
            games[game].o = "";
            break;
        }
    }
}
function findJoinableGame(){
    for (game in games) {
        if(games[game].isEnded===false){
            if(games[game].x===""){
                return games[game];
                break;
            }
            else if(games[game].o===""){
                return games[game];
                break;
            }
        }
    }
    return false;
}
function sendRestart(player){
    player.ws.send(JSON.stringify({"action":"restart"}));
}