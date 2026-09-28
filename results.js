(() => {
  const list = document.getElementById('results-list');
  if (!list) return;

  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

  const formatDate = iso => new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC'
  }).format(new Date(`${iso}T00:00:00Z`));

  const lineScore = game => {
    const head = game.innings.map(i => `<th scope="col">${escapeHtml(i)}</th>`).join('');
    const rows = game.line_score.map(row => {
      const teamClass = row.abbr === 'SLMN' ? ' salamanders-line' : '';
      const innings = row.innings.map(v => `<td>${escapeHtml(v)}</td>`).join('');
      return `<tr class="${teamClass.trim()}"><th scope="row">${escapeHtml(row.abbr)}</th>${innings}<td class="total-col">${row.R}</td><td class="total-col">${row.H}</td><td class="total-col">${row.E}</td></tr>`;
    }).join('');
    return `<div class="game-table-wrap line-score-wrap"><table class="game-table line-score"><thead><tr><th scope="col">TEAM</th>${head}<th scope="col">R</th><th scope="col">H</th><th scope="col">E</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  };

  const battingTable = rows => `<div class="game-table-wrap"><table class="game-table box-table"><thead><tr><th>Player</th><th>AB</th><th>R</th><th>H</th><th>RBI</th><th>BB</th><th>SO</th></tr></thead><tbody>${rows.map(r => `<tr><td class="player-cell">${escapeHtml(r.player)}${r.number ? ` <span>#${r.number}</span>` : ''}${r.pos ? ` <small>${escapeHtml(r.pos)}</small>` : ''}</td><td>${r.AB}</td><td>${r.R}</td><td>${r.H}</td><td>${r.RBI}</td><td>${r.BB}</td><td>${r.SO}</td></tr>`).join('')}</tbody></table></div>`;

  const pitchingTable = rows => `<div class="game-table-wrap"><table class="game-table box-table"><thead><tr><th>Pitcher</th><th>IP</th><th>H</th><th>R</th><th>ER</th><th>BB</th><th>SO</th><th>HR</th></tr></thead><tbody>${rows.map(r => `<tr><td class="player-cell">${escapeHtml(r.player)}${r.number ? ` <span>#${r.number}</span>` : ''}</td><td>${escapeHtml(r.IP)}</td><td>${r.H}</td><td>${r.R}</td><td>${r.ER}</td><td>${r.BB}</td><td>${r.SO}</td><td>${r.HR}</td></tr>`).join('')}</tbody></table></div>`;

  const renderGame = game => {
    const where = game.home_away === 'Home' ? 'vs' : 'at';
    const playoff = game.season_type === 'postseason';
    const resultClass = game.result === 'W' ? 'win' : game.result === 'L' ? 'loss' : 'tie';
    const correction = game.correction_note ? `<div class="scoring-correction"><strong>Scoring correction:</strong> ${escapeHtml(game.correction_note.replace(/^Official Salamanders scoring correction:\s*/i, ''))}</div>` : '';
    return `<details class="game-card" data-season-type="${game.season_type}">
      <summary class="game-summary">
        <div class="game-result ${resultClass}">${game.result}</div>
        <div class="game-summary-main">
          <div class="game-date-row"><span>${formatDate(game.date)}</span>${playoff ? '<span class="playoff-badge">PLAYOFFS</span>' : '<span class="regular-badge">REGULAR</span>'}</div>
          <h3>${where} ${escapeHtml(game.opponent)}</h3>
          <div class="game-location">${escapeHtml(game.home_away)} · 2026</div>
        </div>
        <div class="game-final"><strong>${game.salamanders_score}–${game.opponent_score}</strong><span>View Box Score</span></div>
      </summary>
      <div class="game-details">
        <div class="boxscore-block"><div class="boxscore-heading"><span>LINE SCORE</span><strong>Salamanders ${game.salamanders_score}, ${escapeHtml(game.opponent)} ${game.opponent_score}</strong></div>${lineScore(game)}</div>
        ${correction}
        <div class="boxscore-grid">
          <section class="boxscore-block"><div class="boxscore-heading"><span>SALAMANDERS</span><strong>Batting</strong></div>${battingTable(game.batting)}</section>
          <section class="boxscore-block"><div class="boxscore-heading"><span>SALAMANDERS</span><strong>Pitching</strong></div>${pitchingTable(game.pitching)}</section>
        </div>
      </div>
    </details>`;
  };

  fetch('results-2026.json')
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      const games = [...data.games].sort((a,b) => b.date.localeCompare(a.date) || a.opponent.localeCompare(b.opponent));
      const regular = games.filter(g => g.season_type === 'regular').length;
      const postseason = games.filter(g => g.season_type === 'postseason').length;
      document.getElementById('regular-count').textContent = regular;
      document.getElementById('postseason-count').textContent = postseason;
      document.getElementById('total-count').textContent = games.length;
      list.innerHTML = games.map(renderGame).join('');

      const applyFilter = filter => {
        list.querySelectorAll('.game-card').forEach(card => {
          card.hidden = filter !== 'all' && card.dataset.seasonType !== filter;
        });
      };
      document.querySelectorAll('.results-filter').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.results-filter').forEach(b => {
            const active = b === btn;
            b.classList.toggle('active', active);
            b.setAttribute('aria-pressed', String(active));
          });
          applyFilter(btn.dataset.filter);
        });
      });
    })
    .catch(error => {
      console.error('Results archive failed to load', error);
      document.getElementById('results-error').hidden = false;
    });
})();
