import { sign, decode } from 'jsonwebtoken';

export function isExpired(token: string): boolean {
  const decoded: any = decode(token);
  return decoded.exp * 1000 < new Date().getTime();
}

export function someJwtToken(displayName: string, valid = true) {
  const name = displayName.toLowerCase().replace(' ', '.');
  const payload = {
    displayName,
    name,
    roles: ['USER'],
    accountType: 'user',
    provider: 'opentrapp',
    email: `${name}@pragmatists.pl`,
    iat: valid ? Math.floor(Date.now() / 1000) : Math.floor(Date.now() / 1000) - 30
  };
  return sign(payload, 'test-secret', {expiresIn: 10});
}