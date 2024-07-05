export {};

declare global {
  interface String {
    getInitials(): string;
    capitalize(): string;
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

String.prototype.capitalize = function (): string {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

Date.prototype.prettyDateTime = function (): string {
  return this.toLocaleString('en-US', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};
