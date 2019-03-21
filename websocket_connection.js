class WebsocketConnection
{
    constructor(ip, port, grid, status_label, matches_container, control_container, login_callback_func, error_callback_func)
    {
        this.ip = ip;
        this.port = port;
        this.session_id = null;
        this.player = new Player("player", 128, 0,0);
        this.socket = null;
        this.registered = false;

        this.grid = grid;
        this.status_label = status_label;
        this.matches_container = matches_container;
        this.control_container = control_container;

        this.active_match = null;

        this.connected = false;

        this.current_end_button = null;

        this.login_callback_func = login_callback_func;

        this.openmatches = {};
        this.error_callback_func = error_callback_func;

        this.closed_by_user = false;

        matches_container.hide();


    }

    set_player(p)
    {
        this.player = p;
    }

    set_game_manager(gm)
    {
        this.game_manager = gm;
    }

    is_registered()
    {
        return this.registered;
    }

    is_connected()
    {
        return this.connected;
    }

    on_open(username, pw)
    {
        this.connected = true;
        this.login(username, pw)
    }

    on_reopen(session_id)
    {
        this.connected = true;
        this.relogin(session_id);
    }

    on_close()
    {
        this.registered = false;
        this.connected = false;
        if (!this.closed_by_user)
        {
            this.status_label.innerHTML = "connection to server closed";
            this.error_callback_func();
        }
        
    }

    on_error()
    {
        console.log("error in websocket connection");
        this.registered = false;
        this.connected = false;
        if (!this.closed_by_user)
        {
            this.status_label.innerHTML = "connection to server lost";
            this.error_callback_func();
        }
    }

    
    on_message(event)
    {
        var json_msg = event.data;
        var msg = JSON.parse(json_msg);

        if (!msg.hasOwnProperty("type") || !msg.hasOwnProperty("data"))
        {
            console.log("received wrong formatted message");
            return;
        }

        console.log("raw_msg: " + json_msg);

        switch(msg.type)
        {
            case "login_response":
                this.on_register_response(msg.data);
                break;
            
            case "reconnect_response":
                this.on_reconnect_response(msg.data);
                break;
            
            case "match_update":
                this.on_match_update(msg.data);
                break;
            
            case "match_request_response":
                this.on_match_request_response(msg.data);
                break;
        }

    }

    set_active_match(id)
    {
        this.active_match = id;
    }

    on_close_click()
    {
        if (this.active_match != null && (this.active_match in this.openmatches))
        {
            this.openmatches[this.active_match].on_user_close();


        }

        if (this.current_end_button != null)
        {
            this.control_container.container.deleteChild(this.current_end_button);
            this.current_end_button = null;
        }
    }


    on_match_update(data)
    {
        var id = data.id
        var match_state = data.match_state;

        if (match_state == null)
        {
            // checking whether we can delete our dict object
            if (id in this.openmatches)
            {
                delete this.openmatches[id];
                if (this.active_match == id)
                {
                    if (this.current_end_button != null)
                    {
                        this.control_container.container.deleteChild(this.current_end_button);
                        this.current_end_button = null;
                    }

                }
            }
        }
        else
        {
            if (id in this.openmatches)
            {
                this.openmatches[id].update_match_state(match_state)
                if (this.active_match == id)
                {
                    this.openmatches[id].open_match();
                }
            }
            else
            {
                if (!match_state.game_over)
                {
                    this.openmatches[id] = new OnlineMatchManager(this.grid, this.status_label, this.matches_container, this.control_container, this, id, match_state, this.player.get_name());
                    if (match_state.last_move == null)
                    {
                        this.notify("new Game against " + this.openmatches[id].online_opponent.get_name());
                    }
                }
                
            }
        }
    }
    

    on_register_response(data)
    {
        if (data.success)
        {
            this.registered = true;
            this.session_id = data.id;
            this.login_callback_func();
        }
        this.status_label.innerHTML = data.msg;
        
    }

    on_reconnect_response(data)
    {
        if (data.success)
        {
            this.registered = true;
            this.session_id = data.id;
            this.player.set_name(data.user);
            this.login_callback_func();
        }

        this.status_label.innerHTML = data.msg;
    }

    on_match_request_response(data)
    {
        if (data.success)
        {
            this.status_label.innerHTML = "match request sent";
        }
        else
        {
            this.status_label.innerHTML = "could not send request: " + data.msg;
        }
    }


    connect(username, pw)
    {
        this.socket = new WebSocket(server_protocol + this.ip + ":" + this.port);
        this.socket.onmessage = (e => this.on_message(e));
        this.socket.onopen = (() => this.on_open(username, pw));
        this.socket.onerror = (() => this.on_error());
        this.socket.onclose = (() => this.on_close());
    }

    reconnect(session_id)
    {
        this.socket = new WebSocket(server_protocol + this.ip + ":" + this.port);
        this.socket.onmessage = (e => this.on_message(e));
        this.socket.onopen = (() => this.on_reopen(session_id));
        this.socket.onerror = (() => this.on_error());
        this.socket.onclose = (() => this.on_close());
    }

    send_move(sub_x, sub_y, x, y, match_id)
    {
        var msg_object = {
            type: "move",
            data: {
                id: match_id,
                sub_x: "" + sub_x,
                sub_y: "" + sub_y,
                x: "" + x,
                y: "" + y
            }
        };

        this.socket.send(JSON.stringify(msg_object));
    }

    send_end_match(match_id)
    {
        var msg_object = {
            type: "end_match",
            data: {
                id: match_id,
            }
        };

        this.socket.send(JSON.stringify(msg_object));

    }

    send_match_request(player_name)
    {
        var msg_object = {
            type: "match_request",
            data: {
                player: player_name
            }
        };
        this.socket.send(JSON.stringify(msg_object));
    }

    login(username, pw)
    {
        this.player.set_name(username);
        // register for game queue
        var msg_object = {
            type: "login",
            data: {
                name: this.player.get_name(),
                pw: pw
            }
        };

        this.socket.send(JSON.stringify(msg_object));
    }

    relogin(session_id)
    {
        // register for game queue
        var msg_object = {
            type: "reconnect",
            data: {
                id: session_id
            }
        };

        this.socket.send(JSON.stringify(msg_object));
    }

    send_disconnect()
    {
        if (!this.is_connected)
        {
            return;
        }
        var msg_object = {
            type: "end_game",
            data: {
                msg: ""
            }
        };

        this.socket.send(JSON.stringify(msg_object));
    }

    close()
    {
        for (var key in this.openmatches)
        {
            this.openmatches[key].remove_match();
        }
        this.status_label.innerHTML = "logged out";
        this.closed_by_user = true;
        this.socket.close();
    }

    notify(text) {
        
        Notification.requestPermission(function(result) {
            if (result === 'granted') {
                navigator.serviceWorker.ready.then(function(registration) {
                registration.showNotification(text, {
                        icon: './icon.png',
                        vibrate: [200, 200],
                        tag: "tictactoe-notification"
                    });
                });
            }
        });
      
    }
}
