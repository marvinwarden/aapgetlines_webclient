import React from 'react';
import './styles.css';
import './App.css';
import Searchbar from './components/searchbar/SearchBar.js';
import { api, API_RESULT_KEYS, API_LOCAL_DEFAULTS } from './http/ApiClient.js';
import Table from './components/resultstable/Table.js';
import buildQueryString from './utils/QueryUrl.js';
import { epRangesToSequences } from './components/searchbar/EpRange.js';
import TablePagination from './components/resultstable/UsePagination';

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
            projects: '',
            characters: '',
            episodes: '',
            lines: '',
            page: 0,
            rows_per_page: 10,
            current_query: '',
            current_query_parameters: {
                projects: [],
                characters: [],
                episodes: [],
                lines: [],
                offset: 0
            },
            result: result_default,
            ui_style: {
                backgroundColor: '#333333'
            }
        };
    }

   
    
    // Callback method for components to update project property tate
    updateFieldState(key, value) {
        this.setState((s,p) => ({ [key]: value }));
    }

    async offsetPage(offset = 0) {
        // Determine what new page number should be
        const next_page = (this.state.page + offset <= 0) ? 0 : this.state.page + offset;
        const total_page = Math.floor(this.state.result.data[API_RESULT_KEYS.TOTAL_QUERY] / this.state.rows_per_page);
        let update_page = 0;

        if (next_page < 0) {
            update_page = 0;
        } else if (next_page > total_page) {
            update_page = this.state.page;
        } else {
            update_page = next_page;
        }

        // Determine if new data must be fetched from API
        const max_query = this.state.result.data[API_RESULT_KEYS.MAX_QUERY];
        const current_offset = this.state.result.data[API_RESULT_KEYS.OFFSET];
        const new_search = Math.floor(next_page * this.state.rows_per_page / max_query) !== current_offset 
                            || Math.floor(next_page * this.state.rows_per_page) - (current_offset * max_query) > max_query;

        // Set new offset if new data is required
        const new_offset = (new_search) ? Math.floor(next_page * this.state.rows_per_page / max_query) : -1;
        
        // Invoke callbacks with new pagination parameters
        if (new_offset > -1) await this.lineSearch(false, new_offset);
        this.updateFieldState('page', update_page);
    }

    // Callback method for preparing user search inputs and querying database
    async lineSearch(new_query, offset = 0) {

        
        // TODO: Validate that at least one option was provided by user
        // Storage for parsed user input
        let list_episodes = [];
        let list_projects = (new_query) ? [] : this.state.current_query_parameters.projects;
        let list_characters = (new_query) ? [] : this.state.current_query_parameters.characters;
        let list_lines = (new_query) ? [] : this.state.current_query_parameters.lines;
        let eps_sequence = (new_query) ? [] : this.state.current_query_parameters.episodes;
        let qry_href = '';
        let qry_offset = (new_query) ? 0 : offset;
        console.log("app2", list_projects)
        // Collect user input from form fields
        const user_input = [
            {project: this.state.projects,     data: list_projects   },
            {episode: this.state.episodes,     data: list_episodes   },
            {character: this.state.characters, data: list_characters },
            {line: this.state.lines,           data: list_lines      }
        ]
        
        // Determine if new search is valid
        const re_space = new RegExp('^ *$');
        const valid_search = (re_space.test(this.state.projects))
                            && (re_space.test(this.state.characters))
                            && (re_space.test(this.state.episodes))
                            && (re_space.test(this.state.lines));

        if (new_query) {

            // Parse and seperate user options
            for (const i of user_input) {
                const k = Object.keys(i)[0];
                let delimiter = '';
    
                
                if (k === 'episode' || k === 'character') {
                    // Handle case where user uses | as delimiter
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
            // TODO: Constrain max range to prevent user from generating too many numbers
            eps_sequence = epRangesToSequences(list_episodes);
            
            // Build the URL based on user inputs
            qry_href = buildQueryString(list_projects, eps_sequence, list_characters, list_lines, qry_offset);

             // Update state for current query parameters
             // Clear current results
            this.setState({
                 page: 0,
                 results: result_default,
                 current_query: qry_href,
                 current_query_parameters: {
                    projects: list_projects,
                    episodes: eps_sequence,
                    characters: list_characters,
                    lines: list_lines,
                    offset: qry_offset
                 }
            });
            console.log("app", this.state.current_query_parameters.projects)
        } else {
            qry_href = buildQueryString(list_projects, eps_sequence, list_characters, list_lines, qry_offset);
        }
        
        // Make query to the API
        try {
            console.log('Making call to API with href:', qry_href);
            const qry_response = await api.get(qry_href);

            // TODO: Various response validation before setting results
            // TODO: Set UI to loading state for potential long response times from API

            // Check if data is valid and store relevant data in payload
            const qry_data = ((qry_response.status === 200)
                ? qry_response.data
                : result_default
            );

            const results = {
                query: qry_href,
                query_params: [list_projects, eps_sequence, list_characters, list_lines, qry_offset],
                data: qry_response.data
            }

            // Set state for results
            this.setState({ result: results });
        } catch (e) {
            // TODO: handle failed query in UI
            console.error(`[ERROR] query to API failed with message: ${e}`);
        }
        
    }
    
    // Method for clearing search fields
    clearSearch() {
        this.setState({
            projects: '',
            characters: '',
            episodes: '',
            lines: '',
            page: 0,
            result: result_default
        });
    }

    componentDidMount() {
        window.addEventListener('keydown', (e) => {
            const modifier_key = (window.navigator.platform === 'Win32') ? e.altKey : e.metaKey;
            if (e.key === 'Enter' && modifier_key) {
                this.lineSearch(true);
            }

            if (e.key === 'ArrowLeft' && modifier_key) {
                this.offsetPage(-1);
            }

            if (e.key === 'ArrowRight' && modifier_key) {
                this.offsetPage(1);
            }
        });
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', (e) => {
            // TODO
        });
    }

    componentDidUpdate(prev_props, prev_state) {
    }

    render() {
        return (
            <div style={this.state.ui_style} className='App'>
                <h1 className='header'>AAP Lore</h1>
                <Searchbar
                    searchCallback={this.lineSearch.bind(this)}
                    clearCallback={this.clearSearch.bind(this)}
                    updateFieldCallback={this.updateFieldState.bind(this)}
                    project={this.state.projects}
                    character={this.state.characters}
                    episode={this.state.episodes}
                    line={this.state.lines}
                    page={this.state.page}
                    currentQuery={this.setState.current_query_parameters}
                />
                <Table
                    page={this.state.page}
                    rowsPerPage={this.state.rows_per_page}
                    searchCallback={this.lineSearch.bind(this)}
                    searchResult={this.state.result}
                />
                {
                    <TablePagination
                        className='pagination-bar'
                        results={this.state.result}
                        page={this.state.page}
                        rowsPerPage={this.state.rows_per_page}
                        updatePageCallback={this.offsetPage.bind(this)}
                    />
                }
            </div>
        );
    }
}
    