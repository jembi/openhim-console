import { Transaction } from "../types";

const {
  fetchMediators,
  fetchTransactions,
} = require("@jembi/openhim-core-api");


export async function getMediators() {
  try {
    const mediators = await fetchMediators();

    return mediators;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  try {
    const transactions = await fetchTransactions() as Transaction[];

    return transactions;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
