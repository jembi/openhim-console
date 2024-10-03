import {z} from 'zod'

export const ClientSchema = z.object({
  clientID: z
    .string({
      message: 'Client ID is Required'
    })
    .min(1, {
      message: 'Client ID must be above 1 character'
    }),
  name: z.string().min(1).max(255),
  roles: z.array(z.string()).optional(),
  organization: z.string().optional(),
  softwareName: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  contactPerson: z.string().optional(),
  contactPersonEmail: z.string().email().optional().nullable()
})

export const AuthenticationSchema = z.object({
  customToken: z
    .object({
      token: z.string().uuid()
    })
    .optional(),
  mutualTLS: z
    .object({
      domain: z.string(),
      certificate: z.string()
    })
    .optional(),
  basicAuth: z
    .object({
      password: z.string()
    })
    .optional()
})

export type Client = z.infer<typeof ClientSchema>
export type Authentication = z.infer<typeof AuthenticationSchema>
