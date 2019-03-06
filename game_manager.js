class GameManager
{
    constructor(grid)
    {
        this.grid = grid;

        this.dummy_player = new Player("test_player", "rgb(0,128,0)");

        this.grid.player_change_listener(this.dummy_player);
    }
}