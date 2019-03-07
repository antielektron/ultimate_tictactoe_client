class Player
{
    constructor(name, color)
    {
        this.name = name;
        this.color = color;
        this.id = name;
    }

    set_name(name)
    {
        this.name = name;
    }

    set_color(color)
    {
        this.color = color;
    }

    get_name()
    {
        return this.name;
    }

    get_id()
    {
        return this.id;
    }

    get_color()
    {
        return this.color;
    }


}