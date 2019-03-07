var style = getComputedStyle(document.body);
var n = style.getPropertyValue("--tictactoe_n");
var tilesize = style.getPropertyValue("--tile-size");
var default_opacity = style.getPropertyValue("--opacity");
var ground_color = style.getPropertyValue("--ground-color");

var create_game_container = document.getElementById("create-game-container");
var control_container = document.getElementById("control-container");
var info_container = document.getElementById("info-container");

var grid = new Grid(n, document.getElementById("grid-container"), tilesize, tilesize, ground_color);
var game_manager = new GameManager(grid);
var sidebar = new Sidebar(create_game_container, control_container, info_container, game_manager);

window.addEventListener("resize", function() {
    var tilesize = getComputedStyle(document.body).getPropertyValue("--tile-size");
    grid.on_screen_orientation_change(tilesize, tilesize);
})
