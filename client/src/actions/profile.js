import axios from 'axios';
import { setAlert } from './alert';

import {
    GET_PROFILE,
    PROFILE_ERROR,
    UPDATE_PROFILE,
    CLEAR_PROFILE,
    GET_PROFILES,
    ACCOUNT_DELETED,
    LOGOUT,
} from './types';

// Get current users profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me');
        dispatch({
            type: GET_PROFILE,
            payload: res.data,
        });

    } catch (err) {
        console.log(err.response.statusText);

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status },
        })
    }
}

export const createProfile = (formData, history, edit = false) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const body = JSON.stringify(formData);
    try {
        const res = await axios.post('/api/profile', body, config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });
        dispatch(setAlert(edit ? 'Profile updated' : 'Profile created'), 'success');
        history.push('/dashboard');

    } catch (err) {
        console.log(err);
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR
        });
    }
}

// Add experience

export const addExperience = (formData, history) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const body = JSON.stringify(formData);
    try {
        const res = await axios.put('/api/profile/experience', body, config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });
        dispatch(setAlert('Experience added', 'success'));
        history.push('/dashboard');

    } catch (err) {
        console.log(err);
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR
        });
    }
}

export const addEducation = (formData, history) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const body = JSON.stringify(formData);
    try {
        const res = await axios.put('/api/profile/education', body, config);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        });
        dispatch(setAlert('Education added', 'success'));
        history.push('/dashboard');

    } catch (err) {
        console.log(err);
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR
        });
    }
}

export const deleteExperience = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/experience/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        })
        dispatch(setAlert('Experience Removed', 'success'));

    } catch (err) {
        console.log(err);
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
        })
    }
}

export const deleteEducation = id => async dispatch => {
    try {
        const res = await axios.delete(`/api/profile/education/${id}`);
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data,
        })
        dispatch(setAlert('Education Removed', 'success'));

    } catch (err) {
        console.log(err);
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
        })
    }
}

export const deleteProfile = (history) => async dispatch => {
    if(window.confirm('Are you sure? This can NOT be undone!'))
    try {
        const res = await axios.delete(`/api/profile`);
        dispatch({ type: CLEAR_PROFILE });
        dispatch({ type: ACCOUNT_DELETED });
        dispatch(setAlert('Your account has been permanantly deleted', 'success'));
        history.push('/dashboard');
    } catch (err) {
        console.log(err);

        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
            type: PROFILE_ERROR,
        })
    }
};

// Get all profiles
export const getProfiles = () => async dispatch => {
    dispatch({ type: CLEAR_PROFILE });
    
    try {
        const res = await axios.get('/api/profile');

        console.log(res.data);
        dispatch({
            type: GET_PROFILES,
            payload: res.data,
        });
    } catch (err) {
        console.log(err);
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        })
    }
}

// Get profile by ID
export const getProfileById = userId => async dispatch => {
    try {
        const res = await axios.get(`/api/profile${userId}`);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status }
        });
    }
}