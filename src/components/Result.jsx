import React from 'react';

function Result({ title, score, interpretation, recommendation, isHighRisk, onNavigate, onRetry }) {
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
          <div style={{ backgroundColor: '#ffebee', padding: '1rem', borderRadius: '8px', marginBottom: '2rem', color: '#c62828', textAlign: 'left', border: '1px solid #ef9a9a' }}>
            <p><strong>⚠️ ข้อควรระวัง: </strong>หากมีความคิดทำร้ายตนเอง หรือรู้สึกไม่ปลอดภัย กรุณาติดต่อบุคลากรสาธารณสุขใกล้บ้าน หรือสายด่วนสุขภาพจิต 1323</p>
          </div>
        )}

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
