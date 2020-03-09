import React, { Component } from 'react';
import './resultsdialog.css';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class ResultsDialog extends Component {
    handleClose = () => {
        this.props.onClose();
    };

    render() {
        const { classes, onClose, selectedValue, ...other } = this.props;
        return(
            <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
                <DialogTitle id="simple-dialog-title">Score Card</DialogTitle>
                <DialogContent>
                    <h2>Total Score: {this.props.finalresult}</h2>
                </DialogContent>
                <Table style={
                    { 
                        margin: '10px',
                        display: 'flex'
                    }
                }>
                    <TableHead>
                        <TableRow>
                            <TableCell>Word</TableCell>
                            <TableCell align="right">Points</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.result && this.props.result.map(row => (
                            <TableRow key={row[0]}>
                                <TableCell component="th" scope="row">
                                    {row[0]}
                                </TableCell>
                                <TableCell align="right">{row[1]}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Replay
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default ResultsDialog;