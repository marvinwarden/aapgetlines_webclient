import { LocalConvenienceStoreOutlined } from '@mui/icons-material';
import React, { useState } from 'react';
import './SearchBar.css';

export default function Searchbar({ searchCallback, clearCallback, updateFieldCallback, project, character, episode, line, currentQuery }) {

    const [projectTags, setProjectTags] = useState([]);
    const [characterTags, setCharacterTags] = useState([]);
    const [episodeTags, setEpisodeTags] = useState([]);
    const [lineTags, setLineTags] = useState([]);


    // TODO: implement input tokenization for user input during search query
    const re_space = new RegExp('^ *$');
    const valid_search = (re_space.test(project))
        && (re_space.test(character))
        && (re_space.test(episode))
        && (re_space.test(line));

        
    //Add tags for user query input
    const addTag = (e, tags, setTags) => {
        if (e.key === "Enter") {
            if (e.target.value !== "") {
                setTags([...tags, e.target.value]);
               
            e.target.value = "";
            } else {
                return
            }
             
                
        }
        
    };

    //Remove query tags
    const removeTag = (tagToRemove, removeTags, setRemoveTags) => {
        setRemoveTags(
            removeTags.filter((_, index) => {
                return index !== tagToRemove;
            })
        );
    };

    console.log(projectTags)

    return (
        <div className='search-bar'>
            <form className='search-form'>
                <div className='input-fields'>
                    <div className='tag-container'  >
                        {projectTags.map((tag, index) => (
                            <p className="tags" key={index}  >
                                {tag}
                                <span>
                                    <i onClick={() => removeTag(index, projectTags, setProjectTags)}>x</i>
                                </span>
                            </p>
                        ))}

                        <input

                            placeholder='Projects'
                            onChange={(e) => { e.preventDefault(); updateFieldCallback('projects', [...projectTags, e.target.value]); }}
                            onKeyDown={(e) => addTag(e, projectTags, setProjectTags)}
                            className='search-input'
                            
                        />
                    </div>
                    <div className='tag-container'>
                        {characterTags.map((tag, index) => (
                            <p className="tags" key={index}>
                                {tag}
                                <span>
                                    <i onClick={() => removeTag(index, characterTags, setCharacterTags)}>x</i>
                                </span>
                            </p>
                        ))}

                        <input

                            placeholder='Characters'
                            onChange={(e) => { e.preventDefault(); updateFieldCallback('characters', [...characterTags, e.target.value]); }}
                            onKeyDown={(e) => addTag(e, characterTags, setCharacterTags)}
                            className='search-input'
                            

                        />
                    </div>

                    <div className='tag-container'>
                        {episodeTags.map((tag, index) => (
                            <p className="tags" key={index}>
                                {tag}
                                <span>
                                    <i onClick={() => removeTag(index)}>x</i>
                                </span>
                            </p>
                        ))}

                        <input
                            placeholder='Episodes'
                            onChange={(e) => { e.preventDefault(); updateFieldCallback('episodes', [...episodeTags, e.target.value]); }}
                            onKeyDown={(e) => addTag(e, setEpisodeTags)}
                            className='search-input'
                            
                        />
                    </div>

                    <div className='tag-container'>
                        {lineTags.map((tag, index) => (
                            <p className="tags" key={index}>
                                {tag}
                                <span>
                                    <i onClick={() => removeTag(index)}>x</i>
                                </span>
                            </p>
                        ))}

                        <input
                            placeholder='Lines'
                            onChange={(e) => { e.preventDefault(); updateFieldCallback('lines', [...lineTags, e.target.value]); }}
                            onKeyDown={(e) => addTag(e, setLineTags)}
                            className='search-input'
                            
                        />
                    </div>


                </div>
                {/* <div className='form-btn'>
                        <button onClick={(e) => { e.preventDefault(); if (!valid_search) searchCallback(true); }} className='search-btn'>Search</button>
                        <button onClick={(e) => { e.preventDefault(); clearCallback(); }} className='search-btn'>Reset</button>
                    </div> */}
            </form>
        </div>
    );
}
