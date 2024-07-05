export {};

declare global {
  interface String {
    getInitials(): string;
  }

  interface Date {
    prettyDateTime(): string;
  }
}

String.prototype.getInitials = function (): string {
  return this.split(' ')
    .map((word) => word[0].toUpperCase())
    .join('');
};

Date.prototype.prettyDateTime = function (): string {
  return this.toLocaleString('en-US', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};
