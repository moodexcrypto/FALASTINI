// src/app/solidarity/page.tsx
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Heart, Info } from 'lucide-react';
import Image from 'next/image'; // Use next/image for placeholder
import { useLoading } from '@/context/LoadingContext'; // Import useLoading hook

// Default placeholder image
const defaultPlaceholder = '/placeholder-user.svg'; // Placeholder SVG path

export default function SolidarityPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { setLoading } = useLoading(); // Use global loading indicator

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLoading(true); // Start loading
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setGeneratedImage(null); // Reset generated image on new upload
        // Trigger canvas drawing after image is set
        setTimeout(() => drawImageWithBorder(e.target?.result as string), 50);
      };
      reader.onerror = () => {
        toast({ title: 'Error reading file', variant: 'destructive' });
        setLoading(false); // Stop loading on error
      };
      reader.readAsDataURL(file);
    }
  };

  const drawImageWithBorder = useCallback((imgSrc: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
       toast({ title: 'Canvas Error', description: 'Could not initialize canvas.', variant: 'destructive'});
       setLoading(false);
       return;
    }

    setIsGenerating(true);
    const image = new window.Image();
    image.src = imgSrc;

    image.onload = () => {
      const size = 300; // Canvas size
      const borderWidth = 15; // Border thickness
      const imageRadius = (size / 2) - borderWidth;
      const centerX = size / 2;
      const centerY = size / 2;

      canvas.width = size;
      canvas.height = size;

      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // --- Draw the flag border arcs ---
      const arcRadius = size / 2 - borderWidth / 2;
      ctx.lineWidth = borderWidth;

      // Define angles for each color segment (adjust as needed)
      const angles = {
        black: { start: -Math.PI / 2, end: 0 },              // Top right
        white: { start: 0, end: Math.PI / 2 },              // Bottom right
        green: { start: Math.PI / 2, end: Math.PI },        // Bottom left
        red:   { start: Math.PI, end: 3 * Math.PI / 2 }     // Top left
      };

      // Black arc
      ctx.beginPath();
      ctx.strokeStyle = '#000000'; // Black
      ctx.arc(centerX, centerY, arcRadius, angles.black.start, angles.black.end);
      ctx.stroke();

      // White arc
      ctx.beginPath();
      ctx.strokeStyle = '#FFFFFF'; // White
      ctx.arc(centerX, centerY, arcRadius, angles.white.start, angles.white.end);
      ctx.stroke();

      // Green arc
      ctx.beginPath();
      // Use HSL for green to match theme variable (approximation)
      ctx.strokeStyle = 'hsl(142.1, 76.2%, 36.3%)'; // Green (from primary color)
      ctx.arc(centerX, centerY, arcRadius, angles.green.start, angles.green.end);
      ctx.stroke();

      // Red arc
      ctx.beginPath();
      // Use HSL for red to match theme variable (approximation)
      ctx.strokeStyle = 'hsl(0, 72.2%, 50.6%)'; // Red (from accent color)
      ctx.arc(centerX, centerY, arcRadius, angles.red.start, angles.red.end);
      ctx.stroke();


      // --- Draw the circular profile image inside the border ---
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, imageRadius, 0, Math.PI * 2, true); // Clipping path
      ctx.closePath();
      ctx.clip();

      // Calculate aspect ratio and positioning to fill the circle
      const aspectRatio = image.width / image.height;
      let drawWidth = imageRadius * 2;
      let drawHeight = imageRadius * 2;
      let offsetX = 0;
      let offsetY = 0;

      if (aspectRatio > 1) { // Wider image
        drawHeight = drawWidth / aspectRatio;
        offsetY = (imageRadius * 2 - drawHeight) / 2;
      } else { // Taller image
        drawWidth = drawHeight * aspectRatio;
        offsetX = (imageRadius * 2 - drawWidth) / 2;
      }

      // Draw image centered within the clipping circle
      ctx.drawImage(image, centerX - imageRadius + offsetX, centerY - imageRadius + offsetY, drawWidth, drawHeight);

      ctx.restore(); // Restore context to remove clipping path

      // Store generated image data URL
      setGeneratedImage(canvas.toDataURL('image/png'));
      setIsGenerating(false);
      setLoading(false); // Stop loading after drawing
      toast({ title: 'Image Ready!', description: 'Your solidarity profile picture is generated.' });
    };

     image.onerror = () => {
       toast({ title: 'Image Load Error', description: 'Could not load the uploaded image.', variant: 'destructive' });
       setIsGenerating(false);
       setLoading(false); // Stop loading on error
     };
  }, [setLoading, toast]); // Add dependencies

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'solidarity_profile_picture.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast({ title: 'Image Downloaded!' });
    } else {
       toast({ title: 'No Image Generated', description: 'Please upload an image first.', variant: 'destructive' });
    }
  };

  // Trigger hidden file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <Card className="border-none shadow-none bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-primary" /> Show Solidarity PS
          </CardTitle>
          <CardDescription>
            Let's unite in our profile pictures to spotlight the cause. 🇵🇸
          </CardDescription>
           {/* Optional Guide Link */}
           {/* <a href="#" className="text-sm text-primary underline mt-1 block">Watch the step-by-step guide 👀</a> */}
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-6">
          {/* Hidden Canvas for processing */}
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

          {/* Image Display Area */}
          <div className="relative w-64 h-64 mx-auto">
            {/* Generated Image or Placeholder */}
            <Image
              src={generatedImage || defaultPlaceholder}
              alt="Profile picture preview"
              width={256}
              height={256}
              className="object-cover border-none" // Display the generated image or placeholder
              priority // Load placeholder faster initially
              data-ai-hint="profile placeholder"
            />
            {/* Loading Indicator */}
             {isGenerating && (
                 <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                 </div>
             )}
             {/* Show border preview only when an image is generated */}
            {!generatedImage && !isGenerating && selectedImage && (
                 <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                     Generating...
                 </div>
             )}
            {!selectedImage && !generatedImage && (
                 <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
                     <p className="text-xs text-muted-foreground">Upload an image</p>
                 </div>
            )}
          </div>


          {/* Hidden File Input */}
          <Input
            ref={fileInputRef}
            id="picture"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Upload Button */}
          <Button
            onClick={triggerFileInput}
            variant="outline"
            size="lg"
            className="w-full sm:w-auto btn-hover-glow-green border border-primary"
            disabled={isGenerating}
          >
            <Upload className="mr-2 h-5 w-5" />
            {selectedImage ? 'Change Image' : 'Upload Image'}
          </Button>

          {/* Download Button - Enabled only when generatedImage exists */}
          <Button
            onClick={handleDownload}
            variant="default"
            size="lg"
            className="w-full sm:w-auto btn-hover-glow-green"
            disabled={!generatedImage || isGenerating}
          >
            <Download className="mr-2 h-5 w-5" />
            Download Image
          </Button>

        </CardContent>
      </Card>

       {/* How it Works/Info Card */}
       <Card className="border-none shadow-none bg-card mt-6">
           <CardHeader className="p-4 pb-2">
               <CardTitle className="text-base font-bold flex items-center gap-2"><Info className="h-4 w-4 text-primary" /> How it Works</CardTitle>
           </CardHeader>
           <CardContent className="p-4 pt-0 text-sm text-muted-foreground space-y-1">
               <p>1. Upload your desired profile picture.</p>
               <p>2. The app automatically adds the solidarity border.</p>
               <p>3. Download the generated image and use it anywhere!</p>
               <p className="text-xs opacity-80 pt-2">Image processing happens locally in your browser. No images are stored on our servers.</p>
           </CardContent>
       </Card>
    </div>
  );
}
