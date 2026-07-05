import React, { useState, useEffect } from 'react';
import Result from './Result';
import { logUsage } from '../services/logger';

const questions = [
  { id: 1, text: "1. ท่านรู้สึกพึงพอใจในชีวิต", reverse: false },
  { id: 2, text: "2. ท่านรู้สึกผ่อนคลาย", reverse: false },
  { id: 3, text: "3. ท่านรู้สึกเบื่อหน่ายท้อแท้", reverse: true },
  { id: 4, text: "4. ท่านรู้สึกตึงเครียด", reverse: true },
  { id: 5, text: "5. ท่านมีความกังวลใจ", reverse: true },
  { id: 6, text: "6. ท่านมีความสุขกับการดำเนินชีวิต", reverse: false },
  { id: 7, text: "7. ท่านสามารถทำใจยอมรับกับปัญหาที่เกิดขึ้นได้", reverse: false },
  { id: 8, text: "8. ท่านมีกำลังใจในการดำเนินชีวิต", reverse: false },
  { id: 9, text: "9. ท่านสามารถควบคุมอารมณ์ได้เมื่อมีเหตุการณ์ที่ทำให้ไม่สบายใจ", reverse: false },
  { id: 10, text: "10. ท่านรู้สึกมั่นคงปลอดภัยในชีวิต", reverse: false },
  { id: 11, text: "11. ท่านรู้สึกภาคภูมิใจในตนเอง", reverse: false },
  { id: 12, text: "12. ท่านรู้สึกว่าตนเองมีคุณค่า", reverse: false },
  { id: 13, text: "13. ท่านมีความสัมพันธ์ที่ดีกับบุคคลอื่น", reverse: false },
  { id: 14, text: "14. ท่านได้รับการยอมรับจากคนรอบข้าง", reverse: false },
  { id: 15, text: "15. ท่านได้รับความช่วยเหลือจากผู้อื่นเมื่อต้องการ", reverse: false }
];

function AssessmentTHI15({ onNavigate }) {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    logUsage('THI-15');
    window.scrollTo(0, 0);
  }, []);

  const handleOptionChange = (qId, value) => {
    setAnswers({ ...answers, [qId]: value });
  };

  const calculateScore = () => {
    let total = 0;
    questions.forEach(q => {
      const val = answers[q.id];
      if (val !== undefined) {
        if (q.reverse) {
          total += (3 - val);
        } else {
          total += val;
        }
      }
    });
    setScore(total);
    setShowResult(true);
    window.scrollTo(0, 0);
  };

  const allAnswered = Object.keys(answers).length === questions.length;

  if (showResult) {
    let interpretation = "";
    let recommendation = "";
    let isHighRisk = false;

    if (score >= 33) {
      interpretation = "สุขภาพจิตดีกว่าคนทั่วไป (มีความสุขมากกว่าคนทั่วไป)";
    } else if (score >= 27) {
      interpretation = "สุขภาพจิตเท่ากับคนทั่วไป (มีความสุขเท่ากับคนทั่วไป)";
    } else {
      interpretation = "สุขภาพจิตต่ำกว่าคนทั่วไป (มีความสุขน้อยกว่าคนทั่วไป)";
      recommendation = "ควรหาเวลาพักผ่อน ทำกิจกรรมที่ชอบ หรือพูดคุยกับคนที่ไว้วางใจ";
      isHighRisk = true; // For THI-15, low score means risk
    }

    return (
      <Result 
        title="THI-15 ดัชนีชี้วัดความสุข" 
        score={score}
        interpretation={interpretation}
        recommendation={recommendation}
        isHighRisk={isHighRisk}
        onNavigate={onNavigate}
        onRetry={() => { setAnswers({}); setShowResult(false); window.scrollTo(0, 0); }}
      />
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--color-happy-dark)', marginBottom: '0.5rem' }}>แบบประเมิน THI-15</h2>
        <p style={{ color: 'var(--text-muted)' }}>กรุณาเลือกคำตอบที่ตรงกับความรู้สึกของท่านในช่วง 1 เดือนที่ผ่านมา</p>
      </div>

      {questions.map((q) => (
        <div key={q.id} className="question-container">
          <div className="question-text">{q.text}</div>
          <div className="options-group">
            {[
              { label: 'ไม่เลย', val: 0 },
              { label: 'เล็กน้อย', val: 1 },
              { label: 'มาก', val: 2 },
              { label: 'มากที่สุด', val: 3 }
            ].map(opt => (
              <label key={opt.val} className="option-label">
                <input 
                  type="radio" 
                  name={`q-${q.id}`} 
                  value={opt.val} 
                  checked={answers[q.id] === opt.val}
                  onChange={() => handleOptionChange(q.id, opt.val)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      ))}

      <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button className="btn" style={{ border: '1px solid var(--text-main)' }} onClick={() => onNavigate('home')}>ยกเลิก</button>
        <button 
          className="btn btn-happy" 
          onClick={calculateScore} 
          disabled={!allAnswered}
          style={{ opacity: allAnswered ? 1 : 0.5, cursor: allAnswered ? 'pointer' : 'not-allowed' }}
        >
          ประมวลผล
        </button>
      </div>
    </div>
  );
}

export default AssessmentTHI15;
