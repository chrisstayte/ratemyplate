export {};

declare global {
  interface String {
    getInitials(): string;
  }
}

String.prototype.getInitials = function (): string {
  return this.split(' ')
    .map((word) => word[0].toUpperCase())
    .join('');
};
