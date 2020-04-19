import React, { useRef, useEffect } from 'react';
import music from './Chelsea Loft Long.mp3';

const App = () => {
  const audioRef = useRef();
  const spectrumRef = useRef();

  useEffect(() => {
    const audio = audioRef.current;
    const spectrum = spectrumRef.current;

    // Responsive canvas
    const resizeCanvas = () => {
      spectrum.width = spectrum.clientWidth;
    };
    resizeCanvas();
    document.addEventListener('resize', resizeCanvas);

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const audioSource = audioContext.createMediaElementSource(audio);

    audioSource.connect(analyser);
    audioSource.connect(audioContext.destination);
    analyser.connect(audioContext.destination);

    const spectrumContext = spectrum.getContext('2d');

    const renderFrame = () => {
      const freqData = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(freqData);

      spectrumContext.clearRect(0, 0, spectrum.width, spectrum.height);
      spectrumContext.fillStyle = spectrumContext.createLinearGradient(0, 200, 0, 0);
      spectrumContext.fillStyle.addColorStop(0, '#FF4E50');
      spectrumContext.fillStyle.addColorStop(1, '#F9D423');

      const barWidth = 20;
      const barMargin = 10;
      const bars = Math.floor(spectrum.width / (barWidth + barMargin));

      for (let i = 0; i < bars; i++) {
        spectrumContext.fillRect(
          i * (barWidth + barMargin),
          spectrum.height,
          barWidth,
          -(freqData[i] / 2),
        );
      }

      requestAnimationFrame(renderFrame);
    };

    renderFrame();
  }, [audioRef, spectrumRef]);

  return (
    <>
      <div>
        <audio ref={audioRef} controls={true} src={music} />
      </div>
      <canvas ref={spectrumRef} style={{ width: '100%' }}></canvas>
    </>
  );
};

export default App;
