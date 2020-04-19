import React, { useRef, useEffect } from 'react';
import music from './music.mp3';

const App = () => {
  const audioRef = useRef();
  const spectrumRef = useRef();
  const audioContextRef = useRef(new (window.AudioContext || window.webkitAudioContext)());

  useEffect(() => {
    const audio = audioRef.current;
    const spectrum = spectrumRef.current;
    const audioContext = audioContextRef.current;

    audio.addEventListener('play', () => audioContext.resume());

    // Responsive canvas
    const resizeCanvas = () => {
      spectrum.width = spectrum.clientWidth;
      spectrum.height = spectrum.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const analyser = audioContext.createAnalyser();
    const audioSource = audioContext.createMediaElementSource(audio);

    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);

    const spectrumContext = spectrum.getContext('2d');

    const renderFrame = () => {
      requestAnimationFrame(renderFrame);

      const freqData = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(freqData);

      spectrumContext.clearRect(0, 0, spectrum.width, spectrum.height);
      spectrumContext.fillStyle = spectrumContext.createLinearGradient(0, spectrum.height, 0, 0);
      spectrumContext.fillStyle.addColorStop(0, '#ff5370');
      spectrumContext.fillStyle.addColorStop(1, '#ff97b4');

      const barWidth = 20;
      const barMargin = 10;

      // calculate the number of bars
      let bars = Math.floor(spectrum.width / (barWidth + barMargin));
      if (spectrum.width % (barWidth + barMargin) >= barWidth) {
        bars += 1;
      }

      const heightMultiplier = spectrum.height / 235;

      for (let i = 0; i < bars; i++) {
        spectrumContext.fillRect(
          i * (barWidth + barMargin),
          spectrum.height,
          barWidth,
          -(freqData[i] * heightMultiplier),
        );
      }
    };

    renderFrame();
  }, [audioRef, spectrumRef]);

  return (
    <>
      <div>
        <audio ref={audioRef} src={music} autoPlay={false} loop={true} />
        <button
          onClick={() => {
            audioContextRef.current.resume();
            audioRef.current.play();
          }}
          style={{ zIndex: 1 }}>
          play da beat
        </button>
      </div>
      <canvas
        ref={spectrumRef}
        style={{
          width: '100%',
          height: 'calc(100vh - 100px)',
          position: 'absolute',
          bottom: 0,
          zIndex: 0,
        }}></canvas>
    </>
  );
};

export default App;
