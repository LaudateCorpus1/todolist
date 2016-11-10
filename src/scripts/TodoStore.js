import { combineReducers } from 'redux';
import { createStore } from 'redux';

const todosReducer = (state = [], action) => {
    switch (action.type) {
        case 'TODOS_LOAD':
            fetch('/todos/get', {
                credentials: 'same-origin',
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({date: action.date})
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    store.dispatch({
                        type: 'TODOS_LOADED',
                        data: data
                    });
                })
                .catch(alert);
            return state;

        case 'TODOS_LOADED':
            return action.data;

        case 'TODOS_ADD':
            fetch('/todos/add', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify(action.newItem)
            })
                .catch(alert);
            return state;

        case 'TODOS_CHANGE':
            fetch('/todos/change', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify(action.item)
            })
                .catch(alert);
            return state;

        case 'TODOS_DELETE':
            fetch('/todos/delete', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify({id: action.id})
            })
                .catch(alert);
            return state;

        case 'TODOS_DELETE_DONE':
            fetch('/todos/delete/done', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: ''
            })
                .catch(alert);
            return state;

        case 'TODOS_DELETE_ALL':
            fetch('/todos/delete/all', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: ''
            })
                .catch(alert);
            return state;

        case 'TODOS_DELETE_OLD':
            fetch('/todos/delete/old', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify({date: action.date})
            })
                .catch(alert);
            return state;

        case 'TODOS_DELETE_ON_DAY':
            fetch('/todos/delete/onday', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify({date: action.date})
            })
                .catch(alert);
            return state;

        default:
            return state;
    }
}

const dateReducer = (state = new Date(), action) => {
    switch (action.type) {
        case "DATE_NEXT_DAY":
            return new Date(state.setDate(state.getDate() + 1));
        case "DATE_SET":
            return new Date(action.date);
        case "DATE_SET_MONTH":
            return new Date(state.setMonth(action.month));
        default:
            return state;
    }
}

const todoApp = combineReducers({
    todos: todosReducer,
    date: dateReducer
});

const store = createStore(todoApp);

export default store;