var style = getComputedStyle(document.body);
var n = style.getPropertyValue("--tictactoe_n");
var tilesize = style.getPropertyValue("--tile-size");
var default_opacity = style.getPropertyValue("--opacity");
var ground_color = style.getPropertyValue("--ground-color");
var main_container = document.getElementById("main-container");


var main_menu = new Infobar(main_container);
var grid = new Grid(n, main_container, tilesize, tilesize, ground_color);
var sub_menu = new Infobar(main_container);


// fill containers with buttons and containers:

// empty dummy container on top (to force other containers to be at the bottom)
dummy_main = main_menu.create_infocontainer();
dummy_sub = sub_menu.create_infocontainer();

// start container:
create_game_container = main_menu.create_infocontainer();
create_game_container.create_label("Start Local Game");
b_local_game = create_game_container.create_button("Local Game");

// register container:
register_container = main_menu.create_infocontainer();
register_container.create_label("Register or login to play online");
i_register_username = register_container.create_input("username");
i_register_pw = register_container.create_input("password", true);
b_register = register_container.create_button("register/login");

// logout:
logout_container = sub_menu.create_infocontainer();
l_username = logout_container.create_label("logged in as: ");
b_logout = logout_container.create_button("logout");


// match control
match_control = sub_menu.create_infocontainer();
b_end_game = match_control.create_button("End Game");

// fill subcontainer:
match_slot_container = sub_menu.create_infocontainer();
match_slot_container.create_label("online matches");

// search match:
search_match_container = main_menu.create_infocontainer();
search_match_container.create_label("Create Online Match");
b_match_search = search_match_container.create_button("random match");
search_match_container.create_label("<p> </p>");

l_match_op = search_match_container.create_input("player name");
b_match_invite = search_match_container.create_button("invite player");



//status:
status_container = main_menu.create_infocontainer();
l_status_head = status_container.create_label("status:");
l_status = status_container.create_label("...");

// global vars:

game_manager = null;

logged_in = false;

// connection stuff:

var connection = null;
var session_id = null;


// cookies:
function get_cookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function set_cookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function check_cookie(cname) {
    var tmp = get_cookie(cname);
    if (tmp != "") {
        return true;
    }
    return false;
}




// global funcs:

disable_all_containers = function()
{
    create_game_container.hide();
    register_container.hide();
    logout_container.hide();
    match_slot_container.hide();
    search_match_container.hide();
    match_control.hide();
    status_container.hide();

    dummy_main.hide();
    dummy_sub.hide();
}


end_local_game = function()
{
    disable_all_containers();
    create_game_container.show();
    status_container.show();
    if (logged_in)
    {
        logout_container.show();
        search_match_container.show();
        match_slot_container.show();
    }
    else
    {
        register_container.show();
    }
    
    game_manager = null;
}

on_close_click = function() {
    if (game_manager != null)
    {
        game_manager.end_game();
        end_local_game();
    }
    else if (connection != null)
    {
        connection.on_close_click();
        match_control.hide();
    }
}


start_local_game = function()
{
    console.log("clicked");
    disable_all_containers();
    match_control.show();
    dummy_main.show();
    dummy_sub.show();

    status_container.show();

    game_manager = new LocalMatchManager(grid, l_status, match_control, end_local_game);

}


// connection stuff:

login_callback = function()
{
    logged_in = true;
    if (game_manager != null)
    {
        game_manager.end_game();
        
    }
    end_local_game();
    l_username.innerHTML = "logged in as: " + connection.player.get_name();

    set_cookie("sessionid", connection.session_id, 30);

}

logout = function()
{
    logged_in = false;
    if (connection != null)
    {

        connection.close();
        if (check_cookie("sessionid"))
        {
            // delete session:
            session_id = get_cookie("sessionid");
            set_cookie("sessionid", session_id, -100);
            session_id = null;
        }

    }

    connection = null;
    grid.unblock_all();
    grid.deactivate_all();
    grid.block_all();
    end_local_game();
}

reconnect = function()
{
    if (check_cookie("sessionid"))
    {
        session_id = get_cookie("sessionid");
        if (connection != null)
        {
            connection.close();
        }
        connection = new WebsocketConnection(server_url, server_port, grid, l_status, match_slot_container, match_control, login_callback, on_connection_error);
        connection.reconnect(session_id);
    }
}

on_connection_error = function()
{
    connection = null;
    logout();
}

login = function(){

    if (connection != null)
    {
        connection.close();
    }
    connection = new WebsocketConnection(server_url, server_port, grid, l_status, match_slot_container, match_control, login_callback, on_connection_error);
    connection.connect(i_register_username.value, i_register_pw.value);
}

search_match = function()
{
    if (connection != null)
    {
        connection.send_match_request(null);
    }
}

invite_player = function()
{
    if (connection != null)
    {
        if (l_match_op.value == "")
        {
            l_status.innerHTML = "choose your opponent first!";
        }
        else
        {
            connection.send_match_request(l_match_op.value);
        }
    }
}

// initiate stuff and connect events:

end_local_game();


b_local_game.addEventListener("click", start_local_game);
b_end_game.addEventListener("click", on_close_click);
b_register.addEventListener("click", login);
b_logout.addEventListener("click", logout);

b_match_search.addEventListener("click", search_match);
b_match_invite.addEventListener("click", invite_player);

reconnect();

// register resize event:

window.addEventListener("resize", function() {
    var tilesize = getComputedStyle(document.body).getPropertyValue("--tile-size");
    grid.on_screen_orientation_change(tilesize, tilesize);
});

window.onload = function() { 
    window.onfocus = function() {
        if (session_id != null && connection == null)
        {
            reconnect();
        }
    };
};

