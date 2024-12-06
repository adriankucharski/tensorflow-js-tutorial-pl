"use client";
import React, { RefObject, useEffect, useRef, useState } from "react";
import styles from './page.module.css';
import Model from "@/model";

interface ImageUploadProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

interface ModelPredictionProps {
  model: Model;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ canvasRef }) => {
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (imageSrc && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = imageSrc as string;
      img.onload = () => {
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      };
    }
  }, [imageSrc, canvasRef]);

  return (
    <div className={styles.uloader}>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
    </div>
  );
};

const ModelPrediction: React.FC<ModelPredictionProps> = ({ model, canvasRef }) => {
  const [predictions, setPredictions] = useState<{ className: string, probability: number }[]>([]);

  const handlePredict = async () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const p = await model.predict(canvas);
      setPredictions(p);
    }
  };

  const highestProbability = Math.max(...predictions.map(p => p.probability));

  return (
    <div>
      <button onClick={handlePredict} className={styles.button}>Dokonaj predykcji</button>
      <div className={styles.predictionContainer}>
        {predictions.map((p, i) => (
          <div key={i} className={`${styles.predictionItem} ${p.probability === highestProbability ? styles.highestProbability : ''}`}>
            <span className={styles.className}>{p.className}</span>
            <span className={styles.probability}>{(p.probability * 100).toFixed(2)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}


export default function Home() {
  const modelUrl = "/classifier_model.tfjs/model.json"

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, _setModel] = useState<Model>(new Model(modelUrl));


  return (
    <div className={styles.container}>
      <h1>Udostępnij obraz</h1>
      <ImageUpload canvasRef={canvasRef} />

      <canvas
        ref={canvasRef}
        width={256}
        height={256}
        style={{ border: '1px solid black' }}
      />

      <ModelPrediction model={model} canvasRef={canvasRef} />
    </div>
  );
}
