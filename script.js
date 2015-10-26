var onPlayerClick = function(e) {
    if(e.currentTarget.classList.contains("buzzed")) {
       e.currentTarget.classList.remove("buzzed")
       e.currentTarget.classList.add("done");     
    }
    else {
        e.currentTarget.classList.add("done")
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
        e.currentTarget.classList.add("open")
    }
};


Array.prototype.forEach.call(document.getElementById("players").childNodes, function(player) {
  player.onclick = onPlayerClick;
});

Array.prototype.forEach.call(document.querySelectorAll(".card"), function(card) {
  card.onclick = onCardClick;
});
