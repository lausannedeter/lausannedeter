#!/usr/bin/env node
/**
 *
 * Uses:
 *   node scripts/sync-events-api.js push    
 *   node scripts/sync-events-api.js status 
 *
 * Requires env var:
 *   API_URL      
 *   SUPER_ADMIN_EMAIL
 *   SUPER_ADMIN_PASSWORD
 */

import fs from "fs";
import path from "path";

const API_URL = process.env.API_URL?.replace(/\/$/, '');
const EMAIL = process.env.SUPER_ADMIN_EMAIL;
const PASSWORD = process.env.SUPER_ADMIN_PASSWORD;
const DATA_FILE = path.resolve(__dirname, '../data/events.json');

if (!API_URL || !EMAIL || !PASSWORD) {
  console.error('❌ Variables manquantes : API_URL, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD');
  process.exit(1);
}


async function request(method, endpoint, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(`${method} ${endpoint} → HTTP ${res.status}: ${json.message}`);
  return json;
}


async function login() {
  const data = await request('POST', '/api/auth/login', { email: EMAIL, password: PASSWORD });
  console.log('✔ Authentifié en tant que super-admin');
  return data.token;
}


async function push() {
  const fileEvents = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  console.log(`📂 ${fileEvents.length} events dans data/events.json`);

  const token = await login();

  const { data: dbEvents } = await request('GET', '/api/events?limit=500', null, token);
  const dbBySlug = Object.fromEntries(dbEvents.map(e => [e.slug, e]));
  const fileSlugs = new Set(fileEvents.map(e => e.slug));

  let created = 0, updated = 0, deleted = 0, skipped = 0;

  for (const event of fileEvents) {
    const existing = dbBySlug[event.slug];
    try {
      if (!existing) {
        await request('POST', '/api/events', event, token);
        created++;
        console.log(`  + créé : ${event.slug}`);
      } else {
        const changed = ['title', 'description', 'startDate', 'endDate', 'organizer',
          'image', 'location', 'link', 'category', 'status'].some(
          k => String(event[k] ?? '') !== String(existing[k] ?? '')
        );
        if (changed) {
          await request('PUT', `/api/events/${existing._id}`, event, token);
          updated++;
          console.log(`  ~ mis à jour : ${event.slug}`);
        } else {
          skipped++;
        }
      }
    } catch (err) {
      console.error(`  ❌ Erreur sur "${event.slug}" : ${err.message}`);
    }
  }

  for (const dbEvent of dbEvents) {
    if (!fileSlugs.has(dbEvent.slug)) {
      try {
        await request('DELETE', `/api/events/${dbEvent._id}`, null, token);
        deleted++;
        console.log(`  - supprimé : ${dbEvent.slug}`);
      } catch (err) {
        console.error(`  ❌ Erreur suppression "${dbEvent.slug}" : ${err.message}`);
      }
    }
  }

  console.log(`\n✅ Push terminé : ${created} créés, ${updated} mis à jour, ${skipped} inchangés, ${deleted} supprimés.\n`);
}

async function status() {
  const fileEvents = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const token = await login();
  const { data: dbEvents, total } = await request('GET', '/api/events?limit=500', null, token);

  const dbSlugs = new Set(dbEvents.map(e => e.slug));
  const fileSlugs = new Set(fileEvents.map(e => e.slug));

  const onlyInFile = fileEvents.filter(e => !dbSlugs.has(e.slug)).map(e => e.slug);
  const onlyInDb = dbEvents.filter(e => !fileSlugs.has(e.slug)).map(e => e.slug);

  console.log(`\n📊 Statut`);
  console.log(`   Fichier : ${fileEvents.length} events`);
  console.log(`   DB      : ${total} events`);

  if (!onlyInFile.length && !onlyInDb.length) {
    console.log(`\n✅ Synchronisés.\n`);
  } else {
    console.log(`\n⚠️  Désynchronisés :`);
    if (onlyInFile.length) console.log(`   + Seulement dans fichier : ${onlyInFile.join(', ')}`);
    if (onlyInDb.length) console.log(`   + Seulement en DB        : ${onlyInDb.join(', ')}`);
    console.log('');
  }
}


const cmd = process.argv[2];

(async () => {
  try {
    if (cmd === 'push') await push();
    else if (cmd === 'status') await status();
    else {
      console.log('Usage: node scripts/sync-events-api.js [push|status]');
      process.exit(1);
    }
  } catch (err) {
    console.error(`\n❌ ${err.message}\n`);
    process.exit(1);
  }
})();
