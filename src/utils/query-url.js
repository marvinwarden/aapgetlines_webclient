import epRange from '../components/searchbar/epRange.js'; 

export default function queryString (project, character, episodes, line, pageNumber ) {
    const urlParams = new URL("http://192.168.0.201:8081/api");
    urlParams.searchParams.append("projects", project);
    urlParams.searchParams.append("names", character);
    urlParams.searchParams.append("episodes", epRange(episodes) + ",");
    urlParams.searchParams.append("line", line);
    urlParams.searchParams.append("offset", pageNumber);


    return urlParams.href;
}