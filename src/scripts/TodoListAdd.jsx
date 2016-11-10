import React from 'react';

class TodoListAdd extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.refs.name.focus();
    }

    handleSubmit(event) {
        event.preventDefault();
        let newItem = {
            name: this.refs.name.value,
            time: this.refs.time.value,
            done: false
        };
        event.target.reset();
        this.refs.name.focus();
        this.props.handleTaskAdd(newItem);
    }

    render() {
        return (
            <form method="post" onSubmit={this.handleSubmit} className="task-add-block form-horizontal">
                <input type="text" defaultValue="" ref="name" className="form-control" placeholder="Имя..."></input>
                <div className="form-group">
                    <div className="col-sm-6"><input type="time" defaultValue="" ref="time" className="form-control"></input></div>
                    <div className="col-sm-6"><input type="submit" defaultValue="" className="form-control"></input></div>
                </div>

            </form>
        )
    }
}

export default TodoListAdd;