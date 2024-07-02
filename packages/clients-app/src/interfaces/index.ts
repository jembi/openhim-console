export interface BasicInfoModel {
  clientID: string;
  clientName: string;
  roles: string[];
  organization: string;
  softwareName: string;
  description: string;
  location: string;
  contactPerson: string;
  contactPersonEmail: string;
}

export interface AuthenticationModel {
    jwt: { secret: string };
    customToken: { token: string };
    mutualTLS: { domain: string; certificate: string };
    basicAuth: { password: string };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // Add index signature
  }
