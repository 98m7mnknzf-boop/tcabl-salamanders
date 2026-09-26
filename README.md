# TCABL Salamanders Website

This is a ready-to-open static website starter for the Salamanders.

## Files
- `index.html` — page content
- `styles.css` — full responsive styling
- `script.js` — mobile menu + automatic copyright year

## How to preview
Double-click `index.html` and it will open in your browser.

## Before publishing
Replace these placeholders:
- `@YourHandle`
- `yourteamemail@example.com`

You can also add your official team logo and photos later. A good next version would add:
- Official Salamanders logo in the header
- Team photo / action photo hero background
- Full 2027 roster with positions and numbers
- Schedule / results page
- Player profile cards
- Sponsor section
- Instagram link
- Recruiting form
- Merch / uniforms gallery

## Easy hosting choices
This folder can be deployed to Netlify, Vercel, GitHub Pages, or any standard web host.

## V2 additions
- History tab/section
- Team achievements
- 2025 Coach of the Year recognition
- 2026 10-win improvement
- 2026 semifinal run
- All-Pro / All-Star history framework
- Interactive all-time record book
- Offensive leaders: Hits, HR, RBI, Runs, SB, Games Played
- Pitching leaders: Wins, Strikeouts, ERA, Innings, Saves, Appearances

The all-time leader values are intentionally blank until verified career totals are provided.

## V3 additions
- Official Salamanders script logos, mascot, and S logo integrated into the website
- 2026 GameChanger batting dataset created from the supplied screenshots
- 2026 season leader cards for AVG, OPS, Hits, HR, RBI, and Runs
- Expandable full 2026 batting table
- Data file: `stats-2026.json`
- Stat inclusion rule preserved: exclude players without jersey numbers; Noah Steele is the only exception
- All-time record book remains separate from single-season statistics until additional seasons are supplied

## V4 stat reset
- All previously entered GameChanger batting numbers were removed.
- Reason: the prior batch mixed 2026 playoffs with the 2026 regular season.
- Going forward, all incoming stats default to **2026 regular season** unless explicitly labeled otherwise.
- Regular-season and playoff data will be maintained as separate datasets.
- Player inclusion rule remains: exclude players without jersey numbers, except Noah Steele.

