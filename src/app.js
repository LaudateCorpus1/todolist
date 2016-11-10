import TodoList from './scripts/TodoList';
import TodoStore from './scripts/TodoStore';

import ReactDOM from 'react-dom';
import React from 'react';

const render = () => {
        ReactDOM.render(
            <TodoList store={TodoStore} />,
            document.getElementById("toDoListApp")
        );
};

TodoStore.subscribe(render);
render();