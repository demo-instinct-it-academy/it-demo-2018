export function bindPressEnter(selector, event) {
    $(selector).on('keypress', function (e) {
        let key = e.which;

        if (key === 13) {
            event();
            return true;
        }
    });
}

export function dateFormat(data) {
    let day = data.getDate();
    let month = data.getMonth() + 1;
    let year = data.getFullYear();
    let hours = data.getHours();
    let minutes = data.getMinutes();

    day = day < 10 ? "0" + day : day;
    month = month < 10 ? "0" + month : month;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return day + "/" + month + "/" + year + " " + hours + ":" + minutes;
}

const messages = {
    "workspace_new":"New workspace name:",
    "workspace_rename":"Inform a new name to the current workspace:",
    "confirm_workspace_remove":"Removing workspace {1} and all its tasks. Are you sure?",
    "confirm_remove_task":"Removing task {1}. Are you sure?",
    "confirm_import_tasks":"All tasks from the current workspace will be replaced by new ones. Are you sure?",
    "error_invalid_json":"This is not a valid JSON."
};

export function message(key) {
    let msg = messages[key];

    if (msg) {
        for (let i = 1; i < arguments.length; i++) {
            msg = msg.replace("{" + i + "}", arguments[i]);
        }
        return msg;
    } else {
        throw new Error("Could not find the message '" + key + "'.");
    }
}

export function showModal(m) {
    $("#modalContainer").find(".modal").hide();
    $("#modalContainer").fadeIn();
    $("#" + m).fadeIn();
}

export function hideModals() {
    $("#modalContainer").find(".modal").fadeOut();
    $("#modalContainer").fadeOut();
}