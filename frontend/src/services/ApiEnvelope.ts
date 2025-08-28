type ApiEnvelope<T> = {
  status: string;
  message?: string;
  data: T;
  statusCode: number;
  timestamp: string;
};
export default ApiEnvelope;
