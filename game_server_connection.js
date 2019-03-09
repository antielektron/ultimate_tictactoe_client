class GameServerConnection
{
    constructor(ip, port)
    {
        this.ip = ip;
        this.port = port;
        this.player = null;
        this.socket = null;
        this.registered = false;

        this.game_manager = null;
        this.connected = false;
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

    on_open(callback_func)
    {
        // TODO
        console.log("connected to " + this.ip + ":" + this.port);
        this.connected = true;
        callback_func();
    }

    on_close()
    {
        this.game_manager.end_game_listener()
    }

    on_error()
    {
        console.log("error in websocket connection");
        this.game_manager.connection_error_listener();
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

        switch(msg.type)
        {
            case "register_response":
                this.on_register_response(msg.data);
                break;
            
            case "game_starts":
                this.on_game_starts(msg.data);
                break;
            
            case "move":
                this.on_move(msg.data);
                break;
            
            case "move_response":
                this.on_move_response(msg.data);
                break;
            
            case "end_game":
                this.on_end_game(msg.data);
                break;
        }

    }

    on_register_response(data)
    {
        var success = data.success;
        this.game_manager.register_response_listener(success);

        if (!success)
        {
            this.socket.close();
        }
    }

    on_game_starts(data)
    {
        var op_name = data.opponent_name;
        var is_first_move = data.is_first_move;

        this.game_manager.start_game_listener(op_name, is_first_move);
    }

    on_move(data)
    {
        var sub_x = data.sub_x;
        var sub_y = data.sub_y;
        var x = data.x;
        var y = data.y;

        this.game_manager.move_listener(sub_x, sub_y, x, y);
    }

    on_move_response(data)
    {
        if (data.success)
        {
            console.log("move accepted");
        }
        else
        {
            console.error("move not accepted");
        }
    }

    on_end_game(data)
    {
        this.game_manager.end_game_listener();
        this.close();
    }

    connect(callback_func)
    {
        this.socket = new WebSocket("ws://" + this.ip + ":" + this.port);
        this.socket.onmessage = (e => this.on_message(e));
        this.socket.onopen = (() => this.on_open(callback_func));
        this.socket.onerror = (() => this.on_error());
        this.socket.onclose = (() => this.on_close());
    }

    send_move(sub_x, sub_y, x, y)
    {
        var msg_object = {
            type: "move",
            data: {
                sub_x: "" + sub_x,
                sub_y: "" + sub_y,
                x: "" + x,
                y: "" + y
            }
        };

        this.socket.send(JSON.stringify(msg_object));
    }

    register()
    {
        // register for game queue
        var msg_object = {
            type: "register",
            data: {
                id: this.player.get_id(),
                name: this.player.get_name()
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
        if (this.is_connected)
        {
            this.is_connected = false;
            this.socket.close();
        }
    }
}