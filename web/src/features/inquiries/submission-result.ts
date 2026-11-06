type SubmissionResult = {
  ok: boolean;
  error?: string;
  fields: Record<string, string[]>;
  notificationPending: boolean;
};

export function readSubmissionResult(value: unknown): SubmissionResult {
  const body =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  const fields: Record<string, string[]> = {};
  if (body.fields && typeof body.fields === "object") {
    for (const [name, messages] of Object.entries(body.fields)) {
      if (Array.isArray(messages))
        fields[name] = messages.filter(
          (message): message is string => typeof message === "string",
        );
    }
  }
  return {
    ok: body.ok === true,
    error: typeof body.error === "string" ? body.error : undefined,
    fields,
    notificationPending: body.notificationPending === true,
  };
}
