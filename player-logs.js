(() => {
  const roster = document.getElementById('roster');
  if (!roster) return;

  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

  const fmtDate = iso => new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', timeZone: 'UTC'
  }).format(new Date(`${iso}T00:00:00Z`));

  let archivePromise = null;

  const loadArchives = () => {
    if (!archivePromise) {
      archivePromise = Promise.all([
        fetch('results-2026.json').then(r => {
          if (!r.ok) throw new Error(`2026 archive HTTP ${r.status}`);
          return r.json();
        }),
        fetch('results-2025.json').then(r => {
          if (!r.ok) throw new Error(`2025 archive HTTP ${r.status}`);
          return r.json();
        })
      ]).then(([y2026, y2025]) => ({ y2026, y2025 }));
    }
    return archivePromise;
  };

  const findRow = (rows, name) =>
    Array.isArray(rows) ? rows.find(row => row.player === name) : null;

  const statLine = appearance => {
    const lines = [];
    if (appearance.bat) {
      const b = appearance.bat;
      lines.push(`<div class="game-log-statline"><span>BAT</span>${b.AB} AB · ${b.H} H · ${b.R} R · ${b.RBI} RBI · ${b.BB} BB · ${b.SO} SO</div>`);
    }
    if (appearance.pitch) {
      const p = appearance.pitch;
      lines.push(`<div class="game-log-statline"><span>PITCH</span>${escapeHtml(p.IP)} IP · ${p.H} H · ${p.R} R · ${p.ER} ER · ${p.BB} BB · ${p.SO} SO</div>`);
    }
    return lines.join('');
  };

  const collect = (data, year, playerName) => data.games
    .map(game => {
      const bat = findRow(game.batting, playerName);
      const pitch = findRow(game.pitching, playerName);
      if (!bat && !pitch) return null;
      return {
        year,
        seasonType: game.season_type || 'regular',
        date: game.date,
        opponent: game.opponent,
        homeAway: game.home_away,
        result: game.result,
        salamandersScore: game.salamanders_score,
        opponentScore: game.opponent_score,
        bat,
        pitch
      };
    })
    .filter(Boolean);

  const gameRow = appearance => {
    const where = appearance.homeAway === 'Home' ? 'vs' : 'at';
    const resultClass = appearance.result === 'W' ? 'win' : appearance.result === 'L' ? 'loss' : 'tie';
    return `<article class="player-game-row">
      <div class="player-game-head">
        <div>
          <strong>${fmtDate(appearance.date)} · ${where} ${escapeHtml(appearance.opponent)}</strong>
          <small>${appearance.year} · ${appearance.seasonType === 'postseason' ? 'Playoffs' : 'Regular Season'}</small>
        </div>
        <span class="player-game-result ${resultClass}">${appearance.result} ${appearance.salamandersScore}–${appearance.opponentScore}</span>
      </div>
      ${statLine(appearance)}
    </article>`;
  };

  const section = (label, appearances, extraClass = '') => {
    if (!appearances.length) return '';
    const sorted = [...appearances].sort((a,b) => b.date.localeCompare(a.date));
    return `<section class="player-game-season ${extraClass}">
      <div class="player-game-season-title">${label}<span>${sorted.length} ${sorted.length === 1 ? 'GAME' : 'GAMES'}</span></div>
      <div class="player-game-list">${sorted.map(gameRow).join('')}</div>
    </section>`;
  };

  const renderLog = (playerName, archives) => {
    const a26 = collect(archives.y2026, 2026, playerName);
    const a25 = collect(archives.y2025, 2025, playerName);

    const regular26 = a26.filter(a => a.seasonType === 'regular');
    const playoffs26 = a26.filter(a => a.seasonType === 'postseason');
    const regular25 = a25.filter(a => a.seasonType === 'regular');

    if (!regular26.length && !playoffs26.length && !regular25.length) {
      return `<div class="player-game-empty">No Salamanders game appearances recorded yet.</div>`;
    }

    const label26 = playerName === 'Noah Steele'
      ? '2026 Regular Season · Taxi Pool'
      : '2026 Regular Season';

    return [
      section(label26, regular26, playerName === 'Noah Steele' ? 'taxi-log' : ''),
      section('2026 Playoffs', playoffs26, 'playoff-log'),
      section('2025 Regular Season', regular25)
    ].join('');
  };

  roster.querySelectorAll('.roster-card').forEach(card => {
    const heading = card.querySelector('h3');
    const body = card.querySelector('.roster-card-body');
    if (!heading || !body) return;

    const playerName = heading.textContent.trim();
    if (body.querySelector('.player-game-log')) return;

    const details = document.createElement('details');
    details.className = 'player-game-log';
    details.innerHTML = `
      <summary>Game-by-Game Log</summary>
      <div class="player-game-log-body">
        <div class="player-game-loading">Open to load recorded appearances.</div>
      </div>`;

    const achievements = body.querySelector('.player-achievements');
    if (achievements) achievements.before(details);
    else body.append(details);

    details.addEventListener('toggle', () => {
      if (!details.open || details.dataset.loaded === 'true') return;
      const target = details.querySelector('.player-game-log-body');
      target.innerHTML = '<div class="player-game-loading">Loading game log…</div>';

      loadArchives()
        .then(archives => {
          target.innerHTML = renderLog(playerName, archives);
          details.dataset.loaded = 'true';
        })
        .catch(error => {
          console.error(`Game log failed for ${playerName}`, error);
          target.innerHTML = '<div class="player-game-empty">Game log could not be loaded. Please refresh and try again.</div>';
        });
    }, { passive: true });
  });
})();
