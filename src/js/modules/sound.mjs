function clickSoundEffect(){
    PIXI.sound.Sound.from({
        url: 'src/sounds/examples_resources_bird.mp3',
        preload: true,
        loaded: function(err, sound){
            sound.play()
        }
    })
}

export {clickSoundEffect}