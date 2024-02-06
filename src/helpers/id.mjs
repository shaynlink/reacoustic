// Create unsafe id from Math.random
export function shortUnsafeId (max = 5) {
  return Math.random().toString(36).substring(2, max);
}

// Create safe id with counter
export function shortSafeIder () {
  let count = 0;
  return () => {
    count++;
    return shortUnsafeId() + count.toString(36);
  }
}

export const shortSafeId = shortSafeIder();