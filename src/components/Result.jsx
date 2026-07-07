import React, { useState } from 'react';
import { logContact } from '../services/logger';

function Result({ title, score, interpretation, recommendation, isHighRisk, onNavigate, onRetry }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePhoneSubmit = () => {
    if (!phone) return;
    logContact(title, name, phone, score, interpretation);
    setIsSubmitted(true);
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '2rem' }}>
      <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
        <h2 className="mb-2" style={{ color: 'var(--text-main)' }}>ผลการประเมิน {title}</h2>
        
        <div style={{ margin: '2rem 0' }}>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: isHighRisk ? '#e63946' : 'var(--text-main)' }}>
            {score !== null ? score : '-'}
          </div>
          <p style={{ fontSize: '1.2rem', fontWeight: '500', color: isHighRisk ? '#e63946' : 'var(--text-main)', marginTop: '0.5rem' }}>
            {interpretation}
          </p>
        </div>

        {recommendation && (
          <div style={{ backgroundColor: isHighRisk ? '#ffebee' : '#f0f8ff', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', color: isHighRisk ? '#c62828' : '#0277bd', textAlign: 'left' }}>
            <p><strong>คำแนะนำ: </strong>{recommendation}</p>
          </div>
        )}

        {isHighRisk && (
          <div style={{ backgroundColor: '#ffebee', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', color: '#c62828', textAlign: 'left', border: '1px solid #ef9a9a' }}>
            <p><strong>⚠️ ข้อควรระวัง: </strong>หากมีความคิดทำร้ายตนเอง หรือรู้สึกไม่ปลอดภัย กรุณาติดต่อบุคลากรสาธารณสุขใกล้บ้าน หรือสายด่วนสุขภาพจิต 1323</p>
          </div>
        )}

        <div style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #e0e0e0', textAlign: 'left' }}>
          <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>ให้เจ้าหน้าที่ติดต่อกลับ</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>หากคุณต้องการให้ผู้เชี่ยวชาญให้คำปรึกษาเพิ่มเติม สามารถทิ้งชื่อและเบอร์โทรศัพท์ไว้ได้ (ไม่บังคับ)<br/><span style={{color: 'var(--text-main)', fontWeight: '500'}}>ข้อมูลของคุณจะถูกเก็บเป็นความลับสูงสุด</span></p>
          
          {!isSubmitted ? (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', flexDirection: 'column' }}>
              <input 
                type="text" 
                placeholder="ชื่อเล่น หรือชื่อผู้ติดต่อ..." 
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
              />
              <input 
                type="tel" 
                placeholder="กรอกเบอร์โทรศัพท์..." 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #ccc', outline: 'none' }}
              />
              <button 
                onClick={handlePhoneSubmit}
                style={{ background: 'var(--text-main)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', alignSelf: 'flex-start' }}
              >
                ส่งข้อมูลติดต่อ
              </button>
            </div>
          ) : (
            <div style={{ padding: '0.8rem', backgroundColor: '#e6f2eb', color: '#2d6a4f', borderRadius: '8px', textAlign: 'center', fontWeight: '500' }}>
              ✓ ส่งข้อมูลเรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับไปครับ/ค่ะ
            </div>
          )}
        </div>

        <p className="mb-4" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          ผลนี้เป็นการคัดกรองเบื้องต้น ไม่ใช่การวินิจฉัยทางการแพทย์
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={onRetry}>ทำแบบประเมินใหม่</button>
          <button className="btn" style={{ border: '1px solid var(--text-main)' }} onClick={() => onNavigate('home')}>กลับหน้าแรก</button>
        </div>
      </div>
    </div>
  );
}

export default Result;
