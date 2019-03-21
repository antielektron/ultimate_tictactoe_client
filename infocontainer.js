class Infocontainer
{
    constructor(parent)
    {
        this.parent = parent;
        this.container = document.createElement("div");
        this.container.className = "info-container";
        this.parent.appendChild(this.container);
    }

    create_button(text)
    {
        var b = document.createElement("button");
        b.className = "infobar-button";
        b.appendChild(document.createTextNode(text));
        this.container.appendChild(b)
        return b;
    }

    create_input(placeholder, pw=false)
    {
        var i = document.createElement("input");
        i.className = "infobar-input";
        i.placeholder = placeholder;
        i.type = pw ? "password" : "text"; 

        this.container.appendChild(i);
        return i;
    }

    create_label(text)
    {
        var l = document.createElement("label");
        l.className = "infobar-label";
        l.innerHTML = text;
        this.container.appendChild(l);
        return l;
    }

    hide()
    {
        this.container.style.display = "none";
    }

    show()
    {
        this.container.style.display = "inline-block";
    }
}