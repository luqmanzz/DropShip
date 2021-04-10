import { UPDATE_MODELS, UPDATE_MODELS_PRICES } from '../ActionTypes/ActionTypes';

// initial reducer state
const initialState = {};

// default reducer function
export default function ModelReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_MODELS:
            return Object.assign({}, state, action.payload);  
        default:
            return state;
    }
}
