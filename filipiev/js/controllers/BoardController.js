import { message } from "../helpers";

class BoardController {
    constructor(model, view) {
        this._model = model;
        this._view = view;

        this._view.taskCreated.attach(({title, description}) => this.addTask(title, description));
        this._view.taskUpdated.attach(({taskId, title, description}) => this.editTask(taskId, title, description));
        this._view.taskMoved.attach(({id, newState}) => this.moveTask(id, newState));
        this._view.taskRemoved.attach(({id}) => this.removeTask(id));
    }

    addTask(title, description) {
        this._model.add(title, description);
    }

    editTask(taskId, title, description) {
        this._model.edit(taskId, title, description);
    }

    removeTask(id) {
        const task = this._model.find(id);

        if (confirm(message("confirm_remove_task", task.title))) {
            this._model.remove(id);
        }
    }

    moveTask(id, newState) {
        this._model.changeState(id, newState);
    }
}

export default BoardController;