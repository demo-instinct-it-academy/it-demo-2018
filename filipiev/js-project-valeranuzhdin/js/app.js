/**
 * Kanban board
 *
 * Author: Filipev Valery (valeranuzhdin1998@mail.ru)
 * Git: https://github.com/ValeryFilipev
 *
 */

import 'jquery'
import 'jquery-ui'
import 'bootstrap'
import 'jquery-ui/ui/widgets/draggable'
import 'jquery-ui/ui/widgets/droppable'

import Board from './models/Board'
import Task from './models/Task'

import BoardView from './views/BoardView'
import HeaderView from './views/HeaderView'

import BoardController from './controllers/BoardController'
import HeaderController from './controllers/HeaderController'


const boardModel = new Board();
const taskModel = new Task(boardModel);

const boardView = new BoardView(taskModel, boardModel, {
    tasks: $('.task'),
    tasksArea: $('.tasksarea'),
    btnTaskAdd: $('#btnAddTask'),
    btnTaskOk: $('#btnTaskOk'),
});

const headerView = new HeaderView(boardModel, taskModel, {
    newBoard: $('#linkNewWorkspace'),
    boards: $('#ulWorkspaces'),
    renameBoard: $('#linkRenameWorkspace'),
    removeBoard: $('#linkRemoveWorkspace'),
    history: $('#linkTasksHistory'),
    export: $('#export'),
    import: $('#import'),
    btnImportOk: $('#btnImportOk'),
});

const boardController = new BoardController(taskModel, boardView);
const headerController = new HeaderController(boardModel, taskModel, headerView);

boardView.show();
headerView.show();