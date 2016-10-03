import React from "react";
import * as $ from "jquery";
import BasePageTemplate from "./BasePageTemplate";
import api from "../global/api";
import {HelpBlock, Button, FormGroup, ControlLabel, FormControl} from "react-bootstrap/lib";
import update from "react-addons-update";
import SelectPerformer from "../components/SelectPerformer";
import * as validator from "../util/validator";
import {Parser} from "react-chord-parser";
import ChordInput from "../components/ChordInput";

export default class AddNewSongPage extends BasePageTemplate {

    constructor() {
        super();
        this.state = {
            performerNames: [],
            song: {
                title: "",
                lyrics: "",
            },
            performerName: "",
            performerId: -1,
            performerExists: false,
            error: "",
            submitting: false,
            chords: {},
            unknownChordNames: []
        };
    }

    componentDidMount() {
        this.loadAllPerformers();
    }

    loadAllPerformers() {
        this.startLoading();
        $.ajax({
            url: `${api.performers}/all`,
            dataType: 'json',
            type: 'GET',
            success: function (data) {
                this.setState({
                    performerNames: data
                });
                this.finishLoading();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    handleSongSubmit = (e) => {
        e.preventDefault();

        this.setState({
            submitting: true
        });

        this.getPerformerId((err, result) => {
            if (!err) {
                this.submitSong(result);
            } else {
                this.setState({
                    submitting: false
                });
                this.setState({
                    error: `Performer '${this.state.performerName}' not found`
                })
            }
        });
    };

    getPerformerId(callback) {
        $.ajax({
            url: `${api.performers}/v2/search/?name=${this.state.performerName}`,
            type: 'GET',
            success: function (data) {
                callback(null, data.id);
            },
            error: function (xhr, status, err) {
                console.error(status, err.toString());
                callback(err);
            }
        });
    }

    submitSong = (performerId) => {
        var data = {
            performerId: performerId,
            title: this.state.song.title.trim(),
            lyrics: this.state.song.lyrics.trim(),
        };

        $.ajax({
            url: api.songs,
            type: 'POST',
            data: JSON.stringify(data),
            success: function (data) {
                this.setState({
                    submitting: false
                });
                this.context.router.replace(`/song/${data.id}`);
            }.bind(this),
            error: function (xhr, status, err) {
                this.setState({
                    submitting: false,
                    error: "Can't process request, please try again later"
                })
            }.bind(this)
        });
    };

    handlePerformerNameChange = (name, exists) => {
        this.setState({
            performerName: name,
            performerExists: exists,
            error: ""
        });
    };

    handleTitleChange = (e) => {
        const newState = update(this.state, {
            song: {
                title: {$set: e.target.value}
            },
            error: {$set: ""}
        });
        this.setState(newState);
    };

    handleLyricsChange = (e) => {
        const newLyrics = e.target.value;

        const savedChords = Object.keys(this.state.chords);
        const uniqueChords = new Parser(newLyrics).unique();

        const deletedChords = savedChords.filter(i => uniqueChords.indexOf(i) < 0);
        const newChords = uniqueChords.filter(i => savedChords.indexOf(i) < 0);

        const {chords} = this.state;
        const {unknownChordNames} = this.state;
        deletedChords.forEach(chord => {
            delete chords[chord];
            unknownChordNames.splice($.inArray(chord, unknownChordNames), 1);
        });

        const newState = update(this.state, {
            song: {
                lyrics: {$set: newLyrics}
            },
            chords: {$set: chords},
            unknownChordNames: {$set: unknownChordNames},
            error: {$set: ""}
        });
        this.setState(newState, () => {
            if (newChords.length) {
                this.hydrateChords(newChords);
            }
        });
    };

    hydrateChords = (chords) => {
        const input = {
            input: chords.map(chordName => ({name: chordName}))
        };

        $.ajax({
            url: `${api.chord}/hydrate`,
            type: 'POST',
            data: JSON.stringify(input),
            success: data => {
                this.processChordServerResponse(data);
            },
            error: (xhr, status, err) => {
                console.error(xhr, status, err);
            }
        });
    };

    processChordServerResponse(data) {
        const {chords} = this.state;

        data.forEach(chordDto => {
            chords[chordDto.name] = chordDto.diagram;
        });

        const unknownChordNames = Object.keys(chords).filter(key => !chords[key]);

        this.setState({
            chords,
            unknownChordNames
        });
    }

    handleCancel = (e) => {
        e.preventDefault();
        this.context.router.goBack();
    };

    validateAll = () => {
        return validator.validatePerformer(this.state.performerName, this.state.performerExists, true)
            && validator.validateLyrics(this.state.song.lyrics, true)
            && validator.validateTitle(this.state.song.title, true);
    };

    renderHeader() {
        return (
            <h3>Add new song</h3>
        )
    }

    renderUnknownChords() {
        const nodes = [];

        this.state.unknownChordNames.forEach(chord => {
            nodes.push(<ChordInput submitting={this.state.submitting} style={{marginLeft: 16}} key={chord} name={chord} diagram="xxxxxx"/>)
        });

        return nodes;
    }

    renderContent() {
        return (
            <form onSubmit={this.handleSongSubmit} style={{marginTop: 16}}>
                <FormGroup
                    controlId="formBasicText"
                    validationState={validator.validatePerformer(this.state.performerName, this.state.performerExists)}
                >
                    <ControlLabel>Performer</ControlLabel>
                    <SelectPerformer
                        submitting={this.state.submitting}
                        callback={this.handlePerformerNameChange}
                        performerNames={this.state.performerNames}/>
                    <FormControl.Feedback />
                </FormGroup>

                <FormGroup
                    controlId="formBasicText"
                    validationState={validator.validateTitle(this.state.song.title)}
                >
                    <ControlLabel>Title</ControlLabel>
                    <FormControl
                        disabled={this.state.submitting}
                        type="text"
                        placeholder="Title"
                        value={this.state.song.title}
                        onChange={this.handleTitleChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>

                <FormGroup
                    controlId="formBasicText"
                    validationState={validator.validateLyrics(this.state.song.lyrics)}
                >
                    <ControlLabel>Lyrics</ControlLabel>
                    <p><small>Wrap each chord into braces (e.g., [Am]) to highlight it</small></p>
                    <FormControl
                        disabled={this.state.submitting}
                        style={{fontFamily: "monospace", resize: "vertical", minHeight: 340}}
                        componentClass="textarea"
                        type="text"
                        placeholder="Lyrics"
                        value={this.state.song.lyrics}
                        onChange={this.handleLyricsChange}
                    />
                    <FormControl.Feedback />
                </FormGroup>
                <HelpBlock style={{color: "red"}}>{this.state.error}</HelpBlock>
                {this.state.unknownChordNames.length > 0 &&
                    <div>
                        <p style={{marginTop: 16}}>
                            Some chords are unknown.
                            Please, specify a diagram for each chord (e.g., for C chord – 'x32010'):
                        </p>
                        <div style={{display: "flex", flexWrap: "wrap"}}>
                            {this.renderUnknownChords()}
                        </div>
                    </div>
                }
                <FormGroup>
                    <Button
                        disabled={!this.validateAll() || this.state.submitting}
                        type="submit"
                        bsStyle="success"
                        style={{width: 120}}>
                        {this.state.submitting ? "Saving..." : "Save"}
                    </Button>
                    <Button
                        disabled={this.state.submitting}
                        style={{marginLeft: 16, width: 120}}
                        onClick={this.handleCancel}>
                        Cancel
                    </Button>
                </FormGroup>
            </form>
        )
    }
}

AddNewSongPage.contextTypes = {
    router: React.PropTypes.object
};