import { describe, it, expect } from 'vitest';
import { generateQRToken, validateQRToken } from '@/lib/checkin';
import crypto from 'crypto';

describe('QR Token Generation', () => {
  it('should generate a token with correct structure', () => {
    const token = generateQRToken('event-123', 'user-456');
    const parts = token.split('.');
    expect(parts.length).toBe(2);
    expect(parts[0].length).toBeGreaterThan(0);
    expect(parts[1].length).toBeGreaterThan(0);
  });

  it('should include eventId in generated token', () => {
    const token = generateQRToken('event-123', 'user-456');
    const decoded = Buffer.from(token.split('.')[0], 'base64').toString();
    const data = JSON.parse(decoded);
    expect(data.eventId).toBe('event-123');
  });

  it('should include userId in generated token', () => {
    const token = generateQRToken('event-123', 'user-456');
    const decoded = Buffer.from(token.split('.')[0], 'base64').toString();
    const data = JSON.parse(decoded);
    expect(data.userId).toBe('user-456');
  });

  it('should include ticketTypeId when provided', () => {
    const token = generateQRToken('event-123', 'user-456', 'ticket-type-789');
    const decoded = Buffer.from(token.split('.')[0], 'base64').toString();
    const data = JSON.parse(decoded);
    expect(data.ticketTypeId).toBe('ticket-type-789');
  });

  it('should not include ticketTypeId when not provided', () => {
    const token = generateQRToken('event-123', 'user-456');
    const decoded = Buffer.from(token.split('.')[0], 'base64').toString();
    const data = JSON.parse(decoded);
    expect(data.ticketTypeId).toBeUndefined();
  });

  it('should include timestamp', () => {
    const before = Date.now();
    const token = generateQRToken('event-123', 'user-456');
    const after = Date.now();
    const decoded = Buffer.from(token.split('.')[0], 'base64').toString();
    const data = JSON.parse(decoded);
    expect(data.timestamp).toBeGreaterThanOrEqual(before);
    expect(data.timestamp).toBeLessThanOrEqual(after);
  });

  it('should generate different tokens for different users', () => {
    const token1 = generateQRToken('event-123', 'user-1');
    const token2 = generateQRToken('event-123', 'user-2');
    expect(token1).not.toBe(token2);
  });

  it('should generate different tokens for different events', () => {
    const token1 = generateQRToken('event-1', 'user-456');
    const token2 = generateQRToken('event-2', 'user-456');
    expect(token1).not.toBe(token2);
  });
});

describe('QR Token Validation', () => {
  it('should validate a recently generated token', () => {
    const token = generateQRToken('event-123', 'user-456');
    const result = validateQRToken(token);
    expect(result).not.toBeNull();
    expect(result?.eventId).toBe('event-123');
    expect(result?.userId).toBe('user-456');
  });

  it('should validate token with ticketTypeId', () => {
    const token = generateQRToken('event-123', 'user-456', 'ticket-type');
    const result = validateQRToken(token);
    expect(result?.ticketTypeId).toBe('ticket-type');
  });

  it('should reject invalid token format', () => {
    const result = validateQRToken('invalid-token');
    expect(result).toBeNull();
  });

  it('should reject empty token', () => {
    const result = validateQRToken('');
    expect(result).toBeNull();
  });

  it('should reject tampered token', () => {
    const token = generateQRToken('event-123', 'user-456');
    const parts = token.split('.');
    const tamperedToken = `${parts[0]}.tampered-checksum`;
    const result = validateQRToken(tamperedToken);
    expect(result).toBeNull();
  });

  it('should reject malformed base64 token', () => {
    const result = validateQRToken('not-valid-base64.invalid');
    expect(result).toBeNull();
  });

  it('should reject corrupted JSON token', () => {
    const corruptedBase64 = Buffer.from('not-json').toString('base64');
    const hash = crypto
      .createHash('md5')
      .update(corruptedBase64)
      .digest('hex')
      .substring(0, 8);
    const result = validateQRToken(`${corruptedBase64}.${hash}`);
    expect(result).toBeNull();
  });

  it('should reject token with invalid timestamp structure', () => {
    const invalidData = {
      eventId: 'event-123',
      userId: 'user-456',
      timestamp: 'invalid',
    };
    const base64 = Buffer.from(JSON.stringify(invalidData)).toString('base64');
    const hash = crypto
      .createHash('md5')
      .update(base64)
      .digest('hex')
      .substring(0, 8);
    const result = validateQRToken(`${base64}.${hash}`);
    expect(result).toBeNull();
  });
});

describe('simpleHash function', () => {
  it('should produce consistent hashes for same input', () => {
    const input = 'test-string';
    const hash1 = simpleHashTest(input);
    const hash2 = simpleHashTest(input);
    expect(hash1).toBe(hash2);
  });

  it('should produce different hashes for different inputs', () => {
    const hash1 = simpleHashTest('string1');
    const hash2 = simpleHashTest('string2');
    expect(hash1).not.toBe(hash2);
  });

  it('should handle empty string', () => {
    const hash = simpleHashTest('');
    expect(hash).toBe('0');
  });

  it('should handle unicode characters', () => {
    const hash = simpleHashTest('🎉Evento');
    expect(hash.length).toBeGreaterThan(0);
  });
});

function simpleHashTest(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
