import { useEffect, useRef } from "react";

// Hook para manter a tela ativa enquanto o componente estiver montado
export function useWakeLock() {
  const wakeLockRef = useRef(null);

  useEffect(() => {
    let isActive = true;
    async function requestWakeLock() {
      try {
        if ("wakeLock" in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
          wakeLockRef.current.addEventListener("release", () => {
            if (isActive) {
              // Tenta reativar se for liberado inesperadamente
              requestWakeLock();
            }
          });
        }
      } catch (err) {
        // Silencia erros (ex: permissão negada, não suportado)
      }
    }
    requestWakeLock();
    return () => {
      isActive = false;
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
      }
    };
  }, []);
}
