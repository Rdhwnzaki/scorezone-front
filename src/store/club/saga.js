import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
    GET_CLUB,
    DELETE_CLUB,
    UPDATE_CLUB,
    ADD_NEW_CLUB,
} from "./actionType";

import {
    getClubSuccess,
    getClubFail,
    deleteClubSuccess,
    deleteClubFail,
    updateClubSuccess,
    updateClubFail,
    addClubSuccess,
    addClubFail,
} from "./action";

//Include Both Helper File with needed methods
import {
    getClubApi,
    updateClubApi,
    deleteClubApi,
    addNewClubApi
} from "../../helpers/backend_helper";

function* getClub({ payload: club }) {
    try {
        const response = yield call(getClubApi, club);
        yield put(getClubSuccess(GET_CLUB, response.data));
    } catch (error) {
        yield put(getClubFail(GET_CLUB, error));
    }
}

function* onUpdateClub({ payload: club }) {
    try {
        const response = yield call(updateClubApi, club);
        yield put(updateClubSuccess(response));
        toast.success(response.message, { autoClose: 3000 });
    } catch (error) {
        yield put(updateClubFail(error));
        toast.error(error.response.data.message, { autoClose: 3000 });
    }
}

function* onDeleteClub({ payload: club }) {
    try {
        const response = yield call(deleteClubApi, club);
        yield put(deleteClubSuccess({ club, ...response }));
        toast.success(response.message, { autoClose: 3000 });
    } catch (error) {
        yield put(deleteClubFail(error));
        toast.error(error.response.data.message, { autoClose: 3000 });
    }
}

function* onAddNewClub({ payload: club }) {
    try {
        const response = yield call(addNewClubApi, club);
        yield put(addClubSuccess(response));
        toast.success(response.message, { autoClose: 3000 });
    } catch (error) {
        yield put(addClubFail(error));
        toast.error(error.response.data.message, { autoClose: 3000 });
    }

}

export function* watchGetClub() {
    yield takeEvery(GET_CLUB, getClub);
}

export function* watchUpdateClub() {
    yield takeEvery(UPDATE_CLUB, onUpdateClub);
}

export function* watchDeleteClub() {
    yield takeEvery(DELETE_CLUB, onDeleteClub);
}

export function* watchAddNewClub() {
    yield takeEvery(ADD_NEW_CLUB, onAddNewClub);
}

function* clubSaga() {
    yield all([
        fork(watchGetClub),
        fork(watchDeleteClub),
        fork(watchUpdateClub),
        fork(watchAddNewClub)
    ]);
}

export default clubSaga;
