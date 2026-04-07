import React from 'react';
import './App.css';
import VideoList from './components/VideoList/VideoList';
import { VideosContextProvider } from './contexts/VideosContext/VideosContextProvider';
import AddVideoButton from './components/AddVideoButton/AddVideoButton';

export default function App() {
  return (
    <VideosContextProvider>
      <div className="App">
        <header className="App-header">
          <h1>VEED Video Library</h1>
          <AddVideoButton />
        </header>
        <main>
          <VideoList />
        </main>
      </div>
    </VideosContextProvider>
  );
}
