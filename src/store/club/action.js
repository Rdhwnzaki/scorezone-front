import {
    GET_CLUB,
    GET_CLUB_SUCCESS,
    GET_CLUB_FAIL,
    DELETE_CLUB,
    DELETE_CLUB_SUCCESS,
    DELETE_CLUB_FAIL,
    UPDATE_CLUB,
    UPDATE_CLUB_SUCCESS,
    UPDATE_CLUB_FAIL,
    ADD_NEW_CLUB,
    ADD_CLUB_SUCCESS,
    ADD_CLUB_FAIL,
    CLUB_LOADING,
    CLUB_RESET,
} from "./actionType";

export const resetClubState = (actionType) => ({
    type: CLUB_RESET,
    payload: { actionType },
});

export const getClubSuccess = (actionType, data) => ({
    type: GET_CLUB_SUCCESS,
    payload: { actionType, data },
});

export const getClubFail = (actionType, error) => ({
    type: GET_CLUB_FAIL,
    payload: { actionType, error },
});

export const getClub = data => ({
    type: GET_CLUB,
    payload: data,
});

export const getClubLoading = () => ({
    type: CLUB_LOADING
});

export const deleteClub = data => ({
    type: DELETE_CLUB,
    payload: data,
});

export const deleteClubSuccess = data => ({
    type: DELETE_CLUB_SUCCESS,
    payload: data,
});

export const deleteClubFail = error => ({
    type: DELETE_CLUB_FAIL,
    payload: error,
});

export const updateClub = data => ({
    type: UPDATE_CLUB,
    payload: data,
});

export const updateClubFail = error => ({
    type: UPDATE_CLUB_FAIL,
    payload: error,
});

export const updateClubSuccess = data => ({
    type: UPDATE_CLUB_SUCCESS,
    payload: data,
});

export const addNewClub = data => ({
    type: ADD_NEW_CLUB,
    payload: data,
});

export const addClubSuccess = data => ({
    type: ADD_CLUB_SUCCESS,
    payload: data,
});

export const addClubFail = error => ({
    type: ADD_CLUB_FAIL,
    payload: error,
});
