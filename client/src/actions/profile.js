import axios from 'axios';
import { setAlert } from './alert';

import {
    GET_PROFILE,
    PROFILE_ERROR,
    CREATE_PROFILE, 
    CREATE_PROFILE_ERROR,
} from './types';

// Get current users profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });

    } catch(err) {
        console.log(err.response.statusText);

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
        })
    }
}

export const createProfile = (formData) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const body = JSON.stringify(formData);
    try {
        const res = await axios.post('/api/profile', body, config);
        dispatch({
            type: CREATE_PROFILE,
            payload: res.data,
        })

    } catch(err) {
        console.log(err);
        const errors = err.response.data.errors;
        if(errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: CREATE_PROFILE_ERROR
        });
        
    }
}