var blockBuzz = true,
    answerValue = 0;

var onKeyPress = function(e) {
    if(e.keyCode > 48 && e.keyCode < 52) {
        triggerPlayer(e.keyCode - 48);
    }
};

var onPlayerClick = function(e) {    
    if(e.currentTarget.classList.contains("buzzed")) {
        e.currentTarget.children[1].textContent = parseInt(e.currentTarget.children[1].textContent, 10) + answerValue;
        e.currentTarget.classList.remove("buzzed");
        answerValue = 0;
    }
    else {
        try {
            document.querySelector(".buzzed").classList.remove("buzzed");
            blockBuzz = false;
        }
        catch(e) {}
    }
};

var onCardClick = function(e) {
    if(e.currentTarget.classList.contains("open")) {
       e.currentTarget.classList.remove("open")
       e.currentTarget.classList.add("show");     
    }
    else if(e.currentTarget.classList.contains("show")) {
       e.currentTarget.classList.remove("show")
       e.currentTarget.classList.add("done");     
    }
    else {
        var x = e.currentTarget.offsetLeft + e.currentTarget.offsetWidth / 2;
        var y = e.currentTarget.offsetTop + e.currentTarget.offsetHeight / 2;
        e.currentTarget.children[2].style.transformOrigin = x + "px " + y + "px 0px";
        e.currentTarget.classList.add("open");
        blockBuzz = false;
        answerValue = parseInt(e.currentTarget.children[0].textContent, 10);
    }
    
    Array.prototype.forEach.call(document.querySelectorAll("#players input"), function(input) {
        input.readOnly = true;
    });
};

var triggerPlayer = function(player_number) { // player_numbers: 1, 2, 3
    if(blockBuzz) {
        return;
    }

    blockBuzz = true;
    document.getElementById("player" + player_number).classList.add("buzzed");
}

document.onkeypress = onKeyPress;

Array.prototype.forEach.call(document.getElementById("players").childNodes, function(player) {
    player.onclick = onPlayerClick;
});

Array.prototype.forEach.call(document.querySelectorAll(".card"), function(card) {
    card.onclick = onCardClick;
});
