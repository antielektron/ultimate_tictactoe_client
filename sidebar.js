class Sidebar
{
    constructor(create_game_container, setting_container, control_container, info_container, game_manager)
    {
        this.create_game_container = create_game_container;
        this.setting_container = setting_container;
        this.control_container = control_container;
        this.info_container = info_container;

        this.game_manager = game_manager;

        this.fill_containers();
        this.bind_events();

        this.activate_create_game();
        this.activate_setting();
        this.activate_info();
    }

    create_button(text)
    {
        var b = document.createElement("button");
        b.className = "sidebar-button";
        b.appendChild(document.createTextNode(text));
        return b;
    }

    create_input(text)
    {
        var i = document.createElement("input");
        i.className = "sidebar-input";
        i.type = "text";
        i.value = text;
        return i;
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
        this.create_game_container.appendChild(this.create_label("Choose game type"));
        this.b_local = this.create_button("local game")
        this.create_game_container.appendChild(this.b_local);

        this.b_remote = this.create_button("remote game");
        this.create_game_container.appendChild(this.b_remote);

        this.create_game_container.style.display = "none";


        // settings area
        this.setting_container.appendChild(this.create_label("select online name:"));

        this.i_player_name = this.create_input("");
        this.setting_container.appendChild(this.i_player_name);

        this.setting_container.style.display = "none";

        // control area:

        this.b_end_game = this.create_button("end game");
        this.control_container.appendChild(this.b_end_game);

        this.control_container.style.display = "none";


        // status area:
        this.status_title = this.create_label("");
        this.info_container.appendChild(this.status_title);

        this.status_text = this.create_label("select gamemode. <br> <a href=https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe#Rules>here are the rules </a>");
        this.info_container.appendChild(this.status_text);

        this.info_container.style.display = "none";



    }

    bind_events()
    {
        // TODO
        this.game_manager.register_game_mode_change_listener((c) => this.game_mode_change_listener(c));
        this.game_manager.register_status_change_listener((c,t=null) => this.status_change_listener(c, t));

        this.b_local.addEventListener("click", () => this.game_manager.start_local_game());
        this.b_end_game.addEventListener("click", () => this.game_manager.end_game(true));
        this.b_remote.addEventListener("click", () => this.game_manager.register_remote_game(this.get_player_name()));
    }

    set_status(text)
    {
        this.status_text.innerHTML = text;
    }

    get_player_name()
    {
        return this.i_player_name.value;
    }

    activate_create_game()
    {
        this.create_game_container.style.display = "inline-block";
    }

    activate_setting()
    {
        this.setting_container.style.display = "inline-block";
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

    deactivate_setting()
    {
        this.setting_container.style.display = "none";
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
            this.activate_setting();
            this.deactivate_control();
            this.activate_info();
            return
        }
        if (gamemode == "local")
        {
            this.deactivate_create_game();
            this.deactivate_setting();
            this.activate_control();
            this.activate_info();
        }
        if (gamemode == "remote")
        {
            this.deactivate_create_game();
            this.deactivate_setting();
            this.activate_control();
            this.activate_info();
        }
    }

    status_change_listener(statustext, title=null)
    {
        this.status_text.innerHTML = statustext;
        if (title != null)
        {
            this.status_title.innerHTML = "<p>" + title + "</p>";
        }
    }

}