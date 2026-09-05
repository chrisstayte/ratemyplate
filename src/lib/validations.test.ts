import { describe, expect, it } from 'vitest';
import {
  newCommentFormSchema,
  parsePlateInput,
  parsePositiveId,
  parseReviewContent,
  platePath,
  plateRelatedPaths,
  REVIEW_COMMENT_MAX,
  REVIEW_COMMENT_MIN,
} from '@/lib/validations';

describe('parseReviewContent', () => {
  it('accepts a valid review', () => {
    const result = parseReviewContent({
      comment: 'Cut me off on I-95 without signaling.',
      rating: 2,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.comment).toBe(
        'Cut me off on I-95 without signaling.'
      );
      expect(result.data.rating).toBe(2);
    }
  });

  it('trims comments', () => {
    const result = parseReviewContent({
      comment: '  Solid merge etiquette nearby.  ',
      rating: 5,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.comment).toBe('Solid merge etiquette nearby.');
    }
  });

  it('rejects short comments', () => {
    const result = parseReviewContent({
      comment: 'bad',
      rating: 1,
    });

    expect(result).toEqual({
      success: false,
      message: 'Please write a bit more about your experience',
    });
  });

  it('rejects comments over the max length', () => {
    const result = parseReviewContent({
      comment: 'a'.repeat(REVIEW_COMMENT_MAX + 1),
      rating: 3,
    });

    expect(result).toEqual({
      success: false,
      message: 'Review is too long',
    });
  });

  it('rejects ratings outside 1-5', () => {
    expect(parseReviewContent({ comment: 'Enough detail here.', rating: 0 }))
      .toMatchObject({ success: false });
    expect(parseReviewContent({ comment: 'Enough detail here.', rating: 6 }))
      .toMatchObject({ success: false });
    expect(
      parseReviewContent({ comment: 'Enough detail here.', rating: 2.5 })
    ).toMatchObject({ success: false });
  });

  it('enforces the documented min length constant', () => {
    expect(REVIEW_COMMENT_MIN).toBe(5);
    expect(
      parseReviewContent({
        comment: 'a'.repeat(REVIEW_COMMENT_MIN),
        rating: 4,
      }).success
    ).toBe(true);
  });
});

describe('newCommentFormSchema', () => {
  it('maps the form message field to the same rules', () => {
    const valid = newCommentFormSchema.safeParse({
      message: 'Plenty of detail for a review.',
      rating: 4,
    });
    expect(valid.success).toBe(true);

    const invalid = newCommentFormSchema.safeParse({
      message: 'no',
      rating: 4,
    });
    expect(invalid.success).toBe(false);
  });
});

describe('parsePlateInput', () => {
  it('normalizes state and plate number', () => {
    const result = parsePlateInput({
      state: ' ca ',
      plateNumber: 'abc1234',
    });

    expect(result).toEqual({
      success: true,
      data: { state: 'CA', plateNumber: 'ABC1234' },
    });
  });

  it('rejects invalid states', () => {
    const result = parsePlateInput({
      state: 'XX',
      plateNumber: 'ABC1234',
    });

    expect(result).toEqual({
      success: false,
      message: 'Invalid state',
    });
  });

  it('rejects invalid plates', () => {
    const result = parsePlateInput({
      state: 'TX',
      plateNumber: '!!!!!!!!',
    });

    expect(result).toEqual({
      success: false,
      message: 'Invalid license plate',
    });
  });
});

describe('parsePositiveId', () => {
  it('accepts positive integers', () => {
    expect(parsePositiveId(12, 'plate')).toEqual({
      success: true,
      data: 12,
    });
  });

  it('rejects non-positive values', () => {
    expect(parsePositiveId(0, 'review')).toEqual({
      success: false,
      message: 'Invalid review',
    });
    expect(parsePositiveId(-3, 'plate')).toEqual({
      success: false,
      message: 'Invalid plate',
    });
    expect(parsePositiveId(1.5, 'plate')).toEqual({
      success: false,
      message: 'Invalid plate',
    });
  });
});

describe('plateRelatedPaths', () => {
  it('builds specific cache paths instead of a layout-wide wipe', () => {
    expect(platePath('ny', 'hello')).toBe('/NY/HELLO');
    expect(plateRelatedPaths('ny', 'hello')).toEqual([
      '/',
      '/NY',
      '/NY/HELLO',
      '/globe',
      '/map',
    ]);
  });
});
