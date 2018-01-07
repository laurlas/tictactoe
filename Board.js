class Board {
    constructor(lines) {
        this.currentPlayer="x";
        this.currentGame="";
        if (typeof lines !== 'undefined') {
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

    drawBoard(myTurn) {
        let html = '<div class="board">' +
            '<div class="row">';

        for (let line = 0; line < this.lines.length; line++) {
            let extraClass = "";
            if (myTurn && this.lines[line] === "") {
                extraClass = " selectable";
            }
            html += '<div class="col-md-4 cell' + extraClass + '" data-index="'+line+'">';
            html += this.lines[line];
            html += '</div>';
        }
        html += '</div>' +
            '</div>';
        $('.board').remove();
        $('body').append(html);
    }
}

if (typeof global !== 'undefined') {
    global.Board = Board;
}