import axios from 'axios';

// API globals
export const API_BASE_URL = 'http://api.aaplore.com:8081';
export const API_QRY_URL = `${API_BASE_URL}/q`;
export const API_QRY_PARAMETERS = {
    PROJECTS: 'projects',
    CATALOGUES: 'catalogues',
    SEGMENTS: 'eps',
    NAMES: 'names',
    LINES: 'lines',
    OFFSET: 'offset'
}

export const api = axios.create({ 
    baseURL: `${API_QRY_URL}`,
    timeout: 5000,
    method: 'get',
    responseType: 'json'
 });