// GenreClassifier.js
import React, { useState } from 'react';
// import * as tf from '@tensorflow/tfjs';
import './App.css';
import icon from'./assets/react.svg'
import singer from'./assets/singer.jpg'
const App = () => {
  const [model, setModel] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [genre, setGenre] = useState(null);

  const loadModel = async () => {
    const model = await tf.loadLayersModel('path_to_your_model/model.json');
    setModel(model);
  };

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const classifyGenre = async () => {
    if (!model) return; // Model not loaded yet

    const audio = new Audio(URL.createObjectURL(audioFile));
    audio.load();

    const context = new AudioContext();
    const src = context.createMediaElementSource(audio);
    const processor = context.createScriptProcessor(2048, 1, 1);

    src.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = async (e) => {
      const data = e.inputBuffer.getChannelData(0);
      const tensor = tf.tensor2d(data, [1, data.length]);
      const prediction = await model.predict(tensor);
      const genreIndex = tf.argMax(prediction, axis=1).dataSync()[0];
      const genreLabels = ['Blues', 'Classical', 'Country', 'Disco', 'HipHop', 'Jazz', 'Metal', 'Pop', 'Reggae', 'Rock'];
      setGenre(genreLabels[genreIndex]);
      tensor.dispose();
    };

    audio.play();
  };

  const knowMore = () =>{

  }

  return (
    <div className="genre-classifier">
      <h1>Online Song Genre Finder</h1>
      <div className='container'>
      <h2>Learn more about our song genre classification </h2>
     <p>Our Song Genre Classification tool is designed to automatically categorize songs into distinct musical styles or genres based on their audio features. Leveraging machine learning algorithms and a curated dataset, this tool provides users with an efficient and accurate means of identifying the genre of any given song.</p>
     {/* <button onClick={knowMore}>Know More</button><br/><br/> */}
     <label>Please Upload the song:</label>
     <input type="file" accept=".mp3,.wav" onChange={handleFileChange} /><br/><br/> 
     <button onClick={classifyGenre}>Find Genre</button>
      {genre && <p>Genre: {genre}</p>}
      </div>
    </div>
  );
};

export default App;

