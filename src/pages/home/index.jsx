import { Select } from 'antd';
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const selectOptions = [
  { value: 'kor', label: '한글' },
  { value: 'eng', label: '영문' },
];

const Home = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lang, setLang] = useState('eng');

  const preprocessImage = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      img.onload = () => {
        // Canvas 생성
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        // 리사이즈: 글씨가 작으면 2배 정도 늘림
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 흑백 변환 + 대비 강화
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          // 단순 grayscale
          const gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
          // 대비 조정
          const contrast = 1.2; // 1 = 원본, >1 = 대비 증가
          const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
          const c = factor * (gray - 128) + 128;
          data[i] = data[i + 1] = data[i + 2] = Math.min(255, Math.max(0, c));
        }
        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob((blob) => resolve(blob), 'image/png');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setProgress(0);
    setText('');

    const preprocessedFile = await preprocessImage(file);

    Tesseract.recognize(preprocessedFile, lang, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          setProgress(Math.round(m.progress * 100));
        }
        console.log(m);
      },
      langPath: 'https://tessdata.projectnaptha.com/4.0.0_best',
    })
      .then(({ data: { text } }) => setText(text))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📷 OCR 데모</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <Select options={selectOptions} value={lang} onSelect={(value) => setLang(value)} />
      {loading && <p>인식 중... {progress}%</p>}
      <pre style={{ whiteSpace: 'pre-wrap' }}>{text}</pre>
    </div>
  );
};

export default Home;
