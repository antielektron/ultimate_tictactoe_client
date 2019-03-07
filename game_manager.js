class GameManager
{
    constructor(grid, n)
    {
        this.grid = grid;

        this.n = n;

        this.dummy_player = new Player("test_player", "rgb(0,128,0)");

        this.local_player_a = new Player("red player", "rgb(128,0,0)");
        this.local_player_b = new Player("green player", "rgb(0,128,0");
        this.is_local_player_a = false;;

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
        if (this.game_mode == "local")
        {
            // check whether the game is over:
            if (grid.is_won())
            {
                this.status_change_listener("" + grid.get_won_player().get_name() + " has won.")
                this.end_game();
            }
            else
            {
                this.toggle_local_player();
            }
        }
    }

    register_game_mode_change_listener(func)
    {
        this.game_mode_change_listener = func;
    }

    register_status_change_listener(func)
    {
        this.status_change_listener = func;
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

        this.is_local_player_a = false;

        this.toggle_local_player();

    }

    toggle_local_player()
    {
        this.is_local_player_a = !this.is_local_player_a;
        var next_player = this.is_local_player_a ? this.local_player_a : this.local_player_b;
        
        this.status_change_listener("" + "it's " + next_player.get_name() + "s turn...");
        this.grid.player_change_listener(next_player);
    }

    end_game()
    {
        this.set_game_mode("none");
        this.grid.block_all();
    }
}