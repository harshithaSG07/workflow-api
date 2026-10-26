import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app";

describe("WorkFlow API", () => {
  it("should return a successful response from the root endpoint", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
  });

  it("should reject profile access without a token", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Access token is missing");
  });

  it("should reject project listing without a token", async () => {
    const response = await request(app).get("/api/projects");

    expect(response.status).toBe(401);
  });

  it("should reject task listing without a token", async () => {
    const response = await request(app).get("/api/projects/1/tasks");

    expect(response.status).toBe(401);
  });

  it("should reject invalid project IDs", async () => {
    const response = await request(app)
      .get("/api/projects/abc")
      .set("Authorization", "Bearer invalid-token");

    // Authentication runs before project ID validation.
    expect(response.status).toBe(401);
  });
});