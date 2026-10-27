import { describe, expect, it } from "vitest";
import { getAppEnv, getAuthEnv, getMigrationEnv } from "./env";

const pooledUrl = "postgresql://user:s3cret@ep-test-pooler.eu-central-1.aws.neon.tech/db?sslmode=require";
const directUrl = "postgresql://user:s3cret@ep-test.eu-central-1.aws.neon.tech/db?sslmode=require";

describe("getAppEnv", () => {
  it("возвращает DATABASE_URL, если он корректен", () => {
    expect(getAppEnv({ DATABASE_URL: pooledUrl })).toEqual({ DATABASE_URL: pooledUrl });
  });

  it("принимает схему postgres://", () => {
    const url = "postgres://user:pass@localhost:5432/db";
    expect(getAppEnv({ DATABASE_URL: url }).DATABASE_URL).toBe(url);
  });

  it("падает с именем переменной, если она не задана", () => {
    expect(() => getAppEnv({})).toThrow(/DATABASE_URL/);
  });

  it("отклоняет URL с другим протоколом", () => {
    expect(() => getAppEnv({ DATABASE_URL: "https://example.com" })).toThrow(/DATABASE_URL/);
  });

  it("не раскрывает значение переменной в тексте ошибки", () => {
    const secret = "mysql://user:top-secret-password@host/db";
    expect(() => getAppEnv({ DATABASE_URL: secret })).toThrow(
      expect.objectContaining({ message: expect.not.stringContaining("top-secret-password") }),
    );
  });
});

describe("getMigrationEnv", () => {
  it("возвращает DATABASE_URL_UNPOOLED, если он корректен", () => {
    expect(getMigrationEnv({ DATABASE_URL_UNPOOLED: directUrl })).toEqual({
      DATABASE_URL_UNPOOLED: directUrl,
    });
  });

  it("не требует DATABASE_URL", () => {
    expect(() => getMigrationEnv({ DATABASE_URL_UNPOOLED: directUrl })).not.toThrow();
  });

  it("падает, если DATABASE_URL_UNPOOLED не задан", () => {
    expect(() => getMigrationEnv({ DATABASE_URL: pooledUrl })).toThrow(/DATABASE_URL_UNPOOLED/);
  });
});

describe("getAuthEnv", () => {
  const baseUrl = "https://ep-test.neonauth.eu-central-1.aws.neon.tech/neondb/auth";
  const secret = "x".repeat(32);

  it("возвращает адрес и секрет, если они корректны", () => {
    expect(getAuthEnv({ NEON_AUTH_BASE_URL: baseUrl, NEON_AUTH_COOKIE_SECRET: secret })).toEqual({
      NEON_AUTH_BASE_URL: baseUrl,
      NEON_AUTH_COOKIE_SECRET: secret,
    });
  });

  it("требует секрет не короче 32 символов", () => {
    expect(() => getAuthEnv({ NEON_AUTH_BASE_URL: baseUrl, NEON_AUTH_COOKIE_SECRET: "short" })).toThrow(
      /NEON_AUTH_COOKIE_SECRET/,
    );
  });

  it("падает без адреса сервиса", () => {
    expect(() => getAuthEnv({ NEON_AUTH_COOKIE_SECRET: secret })).toThrow(/NEON_AUTH_BASE_URL/);
  });
});
