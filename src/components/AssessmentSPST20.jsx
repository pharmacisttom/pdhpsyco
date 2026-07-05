import React, { useState, useEffect } from 'react';
import Result from './Result';
import { logUsage } from '../services/logger';

const questions = [
  "1. ท่านกลัวทำงานผิดพลาด",
  "2. ท่านรู้สึกว่าไปถึงเป้าหมายที่วางไว้ไม่สำเร็จ",
  "3. ท่านรู้สึกว่าครอบครัวมีความขัดแย้งกัน",
  "4. ท่านรู้สึกว่าถูกละเลยหรือไม่ได้รับความสนใจ",
  "5. ท่านรู้สึกว่าไม่มีเวลาพักผ่อนเพียงพอ",
  "6. ท่านรู้สึกว่ารายได้ไม่พอกับรายจ่าย",
  "7. ท่านรู้สึกว่าต้องรับผิดชอบมากเกินไป",
  "8. ท่านรู้สึกว่าตนเองไม่มีความสามารถเพียงพอ",
  "9. ท่านรู้สึกว่าต้องทำอะไรหลายอย่างในเวลาเดียวกัน",
  "10. ท่านรู้สึกว่าเพื่อนร่วมงานไม่ให้ความร่วมมือ",
  "11. ท่านรู้สึกว่าต้องพึ่งพาผู้อื่นมากเกินไป",
  "12. ท่านรู้สึกว่าไม่สามารถแก้ไขปัญหาที่เกิดขึ้นได้",
  "13. ท่านรู้สึกว่าสุขภาพร่างกายไม่แข็งแรง",
  "14. ท่านรู้สึกว่ามีความกดดันจากสังคมรอบข้าง",
  "15. ท่านรู้สึกว่าชีวิตไม่มีความมั่นคง",
  "16. ท่านรู้สึกว่ามีเรื่องที่ต้องคิดอยู่ตลอดเวลา",
  "17. ท่านรู้สึกว่าตัวเองหงุดหงิดง่าย",
  "18. ท่านรู้สึกว่านอนหลับไม่สนิท",
  "19. ท่านรู้สึกว่าไม่อยากพบปะผู้คน",
  "20. ท่านรู้สึกเบื่อหน่ายกับชีวิตประจำวัน"
];

function AssessmentSPST20({ onNavigate }) {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    logUsage('SPST-20');
    window.scrollTo(0, 0);
  }, []);

  const handleOptionChange = (qIndex, value) => {
    setAnswers({ ...answers, [qIndex]: value });
  };

  const calculateScore = () => {
    let total = 0;
    Object.values(answers).forEach(val => {
      total += val;
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

    if (score <= 24) {
      interpretation = "เครียดน้อย (ระดับปกติ)";
    } else if (score <= 42) {
      interpretation = "เครียดปานกลาง";
      recommendation = "สามารถผ่อนคลายได้ด้วยการทำกิจกรรมที่ชอบ เช่น ออกกำลังกาย ฟังเพลง";
    } else if (score <= 62) {
      interpretation = "เครียดสูง";
      recommendation = "ควรหาทางแก้ไขปัญหา ฝึกหายใจคลายเครียด หรือปรึกษาผู้เชี่ยวชาญ";
      isHighRisk = true;
    } else {
      interpretation = "เครียดรุนแรง";
      recommendation = "ควรได้รับการช่วยเหลือหรือปรึกษาจากบุคลากรทางการแพทย์หรือผู้เชี่ยวชาญโดยเร็ว";
      isHighRisk = true;
    }

    return (
      <Result 
        title="SPST-20 ประเมินความเครียด" 
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
        <h2 style={{ color: 'var(--color-stress-dark)', marginBottom: '0.5rem' }}>แบบประเมินความเครียด SPST-20</h2>
        <p style={{ color: 'var(--text-muted)' }}>กรุณาเลือกระดับความเครียดที่เกิดขึ้นกับท่านในช่วง 6 เดือนที่ผ่านมา</p>
      </div>

      {questions.map((q, index) => (
        <div key={index} className="question-container">
          <div className="question-text">{q}</div>
          <div className="options-group">
            {[
              { label: 'ไม่เครียด', val: 1 },
              { label: 'เครียดเล็กน้อย', val: 2 },
              { label: 'ปานกลาง', val: 3 },
              { label: 'เครียดมาก', val: 4 },
              { label: 'มากที่สุด', val: 5 }
            ].map(opt => (
              <label key={opt.val} className="option-label">
                <input 
                  type="radio" 
                  name={`q-${index}`} 
                  value={opt.val} 
                  checked={answers[index] === opt.val}
                  onChange={() => handleOptionChange(index, opt.val)}
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
          className="btn btn-stress" 
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

export default AssessmentSPST20;
