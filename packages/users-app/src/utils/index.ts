import z, { boolean, string } from 'zod';
import { User } from '../types';

export const userSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  firstname: z.string().min(1, "Firstname cannot be empty"),
  surname: z.string().min(1, "Surname cannot be empty"),
  provider: z.string().optional(),
  groups: z.array(z.string()).min(1),
  msisdn: z.string().optional(),
  dailyReport: z.boolean().optional(),
  weeklyReport: z.boolean().optional(),
  expiry: z.date().optional(),
  locked: z.boolean().optional(),
  passports: z.string().optional(),
  settings: z.object({
    list: z.object({
      tabview: z.boolean(),
      autoupdate: z.boolean()
    }),
    general: z.object({
      showTooltips: z.boolean()
    })
  }),
  token: z.string().optional(),
  tokenType: z.string().nullable().optional()
})




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
  settings: {
    list:{
      tabview: true,
      autoupdate: false
    },
    general: {
      showTooltips: false
    }
  },
  token: '',
  tokenType: null
}





export function getNestedProp(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}