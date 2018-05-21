import {message} from "../helpers";

class HeaderController {
    constructor(model, modelTask, view) {
        this._model = model;
        this._modelTask = modelTask;
        this._view = view;

        this._view.newBoard.attach(this.addBoard.bind(this));
        this._view.switchBoard.attach(this.switchBoard.bind(this));
        this._view.renameBoard.attach(this.renameBoard.bind(this));
        this._view.removeBoard.attach(this.removeBoard.bind(this));
        this._view.importBoard.attach(this.importBoard.bind(this));
    }

    addBoard() {
        let name = prompt('New workspace name:');

        if (name) {
            const key = this._model.add(name);
            this._model.setCurrent(key);
        }
    }

    switchBoard(key) {
        this._model.setCurrent(key);
    }

    renameBoard() {
        let newName = prompt(message("workspace_rename"));

        if (newName) {
            this._model.rename(newName);
        }
    }

    removeBoard() {
        const boardName = this._model.getCurrentName();

        if (confirm(message("confirm_workspace_remove", boardName))) {
            this._model.removeCurrentWorkspace();
        }
    }

    importBoard({ boardName, tasks }) {
        let newTasks = Object.assign({}, tasks, this._modelTask.getAll());
        this._model.rename(boardName);
        this._modelTask.updateStorage(newTasks);
    }
}

export default HeaderController;