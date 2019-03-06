import React, { Component } from 'react';
import './App.css';
import {Playlist} from '../Playlist/Playlist'
import {SearchResults} from '../SearchResults/SearchResults'
import {SearchBar} from '../SearchBar/SearchBar';
import {Spotify} from '../../util/Spotify';

class App extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'My playlist',
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    // if (!this.state.playlistTracks.find(playlistTrack => playlistTrack.id === track.id)) {
    //   this.setState(prevState => ({
    //     playlistTracks: [prevState.playlistTracks, track]
    //   }));
    // }
    let tracks = this.state.playlistTracks;
    if (!this.state.playlistTracks.find(playlistTrack => playlistTrack.id === track.id)) 
    {
      tracks.push(track);
      this.setState({ playlistTracks: tracks });
    }
  }

  removeTrack(track)
  {
    var filtered = this.state.playlistTracks.filter((savedTrack)=>{
      return savedTrack.id !== track.id   });  
      this.setState({playlistTracks: filtered});
  }

  updatePlaylistName(name){
    this.setState({playlistName : name});
  }

  savePlaylist(){
    const trackURI = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURI);
    this.setState({
      searchResults: []
    });
    this.updatePlaylistName('New playlist');
    this.setState({playlistTracks : []});
    console.info(trackURI);
  }

  search(term){
    Spotify.search(term)
      .then(searchResults => this.setState({
        searchResults: searchResults
      }));  
    }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch = {this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} 
                           onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} 
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
