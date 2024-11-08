export async function times(n: number, callback: (i: number) => Promise<void>) {
  for (let i = 0; i < n; i++) {
    await callback(i);
  }
}
