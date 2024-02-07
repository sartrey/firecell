import { useEffect, useRef } from 'react';
import QRScanner from 'qr-scanner';

interface IProps {
  onChangeResult: (value: string) => void;
}

export default function useQRScanner({
  onChangeResult
}: IProps) {
  const refVideo = useRef<HTMLVideoElement>(null);
  const refScanner = useRef<any>(null);

  const startScanner = (): void => {
    if (!refVideo.current) { return; }
    const cache: { value: string; } = { value: '' };
    refScanner.current = new QRScanner(refVideo.current, result => {
      if (cache.value !== result.data) {
        cache.value = result.data;
        onChangeResult(result.data);
      }
    }, {});
    refScanner.current.start();
  };

  const closeScanner = (): void => {
    if (refScanner.current) {
      refScanner.current.stop();
      refScanner.current.destroy();
      refScanner.current = null;
    }
  };

  useEffect(() => {
    return () => {
      closeScanner();
    };
  }, [refScanner.current]);

  const renderVideo = (): React.ReactElement => {
    return (<video ref={refVideo} />);
  };

  return {
    renderVideo,
    startScanner,
    closeScanner
  };
}
