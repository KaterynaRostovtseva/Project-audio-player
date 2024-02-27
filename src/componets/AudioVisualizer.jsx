import React, { useEffect, useRef } from 'react';

const AudioVisualizer = ({ audio }) => {
    audio.crossOrigin = "anonymous";
    const canvasRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animationFrameRef = useRef(null);
    const mediaElementSourceRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;
        const barWidth = (WIDTH / 256) * 2.5;

        // Перевіряємо, чи є аудіо контекст і закриваємо його, якщо є
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        // Створюємо новий аудіо контекст і зберігаємо його в реф
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;
        // Створюємо аналізатор для аудіо
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = audioContext.createMediaElementSource(audio);//Створюємо джерело медіа елемента з аудіо

        //Перевіряємо, чи вже підключений елемент джерела медіа, і відключаємо його
        if (mediaElementSourceRef.current) {
            mediaElementSourceRef.current.disconnect();
        }
        // Підключаємо джерело до аналізатора та аудіо контексту
        source.connect(analyser);
        source.connect(audioContext.destination);
        mediaElementSourceRef.current = source;

        const renderFrame = () => {//функція для малювання візуалізації:
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            let x = 0;
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i];
                const r = barHeight + (25 * (i / bufferLength));
                const g = 250 * (i / bufferLength);
                const b = 50;
                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }

            animationFrameRef.current = requestAnimationFrame(renderFrame);
        };

        audio.addEventListener('play', () => {
            renderFrame();
        });

        audio.addEventListener('pause', () => {
            cancelAnimationFrame(animationFrameRef.current);
        });

        return () => {//відключаємо всі з'єднання та закриваємо аудіо контекст
            cancelAnimationFrame(animationFrameRef.current);
            source.disconnect();
            analyser.disconnect();
            audioContextRef.current.close();
        };
    }, [audio]);

    return (
        <div>
            <canvas ref={canvasRef} width={1200} height={200}></canvas>
        </div>
    );
};

export default AudioVisualizer;

