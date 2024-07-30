import {
    CLUB_LOADING,
    GET_CLUB,
    GET_CLUB_SUCCESS,
    GET_CLUB_FAIL,
    ADD_CLUB_SUCCESS,
    ADD_CLUB_FAIL,
    DELETE_CLUB_SUCCESS,
    DELETE_CLUB_FAIL,
    UPDATE_CLUB_SUCCESS,
    UPDATE_CLUB_FAIL,
    CLUB_RESET
} from "./actionType";

const INIT_STATE = {
    clubs: [],
    error: {},
};

const Club = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_CLUB_SUCCESS:
            switch (action.payload.actionType) {
                case GET_CLUB:
                    return {
                        ...state,
                        clubs: action.payload.data,
                        isClubCreated: false,
                        isClubSuccess: true,
                        loading: false,
                    };

                default:
                    return { ...state };
            }
        case GET_CLUB_FAIL:
            switch (action.payload.actionType) {
                case GET_CLUB_FAIL:
                    return {
                        ...state,
                        error: action.payload.error,
                        isClubCreated: false,
                        isClubSuccess: false,
                        loading: false,
                    };
                default:
                    return { ...state };
            }

        case GET_CLUB: {
            return {
                ...state,
                isClubCreated: false,
                loading: true,
            };
        }

        case CLUB_LOADING: {
            return {
                ...state,
                isClubCreated: false,
                loading: true,
            };
        }

        case ADD_CLUB_SUCCESS:
            return {
                ...state,
                isClubCreated: true,
                loading: false,
                clubs: [...state.clubs, action.payload.data],
            };

        case ADD_CLUB_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case DELETE_CLUB_SUCCESS:
            return {
                ...state,
                loading: false,
                isClubCreated: true,
                clubs: state.clubs.filter(
                    club => club.id !== action.payload.id
                ),
            };

        case DELETE_CLUB_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case UPDATE_CLUB_SUCCESS:
            return {
                ...state,
                loading: false,
                isClubCreated: true,
                clubs: state.clubs.map(club =>
                    club.id === action.payload.data.id ? { ...club, ...action.payload.data } : club
                ),
            };

        case UPDATE_CLUB_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case CLUB_RESET:
            return INIT_STATE;


        default:
            return { ...state };
    }
};

export default Club;
