class GameManager
{
    constructor(grid)
    {
        this.grid = grid;

        this.dummy_player = new Player("test_player", "rgb(0,128,0)");

        this.grid.player_change_listener(this.dummy_player);

        // possible modes:
        // -- none
        // -- local
        // -- remote //TODO

        this.game_mode = "none";
    }

    register_game_mode_change_listener(func)
    {
        this.game_mode_change_listener = func;
    }

    set_game_mode(mode)
    {
        this.game_mode = mode;
        this.game_mode_change_listener(mode);
        console.log("changed gamemode to " + mode);
    }

    start_local_game()
    {
        this.set_game_mode("local");
        this.grid.unblock_all();
    }

    end_game()
    {
        this.set_game_mode("none");
    }
}