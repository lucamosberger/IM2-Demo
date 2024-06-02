let songs = [];
let load_more_button = document.querySelector("#load_more");
let amount = 15;

// Initial filter values
let currentDate = null;
let currentFromTime = "00:00";
let currentToTime = "23:59";

/* Get Data from API */
async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data.songList;
}

async function showSongs(selectedDate, amount, fromTime = "00:00", toTime = "23:59") {
    if (!selectedDate) {
        alert("Bitte wählen Sie ein gültiges Datum.");
        return;
    }

    const fromDate = `${selectedDate}T${encodeURIComponent(fromTime)}%2B02%3A00`;
    const toDate = `${selectedDate}T${encodeURIComponent(toTime)}%2B02%3A00`;

    // Radio SRF VIRUS API (DATEN NICHT REGELMÄSSIG VERFÜGBAR)
    // const url = `https://il.srgssr.ch/integrationlayer/2.0/srf/songList/radio/byChannel/66815fe2-9008-4853-80a5-f9caaffdf3a9?from=${fromDate}&to=${toDate}&pageSize=${amount}`;
    
    // Radio SRF 3 API (DATEN BIS ZUM HEUTIGEN TAG VERFÜGBAR)
    const url = `https://il.srgssr.ch/integrationlayer/2.0/srf/songList/radio/byChannel/69e8ac16-4327-4af4-b873-fd5cd6e895a7?from=${fromDate}&to=${toDate}&pageSize=${amount}`;	

    console.log(url);
    songs = await fetchData(url);
    updateDOM(songs);
    generateAutocomplete(songs);
    showRandomSong(amount);
}
function updateDOM(songs) {
    const container = document.getElementById('recommendations');
    container.innerHTML = '';
    if (songs && songs.length > 0) {
        songs.forEach((song, index) => {
            const mainDiv = document.createElement('div');
            mainDiv.className = 'song';

            const playButton = document.createElement('a');
            playButton.href = '#';
            playButton.className = 'changeSongLink';
            playButton.setAttribute('data-index', index);
            playButton.innerHTML = '<button class="play-btn">Play</button>';

            const songInfoDiv = document.createElement('div');
            songInfoDiv.className = 'song-info';
            songInfoDiv.innerHTML = `
                <div class="artist">${song.artist.name}</div>
                <div class="title-duration">${song.title} (${formatDuration(song.duration)})</div>
`;
            const songTimeDiv = document.createElement('div');
            songTimeDiv.className = 'song-time';
            songTimeDiv.innerHTML = `
              <div class="date">Spieldatum</div>
              ${new Date(song.date).toLocaleDateString()} ${new Date(song.date).toLocaleTimeString()}</div>
            `;

            const linksDiv = document.createElement('div');
            linksDiv.className = 'links';
            linksDiv.innerHTML = `
                <div class="link_youtube">
                    <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + song.artist.name)}" target="_blank">
                        <button>YouTube</button>
                    </a>
                </div>
                <div class="link_spotify">
                    <a href="https://open.spotify.com/search/${encodeURIComponent(song.title + ' ' + song.artist.name)}" target="_blank">
                        <button>Spotify</button>
                    </a>
                </div>
                <div class="link_apple_music">
                    <a href="https://music.apple.com/us/search?term=${encodeURIComponent(song.title + ' ' + song.artist.name)}" target="_blank">
                        <button>Apple Music</button>
                    </a>
                </div>
            `;

            mainDiv.appendChild(playButton);
            mainDiv.appendChild(songInfoDiv);
            mainDiv.appendChild(songTimeDiv);
            mainDiv.appendChild(linksDiv);
            container.appendChild(mainDiv);
        });

        document.querySelectorAll('.changeSongLink').forEach(link => {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                const songIndex = event.currentTarget.getAttribute('data-index');
                updateFooter(songs[songIndex]);
            });
        });
    } else {
        container.innerHTML = '<p>Keine Songs gefunden.</p>';
    }
}


