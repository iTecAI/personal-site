var SKILLS = [
    "Python 3",
    "HTML/CSS/JS",
    "React.JS",
    "Java",
    "Linux",
    "MongoDB",
    "AWS",
    "SQL",
    "OpenShift / Kubernetes",
    "Docker",
    "Raspberry Pi",
];

function checkVisible(selector) {
    var top_of_element = $(selector).offset().top;
    var bottom_of_element =
        $(selector).offset().top + $(selector).outerHeight();
    var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
    var top_of_screen = $(window).scrollTop();

    return (
        bottom_of_screen > top_of_element &&
        top_of_screen < bottom_of_element - $(selector).outerHeight() * 0.25
    );
}

function scrollHorizontallyCode(e) {
    // https://stackoverflow.com/questions/23952491/jquery-mousewheel-scroll-horizontally
    var delta = -Math.max(-1, Math.min(1, e.originalEvent.wheelDelta));
    var last_scroll = $(".code-header").scrollLeft();
    $(".code-header").scrollLeft($(".code-header").scrollLeft() + delta * 40);
    if ($(".code-header").scrollLeft() == last_scroll) {
        return;
    }
    e.preventDefault();
}

async function get_len_projects(username) {
    var page = 1;
    var length = (
        await $.get("https://api.github.com/users/itecai/repos?page=" + page)
    ).length;
    while (true) {
        page++;
        var new_data = await $.get(
            "https://api.github.com/users/itecai/repos?page=" + page
        );
        if (new_data.length == 0) {
            break;
        }
        length += new_data.length;
    }
    console.log("Found " + length + " projects.");
    return length;
}

function updateNav() {
    if (checkVisible(".whoami")) {
        $(".section[data-section=whoami]").addClass("selected");
        $(".section").not("[data-section=whoami]").removeClass("selected");
    } else if (checkVisible(".projects")) {
        $(".section[data-section=projects]").addClass("selected");
        $(".section").not("[data-section=projects]").removeClass("selected");
    } else if (checkVisible(".experience")) {
        $(".section[data-section=experience]").addClass("selected");
        $(".section").not("[data-section=experience]").removeClass("selected");
    }
}

async function get_projects() {
    var manifest = await $.get("./data/manifest.json");
    var section = $('<div class="section-content"></div>');
    var converter = new showdown.Converter({
        openLinksInNewWindow: true,
    });
    for (var p of manifest.projects) {
        var content = await $.get("./data/" + p.description);
        section.append(
            $("<div class='item'></div>")
                .append($('<span class="title"></span>').text(p.title))
                .append(
                    $('<img class="image">').attr({
                        src: "./data/" + p.image,
                        alt: "Project image.",
                    })
                )
                .append(
                    $('<div class="description"></div>').html(
                        converter.makeHtml(content)
                    )
                )
                .append(
                    $('<a class="link"></a>')
                        .attr("href", p.link)
                        .attr("target", "_blank")
                        .append($('<span class="material-icons">link</span>'))
                )
        );
    }
    return section;
}

async function get_experiences() {
    var manifest = await $.get("./data/manifest.json");
    var section = $('<div class="section-content"></div>');
    var converter = new showdown.Converter({
        openLinksInNewWindow: true,
    });
    for (var p of manifest.experience) {
        var icon = p.icon;
        console.log(icon);
        var content = await $.get("./data/" + p.description);
        section.append(
            $("<div class='item'></div>")
                .append(
                    $('<span class="title"></span>')
                        .text(p.title)
                        .append(
                            $(
                                "<span class='material-icons'>" +
                                    icon +
                                    "</span>"
                            )
                        )
                )
                .append(
                    $('<div class="description"></div>').html(
                        converter.makeHtml(content)
                    )
                )
        );
    }
    return section;
}

$(document).ready(function () {
    get_len_projects("itecai").then((l) => $("#count-projects").text(l));
    window.setInterval(function () {
        $("#random-skill").text(
            SKILLS[Math.floor(Math.random() * SKILLS.length)]
        );
    }, 15000);
    $(".code-header").on("wheel", scrollHorizontallyCode);
    $(".personal").on("wheel", scrollHorizontallyCode);
    $(".sections .section").on("click", function (e) {
        document
            .querySelector("." + $(e.delegateTarget).attr("data-section"))
            .scrollIntoView({
                behavior: "smooth",
            });
        $(".section.selected").removeClass("selected");
        $(e.delegateTarget).addClass("selected");
        setTimeout(updateNav, 300);
    });
    $(window).on("wheel", updateNav);
    get_projects().then((s) => s.replaceAll(".projects .section-content"));
    get_experiences().then((s) => s.replaceAll(".experience .section-content"));
});
