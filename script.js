var blockBuzz = true,
    answerValue = 0;

var onKeyPress = function(e) {
    if(e.keyCode > 48 && e.keyCode < 52) {
        triggerPlayer(e.keyCode - 48);
    }
};

var onPlayerClick = function(e) {    
    if(e.currentTarget.classList.contains("buzzed")) {
        e.currentTarget.children[1].textContent = e.currentTarget.children[1].textContent|0 + answerValue;
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
       e.currentTarget.classList.add("done");     
    }
    else {
        var x = e.currentTarget.offsetLeft + e.currentTarget.offsetWidth / 2;
        var y = e.currentTarget.offsetTop + e.currentTarget.offsetHeight / 2;
        e.currentTarget.children[1].style.transformOrigin = x + "px " + y + "px 0px";
        e.currentTarget.classList.add("open");
        blockBuzz = false;
        answerValue = e.currentTarget.children[0].textContent;
    }
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
