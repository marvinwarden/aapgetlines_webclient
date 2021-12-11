import "./Searchbar.css";
import Table from "../results-table/Table.js";
import React, { useEffect, useState } from "react";
import { epRangesToSequences } from "./epRange.js";
import usePagination from "../results-table/usePagination";
import buildQueryString from "../../utils/query-url";
import '../../http/apiClient';
import { api, API_RESULT_KEYS, API_LOCAL_DEFAULTS } from "../../http/apiClient";

export default function Searchbar() {
  const [project, setProject] = useState("");
  const [character, setCharacter] = useState("");
  const [episode, setEpisode] = useState("");
  const [line, setLine] = useState("");
  
  // Create default object state for search results
  // TODO: Set this default as a global in app
  const [result, setResult] = useState({
    query: '',
    query_params: [],
    data: {
        [API_RESULT_KEYS.TOTAL_QUERY]:   0,
        [API_RESULT_KEYS.TOTAL_RESULTS]: 0,
        [API_RESULT_KEYS.MAX_QUERY]:     API_LOCAL_DEFAULTS.MAX_QUERY,
        [API_RESULT_KEYS.OFFSET]:        0,
        [API_RESULT_KEYS.RESULTS]:       []
    }
  });
  
  // data search from form input
  const lineSearch = async (e) => {
    e.preventDefault();

    // TODO: Validate that at least one option was provided by user

    // Storage for parsed user input
    let list_projects = [];
    let list_episodes = [];
    let list_characters = [];
    let list_lines = [];
    
    // Collect user input from form fields
    const user_input = [
      {project,   data: list_projects   },
      {episode,   data: list_episodes   },
      {character, data: list_characters },
      {line,      data: list_lines      }
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
      setResult(results);
    } catch (e) {
      // TODO: handle failed query in UI
      console.error(`[ERROR] query to API failed with message: ${e}`);
    }

  };

  useEffect(() => { return; });

  //clear search

  const clearSearch = (e) => {
    e.preventDefault();
    setResult([]);
    setCharacter("");
    setProject("");
    setLine("");
    setEpisode("");
  };

// TODO: implement input tokenization for user input during search query
  return (
    <div className="search-bar">
      <div className="search-section">
        <h2>Line search</h2>
        <div className="search-form">
          <form>
            <div className="search-fields">
              <div className="search-input-wrapper">
                <label>Project: </label>
                <input
                  onChange={(e) => setProject(e.target.value)}
                  className="search-input"
                  value={project}
                />
                <label>Character: </label>
                <input
                  onChange={(e) => setCharacter(e.target.value)}
                  className="search-input"
                  value={character}
                />
              </div>
              <div className="advanced-section">
                <div className="advanced-search-bar">
                  <div className="advanced-search-input-wrapper">
                    <label>Episode Range: (00-00)</label>
                    <input
                      type="text"
                      onChange={(e) =>
                        setEpisode(e.target.value)
                      }
                      className="search-input"
                      value={episode}
                    />
                    <label>Line: </label>
                    <input
                      onChange={(e) => setLine(e.target.value)}
                      className="search-input"
                      value={line}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-btn">
              <button onClick={lineSearch} className="search-btn">
                Search
              </button>
              <button onClick={clearSearch} className="search-btn">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      <Table searchResult={result}/>
    </div>
  );
}
