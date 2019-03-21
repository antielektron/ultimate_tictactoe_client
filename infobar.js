class Infobar
{
    constructor(parent)
    {
        this.parent = parent;
        this.container = document.createElement("div");
        this.container.className = "infobar-container";
        this.parent.appendChild(this.container);
    }

    create_infocontainer()
    {
        return new Infocontainer(this.container);
    }
}