## V5 regular-season batting data
- Entered corrected 2026 regular-season GameChanger batting data
- Added Alex Gonzales (#13)
- Full main batting table
- Separate baserunning and situational stats table
- Leader cards now include stolen bases
- Postseason stats remain separate and are not included in this dataset

## V6 Noah Steele exception added
- Added Noah Steele to the 2026 regular-season stat book as the one approved no-jersey-number exception
- Noah Steele totals entered:
  - GP 2, PA 9, AB 8
  - AVG .375, OBP .444, OPS 1.194, SLG .750
  - H 3, 1B 1, 2B 1, 3B 1, HR 0
  - RBI 5, R 1, BB 1, SO 0
  - HBP 0, SAC 0, SF 0, ROE 0, FC 0
  - SB 2, SB% 100.00, CS 0, PIK 0

## V7 — 2025 regular-season hitting + all-time leaders
- Added complete 2025 regular-season hitting dataset from the supplied screenshots
- Andrew Molina is included as the approved unnumbered 2025 exception
- Other unnumbered 2025 players are excluded
- Corrected Noah Steele to jersey #27 in the 2026 dataset
- Added 2025/2026 season tabs on the Stats section
- Rebuilt the all-time record book using 2025 + 2026 regular-season totals only
- Postseason statistics remain excluded from regular-season and all-time regular-season totals

## V8 — 2026 postseason hitting
- Added a separate 2026 postseason hitting dataset
- 10 playoff hitters entered from the supplied GameChanger screenshots
- Team postseason totals: 4 G, 168 PA, 151 AB, .285 AVG, 43 H, 5 2B, 0 3B, 0 HR, 21 RBI, 24 R, 13 BB, 36 SO, 4 SB
- Added a dedicated "2026 Playoffs" stats tab
- Postseason numbers do not affect regular-season career/all-time leaderboards

## V9 — 2025 + 2026 regular-season pitching
- Added 2026 regular-season pitching dataset from GameChanger
- Added 2025 regular-season pitching dataset
- Applied the 2025 eligibility rule: Andrew Molina counts; other unnumbered pitchers are excluded
- Added Pitching navigation and season tabs
- Added pitching leader cards and full pitching/detail tables
- Added all-time regular-season pitching leaders using 2025 + 2026 only
- Postseason pitching remains separate and has not been added yet

## V10 — 2026 postseason pitching
- Added 2026 postseason pitching dataset
- Added 2026 Playoffs tab in the Pitching section
- Added postseason pitching leader cards and full/detail tables
- Postseason pitching remains excluded from all-time regular-season pitching leaders

## V11 — Achievements & All-Star history
- Added a featured 2025 Inaugural TCABL Coach of the Year section for Esteban Fernandez Jr.
- Emphasized that the 2025 award was the first Coach of the Year honor in TCABL history
- Added the official award graphic and award-presentation photo
- Added 2025 All-Star class: Jacob Garness, Jordan Goss, Matthew Swinkey, Tim Robertson, Andrew Molina, Esteban Fernandez Jr.
- Added 2026 All-Star class: Adrian Echeverri, Alex Gonzalez, Jordan Goss, Ryan Burnett, Sean Thornton
- Added disclaimer that stats shown on All-Star announcement graphics were snapshots at the time of selection, not final season totals

## V12 — 2025 TCABL weekly honors
- Added Jacob Garness as 2025 Week 1 Hitter of the Week
- Added Jacob Garness as 2025 Week 2 Hitter of the Week (back-to-back)
- Added Andrew Molina as 2025 Week 8 Hitter of the Week
- Added original award graphics to the History / Honors section
- Weekly award stat lines are treated as award-period snapshots only and do not alter season or career statistics

## V13 — 2026 monthly honors
- Added Ryan Burnett — May 2026 TCABL Hitter of the Month
- Documented the 2026 TCABL format change from weekly honors to monthly awards
- Award-period stats remain separate from official season/career statistics

## V14 — Homepage & navigation refresh
- Removed “2026 Semifinalists” from the homepage highlight strip
- Rebuilt the hero and streamlined primary navigation
- Added quick-launch cards for Team, Stat Book, History & Honors, and 2027
- Added a featured inaugural 2025 TCABL Coach of the Year homepage story
- Added responsive/mobile homepage styling

## V15 — 2026 roster & player cards
- Replaced the old placeholder roster with the confirmed 2026 roster
- Added 14 player cards with confirmed numbers, positions, pitching designations, minimal stat-informed bios, and documented achievements
- Added separate coaching staff cards for Esteban Fernandez Jr. #17 and Coach Chuck Burnett #0
- Esteban appears in both staff and player sections as requested
- Alex Gonzales #13 is listed with P as his primary position and SS / OF as secondary positions
- Corrected Jeff Buelow's full name throughout current 2026 datasets/site output
- Added roster-2026.json to make future roster updates easier

## V16 — launch-ready polish
- Polished the phone/tablet layout and mobile navigation
- Added accessible focus states, skip navigation and reduced-motion support
- Added active-section nav highlighting and a back-to-top button
- Improved mobile stat-table scrolling
- Removed fake Instagram/email placeholders from the public build
- Added favicon, Apple touch icon, social-share image and a web manifest
- Added robots.txt, .nojekyll, 404.html and Vercel configuration
- Player cards now use the official Salamanders S logo
- Empty award placeholders are hidden
- Changed the front-facing “Semifinal Run” label to “Playoff Run”
- This package is ready for GitHub Pages or Vercel deployment

### Recommended maintenance setup
GitHub should hold the master website files and Vercel should host the live site.
Future roster, award, stat, photo and schedule updates can then be pushed to the
same live site instead of creating a separate website each time.
