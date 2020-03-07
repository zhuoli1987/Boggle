import React, { Component} from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';

import './gamepage.css';


class GamePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boardChars: [["t", "a","b","c"],["d","t","e","f"],["g","f","h","i"],["j","k","m","n","o"]],
            correctWords: [],
            users: [],
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
        axios.get('/api/v1/boggle/board').then(
            (response) => {
                const boardChars = response.data.data;
                this.setState({ boardChars: boardChars })
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
            if (this.validateWord(wordToBeSubmitted)){
                console.log('HERERR');
                axios.post(
                    '/api/v1/boggle/word', 
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
            clearInterval(this.state.intervalId)
            this.onTimesUp()
        }
    }

    validateWord = (word) => {
        let startPoints = this.findStartPoint(word.charAt(0));
        let board = this.state.boardChars;
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
        let m = this.state.boardChars.length;
        let n = this.state.boardChars[0].length;

        for(var i = 0; i < m; i++) {
            for(var j = 0; j < n; j++)
                if (this.state.boardChars[i][j] === firstChar) {
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
                finalWord: e.target.value 
            }
        )
        
    }

    // ********* React life cycle methods below **************
    componentWillMount() {
        // Initialize the board
        //this.initBoard();
        
        var intervalId = setInterval(this.timer, 1000);
        this.setState(
            { 
                intervalId: intervalId 
            }
        );
    }

    render() {
        return (
            <div className="Page">
                <div className="Game-container">
                    <div>
                        <h1>Points: {this.state.points}</h1>
                    </div>
                    <div>
                        <h3>
                            <span>Countdown: {this.state.timeInSec} s</span>
                        </h3>
                    </div>
                    <div id="row01" className="rowstyle">
                        <div id="00" className="colstyle">{this.state.boardChars[0][0]}</div>
                        <div id="01" className="colstyle">{this.state.boardChars[0][1]}</div>
                        <div id="02" className="colstyle">{this.state.boardChars[0][2]}</div>
                        <div id="03" className="colstyle">{this.state.boardChars[0][3]}</div>
                    </div>
                    <div id="row02" className="rowstyle">
                        <div id="10" className="colstyle">{this.state.boardChars[1][0]}</div>
                        <div id="11" className="colstyle">{this.state.boardChars[1][1]}</div>
                        <div id="12" className="colstyle">{this.state.boardChars[1][2]}</div>
                        <div id="13" className="colstyle">{this.state.boardChars[1][3]}</div>
                    </div>
                    <div id="row03" className="rowstyle">
                        <div id="20" className="colstyle">{this.state.boardChars[2][0]}</div>
                        <div id="21" className="colstyle">{this.state.boardChars[2][1]}</div>
                        <div id="22" className="colstyle">{this.state.boardChars[2][2]}</div>
                        <div id="23" className="colstyle">{this.state.boardChars[2][3]}</div>
                    </div>
                    <div id="row04" className="rowstyle">
                        <div id="30" className="colstyle">{this.state.boardChars[3][0]}</div>
                        <div id="31" className="colstyle">{this.state.boardChars[3][1]}</div>
                        <div id="32" className="colstyle">{this.state.boardChars[3][2]}</div>
                        <div id="33" className="colstyle">{this.state.boardChars[3][3]}</div>
                    </div>
                    <div className="submit-field">
                        <TextField
                            id="outlined-word"
                            label="Please enter a word you found"
                            value={this.state.finalWord}
                            style={{
                                display: 'flex',
                                margin: '0px 20px 20px 20px'
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