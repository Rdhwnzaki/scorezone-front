import {
    SCORE_LOADING,
    GET_SCORE,
    GET_SCORE_SUCCESS,
    GET_SCORE_FAIL,
    ADD_SCORE_SUCCESS,
    ADD_SCORE_FAIL,
    DELETE_SCORE_SUCCESS,
    DELETE_SCORE_FAIL,
    UPDATE_SCORE_SUCCESS,
    UPDATE_SCORE_FAIL,
    SCORE_RESET
} from "./actionType";

const INIT_STATE = {
    scores: [],
    error: {},
};

const Score = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_SCORE_SUCCESS:
            switch (action.payload.actionType) {
                case GET_SCORE:
                    return {
                        ...state,
                        scores: action.payload.data,
                        isScoreCreated: false,
                        isScoreSuccess: true,
                        loading: false,
                    };

                default:
                    return { ...state };
            }
        case GET_SCORE_FAIL:
            switch (action.payload.actionType) {
                case GET_SCORE_FAIL:
                    return {
                        ...state,
                        error: action.payload.error,
                        isScoreCreated: false,
                        isScoreSuccess: false,
                        loading: false,
                    };
                default:
                    return { ...state };
            }

        case GET_SCORE: {
            return {
                ...state,
                isScoreCreated: false,
                loading: true,
            };
        }

        case SCORE_LOADING: {
            return {
                ...state,
                isScoreCreated: false,
                loading: true,
            };
        }

        case ADD_SCORE_SUCCESS:
            return {
                ...state,
                isScoreCreated: true,
                loading: false,
                scores: [...state.scores, action.payload.data],
            };

        case ADD_SCORE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case DELETE_SCORE_SUCCESS:
            return {
                ...state,
                loading: false,
                isScoreCreated: true,
                scores: state.scores.filter(
                    score => score.id !== action.payload.id
                ),
            };

        case DELETE_SCORE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case UPDATE_SCORE_SUCCESS:
            return {
                ...state,
                loading: false,
                isScoreCreated: true,
                scores: state.scores.map(score =>
                    score.id === action.payload.data.id ? { ...score, ...action.payload.data } : score
                ),
            };

        case UPDATE_SCORE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case SCORE_RESET:
            return INIT_STATE;


        default:
            return { ...state };
    }
};

export default Score;
