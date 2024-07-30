import {
    GET_SCORE,
    GET_SCORE_SUCCESS,
    GET_SCORE_FAIL,
    DELETE_SCORE,
    DELETE_SCORE_SUCCESS,
    DELETE_SCORE_FAIL,
    UPDATE_SCORE,
    UPDATE_SCORE_SUCCESS,
    UPDATE_SCORE_FAIL,
    ADD_NEW_SCORE,
    ADD_SCORE_SUCCESS,
    ADD_SCORE_FAIL,
    SCORE_LOADING,
    SCORE_RESET,
} from "./actionType";

export const resetScoreState = (actionType) => ({
    type: SCORE_RESET,
    payload: { actionType },
});

export const getScoreSuccess = (actionType, data) => ({
    type: GET_SCORE_SUCCESS,
    payload: { actionType, data },
});

export const getScoreFail = (actionType, error) => ({
    type: GET_SCORE_FAIL,
    payload: { actionType, error },
});

export const getScore = data => ({
    type: GET_SCORE,
    payload: data,
});

export const getScoreLoading = () => ({
    type: SCORE_LOADING
});

export const deleteScore = data => ({
    type: DELETE_SCORE,
    payload: data,
});

export const deleteScoreSuccess = data => ({
    type: DELETE_SCORE_SUCCESS,
    payload: data,
});

export const deleteScoreFail = error => ({
    type: DELETE_SCORE_FAIL,
    payload: error,
});

export const updateScore = data => ({
    type: UPDATE_SCORE,
    payload: data,
});

export const updateScoreFail = error => ({
    type: UPDATE_SCORE_FAIL,
    payload: error,
});

export const updateScoreSuccess = data => ({
    type: UPDATE_SCORE_SUCCESS,
    payload: data,
});

export const addNewScore = data => ({
    type: ADD_NEW_SCORE,
    payload: data,
});

export const addScoreSuccess = data => ({
    type: ADD_SCORE_SUCCESS,
    payload: data,
});

export const addScoreFail = error => ({
    type: ADD_SCORE_FAIL,
    payload: error,
});
