class CassetteGame {
    constructor() {
        this.score = 0;
        this.clicks = 0;
        this.level = 1;
        this.speed = 1;
        this.isPlaying = false;
        this.achievements = {
            'first-click': false,
            'speed-demon': false,
            'collector': false
        };
        
        this.songs = [
            { title: "AWESOME MIX", artist: "VOL. 1" },
            { title: "RETRO BEATS", artist: "80s HITS" },
            { title: "NEON NIGHTS", artist: "SYNTHWAVE" },
            { title: "PIXEL DREAMS", artist: "CHIPTUNE" },
            { title: "COSMIC VIBES", artist: "SPACE JAM" }
        ];
        
        this.currentSong = 0;
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.elements = {
            cassette: document.getElementById('cassette'),
            leftReel: document.getElementById('leftReel'),
            rightReel: document.getElementById('rightReel'),
            tape: document.getElementById('tape'),
            songTitle: document.getElementById('songTitle'),
            artist: document.getElementById('artist'),
            score: document.getElementById('score'),
            clicks: document.getElementById('clicks'),
            level: document.getElementById('level'),
            speed: document.getElementById('speed'),
            playBtn: document.getElementById('playBtn'),
            pauseBtn: document.getElementById('pauseBtn'),
            stopBtn: document.getElementById('stopBtn'),
            rewindBtn: document.getElementById('rewindBtn'),
            fastForwardBtn: document.getElementById('fastForwardBtn'),
            achievementList: document.getElementById('achievementList')
        };
    }
    
    bindEvents() {
        // Cassette click event
        this.elements.cassette.addEventListener('click', () => this.clickCassette());
        
        // Control button events
        this.elements.playBtn.addEventListener('click', () => this.play());
        this.elements.pauseBtn.addEventListener('click', () => this.pause());
        this.elements.stopBtn.addEventListener('click', () => this.stop());
        this.elements.rewindBtn.addEventListener('click', () => this.rewind());
        this.elements.fastForwardBtn.addEventListener('click', () => this.fastForward());
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }
    
    clickCassette() {
        this.clicks++;
        this.score += this.level * 10;
        
        // Add bounce animation
        this.elements.cassette.classList.add('bouncing');
        setTimeout(() => {
            this.elements.cassette.classList.remove('bouncing');
        }, 1000);
        
        // Check for level up
        if (this.clicks % 10 === 0) {
            this.levelUp();
        }
        
        // Check achievements
        this.checkAchievements();
        
        // Update display
        this.updateDisplay();
        
        // Play sound effect (visual feedback)
        this.playClickEffect();
    }
    
    playClickEffect() {
        // Create visual click effect
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #f39c12;
            font-size: 2rem;
            font-weight: bold;
            pointer-events: none;
            z-index: 1000;
            animation: fadeUp 1s ease-out forwards;
        `;
        effect.textContent = `+${this.level * 10}`;
        
        // Add CSS animation
        if (!document.querySelector('#clickEffectStyle')) {
            const style = document.createElement('style');
            style.id = 'clickEffectStyle';
            style.textContent = `
                @keyframes fadeUp {
                    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -150%) scale(1.5); }
                }
            `;
            document.head.appendChild(style);
        }
        
        this.elements.cassette.style.position = 'relative';
        this.elements.cassette.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 1000);
    }
    
    levelUp() {
        this.level++;
        this.speed = Math.min(this.speed + 0.2, 5);
        
        // Change cassette color
        this.elements.cassette.classList.add('color-shifting');
        setTimeout(() => {
            this.elements.cassette.classList.remove('color-shifting');
        }, 3000);
        
        // Show level up message
        this.showMessage(`🎉 Level ${this.level}! 🎉`);
    }
    
    showMessage(text) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 20px 40px;
            border-radius: 15px;
            font-size: 1.5rem;
            font-weight: bold;
            z-index: 2000;
            animation: messagePopup 2s ease-out forwards;
        `;
        message.textContent = text;
        
        // Add message animation
        if (!document.querySelector('#messageStyle')) {
            const style = document.createElement('style');
            style.id = 'messageStyle';
            style.textContent = `
                @keyframes messagePopup {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                    30% { transform: translate(-50%, -50%) scale(1); }
                    90% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 2000);
    }
    
    play() {
        this.isPlaying = true;
        this.elements.cassette.classList.add('playing');
        this.startReelAnimation();
        this.updateTape();
        this.showMessage('▶️ Playing');
    }
    
    pause() {
        this.isPlaying = false;
        this.elements.cassette.classList.remove('playing');
        this.stopReelAnimation();
        this.showMessage('⏸️ Paused');
    }
    
    stop() {
        this.isPlaying = false;
        this.elements.cassette.classList.remove('playing');
        this.stopReelAnimation();
        this.elements.tape.style.width = '0%';
        this.showMessage('⏹️ Stopped');
    }
    
    rewind() {
        this.currentSong = (this.currentSong - 1 + this.songs.length) % this.songs.length;
        this.updateSongInfo();
        this.elements.tape.style.width = '0%';
        this.showMessage('⏪ Previous Track');
    }
    
    fastForward() {
        this.currentSong = (this.currentSong + 1) % this.songs.length;
        this.updateSongInfo();
        this.elements.tape.style.width = '100%';
        this.showMessage('⏩ Next Track');
    }
    
    startReelAnimation() {
        this.elements.leftReel.classList.add('spinning');
        this.elements.rightReel.classList.add('spinning');
    }
    
    stopReelAnimation() {
        this.elements.leftReel.classList.remove('spinning');
        this.elements.rightReel.classList.remove('spinning');
    }
    
    updateTape() {
        if (this.isPlaying) {
            const currentWidth = parseFloat(this.elements.tape.style.width) || 0;
            const newWidth = Math.min(currentWidth + this.speed, 100);
            this.elements.tape.style.width = newWidth + '%';
            
            if (newWidth >= 100) {
                this.fastForward();
                setTimeout(() => this.updateTape(), 1000);
            } else {
                setTimeout(() => this.updateTape(), 100);
            }
        }
    }
    
    updateSongInfo() {
        const song = this.songs[this.currentSong];
        this.elements.songTitle.textContent = song.title;
        this.elements.artist.textContent = song.artist;
    }
    
    checkAchievements() {
        // First Click achievement
        if (this.clicks === 1 && !this.achievements['first-click']) {
            this.unlockAchievement('first-click');
        }
        
        // Speed Demon achievement
        if (this.speed >= 3 && !this.achievements['speed-demon']) {
            this.unlockAchievement('speed-demon');
        }
        
        // Collector achievement
        if (this.score >= 1000 && !this.achievements['collector']) {
            this.unlockAchievement('collector');
        }
    }
    
    unlockAchievement(achievementId) {
        this.achievements[achievementId] = true;
        const achievementElement = document.querySelector(`[data-achievement="${achievementId}"]`);
        if (achievementElement) {
            achievementElement.classList.remove('locked');
            achievementElement.classList.add('unlocked');
            this.showMessage(`🏆 Achievement Unlocked! 🏆`);
        }
    }
    
    handleKeyPress(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                if (this.isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.rewind();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.fastForward();
                break;
            case 'Enter':
                e.preventDefault();
                this.clickCassette();
                break;
        }
    }
    
    updateDisplay() {
        this.elements.score.textContent = this.score;
        this.elements.clicks.textContent = this.clicks;
        this.elements.level.textContent = this.level;
        this.elements.speed.textContent = this.speed.toFixed(1) + 'x';
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new CassetteGame();
});