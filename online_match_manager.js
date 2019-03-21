class OnlineMatchManager
{
    constructor(grid, status_label, matches_container, control_container, game_server_connection, match_id, match_state, player_name)
    {
        this.grid = grid;
        this.status_label = status_label;

        this.match_id = match_id;

        this.game_server_connection = game_server_connection;


        this.match_state = match_state;
        this.player_name = player_name

        var player_a = this.match_state.player_a;
        var player_b = this.match_state.player_b;

        this.online_opponent = new Player(player_a == this.player_name ? player_b : player_a, 255,0,0);
        this.local_player = new Player(this.player_name, 0,255,0);

        // create match button in match list:
        this.control_container = control_container;
        this.matches_container = matches_container
        this.match_button = matches_container.create_button("" + this.online_opponent.get_name());
        this.match_button.addEventListener("click", () => this.open_match());
        this.match_button.style.background = "rbg(0,255,0)";

        this.match_button.className = "infobar-button-active";

        this.is_closed = false;

    }

    click_listener(sub_x, sub_y, x,y)
    {
        this.grid.block_all();

        this.game_server_connection.send_move(sub_x, sub_y, x, y, this.match_id);

        this.status_label.innerHTML = "waiting for " + this.online_opponent.get_name() + "'s move";
    }

    on_user_close()
    {

        // send end match message:
        if (!this.match_state.game_over)
        {
            this.game_server_connection.send_end_match(this.match_id);
        }

        this.matches_container.container.removeChild(this.match_button);
        this.status_label.innerHTML = "match is closed";
        this.control_container.hide();
        this.is_closed = true;
        
    }

    remove_match()
    {
        if (!this.is_closed)
        {
            this.matches_container.container.removeChild(this.match_button);
        }
    }

    update_match_state(match_state)
    {
        this.match_state = match_state;
        this.match_button.className = "infobar-button-active";

        if (this.match_state.active_player == this.local_player.get_name())
        {
            this.game_server_connection.notify("your turn against " + this.online_opponent.get_name());
        }
    }

    open_match()
    {
        this.grid.register_click_callback(null);

        this.grid.deactivate_all();
        this.grid.unblock_all();

        this.match_button.className = "infobar-button";

        this.game_server_connection.set_active_match(this.match_id);

        this.control_container.show();

        var complete_field = this.match_state.complete_field;
        var global_field = this.match_state.global_field;

        var sub_x = null;
        var sub_y = null;
        var x = null;
        var y = null;        

        if (this.match_state.last_move != null)
        {
            sub_x = this.match_state.last_move.sub_x;
            sub_y = this.match_state.last_move.sub_y;
            x = this.match_state.last_move.x;
            y = this.match_state.last_move.y;
        }

        var game_over = this.match_state.game_over;
        var player_won = this.match_state.player_won;
        var current_player_name = this.match_state.active_player;

        var player_a = this.match_state.player_a;
        var player_b = this.match_state.player_b;

        console.log(game_over);
        console.log(current_player);

        var FIELD_EMPTY = 0
        var FIELD_USER = player_a == this.player_name ? 1 : 2;
        var FIELD_OPPONENT = player_a == this.player_name ? 2 : 1;
        var FIELD_DRAW = 3

        this.online_opponent = new Player(player_a == this.player_name ? player_b : player_a, 255,0,0);
        this.local_player = new Player(this.player_name, 0,255,0);

        var i,j;
        for(j = 0; j < 9; j++)
        {
            for(i = 0; i < 9; i++)
            {
                var si = Math.floor(i / 3);
                var sj = Math.floor(j / 3);
                if (complete_field[j][i] == FIELD_USER)
                {
                    this.grid.subgrids[sj][si].player_change_listener(this.local_player);
                    this.grid.subgrids[sj][si].cells[j % 3][i % 3].on_click();
                }
                if (complete_field[j][i] == FIELD_OPPONENT)
                {
                    this.grid.subgrids[sj][si].player_change_listener(this.online_opponent);
                    this.grid.subgrids[sj][si].cells[j % 3][i % 3].on_click();
                }
            }
        }

        this.grid.block_all();
        this.grid.register_click_callback((i,j,k,l) => this.click_listener(i,j,k,l));

        if (game_over && player_won != null)
        {
            if (player_won == this.player_name)
            {
                this.status_label.innerHTML = "Congratulation, you won!";
            }
            else
            {
                this.status_label.innerHTML = "Game over, you lost!";
            }
            return;
        }
        else if(game_over)
        {
            this.status_label.innerHTML = "Game was closed by server or opponent";
            return;
        }

        var current_player = this.player_name == current_player_name ? this.local_player : this.online_opponent;
        this.grid.player_change_listener(current_player);

        
        if (this.player_name == current_player_name)
        {
            
            if (this.match_state.last_move != null)
            {
                if (this.grid.subgrids[y][x].is_won() || this.grid.subgrids[y][x].is_draw())
                {
                    this.grid.unblock_all_non_completed();
                }
                else
                {
                    this.grid.unblock(x,y);
                }
                this.status_label.innerHTML = "It's your turn!";
            }
            else
            {
                this.grid.unblock_all();
            }
        }
        else
        {
            this.status_label.innerHTML = "waiting for " + this.online_opponent.get_name() + "'s move";
        }

        

    }
}