import { combineReducers } from "redux";

import Club from "./club/reducer"
import Score from "./score/reducer";

const rootReducer = combineReducers({
    Club,
    Score
});

export default rootReducer;
