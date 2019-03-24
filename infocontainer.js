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

    create_double_button(text, option)
    {
        var div = document.createElement("div");
        div.className = "option-button-container";
        var b1 = document.createElement("button");
        var b2 = document.createElement("button");

        b1.style.width = "10%";

        b1.className = "infobar-button";
        b2.className = "infobar-button";

        b1.style.width = "80%";
        b2.style.width = "20%";
        

        b1.appendChild(document.createTextNode(text));
        b2.appendChild(document.createTextNode(option));

        div.appendChild(b1);
        div.appendChild(b2);

        this.container.appendChild(div);

        return [div, b1,b2];
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