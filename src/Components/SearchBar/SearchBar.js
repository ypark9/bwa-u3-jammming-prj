import React from 'react';
import './SearchBar.css';
import ReactDOM from 'react-dom';


export class SearchBar extends React.Component{
    constructor(props)
    {
        super(props);
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }
    search(term){
        this.props.onSearch(term);
    }

    handleTermChange(e){
        this.search(e.target.value);
    }

    render()
    {
        return(
            <div className="SearchBar">
                <input onChange={this.handleTermChange} placeholder="Enter A Song, Album, or Artist" />
                <a>SEARCH</a>
            </div>
        )
    }
};