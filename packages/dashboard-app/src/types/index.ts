
export type TransactionRequest = {
  host: string;
  port: string;
  path: string;
  querystring: string;
  method: string;
  timestamp: string;
};

export type TransactionResponse = {
  status: number;
  timestamp: string;
};

export type Transaction = {
  request: TransactionRequest;
  response: TransactionResponse;
  _id: string;
  clientID: string;
  clientIP: string;
  childIDs: string[];
  channelID: string;
  canRerun: boolean;
  autoRetry: boolean;
  wasRerun: boolean;
  status: string;
};

