import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

/**
 * Temporary development gate for admin read-only tools.
 * Replace with proper admin identity + JWT/role permissions before production.
 * The secret is kept on the server; the admin UI asks the operator to enter it.
 */
@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const configured = process.env.ADMIN_API_KEY;
    const request = context.switchToHttp().getRequest();
    const supplied = request.headers['x-admin-api-key'];
    if (!configured || typeof supplied !== 'string' || supplied !== configured) {
      throw new UnauthorizedException('A valid admin API key is required.');
    }
    return true;
  }
}
