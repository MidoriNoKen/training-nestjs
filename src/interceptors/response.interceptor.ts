import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ResponseInterseptorInterface } from 'interfaces/response-interceptor.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterseptor<T>
  implements NestInterceptor<T, ResponseInterseptorInterface<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseInterseptorInterface<T>> {
    return next.handle().pipe(
      map(({ data }) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: data instanceof Error ? data.message : 'Success',
        data: data,
      })),
    );
  }
}
