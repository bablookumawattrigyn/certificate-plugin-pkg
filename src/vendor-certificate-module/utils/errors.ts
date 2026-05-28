export function reportError(message: string, err?: unknown): void {
  const detail = err instanceof Error ? err.message : '';
  alert(detail ? `${message}: ${detail}` : message);
}

export async function runAction(action: () => Promise<void>, errorMessage: string): Promise<boolean> {
  try {
    await action();
    return true;
  } catch (err) {
    reportError(errorMessage, err);
    return false;
  }
}
