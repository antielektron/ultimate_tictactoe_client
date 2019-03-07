class Sidebar
{
    constructor(create_game_container, control_container, info_container, game_manager)
    {
        this.create_game_container = create_game_container;
        this.control_container = control_container;
        this.info_container = info_container;

        this.game_manager = game_manager;

        this.fill_containers();
        this.bind_events();

        this.activate_create_game();
    }

    create_button(text)
    {
        var b = document.createElement("button");
        b.className = "sidebar-button";
        b.appendChild(document.createTextNode(text));
        return b;
    }

    create_label(text)
    {
        var l = document.createElement("label");
        l.className = "sidebar-label";
        l.innerHTML = text;
        return l;
    }

    fill_containers()
    {

        // create new game area:
        this.create_game_container.appendChild(this.create_label("Start new game"));
        this.b_local = this.create_button("local game")
        this.create_game_container.appendChild(this.b_local);

        this.create_game_container.style.display = "none";

        // control area:

        this.b_end_game = this.create_button("end game");
        this.control_container.appendChild(this.b_end_game);

        this.control_container.style.display = "none";


        // status area:
        this.info_container.appendChild(this.create_label("status"));

        this.status_text = this.create_label("select gamemode");
        this.info_container.appendChild(this.status_text);

        this.info_container.style.display = "none";



    }

    bind_events()
    {
        // TODO
        this.game_manager.register_game_mode_change_listener((c) => this.game_mode_change_listener(c));
        this.game_manager.register_status_change_listener((c) => this.status_change_listener(c));

        this.b_local.addEventListener("click", () => this.game_manager.start_local_game());
        this.b_end_game.addEventListener("click", () => this.game_manager.end_game());
    }

    set_status(text)
    {
        this.status_text.innerHTML = text;
    }

    activate_create_game()
    {
        this.create_game_container.style.display = "inline-block";
    }

    activate_control()
    {
        this.control_container.style.display = "inline-block";
    }

    activate_info()
    {
        this.info_container.style.display = "inline-block";
    }

    deactivate_create_game()
    {
        this.create_game_container.style.display = "none";
    }

    deactivate_control()
    {
        this.control_container.style.display = "none";
    }

    deactivate_info()
    {
        this.info_container.style.display = "none";
    }

    game_mode_change_listener(gamemode)
    {
        if (gamemode == "none")
        {
            this.activate_create_game();
            this.deactivate_control();
            this.activate_info();
            return
        }
        if (gamemode == "local")
        {
            this.deactivate_create_game();
            this.activate_control();
            this.activate_info();
        }
    }

    status_change_listener(statustext)
    {
        this.status_text.innerHTML = statustext;
    }



}