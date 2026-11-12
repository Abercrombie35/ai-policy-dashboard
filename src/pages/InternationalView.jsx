import React from 'react';
import { elections, internationalNote } from '../lib/data';

const UNIT = { candidate: 'Candidates', 'party-manifesto': 'Party manifestos' };
const COVERAGE = { 'not-started': 'Not started', 'in-progress': 'In progress', complete: 'Complete' };

function InternationalView() {
  return (
    <div className="page">
      <header className="page-head">
        <h2>Elections outside the U.S.</h2>
        <p>
          A pilot to show that the framework works outside the U.S. (research question 5). It starts with France's
          presidential election, which compares candidates the same way the Senate races do. Parliamentary contests compare
          party manifestos instead.
        </p>
        <p className="fine-print">{internationalNote}</p>
      </header>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Country</th>
              <th scope="col">Election</th>
              <th scope="col">Date</th>
              <th scope="col">Unit of analysis</th>
              <th scope="col">Plan</th>
              <th scope="col">Coverage</th>
            </tr>
          </thead>
          <tbody>
            {elections.map((e) => (
              <tr key={e.id}>
                <th scope="row">{e.country}</th>
                <td>{e.type}</td>
                <td>
                  {e.dateText}{e.year && !e.dateText.includes(String(e.year)) ? `, ${e.year}` : ''}
                  {e.dateStatus === 'to-verify' && <span className="badge confidence-unverified small">To verify</span>}
                </td>
                <td>{UNIT[e.unit]}</td>
                <td>{e.plan}</td>
                <td>{COVERAGE[e.coverage] || e.coverage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="fine-print">Dates come from the project proposal and must be checked closer to each election.</p>
    </div>
  );
}

export default InternationalView;
