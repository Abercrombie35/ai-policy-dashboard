* {
  box-sizing: border-box;
}

:root {
  font-family: Inter, 'Segoe UI', sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: #e5edf7;
  background: #071420;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html, body, #root {
  margin: 0;
  min-height: 100%;
  min-width: 100%;
  background:
    radial-gradient(circle at top, rgba(35, 94, 184, 0.35), transparent 40%),
    #071420;
}

body {
  min-height: 100vh;
}

button, select {
  font: inherit;
}

.page-shell {
  max-width: 1440px;
  margin: 0 auto;
  padding: 32px 24px 48px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #7bb5f8;
}

h1, h2, h3, h4, p {
  margin-top: 0;
}

h1 {
  margin-bottom: 0;
  font-size: clamp(2rem, 4vw, 3.2rem);
}

.topbar-actions {
  display: flex;
  gap: 12px;
}

.chip {
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 31, 45, 0.7);
  color: #dfeaf7;
  border-radius: 999px;
  padding: 10px 16px;
  cursor: pointer;
}

.chip.active {
  background: linear-gradient(135deg, #3d74ff, #67c8ff);
  color: white;
  border-color: transparent;
}

.summary-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 18px;
  margin-bottom: 24px;
}

.stat-box {
  background: rgba(12, 19, 31, 0.92);
  border: 1px solid rgba(153, 192, 255, 0.2);
  border-radius: 18px;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  color: #9eb7d7;
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.stat-box strong {
  font-size: clamp(1.5rem, 3vw, 2rem);
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(500px, 1.1fr) minmax(420px, 1.6fr);
  gap: 24px;
}

.map-panel, .detail-panel {
  background: rgba(10, 18, 28, 0.92);
  border: 1px solid rgba(147, 177, 216, 0.2);
  border-radius: 20px;
  padding: 18px;
}

.panel-head,
.detail-header,
.candidate-topline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
}

.panel-head select {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(22, 32, 44, 0.9);
  color: #edf5ff;
  border-radius: 10px;
  padding: 8px 10px;
}

.state-grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(11, minmax(24px, 1fr));
  grid-template-rows: repeat(8, minmax(20px, 1fr));
  gap: 6px;
  min-height: 520px;
  align-items: stretch;
}

.state-button {
  border: 1px solid rgba(149, 173, 208, 0.35);
  background: rgba(19, 31, 45, 0.9);
  color: #d5e6ff;
  border-radius: 8px;
  min-height: 28px;
  font-size: 0.65rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.state-button:hover {
  transform: translateY(-1px);
}

.state-button.selected {
  box-shadow: 0 0 0 2px rgba(102, 180, 255, 0.7);
  border-color: rgba(106, 177, 255, 0.8);
}

.state-button.d {
  background: rgba(73, 117, 255, 0.3);
}

.state-button.r {
  background: rgba(255, 107, 107, 0.2);
}

.detail-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.party-pill,
.mini-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.party-pill.dem,
.mini-badge.dem {
  background: rgba(54, 113, 228, 0.17);
  color: #7db0ff;
}

.party-pill.rep,
.mini-badge.rep {
  background: rgba(255, 99, 99, 0.12);
  color: #ff9a9a;
}

.section-block {
  background: rgba(16, 24, 36, 0.78);
  border: 1px solid rgba(159, 184, 230, 0.18);
  padding: 16px 18px;
  border-radius: 14px;
}

.section-block h3 {
  margin-bottom: 8px;
}

.candidate-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}

.candidate-card {
  background: rgba(16, 24, 36, 0.78);
  border: 1px solid rgba(159, 184, 230, 0.18);
  border-radius: 16px;
  padding: 18px;
}

.candidate-card h4 {
  margin-bottom: 8px;
  font-size: 1.3rem;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin: 16px 0;
}

.metric-grid label {
  display: block;
  color: #9bb3d4;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.metric-grid p {
  margin-bottom: 0;
  color: #e7effb;
}

blockquote {
  margin: 0;
  padding: 12px 14px;
  border-left: 3px solid #73b5ff;
  background: rgba(123, 181, 248, 0.06);
  border-radius: 0 10px 10px 0;
  color: #dfeaff;
  font-style: italic;
}

@media (max-width: 980px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .summary-row {
    grid-template-columns: 1fr;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 640px) {
  .page-shell {
    padding: 16px 14px 28px;
  }

  .metric-grid {
    grid-template-columns: 1fr;
  }

  .state-grid {
    min-height: 440px;
  }
}
