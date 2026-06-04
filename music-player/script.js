document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const audio = document.getElementById('audio-element');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    const titleEl = document.getElementById('title');
    const artistEl = document.getElementById('artist');
    const coverEl = document.getElementById('cover-img');
    
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    
    const volumeBar = document.getElementById('volume-bar');
    const muteIcon = document.getElementById('mute-icon');
    
    const playlistBtn = document.getElementById('playlist-btn');
    const closePlaylistBtn = document.getElementById('close-playlist');
    const playlistOverlay = document.getElementById('playlist');
    const playlistList = document.getElementById('playlist-list');

    // Playlist Data (Using public domain / royalty free audio links for demo)
    const songs = [
        {
            title: "Summer Walk",
            artist: "Olexy",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            cover: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&q=80"
        },
        {
            title: "Chill Acoustic",
            artist: "Coma-Media",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80"
        },
        {
            title: "Night Drive",
            artist: "SoundHelix",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            cover: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?w=400&q=80"
        }
    ];

    let songIndex = 0;
    let isPlaying = false;

    // Initialize Player
    function loadSong(song) {
        titleEl.innerText = song.title;
        artistEl.innerText = song.artist;
        coverEl.src = song.cover;
        audio.src = song.src;
        updatePlaylistActiveStatus();
    }

    loadSong(songs[songIndex]);

    // Play/Pause Functionality
    function playSong() {
        isPlaying = true;
        playBtn.classList.add('playing');
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        audio.play();
        coverEl.style.transform = 'scale(1.05)';
    }

    function pauseSong() {
        isPlaying = false;
        playBtn.classList.remove('playing');
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        audio.pause();
        coverEl.style.transform = 'scale(1)';
    }

    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    // Next/Prev Functionality
    function prevSong() {
        songIndex--;
        if (songIndex < 0) {
            songIndex = songs.length - 1;
        }
        loadSong(songs[songIndex]);
        if (isPlaying) playSong();
    }

    function nextSong() {
        songIndex++;
        if (songIndex > songs.length - 1) {
            songIndex = 0;
        }
        loadSong(songs[songIndex]);
        if (isPlaying) playSong();
    }

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    // Auto play next song when ended
    audio.addEventListener('ended', nextSong);

    // Progress Bar functionality
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    }

    audio.addEventListener('timeupdate', (e) => {
        const { duration, currentTime } = e.srcElement;
        
        // Update text times
        currentTimeEl.innerText = formatTime(currentTime);
        if (duration) {
            durationEl.innerText = formatTime(duration);
        }
        
        // Update range slider value
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progressBar.value = progressPercent;
            
            // update background color fill logic
            progressBar.style.background = `linear-gradient(to right, var(--text-primary) ${progressPercent}%, #404040 ${progressPercent}%)`;
        }
    });

    progressBar.addEventListener('input', (e) => {
        const duration = audio.duration;
        const progressValue = e.target.value;
        if (duration) {
            audio.currentTime = (progressValue / 100) * duration;
        }
    });

    // Initial Duration load fix
    audio.addEventListener('loadedmetadata', () => {
        durationEl.innerText = formatTime(audio.duration);
    });

    // Volume Control
    volumeBar.addEventListener('input', (e) => {
        const vol = e.target.value;
        audio.volume = vol / 100;
        
        // Update icon based on volume
        if (audio.volume === 0) {
            muteIcon.className = 'fas fa-volume-mute';
        } else if (audio.volume < 0.5) {
            muteIcon.className = 'fas fa-volume-down';
        } else {
            muteIcon.className = 'fas fa-volume-up';
        }
    });

    // Playlist Functionality
    playlistBtn.addEventListener('click', () => {
        playlistOverlay.classList.add('active');
    });

    closePlaylistBtn.addEventListener('click', () => {
        playlistOverlay.classList.remove('active');
    });

    function renderPlaylist() {
        playlistList.innerHTML = '';
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.classList.add('playlist-item');
            if (index === songIndex) {
                li.classList.add('active');
            }
            li.innerHTML = `
                <img src="${song.cover}" class="playlist-thumb" alt="thumb">
                <div class="playlist-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
            `;
            li.addEventListener('click', () => {
                songIndex = index;
                loadSong(songs[songIndex]);
                playSong();
                playlistOverlay.classList.remove('active');
            });
            playlistList.appendChild(li);
        });
    }

    function updatePlaylistActiveStatus() {
        const items = document.querySelectorAll('.playlist-item');
        items.forEach((item, index) => {
            if (index === songIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Initial render
    renderPlaylist();
});
