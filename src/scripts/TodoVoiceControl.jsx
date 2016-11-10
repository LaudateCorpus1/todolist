import React from 'react';

import '../styles/voice-control';

class TodoVoiceControl extends React.Component {

    constructor(props) {
        super(props);
        this.state = {speaking: false};
    }

    handleClick() {
        var self = this;
        ya.speechkit.recognize({
            doneCallback: function (text) {
                self.refs.text.innerHTML = "Вы сказали: " + text;
                self.props.onControl(text);
            },
            initCallback: function () {
                self.refs.text.innerHTML = "Говорите...";
            },
            errorCallback: function (err) {
                self.refs.text.innerHTML = "Ошибка: " + err;
            },
            model: 'freeform', // Model name for recognition process
            lang: 'ru-RU', //Language for recognition process
            apiKey: '570fd671-7f9a-4555-be3a-3af792c9d4b2'
        });
    }

    render() {

        return (
            <div>
                <div className="voice-button" onClick={this.handleClick.bind(this)}>
                    <i className="glyphicon glyphicon-volume-up"></i>
                </div>
                <span ref="text"></span>
            </div>
        )
    }
}

export default TodoVoiceControl;