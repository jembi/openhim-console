
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

export type TimeSeries = {
  total: number;
  avgResp: number;
  minResp: number;
  maxResp: number;
  failed: number;
  successful: number;
  processing: number;
  completed: number;
  completedWErrors: number;
  timestamp: string;
  _id: {
    minute: number;
    hour: number;
    day: number;
    week: number;
    month: number;
    year: number;
  };
};

export enum TimeSeriesScale {
  minute = 'minute',
  hour = 'hour',
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year'
}
