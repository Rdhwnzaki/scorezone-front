import { all, fork } from "redux-saga/effects";


import ClubSaga from "./club/saga";
import ScoreSaga from "./score/saga";

export default function* rootSaga() {
    yield all([
        fork(ClubSaga),
        fork(ScoreSaga)
    ]);
}
