import React, { Component } from 'react';
import './errorpage.css';
class ErrorPage extends Component {
    render() {
        return(
            <div className="Page">
                <div className="error">
                    <div className="error-wrapper">
                        <h1>404 Page Not Found</h1>
                    </div>
                </div>
            </div>
        );
    }
}

export default ErrorPage;