import React, { useEffect, useState } from 'react';
import '../styles/KalshiMarket.css';

function KalshiMarket({ race, data }) {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKalshiMarkets = async () => {
      try {
        // TODO: Replace with actual Kalshi API endpoint
        // Format: https://trading-api.kalshi.com/v2/markets?q=Michigan+Senate
        // For now, we'll mock the data
        setMarketData({
          raceOutcome: {
            dem: { name: race.candidates[0].name, odds: 0.65, probability: '65%' },
            rep: { name: race.candidates[1].name, odds: 0.35, probability: '35%' },
          },
          milestones: [
            {
              title: 'Federal AI Licensing Framework passed by 2027",
              dem: '58%',
              rep: '22%',
            },
            {
              title: 'Labor-focused AI regulation passed by 2027',
              dem: '62%',
              rep: '18%',
            },
            {
              title: 'National security-focused AI regulation passed by 2027',
              dem: '45%',
              rep: '72%',
            },
          ],
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchKalshiMarkets();
  }, [race.id]);

  if (loading) return <div className="kalshi-market">Loading market data...</div>;
  if (error) return <div className="kalshi-market error">Error: {error}</div>;

  return (
    <div className="kalshi-market">
      <h3>Prediction Markets (Kalshi)</h3>
      <p className="disclaimer">
        These odds are derived from prediction markets and reflect the collective judgment
        of traders. They are forward-looking indicators of policy outcomes.
      </p>

      <div className="market-section">
        <h4>Race Outcome Odds</h4>
        <div className="odds-grid">
          <div className="odds-item dem">
            <div className="odds-candidate">{marketData.raceOutcome.dem.name}</div>
            <div className="odds-number">{marketData.raceOutcome.dem.probability}</div>
            <div className="odds-label">Democratic win</div>
          </div>
          <div className="odds-item rep">
            <div className="odds-candidate">{marketData.raceOutcome.rep.name}</div>
            <div className="odds-number">{marketData.raceOutcome.rep.probability}</div>
            <div className="odds-label">Republican win</div>
          </div>
        </div>
      </div>

      <div className="market-section">
        <h4>Policy Milestone Markets</h4>
        <p className="section-note">
          Markets predict the probability of specific AI policy milestones by candidate election outcome.
        </p>
        <div className="milestones-list">
          {marketData.milestones.map((milestone, idx) => (
            <div key={idx} className="milestone-row">
              <div className="milestone-title">{milestone.title}</div>
              <div className="milestone-odds">
                <span className="dem-odds">DEM: {milestone.dem}</span>
                <span className="rep-odds">REP: {milestone.rep}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="kalshi-footer">
        <a href="https://kalshi.com" target="_blank" rel="noopener noreferrer">
          View on Kalshi
        </a>
      </div>
    </div>
  );
}

export default KalshiMarket;
