import React from 'react';
import './Searchbar.css';

export default function Searchbar({ searchCallback, clearCallback, updateFieldCallback, project, character, episode, line }) {
// TODO: implement input tokenization for user input during search query
  return (
    <div className='search-bar search-section'>
        <h2>Line search</h2>
        <form className='search-form'>
            <div className='search-fields search-input-wrapper'>
                <label>Project: </label>
                <input
                    onChange={(e) => { e.preventDefault(); updateFieldCallback('project', e.target.value); }}
                    className='search-input'
                    value={project}
                />
                <label>Character: </label>
                <input
                    onChange={(e) => { e.preventDefault(); updateFieldCallback('character', e.target.value); }}
                    className='search-input'
                    value={character}
                />
                <label>Episode Range: (00-00)</label>
                <input
                    type='text'
                    onChange={(e) => { e.preventDefault(); updateFieldCallback('episode', e.target.value); }}
                    className='search-input'
                    value={episode}
                />
                <label>Line: </label>
                <input
                    onChange={(e) => { e.preventDefault(); updateFieldCallback('line', e.target.value); }}
                    className='search-input'
                    value={line}
                />
                <div className='form-btn'>
                    <button onClick={(e) => { e.preventDefault(); searchCallback(); }} className='search-btn'>Search</button>
                    <button onClick={(e) => { e.preventDefault(); clearCallback(); }} className='search-btn'>Reset</button>
                </div>
            </div>
        </form>
    </div>
  );
}
