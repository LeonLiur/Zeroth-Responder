"use client"

import React, { useEffect } from 'react'

export default function SpeakerComponent({text, isDone}) {
    let utterance = new SpeechSynthesisUtterance();
    useEffect(() => {
        utterance.text = text
        if(isDone){
            speechSynthesis.speak(utterance)
        }
    }, [text, isDone])
    return (
        <>
            {!isDone && <img src="/images/loading.gif"></img>}
        </>
    )
}
