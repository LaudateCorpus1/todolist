import React from 'react';

import 'styles/todolist'

import TodoListItem from './TodoListItem';
import TodoListAdd from './TodoListAdd';
import TodoListItemEdit from './TodoListItemEdit';
import TodoVoiceControl from './TodoVoiceControl';

import DayPicker, { DateUtils } from "react-day-picker";
import 'react-day-picker/lib/style.css';
import * as act from './TodoStoreActions';

class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.store = this.props.store;
        this.state = {editableItemID: null};
        this.state = {messageToShow: "", messageTimer: null};
        this.state = {activeDays: []};
    }

    componentDidMount() {
        this.todosLoad();
        this.activeDaysLoad();
    }
    
    activeDaysLoad() {
        let month = this.store.getState().date.getMonth() + 1;
        fetch('/days/get/active', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({month: month})
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                let res = [];
                for (let key in data) {
                    res.push(data[key].date);
                }
                this.setState({activeDays: res});
            })
            .catch(alert);
    }

    todosLoad() {
        this.store.dispatch(act.todosLoad(this.store.getState().date));
        this.activeDaysLoad();
    }

    todoToggle(item) {
        item.done = !item.done;
        this.store.dispatch(act.todosChange(item));
        if (item.done) this.showSuccessMessage("Задача выполнена! Вы молодец!");
        else this.showSuccessMessage("Задача не выполнена обратно");
    }

    todosAddItem(newItem) {
        newItem.date = this.store.getState().date.toISOString();
        this.store.dispatch(act.todosAdd(newItem));
        this.showSuccessMessage("Задача добавлена в список");
        this.todosLoad();
    }

    showSuccessMessage(msg) {
        this.setState({messageToShow: msg});
        clearTimeout(this.state.messageTimer);

        this.setState({messageTimer: setTimeout(() => {
            this.setState({messageToShow: ""});
        }, 5000)});
    }

    todosDeleteItem(id) {
        this.store.dispatch(act.todosDelete(id));
        this.showSuccessMessage("Задача удалена из списка");
        this.todosLoad();
    }

    todosSetEditableItem(id) {
        this.setState({editableItemID: id});
    }

    todosChangeItem(item) {
        this.store.dispatch(act.todosChange(item));
        this.showSuccessMessage("Изменения успешно внесены");
        this.todosLoad();
    }

    todosDeleteDone() {
        this.store.dispatch(act.todosDeleteDone());
        this.showSuccessMessage("Выполненные задачи удалены из списка");
        this.todosLoad();
    }

    todosDeleteAll() {
        this.store.dispatch(act.todosDeleteAll());
        this.showSuccessMessage("Все задачи были успешно удалены");
        this.todosLoad();
    }

    todosDeleteOld() {
        this.store.dispatch(act.todosDeleteOld(this.store.getState().date.toISOString()));
        this.showSuccessMessage("Старые задачи были успешно удалены");
        this.todosLoad();
    }
    
    todosDeleteOnDay(day) {
        this.store.dispatch(act.todosDeleteOnDay(day));
        this.showSuccessMessage("Задачна этот день удалены");
        this.todosLoad();
    }

    handleVoiceControl(text) {
        let arr = text.split(" ");
        if (arr[0].toLowerCase() == "добавить" && arr[1].toLowerCase() == "задачу") {
            let task = "", time = "";
            if (arr.length > 2) {
                let i;
                for (i = 2; i < arr.length; i++) {
                    if (arr[i].toLowerCase() != "время") task += arr[i] + " ";
                    else break;
                }
                if (arr[i] == "время") {
                    if (arr[i+1]) time = arr[i+1];
                    if (arr[i+2]) time += ":" + arr[i+2];
                    else time += ":00";
                }
            }

            this.todosAddItem({
                name: task,
                done: false,
                time: time
            });
        }
        else if (arr[0] == "удалить") {
            if (arr[1] == "выполненные" && arr[2] == "задачи") {
                this.todosDeleteDone();
            }
            else if (arr[1] == "все" && arr[2] == "задачи") {
                this.todosDeleteAll();
            }
            else if (arr[1] == "задачи" && arr[2] == "на" && arr[3] == "этот" && arr[4] == "день") {
                this.todosDeleteOnDay(this.store.getState().date);
            }
            else if (arr[1] == "задачи" && arr[2] == "до" && arr[3] == "этого" && arr[4] == "дня") {
                this.todosDeleteOld();
            }
        }
    }

    onDayChange(e, day) {
        this.store.dispatch(act.dateSet(day));
        this.todosLoad();
    }

    onMonthChange(date) {
        this.store.dispatch(act.dateSetMonth(date.getMonth()));
        this.todosLoad();
    }

    todosExportToICS() {
        
    }

    render() {
        let iconTime = <span className="glyphicon glyphicon-time"></span>;
        let alertBox = (this.state.messageToShow) ?
            <div className="alert alert-success todo-alert">{this.state.messageToShow}</div> : "";

        const { todos } = this.store.getState();

        let items = [];
        for (let i = 0; i < todos.length; i++) {
            let item = todos[i];
            if (item.id !== this.state.editableItemID) {
                items.push(
                    <TodoListItem item={item} key={item.id}
                                  onClick={this.todoToggle.bind(this)}
                                  onDeleteClick={this.todosDeleteItem.bind(this)}
                                  onEditClick={this.todosSetEditableItem.bind(this)}
                    />
                )
            }
            else {
                items.push(
                    <TodoListItemEdit item={item} key={item.id}
                                      onCancel={this.todosSetEditableItem.bind(this, null)}
                                      onSave={this.todosChangeItem.bind(this)}
                    />
                )
            }
        }
        if (!items.length) {
            items.push (
                <TodoListItem item={{name: "Нет задач"}} key={0} empty />
            )
        }

        const activeDays = {
            active: day => { return (this.state.activeDays.indexOf(day.getDate()) != -1 &&
                this.store.getState().date.getMonth() == day.getMonth())}
        }

        return (
            <table id="app"><tbody>
            <tr>
                <td>
                    <div className="calendar">
                        <DayPicker
                            modifiers={activeDays}
                            onDayClick={this.onDayChange.bind(this)}
                            onMonthChange={this.onMonthChange.bind(this)}
                            initialMonth={ this.store.getState().date }
                            selectedDays={ day => DateUtils.isSameDay(this.store.getState().date, day) }
                        />
                    </div>
                    <div className="calendar-date-nav">
                        <div className="btn btn-default btn-block"
                             onClick={() => {
                                let day = new Date();
                                day.setDate(day.getDate() - 1);
                                this.onDayChange(null, day);
                             }}>
                            Вчера
                        </div>
                        <div className="btn btn-primary btn-block"
                             onClick={() => this.onDayChange(null, new Date())}>
                            Сегодня
                        </div>
                        <div className="btn btn-default btn-block"
                             onClick={() => {
                                let day = new Date();
                                day.setDate(day.getDate() + 1);
                                this.onDayChange(null, day);
                             }}>
                            Завтра
                        </div>
                        <div className="btn btn-default btn-block"
                             onClick={() => {
                                let day = new Date();
                                day.setDate(day.getDate() + 2);
                                this.onDayChange(null, day);
                             }}>
                            Послезавтра
                        </div>
                    </div>
                </td>

                <td width="100%">
                    <div className="to-do-list">
                        <table className="table-curved">
                            <thead>
                                <tr>
                                    <th className="todo-item-time">Time</th>
                                    <th width="100%">{this.store.getState().date.toDateString()}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items}
                            </tbody>
                        </table>
                        <TodoListAdd handleTaskAdd={this.todosAddItem.bind(this)} />
                    </div>
                </td>

                <td>
                    <div className="right-sidebar">
                        <a href="/logout" className="btn btn-default btn-block">Выход</a>
                        
                        <div className="btn btn-default btn-block"
                             onClick={this.todosDeleteDone.bind(this)}>
                            Удалить выполненные
                        </div>
                        <div className="btn btn-default btn-block"
                             onClick={this.todosDeleteOld.bind(this)}>
                            Удалить просроченные
                        </div>
                        <div className="btn btn-default btn-block"
                             onClick={this.todosDeleteOnDay.bind(this, this.store.getState().date)}>
                            Удалить задачи на этот день
                        </div>
                        <div className="btn btn-default btn-block"
                             onClick={this.todosDeleteAll.bind(this)}>
                            Удалить все
                        </div>
                        <a className="btn btn-default btn-block"
                             href="/todos/export">
                            Экспорт
                        </a>

                        <TodoVoiceControl onControl={this.handleVoiceControl.bind(this)} />
                    </div>

                    {alertBox}
                </td>
            </tr>
            </tbody>
            </table>
        )
    }
}

export default TodoList;