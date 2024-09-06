import { SelectChangeEvent } from "@mui/material"
import { User } from '../types'
import { userSchema } from "../utils"

export function handleOnChange(nestedKey: string, user: Readonly<User>, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string[]>, setUser: React.Dispatch<React.SetStateAction<Readonly<import("/home/brett/GitHub/openhim-console/packages/users-app/src/types/index").User>>>, validateUserField: (field: string, newBasicInfoState?: object) => void) {
    let newBasicUserState
  
    if (nestedKey) {
      newBasicUserState = {
        ...user
      }
      const keys = nestedKey.split('.')
      newBasicUserState[keys[0]][keys[1]][keys[2]] =
        !newBasicUserState[keys[0]][keys[1]][keys[2]]
    } else {
      const field = e.target.name
      if (field === 'dailyReport' || field === 'weeklyReport') {
        console.log('field', field)
  
        newBasicUserState = {
          ...user,
          [field]: !user[field]
        }
      } else {
        newBasicUserState = {
          ...user,
          [e.target.name]: e.target.value
        }
      }
    }
  
    setUser(newBasicUserState)
    validateUserField(e.target.name, newBasicUserState)
  }

export function handleFieldValidationAndUpdateErrors(newBasicInfoState: object, user: Readonly<User>, field: string, setValidationErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>, validationErrors: { [key: string]: string }, setIsFormDataValid: React.Dispatch<React.SetStateAction<boolean>>) {
    const validate = userSchema.safeParse(newBasicInfoState || user)
    if (!validate.success) {
      const message = validate.error.errors.filter(
        error => error.path[0] === field
      )[0]?.message
      if (message) {
        setValidationErrors({
          ...validationErrors,
          [field]: message
        })
      } else {
        const { [field]: _, ...rest } = validationErrors
        setValidationErrors(rest)
      }
    } else {
      setValidationErrors({})
      setIsFormDataValid(true)
    }
  }