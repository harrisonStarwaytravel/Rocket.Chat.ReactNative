import { takeLatest, select, take, put, call } from 'redux-saga/effects';
import { MESSAGES, LOGIN } from '../actions/actionsTypes';
import {
	messagesSuccess,
	messagesFailure,
	deleteSuccess,
	deleteFailure,
	editSuccess,
	editFailure,
	starSuccess,
	starFailure
} from '../actions/messages';
import RocketChat from '../lib/rocketchat';

const deleteMessage = message => RocketChat.deleteMessage(message);
const editMessage = message => RocketChat.editMessage(message);
const starMessage = message => RocketChat.starMessage(message);

const get = function* get({ rid }) {
	const auth = yield select(state => state.login.isAuthenticated);
	if (!auth) {
		yield take(LOGIN.SUCCESS);
	}
	try {
		yield RocketChat.loadMessagesForRoom(rid, null);
		yield RocketChat.readMessages(rid);
		yield put(messagesSuccess());
	} catch (err) {
		console.log(err);
		yield put(messagesFailure(err.status));
	}
};

const handleDeleteRequest = function* handleDeleteRequest({ message }) {
	try {
		yield call(deleteMessage, message);
		yield put(deleteSuccess());
	} catch (error) {
		yield put(deleteFailure());
	}
};

const handleEditRequest = function* handleEditRequest({ message }) {
	try {
		yield call(editMessage, message);
		yield put(editSuccess());
	} catch (error) {
		yield put(editFailure());
	}
};

const handleStarRequest = function* handleStarRequest({ message }) {
	try {
		yield call(starMessage, message);
		yield put(starSuccess());
	} catch (error) {
		yield put(starFailure());
	}
};

const root = function* root() {
	yield takeLatest(MESSAGES.REQUEST, get);
	yield takeLatest(MESSAGES.DELETE_REQUEST, handleDeleteRequest);
	yield takeLatest(MESSAGES.EDIT_REQUEST, handleEditRequest);
	yield takeLatest(MESSAGES.STAR_REQUEST, handleStarRequest);
};
export default root;
