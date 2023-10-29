"use client";

import React, { useEffect, useRef, useState } from 'react'

export default function SpeakerComponent({text_in, isDone}) {
    const [text, setText] = useState("");

    useEffect(() => {
        if(isDone){
            const speechUtterance = new window.SpeechSynthesisUtterance(text_in);
            window.speechSynthesis.speak(speechUtterance)
        }
    }, [text_in, isDone])
    return (
        <>
            {!isDone && <img src="/images/loading.gif"></img>}
        </>
    )
}
