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

$(document).ready(function () {
    get_len_projects("itecai").then((l) => $("#count-projects").text(l));
    window.setInterval(function () {
        $("#random-skill").text(
            SKILLS[Math.floor(Math.random() * SKILLS.length)]
        );
    }, 15000);
    $(".code-header").on("wheel", scrollHorizontallyCode);
    $(".personal").on("wheel", scrollHorizontallyCode);
});
