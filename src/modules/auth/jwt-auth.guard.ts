// jwt-auth.guard.ts

import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractJwtFromRequest(request);
    request.headers.authorization = `Bearer ${token}`; // Set the token in the format expected by Passport

    return super.canActivate(context);
  }

  private extractJwtFromRequest(request: any): string {
    // Extract the token from the Authorization header
    const header = request.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      return header.slice(7); // Remove 'Bearer ' to get the actual token
    }
    return null;
  }
}
