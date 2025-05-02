import React, { useRef, useEffect, useState } from 'react';
import styles from './BackgroundVideo.module.css';
import gradientVideo from './video/gradient-video.mp4';
import { setupOptimizedBackgroundVideo, detectDevicePerformance } from '../utils/premiumPerformance';

function BackgroundVideo({ children }) {
  const videoRef = useRef(null);
  const [deviceInfo, setDeviceInfo] = useState(null);

  // Detectar capacidades do dispositivo no mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const info = detectDevicePerformance();
      setDeviceInfo(info);
    }
  }, []);

  // Setup de otimizações para vídeo de fundo
  useEffect(() => {
    if (!videoRef.current || !deviceInfo) return;
    
    // Configuração de otimização de vídeo com fallback para imagem em dispositivos de baixo desempenho
    const cleanupVideo = setupOptimizedBackgroundVideo(videoRef.current, {
      mobileFallbackImage: '/public/background-fallback.jpg', // Adicione uma imagem de fallback para dispositivos móveis
      lowBatteryFallback: true,
      autoplayWithMeta: true,
      unloadOutOfView: true
    });
    
    return () => {
      if (cleanupVideo) cleanupVideo();
    };
  }, [videoRef.current, deviceInfo]);

  // Se o dispositivo preferir redução de movimento, mostra uma imagem estática em vez de vídeo
  if (deviceInfo?.prefersReducedMotion || deviceInfo?.shouldReduceEffects) {
    return (
      <div className={styles.backgroundContainer}>
        <div className={`${styles.backgroundStatic} ${styles.fallbackBackground}`}></div>
        <div className={styles.contentOverlay}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.backgroundContainer}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline // Importante para iOS
        disablePictureInPicture // Previne modo PiP
        disableRemotePlayback // Previne casting
        className={styles.backgroundVideo}
        controlsList="nodownload nofullscreen noremoteplayback" // Remove controles
        onContextMenu={(e) => e.preventDefault()} // Previne menu de contexto
        preload="metadata" // Otimiza carregamento inicial
        data-premium-background="true" // Marcador para identificação por funções premium
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