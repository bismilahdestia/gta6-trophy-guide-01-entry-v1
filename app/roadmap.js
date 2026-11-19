// The road to the platinum: three stages, the 100% completion checklist and
// the warnings that protect a run. Built from the official descriptions and
// the launch guides (KeenGamer, Output Lag); numbers are the ones those
// guides report for the in-game 100% checklist.
export const ROADMAP = {
  heading: 'Roadmap to the platinum',
  intro: 'Vice Got a Price! needs the other 54 trophies, and the honest shape of the run is: finish the story, then grind the 100% checklist, then clean up the stranger strands and the one-offs. Launch guides put the whole run at roughly 200 hours — long, not hard. There are no difficulty trophies, no online trophies and no mission medals.',
  stages: [
    {
      title: 'Stage 1 — Play the story',
      time: '60–80 hours',
      covers: 'Covers: the 12 story trophies (chapters, the final mission, the named missions) and the possibly missable meditation.',
      lead: 'Chapters 1–4 and the final mission. Enjoy the campaign; no gold medals are needed in story missions.',
      steps: [
        'Complete the opening mission Gone Fishing, then play the chapters in order — Paradise Lost, T**s Ass Drug Money, Vice City, Baby!, Top Of The World, Ma, and the final mission.',
        'After the mission Down to Earth in Chapter 1, find Lucia at Jason\u2019s house in the morning, follow her to the balcony and accept the meditation. This is the one interaction guides flag as possibly missable — do it before Chapter 1 ends.',
        'Take the robbery introductions as they come: they open the activities the later stages need.',
        'Scan vehicles with the WAiNK app and study animals with binoculars whenever you meet something new — 200 base-model vehicles and 100 animal species feed the 100% checklist.',
        'Make a manual save at the start of every chapter. There is no mission replay, so a save is your only way back.',
      ],
    },
    {
      title: 'Stage 2 — Reach 100% completion',
      time: 'around 100 hours',
      covers: 'Covers: A Long Road and every trophy the 100% checklist touches — stunts, shooting range, races, drone trials, collectibles, robberies and money.',
      lead: 'After the story, open Progress, then Stats, then 100% Completion and work the checklist. Your earlier progress already counts.',
      steps: [
        'Robberies first: 39 gang operations, 22 bank jobs, 7 payday loan jobs and 8 bank vaults. The vaults unlock properly in Chapter 4, when the optional mission That\u2019s Where The Money Is\u2026 opens them up.',
        'Collectibles next: 15 of 18 card sets, 100 WAiNK scans, 33 underwater discoveries, 100 of 125 Cocaine Flamingos, 18 meditations (15 count for 100%, all 18 for the trophy).',
        'Activities last: 30 of 40 races won, all 42 shooting-range gold medals, all 42 drone time trials, 300 stunts, 70 of 80 challenges, all 15 of Bret\u2019s target decks.',
        'Don\u2019t stop at the trophy numbers: 250 stunts earns Cunning Stunts but 100% wants 300; 50 challenges earns One Last Thing but 100% wants 70; 3 card sets earns Don\u2019t Touch My Deck but 100% wants 15.',
        'Skip the 10 hardest challenges and the collectibles the checklist doesn\u2019t require — the list only asks for part of most categories.',
      ],
    },
    {
      title: 'Stage 3 — Strangers and clean-up',
      time: '10–20 hours',
      covers: 'Covers: Strangers & Freaks, the five character-final trophies, Bret\u2019s hunt, and the one-off trophies.',
      lead: 'With 100% done, check the trophy list for what is left: mostly character questlines and one-off trophies.',
      steps: [
        'Finish the final missions for Andy, Kenton, Billy, Randy and Tyrone, and hunt Bret\u2019s unique animal.',
        'Complete 8 stranger mission strands across Leonida — there are more strands than needed, so skip the ones you don\u2019t like.',
        'Finish the remaining meditation spots for Positive Mental Attitude, then the combat, driving and money trophies.',
        'Check the list once more: when the last trophy pops, Vice Got a Price! follows with it.',
      ],
    },
  ],
  checklist: [
    ['Story', 'All chapters finished', '—'],
    ['Optional tasks', '100 completed', '100'],
    ['Gang operations', '39 of 39', '39'],
    ['Bank jobs', '22 of 22', '22'],
    ['Payday loan jobs', '7 of 7', '7'],
    ['Bank vaults', '8 of 8', '8'],
    ['Marked Bills fenced', '$250,000', '$250,000'],
    ['Card sets', '15 of 18', '15'],
    ['WAiNK locations', '100 scans', '100'],
    ['Underwater discoveries', '33 of 33', '33'],
    ['Cocaine Flamingos', '100 of 125', '100'],
    ['Meditations', '15 of 18', '15'],
    ['Base-model vehicles', '200 of 277', '200'],
    ['Animals studied', '100 of 255', '100'],
    ['Races won', '30 of 40', '30'],
    ['Shooting-range golds', '42 of 42', '42'],
    ['Drone time trials', '42 of 42', '42'],
    ['Stunts', '300 of 397', '300'],
    ['Challenges', '70 of 80', '70'],
    ['Bret\u2019s target decks', '15 of 15', '15'],
  ],
  warnings: [
    'No mission replay and no New Game Plus: keep manual saves at the start of every chapter (15 save slots).',
    'One possibly missable trophy: Positive Mental Attitude. The Chapter 1 balcony meditation with Lucia can disappear after Chapter 1 — do it in Stage 1.',
    'Cheats disable trophies and saving while active (PowerPyx, via Planet GTA 6). Don\u2019t turn one on in a trophy run.',
    'No online trophies: all 55 unlock in single player, so no co-op or multiplayer is ever required.',
    'Five trophies have no confirmed method at launch (In The Beginning\u2026, Capital Offense, Bad Luck, I Guess, The Truth Is Out There, Ten Pin) — this guide says so in their entries instead of guessing.',
  ],
};

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

