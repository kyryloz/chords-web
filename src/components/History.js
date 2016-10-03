import React from "react";
import {Button, Modal, Collapse, Panel} from "react-bootstrap/lib";
import HistoryList from "./HistoryList";
import Highlight from "./Highlight";
import api from "../global/api";
import * as $ from "jquery";
import moment from "moment";

export default class History extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            historyPretty: "",
            historyPrettyModalOpened: false,
            historyListOpened: false,
            historyClickedId: -1
        }
    }

    isUserAdmin = () => {
        return this.props.user && this.props.user.isAdmin;
    };

    findLastEditedName = () => {
        return this.props.histories[0].createdBy
            ? this.props.histories[0].createdBy.name
            : "Unknown";
    };

    handleHistoryClick = (history) => {
        $.ajax({
            url: `${api.history}/pretty?historyId=${history.id}`,
            type: 'GET',
            success: function (data) {
                this.setState({
                    historyPretty: data.diff,
                    historyPrettyModalOpened: true,
                    historyClickedId: history.id,
                    historyDate: moment(history.timestamp).format("MMMM, D, YYYY, HH:mm")
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(xhr, status, err);
            }
        });
    };

    handleApplyClick = (history) => {
        $.ajax({
            url: `${api.history}/apply?historyId=${this.state.historyClickedId}&songId=${this.state.id}`,
            type: 'GET',
            success: function (data) {
                this.props.callback(data);
                this.setState({
                    historyPretty: "",
                    historyPrettyModalOpened: false,
                    historyClickedId: -1
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(xhr, status, err);
            }
        });
    };

    handleHistoryModalClose = () => {
        this.setState({
            historyPrettyModalOpened: false
        });
    };

    handleShowHistoryClick = () => {
        this.setState({
            historyListOpened: !this.state.historyListOpened
        })
    };

    renderHistoryList = () => {
        if (this.isUserAdmin()) {
            return (
                <div>
                    <a onClick={this.handleShowHistoryClick}>
                        {this.state.historyListOpened ? "Hide" : "Show"} history
                    </a>
                    <Collapse in={this.state.historyListOpened}>
                        <div>
                            <Panel>
                                <HistoryList callback={this.handleHistoryClick} history={this.props.histories}/>
                            </Panel>
                        </div>
                    </Collapse>
                </div>
            )
        } else {
            return <div></div>
        }
    };

    render() {
        return (
            <div>
                <small>
                    <p>Was edited {this.props.histories.length} times.
                        Last by <i>{this.findLastEditedName()}</i>.
                    </p>
                    {this.renderHistoryList()}
                </small>

                <Modal show={this.state.historyPrettyModalOpened} onHide={this.handleHistoryModalClose}>
                    <Modal.Header>
                        <Modal.Title>{this.state.historyDate}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <pre>
                            <Highlight enabled={true} text={this.state.historyPretty}/>
                        </pre>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.handleHistoryModalClose}>Close</Button>
                        <Button onClick={this.handleApplyClick} bsStyle="primary">Rollback</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

History.contextTypes = {
    router: React.PropTypes.object
};