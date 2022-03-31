let soundEffect
PIXI.sound.Sound.from({
    url: 'src/sounds/examples_resources_bird.mp3',
    preload: true,
    loaded: function(err, sound){
        soundEffect = sound
    }
})

function clickSoundEffect(){
    soundEffect.play()
}

export {clickSoundEffect}