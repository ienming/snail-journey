let soundEffect, pickTrashSE
PIXI.sound.Sound.from({
    url: 'src/sounds/examples_resources_bird.mp3',
    preload: true,
    loaded: function(err, sound){
        soundEffect = sound
    }
})

PIXI.sound.Sound.from({
    url: 'src/sounds/stone_drop.mp3',
    preload: true,
    loaded: function(err, sound){
        pickTrashSE = sound
    }
})

function clickSoundEffect(){
    soundEffect.play()
}

function playPickTrashSE(){
    pickTrashSE.play()
}

export {clickSoundEffect, playPickTrashSE}