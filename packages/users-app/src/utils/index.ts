import {User} from '../types'

export const defaultUser: Readonly<User> = {
  _id: '',
  email: '',
  firstname: '',
  surname: '',
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
