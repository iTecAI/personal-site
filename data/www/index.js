var SKILLS = [
    "Python 3",
    "HTML/CSS/JS",
    "React.JS",
    "Java",
    "MongoDB",
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
});
