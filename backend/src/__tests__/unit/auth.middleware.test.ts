import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";

import { currentUser, requireAuth } from "../../middleware/auth";
import { signToken } from "../../utils/jwt";

const SECRET = "test-jwt-secret";

const app = express();
app.get("/student", requireAuth("STUDENT"), (_req, res) => res.json(currentUser(res)));

const student = { id: 7, email: "student@ipi.ba", role: "STUDENT" as const };

describe("requireAuth", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = SECRET;
  });
  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

  it("passes a valid token and exposes the user from the token", async () => {
    const res = await request(app)
      .get("/student")
      .set("Authorization", `Bearer ${signToken(student)}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(student);
  });

  it("rejects a request without a token", async () => {
    const res = await request(app).get("/student");
    expect(res.status).toBe(401);
  });

  it("rejects a token signed with another secret (forged)", async () => {
    const forged = jwt.sign({ email: student.email, role: "STUDENT" }, "attacker", {
      subject: "7",
    });
    const res = await request(app).get("/student").set("Authorization", `Bearer ${forged}`);
    expect(res.status).toBe(401);
  });

  it("rejects an unsigned 'none' token", async () => {
    const none = jwt.sign({ email: student.email, role: "STUDENT" }, "", {
      algorithm: "none",
      subject: "7",
    });
    const res = await request(app).get("/student").set("Authorization", `Bearer ${none}`);
    expect(res.status).toBe(401);
  });

  it("rejects an expired token", async () => {
    const expired = jwt.sign({ email: student.email, role: "STUDENT" }, SECRET, {
      subject: "7",
      expiresIn: -10,
    });
    const res = await request(app).get("/student").set("Authorization", `Bearer ${expired}`);
    expect(res.status).toBe(401);
  });

  it("rejects the wrong role", async () => {
    const token = signToken({ id: 3, email: "prof@ipi.ba", role: "PROFESSOR" });
    const res = await request(app).get("/student").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it("fails closed when JWT_SECRET is not configured", async () => {
    const token = signToken(student);
    delete process.env.JWT_SECRET;
    const res = await request(app).get("/student").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(503);
    expect(signToken(student)).toBeNull();
  });
});
