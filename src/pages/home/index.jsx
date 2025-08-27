import { Select } from 'antd';
import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const selectOptions = [
  { value: 'eng', label: '영문' },
  { value: 'kor', label: '한글' },
  { value: 'eng+kor', label: '영문+한글' },
];

const Home = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('eng');
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setProgress(0);
    setText('');

    // Tesseract recognize
    Tesseract.recognize(file, lang, {
      logger: (m) => {
        // 진행률 표시
        if (m.status === 'recognizing text') {
          setProgress(Math.round(m.progress * 100));
        }
        console.log(m);
      },
      // 한글 인식 시 언어팩 경로 지정
      langPath: 'https://tessdata.projectnaptha.com/4.0.0_best',
    })
      .then(({ data: { text } }) => {
        setText(text);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>📷 OCR 데모</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <div style={{ margin: '10px 0', width: 150 }}>
        <Select
          style={{ width: '100px' }}
          options={selectOptions}
          value={lang}
          onSelect={(value) => setLang(value)}
        />
      </div>
      {loading && <p>인식 중... {progress}%</p>}
      <pre style={{ whiteSpace: 'pre-wrap' }}>{text}</pre>
    </div>
  );
};

export default Home;
