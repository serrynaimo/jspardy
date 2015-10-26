var onPlayerClick = function(e) {
  e.currentTarget.classList.toggle("buzzed");  
};

var onCardClick = function(e) {
  e.currentTarget.classList.toggle("open");  
};


Array.prototype.forEach.call(document.getElementById("players").childNodes, function(player) {
  player.onclick = onPlayerClick;
});

Array.prototype.forEach.call(document.querySelectorAll(".card"), function(card) {
  card.onclick = onCardClick;
});
