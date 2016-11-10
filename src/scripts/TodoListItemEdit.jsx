import React from 'react';

class TodoListItemEdit extends React.Component {

    constructor(props) {
        super(props);
    }

    handleSave() {
        this.props.onSave({
            id: this.props.item.id,
            name: this.refs.name.value,
            date: this.props.item.date,
            time: this.refs.time.value,
            done: this.props.item.done
        });
        this.props.onCancel();
    }

    componentDidMount() {
        this.refs.name.focus();
    }

    render() {
        return (
            <tr>
                <td colSpan="2" className="form-horizontal">
                    <div className="form-group">
                        <div className="col-sm-4">
                            <input type="time" defaultValue={this.props.item.time}
                                   ref="time" className="form-control" tabIndex="2">
                            </input>
                        </div>
                        <div className="col-sm-8">
                            <input type="text" defaultValue={this.props.item.name}
                                   ref="name" className="form-control" placeholder="Имя..." tabIndex="1">
                            </input>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-4">
                            <input type="button" defaultValue="Отмена" tabIndex="3"
                                   className="btn btn-default form-control"
                                   onClick={this.props.onCancel}>
                            </input>
                        </div>
                        <div className="col-sm-8">
                            <input type="button" defaultValue="Сохранить" tabIndex="4"
                                   className="btn btn-success form-control"
                                   onClick={this.handleSave.bind(this)}>
                            </input>
                        </div>
                    </div>
                </td>
            </tr>
        )
    }
}

export default TodoListItemEdit;