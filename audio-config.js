// audio-config.js
const AudioConfig = {
    // Volume settings
    volumes: {
        magic: 0.4,     // one-love.mp3 volume
        cosmic: 0.3,    // Cosmic transition sound
        ambient: 0.1    // Future ambient sounds
    },
    
    // File paths
    files: {
        magic: 'audio/one-love.mp3',
        cosmic: 'audio/cosmic-ambient.mp3'  // File ambient cho Touch the heart
    },
    
    // Playback settings
    settings: {
        loopMagic: true,
        loopCosmic: true, // THÊM DÒNG NÀY - ĐÃ THIẾU
        autoplayDelay: 1000,
        fadeDuration: 1000
    }
};