function formatDuration(duration) {
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function showRandomSong(amount) {
    let randomNumber = Math.floor(Math.random() * amount);
    let randomSong = songs[randomNumber];

    let randomSongElement = document.getElementById('random_song');
    let randomSongElementFooter = document.getElementById('random_song_footer');
    
    randomSongElement.innerHTML = '';
    randomSongElementFooter.innerHTML = '';

    let titleDiv = document.createElement('div');
    titleDiv.innerHTML = randomSong.title;
    titleDiv.setAttribute('class', 'title');
    randomSongElement.appendChild(titleDiv);
    randomSongElementFooter.appendChild(titleDiv.cloneNode(true));

    const songDate = new Date(randomSong.date);
    const formattedDate = `${songDate.toLocaleDateString()} ${songDate.toLocaleTimeString()}`;

    let artistDurationDiv = document.createElement('div');
    artistDurationDiv.innerHTML = `${randomSong.artist.name} (${formatDuration(randomSong.duration)})`; // - ${formattedDate}
    artistDurationDiv.setAttribute('class', 'artist-duration');
    randomSongElement.appendChild(artistDurationDiv);
    randomSongElementFooter.appendChild(artistDurationDiv.cloneNode(true));
}

function updateFooter(song) {
    let footerElement = document.getElementById('random_song_footer');
    footerElement.innerHTML = '';

    const playButton = document.createElement('a');
    playButton.href = '#';
    playButton.className = 'changeSongLink';
    // playButton.innerHTML = '<button>Play</button>';

    const songInfoDiv = document.createElement('div');
    songInfoDiv.className = 'footer-song-info';
    songInfoDiv.innerHTML = `
    ${song.artist.name}
    ${song.title} (${formatDuration(song.duration)})
    `;

    const linksDiv = document.createElement('div');
    linksDiv.className = 'footer-links';
    linksDiv.innerHTML = `
        <div class="link_youtube">
            <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + song.artist.name)}" target="_blank">
                <button>YouTube</button>
            </a>
        </div>
        <div class="link_spotify">
            <a href="https://open.spotify.com/search/${encodeURIComponent(song.title + ' ' + song.artist.name)}" target="_blank">
                <button>Spotify</button>
            </a>
        </div>
        <div class="link_apple_music">
            <a href="https://music.apple.com/us/search?term=${encodeURIComponent(song.title + ' ' + song.artist.name)}" target="_blank">
                <button>Apple Music</button>
            </a>
        </div>
    `;

    footerElement.appendChild(playButton);
    footerElement.appendChild(songInfoDiv);
    footerElement.appendChild(linksDiv);
}

//Search Song
function generateAutocomplete(songs) {
    console.log(songs);
    const searchInput = document.getElementById('autocomplete-input');
    const resultsContainer = document.getElementById('autocomplete-results');
    const searchButton = document.getElementById('search-button');

    const items = songs.map(song => ({
        label: song.title + ", " + song.artist.name,
        title: song.title.toLowerCase(),
        artist: song.artist.name.toLowerCase()
    }));

    searchInput.addEventListener('input', function() {
        const input = searchInput.value.toLowerCase();
        resultsContainer.innerHTML = '';

        if (input.length > 0) {
            const filteredItems = items.filter(item => 
                item.title.startsWith(input) || item.artist.startsWith(input)
            );

            filteredItems.forEach(function(item) {
                const div = document.createElement('div');
                div.textContent = item.label;
                div.addEventListener('click', function() {
                    searchInput.value = item.label;
                    resultsContainer.innerHTML = '';
                });
                resultsContainer.appendChild(div);
            });
        }
    });

    searchButton.addEventListener('click', function() {
        const selectedSong = items.find(item => item.label.toLowerCase() === searchInput.value.toLowerCase());
        if (selectedSong) {
            const songIndex = items.findIndex(item => item.label.toLowerCase() === searchInput.value.toLowerCase());
            updateFooter(songs[songIndex]);
        }
    });
}

function loadMoreSongs() {
    amount += 15;
    showSongs(currentDate, amount, currentFromTime, currentToTime);
}

document.addEventListener('DOMContentLoaded', function() {
    const datePicker = document.getElementById('datePicker');
    const filterButton = document.getElementById('filter-button');
    const fromTimeInput = document.getElementById('fromTime');
    const toTimeInput = document.getElementById('toTime');

    const today = new Date();
    const minValidDate = new Date(today);
    minValidDate.setDate(today.getDate() - 0);
    const minValidDateString = minValidDate.toISOString().split('T')[0];
    const todayString = today.toISOString().split('T')[0];

    datePicker.value = minValidDateString;
    currentDate = minValidDateString;

    // Set attributes for the date picker
    datePicker.setAttribute('max', minValidDateString);
    datePicker.setAttribute('min', '1900-01-01'); // Some very past date

    showSongs(datePicker.value, amount);

    datePicker.addEventListener('input', function() {
        const selectedDate = new Date(datePicker.value);
        if (selectedDate > minValidDate || selectedDate > minValidDateString) {
            datePicker.value = minValidDateString;
        } else {
            currentDate = datePicker.value;
            showSongs(datePicker.value, amount, currentFromTime, currentToTime);
        }
    });

    filterButton.addEventListener('click', function(event) {
        event.preventDefault();
        currentDate = datePicker.value;
        currentFromTime = fromTimeInput.value;
        currentToTime = toTimeInput.value;
        showSongs(currentDate, amount, currentFromTime, currentToTime);
    });

    load_more_button.addEventListener('click', loadMoreSongs);
});
