import * as React from "react";

const styles = {
    node: {
        paddingTop: 16,
        paddingBottom: 16,
        paddingRight: 16
    }
};

export default class DiffList extends React.Component {

    handleDiffSlick = (diff) => {
        this.props.callback(diff);
    };

    renderListItem(diff) {
        return (
            <div style={styles.node}>
                <a onClick={this.handleDiffSlick.bind(null, diff)}>
                    {diff.diff}
                </a>
            </div>
        )
    }

    render() {
        const resultNodes = this.props.diffs.map((diff) => {
            return <li key={diff.id}>{this.renderListItem(diff)}</li>;
        });

        var result = null;
        if (resultNodes.length) {
            result = (
                <ul style={{listStyle: "none", padding: 0}}>
                    {resultNodes}
                </ul>
            );
        }

        return result;
    }

}