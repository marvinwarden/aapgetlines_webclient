import React from 'react';
import './styles.css';
import './App.css';
import Searchbar from './components/searchbar/SearchBar.js';
import { api, API_RESULT_KEYS, API_LOCAL_DEFAULTS } from './http/ApiClient.js';
import Table from './components/resultstable/Table.js';
import buildQueryString from './utils/QueryUrl.js';
import { epRangesToSequences } from './components/searchbar/EpRange.js';

const result_default = {
    query: '',
    query_params: [],
    data: {
        [API_RESULT_KEYS.TOTAL_QUERY]:   0,
        [API_RESULT_KEYS.TOTAL_RESULTS]: 0,
        [API_RESULT_KEYS.MAX_QUERY]:     API_LOCAL_DEFAULTS.MAX_QUERY,
        [API_RESULT_KEYS.OFFSET]:        0,
        [API_RESULT_KEYS.RESULTS]:       []
    }
};

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            project: '',
            character: '',
            episode: '',
            line: '',
            result: result_default
        };
    }
    
    // Callback method for components to update project property tate
    updateFieldState(key, value) {
        this.setState((s,p) => ({ [key]: value }));
    }

    // Callback method for preparing user search inputs and querying database
    async lineSearch() {
        // TODO: Validate that at least one option was provided by user
        
        // Storage for parsed user input
        let list_projects = [];
        let list_episodes = [];
        let list_characters = [];
        let list_lines = [];
        
        // Collect user input from form fields
        const user_input = [
            {project: this.state.project,     data: list_projects   },
            {episode: this.state.episode,     data: list_episodes   },
            {character: this.state.character, data: list_characters },
            {line: this.state.line,           data: list_lines      }
        ]
        
        // Parse and seperate user options
        for (const i of user_input) {
            const k = Object.keys(i)[0];
            let delimiter = '';
            
            if (k === 'episode' || k === 'character') {
                // Handle case wher user uses | as delimiter
                // TODO: Use better procedure for testing which delimiter is being used
                const re_delimiter = new RegExp('\\|');
                
                if (re_delimiter.test(i[k])) delimiter = '|';
                else delimiter = ',';
                
            } else if (k === 'project' || k === 'line') {
                delimiter = '|';
            }
            
            const dirty_data = i[k].split(delimiter);
            for (const n of dirty_data) {
                i['data'].push(n.trim().toLowerCase());
            }
        }
        
        // Transform ranged episodes to a sequence of comma-seperated values
        const eps_sequence = epRangesToSequences(list_episodes);
        
        // Build the URL based on user inputs
        const qry_href = buildQueryString(list_projects, eps_sequence, list_characters, list_lines);
        
        // Make query to the API
        try {
            const qry_response = await api.get(qry_href);
            // TODO: Various response validation before setting results
            // TODO: Set UI to loading state for potential long response times from API
            
            // Store href used for this query in data payload
            const results = {
                query: qry_href,
                query_params: [list_projects, eps_sequence, list_characters, list_lines, 0],
                data: qry_response.data
            }
            
            // Set state for results
            this.setState({ result: results });
        } catch (e) {
            // TODO: handle failed query in UI
            console.error(`[ERROR] query to API failed with message: ${e}`);
        }
        
    };
    
    // Method for clearing search fields
    clearSearch(e) {
        e.preventDefault();
        this.setResult({ result: result_default });
        this.setResult({ project: '' });
        this.setResult({ character: '' });
        this.setResult({ episode: '' });
        this.setResult({ line: '' });
    };

    render() {    
        return (
            <div className='App'>
                <h1 className='header'>AAP Get Lines</h1>
                <Searchbar
                    searchCallback={this.lineSearch.bind(this)}
                    clearCallback={this.clearSearch.bind(this)}
                    updateFieldCallback={this.updateFieldState.bind(this)}
                    project={this.state.project}
                    character={this.state.character}
                    episode={this.state.episode}
                    line={this.state.line}
                />
                <Table searchResult={this.state.result}/>
            </div>
        );
    }
}
    