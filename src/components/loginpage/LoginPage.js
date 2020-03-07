import React, { Component} from 'react';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Route } from 'react-router-dom';

import './loginpage.css';

class LoginPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: ''
        }
    }

    handleNameChange(e) {
        this.setState({ name: e.target.value })
    }

    playGame(history) {
        if (this.state.name.length !== 0) {
            history.push('/game/' + this.state.name);
        }
        else {
            alert("Please Enter Your Name");
        }
    }

    render() {
        return(
          <div className="Page">
              <div className="Page-header">
                <Paper elevation={1}>
                    <h1>Boggle Game</h1>

                    <form className="container" noValidate autoComplete="off">
                            <TextField
                                id="outlined-name"
                                label="Please enter your name"
                                value={this.state.name}
                                style={{
                                    display: 'flex',
                                    margin: '0px 20px 20px 20px'
                                }}
                                onChange={(e) => this.handleNameChange(e)}
                                margin="normal"
                                variant="outlined"
                            />

                            <Route render={
                                ({ history }) => (
                                    <Button
                                        variant="contained"
                                        style={{
                                            display: 'flex',
                                            margin: '0px 20px 20px 20px'
                                        }}
                                        color="primary"
                                        type="submit"
                                        onClick={() => this.playGame(history)}
                                    >
                                    Play
                                    </Button>
                                )
                            } />
                    </form>
                </Paper>
              </div>
          </div>  
        );
    }
}

export default LoginPage;