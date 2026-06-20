import './env-validator';
import bcrypt from 'bcryptjs';

const SECRET_KEY = process.env.JWT_SECRET;
const COOKIE_NAME = 'admin_session';

function normalizeBcryptHash(hash) {
  if (typeof hash !== 'string') return hash;
  return hash.trim().replace(/\\\$/g, '$');
}

async function getCryptoKey() {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(SECRET_KEY);
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

// Custom base64Url helpers to avoid issues in Node/Edge mismatch
function base64UrlEncode(str) {
  const base64 = btoa(str);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlDecode(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

export async function signToken(payload) {
  try {
    const key = await getCryptoKey();
    const encoder = new TextEncoder();
    
    const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
    const headerBase64 = base64UrlEncode(header);
    
    const payloadStr = JSON.stringify(payload);
    const payloadBase64 = base64UrlEncode(payloadStr);
    
    const message = `${headerBase64}.${payloadBase64}`;
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(message)
    );
    
    const signatureBytes = new Uint8Array(signature);
    let signatureBinary = '';
    for (let i = 0; i < signatureBytes.byteLength; i++) {
      signatureBinary += String.fromCharCode(signatureBytes[i]);
    }
    const signatureBase64 = base64UrlEncode(signatureBinary);
    
    return `${message}.${signatureBase64}`;
  } catch (error) {
    console.error('signToken error:', error);
    return null;
  }
}

export async function verifyToken(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [headerBase64, payloadBase64, signatureBase64] = parts;
    const key = await getCryptoKey();
    const encoder = new TextEncoder();
    
    const message = `${headerBase64}.${payloadBase64}`;
    
    const signatureBinary = base64UrlDecode(signatureBase64);
    const signatureBytes = new Uint8Array(signatureBinary.length);
    for (let i = 0; i < signatureBinary.length; i++) {
      signatureBytes[i] = signatureBinary.charCodeAt(i);
    }
    
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      encoder.encode(message)
    );
    
    if (!isValid) return null;
    
    const payloadStr = base64UrlDecode(payloadBase64);
    const payload = JSON.parse(payloadStr);
    
    // Check expiry
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error('verifyToken error:', error);
    return null;
  }
}

export function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, normalizeBcryptHash(hash));
}

export function getSessionCookie(request) {
  if (request.cookies && typeof request.cookies.get === 'function') {
    const cookie = request.cookies.get(COOKIE_NAME);
    return cookie ? cookie.value : null;
  }
  
  // Fallback for parsing headers manually
  const cookieHeader = request.headers.get?.('cookie') || '';
  const match = cookieHeader.match(new RegExp(`(^|;)\\s*${COOKIE_NAME}\\s*=\\s*([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}
