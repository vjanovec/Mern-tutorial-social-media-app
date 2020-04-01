import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { addEducation } from '../../actions/profile';
import { withRouter } from 'react-router-dom';

const AddEducation = ({ addEducation, history }) => {

    const [formData, setFormData] = useState({
        school: '',
        degree: '',
        fieldofstudy: '',
        from: '',
        current: false,
        to: '',
        description: '',
    });

    const onChange = (e) => {
        if (e.target.name === 'current') {
            return setFormData({ ...formData, [e.target.name]: e.target.checked });
        } else {
            return setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        addEducation(formData, history);
    }

    return (
        <Fragment>
            <h1 class="large text-primary">
                Add Your Education
      </h1>
            <p class="lead">
                <i class="fas fa-graduation-cap"></i> Add any school, bootcamp, etc that
        you have attended
      </p>
            <small>* = required field</small>
            <form class="form" onSubmit={e => onSubmit(e)}>
                <div class="form-group">
                    <input
                        type="text"
                        placeholder="* School or Bootcamp"
                        name="school"
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div class="form-group">
                    <input
                        type="text"
                        placeholder="* Degree or Certificate"
                        name="degree"
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div class="form-group">
                    <input type="text" placeholder="Field Of Study" name="fieldofstudy" onChange={e => onChange(e)}/>
                </div>
                <div class="form-group">
                    <h4>From Date</h4>
                    <input type="date" name="from" onChange={e => onChange(e)} />
                </div>
                <div class="form-group">
                    <p>
                        <input type="checkbox" name="current" value="" onChange={e => onChange(e)} /> Current School or Bootcamp
                    </p>
                </div>
                {formData.current ? null : (<div class="form-group">
                    <h4>To Date</h4>
                    <input type="date" name="to" onChange={e => onChange(e)} />
                </div>)}
                
                <div class="form-group">
                    <textarea
                        name="description"
                        cols="30"
                        rows="5"
                        placeholder="Program Description"
                        onChange={e => onChange(e)}></textarea>
                </div>
                <input type="submit" class="btn btn-primary my-1" />
                <a class="btn btn-light my-1" href="/dashboard">Go Back</a>
            </form>
        </Fragment>
    )
}

export default connect(null, { addEducation })(withRouter(AddEducation));