import "./Searchbar.css";
import Table from "../results-table/Table.js";
import React, { useEffect, useState } from "react";
import epRange from "./epRange.js";
import data from "../../lines.json";
import usePagination from "../results-table/usePagination";
import queryString from "../../utils/query-url";

export default function Searchbar() {
  const [project, setProject] = useState("");
  const [character, setCharacter] = useState("");
  const [episode, setEpisode] = useState("");
  const [line, setLine] = useState("");
  const [result, setResult] = useState([]);

  const { page } = usePagination(result);

  const URL = queryString(project, character, episode, line, page)

  

  //ADD AXIOS GET REQUEST TO ONCLICK

  // data search from form input

  const lineSearch = (e) => {
    const characterSearched = data.filter((result) =>
      result.character.toLowerCase().includes(character.toLowerCase())
    );

    if (character !== "" && project !== "") {
      if (episode !== "" || line !== "") {
        if (episode !== "") {
          const episodes = epRange(episode);
          const epSearched = episodes.map((ep) => {
            return characterSearched.filter(
              (result) =>
                result.episode.includes(ep) &&
                result.episode === ep &&
                result.line.toLowerCase().includes(line.toLowerCase()) &&
                result.project.toLowerCase().includes(project.toLowerCase())
            );
          });
          e.preventDefault();
          console.log("test", epSearched);
          return setResult(epSearched);
        }

        const lineSearched = characterSearched.filter((result) =>
          result.line.toLowerCase().includes(line.toLowerCase())
        );
        e.preventDefault();
        return setResult([lineSearched]);
      }

      const projectSearched = characterSearched.filter((result) =>
        result.project.toLowerCase().includes(project.toLowerCase())
      );
      setResult([projectSearched]);
    }

    e.preventDefault();
  };

  useEffect(() => {
    console.log("flex", URL);
  }, [URL]);

  //clear search

  const clearSearch = (e) => {
    setResult([]);
    setCharacter("");
    setProject("");
    setLine("");
    setEpisode("");
    e.preventDefault();
  };

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
                  onKeyDown={(e) => e.key === 13 && lineSearch()}
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
                        setEpisode(e.target.value.replace(" ", ""))
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

      <Table searchResult={result} project={project} character={character} episode={episode} line={line} />
    </div>
  );
}
