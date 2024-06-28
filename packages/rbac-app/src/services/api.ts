import { Role } from "../types";

const {
    fetchRoles,
    getAllApps,
    fetchChannels,
    fetchMediators,
    fetchClients,
    fetchTransactions,
    App
} = require("@jembi/openhim-core-api");


const defaultRole: Readonly<Role> = {
    name: '',
    permissions: {
      'channel-view-all': false,
      'channel-view-specified': [],
      'channel-manage-all': false,
      'channel-manage-specified': [],
      'client-view-all': false,
      'client-view-specified': [],
      'client-manage-all': false,
      'client-manage-specified': [],
      'client-role-view-all': false,
      'client-role-view-specified': [],
      'client-role-manage-all': false,
      'client-role-manage-specified': [],
      'transaction-view-all': false,
      'transaction-view-specified': [],
      'transaction-view-body-all': false,
      'transaction-view-body-specified': [],
      'transaction-rerun-all': false,
      'transaction-rerun-specified': [],
      'mediator-view-all': false,
      'mediator-view-specified': [],
      'mediator-manage-all': false,
      'mediator-manage-specified': [],
      'app-view-all': false,
      'app-view-specified': [],
      'app-manage-all': false,
      'user-view': false,
      'user-manage': false,
      'user-role-view': false,
      'user-role-manage': false,
      'audit-trail-view': false,
      'audit-trail-manage': false,
      'contact-list-view': false,
      'contact-list-manage': false,
      'certificates-view': false,
      'certificates-manage': false,
      'logs-view': false,
      'import-export': false,
    }
  };

export async function getRoles() {
    try {
        // const roles = await fetchRoles();
        const roles = [structuredClone({ ...defaultRole, name: 'Test 67' }), { ...defaultRole, name: 'Admin' }];
        console.log(roles);

        return roles;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function getMediators() {
    try {
        const mediators = await fetchMediators();
        console.log(mediators);

        return mediators;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function getApps() {
    try {
        const apps = await getAllApps();
        console.log(apps);

        return apps;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function getChannels() {
    try {
        const channels = await fetchChannels();
        console.log(channels);

        return channels;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function getClients() {
    try {
        const clients = await fetchClients();
        console.log(clients);

        return clients;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function getTransactions() {
    try {
        const transactions = await fetchTransactions();
        console.log(transactions);

        return transactions;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
