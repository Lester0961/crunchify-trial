export class AdminRequestError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
  }
}

export async function submitAdminForm(
  action: string,
  body?: URLSearchParams,
  networkMessage = "The connection was interrupted. Your changes are still here. Try again.",
) {
  let response: Response;
  try {
    response = await fetch(action, {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(body
          ? { "Content-Type": "application/x-www-form-urlencoded" }
          : {}),
      },
      body: body?.toString(),
      signal: AbortSignal.timeout(30000),
    });
  } catch {
    throw new AdminRequestError(networkMessage);
  }
  const result: unknown = await response.json().catch(() => null);
  const data =
    result && typeof result === "object" && !Array.isArray(result)
      ? (result as Record<string, unknown>)
      : null;
  if (!response.ok) {
    const message =
      response.status === 403
        ? "Your session has ended. Sign in and try again."
        : typeof data?.error === "string"
          ? data.error
          : "We couldn’t complete that change. Please try again.";
    throw new AdminRequestError(message, response.status);
  }
  if (!data)
    throw new AdminRequestError(
      "We couldn’t confirm the result. Check the page before trying again.",
    );
  return data;
}
