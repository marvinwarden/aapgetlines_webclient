import axios from 'axios';

// API URL globals
export const API_BASE_URL = 'http://api.aaplore.com:8081';
export const API_QRY_URL = `${API_BASE_URL}/q`;

// Globals for IDs that queries to API will be expecting
export const API_QRY_PARAMETERS = {
    PROJECTS: 'projects',
    CATALOGUES: 'catalogues',
    SEGMENTS: 'eps',
    NAMES: 'names',
    LINES: 'lines',
    OFFSET: 'offset'
}

// Globals for key IDs in results payload that API queries will return
export const API_RESULT_KEYS = {
    PROJECT: 'project_name',
    CATALOGUE: 'project_catalogue',
    SEGMENT: 'project_segment',
    CHARACTER: 'character_name',
    LINE: 'prepared_cue',
    TIMECODE: 'timeline_values',
    FRAME_RATE: 'frame_rate',
    TICK_RATE: 'tick_rate'
};

// Axios http client instance, configured for GET requests to API line search endpoint
export const api = axios.create({ 
    baseURL: `${API_QRY_URL}`,
    timeout: 5000,
    method: 'get',
    responseType: 'json'
 });