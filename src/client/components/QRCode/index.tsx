import React, { useEffect } from 'react';
import QR from 'qrcode';

interface IProps {
  value: string;
}

export default function QRCode({
  value
}: IProps): React.ReactElement {
  const refCanvas = React.useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    QR.toCanvas(refCanvas.current, value, error => {
      if (error) {
        console.error(error);
      }
    });    
  }, [value]);

  return (
    <canvas ref={refCanvas} />
  );
}