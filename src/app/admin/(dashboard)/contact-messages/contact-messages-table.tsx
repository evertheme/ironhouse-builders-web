"use client";

import {
  deleteContactMessage,
  markContactMessageRead,
  markContactMessageUnread,
  setContactMessageArchived,
} from "./actions";
import type { ContactMessage } from "@/types";
import { usPhoneTelHref } from "@/lib/us-phone";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function AdminPhoneDisplay({ phone }: { phone: string }) {
  const tel = usPhoneTelHref(phone);
  if (tel) {
    return (
      <a href={tel} className="text-blue-600 hover:underline text-slate-800">
        {phone}
      </a>
    );
  }
  return <span className="text-slate-600">{phone}</span>;
}

export default function ContactMessagesTable({ rows }: { rows: ContactMessage[] }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-600">
        No contact messages yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Received</th>
              <th className="px-4 py-3 font-semibold">From</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Message</th>
              <th className="px-4 py-3 font-semibold">State</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr
                key={row.id}
                className={
                  row.archived
                    ? "bg-slate-50/80 text-slate-500"
                    : !row.read_at
                      ? "bg-blue-50/40"
                      : "bg-white"
                }
              >
                <td className="px-4 py-3 align-top whitespace-nowrap text-slate-700">
                  {formatDate(row.created_at)}
                </td>
                <td className="px-4 py-3 align-top font-medium text-slate-900">
                  {row.name}
                </td>
                <td className="px-4 py-3 align-top text-slate-700">
                  <div>
                    <a
                      href={`mailto:${encodeURIComponent(row.email)}`}
                      className="text-blue-600 hover:underline break-all"
                    >
                      {row.email}
                    </a>
                  </div>
                  {row.phone ? (
                    <div className="mt-1">
                      <AdminPhoneDisplay phone={row.phone} />
                    </div>
                  ) : null}
                </td>
                <td className="px-4 py-3 align-top text-slate-800 max-w-md">
                  <p className="whitespace-pre-wrap break-words">{row.message}</p>
                </td>
                <td className="px-4 py-3 align-top whitespace-nowrap">
                  {!row.read_at ? (
                    <span className="inline-flex rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 text-xs font-medium">
                      Unread
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-slate-200 text-slate-800 px-2 py-0.5 text-xs font-medium">
                      Read
                    </span>
                  )}
                  {row.archived ? (
                    <span className="ml-1 inline-flex rounded-full bg-slate-300 text-slate-800 px-2 py-0.5 text-xs font-medium">
                      Archived
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 align-top text-right">
                  <div className="flex flex-col items-end gap-1">
                    {row.read_at ? (
                      <form action={markContactMessageUnread.bind(null, row.id)}>
                        <button
                          type="submit"
                          className="text-xs font-medium text-slate-600 hover:text-slate-900"
                        >
                          Mark unread
                        </button>
                      </form>
                    ) : (
                      <form action={markContactMessageRead.bind(null, row.id)}>
                        <button
                          type="submit"
                          className="text-xs font-medium text-blue-600 hover:text-blue-800"
                        >
                          Mark read
                        </button>
                      </form>
                    )}
                    <form
                      action={setContactMessageArchived.bind(
                        null,
                        row.id,
                        !row.archived,
                      )}
                    >
                      <button
                        type="submit"
                        className="text-xs font-medium text-slate-600 hover:text-slate-900"
                      >
                        {row.archived ? "Unarchive" : "Archive"}
                      </button>
                    </form>
                    <form
                      action={deleteContactMessage.bind(null, row.id)}
                      onSubmit={(e) => {
                        if (!confirm("Delete this message permanently?")) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <button
                        type="submit"
                        className="text-xs font-medium text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
