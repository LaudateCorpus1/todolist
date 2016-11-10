export function todosLoad(date) {
    return {
        type: 'TODOS_LOAD',
        date: date
    }
}

export function todosToggle(id) {
    return {
        type: 'TODOS_TOGGLE',
        id: id
    }
}

export function todosAdd(newItem) {
    return {
        type: 'TODOS_ADD',
        newItem: newItem
    }
}

export function todosChange(item) {
    return {
        type: 'TODOS_CHANGE',
        item: item
    }
}

export function todosDelete(id) {
    return {
        type: 'TODOS_DELETE',
        id: id
    }
}

export function todosDeleteDone() {
    return {
        type: 'TODOS_DELETE_DONE'
    }
}

export function todosDeleteAll() {
    return {
        type: 'TODOS_DELETE_ALL'
    }
}

export function todosDeleteOld(date) {
    return {
        type: 'TODOS_DELETE_OLD',
        date: date
    }
}

export function todosDeleteOnDay(date) {
    return {
        type: 'TODOS_DELETE_ON_DAY',
        date: date
    }
}

export function dateSet(day) {
    return {
        type: 'DATE_SET',
        date: day
    }
}

export function dateNextDay() {
    return {
        type: 'DATE_NEXT_DAY'
    }
}

export function dateSetMonth(month) {
    return {
        type: 'DATE_SET_MONTH',
        month: month
    }
}