export function renderRoadmap(container) {
  container.replaceChildren();
  container.append(el('h2', null, ROADMAP.heading));
  container.append(el('p', 'roadmap-intro', ROADMAP.intro));

  for (const stage of ROADMAP.stages) {
    const card = el('section', 'stage');
    const title = el('h3', null, stage.title + ' ');
    title.append(el('span', 'stage-time', `· ${stage.time}`));
    card.append(title);
    card.append(el('p', null, stage.lead));
    if (stage.covers) card.append(el('p', null, stage.covers));
    const list = document.createElement('ol');
    for (const step of stage.steps) {
      const item = document.createElement('li');
      item.textContent = step;
      list.append(item);
    }
    card.append(list);
    container.append(card);
  }

  const tableCard = el('section', 'stage');
  tableCard.append(el('h3', null, 'The 100% completion checklist (A Long Road)'));
  tableCard.append(el('p', null, 'The numbers the in-game checklist asks for, as the launch guides report them. Trophy thresholds are lower in several rows — the table shows the 100% figure.'));
  const table = el('table', 'check-table');
  const head = document.createElement('tr');
  for (const label of ['What', 'Needed', 'Count']) head.append(el('th', null, label));
  table.append(head);
  for (const [what, needed, count] of ROADMAP.checklist) {
    const row = document.createElement('tr');
    row.append(el('td', null, what));
    row.append(el('td', null, needed));
    row.append(el('td', null, count));
    table.append(row);
  }
  tableCard.append(table);
  container.append(tableCard);

  const warn = el('section', 'warn-box');
  warn.append(el('h3', null, 'Before you start — read this'));
  const list = document.createElement('ul');
  for (const item of ROADMAP.warnings) {
    const li = document.createElement('li');
    li.textContent = item;
    list.append(li);
  }
  warn.append(list);
  container.append(warn);

  const note = el('p', 'roadmap-intro', 'Sources for the roadmap: KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap; Output Lag — GTA 6 Trophy List; Planet GTA 6 — trophy list (Exophase / PSNProfiles).');
  container.append(note);
}
