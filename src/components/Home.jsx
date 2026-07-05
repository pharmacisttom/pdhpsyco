import React from 'react';
import '../index.css';
import logo from '../assets/pdh.jfif';

function Home({ onNavigate }) {
  return (
    <div className="container" style={{ maxWidth: '1200px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img src={logo} alt="PDH Logo" style={{ height: '70px', borderRadius: '12px', objectFit: 'cover' }} />
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '600' }}>แบบคัดกรองสุขภาพจิต</h1>
            <p style={{ color: 'var(--text-muted)' }}>เลือกแบบประเมินที่ต้องการทำ (ใช้เวลาสั้น • ข้อมูลไม่ถูกบันทึก • ใช้ได้บนมือถือ)</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          {/* Mock theme buttons just for aesthetics based on user image */}
          <span style={{ background: '#2d6a4f', color: 'white', padding: '0.2rem 0.8rem', borderRadius: '15px', fontSize: '0.8rem' }}>Evergreen Gold</span>
          <span style={{ background: '#e6f2eb', color: '#2d6a4f', padding: '0.2rem 0.8rem', borderRadius: '15px', fontSize: '0.8rem' }}>Mint Sage</span>
          <span style={{ background: '#faebe6', color: '#8f402b', padding: '0.2rem 0.8rem', borderRadius: '15px', fontSize: '0.8rem' }}>Blossom Playful</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        
        {/* 2Q-9Q Card */}
        <div className="card" style={{ backgroundColor: 'var(--color-depress-light)' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>2Q-9Q (Depression Assessment)</h3>
          <div style={{ border: '2px solid var(--color-depress-dark)', borderRadius: '12px', padding: '0.5rem 1rem', display: 'inline-block', width: 'fit-content', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-depress-dark)', fontWeight: '600' }}>คัดกรองซึมเศร้า</span>
          </div>
          <p style={{ marginBottom: '1.5rem', flexGrow: 1 }}>เริ่มจาก 2Q หากมีความเสี่ยง ต่อด้วย 9Q เพื่อประเมินระดับอาการ</p>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.6)', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem' }}>~3-6 นาที</span>
            <span style={{ background: 'rgba(255,255,255,0.6)', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem' }}>สมาร์ทโฟนได้</span>
          </div>
          
          <button className="btn" style={{ background: 'var(--color-depress-dark)', color: 'white', alignSelf: 'flex-start' }} onClick={() => onNavigate('2q9q')}>
            เริ่มทำ 2Q - 9Q
          </button>
        </div>

        {/* SPST-20 Card */}
        <div className="card" style={{ backgroundColor: 'var(--color-stress-light)' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>SPST-20 (Suanprung Stress Test)</h3>
          <div style={{ border: '2px solid var(--color-stress-dark)', borderRadius: '12px', padding: '0.5rem 1rem', display: 'inline-block', width: 'fit-content', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-stress-dark)', fontWeight: '600' }}>ประเมินความเครียด</span>
          </div>
          <p style={{ marginBottom: '1.5rem', flexGrow: 1 }}>ให้ระดับ "ไม่เครียด-มากที่สุด" ใน 20 ข้อ พร้อมคำนวณผลอัตโนมัติ</p>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.6)', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem' }}>~5 นาที</span>
            <span style={{ background: 'rgba(255,255,255,0.6)', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem' }}>ข้อความระดับ/ข้อ</span>
          </div>
          
          <button className="btn" style={{ background: 'var(--color-stress-dark)', color: 'white', alignSelf: 'flex-start' }} onClick={() => onNavigate('spst20')}>
            เริ่มทำ SPST-20
          </button>
        </div>

        {/* THI-15 Card */}
        <div className="card" style={{ backgroundColor: 'var(--color-happy-light)' }}>
          <h3 style={{ marginBottom: '1rem', fontWeight: '600' }}>THI-15 (Thai Happiness Indicators)</h3>
          <div style={{ border: '2px solid var(--color-happy-dark)', borderRadius: '12px', padding: '0.5rem 1rem', display: 'inline-block', width: 'fit-content', marginBottom: '1rem' }}>
            <span style={{ color: 'var(--color-happy-dark)', fontWeight: '600' }}>ดัชนีชี้วัดความสุข</span>
          </div>
          <p style={{ marginBottom: '1.5rem', flexGrow: 1 }}>เลือก "ไม่เลย-มากที่สุด" ใน 15 ข้อ พร้อมแปลผลและคำแนะนำ</p>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,0.6)', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem' }}>~3-4 นาที</span>
            <span style={{ background: 'rgba(255,255,255,0.6)', padding: '0.3rem 0.8rem', borderRadius: '12px', fontSize: '0.85rem' }}>ข้อความระดับ/ข้อ</span>
          </div>
          
          <button className="btn" style={{ background: 'var(--color-happy-dark)', color: 'white', alignSelf: 'flex-start' }} onClick={() => onNavigate('thi15')}>
            เริ่มทำ THI-15
          </button>
        </div>

      </div>

      <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        <p className="mb-2"><strong>หมายเหตุ:</strong> แบบประเมินนี้เป็นการคัดกรองเบื้องต้นเท่านั้น หากผลอยู่ในระดับเสี่ยง/รุนแรง ควรปรึกษาผู้เชี่ยวชาญ หรือสายด่วนสุขภาพจิต 1323</p>
        <p className="mb-1"><strong>แหล่งอ้างอิง</strong></p>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li>THI-15 - ดัชนีชี้วัดความสุขคนไทย — กรมสุขภาพจิต กระทรวงสาธารณสุข</li>
          <li>แบบคัดกรองซึมเศร้า 2Q-9Q — กรมสุขภาพจิต กระทรวงสาธารณสุข</li>
          <li>SPST-20 - แบบคัดกรองความเครียด — โรงพยาบาลสวนปรุง กรมสุขภาพจิต</li>
        </ul>
      </div>

    </div>
  );
}

export default Home;
