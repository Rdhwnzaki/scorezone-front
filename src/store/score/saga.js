import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    GET_SCORE,
    DELETE_SCORE,
    UPDATE_SCORE,
    ADD_NEW_SCORE,
} from "./actionType";

import {
    getScoreSuccess,
    getScoreFail,
    deleteScoreSuccess,
    deleteScoreFail,
    updateScoreSuccess,
    updateScoreFail,
    addScoreSuccess,
    addScoreFail,
} from "./action";

//Include Both Helper File with needed methods
import {
    getScoreApi,
    updateScoreApi,
    deleteScoreApi,
    addNewScoreApi
} from "../../helpers/backend_helper";

function* getScore({ payload: score }) {
    try {
        const response = yield call(getScoreApi, score);
        yield put(getScoreSuccess(GET_SCORE, response.data));
    } catch (error) {
        yield put(getScoreFail(GET_SCORE, error));
    }
}

function* onUpdateScore({ payload: score }) {
    try {
        const response = yield call(updateScoreApi, score);
        yield put(updateScoreSuccess(response));
        toast.success(response.message, { autoClose: 3000 });
    } catch (error) {
        yield put(updateScoreFail(error));
        toast.error(error.response.data.message, { autoClose: 3000 });
    }
}

function* onDeleteScore({ payload: score }) {
    try {
        const response = yield call(deleteScoreApi, score);
        yield put(deleteScoreSuccess({ score, ...response }));
        toast.success(response.message, { autoClose: 3000 });
    } catch (error) {
        yield put(deleteScoreFail(error));
        toast.error(error.response.data.message, { autoClose: 3000 });
    }
}

function* onAddNewScore({ payload: score }) {
    try {
        const response = yield call(addNewScoreApi, score);
        yield put(addScoreSuccess(response));
        toast.success(response.message, { autoClose: 3000 });
    } catch (error) {
        yield put(addScoreFail(error));
        toast.error(error.response.data.message, { autoClose: 3000 });
    }

}

export function* watchGetScore() {
    yield takeEvery(GET_SCORE, getScore);
}

export function* watchUpdateScore() {
    yield takeEvery(UPDATE_SCORE, onUpdateScore);
}

export function* watchDeleteScore() {
    yield takeEvery(DELETE_SCORE, onDeleteScore);
}

export function* watchAddNewScore() {
    yield takeEvery(ADD_NEW_SCORE, onAddNewScore);
}

function* scoreSaga() {
    yield all([
        fork(watchGetScore),
        fork(watchDeleteScore),
        fork(watchUpdateScore),
        fork(watchAddNewScore)
    ]);
}

export default scoreSaga;
