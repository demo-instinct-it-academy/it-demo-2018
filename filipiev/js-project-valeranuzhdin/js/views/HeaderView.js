import Event from "../event";
import {KANBAN_DEFAULT_BOARD_ID} from "../constants";
import {message, dateFormat, hideModals, showModal} from "../helpers";

class HeaderView {
    constructor(model, modelTask, elements) {
        this._model = model;
        this._modelTask = modelTask;
        this._elements = elements;

        this.newBoard = new Event(this);
        this.switchBoard = new Event(this);
        this.renameBoard = new Event(this);
        this.removeBoard = new Event(this);
        this.importBoard = new Event(this);

        //MODEL events
        this._model.boardChanged.attach(this.renderMenuBoards.bind(this));
        this._model.boardSwitched.attach(() => {
            this.renderMenuBoards();
            this.renderTitle();
        });
        this._model.boardRename.attach(() => {
            this.renderMenuBoards();
            this.renderTitle();
        });

        //DOM events
        this._elements.newBoard.on('click', event => this.newBoard.notify());
        this._elements.boards.on('click', '.liWorkspace a', (event) => this.switchBoard.notify(event.target.id));
        this._elements.renameBoard.on('click', () => this.renameBoard.notify());
        this._elements.removeBoard.on('click', () => this.removeBoard.notify());
        this._elements.history.on('click', this.onClickTasksHistory.bind(this));
        this._elements.export.on('click', this.onClickExport.bind(this));
        this._elements.import.on('click', this.onClickImport.bind(this));
        this._elements.btnImportOk.on('click', this.onClickBtnImportOk.bind(this));

        /**
         * Cancel modals
         */
        $("#btnExportClose").click(hideModals);
        $("#btnImportCancel").click(hideModals);
    }

    onClickExport() {
        const tasks = this._modelTask.getAll();
        $("#inputExportJson").val(JSON.stringify(tasks));
        showModal("modalExport");
    }

    onClickImport() {
        $("#inputImportWorkspaceName").val("");
        $("#labelWorkspaceName").removeClass("required");

        $("#inputImportJson").val("");
        $("#labelImportJson").removeClass("required");

        showModal("modalImport");
    }

    onClickBtnImportOk() {
        $("#labelWorkspaceName").removeClass("required");
        $("#labelImportJson").removeClass("required");

        try {
            let boardName = $("#inputImportWorkspaceName").val();

            if (boardName.trim() === '') {
                $("#labelWorkspaceName").addClass("required");
                $("#inputImportWorkspaceName").focus();
                return false;
            }

            let tasks = JSON.parse($("#inputImportJson").val());

            if (confirm(message("confirm_import_tasks"))) {
                this.importBoard.notify({boardName, tasks});
                hideModals();

                return true;
            }
        } catch (e) {
            alert(message("error_invalid_json"));
            $("#labelImportJson").addClass("required");
            $("#inputImportJson").focus();
            return false;
        }
    }

    onClickTasksHistory() {
        const tb = $("#historyTable tbody");
        tb.empty();

        let tasksArray = [];

        const tasks = this._modelTask.getAll();

        for (let t in tasks) {
            tasksArray.push(tasks[t]);
        }

        tasksArray.sort(function (a, b) {
            if (a.history && b.history) {
                return a.history[a.history.length - 1].date < b.history[b.history.length - 1].date;
            } else return a.history;
        });

        for (let t in tasksArray) {
            let task = tasksArray[t];
            let dateText = "";

            if (task.history) {
                dateText = dateFormat(new Date(task.history[task.history.length - 1].date));
            }

            let cssClass = "";

            if (task.state === "todo") {
                cssClass += "red";
            } else if (task.state === "wip") {
                cssClass += "yellow";
            } else if (task.state === "done") {
                cssClass += "green";
            }

            tb.append("<tr class=" + cssClass + "><td>" + task.title + "</td><td>" + task.state + "</td><td>" + dateText + "</td></tr>");
        }
        showModal("modalHistory");
        $("#historyTableContainer").height($("#modalHistory").outerHeight() * 0.75);
    }

    renderMenuBoards() {
        const boards = this._model.getAll();
        const currentBoardKey = this._model.getCurrent();

        $(".liWorkspace").remove();

        if (currentBoardKey === KANBAN_DEFAULT_BOARD_ID) {
            $("#linkRemoveWorkspace").hide();
            $("#linkRenameWorkspace").hide();
        } else {
            $("#linkRemoveWorkspace").show();
            $("#linkRenameWorkspace").show();
        }

        for (let boardKey in boards) {

            const boardName = boards[boardKey];

            let classes = '';

            if (boardKey === currentBoardKey) {
                classes = 'mark';
            }

            $("#ulWorkspaces").append(`
                <li class="liWorkspace ${classes}">
                    <a href="#" id="${boardKey}">${boardName}</a>
                </li>
            `);
        }
    }

    renderTitle() {
        const name = this._model.getCurrentName();
        $('#title').text(name);
    }

    show() {
        this.renderMenuBoards();
        this.renderTitle();
    }
}

export default HeaderView;