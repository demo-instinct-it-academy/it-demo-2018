import Event from '../event';
import {
    KANBAN_WORKSPACES,
    KANBAN_CURRENT_WORKSPACE,
    KANBAN_DEFAULT_BOARD_NAME,
    KANBAN_DEFAULT_BOARD_ID
} from '../constants';

class Board {
    constructor() {
        this.boardChanged = new Event(this);
        this.boardSwitched = new Event(this);
        this.boardRename = new Event(this);
        this.boardRemove = new Event(this);
    }

    getAll() {
        const data = JSON.parse(localStorage.getItem(KANBAN_WORKSPACES)) || {};

        return {
            default: KANBAN_DEFAULT_BOARD_NAME,
            ...data
        }
    }

    getCurrent() {
        return localStorage.getItem(KANBAN_CURRENT_WORKSPACE) || 'default';
    }

    getCurrentName() {
        const currentBoard = this.getCurrent();
        const boards = this.getAll();

        return boards[currentBoard] || KANBAN_DEFAULT_BOARD_NAME;
    }

    setCurrent(key) {
        localStorage.setItem(KANBAN_CURRENT_WORKSPACE, key);
        this.boardSwitched.notify();
    }

    add(name) {
        const boards = this.getAll();
        const key = new Date().getTime();
        boards[key] = name;
        this.updateStorage(boards);

        this.boardChanged.notify();

        return key;
    }

    rename(name) {
        const boards = this.getAll();
        const currentBoardKey = this.getCurrent();

        if (boards[currentBoardKey]) {
            boards[currentBoardKey] = name;
        }

        this.updateStorage(boards);

        this.boardRename.notify();
    }

    removeCurrentWorkspace() {
        const currentBoardKey = this.getCurrent();
        const boards = this.getAll();

        if (boards[currentBoardKey]) {
            delete boards[currentBoardKey];
        }

        this.updateStorage(boards);

        this.setCurrent(KANBAN_DEFAULT_BOARD_ID);

        this.boardRemove.notify();
    }

    updateStorage(boards) {
        localStorage.setItem(KANBAN_WORKSPACES, JSON.stringify(boards));
    }
}

export default Board;