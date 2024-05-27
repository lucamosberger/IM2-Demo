
let songs = []
let load_more_button = document.querySelector("#load_more");
let amount = 15;

/* Get Data from API */
async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data.songList;
}

async function showSongs(selectedDate, amount) {
    if (!selectedDate) {
        alert("Bitte wählen Sie ein gültiges Datum.");
        return;
    }

    const fromDate = `${selectedDate}T00%3A00%3A00%2B02%3A00`;
    const toDate = `${selectedDate}T23%3A59%3A00%2B02%3A00`;

    const url = `https://il.srgssr.ch/integrationlayer/2.0/srf/songList/radio/byChannel/66815fe2-9008-4853-80a5-f9caaffdf3a9?from=${fromDate}&to=${toDate}&pageSize=${amount}`;

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
        songs.forEach(song => {
            const div = document.createElement('div');
            div.className = 'song';
            div.innerHTML = `<strong>${song.title}</strong> von ${song.artist.name} (${formatDuration(song.duration)})`;
            container.appendChild(div);
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
    // await callAPI();
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


    let artistDurationDiv = document.createElement('div');
    artistDurationDiv.innerHTML = `${randomSong.artist.name} (${formatDuration(randomSong.duration)})`;
    artistDurationDiv.setAttribute('class', 'artist-duration');
    randomSongElement.appendChild(artistDurationDiv);
    randomSongElementFooter.appendChild(artistDurationDiv.cloneNode(true));
}


function generateAutocomplete(songs) {
    console.log(songs);
    const searchInput = document.getElementById('autocomplete-input');
    const resultsContainer = document.getElementById('autocomplete-results');

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
}


function loadMoreSongs() {
    amount += 15;
    showSongs(datePicker.value, amount);
}





document.addEventListener('DOMContentLoaded', function() {
    const datePicker = document.getElementById('datePicker');

    const today = new Date();
    const minValidDate = new Date(today);
    minValidDate.setDate(today.getDate() - 7);
    const minValidDateString = minValidDate.toISOString().split('T')[0];
    const todayString = today.toISOString().split('T')[0];

    datePicker.value = minValidDateString;

    // Set attributes for the date picker
    datePicker.setAttribute('max', minValidDateString);
    datePicker.setAttribute('min', '1900-01-01'); // Some very past date

    showSongs(datePicker.value, amount);

    datePicker.addEventListener('input', function() {
        const selectedDate = new Date(datePicker.value);
        if (selectedDate > minValidDate || selectedDate > minValidDateString) {
            datePicker.value = minValidDateString;
        } else {
            showSongs(datePicker.value, amount);
        }
    });

    

    load_more_button.addEventListener('click', loadMoreSongs);

});









