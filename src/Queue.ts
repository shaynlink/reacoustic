export default class Queue<T> {
  private readonly queue: Set<T>

  constructor () {
    this.queue = new Set()
  }

  public add (item: T): void {
    this.queue.add(item)
  }

  public * iterable (): Iterable<T> {
    for (const item of this.queue) {
      this.queue.delete(item)
      yield item
    }
  }

  public remove (item: T): void {
    this.queue.delete(item)
  }

  public clear (): void {
    this.queue.clear()
  }

  public get length (): number {
    return this.queue.size
  }

  public get items (): T[] {
    return Array.from(this.queue)
  }
}
