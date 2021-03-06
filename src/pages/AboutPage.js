import React from "react";
import BasePageTemplate from "./BasePageTemplate";
import {version} from '../../package.json';

export default class AboutPage extends BasePageTemplate {

    renderHeader() {
        return <h3>About this project</h3>;
    }

    renderContent() {
        return (
            <div style={{marginTop: 16}}>
                <p>
                    This project is a simple song book with ability to edit any song if you feel it necessary.
                    Just keep the chords right.
                </p>
                <p>
                    It's still in development and many of features will appear in the future.
                    Such features as favorites,
                    history of edits, comments, pre-moderation, better look and feel,
                    mobile clients and so on.
                </p>

                <p>
                    Used technologies:
                </p>
                <pre style={{marginTop: 16, marginBottom: 16}}>
                    Backend:
                    <ul>
                        <li>
                            Java powered by <a href="http://projects.spring.io/spring-boot/">Spring</a>
                        </li>
                        <li>
                            <a href="https://jwt.io/">JWT</a> authentication
                        </li>
                        <li>
                            MySQL
                        </li>
                        <li>
                            Search – <a href="http://lucene.apache.org/solr/">Apache Solr</a>
                        </li>
                        <li>
                            Spring Boot embedded Tomcat server
                        </li>
                    </ul>
                    Frontend:
                    <ul>
                        <li>
                            JavaScript powered by&nbsp;
                            <a href="https://facebook.github.io/react/">React</a>
                            &nbsp;+&nbsp;
                            <a href="http://redux.js.org/">Redux</a>
                        </li>
                        <li>
                            Bootstrap
                        </li>
                        <li>
                            Node.js server
                        </li>
                    </ul>
                    Configuration:
                    <ul>
                        <li>
                            Linux VPS on <a href="https://www.digitalocean.com/">Digital Ocean</a>
                        </li>
                        <li>
                            Nginx as reverse proxy
                        </li>
                    </ul>
                </pre>
                <p>
                    All source code is available on <a href="https://github.com/kyryloz">GitHub</a>.
                    Pull requests are welcome. Feel free to create an issue if something went wrong.
                </p>
                <small style={{color: "lightgrey"}}>
                    Version: {version}
                </small>
            </div>
        )
    }
}