class Subgrid
{
    constructor(n, sub_x, sub_y,subgrid_container_div, tile_width, tile_height, ground_color)
    {
        this.n = n;
        this.subgrid_container_div = subgrid_container_div;
        this.tile_height = tile_height;
        this.tile_width = tile_width;

        this.cells = [];

        this.sub_x = sub_x;
        this.sub_y = sub_y;

        this.ground_color = ground_color;

        this.create();
        this.block();

        console.log("new subgrid created");
    }

    create()
    {
        var x,y;
        for (y = 0; y < this.n; y++)
        {
            var div_row = this.subgrid_container_div.appendChild(document.createElement("div"));
            var row = [];
            for (x = 0; x < this.n; x++)
            {
                var div_button = div_row.appendChild(document.createElement("div"));
                div_button.className = "grid-tile";
                var button = document.createElement("button");
                button.className = "grid-button";
                div_button.appendChild(button);

                var b_x = x;
                var b_y = y;
                var b_w = this.tile_width;
                var b_h = this.tile_height;

                row.push(new Tile(b_x, b_y, b_w, b_h, button, this.ground_color, div_button));
                // TODO: register listener?
                row[x].register_click_callback((i,j) => this.click_listener(i,j));
                row[x].register_unlock_request_callback((i,j) => this.unlock_request_listener(i,j));
        
            }
            this.cells.push(row);
        }
    }

    register_click_callback(func)
    {
        this.click_callback = func;
    }


    click_listener(x,y)
    {
        this.click_callback(this.sub_x, this.sub_y, x, y); 
    }

    player_change_listener(player)
    {
        var x,y;
        for (y = 0; y < this.n; y++)
        {
            for (x = 0; x < this.n; x++)
            {
                this.cells[y][x].player_change_listener(player);
            }
        }
    }

    unlock_request_listener(x,y)
    {
        // TODO: unused so far

        //return this.unlock_request_callback(x,y);
        return false;
    }

    activate_all()
    {
        var x,y;
        for (y = 0; y < this.n; y++)
        {
            for (x = 0; x < this.n; x++)
            {
                this.cells[y][x].activate();
            }
        }
    }

    deactivate_all()
    {
        var x,y;
        for (y = 0; y < this.n; y++)
        {
            for (x = 0; x < this.n; x++)
            {
                this.cells[y][x].deactivate();
            }
        }
    }

    block()
    {
        var x,y;
        for (y = 0; y < this.n; y++)
        {
            for (x = 0; x < this.n; x++)
            {
                this.cells[y][x].lock();
            }
        }
        this.subgrid_container_div.className = "subgrid-container";
    }

    unblock()
    {
        var x,y;
        for (y = 0; y < this.n; y++)
        {
            for (x = 0; x < this.n; x++)
            {
                this.cells[y][x].unlock();
            }
        }
        this.subgrid_container_div.className = "subgrid-container-activated";
    }

    on_screen_orientation_change(tile_w,tile_h)
    {
        this.tile_width = tile_w;
        this.tile_h = tile_h;

        var x,y;
        for (y = 0; y < this.n; y++)
        {
            for (x = 0; x < this.n; x++)
            {
                this.cells[y][x].update_css_transform(tile_w, tile_h);
            }
        }
    }
}