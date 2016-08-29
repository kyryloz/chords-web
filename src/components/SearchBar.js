import React from "react";
import TextField from "material-ui/TextField";

export default class SearchBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            query: ""
        }
    }

    handleQueryChange = (e) => {
        this.setState({
            query: e.target.value
        })
    };

    handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            this.handleSearch();
        }
    };

    handleSearch = () => {
        this.context.router.push("/search/?query=" + this.state.query);
    };

    render() {
        return (
            <div>
                <TextField
                    id="text-field-controlled"
                    hintText="Search database"
                    style={this.props.style}
                    inputStyle={{
                        color: '#d7d7d7'
                    }}
                    hintStyle={{
                        color: '#7e98a5'
                    }}
                    onKeyDown={this.handleKeyDown}
                    onChange={this.handleQueryChange}
                    value={this.state.query}
                />
            </div>
    )
    }
}

SearchBar.contextTypes = {
    router: React.PropTypes.object
};