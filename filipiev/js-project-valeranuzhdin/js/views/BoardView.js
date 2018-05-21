import Event from '../event'
import {bindPressEnter, message, hideModals, showModal} from "../helpers";

class BoardView {
    constructor(model, modelBoard, elements) {
        this._model = model;
        this._modelBoard = modelBoard;
        this._elements = elements;

        this.dragOptions = {
            containment: 'window',
            helper: this.getDragTaskHelper,
            start: this.onStartDragTask.bind(this),
            stop: this.onStopDragTask.bind(this),
        };

        //VIEW events
        this.taskCreated = new Event(this);
        this.taskMoved = new Event(this);
        this.taskUpdated = new Event(this);
        this.taskRemoved = new Event(this);

        //MODEL events
        this._model.tasksChanged.attach(this.redrawTasks.bind(this));
        this._modelBoard.boardSwitched.attach(this.redrawTasks.bind(this));

        //DOM events
        this._elements.tasksArea.on('mouseover', '.task', this.showTaskControls.bind(this));
        this._elements.tasksArea.on('mouseout', '.task', this.hideTaskControls.bind(this));

        this._elements.btnTaskAdd.on('click', this.btnTaskAdd.bind(this));
        this._elements.btnTaskOk.on('click', this.btnTaskOk.bind(this));

        bindPressEnter("#inputTaskTitle", this.btnTaskOk.bind(this));
        bindPressEnter("#inputTaskDescription", this.btnTaskOk.bind(this));

        this._elements.tasksArea.on("click", ".task-remove", event => this.taskRemoved.notify({id: event.target.parentElement.id}));
        this._elements.tasksArea.on("click", ".task-edit", this.onClickEditTask.bind(this));
        this._elements.tasksArea.on("click", ".task-zoom", this.onClickZoomTask.bind(this));


        /** Cancel modals **/
        $('#btnTaskCancel').click(hideModals);
        $("#btnTaskPreviewOk").click(hideModals);
        $('#btnHistoryOk').click(hideModals);
    }

    onClickEditTask(e) {
        const id = e.target.parentElement.id;
        const task = this._model.find(id);

        $("#modalTask h2").html("Edit Task");
        $('#modalTask').attr('data-id', id);
        $("#inputTaskTitle").val(task.title);
        $("#inputTaskDescription").val(task.description);
        showModal("modalTask");
        $("#inputTaskTitle").focus();
    }


    onClickZoomTask(e) {
        const id = e.target.parentElement.id;
        const task = this._model.find(id);

        $("#modalPreview h2").html(task.title);
        $("#modalPreview p").html(task.description);
        $("#modalPreview>div").css("background-color", $(e.target.parentElement).css("background-color"));

        showModal("modalPreview");
    }

    getDragTaskHelper(event) {
        const clone = $(this).clone();
        clone.addClass('dragging');
        clone.outerWidth($(this).outerWidth());

        return clone;
    }

    onStartDragTask(event, ui) {
        $(event.target).addClass('dragged');
    }

    onStopDragTask(event, ui) {
        $(event.target).removeClass('dragged');
    }

    onDropTask(event, ui) {
        const newState = $(event.target).attr('kanban-column-id');
        const id = $(ui.draggable).attr('id');
        const task = this._model.find(id);

        if (task.state !== newState) {
            this.taskMoved.notify({ id, newState });
            ui.draggable.remove();
        }
    }

    redrawTasks() {
        $('#todo > div').remove();
        $('#wip > div').remove();
        $('#done > div').remove();

        const tasks = this._model.getAll();

        for (const taskId in tasks) {
            const task = tasks[taskId];
            task.id = taskId;
            this.drawTask(task);
        }
    }

    drawTask(data) {
        const $task = $(`
            <div id="${data.id}" class="task">
                <h3>${data.title}</h3>
                <p>${data.description}</p>
                <span class='task-action task-remove glyphicon glyphicon-remove' aria-hidden='true' title='Remove'></span>&nbsp;
                <span class='task-action task-edit glyphicon glyphicon-pencil' aria-hidden='true' title='Edit'></span>&nbsp;
                <span class='task-action task-zoom glyphicon glyphicon-zoom-in' aria-hidden='true' title='Zoom'></span>
            </div>
        `);

        $task.draggable(this.dragOptions);

        $(`div[kanban-column-id=${data.state}]`).append($task);
    }

    showTaskControls(event) {
        $(event.currentTarget).find('.task-action').show();
    }

    hideTaskControls(event) {
        $(event.currentTarget).find('.task-action').hide();
    }

    btnTaskAdd(event) {
        $("#modalTask h2").html("Add Task");
        $("#modalTask").attr('data-id', null);
        $("#inputTaskTitle").val(null);
        $("#inputTaskDescription").val(null);
        showModal("modalTask");
        $("#inputTaskTitle").focus();
    }

    btnTaskOk(event) {
        let title = $("#inputTaskTitle").val();
        let description = $("#inputTaskDescription").val();
        const taskId = $("#modalTask").attr('data-id');

        if (title.trim() === '') {
            $("#labelTaskTitle").addClass("required");
            $("#inputTaskTitle").focus();

            return false;
        }

        if (taskId) {
            this.taskUpdated.notify({taskId, title, description});
        } else {
            this.taskCreated.notify({title, description});
        }

        $("#labelTaskTitle").removeClass("required");

        hideModals();

        return true;
    }

    show() {
        this.redrawTasks();

        $('.tasksarea').droppable({drop: this.onDropTask.bind(this)});
    }
}

export default BoardView;