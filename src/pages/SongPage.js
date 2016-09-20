import React from "react";
import * as $ from "jquery";
import {Link} from "react-router";
import BasePageTemplate from "./BasePageTemplate";
import SongTitle from "../components/SongTitle";
import api from "../global/api";
import {Button} from "react-bootstrap/lib";
import History from "../components/History";
import ChordParser from "chord-parser";
import Highlight from "../components/Highlight";

export default class SongPage extends BasePageTemplate {

    constructor(props) {
        super(props);

        this.state = {
            id: -1,
            performerId: -1,
            performerName: "",
            title: "",
            lyrics: "",
            histories: [],
            createdByName: ""
        }
    }

    componentDidMount() {
        this.loadSong();
    }

    loadSong() {
        this.startLoading();
        $.ajax({
            url: `${api.songs}/${this.props.params.id}`,
            type: 'GET',
            success: function (data) {
                this.setState({
                    ...data,
                    createdByName: data.createdBy ? data.createdBy.name : "Unknown"
                }, () => {
                    const tabs = new ChordParser(this.state.lyrics);
                    const wrappedTab = tabs.wrap((chord) => {
                        return '<a href="">' + chord + '</a>';
                    });
                    this.setState({
                        lyrics: wrappedTab
                    })
                });
                this.finishLoading();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(xhr, status, err);
            }
        });
    }

    onHistoryApplied = (song) => {
        this.setState(song);
    };

    handleEdit = (e) => {
        e.preventDefault();
        this.context.router.push("/song/" + this.state.id + "/edit");
    };

    renderHeader() {
        return <h3 style={{display: 'flex', flexDirection: 'row'}}>
            <Link to="/">#</Link>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <SongTitle
                song={this.state}
                linkifyPerformer={true}
            />
        </h3>
    }

    renderMenu() {
        if (this.props.user) {
            return <Button onClick={this.handleEdit}>EDIT</Button>
        } else {
            return null;
        }
    }

    renderContent() {
        return (
            <div>
                <pre style={{marginTop: 16}}>
                    <Highlight enabled={true} text={this.state.lyrics}/>
                </pre>
                <br/>
                <small>Created by <i>{this.state.createdByName}</i>.</small>
                {this.state.histories.length > 0
                    ?
                    <History {...this.props} histories={this.state.histories} callback={this.onHistoryApplied}/>
                    :
                    <div></div>
                }
            </div>
        )
    }
}

SongPage.contextTypes = {
    router: React.PropTypes.object
};