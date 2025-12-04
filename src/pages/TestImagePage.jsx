import React from 'react';

function TestImage() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Image Load Test</h2>
      <img
        src="http://localhost:5000/assets/images/tokai-teio.png"
        alt="Test"
        style={{ maxWidth: '100%', height: 'auto' }}
        onError={(e) => {
          console.error('Image failed to load:', e.target.src);
          e.target.src = '/placeholder.png'; // fallback if needed
        }}
      />
    </div>
  );
}

export default TestImage;
