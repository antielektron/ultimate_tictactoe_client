class LocalMatchManager
{
    constructor(grid, status_label, control_container)
    {
        this.grid = grid;
        this.status_label = status_label;

        this.control_container = control_container;

        this.control_container.show();

        this.local_player_a = new Player("red player", 255,0,0);
        this.local_player_b = new Player("green player", 0,255,0);
        this.is_local_player_a = false;

        this.grid.register_click_callback((i,j,k,l) => this.click_listener(i,j,k,l));

        this.grid.deactivate_all();
        this.grid.unblock_all();


        this.toggle_local_player();
    }

    click_listener(sub_x, sub_y, x,y)
    {
        // check whether the game is over:
        if (grid.is_won())
        {
            this.status_label.innerHTML = "" + grid.get_won_player().get_name() + " has won.";
            this.end_game();
        }
        else if (grid.is_complete())
        {
            this.status_label.innerHTML = "Draw. Everybody looses!";
            this.end_game();
        }
        else
        {
            this.toggle_local_player();
            this.grid.block_all()
            if (this.grid.subgrids[y][x].is_draw() || this.grid.subgrids[y][x].is_won())
            {
                this.grid.unblock_all_non_completed();
            }
            else
            {
                this.grid.subgrids[y][x].unblock();
            }
        }
    }

    toggle_local_player()
    {
        this.is_local_player_a = !this.is_local_player_a;
        var next_player = this.is_local_player_a ? this.local_player_a : this.local_player_b;
        
        this.status_label.innerHTML = "" + "it's " + next_player.get_name() + "'s turn...";
        this.grid.player_change_listener(next_player);
    }

    end_game()
    {
        this.status_label.innerHTML = "Game Over. Game Closed";
        this.grid.block_all();
    }

    
}