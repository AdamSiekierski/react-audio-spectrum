import React, { useRef, useEffect } from 'react';
import music from './music.mp3';

const App = () => {
  const audioRef = useRef();
  const spectrumRef = useRef();
  const audioContext = useRef(new AudioContext());

  useEffect(() => {
    const audio = audioRef.current;
    const spectrum = spectrumRef.current;

    // Responsive canvas
    const resizeCanvas = () => {
      spectrum.width = spectrum.clientWidth;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const analyser = audioContext.current.createAnalyser();
    const audioSource = audioContext.current.createMediaElementSource(audio);

    audioSource.connect(analyser);
    audioSource.connect(audioContext.current.destination);

    const spectrumContext = spectrum.getContext('2d');

    const renderFrame = () => {
      const freqData = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(freqData);

      spectrumContext.clearRect(0, 0, spectrum.width, spectrum.height);
      spectrumContext.fillStyle = spectrumContext.createLinearGradient(0, 800, 0, 0);
      spectrumContext.fillStyle.addColorStop(0, '#ff5370');
      spectrumContext.fillStyle.addColorStop(1, '#ff97b4');

      const barWidth = 20;
      const barMargin = 10;

      // calculate the number of bars
      let bars = Math.floor(spectrum.width / (barWidth + barMargin));
      if (spectrum.width % (barWidth + barMargin) >= barWidth) {
        bars += 1;
      }

      for (let i = 0; i < bars; i++) {
        spectrumContext.fillRect(
          i * (barWidth + barMargin),
          spectrum.height,
          barWidth,
          -(freqData[i] * 1.8),
        );
      }

      requestAnimationFrame(renderFrame);
    };

    renderFrame();
  }, [audioRef, spectrumRef]);

  return (
    <>
      <div>
        <audio
          ref={audioRef}
          src={music}
          autoPlay={false}
          loop={true}
          controls={true}
          onPlay={() => audioContext.current.resume()}
        />
      </div>
      <canvas
        ref={spectrumRef}
        style={{ width: '100%', height: 800, position: 'absolute', bottom: 0 }}
        height="800"></canvas>
    </>
  );
};

export default App;
