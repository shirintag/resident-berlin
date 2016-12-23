import React from 'react';
import ReactDOM from 'react-dom';

function HelloWorld() {
    return (
        <div>Hello world!</div>
    )
}

ReactDOM.render(
    <HelloWorld />,
    document.getElementById('main')
);
