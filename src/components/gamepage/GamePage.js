import React, { Component} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';

import './gamepage.css';
import ResultsDialog from '../popup/ResultsDialog';


class GamePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            board: [],
            correctWords: [],
            users: [],
            user_name: "",
            gameId: "",
            dialogOpen: false,
            complete: false,
            timeInSec: 180,
            points: 0,
            finalWord: "",
        };
    }

    submittedwords = [];

    // ********* Helper methods below **************

    //Initial the board from backend for the first time
    initBoard = () => {
        let url_split = window.location.href.toString().split("/"); 
        let user_name = url_split[url_split.length - 1];

        axios.get('http://localhost:8000/api/v1/boggle/board/' + user_name).then(
            response => {
                const chars = response.data.data;;
                const gameId = response.data.id;
                this.setState(
                    { 
                        board: chars,
                        gameId: gameId
                    }
                );
                
            }
        );
    }

    // Submit selected word to the back end
    // Store selected words in an array
    // Check whether word is already selected
    submitToCheck() {
        let wordToBeSubmitted = this.state.finalWord;
        var found = this.submittedwords.find( 
            element =>  {
                return element === wordToBeSubmitted;
            }
        );
        
        if (found !== wordToBeSubmitted) {
            console.log('IIIII');
            if (this.validateWord(wordToBeSubmitted)){
                console.log('HERERE');
                axios.post(
                    'http://localhost:8000/api/v1/boggle/word/' + this.state.gameId, 
                    {
                        word: this.state.finalWord
                    }
                ).then(
                    (response) => {
                        if (response.data.check === true) {
                            this.setState(
                                { 
                                    points: this.state.points + response.data.points, 
                                    correctWords: response.data.results 
                                }
                            );
                        }
                    }
                ).catch(
                    (error) => {
                        console.log(error);
                    }
                )
            }else {
                // Error Pop up
            }
        } else {
            // display error message
        }
    }

    // time out when timeInSec value exceeds
    timer = () => {
        this.setState(
            {
                timeInSec: this.state.timeInSec - 1
            }
        );

        if (this.state.timeInSec === 0) {
            clearInterval(this.state.intervalId);
            this.onTimesUp();
        }
    }

    validateWord = (word) => {
        let startPoints = this.findStartPoint(word.charAt(0));
        let board = this.state.board;
        let is_valid = false;
        let m = board.length;
        let n = board[0].length;

        while (!is_valid && startPoints.length > 0) {
            let index = startPoints.pop();

            let rowIndex = index[0];
            let colIndex = index[1];
            let wordArr = [...word];
            /**
             *  We want to check all positions 
             *  acount C
             * 
             *  1   2   3
             *  4   C   5
             *  6   7   8
             */
            for (var i = 1; i < wordArr.length; i++) {
                let curChar = wordArr[i];

                if (
                    (
                        colIndex - 1 >= 0 
                        && board[rowIndex][colIndex - 1] === curChar // position 4
                    )
                    ||
                    (
                        colIndex + 1 < n 
                        && board[rowIndex][colIndex + 1] === curChar // position 5
                    )
                    ||
                    (
                        rowIndex - 1 >= 0 
                        && board[rowIndex - 1][colIndex] === curChar // position 2
                    )
                    ||
                    (
                        rowIndex + 1 < m 
                        && board[rowIndex + 1][colIndex] === curChar // position 7
                    )
                    ||
                    (
                        rowIndex - 1 >= 0 
                        && colIndex - 1 >= 0
                        && board[rowIndex - 1][colIndex - 1] === curChar // position 1
                    )
                    ||
                    (
                        rowIndex - 1 >= 0 
                        && colIndex + 1 < n
                        && board[rowIndex - 1][colIndex + 1] === curChar // position 3
                    )
                    ||
                    (
                        rowIndex + 1 < m 
                        && colIndex - 1 >= 0 
                        && board[rowIndex + 1][colIndex - 1] === curChar // position 6
                    )
                    ||
                    (
                        rowIndex + 1 < m 
                        && colIndex + 1 < n 
                        && board[rowIndex + 1][colIndex + 1] === curChar // position 8
                    )
                ) {
                    continue;
                } else {
                    return false; // the sequence has stopped
                }
                
            }

            is_valid = true;
        }
        
        return is_valid;
    }

    findStartPoint = (firstChar) => {
        let startPoints = [];
        let m = this.state.board.length;
        let n = this.state.board[0].length;

        for(var i = 0; i < m; i++) {
            for(var j = 0; j < n; j++)
                if (this.state.board[i][j] === firstChar) {
                    startPoints.push([i, j]);
                }
        }
        return startPoints;
    }

    // ********* Handlers below **************

    handleClose = value => {
        this.setState({ dialogOpen: false });
        window.location.reload();
    }

    onTimesUp = () => {
        // this.getLeaderboard();
        this.setState(
            {
                dialogOpen: true, 
                complete: true 
            }
        );
    }

    handleTextChange(e) {
        this.setState(
            { 
                finalWord: e.target.value.toUpperCase() 
            }
        )
        
    }

    // ********* React life cycle methods below **************
    componentDidMount() {
        // Initialize the board
        this.initBoard();
        var intervalId = setInterval(this.timer, 1000);
        this.setState(
            { 
                intervalId: intervalId 
            }
        );
    }

    render() {
        if (this.state.board.length === 0) {
            return (
                <div className="Page">
                    <div className="Game-container">
                        Loading...
                    </div>
                </div>
            );
        }

        return (
            <div className="Page">
                <ResultsDialog
                    open={this.state.dialogOpen}
                    onClose={this.handleClose}
                    submittedwords={this.submittedwords}
                    finalresult={this.state.points}
                    result={this.state.correctWords}
                    users={this.state.users}
                />
                <div className="Game-container">
                    <div>
                        <h1>POINTS: {this.state.points}</h1>
                    </div>
                    <div>
                        <h3>
                            <span>COUNTDOWN: {this.state.timeInSec} S</span>
                        </h3>
                    </div>
                    <div id="row01" className="rowstyle">
                        <div id="00" className="colstyle">{this.state.board[0][0]}</div>
                        <div id="01" className="colstyle">{this.state.board[0][1]}</div>
                        <div id="02" className="colstyle">{this.state.board[0][2]}</div>
                        <div id="03" className="colstyle">{this.state.board[0][3]}</div>
                    </div>
                    <div id="row02" className="rowstyle">
                        <div id="10" className="colstyle">{this.state.board[1][0]}</div>
                        <div id="11" className="colstyle">{this.state.board[1][1]}</div>
                        <div id="12" className="colstyle">{this.state.board[1][2]}</div>
                        <div id="13" className="colstyle">{this.state.board[1][3]}</div>
                    </div>
                    <div id="row03" className="rowstyle">
                        <div id="20" className="colstyle">{this.state.board[2][0]}</div>
                        <div id="21" className="colstyle">{this.state.board[2][1]}</div>
                        <div id="22" className="colstyle">{this.state.board[2][2]}</div>
                        <div id="23" className="colstyle">{this.state.board[2][3]}</div>
                    </div>
                    <div id="row04" className="rowstyle">
                        <div id="30" className="colstyle">{this.state.board[3][0]}</div>
                        <div id="31" className="colstyle">{this.state.board[3][1]}</div>
                        <div id="32" className="colstyle">{this.state.board[3][2]}</div>
                        <div id="33" className="colstyle">{this.state.board[3][3]}</div>
                    </div>
                    <div className="submit-field">
                        <TextField
                            id="outlined-word"
                            label="Please enter a word you found"
                            value={this.state.finalWord}
                            style={{
                                display: 'flex',
                                width: '100%',
                            }}
                            onChange={(e) => this.handleTextChange(e)}
                            margin="normal"
                            variant="outlined"
                        />
                    </div>
                    <div className="submitbtn" onClick={() => this.submitToCheck()}>
                        <p>Submit</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default GamePage;