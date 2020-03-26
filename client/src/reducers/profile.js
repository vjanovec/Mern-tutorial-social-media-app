import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE } from "../actions/types";
import { setAlert } from './alert';

const initialState = {
    profile: null,
    profiles: [],
    repos: [],
    loading: true,
    error: {},
}

export default (state = initialState, action) => {
    const { type, payload } = action;


    switch (type) {
        case GET_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false,
            }
        case PROFILE_ERROR:
            console.log('profile reducer')
            return {
                ...state,
                profile: null,
                error: payload,
                loading: false,
            };
        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                repos: [],
                loading: false,
            }
        default: {
            return state;
        }
    }
}