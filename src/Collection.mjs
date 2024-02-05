export default class Collection extends Map {
  constructor(iterable) {
    super(iterable);
  }

  getOrCreate(uuid) {
    if (!this.has(uuid)) {
      this.set(uuid, {});
    }

    return this.get(uuid);
  }

  toJSON() {
    return Object.fromEntries(this.entries());
  }
}