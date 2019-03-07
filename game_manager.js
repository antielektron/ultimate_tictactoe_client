class GameManager
{
    constructor(grid, n)
    {
        this.grid = grid;

        this.n = n;

        this.dummy_player = new Player("test_player", "rgb(0,128,0)");

        this.local_player_a = new Player("red player", "rgb(128,0,0)");
        this.local_player_b = new Player("green player", "rgb(0,128,0");

        this.grid.player_change_listener(this.dummy_player);

        // possible modes:
        // -- none
        // -- local
        // -- remote //TODO

        this.game_mode = "none";

        this.grid.register_click_callback((i,j,k,l) => this.click_listener(i,j,k,l));


    }

    click_listener(sub_x, sub_y, x,y)
    {
        // TODO: dummy
        console.log("click");

        var subgrid = this.grid.subgrids[sub_y][sub_x];
        var tile = subgrid.cells[y][x];
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
        this.grid.deactivate_all();
        this.grid.unblock_all();
    }

    end_game()
    {
        this.set_game_mode("none");
        this.grid.block_all();
    }

    on_local_game_move(sub_x, sub_y, x, y)
    {
        //checking whether one
    }
}