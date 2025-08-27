import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const Home = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    Tesseract.recognize(file, 'eng', {
      logger: (m) => console.log(m), // 진행 로그
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
      {loading && <p>인식 중...</p>}
      <pre style={{ whiteSpace: 'pre-wrap' }}>{text}</pre>
    </div>
  );
};

export default Home;
