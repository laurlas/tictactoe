$(document).ready(function() {
    let ws = new WebSocket('ws://localhost:8098');

    ws.onmessage = function (response) {
        if (response.data) {
            console.log(response.data);
        }
    };
});

