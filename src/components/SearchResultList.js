import * as React from "react";
import SongTitle from "../components/SongTitle";
import Highlight from "../components/Highlight";

const styles = {
    node: {
        paddingTop: 16,
        paddingBottom: 16,
        paddingRight: 16
    }
};

export default class SearchResultList extends React.Component {

    renderSnippet(snippet) {
        return (
            <pre style={{marginTop: 16, marginLeft: 16}}>
                <Highlight enabled={true} text={snippet}/>
            </pre>
        )
    }

    renderListItem(searchNode) {
        const song = {
            title: searchNode.title,
            performerId: searchNode.performerId,
            performerName: searchNode.performer,
            id: searchNode.songId
        };
        return (
            <div style={styles.node}>
                <SongTitle
                    song={song}
                    linkifySong={true}
                    linkifyPerformer={true}
                    hlEnabled={true}
                />
                {searchNode.snippet && this.renderSnippet(searchNode.snippet)}
            </div>
        )
    }

    render() {
        const resultNodes = this.props.result.map((searchNode, index) => {
            return <li key={searchNode.songId}>{this.renderListItem(searchNode, index)}</li>;
        });

        var result = null;
        if (resultNodes.length) {
            result = (
                <ul style={{listStyle: "none", margin: 0, padding: 0}}>
                    {resultNodes}
                </ul>
            );
        }

        return result;
    }
}