import { useEffect, useRef, useState } from 'react';
import { usePDF } from '@react-pdf/renderer';
import * as pdfjsLib from 'pdfjs-dist';
import { Skeleton } from '@/components/ui/skeleton';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

type MobilePdfPreviewProps = {
  document: React.ReactElement;
};

export default function MobilePdfPreview({ document }: MobilePdfPreviewProps) {
  const [instance] = usePDF({ document });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    // Calculate scale based on the window width
    const calculateScale = () => {
      const windowWidth = window.innerWidth;
      const scaleFactor = windowWidth / 375; // Assume 375px as the base width for mobile screens
      setScale(scaleFactor); // Scale PDF proportionally
    };

    // Initial scale calculation
    calculateScale();

    // Recalculate scale on window resize
    const handleResize = () => {
      calculateScale();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Make sure the PDF is ready and the canvas is available
    if (!instance.url || !canvasRef.current) return;

    const renderPDF = async () => {
      const loadingTask = pdfjsLib.getDocument(instance.url!);
      const pdf = await loadingTask.promise;

      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current!;
      const context = canvas.getContext('2d')!;

      // Set canvas dimensions based on the viewport size
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Render the page on the canvas
      await page.render({ canvasContext: context, viewport }).promise;
    };

    renderPDF();
  }, [instance.url, scale]);

  if (instance.loading) {
    return <Skeleton className="w-full h-[500px]" />;
  }

  if (instance.error) {
    return <div>Something went wrong: {instance.error}</div>;
  }

  return (
    <div className="relative w-full h-[500px]">
      <canvas ref={canvasRef} className="w-full" />
    </div>
  );
}
