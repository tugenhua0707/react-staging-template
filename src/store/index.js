
import { createStore, combineReducers } from 'redux';
import counter from './modules/counter';
import todoList from './modules/todoList';

const reducer = combineReducers({
  counter,
  todoList,
});

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

const _dispatch = store.dispatch;

store.dispatch = (type, data) => _dispatch({type, data});

export default store;