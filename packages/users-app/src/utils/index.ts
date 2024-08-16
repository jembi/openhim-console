import {User} from '../types'

export const defaultUser: Readonly<User> = {
  _id: '',
  email: null,
  firstname: null,
  surname: null,
  provider: 'local',
  groups: [],
  msisdn: '',
  dailyReport: false,
  weeklyReport: false,
  expiry: new Date(),
  locked: false,
  passports: '',
  settings: {},
  token: '',
  tokenType: null
}
