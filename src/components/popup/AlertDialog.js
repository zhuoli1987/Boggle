
import React, { Component } from 'react';
import Modal from '@material-ui/core/Modal';
import PropTypes from 'prop-types';

class AlertDialog extends Component {

    handleClose = () => {
        this.props.onClose();
    };

    render() {
        const { classes, onClose, title, message, ...other } = this.props;
        return (
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                onClose={this.handleClose}
                {...other}
                style={{display:'flex',alignItems:'center',justifyContent:'center'}}
            >
                <div style={{
                    position: 'absolute',
                    width: 300,
                    backgroundColor: 'white',
                    border: '0.5px solid #000',
                    padding: '10px',
                    textAlign: 'center',
                }} >
                    <h2 id="simple-modal-title">{title}</h2>
                    <p id="simple-modal-description">
                        {message}
                    </p>
                </div>
            </Modal>
        );
    }
}

AlertDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};
  

export default AlertDialog;
