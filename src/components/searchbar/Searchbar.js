import React from 'react';
import './Searchbar.css';

export default function Searchbar({ searchCallback, clearCallback, updateFieldCallback, project, character, episode, line }) {
    // TODO: implement input tokenization for user input during search query
    const re_space = new RegExp('^ *$');
    const valid_search = (re_space.test(project))
                            && (re_space.test(character))
                            && (re_space.test(episode))
                            && (re_space.test(line));

    return (
        <div className='search-bar search-section'>
            <h2>Line search</h2>
            <form className='search-form'>
                <div className='search-fields search-input-wrapper'>
                    <label>Project: </label>
                    <input
                        onChange={(e) => { e.preventDefault(); updateFieldCallback('projects', e.target.value); }}
                        className='search-input'
                        value={project}
                    />
                    <label>Character: </label>
                    <input
                        onChange={(e) => { e.preventDefault(); updateFieldCallback('characters', e.target.value); }}
                        className='search-input'
                        value={character}
                    />
                    <label>Episode Range: (00-00)</label>
                    <input
                        type='text'
                        onChange={(e) => { e.preventDefault(); updateFieldCallback('episodes', e.target.value); }}
                        className='search-input'
                        value={episode}
                    />
                    <label>Line: </label>
                    <input
                        onChange={(e) => { e.preventDefault(); updateFieldCallback('lines', e.target.value); }}
                        className='search-input'
                        value={line}
                    />
                    <div className='form-btn'>
                        <button onClick={(e) => { e.preventDefault(); if (!valid_search) searchCallback(true); }} className='search-btn'>Search</button>
                        <button onClick={(e) => { e.preventDefault(); clearCallback(); }} className='search-btn'>Reset</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
