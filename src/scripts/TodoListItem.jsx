import React from 'react';

class TodoListItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleTodoClick = this.handleTodoClick.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    handleTodoClick(event) {
        if (event.target.tagName != "TD") return;
        this.props.onClick(this.props.item);
    }

    handleDelete() {
        this.props.onDeleteClick(this.props.item.id);
    }

    handleEdit() {
        this.props.onEditClick(this.props.item.id);
    }

    render() {
        let item = this.props.item;
        let timeCellContent = (item.done) ? <span className="glyphicon glyphicon-ok"></span> :
            (item.time) ? item.time.slice(0,5) : <span className="glyphicon glyphicon-time"></span>;
        let trClass = ((!!item.done) ? "success" : "");

        if (!this.props.empty)
            return (
                <tr className={trClass}>
                    <td className="todo-item-time">{timeCellContent}</td>
                    <td width="100%" onClick={this.handleTodoClick}>
                        {item.name}
                        <div className="todo-item-control">
                            <span className="glyphicon glyphicon-pencil" onClick={this.handleEdit}></span>
                            <span className="glyphicon glyphicon-remove" onClick={this.handleDelete}></span>
                        </div>
                    </td>
                </tr>
            )
        else return (
            <tr>
                <td className="todo-item-time"></td>
                <td width="100%">{item.name}</td>
            </tr>
        )

    }
}

export default TodoListItem;