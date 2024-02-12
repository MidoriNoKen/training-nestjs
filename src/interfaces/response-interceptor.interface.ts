export interface ResponseInterseptorInterface<T> {
  statusCode: number;
  message: string;
  data: T;
}
