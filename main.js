var style = getComputedStyle(document.body);
var n = style.getPropertyValue("--tictactoe_n");
var tilesize = style.getPropertyValue("--tile-size");
var default_opacity = style.getPropertyValue("--opacity");
var ground_color = style.getPropertyValue("--ground-color");

var grid = new Grid(n, document.getElementById("grid-container"), tilesize, tilesize, ground_color);
var game_manager = new GameManager(grid);

window.addEventListener("resize", function() {
    var tilesize = getComputedStyle(document.body).getPropertyValue("--tile-size");
    grid.on_screen_orientation_change(tilesize, tilesize);
})
