#!/usr/bin/env node
/**
 * Vérifie que data/events.json respecte le schéma avant tout sync ou deploy.
 * Utilisé par le CI — exit 1 si invalide.
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.resolve(__dirname, '../data/events.json');

const VALID_CATEGORIES = ['manifs', 'soirees', 'perma', 'bouffespop', 'confs'];
const REQUIRED_FIELDS = ['title', 'slug', 'startDate', 'organizer', 'category'];

let events;
try {
  events = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
} catch (e) {
  console.error(`❌ Impossible de lire ${DATA_FILE} : ${e.message}`);
  process.exit(1);
}

if (!Array.isArray(events)) {
  console.error('❌ data/events.json doit être un tableau JSON');
  process.exit(1);
}

const errors = [];

events.forEach((event, i) => {
  const label = `[${i}] "${event.title || 'sans titre'}"`;

  for (const field of REQUIRED_FIELDS) {
    if (!event[field]) {
      errors.push(`${label} → champ requis manquant : "${field}"`);
    }
  }

  if (event.category && !VALID_CATEGORIES.includes(event.category)) {
    errors.push(`${label} → catégorie invalide : "${event.category}" (valeurs: ${VALID_CATEGORIES.join(', ')})`);
  }

  if (event.startDate && isNaN(new Date(event.startDate).getTime())) {
    errors.push(`${label} → startDate invalide : "${event.startDate}"`);
  }
  if (event.endDate && isNaN(new Date(event.endDate).getTime())) {
    errors.push(`${label} → endDate invalide : "${event.endDate}"`);
  }

  if (event.startDate && event.endDate) {
    if (new Date(event.endDate) < new Date(event.startDate)) {
      errors.push(`${label} → endDate est avant startDate`);
    }
  }

});

const slugCount = {};
events.forEach(e => {
  if (e.slug) slugCount[e.slug] = (slugCount[e.slug] || 0) + 1;
});
Object.entries(slugCount)
  .filter(([, count]) => count > 1)
  .forEach(([slug]) => errors.push(`slug dupliqué : "${slug}"`));

if (errors.length) {
  console.error(`\n❌ ${errors.length} erreur(s) dans data/events.json :\n`);
  errors.forEach(e => console.error(`   • ${e}`));
  console.error('');
  process.exit(1);
}

console.log(`✔ data/events.json valide — ${events.length} events OK`);
