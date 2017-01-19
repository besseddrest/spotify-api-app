// React & Redux
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// CSS
import css from './styles/app.scss';

class Main extends Component {
  constructor() {
    super();

    this.state = {
      artists: []
    }

    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(e) {
    // lower rate limit w/o authentication, so only make a request if the user hits enter
    if (e.key == 'Enter') {
      const query = e.target.value;
      let spotifyResponse;
      const spotifyRequest = new XMLHttpRequest;

      spotifyRequest.open('GET', `https://api.spotify.com/v1/search?type=artist&limit=50&q=${query}`);

      spotifyRequest.onload = () => {
        if ( spotifyRequest.status >= 200 && spotifyRequest.status < 400 ) {
          spotifyResponse = JSON.parse(spotifyRequest.responseText);
          this.filterResults(spotifyResponse);
        } else {
          console.log('There was an error.');
        }
      }

      spotifyRequest.onerror = () => {
        console.log('There was an error.');
      }

      spotifyRequest.send();
    }
  }

  filterResults(data) {
    const items = data.artists.items;
    // keep results that have 1) have images, and 2) have matching height & width
    const filteredArtists = items.filter(item => {
      return item.images.length && (item.images[0].height == item.images[0].width);
    });

    this.setState({
      artists: filteredArtists
    })
  }

  renderArtist(artist, i) {
    // pass unique artist obj and key (i) to Artist component
    const props = {
      key: i,
      i: i,
      artist: artist
    };
    return (<Artist {...props} />)
  }

  render() {
    const artists = this.state.artists;
    // set `results` based on data in state
    let results = "Type artist name and hit 'Enter'";
    if (artists.length > 0)
      results = artists.map((artist, i) => this.renderArtist(artist, i));
    return (
      <section className="app">
        <header className="search">
          <input className="search--input" type="text" placeholder="Search Artists on Spotify" onKeyPress={ this.handleSearch }/>
        </header>
        <section className="artists">
          { results }
        </section>
      </section>
    )
  }
}

class Artist extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const artist = this.props.artist;
    return (
      <div className="artists--single artist">
        <img src={ artist.images[0].url } className="artist--image" />
        <div className="artist--name">{ artist.name }</div>
      </div>
    )
  }
}

ReactDOM.render(<Main />, document.getElementById('root'));
