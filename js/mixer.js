document.addEventListener('DOMContentLoaded', () => {
    console.log("🎵 Mixer.js wird geladen...");

    const songs = {
        "du_sagst_nichts": [
            { name: "Vocals", file: "music/dusagstnichts_vocals.mp3" },
            { name: "Backings", file: "music/dusagstnichts_backing.mp3" },
            { name: "Drums", file: "music/dusagstnichts_drums.mp3" },
            { name: "Synths", file: "music/dusagstnichts_synths.mp3" }
        ],
        "aquarium": [
            { name: "Backings", file: "music/aquarium_backings.mp3" },
            { name: "Beat", file: "music/aquarium_beat.mp3" },
            { name: "Vocals", file: "music/aquarium_vocals.mp3" }
        ]
    };

    const songSelect = document.getElementById('songSelect');
    const mixerBoard = document.getElementById('mixerBoard');
    const playBtn = document.getElementById('masterPlayBtn');
    const playBtnText = document.getElementById('playBtnText');
    const seekSlider = document.getElementById('seekSlider');
    const progressBar = document.getElementById('progressBar');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');

    let isPlaying = false;
    let trackSources = [];
    let loadedCount = 0; // Zähler für geladene Tracks

    function disablePlayButton() {
        playBtn.disabled = true;
        playBtn.style.opacity = '0.5';
        playBtn.style.cursor = 'not-allowed';
        playBtnText.innerText = '⏳ LADE AUDIOS...';
    }

    function enablePlayButton() {
        playBtn.disabled = false;
        playBtn.style.opacity = '1';
        playBtn.style.cursor = 'pointer';
        playBtnText.innerText = '▶ START AUDIO ENGINE';
    }

    function checkAllLoaded() {
        // Wenn alle Tracks geladen sind, Button aktivieren
        if (loadedCount === trackSources.length && trackSources.length > 0) {
            console.log(`✅ Alle ${trackSources.length} Tracks geladen!`);
            enablePlayButton();
        }
    }

    function buildMixer(songKey) {
        console.log(`🎼 Baue Mixer für: ${songKey}`);
        
        // Button deaktivieren, bis Audios geladen sind
        disablePlayButton();
        
        mixerBoard.innerHTML = '';
        const stems = songs[songKey];
        trackSources = [];
        loadedCount = 0; // Zähler zurücksetzen

        stems.forEach((stem, index) => {
            console.log(`  ➕ Lade Track ${index}: ${stem.name} -> ${stem.file}`);
            
            const channel = document.createElement('div');
            channel.className = 'channel-strip';
            channel.innerHTML = `
                <div class="track-name">${stem.name}</div>
                <button class="mute-btn" id="mute-${index}">M</button>
                <div class="fader-container">
                    <input type="range" class="vertical-fader" id="vol-${index}" min="0" max="1" step="0.01" value="0.8">
                </div>
            `;
            mixerBoard.appendChild(channel);

            const audioEl = new Audio();
            audioEl.src = stem.file;
            audioEl.loop = true;
            audioEl.preload = "auto";
            
            audioEl.addEventListener('loadstart', () => {
                console.log(`  📥 ${stem.name}: Laden startet...`);
            });
            
           audioEl.addEventListener('canplaythrough', () => {
    console.log(`  ✅ ${stem.name}: Bereit zum Abspielen`);
    loadedCount++;
    checkAllLoaded();
});
            
            audioEl.addEventListener('canplay', () => {
                console.log(`  ▶️ ${stem.name}: Kann abspielen`);
            });
            
            audioEl.addEventListener('error', (e) => {
                console.error(`  ❌ FEHLER bei ${stem.name}:`);
                console.error(`     Datei: ${stem.file}`);
                console.error(`     Error Code: ${audioEl.error?.code}`);
            });

            const volSlider = document.getElementById(`vol-${index}`);
            const muteBtn = document.getElementById(`mute-${index}`);

            audioEl.volume = parseFloat(volSlider.value);

            volSlider.addEventListener('input', (e) => {
                audioEl.volume = parseFloat(e.target.value);
                if (parseFloat(e.target.value) > 0) {
                    muteBtn.classList.remove('muted');
                }
            });

            muteBtn.addEventListener('click', () => {
                if (muteBtn.classList.contains('muted')) {
                    audioEl.volume = parseFloat(volSlider.value);
                    muteBtn.classList.remove('muted');
                } else {
                    audioEl.volume = 0;
                    muteBtn.classList.add('muted');
                }
            });

            trackSources.push(audioEl);
        });

        console.log(`🎵 Mixer mit ${trackSources.length} Tracks erstellt, warte auf Laden...`);
    }

    // Initialer Aufbau
    if (songSelect) {
        buildMixer(songSelect.value);

        // Songwechsel
        songSelect.addEventListener('change', (e) => {
            console.log(`📁 Wechsel zu: ${e.target.value}`);
            trackSources.forEach(audio => {
                audio.pause();
                audio.currentTime = 0;
            });
            if (isPlaying) {
                playBtn.classList.remove('playing');
                isPlaying = false;
            }
            buildMixer(e.target.value);
        });
    }

    // Play/Pause Steuerung
    function togglePlay() {
        console.log(`🎯 Play geklickt | isPlaying: ${isPlaying}`);
        
        if (!isPlaying) {
            console.log(`▶️ Starte ${trackSources.length} Audio-Tracks...`);
            
            trackSources.forEach((audio, index) => {
                const playPromise = audio.play();
                
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log(`   ✓ Track ${index} spielt ab`);
                        })
                        .catch(err => {
                            console.error(`   ✗ Track ${index} FEHLER: ${err.message}`);
                        });
                }
            });
            
            playBtn.classList.add('playing');
            playBtnText.innerText = '⏸ PAUSE';
            isPlaying = true;
        } else {
            console.log(`⏸️ Pausiere alle Tracks`);
            trackSources.forEach(audio => audio.pause());
            playBtn.classList.remove('playing');
            playBtnText.innerText = '▶ START AUDIO ENGINE';
            isPlaying = false;
        }
    }

    if (playBtn) {
        playBtn.addEventListener('click', togglePlay);
    }

    // Timeline Update Logik
    function updateTimeline() {
        requestAnimationFrame(updateTimeline);

        if (trackSources.length > 0 && trackSources[0]) {
            const audio = trackSources[0];

            if (audio.duration && !isNaN(audio.duration)) {
                seekSlider.max = audio.duration;
                seekSlider.value = audio.currentTime;
                progressBar.style.width = (audio.currentTime / audio.duration) * 100 + '%';
                currentTimeEl.textContent = formatTime(audio.currentTime);
                durationEl.textContent = formatTime(audio.duration);
            }
        }
    }

    // Hilfsfunktion für Zeitformatierung
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Seek-Slider Event Listener
    if (seekSlider) {
        seekSlider.addEventListener('input', (e) => {
            trackSources.forEach(audio => {
                audio.currentTime = parseFloat(e.target.value);
            });
        });
    }

    // Timeline Loop starten
    updateTimeline();
    console.log("✅ Mixer.js vollständig initialisiert");
});
