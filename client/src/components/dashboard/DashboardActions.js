import React from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { deleteProfile } from '../../actions/profile';
import { withRouter } from 'react-router-dom';

export const DashboardActions = ({history, deleteProfile}) => {
    return (
        <div className="dash-buttons">
        <Link to="/edit-profile" className="btn btn-light"
          ><i className="fas fa-user-circle text-primary"></i> Edit Profile</Link>
        <Link to="/add-experience" className="btn btn-light"
          ><i className="fab fa-black-tie text-primary"></i> Add Experience</Link>
        <Link to="/add-education" className="btn btn-light"
          ><i className="fas fa-graduation-cap text-primary"></i> Add Education</Link>
        <button className='btn btn-danger' onClick={() => deleteProfile(history)}>Delete profile</button>
      </div>
    )
}

export default connect(null, { deleteProfile })(withRouter(DashboardActions));