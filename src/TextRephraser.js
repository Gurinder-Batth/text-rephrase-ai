// src/TextRephraser.js

import React, { useState } from 'react';
import axios from 'axios';

const TextRephraser = () => {
    const [inputText, setInputText] = useState('');
    const [rephrasedText, setRephrasedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

    const handleRephrase = async (style) => {
        setLoading(true);
        setError('');

        const formattedInput = `Rephrase this text as ${style} give me only one response: ${inputText}`;

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBtDF3HuNEtyZEdJ3IwSqBLHaqhTmIwqOc`, // Replace with your API key
                {
                    contents: [
                        {
                            parts: [
                                {
                                    text: formattedInput,
                                },
                            ],
                        },
                    ],
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Extracting the rephrased text from the response
            const generatedContent = response.data.candidates[0].content.parts[0].text;
            setRephrasedText(generatedContent);
        } catch (err) {
            setError('Error rephrasing the text. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (rephrasedText) {
            navigator.clipboard.writeText(rephrasedText)
                .then(() => setCopySuccess('Copied to clipboard!'))
                .catch(() => setCopySuccess('Failed to copy!'));
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg mt-5">
            <h1 className="text-2xl font-bold mb-4 text-center">Text Rephraser</h1>
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to rephrase"
                rows="5"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="grid grid-cols-2 gap-2">
                {['Polite', 'Professional', 'Funny', 'Lazy', 'Respectful', 'Rude'].map((style) => (
                    <button
                        key={style}
                        onClick={() => handleRephrase(style)}
                        disabled={loading}
                        className={`py-2 px-4 rounded-md text-white transition duration-300 ${
                            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    >
                        {loading ? 'Rephrasing...' : `Rephrase ${style}`}
                    </button>
                ))}
            </div>
            {error && <p className="mt-4 text-red-500">{error}</p>}
            {rephrasedText && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold">Rephrased Text:</h2>
                    <p className="p-2 border rounded-md bg-gray-100">{rephrasedText}</p>
                    <button
                        onClick={handleCopy}
                        className="mt-2 py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                    >
                        Copy
                    </button>
                    {copySuccess && <p className="mt-2 text-green-500">{copySuccess}</p>}
                </div>
            )}
        <div className='mt-4'>
          <p className='mt-4'>Author: <a href="https://www.linkedin.com/in/gurinderpal-batth/" className='text-blue-500'> Gurinderpal Singh</a> , <a href="https://www.linkedin.com/in/mohit-singh-66b1441a4/" className='text-blue-500'>Mohit Singh</a> </p>
        </div>
        </div>
    );
};

export default TextRephraser;
