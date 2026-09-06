import { getStore } from '@netlify/blobs';
import { timingSafeEqual } from 'node:crypto';

const STORE_NAME = 'forma-private-data';
const REPORTS_KEY = 'artur/reports-v1';
const WEEK_PLAN_KEY = 'artur/week-plan-v1';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function safeEqual(a = '', b = '') {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return aa.length === bb.length && aa.length > 0 && timingSafeEqual(aa, bb);
}

function reportTime(report) {
  const t = Date.parse(report?.date || report?.updatedAt || '');
  return Number.isFinite(t) ? t : 0;
}

function mergeReports(cloud = [], incoming = []) {
  const map = new Map();
  for (const report of [...cloud, ...incoming]) {
    if (!report || !report.id) continue;
    const previous = map.get(report.id);
    if (!previous || reportTime(report) >= reportTime(previous)) map.set(report.id, report);
  }
  return [...map.values()].sort((a, b) => (a.year - b.year) || (a.cw - b.cw));
}

async function saveReports(store, reports) {
  await store.setJSON(REPORTS_KEY, reports, {
    metadata: { updatedAt: new Date().toISOString(), version: 1 },
  });
}

async function readWeekPlan(store) {
  try {
    const data = await store.get(WEEK_PLAN_KEY, { type: 'json', consistency: 'strong' });
    return data && Array.isArray(data.plan) ? data : null;
  } catch {
    return null;
  }
}

async function saveWeekPlan(store, weekPlan) {
  await store.setJSON(WEEK_PLAN_KEY, weekPlan, {
    metadata: { updatedAt: new Date().toISOString(), version: 1 },
  });
}

export default async (req) => {
  if (req.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);

  const expectedKey = process.env.FORMA_SYNC_KEY;
  if (!expectedKey) {
    return json({
      ok: false,
      error: 'Cloud sync is not configured. Add FORMA_SYNC_KEY in Netlify environment variables and redeploy.',
      code: 'NOT_CONFIGURED',
    }, 503);
  }

  const suppliedKey = req.headers.get('x-forma-sync-key') || '';
  if (!safeEqual(suppliedKey, expectedKey)) {
    return json({ ok: false, error: 'Invalid sync key', code: 'UNAUTHORIZED' }, 401);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const store = getStore(STORE_NAME);

  if (body.action === 'pull-week') {
    const weekPlan = await readWeekPlan(store);
    return json({ ok: true, weekPlan });
  }

  if (body.action === 'sync-week') {
    const incoming = body.weekPlan;
    if (!incoming || !Array.isArray(incoming.plan) || incoming.plan.length !== 7) {
      return json({ ok: false, error: 'Invalid week plan' }, 400);
    }
    const current = await readWeekPlan(store);
    const incomingTime = Date.parse(incoming.updatedAt || '') || 0;
    const currentTime = Date.parse(current?.updatedAt || '') || 0;
    const chosen = current && currentTime > incomingTime ? current : incoming;
    await saveWeekPlan(store, chosen);
    return json({ ok: true, weekPlan: chosen, syncedAt: new Date().toISOString() });
  }

  let cloudReports = [];
  try {
    cloudReports = (await store.get(REPORTS_KEY, { type: 'json', consistency: 'strong' })) || [];
    if (!Array.isArray(cloudReports)) cloudReports = [];
  } catch {
    cloudReports = [];
  }

  if (body.action === 'pull') {
    return json({ ok: true, reports: cloudReports, count: cloudReports.length });
  }

  if (body.action === 'sync') {
    const incoming = Array.isArray(body.reports) ? body.reports : [];
    const merged = mergeReports(cloudReports, incoming);
    await saveReports(store, merged);
    return json({ ok: true, reports: merged, count: merged.length, syncedAt: new Date().toISOString() });
  }

  if (body.action === 'delete') {
    const id = typeof body.id === 'string' ? body.id : '';
    if (!id) return json({ ok: false, error: 'Missing report id' }, 400);
    const next = cloudReports.filter((report) => report?.id !== id);
    await saveReports(store, next);
    return json({ ok: true, reports: next, count: next.length, deleted: id, syncedAt: new Date().toISOString() });
  }

  return json({ ok: false, error: 'Unknown action' }, 400);
};