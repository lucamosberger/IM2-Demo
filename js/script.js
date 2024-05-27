// const searchBocks = document.querySelector('#search');
// const app = document.querySelector('#app');
// let anzahlsongs = 445;

// document.addEventListener('DOMContentLoaded', function(){
//     initSongs();
// });

// // searchBox.addEventListener('input', function(){
//     // sucheSongs(searchBox.value);
// //});

// async function initSongs() {
//     let url = `https://il.srgssr.ch/integrationlayer/2.0/srf/songList/radio/byChannel/66815fe2-9008-4853-80a5-f9caaffdf3a9?from=2024-04-08T00%3A00%3A00%2B02%3A00&to=2024-04-08T23%3A59%3A00%2B02%3A00&pageSize=500`; 
//     let songs = await fetchData(url);
//     updateDOM(songs);
// }



//console.log('Hello, World!');

let songs = []

let heute = new Date();
console.log("Heute: ",heute);

let heuteSubstring = heute.toISOString().substring(0, 10).trim();
console.log("Heute Substring: ",heuteSubstring);

// Definition von gestern und gesternSubstring einkommentieren
let gestern = new Date(heute);
gestern.setDate(heute.getDate() - 7);
let gesternSubstring = gestern.toISOString().substring(0, 10).trim();
console.log("Gestern Substring: ", gesternSubstring);

// 2024-04-08

// let url =`https://il.srgssr.ch/integrationlayer/2.0/srf/songList/radio/byChannel/66815fe2-9008-4853-80a5-f9caaffdf3a9?from=2024-05-08T00%3A00%3A00%2B02%3A00&to=2024-05-08T23%3A59%3A00%2B02%3A00&pageSize=500`


let url =`https://il.srgssr.ch/integrationlayer/2.0/srf/songList/radio/byChannel/66815fe2-9008-4853-80a5-f9caaffdf3a9?from=${gesternSubstring}T00%3A00%3A00%2B02%3A00&to=${gesternSubstring}T23%3A59%3A00%2B02%3A00&pageSize=500`
console.log("URL: ",url);

function generateRandomNumber() {
    return Math.floor(Math.random() * 446);
    
}
async function callAPI () {
    const response = await fetch(url);
    //console.log("Raw response: ",response);
    const data = await response.json();
    //console.log("Data: ",data);
    songs = data.songList;
    //console.log("Songs: ",songs);
    // let firstSong = songs[5];
    // console.log("First Song: ",firstSong);
    //filter song where isPlayingNow = true
    let currentSong = songs.filter(song => song.isPlayingNow == true);
    //console.log ("currentSong: ",currentSong);

    generateAutocomplete()

        // Auswahl und Anzeige von 9 zufälligen Empfehlungssongs
        let recommendedSongs = getRandomSongs(songs);
        displayRecommendations(recommendedSongs);
}


callAPI();

//chooose random song
function chooseRandomSong() {
    let randomNumber = generateRandomNumber();
    //console.log("Random Number: ",randomNumber);
}
chooseRandomSong ()




document.addEventListener('DOMContentLoaded', function() {
    const datePicker = document.getElementById('datePicker');

    const today = new Date();
    const minValidDate = new Date(today);
    minValidDate.setDate(today.getDate() - 7);
    const minValidDateString = minValidDate.toISOString().split('T')[0];
    const todayString = today.toISOString().split('T')[0];

    // Set attributes for the date picker
    datePicker.setAttribute('max', minValidDateString);
    datePicker.setAttribute('min', '1900-01-01'); // Some very past date

    datePicker.addEventListener('input', function() {
        const selectedDate = new Date(datePicker.value);
        if (selectedDate > minValidDate || selectedDate > today) {
            datePicker.value = '';
        } else {
            showSongs(datePicker.value);
        }
    });

    async function fetchData(url) {
        const response = await fetch(url);
        const data = await response.json();
        return data.songList;
    }

    async function showSongs(selectedDate) {
        if (!selectedDate) {
            alert("Bitte wählen Sie ein gültiges Datum.");
            return;
        }

        const fromDate = `${selectedDate}T00%3A00%3A00%2B02%3A00`;
        const toDate = `${selectedDate}T23%3A59%3A00%2B02%3A00`;

        const url = `https://il.srgssr.ch/integrationlayer/2.0/srf/songList/radio/byChannel/66815fe2-9008-4853-80a5-f9caaffdf3a9?from=${fromDate}&to=${toDate}&pageSize=500`;

        let songs = await fetchData(url);
        updateDOM(songs);
    }


    function formatDuration(duration) {
        let seconds = Math.floor(duration / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} min`;
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
});

function formatDuration(duration) {
    const minutes = Math.floor(duration / 60000);
    const seconds = ((duration % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

async function showRandomSong() {
    await callAPI();
    let randomNumber = generateRandomNumber();
    let randomSong = songs[randomNumber];

    let randomSongElement = document.getElementById('random_song');
    
    randomSongElement.innerHTML = '';

    let titleDiv = document.createElement('div');
    titleDiv.innerHTML = randomSong.title;
    titleDiv.setAttribute('class', 'title');
    randomSongElement.appendChild(titleDiv);

    let artistDurationDiv = document.createElement('div');
    artistDurationDiv.innerHTML = `${randomSong.artist.name} (${formatDuration(randomSong.duration)})`;
    artistDurationDiv.setAttribute('class', 'artist-duration');
    randomSongElement.appendChild(artistDurationDiv);
}

showRandomSong();

function searchSong() {
    let searchValue = document.getElementById('search').value;
    let foundSongs = songs.filter(song => song.title.toLowerCase().includes(searchValue.toLowerCase()));
}

function updateSongList(searchValue) {
    const songList = document.getElementById('songList');
    songList.innerHTML = '';

    if (searchValue) {
        const foundSongs = songs.filter(song =>
            song.title.toLowerCase().includes(searchValue.toLowerCase())
        );

        foundSongs.forEach(song => {
            const li = document.createElement('li');
            li.textContent = `${song.title} - ${song.artist.name} (${formatDuration(song.duration)})`;
            songList.appendChild(li);
        });
    }
}

function generateAutocomplete() {
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

function getRandomSongs(songs, displayCount = 445) {
    return songs.sort(() => 0.5 - Math.random()).slice(0, displayCount);
}

function displayRecommendations(songs) {
    const container = document.getElementById('recommendations');
    container.innerHTML = '';
    songs.forEach(song => {
        const div = document.createElement('div');
        div.className = 'song';
        div.innerHTML = `<strong>${song.title}</strong> von ${song.artist.name} (${formatDuration(song.duration)})`;
        container.appendChild(div);
    });
}