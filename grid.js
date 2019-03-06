class Grid
{
    constructor(n, grid_container_div, tile_width, tile_height, ground_color)
    {
        this.n = n;
        this.grid_container_div = grid_container_div;
        this.tile_width = tile_width;
        this.tile_height = tile_height;
        this.ground_color = ground_color;

        this.subgrids = []

        console.log("create grid of size " + this.n);

        this.create();
    }

    create()
    {
        var x,y;
        for (y = 0; y < this.n; y++)
        {
            var div_row = this.grid_container_div.appendChild(document.createElement("div"));
            var row = [];
            for (x = 0; x < this.n; x++)
            {
                var div_subgrid = div_row.appendChild(document.createElement("div"));
                div_subgrid.className = "subgrid-container";

                row.push(new Subgrid(this.n, x,y,div_subgrid,this.tile_width, this.tile_height, this.ground_color));
                row[x].register_click_callback((i,j,k,l) => this.click_listener(i,j,k,l));

            }

            this.subgrids.push(row);
        }
    }

    register_click_callback(func)
    {
        this.click_callback = func;
    }


    click_listener(sub_x, sub_y, x,y)
    {
        this.click_callback(sub_x, sub_y, x,y); 
    }

    player_change_listener(player)
    {
        var x,y;
        for (y = 0; y < this.n; y++)
        {
            for (x = 0; x < this.n; x++)
            {
                this.subgrids[y][x].player_change_listener(player);
            }
        }
    }

    activate_all()
    {
        var x,y;
        for (y = 0; y < this.n; y++)
        {
            for (x = 0; x < this.n; x++)
            {
                this.subgrids[y][x].activate_all();
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
                this.subgrids[y][x].deactivate_all();
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
                this.subgrids[y][x].block();
            }
        }
    }

    unblock()
    {
        var x,y;
        for (y = 0; y < this.n; y++)
        {
            for (x = 0; x < this.n; x++)
            {
                this.subgrids[y][x].unblock();
            }
        }
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
                this.subgrids[y][x].on_screen_orientation_change(tile_w, tile_h);
            }
        }
    }
}