const clientID = "d108ac924654455ebbe82f3823498fc6";
const redirectURL = "http://localhost:3000/";
let spotifyRedirectURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURL}`;
let userAccessToken = "";
let userExpiresIn = "";

export const Spotify = {
    getAccessToken() {
      if (userAccessToken) {
        return userAccessToken;
      }
      const hasAccessToken = window.location.href.match(/access_token=([^&]*)/);
      const hasExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
      console.log(`hasAccessToken is ${hasAccessToken}`);

      if (hasAccessToken && hasExpiresIn) {
        userAccessToken = hasAccessToken[1];
        console.log(`userAccessToken is ${userAccessToken}`);

          const expiresIn = Number(hasExpiresIn[1]);
          window.setTimeout(() => userAccessToken = '', expiresIn * 1000);
          window.history.pushState('Access Token', null, '/');
          return userAccessToken;
      } else {
          window.location = spotifyRedirectURL;
      }
    },
  
    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(
            response => { 
                if (response.ok) {
                    return response.json();
                } else {
                    console.log('API request failed');
                }
        }).then(
            jsonResponse => {
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri,
                cover: track.album.images[2].url,
                preview: track.preview_url
            }));
        });
    },
  
    savePlaylist(name, trackUris) {
      if (!name || !trackUris || trackUris.length === 0) {
          return;
      }
      const userAPIUrl = 'https://api.spotify.com/v1/me';
      const headers = {
        Authorization: `Bearer ${userAccessToken}`
      };
      let userId = undefined;
      let playlistId = undefined;
      fetch(userAPIUrl, {
        headers: headers 
      }).then(response => response.json()).then(jsonResponse => userId = jsonResponse.id).then(() => {
        const createPlaylistUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
        fetch(createPlaylistUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
              name: name
            })
          })
          .then(response => response.json())
          .then(jsonResponse => playlistId = jsonResponse.id)
          .then(() => {
            const addPlaylistTracksUrl = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
            fetch(addPlaylistTracksUrl, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify({
                uris: trackUris
              })
            });
          })
      })
    }
  };
  