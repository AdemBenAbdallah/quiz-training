import dvac02Level1 from "./dvac02/level1.json";
import dvac02Level2 from "./dvac02/level2.json";
import dvac02Level3 from "./dvac02/level3.json";
import dvac02Level4 from "./dvac02/level4.json";
import dvac02Level5 from "./dvac02/level5.json";
import dvac02Level6 from "./dvac02/level6.json";
import dvac02Level7 from "./dvac02/level7.json";
import dvac02Level8 from "./dvac02/level8.json";

import ansc01Level1 from "./ansc01/level1.json";
import ansc01Level2 from "./ansc01/level2.json";
import ansc01Level3 from "./ansc01/level3.json";
import ansc01Level4 from "./ansc01/level4.json";
import ansc01Level5 from "./ansc01/level5.json";

import saac03Level1 from "./saac03/level1.json";
import saac03Level10 from "./saac03/level10.json";
import saac03Level11 from "./saac03/level11.json";
import saac03Level12 from "./saac03/level12.json";
import saac03Level13 from "./saac03/level13.json";
import saac03Level2 from "./saac03/level2.json";
import saac03Level3 from "./saac03/level3.json";
import saac03Level4 from "./saac03/level4.json";
import saac03Level5 from "./saac03/level5.json";
import saac03Level6 from "./saac03/level6.json";
import saac03Level7 from "./saac03/level7.json";
import saac03Level8 from "./saac03/level8.json";
import saac03Level9 from "./saac03/level9.json";

import sapc02Level1 from "./sapc02/level1.json";
import sapc02Level2 from "./sapc02/level2.json";
import sapc02Level3 from "./sapc02/level3.json";
import sapc02Level4 from "./sapc02/level4.json";
import sapc02Level5 from "./sapc02/level5.json";
import sapc02Level6 from "./sapc02/level6.json";
import sapc02Level7 from "./sapc02/level7.json";

import aifc01Level1 from "./aifc01/level1.json";
import aifc01Level2 from "./aifc01/level2.json";
import aifc01Level3 from "./aifc01/level3.json";
import aifc01Level4 from "./aifc01/level4.json";
import aifc01Level5 from "./aifc01/level5.json";

import clfc02Level1 from "./clfc02/level1.json";
import clfc02Level2 from "./clfc02/level2.json";
import clfc02Level3 from "./clfc02/level3.json";
import clfc02Level4 from "./clfc02/level4.json";
import clfc02Level5 from "./clfc02/level5.json";
import clfc02Level6 from "./clfc02/level6.json";
import clfc02Level7 from "./clfc02/level7.json";
import clfc02Level8 from "./clfc02/level8.json";

import deac01Level1 from "./deac01/level1.json";
import deac01Level2 from "./deac01/level2.json";
import deac01Level3 from "./deac01/level3.json";
import deac01Level4 from "./deac01/level4.json";

import dopc02Level1 from "./dopc02/level1.json";
import dopc02Level2 from "./dopc02/level2.json";
import dopc02Level3 from "./dopc02/level3.json";
import dopc02Level4 from "./dopc02/level4.json";
import dopc02Level5 from "./dopc02/level5.json";
import dopc02Level6 from "./dopc02/level6.json";

import mlac01Level1 from "./mlac01/level1.json";
import mlac01Level2 from "./mlac01/level2.json";
import mlac01Level3 from "./mlac01/level3.json";

import mlsc01Level1 from "./mlsc01/level1.json";
import mlsc01Level2 from "./mlsc01/level2.json";
import mlsc01Level3 from "./mlsc01/level3.json";
import mlsc01Level4 from "./mlsc01/level4.json";
import mlsc01Level5 from "./mlsc01/level5.json";

import scsc02Level1 from "./scsc02/level1.json";
import scsc02Level2 from "./scsc02/level2.json";
import scsc02Level3 from "./scsc02/level3.json";
import scsc02Level4 from "./scsc02/level4.json";
import scsc02Level5 from "./scsc02/level5.json";

export const certificateLevels = {
  dvac02: [
    dvac02Level1,
    dvac02Level2,
    dvac02Level3,
    dvac02Level4,
    dvac02Level5,
    dvac02Level6,
    dvac02Level7,
    dvac02Level8,
  ],
  ansc01: [
    ansc01Level1,
    ansc01Level2,
    ansc01Level3,
    ansc01Level4,
    ansc01Level5,
  ],
  saac03: [
    saac03Level1,
    saac03Level2,
    saac03Level3,
    saac03Level4,
    saac03Level5,
    saac03Level6,
    saac03Level7,
    saac03Level8,
    saac03Level9,
    saac03Level10,
    saac03Level11,
    saac03Level12,
    saac03Level13,
  ],
  sapc02: [
    sapc02Level1,
    sapc02Level2,
    sapc02Level3,
    sapc02Level4,
    sapc02Level5,
    sapc02Level6,
    sapc02Level7,
  ],
  aifc01: [
    aifc01Level1,
    aifc01Level2,
    aifc01Level3,
    aifc01Level4,
    aifc01Level5,
  ],
  clfc02: [
    clfc02Level1,
    clfc02Level2,
    clfc02Level3,
    clfc02Level4,
    clfc02Level5,
    clfc02Level6,
    clfc02Level7,
    clfc02Level8,
  ],
  deac01: [
    deac01Level1,
    deac01Level2,
    deac01Level3,
    deac01Level4,
  ],
  dopc02: [
    dopc02Level1,
    dopc02Level2,
    dopc02Level3,
    dopc02Level4,
    dopc02Level5,
    dopc02Level6,
  ],
  mlac01: [
    mlac01Level1,
    mlac01Level2,
    mlac01Level3,
  ],
  mlsc01: [
    mlsc01Level1,
    mlsc01Level2,
    mlsc01Level3,
    mlsc01Level4,
    mlsc01Level5,
  ],
  scsc02: [
    scsc02Level1,
    scsc02Level2,
    scsc02Level3,
    scsc02Level4,
    scsc02Level5,
  ],
};

export type CertificateSlug = keyof typeof certificateLevels;

export function getCertificateLevels(slug: string) {
  return certificateLevels[slug as CertificateSlug] || null;
}
