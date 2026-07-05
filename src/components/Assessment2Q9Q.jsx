import React, { useState, useEffect } from 'react';
import Result from './Result';
import { logUsage } from '../services/logger';

const questions2Q = [
  "1. ใน 2 สัปดาห์ที่ผ่านมา รวมวันนี้ ท่านรู้สึกหดหู่ เศร้า หรือท้อแท้สิ้นหวัง หรือไม่",
  "2. ใน 2 สัปดาห์ที่ผ่านมา รวมวันนี้ ท่านรู้สึกเบื่อ ทำอะไรก็ไม่เพลิดเพลิน หรือไม่"
];

const questions9Q = [
  "1. เบื่อ ทำอะไรก็ไม่เพลิดเพลิน",
  "2. ไม่สบายใจ ซึมเศร้า ท้อแท้",
  "3. หลับยาก หรือหลับๆ ตื่นๆ หรือหลับมากไป",
  "4. เหนื่อยง่าย หรือไม่ค่อยมีแรง",
  "5. เบื่ออาหาร หรือกินมากเกินไป",
  "6. รู้สึกไม่ดีกับตัวเอง คิดว่าตัวเองล้มเหลว หรือทำให้ครอบครัวผิดหวัง",
  "7. สมาธิไม่ดีเวลาทำอะไร เช่น ดูโทรทัศน์ หรือทำงานที่ต้องใช้ความตั้งใจ",
  "8. พูดช้า ทำอะไรช้าลง หรือกระสับกระส่ายไม่สามารถอยู่นิ่งได้",
  "9. คิดทำร้ายตนเอง หรือคิดว่าถ้าตายไปคงจะดี"
];

function Assessment2Q9Q({ onNavigate }) {
  const [step, setStep] = useState('2Q'); // '2Q', '9Q', 'RESULT'
  const [answers2Q, setAnswers2Q] = useState({});
  const [answers9Q, setAnswers9Q] = useState({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    logUsage('2Q-9Q');
    window.scrollTo(0, 0);
  }, []);

  const handle2QChange = (index, val) => {
    setAnswers2Q({ ...answers2Q, [index]: val });
  };

  const handle9QChange = (index, val) => {
    setAnswers9Q({ ...answers9Q, [index]: val });
  };

  const process2Q = () => {
    const hasRisk = answers2Q[0] === 1 || answers2Q[1] === 1;
    if (hasRisk) {
      setStep('9Q');
      window.scrollTo(0, 0);
    } else {
      setScore(0);
      setStep('RESULT');
      window.scrollTo(0, 0);
    }
  };

  const process9Q = () => {
    let total = 0;
    Object.values(answers9Q).forEach(val => {
      total += val;
    });
    setScore(total);
    setStep('RESULT');
    window.scrollTo(0, 0);
  };

  if (step === 'RESULT') {
    let interpretation = "";
    let recommendation = "";
    let isHighRisk = false;

    if (answers2Q[0] === 0 && answers2Q[1] === 0) {
      interpretation = "ปกติ (ไม่มีความเสี่ยงภาวะซึมเศร้า)";
    } else {
      if (score < 7) {
        interpretation = "ไม่มีอาการซึมเศร้า หรือมีอาการระดับปกติ";
      } else if (score <= 12) {
        interpretation = "มีภาวะซึมเศร้าระดับน้อย";
        recommendation = "ควรพักผ่อนและหากิจกรรมผ่อนคลาย หากไม่ดีขึ้นควรปรึกษาแพทย์";
      } else if (score <= 18) {
        interpretation = "มีภาวะซึมเศร้าระดับปานกลาง";
        recommendation = "ควรปรึกษาแพทย์หรือผู้เชี่ยวชาญด้านสุขภาพจิตเพื่อรับคำแนะนำ";
        isHighRisk = true;
      } else {
        interpretation = "มีภาวะซึมเศร้าระดับรุนแรง";
        recommendation = "ต้องพบแพทย์หรือบุคลากรทางสาธารณสุขโดยด่วน";
        isHighRisk = true;
      }
    }

    return (
      <Result 
        title="2Q/9Q คัดกรองซึมเศร้า" 
        score={answers2Q[0] === 0 && answers2Q[1] === 0 ? '-' : score}
        interpretation={interpretation}
        recommendation={recommendation}
        isHighRisk={isHighRisk}
        onNavigate={onNavigate}
        onRetry={() => { setStep('2Q'); setAnswers2Q({}); setAnswers9Q({}); window.scrollTo(0, 0); }}
      />
    );
  }

  if (step === '2Q') {
    const allAnswered = Object.keys(answers2Q).length === questions2Q.length;
    return (
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--color-depress-dark)', marginBottom: '0.5rem' }}>แบบประเมิน 2Q</h2>
          <p style={{ color: 'var(--text-muted)' }}>คำถาม 2 ข้อ เพื่อคัดกรองความเสี่ยงเบื้องต้น</p>
        </div>

        {questions2Q.map((q, index) => (
          <div key={index} className="question-container">
            <div className="question-text">{q}</div>
            <div className="options-group">
              <label className="option-label">
                <input type="radio" name={`2q-${index}`} checked={answers2Q[index] === 0} onChange={() => handle2QChange(index, 0)} />
                ไม่มี
              </label>
              <label className="option-label">
                <input type="radio" name={`2q-${index}`} checked={answers2Q[index] === 1} onChange={() => handle2QChange(index, 1)} />
                มี
              </label>
            </div>
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn" style={{ border: '1px solid var(--text-main)' }} onClick={() => onNavigate('home')}>ยกเลิก</button>
          <button className="btn btn-depress" onClick={process2Q} disabled={!allAnswered} style={{ opacity: allAnswered ? 1 : 0.5 }}>
            ถัดไป
          </button>
        </div>
      </div>
    );
  }

  // 9Q Step
  const all9QAnswered = Object.keys(answers9Q).length === questions9Q.length;
  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--color-depress-dark)', marginBottom: '0.5rem' }}>แบบประเมิน 9Q</h2>
        <p style={{ color: 'var(--text-muted)' }}>กรุณาเลือกคำตอบที่ตรงกับอาการของท่านในระยะเวลา 2 สัปดาห์ที่ผ่านมา</p>
      </div>

      {questions9Q.map((q, index) => (
        <div key={index} className="question-container">
          <div className="question-text">{q}</div>
          <div className="options-group">
            {[
              { label: 'ไม่มีเลย', val: 0 },
              { label: 'เป็นบางวัน', val: 1 },
              { label: 'เป็นบ่อย', val: 2 },
              { label: 'เป็นทุกวัน', val: 3 }
            ].map(opt => (
              <label key={opt.val} className="option-label">
                <input 
                  type="radio" 
                  name={`9q-${index}`} 
                  value={opt.val} 
                  checked={answers9Q[index] === opt.val}
                  onChange={() => handle9QChange(index, opt.val)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      ))}

      <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button className="btn" style={{ border: '1px solid var(--text-main)' }} onClick={() => setStep('2Q')}>ย้อนกลับ</button>
        <button className="btn btn-depress" onClick={process9Q} disabled={!all9QAnswered} style={{ opacity: all9QAnswered ? 1 : 0.5 }}>
          ประมวลผล
        </button>
      </div>
    </div>
  );
}

export default Assessment2Q9Q;
