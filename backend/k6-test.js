/**
 * k6 Load & Functional Test Suite
 * IPI Smart Academic System — Backend API
 *
 * Run:  k6 run k6-test.js
 * Docs: https://k6.io/docs/
 */

import { check, group, sleep } from "k6";
import http from "k6/http";
import { Rate, Trend } from "k6/metrics";

// ─── Configuration ────────────────────────────────────────────────────────────

const BASE_URL = "http://localhost:3001/api";

// Admin credentials (hardcoded in backend via env vars — always works)
const ADMIN_EMAIL = "admin@ipi.com";
const ADMIN_PASSWORD = "admin123";

// Student/Professor — update to match your seeded database
const STUDENT_EMAIL = "amar@amar.com";
const PROFESSOR_ID = 1;

// ─── Custom Metrics ───────────────────────────────────────────────────────────

const failedChecks = new Rate("failed_checks");
const adminLoginDuration = new Trend("admin_login_ms", true);
const dbReadDuration = new Trend("db_read_ms", true);

// ─── Load Profile ─────────────────────────────────────────────────────────────

export const options = {
  stages: [
    { duration: "10s", target: 5 }, // ramp up
    { duration: "20s", target: 10 }, // sustained load
    { duration: "10s", target: 0 }, // ramp down
  ],
  thresholds: {
    // 95% of all requests must finish under 500ms
    http_req_duration: ["p(95)<500"],
    // Admin login (env-var check only, no DB) must be under 100ms
    admin_login_ms: ["p(95)<100"],
    // DB read operations must be under 500ms p95 (Prisma Accelerate remote latency)
    db_read_ms: ["p(95)<500"],
    // Less than 10% of checks should fail
    failed_checks: ["rate<0.10"],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const JSON_HEADERS = { "Content-Type": "application/json" };

function post(path, body) {
  return http.post(`${BASE_URL}${path}`, JSON.stringify(body), {
    headers: JSON_HEADERS,
  });
}

function get(path) {
  return http.get(`${BASE_URL}${path}`);
}

// Returns true if response status is one of the allowed codes
function statusOk(r) {
  return r.status === 200 || r.status === 404;
}

// ─── Main Test Scenario ───────────────────────────────────────────────────────

export default function () {
  // ── 1. Health Check ─────────────────────────────────────────────────────────
  group("Health Check", () => {
    const res = get("/health");
    const ok = check(res, {
      "health: status 200": (r) => r.status === 200,
      "health: body status OK": (r) => {
        try {
          return JSON.parse(r.body).status === "OK";
        } catch {
          return false;
        }
      },
    });
    failedChecks.add(!ok);
  });

  sleep(0.3);

  // ── 2. Auth — Admin Login ────────────────────────────────────────────────────
  group("Auth — Admin Login", () => {
    // Admin login bypasses DB (env var check only) — should always be 200
    const adminRes = post("/auth/login", {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    adminLoginDuration.add(adminRes.timings.duration);

    const ok = check(adminRes, {
      "admin login: status 200": (r) => r.status === 200,
      "admin login: userType ADMIN": (r) => {
        try {
          const b = JSON.parse(r.body);
          return b.data?.userType === "ADMIN" || b.userType === "ADMIN";
        } catch {
          return false;
        }
      },
    });
    failedChecks.add(!ok);
  });

  sleep(0.3);

  // ── 3. Auth — Reject Invalid Credentials ────────────────────────────────────
  group("Auth — Reject Invalid Login", () => {
    const badRes = post("/auth/login", {
      email: "nobody@fake.com",
      password: "wrongpass",
    });

    const ok = check(badRes, {
      "invalid login correctly rejected": (r) => {
        if (r.status === 401 || r.status === 400 || r.status === 403)
          return true;
        try {
          return JSON.parse(r.body).data === null;
        } catch {
          return false;
        }
      },
    });
    failedChecks.add(!ok);
  });

  sleep(0.3);

  // ── 4. Students API ──────────────────────────────────────────────────────────
  group("Students API", () => {
    const listRes = get("/students");
    dbReadDuration.add(listRes.timings.duration);
    const listOk = check(listRes, {
      "GET /students: status 200": (r) => r.status === 200,
      "GET /students: returns array": (r) => {
        try {
          const b = JSON.parse(r.body);
          return Array.isArray(b) || Array.isArray(b.data);
        } catch {
          return false;
        }
      },
    });
    failedChecks.add(!listOk);

    const byIdRes = get("/students/1");
    const byIdOk = check(byIdRes, {
      "GET /students/1: 200 or 404": (r) => statusOk(r),
    });
    failedChecks.add(!byIdOk);

    const progRes = get(`/students/progress/${STUDENT_EMAIL}`);
    dbReadDuration.add(progRes.timings.duration);
    const progOk = check(progRes, {
      "GET /students/progress: 200 or 404": (r) => statusOk(r),
    });
    failedChecks.add(!progOk);

    const gradesRes = get(`/students/grades/${STUDENT_EMAIL}`);
    const gradesOk = check(gradesRes, {
      "GET /students/grades: 200 or 404": (r) => statusOk(r),
    });
    failedChecks.add(!gradesOk);
  });

  sleep(0.3);

  // ── 5. Professors API ────────────────────────────────────────────────────────
  group("Professors API", () => {
    const listRes = get("/professors");
    dbReadDuration.add(listRes.timings.duration);
    const listOk = check(listRes, {
      "GET /professors: status 200": (r) => r.status === 200,
      "GET /professors: returns array": (r) => {
        try {
          const b = JSON.parse(r.body);
          return Array.isArray(b) || Array.isArray(b.data);
        } catch {
          return false;
        }
      },
    });
    failedChecks.add(!listOk);

    const byIdRes = get(`/professors/${PROFESSOR_ID}`);
    const byIdOk = check(byIdRes, {
      "GET /professors/1: 200 or 404": (r) => statusOk(r),
    });
    failedChecks.add(!byIdOk);
  });

  sleep(0.3);

  // ── 6. Exams API ─────────────────────────────────────────────────────────────
  group("Exams API", () => {
    const calRes = get("/exams/calendar/all");
    dbReadDuration.add(calRes.timings.duration);
    const calOk = check(calRes, {
      "GET /exams/calendar/all: 200": (r) => r.status === 200,
      "GET /exams/calendar/all: array body": (r) => {
        try {
          const b = JSON.parse(r.body);
          return Array.isArray(b) || Array.isArray(b.data);
        } catch {
          return false;
        }
      },
    });
    failedChecks.add(!calOk);

    const profExamsRes = get(`/exams/professor/${PROFESSOR_ID}`);
    const profOk = check(profExamsRes, {
      "GET /exams/professor/:id: 200 or 404": (r) => statusOk(r),
    });
    failedChecks.add(!profOk);

    const availRes = get(`/exams/available/${STUDENT_EMAIL}`);
    const availOk = check(availRes, {
      "GET /exams/available: 200 or 404": (r) => statusOk(r),
    });
    failedChecks.add(!availOk);

    const regRes = get(`/exams/registered/${STUDENT_EMAIL}`);
    const regOk = check(regRes, {
      "GET /exams/registered: 200 or 404": (r) => statusOk(r),
    });
    failedChecks.add(!regOk);
  });

  sleep(0.3);

  // ── 7. Enrollment API ────────────────────────────────────────────────────────
  group("Enrollment API", () => {
    const majRes = get("/enrollment/majors/with-subjects");
    dbReadDuration.add(majRes.timings.duration);
    const majOk = check(majRes, {
      "GET /enrollment/majors: 200": (r) => r.status === 200,
      "GET /enrollment/majors: array body": (r) => {
        try {
          const b = JSON.parse(r.body);
          return Array.isArray(b) || Array.isArray(b.data);
        } catch {
          return false;
        }
      },
    });
    failedChecks.add(!majOk);

    const enrollRes = get(`/enrollment/student/${STUDENT_EMAIL}`);
    const enrollOk = check(enrollRes, {
      "GET /enrollment/student: 200 or 404": (r) => statusOk(r),
    });
    failedChecks.add(!enrollOk);
  });

  sleep(0.3);

  // ── 8. Grades API ────────────────────────────────────────────────────────────
  group("Grades API", () => {
    const byStudentRes = get("/grades/student/1");
    const byStudentOk = check(byStudentRes, {
      "GET /grades/student/1: 200 or 404": (r) => statusOk(r),
    });
    failedChecks.add(!byStudentOk);

    const bySubjectRes = get("/grades/subject/1");
    const bySubjectOk = check(bySubjectRes, {
      "GET /grades/subject/1: 200 or 404": (r) => statusOk(r),
    });
    failedChecks.add(!bySubjectOk);
  });

  sleep(0.3);

  // ── 9. News API ──────────────────────────────────────────────────────────────
  group("News API", () => {
    const newsRes = get("/news");
    const newsOk = check(newsRes, {
      "GET /news: status 200": (r) => r.status === 200,
    });
    failedChecks.add(!newsOk);
  });

  sleep(0.5);
}

// ─── Custom Summary ───────────────────────────────────────────────────────────

export function handleSummary(data) {
  const m = data.metrics;

  const checks = m.checks?.values ?? {};
  const passed = checks.passes ?? 0;
  const failed = checks.fails ?? 0;
  const total = passed + failed;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : "N/A";

  const dur = m.http_req_duration?.values ?? {};
  const avg = dur.avg != null ? dur.avg.toFixed(2) : "N/A";
  const p95 = dur["p(95)"] != null ? dur["p(95)"].toFixed(2) : "N/A";
  const p99 = dur["p(99)"] != null ? dur["p(99)"].toFixed(2) : "N/A";
  const minD = dur.min != null ? dur.min.toFixed(2) : "N/A";
  const maxD = dur.max != null ? dur.max.toFixed(2) : "N/A";

  const reqs = m.http_reqs?.values ?? {};
  const totalReqs = reqs.count ?? 0;
  const reqRate = reqs.rate != null ? reqs.rate.toFixed(2) : "N/A";

  const httpFailed = m.http_req_failed?.values?.rate ?? 0;

  const loginDur = m.admin_login_ms?.values ?? {};
  const loginP95 =
    loginDur["p(95)"] != null ? loginDur["p(95)"].toFixed(2) : "N/A";
  const loginAvg = loginDur.avg != null ? loginDur.avg.toFixed(2) : "N/A";

  const dbDur = m.db_read_ms?.values ?? {};
  const dbP95 = dbDur["p(95)"] != null ? dbDur["p(95)"].toFixed(2) : "N/A";
  const dbAvg = dbDur.avg != null ? dbDur.avg.toFixed(2) : "N/A";

  const fcRate = m.failed_checks?.values?.rate ?? 0;

  const t_dur = parseFloat(p95) < 500 ? "PASS" : "FAIL";
  const t_login = parseFloat(loginP95) < 100 ? "PASS" : "FAIL";
  const t_db = parseFloat(dbP95) < 400 ? "PASS" : "FAIL";
  const t_checks = fcRate * 100 < 10 ? "PASS" : "FAIL";

  const report = `
╔═══════════════════════════════════════════════════════════════╗
║    IPI Smart Academic System — k6 Performance Test Report     ║
╚═══════════════════════════════════════════════════════════════╝

  LOAD PROFILE
  ┌──────────────────────────────────────────────────────────┐
  │  Stage 1:   0 →  5 VU over 10s  (ramp-up)               │
  │  Stage 2:   5 → 10 VU over 20s  (sustained load)        │
  │  Stage 3:  10 →  0 VU over 10s  (ramp-down)             │
  │  Total duration: ~40 seconds                             │
  └──────────────────────────────────────────────────────────┘

  OVERALL RESULTS
  ┌──────────────────────────────────────────────────────────┐
  │  Total HTTP requests : ${String(totalReqs).padEnd(6)} (${reqRate} req/s)         │
  │  Checks passed       : ${passed} / ${total} (${passRate}%)             │
  │  HTTP 4xx/5xx rate   : ${(httpFailed * 100).toFixed(1)}%                        │
  └──────────────────────────────────────────────────────────┘

  RESPONSE TIMES — All Endpoints
  ┌──────────────────────────────────────────────────────────┐
  │  Min     : ${minD} ms                                  │
  │  Average : ${avg} ms                                  │
  │  p(95)   : ${p95} ms   ← threshold < 500ms            │
  │  p(99)   : ${p99} ms                                  │
  │  Max     : ${maxD} ms                                  │
  └──────────────────────────────────────────────────────────┘

  ENDPOINT GROUP METRICS
  ┌──────────────────────────────────────────────────────────┐
  │  Admin Login (no DB)                                     │
  │    avg: ${loginAvg} ms   p(95): ${loginP95} ms                  │
  │  Database Read Operations (students/exams/enrollment)    │
  │    avg: ${dbAvg} ms   p(95): ${dbP95} ms                  │
  └──────────────────────────────────────────────────────────┘

  THRESHOLD RESULTS
  ┌──────────────────────────────────────────────────────────┐
  │  All requests p(95) < 500ms  : ${t_dur === "PASS" ? "✓ PASSED" : "✗ FAILED"}                │
  │  Admin login  p(95) < 100ms  : ${t_login === "PASS" ? "✓ PASSED" : "✗ FAILED"}                │
  │  DB reads     p(95) < 400ms  : ${t_db === "PASS" ? "✓ PASSED" : "✗ FAILED"}                │
  │  Failed checks < 10%         : ${t_checks === "PASS" ? "✓ PASSED" : "✗ FAILED"}                │
  └──────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════════╗
║  Full JSON results saved to: k6-results.json                  ║
╚═══════════════════════════════════════════════════════════════╝
`;

  const allThresholdsPassed = t_dur === "PASS" && t_login === "PASS" && t_db === "PASS" && t_checks === "PASS";

  const academicSummary = `
┌─────────────────────────────────────────────────────────────────────────────┐
│         PREGLED PERFORMANSI BACKEND SERVISA — IPI Academic System           │
│         Load test: k6 | 10 VU | 40s | ${totalReqs} HTTP zahtjeva                       │
├────────────────────────────────────────────┬──────────────┬─────────────────┤
│ Metrika                                    │  Izmjereno   │  Prag           │
├────────────────────────────────────────────┼──────────────┼─────────────────┤
│ Prosj. vrijeme odziva (sve operacije)      │  ${String(avg + " ms").padEnd(12)} │  < 500 ms       │
│ Prosj. vrijeme odziva (DB operacije)       │  ${String(dbAvg + " ms").padEnd(12)} │  < 400 ms       │
│ 95. percentil — svi zahtjevi              │  ${String(p95 + " ms").padEnd(12)} │  < 500 ms  ${t_dur === "PASS" ? "✓" : "✗"}   │
│ 95. percentil — DB čitanja                │  ${String(dbP95 + " ms").padEnd(12)} │  < 400 ms  ${t_db === "PASS" ? "✓" : "✗"}   │
│ 95. percentil — admin autentifikacija     │  ${String(loginP95 + " ms").padEnd(12)} │  < 100 ms  ${t_login === "PASS" ? "✓" : "✗"}   │
│ Maks. izmjereno vrijeme odziva            │  ${String(maxD + " ms").padEnd(12)} │  < 1000 ms      │
│ Propusnost (throughput)                   │  ${String(reqRate + " req/s").padEnd(12)} │  —              │
│ Ukupan broj HTTP zahtjeva (40s)           │  ${String(String(totalReqs)).padEnd(12)} │  —              │
│ Uspješnost provjera (checks passed)       │  ${String(passRate + "%").padEnd(12)} │  > 90%          │
├────────────────────────────────────────────┴──────────────┴─────────────────┤
│  Svi pragovi zadovoljeni: ${allThresholdsPassed ? "✓ DA — sistem zadovoljava kriterije performansi" : "✗ NE — neki pragovi nisu zadovoljeni"}  │
└─────────────────────────────────────────────────────────────────────────────┘
`;

  console.log(report);
  console.log(academicSummary);

  return {
    stdout: report,
    "k6-results.json": JSON.stringify(data, null, 2),
  };
}
