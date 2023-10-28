"use client";

// Import necessary modules and components
import { useEffect, useState, useRef } from "react";

// Export the MicrophoneComponent function component
export default function MicrophoneComponent() {
    // State variables to manage recording status, completion, and transcript
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState("");

    // Reference to store the SpeechRecognition instance
    const recognitionRef = useRef();

    // Function to start recording
    const startRecording = () => {
        setIsRecording(true);
        // Create a new SpeechRecognition instance and configure it
        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        // Event handler for speech recognition results
        recognitionRef.current.onresult = async (event) => {
            let trans = ""
            for(const result of event.results){
                trans += result[0].transcript
            }

            console.log(trans)
            trans = trans.charAt(0).toUpperCase() + trans.slice(1)
            // Log the recognition results and update the transcript state
            setTranscript(trans);

            const res = await(fetch("/api/v1/query", {
                method: "POST",
                body: JSON.stringify({
                    text: trans,
                }),
            })).then(data => JSON.parse(data))

        };

        // Start the speech recognition
        recognitionRef.current.start();
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
    const stopRecording = () => {
        if (recognitionRef.current) {
            // Stop the speech recognition and mark recording as complete
            recognitionRef.current.stop();
        }
    };

    // Toggle recording state and manage recording actions
    const handleToggleRecording = () => {
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
        }
        setIsRecording(!isRecording);
    };

    // Render the microphone component with appropriate UI based on recording state
    return (
        <div className="flex items-center justify-center h-screen w-full">
            <div className="w-full">
                {(isRecording || transcript) && (
                    <div>
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

                {isRecording ? (
                    // Button for stopping recording
                    <button
                        onClick={handleToggleRecording}
                        className="mt-10 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full w-20 h-20 focus:outline-none"
                    >
                        STOP
                    </button>
                ) : (
                    // Button for starting recording
                    <button
                        onClick={handleToggleRecording}
                        className="mt-10 m-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full w-20 h-20 focus:outline-none"
                    >
                        GO
                    </button>
                )}
            </div>
        </div >
    );
}