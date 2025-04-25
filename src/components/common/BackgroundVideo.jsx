import React from 'react';
import styles from './BackgroundVideo.module.css';
import gradientVideo from './video/gradient-video.mp4';

function BackgroundVideo({ children }) {
  return (
    <div className={styles.backgroundContainer}>
      <video
        autoPlay
        loop
        muted
        playsInline // Importante para iOS
        disablePictureInPicture // Previne modo PiP
        disableRemotePlayback // Previne casting
        className={styles.backgroundVideo}
        controlsList="nodownload nofullscreen noremoteplayback" // Remove controles
        onContextMenu={(e) => e.preventDefault()} // Previne menu de contexto
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