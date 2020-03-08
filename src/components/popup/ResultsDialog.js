import React, { Component } from 'react';
import './resultsdialog.css';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

class ResultsDialog extends Component {

    render() {
        return(
            <Dialog>
                <DialogTitle id="simple-dialog-title">Score Card</DialogTitle>
            </Dialog>
        );
    }
}

export default ResultsDialog;