const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",

  transform: {
    ...tsJestTransformCfg,
  },

  roots: ["<rootDir>/tests"],

  testMatch: ["**/*.test.ts"],

  moduleFileExtensions: ["ts", "js", "json"],

  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],

  clearMocks: true,

  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/server.ts",
  ],
};