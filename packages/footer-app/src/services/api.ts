import { AboutResponse } from "../types";
const { fetchAbout } = require('@jembi/openhim-core-api');

export function getAbout(): Promise<AboutResponse> {
  return fetchAbout();
}