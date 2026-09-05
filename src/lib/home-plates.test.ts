import { describe, expect, it } from 'vitest';
import { selectTypingPlateNumbers } from '@/lib/home-plates';

describe('selectTypingPlateNumbers', () => {
  it('returns up to the requested limit', () => {
    const candidates = Array.from({ length: 50 }, (_, i) => ({
      plateNumber: `P${i}`,
    }));

    const selected = selectTypingPlateNumbers(candidates, 20);

    expect(selected).toHaveLength(20);
    expect(new Set(selected).size).toBe(20);
  });

  it('returns all candidates when fewer than the limit exist', () => {
    const candidates = [{ plateNumber: 'AAA111' }, { plateNumber: 'BBB222' }];
    expect(selectTypingPlateNumbers(candidates, 20)).toHaveLength(2);
  });

  it('does not mutate the input array', () => {
    const candidates = [
      { plateNumber: 'ONE' },
      { plateNumber: 'TWO' },
      { plateNumber: 'THREE' },
    ];
    const snapshot = candidates.map((row) => row.plateNumber);

    selectTypingPlateNumbers(candidates, 3);

    expect(candidates.map((row) => row.plateNumber)).toEqual(snapshot);
  });
});
