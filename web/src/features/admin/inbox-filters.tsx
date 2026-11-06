"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition, type FormEvent } from "react";
import { SearchIcon } from "@/components/icons";

export function InboxFilters({
  q,
  status,
  type,
}: {
  q: string;
  status: string;
  type: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new URLSearchParams();
    new FormData(event.currentTarget).forEach((value, key) => {
      if (typeof value === "string" && value.trim())
        query.set(key, value.trim());
    });
    startTransition(() =>
      router.push(`/admin${query.size ? "?" + query : ""}`, { scroll: false }),
    );
  }
  return (
    <form
      className="admin-filters"
      action="/admin"
      onSubmit={apply}
      aria-busy={pending}
    >
      <label>
        Search company or contact
        <span className="search-field">
          <SearchIcon />
          <input
            name="q"
            type="search"
            defaultValue={q}
            maxLength={120}
            placeholder="Search inquiries"
            disabled={pending}
          />
        </span>
      </label>
      <label>
        Status
        <select name="status" defaultValue={status} disabled={pending}>
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">In progress</option>
          <option value="closed">Closed</option>
        </select>
      </label>
      <label>
        Type
        <select name="type" defaultValue={type} disabled={pending}>
          <option value="">All inquiries</option>
          <option value="wholesale">Wholesale</option>
          <option value="partner">Brand & media</option>
        </select>
      </label>
      <div className="admin-filter-actions">
        <button
          className="button button-primary button-small"
          type="submit"
          disabled={pending}
        >
          {pending ? "Applying…" : "Apply filters"}
        </button>
        {(q || status || type) && (
          <Link className="text-link clear-filters" href="/admin">
            Clear filters
          </Link>
        )}
      </div>
      <span role="status" className="sr-only">
        {pending ? "Updating inquiries…" : ""}
      </span>
    </form>
  );
}
