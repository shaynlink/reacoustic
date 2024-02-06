export default class Collection extends Map {
  constructor(iterable) {
    super(iterable);
  }

  // Get or create a value from a key
  getOrCreate(uuid) {
    if (!this.has(uuid)) {
      this.set(uuid, {});
    }

    return this.get(uuid);
  }

  // Find a value from a predicate
  find(predicate) {
    for (const [key, value] of this.entries()) {
      if (predicate(value, key, this)) {
        return value;
      }
    }
  }

  // Get the collection data json compatible
  toJSON() {
    return Object.fromEntries(this.entries());
  }
}