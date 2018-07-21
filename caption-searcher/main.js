const CLIENT_ID = '203720257472-8a5br89hm01bjoocnq7ftkgedd3mnga9.apps.googleusercontent.com';
const DISCOVERY_DOCS = [
    'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
];
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');
const content = document.getElementById('content');
const channelForm = document.getElementById('channel-form');
const channelInput = document.getElementById('channel-input');

const videoContainer = document.getElementById('video-container');

const defaultChannel = 'tseries';

// Form submit and change channel
channelForm.addEventListener('submit', e => {
    e.preventDefault();

    const channel = channelInput.value;


    getChannel(channel);
});

// Load auth2 library
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

// Init API client library and set up sign in listeners
function initClient() {
    gapi.client
        .init({
            discoveryDocs: DISCOVERY_DOCS,
            clientId: CLIENT_ID,
            scope: SCOPES
        })
        .then(() => {
            // Listen for sign in state changes
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            // Handle initial sign in state
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            authorizeButton.onclick = handleAuthClick;
            signoutButton.onclick = handleSignoutClick;
        });
}

// Update UI sign in state changes
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        content.style.display = 'block';
        videoContainer.style.display = 'block';
        getChannel(defaultChannel);
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        content.style.display = 'none';
        videoContainer.style.display = 'none';
    }
}

// Handle login
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

// Handle logout
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

// Display channel data
function showChannelData(data) {
    const channelData = document.getElementById('channel-data');
    channelData.innerHTML = data;
}

// Get channel from API
function getChannel(channel) {
    gapi.client.youtube.channels
        .list({
            part: 'snippet,contentDetails,statistics',
            forUsername: channel
        })
        .then(response => {

            const channel = response.result.items[0];

            const output = `
        <ul class="collection">
          <li class="collection-item">Title: ${channel.snippet.title}</li>
          <li class="collection-item">ID: ${channel.id}</li>
          <li class="collection-item">Subscribers: ${numberWithCommas(
            channel.statistics.subscriberCount
          )}</li>
          <li class="collection-item">Views: ${numberWithCommas(
            channel.statistics.viewCount
          )}</li>
          <li class="collection-item">Videos: ${numberWithCommas(
            channel.statistics.videoCount
          )}</li>
        </ul>
        <p>${channel.snippet.description}</p>
        <hr>
        <a class="btn grey darken-2" target="_blank" href="https://youtube.com/${
          channel.snippet.customUrl
        }">Visit Channel</a>
      `;
            showChannelData(output);

            const playlistId = channel.contentDetails.relatedPlaylists.uploads;
            requestVideoPlaylist(playlistId);
        })
        .catch(err => alert('Does not exist'));
}

// Add commas to number
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function contains(key, caption) {
    var n = caption.search(key);
    if (n == -1) {
        console.log("Is not in the captions");

        return false;
    }
    console.log("In the captions");
    return true;
}

function parseXML(xml) {
    console.log("Parsing");
    var caption = "";
    if (xml.childNodes != undefined) {
        for (let index = 0; index < xml.childNodes[0].childNodes.length; index++) {
            caption += xml.childNodes[0].childNodes[index].innerHTML;
        }
    }

    console.log(caption);
    return caption;
}


function requestVideoPlaylist(playlistId) {
    const requestOptions = {
        playlistId: playlistId,
        part: 'snippet',
        maxResults: 20
    };

    const request = gapi.client.youtube.playlistItems.list(requestOptions);

    request.execute(response => {

        const playListItems = response.result.items;
        if (playListItems) {
            videoContainer.innerHTML = '<br><h4 class="center-align">Suggested Videos(Please wait for a few seconds..)</h4>';

            // Loop through videos and append output
            playListItems.forEach(item => {
                const videoId = item.snippet.resourceId.videoId;
                const url = "https://video.google.com/timedtext?lang=en&v=" + videoId;
                console.log(videoId, url);

                $.ajax({
                    type: "POST",
                    url: url,
                    success: function(response) {

                        var caption = parseXML(response);
                        var keyword = document.getElementById('keyword').value;

                        var wordArray = keyword.split(" ");

                        console.log("The keyword is" + keyword);
                        console.log("The caption is" + caption);

                        for (let i = 0; i < wordArray.length; i++) {
                            const element = wordArray[i];

                            if (contains(element, caption)) {
                                console.log("The phrase is in the video");
                                console.log("The videoId is " + videoId);
                                output = `
      <div class="col s3">
      <iframe width="100%" height="auto" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
      </div>
      `;
                                // Output videos
                                videoContainer.innerHTML += output;
                                i = wordArray.length;
                            }


                        }




                    }
                });
            });
        } else {
            videoContainer.innerHTML = 'No Uploaded Videos';
        }
    });
}