import React from "react";
import * as $ from "jquery";
import {Link} from "react-router";
import colors from "../colors";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import IconButton from "material-ui/IconButton/IconButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import BasePageTemplate from "./BasePageTemplate";
import SongTitle from "../components/SongTitle";
import api from "../api";

const styles = {
    link: {
        color: colors.defaultPrimaryColor
    }
};

export default class SongPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            song: {
                id: -1,
                performerId: -1,
                performerName: "",
                title: "",
                lyrics: ""
            },
            contextMenuOpened: false
        }
    }

    componentDidMount() {
        this.loadSong();
    }

    loadSong() {
        $.ajax({
            url: `${api.songs}/${this.props.params.id}`,
            dataType: 'json',
            type: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                this.setState({song: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err.toString());
            }
        });
    }

    handleDelete = (e) => {
        e.preventDefault();

        $.ajax({
            url: this.urlGetSong,
            type: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function (data) {
                this.context.router.replace('performer/' + this.state.song.performerId);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(status, err);
            }
        });
    };

    handleEdit = (e) => {
        e.preventDefault();
        this.context.router.push("song/" + this.state.song.id + "/edit");
    };

    renderHeader = () => {
        return <h3 style={{display: 'flex', flexDirection: 'row'}}>
            <Link
                style={styles.link}
                to={'/'}>
                #
            </Link>
            &nbsp;&nbsp;|&nbsp;&nbsp;
            <SongTitle
                style={styles.link}
                song={this.state.song}
                linkifyPerformer={true}
            />
        </h3>
    };

    renderOverflowMenu = () => {
        return <IconMenu
            iconButtonElement={<IconButton>
                <MoreVertIcon color={colors.defaultPrimaryColor}/>
            </IconButton>}
            anchorOrigin={{horizontal: 'left', vertical: 'top'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
        >
            <MenuItem primaryText="Edit" onTouchTap={this.handleEdit}/>
            <MenuItem style={{color: "red"}} primaryText="Delete" onTouchTap={this.handleDelete}/>
        </IconMenu>
    };

    renderContent = () => {
        return <pre>{this.state.song.lyrics}</pre>
    };

    render() {
        return (
            <BasePageTemplate
                header={this.renderHeader()}
                overflowMenu={this.renderOverflowMenu()}
                content={this.renderContent()}
            />
        )
    }
}

SongPage.contextTypes = {
    router: React.PropTypes.object
};