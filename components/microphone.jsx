"use client";

// Import necessary modules and components
import { useEffect, useState, useRef } from "react";
import Image from 'next/image'

// Export the MicrophoneComponent function component
export default function MicrophoneComponent({ setGptReply, setMicrophoneDoneRecording, problem_description, setProblemDescription, questions, setQuestions, backNForth, setBackNForth, setLoading, setTriage }) {
    // State variables to manage recording status, completion, and transcript
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [stage, setStage] = useState(0)
    const [qNo, setQNo] = useState(0)
    // Reference to store the SpeechRecognition instance
    const recognitionRef = useRef();

    // Function to start recording
    const startRecording = () => {
        // Create a new SpeechRecognition instance and configure it
        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        // Event handler for speech recognition results
        recognitionRef.current.onresult = (event) => {
            let trans = ""
            for (const result of event.results) {
                trans += result[0].transcript
            }

            trans = trans.charAt(0).toUpperCase() + trans.slice(1)
            // Log the recognition results and update the transcript state
            setTranscript(trans);
        };

        // Start the speech recognition
        recognitionRef.current.start();
        setIsRecording(true)
        setMicrophoneDoneRecording(false)
        setTranscript("")
    };

    // Cleanup effect when the component unmounts
    useEffect(() => {
        return () => {
            // Stop the speech recognition if it's active
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    // Function to stop recording
    const stopRecording = async () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsRecording(false)

            switch (stage) {
                case 0:
                    setProblemDescription(transcript)
                    console.log(`Caller description: ${transcript}`)

                    const res = await (fetch("/api/v1/query", {
                        method: "POST",
                        body: JSON.stringify({
                            "problem_description": transcript,
                            "stage": 0
                        }),
                    })).then(data => data.json())

                    console.log(`Operator greeting: ${res.msg}`)
                    setGptReply(res.msg)
                    setMicrophoneDoneRecording(true)
                    setStage(stage + 1)
                    break
                case 1:
                    console.log(`Caller name: ${transcript}`)

                    setGptReply("One moment.")
                    setMicrophoneDoneRecording(true)
                    setLoading(true)

                    const res1 = await (fetch("/api/v1/query", {
                        method: "POST",
                        body: JSON.stringify({
                            "problem_description": problem_description,
                            "stage": 1,
                            "last_reply": transcript,
                        }),
                    })).then(data => data.json())

                    const questions_gen = res1.questions
                    setLoading(false)
                    setQuestions(questions_gen)
                    setGptReply(questions_gen[0])
                    console.log(`Operator q${0}: ${questions_gen[0]}`)
                    setStage(stage + 1)
                    break
                case 2:
                    console.log(`Caller answer q${qNo}: ${transcript}`)
                    setBackNForth((prev) => prev.concat([{ "role": "assistant", "content": questions[qNo]}, { "role": "user", "content": transcript }]))

                    setQNo((prev) => prev + 1)

                    if (qNo+1 == questions.length) {
                        setGptReply("Please hold")
                        console.log("Operator: Please hold")
                        setLoading(true);
                        setMicrophoneDoneRecording(true)
                        // TODO add summarization here
                        const res2 = await fetch("/api/v1/query", {
                            method: "POST",
                            body: JSON.stringify({
                                "problem_description": problem_description,
                                "stage": 2,
                                "history": backNForth.concat([{ "role": "assistant", "content": questions[qNo]}, { "role": "user", "content": transcript }])
                            })
                        }).then(data => data.json())
                        setLoading(false)
                        
                        setTriage(res2.triage)
                        setGptReply("Help has been dispatched and is on their way.")
                        break;
                    }

                    setGptReply(questions[qNo + 1])
                    console.log(`Operator q${qNo + 1}: ${questions[qNo + 1]}`)
                    setMicrophoneDoneRecording(true)
                    break
            }

        }
    };

    // Toggle recording state and manage recording actions
    const handleToggleRecording = () => {
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
    };

    // Render the microphone component with appropriate UI based on recording state
    return (
        <div className="flex items-center justify-center h-screen w-full">
            <div className="w-full">
                {(isRecording || transcript) && (
                    <div className="w-full">
                        <div>
                            {isRecording && (
                                <p>Recording...</p>
                            )}
                        </div>
                        <div>
                            {transcript && (
                                <div className="border rounded-md p-2 h-fullm mt-4">
                                    <p className="mb-0">{transcript}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className="w-full">
                {isRecording ? (
                    // Button for stopping recording
                    <Image src="/images/Microphone 14.png" onClick={handleToggleRecording} width={50} height={50} />
                ) : (
                    // Button for starting recording
                    <Image src="/images/Microphone 14 (1)..png" onClick={handleToggleRecording} width={50} height={50} />
                )}
            </div>
        </div >
    );
}