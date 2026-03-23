'use client';

import Image from 'next/image';
import { useState, useEffect, useLayoutEffect, useRef, useCallback, startTransition } from 'react';
import { X, Check, AlertCircle, Loader2 } from 'lucide-react';

interface QRScannerProps {
  onScan: (token: string) => Promise<{ success: boolean; message: string }>;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
}

export function QRScanner({ onScan, onClose, eventTitle }: QRScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const processRef = useRef<() => void>(() => {});

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
      }
    } catch (error) {
      console.error('Camera error:', error);
      alert('No se pudo acceder a la cámara. Por favor usa el código manual.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  }, []);

  useEffect(() => {
    startTransition(() => {
      startCamera();
    });
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const scanQRCode = async (_: ImageData): Promise<string | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 100);
    });
  };

  const processQRCode = useCallback(async () => {
    if (!canvasRef.current || !videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      const code = await scanQRCode(imageData);
      
      if (code) {
        setLoading(true);
        const scanResult = await onScan(code);
        setResult(scanResult);
        setLoading(false);
      }
    } catch (error) {
      console.error('QR scan error:', error);
    }

    if (scanning) {
      requestAnimationFrame(processRef.current);
    }
  }, [onScan, scanning]);

  useLayoutEffect(() => {
    processRef.current = processQRCode;
  });

  const handleManualSubmit = async () => {
    if (!manualCode.trim()) return;

    setLoading(true);
    const scanResult = await onScan(manualCode);
    setResult(scanResult);
    setLoading(false);
  };

  useEffect(() => {
    if (scanning) {
      const interval = setInterval(processQRCode, 500);
      return () => clearInterval(interval);
    }
  }, [scanning, processQRCode]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold">Escanear QR</h2>
            <p className="text-white/70 text-sm">{eventTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-white rounded-2xl relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-500 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-indigo-500 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-indigo-500 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-500 rounded-br-lg" />
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {result && (
        <div className={`absolute bottom-0 left-0 right-0 p-6 ${
          result.success ? 'bg-green-600' : 'bg-red-600'
        }`}>
          <div className="flex items-center gap-3">
            {result.success ? (
              <Check className="w-8 h-8 text-white" />
            ) : (
              <AlertCircle className="w-8 h-8 text-white" />
            )}
            <div>
              <p className="text-white font-semibold">
                {result.success ? 'Check-in Exitoso' : 'Error'}
              </p>
              <p className="text-white/80">{result.message}</p>
            </div>
          </div>
          <button
            onClick={() => setResult(null)}
            className="mt-4 w-full py-3 bg-white rounded-xl font-semibold text-gray-900"
          >
            Continuar Escaneando
          </button>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            <span>Procesando...</span>
          </div>
        </div>
      )}

      <div className="bg-gray-900 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="text-gray-500 text-sm">o ingresa el código manualmente</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Código de boleto"
            className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 focus:border-indigo-500 focus:outline-none"
          />
          <button
            onClick={handleManualSubmit}
            disabled={loading || !manualCode.trim()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            Verificar
          </button>
        </div>
      </div>
    </div>
  );
}

interface QRDisplayProps {
  token: string;
  eventId: string;
  userId: string;
  eventTitle: string;
}

export function QRDisplay({ token, eventId, userId, eventTitle }: QRDisplayProps) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(token)}`;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
      <h3 className="font-semibold text-gray-900 mb-2">{eventTitle}</h3>
      <p className="text-sm text-gray-500 mb-4">Escanea este código en el evento</p>
      
      <div className="inline-block p-4 bg-white rounded-xl shadow-sm border border-gray-200">
        <Image src={qrUrl} alt="QR Code" width={192} height={192} unoptimized />
      </div>

      <div className="mt-4 text-xs text-gray-400">
        <p>ID: {eventId.slice(0, 8)}...</p>
        <p>Usuario: {userId.slice(0, 8)}...</p>
      </div>

      <button
        onClick={() => window.print()}
        className="mt-4 w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
      >
        Imprimir
      </button>
    </div>
  );
}
