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

let url =`https://il.srgssr.ch/integrationlayer/2.0/srf/songList/radio/byChannel/66815fe2-9008-4853-80a5-f9caaffdf3a9?from=2024-04-08T00%3A00%3A00%2B02%3A00&to=2024-04-08T23%3A59%3A00%2B02%3A00&pageSize=500`

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
}


callAPI();

//chooose random song
function chooseRandomSong() {
    let randomNumber = generateRandomNumber();
    //console.log("Random Number: ",randomNumber);
}
chooseRandomSong ()



async function showRandomSong() {
    await callAPI(); //wait for the API to be loaded
    let randomNumber = generateRandomNumber();
   // console.log("Random Number: ",randomNumber);
    let randomSong = songs[randomNumber];

    let randomSongElement = document.getElementById('random_song');

    let titleDiv= document.createElement('div');
    titleDiv.innerHTML = randomSong.title;
    titleDiv.setAttribute('class','title');
    randomSongElement.appendChild(titleDiv);

    let artistDiv = document.createElement('div');
    artistDiv.innerHTML = randomSong.artist.name;
    artistDiv.setAttribute('class', 'artist'); // Setzt die Klasse 'artist'
    randomSongElement.appendChild(artistDiv);
    
    //randomSongElement.innerHTML = randomSong.title +" by "+ randomSong.artist.name;

}
showRandomSong();
//console.log("Unser Song: ",unserSong);


//search song
function searchSong() {
    let searchValue = document.getElementById('search').value;
    //console.log("Search Value: ",searchValue);
    let foundSongs = songs.filter(song => song.title.toLowerCase().includes(searchValue.toLowerCase()));
    //console.log("Found Songs: ",foundSongs);
}


// Funktion zum Filtern und Anzeigen von Songs
function updateSongList(searchValue) {
    const songList = document.getElementById('songList');
    songList.innerHTML = ''; // Liste leeren

    if (searchValue) {
        const foundSongs = songs.filter(song =>
            song.title.toLowerCase().includes(searchValue.toLowerCase())
        );

        
        foundSongs.forEach(song => {
            const li = document.createElement('li');
            //li.textContent = `${song.title} - ${song.artist.name}`;
            li.textContent = song.title +" - "+song.artist.name;
            document.createElement('a')
            songList.appendChild(li);

        });
    }
}



// Event Listener für das Suchfeld
document.getElementById('searchInput').addEventListener('input', (event) => {
    updateSongList(event.target.value);
});


// function generateAutocomplete() {
//     const searchInput = document.getElementById('autocomplete-input');
//     const resultsContainer = document.getElementById('autocomplete-results');

//     //const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Grape', 'Kiwi', 'Mango', 'Nectarine', 'Orange', 'Pineapple', 'Quince'];
//     //console.log("Songs: ",songs);
//     const items = songs.map(song => song.title+", "+song.artist.name);
//     console.log("Songs: ",songs);

//     searchInput.addEventListener('input', function() {
//         const input = searchInput.value.toLowerCase();
//         resultsContainer.innerHTML = '';

//         if (input.length > 0) {
//             const filteredItems = items.filter(item => item.toLowerCase().startsWith(input));

//             filteredItems.forEach(function(item) {
//                 const div = document.createElement('div');
//                 div.textContent = item;
//                 div.addEventListener('click', function() {
//                     searchInput.value = item;
//                     resultsContainer.innerHTML = '';
//                 });
//                 resultsContainer.appendChild(div);
//             });
//         }
//     });
// };

function generateAutocomplete() {
    const searchInput = document.getElementById('autocomplete-input');
    const resultsContainer = document.getElementById('autocomplete-results');

    // Array `songs` wird vorausgesetzt, dass es definiert und initialisiert wurde.
    const items = songs.map(song => ({
        label: song.title + ", " + song.artist.name, // Komplette Beschriftung für Anzeige
        title: song.title.toLowerCase(), // Titel in Kleinbuchstaben
        artist: song.artist.name.toLowerCase() // Künstlername in Kleinbuchstaben
    }));

    searchInput.addEventListener('input', function() {
        const input = searchInput.value.toLowerCase();
        resultsContainer.innerHTML = '';

        if (input.length > 0) {
            // Filtert sowohl nach Titel als auch Künstlernamen, die mit dem Eingabewert beginnen
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
