import React from "react";
import {HelpBlock, FormGroup, ControlLabel, FormControl} from "react-bootstrap/lib";
import * as Validator from "../util/validator";

export default class FormGroupEditLyrics extends React.Component {

    render() {
        return (
            <FormGroup
                controlId="formBasicText"
                validationState={Validator.validateLyrics(this.props.value)}
            >
                <ControlLabel>Lyrics</ControlLabel>
                <FormControl
                    disabled={this.props.disabled}
                    style={{fontFamily: "monospace", resize: "vertical", minHeight: 340}}
                    componentClass="textarea"
                    type="text"
                    placeholder="Lyrics"
                    value={this.props.value}
                    onChange={this.props.onChange}
                />
                <FormControl.Feedback />
                <HelpBlock>You can escape chord with "\" character, e.g. "What \A Hell", so it won't be rendered</HelpBlock>
            </FormGroup>
        )
    }
}