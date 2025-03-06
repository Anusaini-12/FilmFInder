const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';

// Get movie ID from URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

const movieDetails = document.getElementById('movie-details');

// Fetch movie details
fetch(`${BASE_URL}/movie/${movieId}?${API_KEY}`)
    .then(res => res.json())
    .then(movie => {
        document.title = movie.title; // Set page title dynamically

        movieDetails.innerHTML = `
            <div class="movie-banner" style="background-image: url('${IMG_URL + movie.backdrop_path}');">
                <h1>${movie.title} (${movie.release_date.split('-')[0]})</h1>
            </div>
            <div class="movie-info-container">
                <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
                <div class="movie-details-text">
                    <p><strong>⭐ Rating:</strong> ${movie.vote_average}</p>
                    <p><strong>🎬 Genre:</strong> ${movie.genres.map(g => g.name).join(', ')}</p>
                    <p><strong>📅 Release Date:</strong> ${movie.release_date}</p>
                    <p><strong>📖 Overview:</strong> ${movie.overview}</p>
                </div>
            </div>
            <div id="trailer-container"></div>
            <h2 style="color: white;
                       font-size: 3rem;
                       text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
                       text-align: center">
                       Cast</h2>
            <div id="cast-container" class="cast-grid"></div>
        `;

        getMovieTrailer(movieId);
        getMovieCast(movieId);
    });

// Fetch YouTube Trailer
function getMovieTrailer(movieId) {
    fetch(`${BASE_URL}/movie/${movieId}/videos?${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            const trailers = data.results.filter(video => video.type === "Trailer");
            if (trailers.length > 0) {
                document.getElementById('trailer-container').innerHTML = `
                    <h2>Trailer</h2>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/${trailers[0].key}" frameborder="0" allowfullscreen></iframe>
                `;
            }
        });
}

// Fetch Cast Details
function getMovieCast(movieId) {
    fetch(`${BASE_URL}/movie/${movieId}/credits?${API_KEY}`)
        .then(res => res.json())
        .then(data => {
            const cast = data.cast.slice(0, 6); // Get top 6 actors
            const castContainer = document.getElementById('cast-container');

            cast.forEach(actor => {
                const castCard = document.createElement('div');
                castCard.classList.add('cast-card');
                castCard.innerHTML = `
                    <img src="${actor.profile_path ? IMG_URL + actor.profile_path : 'https://via.placeholder.com/100x150'}" alt="${actor.name}">
                    <p><strong>${actor.name}</strong></p>
                    <p>${actor.character}</p>
                `;
                castContainer.appendChild(castCard);
            });
        });
}

// Go back function
function goBack() {
    window.history.back();
}
