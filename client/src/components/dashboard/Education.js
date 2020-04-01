import React, { Fragment } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { deleteEducation } from '../../actions/profile';


export const Education = ({ education, deleteEducation }) => {
    const educations = education.map(edc => (
        <tr key={edc._id}>
            <td>{edc.school}</td>
            <td className='hide-sm'>{edc.fieldofstudy}</td>
            <td>
                <Moment format='YYYY/MM/DD'>{edc.from}</Moment> -{' '}
                {edc.to === null ? (
                    'Now'
                ) : (
                    <Moment format='YYYY/MM/DD'>{edc.to}</Moment>
                )}
            </td>
            <td>
                <button className='btn btn-danger' onClick={() => deleteEducation(edc._id)} >Delete</button>
            </td>
            </tr>
    ));
    return (
            <Fragment>
                <h2 className='my-2'>Education Credentials</h2>
                <table className="table">
                    <thead>
                        <th>School</th>
                        <th className='hide-sm'>Field of study</th>
                        <th className='hide-sm'>Years</th>
                        <th />
                    </thead>
                    <tbody>
                        {educations}
                    </tbody>
                </table>
            </Fragment>
    )
}

Education.propTypes = {
    education: PropTypes.array.isRequired,
    deleteEducation: PropTypes.func.isRequired,
}


export default connect(null, { deleteEducation })(Education);
