let soundEffect, pickTrashSE, judgeSE
PIXI.sound.Sound.from({
    url: 'src/sounds/examples_resources_bird.mp3',
    preload: true,
    volume: 0.3,
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

PIXI.sound.Sound.from({
    url: 'src/sounds/pop.mp3',
    preload: true,
    volume: 0.3,
    loaded: function(err, sound){
        judgeSE = sound
    }
})

function clickSoundEffect(){
    soundEffect.play()
}

function playPickTrashSE(){
    pickTrashSE.play()
}

function playJudgeSE(){
    judgeSE.play()
}

export {clickSoundEffect, playPickTrashSE, playJudgeSE}