import { createStore, combineReducers } from 'redux';
import counter from './modules/counter';
import todoList from './modules/todoList';

const reducer = combineReducers({
  counter,
  todoList
});

const store = createStore(reducer);

const _dispatch = store.dispatch;

store.dispatch = (type, data) => _dispatch({type, data});

export default store;
