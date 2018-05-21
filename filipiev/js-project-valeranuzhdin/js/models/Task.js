import {KANBAN_WORKSPACES} from '../constants';
import Event from '../event';

export default class Task {
    constructor(boardModel) {
        this._boardModel = boardModel;

        //EVENTS
        this.tasksChanged = new Event(this);
    }

    getCurrentBoardKey() {
        const currentBoard = this._boardModel.getCurrent();
        return `${KANBAN_WORKSPACES}.${currentBoard}`;
    }

    getAll() {
        const key = this.getCurrentBoardKey();
        return JSON.parse(localStorage.getItem(key)) || {};
    }

    getNextId() {
        const tasks = this.getAll();

        let lastId;

        for (let taskId in tasks) {
            lastId = taskId;
        }

        lastId = lastId && parseInt(lastId.replace(/t/g, '')) || 0;

        return 't' + (lastId + 1);
    }

    find(id) {
        const tasks = this.getAll();

        for (let taskId in tasks) {
            if (id === taskId) {
                return tasks[id];
            }
        }

        return null;
    }

    add(name, description) {
        const tasks = this.getAll();
        const nextId = Date.now();

        tasks[nextId] = {
            title: name,
            description: description,
            state: 'todo',
            history: [{date: new Date(), state: 'todo'}]
        };
        this.updateStorage(tasks);
    }

    edit(id, newName, newDescription) {
        const tasks = this.getAll();

        for (let taskId in tasks) {
            if (id === taskId) {
                const task = tasks[id];

                task.title = newName;
                task.description = newDescription;
            }
        }

        this.updateStorage(tasks);
    }

    changeState(id, newState) {

        const tasks = this.getAll();

        for (let taskId in tasks) {
            if (id === taskId) {
                const task = tasks[id];

                if (newState !== task.state) {
                    task.state = newState;
                    task.history.push({date: new Date(), state: newState})
                }
            }
        }

        this.updateStorage(tasks);
    }

    remove(id) {
        const tasks = this.getAll();

        for (let taskId in tasks) {
            if (id === taskId) {
                delete tasks[id];
            }
        }

        this.updateStorage(tasks);
    }


    updateStorage(tasks) {
        localStorage.setItem(this.getCurrentBoardKey(), JSON.stringify(tasks));
        this.tasksChanged.notify();
    }

    import(key, tasks) {
        const boardKey = `${KANBAN_WORKSPACES}.${key}`;
        localStorage.setItem(boardKey, JSON.stringify(tasks));
    }
}