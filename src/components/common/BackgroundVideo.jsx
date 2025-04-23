import React from 'react';
import styles from './BackgroundVideo.module.css';
import gradientVideo from '../assets/gradient-video.mp4';

function BackgroundVideo({ children }) {
  return (
    <div className={styles.backgroundContainer}>
      <video
        autoPlay
        loop
        muted
        className={styles.backgroundVideo}
      >
        <source src={gradientVideo} type="video/mp4" />
        Seu navegador não suporta vídeos.
      </video>
      <div className={styles.contentOverlay}>
        {children}
      </div>
    </div>
  );
}

export default BackgroundVideo;