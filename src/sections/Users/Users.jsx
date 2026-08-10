import { useState, useEffect, useCallback } from "react";
import { usersApi } from "@/api/users";
import Pagination from "@/components/Pagination";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import ConfirmationModal from "@/components/ConfirmationModal";
import SortDropdown from "@/components/SortDropdown";
import SearchInput from "@/components/SearchInput";

/* ─────────────────────────────────────────────────────────────── helpers */
const SORT_OPTIONS = [
  { value: "id", label: "User ID" },
  { value: "name", label: "Full Name" },
  { value: "username", label: "Username" },
  { value: "email", label: "Email Address" },
];
const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";
const EMPTY_FORM = {
  name: "",
  username: "",
  email: "",
  phone: "",
  website: "",
  address_street: "",
  address_city: "",
  address_zipcode: "",
  company_name: "",
  company_catchPhrase: "",
};

/** Re-nests flat form state back to the nested shape the API expects. */
const toApiBody = (form) => ({
  name: form.name,
  username: form.username,
  email: form.email,
  phone: form.phone,
  website: form.website,
  address: {
    street: form.address_street,
    city: form.address_city,
    zipcode: form.address_zipcode,
  },
  company: {
    name: form.company_name,
    catchPhrase: form.company_catchPhrase,
  },
});

function SandboxBadge({ value }) {
  if (!value) return null;
  const map = {
    created: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    updated: "bg-amber-500/10  text-amber-400  border-amber-500/30",
  };
  return (
    <span
      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${map[value] ?? "bg-gray-500/10 text-gray-400 border-gray-500/30"}`}
    >
      {value}
    </span>
  );
}

function Avatar({ name, size = "md" }) {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const palette = [
    "from-indigo-500 to-purple-600",
    "from-cyan-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-violet-500 to-indigo-600",
  ];
  const colour = palette[(name || "").charCodeAt(0) % palette.length];
  const sz = size === "lg" ? "w-12 h-12 text-base" : "w-8 h-8 text-xs";
  return (
    <div
      className={`${sz} rounded-full bg-linear-to-br ${colour} flex items-center justify-center font-bold text-white shrink-0`}
    >
      {initials}
    </div>
  );
}

function Spinner({ className = "" }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}

/* ───────────────────────────────────────────── UserForm (Create / Edit) */
function UserForm({
  initial = EMPTY_FORM,
  onSubmit,
  loading,
  submitLabel = "Save",
}) {
  const [form, setForm] = useState(initial);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const SECTIONS = [
    {
      title: null,
      fields: [
        {
          key: "name",
          label: "Full Name",
          placeholder: "Jane Doe",
          required: true,
        },
        {
          key: "username",
          label: "Username",
          placeholder: "janedoe",
          required: true,
        },
        {
          key: "email",
          label: "Email",
          placeholder: "jane@example.com",
          required: true,
          type: "email",
        },
        {
          key: "phone",
          label: "Phone",
          placeholder: "+1-555-012-3456",
          required: false,
        },
        {
          key: "website",
          label: "Website",
          placeholder: "https://janedoe.dev",
          required: false,
        },
      ],
    },
    {
      title: "Address",
      fields: [
        {
          key: "address_street",
          label: "Street",
          placeholder: "Kulas Light",
          required: false,
        },
        {
          key: "address_city",
          label: "City",
          placeholder: "Gwenborough",
          required: false,
        },
        {
          key: "address_zipcode",
          label: "Zip Code",
          placeholder: "92998-3874",
          required: false,
        },
      ],
    },
    {
      title: "Company",
      fields: [
        {
          key: "company_name",
          label: "Company Name",
          placeholder: "Romaguera-Crona",
          required: false,
        },
        {
          key: "company_catchPhrase",
          label: "Catch Phrase",
          placeholder: "Multi-layered client-server neural-net",
          required: false,
        },
      ],
    },
  ];

  const inputCls =
    "w-full bg-[#0b0f19] border border-[#374151] rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-colors";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(toApiBody(form));
      }}
      className="space-y-5"
    >
      {SECTIONS.map(({ title, fields }) => (
        <div key={title ?? "main"} className="space-y-3">
          {title && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 border-b border-[#1f2937] pb-1">
              {title}
            </p>
          )}
          {fields.map(
            ({ key, label, placeholder, required, type = "text" }) => (
              <div key={key} className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {label}
                  {required && (
                    <span className="text-indigo-400 ml-0.5">*</span>
                  )}
                </label>
                <input
                  id={`user-form-${key}`}
                  type={type}
                  value={form[key] || ""}
                  onChange={set(key)}
                  required={required}
                  placeholder={placeholder}
                  className={inputCls}
                />
              </div>
            ),
          )}
        </div>
      ))}
      <div className="pt-1">
        <button
          id="user-form-submit"
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shadow-md hover:shadow-indigo-500/25"
        >
          {loading && <Spinner className="w-4 h-4 text-white" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

/* ───────────────────────────────────────────── UserDetail */
function UserDetail({ user }) {
  const avatarSrc = user.avatar ? `${API_BASE}${user.avatar}` : null;

  const rows = [
    ["Username", user.username],
    ["Email", user.email],
    ["Phone", user.phone],
    // ["Website", user.website],
    ["Street", user.address?.street],
    ["City", user.address?.city],
    ["Zip", user.address?.zipcode],
    ["Company", user.company?.name],
    ["Catch Phrase", user.company?.catchPhrase],
  ].filter(([, v]) => v);

  return (
    <div className="space-y-4">
      {/* Header: real avatar + name */}
      <div className="flex items-center gap-4">
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover shrink-0 ring-2 ring-indigo-500/40"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <Avatar name={user.name} size="lg" />
        )}
        <div>
          <p className="font-bold text-white text-lg leading-tight">
            {user.name}
          </p>
          <p className="text-xs text-gray-400 font-mono">ID: {user.id}</p>
          {/* {user.website && (
            <a
              href={
                user.website.startsWith("http")
                  ? user.website
                  : `https://${user.website}`
              }
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-400 hover:underline"
            >
              {user.website}
            </a>
          )} */}
          <SandboxBadge value={user._sandbox} />
        </div>
      </div>
      {/* Field table */}
      <div className="divide-y divide-[#1f2937] rounded-xl border border-[#1f2937] overflow-hidden">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-start gap-3 px-4 py-3 bg-[#0b0f19]"
          >
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-28 shrink-0 pt-0.5">
              {label}
            </span>
            <span className="text-sm text-gray-200 break-all">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── Toast */
function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-60 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto px-4 py-3 rounded-xl border text-sm font-medium shadow-xl flex items-center gap-2 animate-in slide-in-from-right-4 ${
            t.type === "error"
              ? "bg-red-950 border-red-700 text-red-300"
              : t.type === "warn"
                ? "bg-amber-950 border-amber-700 text-amber-300"
                : "bg-emerald-950 border-emerald-700 text-emerald-300"
          }`}
        >
          {t.type === "error" ? "✕" : t.type === "warn" ? "⚠" : "✓"} {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────── Main Users component */
const Users = () => {
  // ── State ───────────────────────────────
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [settledKey, setSettledKey] = useState(null); // key of the last completed fetch
  const [toasts, setToasts] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Derived: loading is true whenever current params differ from the last settled fetch.
  // This avoids any synchronous setState inside an effect body.
  const queryKey = `${page}||${search}||${sortField}||${sortOrder}||${refreshKey}`;
  const loading = queryKey !== settledKey;

  const [modal, setModal] = useState(null); // null | { type: 'create'|'edit'|'detail'|'delete', user? }
  const [mutating, setMutating] = useState(false);

  // ── Toast helper ────────────────────────
  const toast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);

  // ── Refresh trigger (used by CRUD handlers instead of calling fetchUsers directly) ─
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  // ── Fetch list — all setState calls are inside async callbacks (linter-safe) ─
  useEffect(() => {
    let cancelled = false;
    usersApi
      .list({ page, limit: 10, q: search, _sort: sortField, _order: sortOrder })
      .then((res) => {
        if (cancelled) return;
        setUsers(res.data ?? []);
        setPagination(res.pagination ?? {});
        setSettledKey(queryKey);
      })
      .catch((err) => {
        if (cancelled) return;
        toast(err.message || "Failed to load users", "error");
        setSettledKey(queryKey); // mark settled even on error so spinner stops
      });
    return () => {
      cancelled = true;
    };
    // toast is stable (useCallback with [] deps) — safe to include
  }, [queryKey, toast, page, search, sortField, sortOrder, refreshKey]);

  // ── CRUD handlers ───────────────────────
  const handleCreate = async (form) => {
    setMutating(true);
    try {
      await usersApi.create(form);
      toast("User created successfully!");
      setModal(null);
      setPage(1);
      refresh();
    } catch (err) {
      toast(err.message || "Create failed", "error");
    } finally {
      setMutating(false);
    }
  };

  const handleEdit = async (form) => {
    setMutating(true);
    try {
      await usersApi.patch(modal.user.id, form);
      toast("User updated successfully!");
      setModal(null);
      refresh();
    } catch (err) {
      toast(err.message || "Update failed", "error");
    } finally {
      setMutating(false);
    }
  };

  const handleDelete = async () => {
    setMutating(true);
    try {
      await usersApi.remove(modal.user.id);
      toast("User deleted from sandbox.", "warn");
      setModal(null);
      refresh();
    } catch (err) {
      toast(err.message || "Delete failed", "error");
    } finally {
      setMutating(false);
    }
  };

  const handleViewDetail = async (user) => {
    setModal({ type: "detail", user });
    try {
      const full = await usersApi.getById(user.id);
      setModal({ type: "detail", user: full });
    } catch (err) {
      console.log(err);
    }
  };

  // ── Sort change handler — resets to page 1 ─
  const handleSortChange = (field, order) => {
    setPage(1);
    setSortField(field);
    setSortOrder(order);
  };

  // ── Render ──────────────────────────────
  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <svg
              className="w-6 h-6 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Users
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {pagination.total ?? 0} total records · page {pagination.page ?? 1}{" "}
            of {pagination.totalPages ?? 1}
          </p>
        </div>
        <button
          id="btn-create-user"
          onClick={() => setModal({ type: "create" })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-md hover:shadow-indigo-500/25 shrink-0"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create User
        </button>
      </div>

      {/* ── Search + Sort bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <SearchInput
          id="users-search"
          className="flex-1"
          placeholder="Search name, username, email…"
          value={search}
          onSearch={(term) => {
            setPage(1);
            setSearch(term);
          }}
        />
        <SortDropdown
          options={SORT_OPTIONS}
          value={sortField}
          order={sortOrder}
          onSortChange={handleSortChange}
        />
      </div>

      {/* ── Table ── */}
      <DataTable
        loading={loading}
        data={users}
        empty="No users found."
        columns={[
          {
            key: "user",
            header: "User",
            width: "2fr",
            render: (user) => (
              <button
                id={`view-user-${user.id}`}
                onClick={() => handleViewDetail(user)}
                className="flex items-center gap-3 min-w-0 text-left hover:opacity-80 transition-opacity w-full"
                title="View details"
              >
                {/* Real avatar from API, fallback to initials */}
                {user.avatar ? (
                  <img
                    src={`${API_BASE}${user.avatar}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                    onError={(e) => {
                      e.currentTarget.replaceWith(
                        Object.assign(document.createElement("div"), {
                          className:
                            "w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0",
                          textContent: user.name?.[0]?.toUpperCase() ?? "?",
                        }),
                      );
                    }}
                  />
                ) : (
                  <Avatar name={user.name} />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate leading-snug group-hover:text-indigo-300 transition-colors">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-gray-500 font-mono truncate">
                    {user.address?.city ? `${user.address.city} · ` : ""}
                    {String(user.id)}
                  </p>
                </div>
                {user._sandbox && <SandboxBadge value={user._sandbox} />}
              </button>
            ),
          },
          {
            key: "username",
            header: "Username",
            width: "1.5fr",
            render: (user) => (
              <span className="text-sm text-gray-300 font-mono truncate block">
                @{user.username}
              </span>
            ),
          },
          {
            key: "email",
            header: "Email",
            width: "2fr",
            render: (user) => (
              <span className="text-sm text-gray-400 truncate block">
                {user.email}
              </span>
            ),
          },
          {
            key: "actions",
            header: "Actions",
            width: "auto",
            align: "right",
            render: (user) => (
              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  id={`edit-user-${user.id}`}
                  title="Edit"
                  onClick={() => setModal({ type: "edit", user })}
                  className="p-2 rounded-lg text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  id={`delete-user-${user.id}`}
                  title="Delete"
                  onClick={() => setModal({ type: "delete", user })}
                  className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ),
          },
        ]}
      />

      {/* ── Pagination ── */}
      <Pagination
        currentPage={page}
        totalCount={pagination.total ?? 0}
        pageSize={pagination.limit ?? 10}
        onPageChange={setPage}
        prevLabel="Previous"
        nextLabel="Next"
      />

      {/* ── Modals ── */}
      {modal?.type === "create" && (
        <Modal title="Create New User" onClose={() => setModal(null)}>
          <UserForm
            onSubmit={handleCreate}
            loading={mutating}
            submitLabel="Create User"
          />
        </Modal>
      )}

      {modal?.type === "edit" && (
        <Modal
          title={`Edit — ${modal.user.name}`}
          onClose={() => setModal(null)}
        >
          <UserForm
            initial={{
              name: modal.user.name || "",
              username: modal.user.username || "",
              email: modal.user.email || "",
              phone: modal.user.phone || "",
              website: modal.user.website || "",
              address_street: modal.user.address?.street || "",
              address_city: modal.user.address?.city || "",
              address_zipcode: modal.user.address?.zipcode || "",
              company_name: modal.user.company?.name || "",
              company_catchPhrase: modal.user.company?.catchPhrase || "",
            }}
            onSubmit={handleEdit}
            loading={mutating}
            submitLabel="Save Changes"
          />
        </Modal>
      )}

      {modal?.type === "detail" && (
        <Modal title="User Details" onClose={() => setModal(null)}>
          <UserDetail user={modal.user} />
        </Modal>
      )}

      {modal?.type === "delete" && (
        <ConfirmationModal
          isOpen={true}
          onClose={() => setModal(null)}
          title="Delete User"
          onAccept={handleDelete}
          isLoading={mutating}
          acceptLabel="Delete from Sandbox"
          cancelLabel="Cancel"
          variant="danger"
          description={
            <span>
              This will remove the user from your{" "}
              <span className="text-amber-400 font-semibold">
                sandbox session only
              </span>
              . Global records remain unaffected for other visitors.
            </span>
          }
        >
          <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-950/30 border border-rose-700/40">
            <Avatar name={modal.user.name} />
            <div>
              <p className="font-semibold text-white text-sm">
                {modal.user.name}
              </p>
              <p className="text-xs text-gray-400">{modal.user.email}</p>
            </div>
          </div>
        </ConfirmationModal>
      )}

      {/* ── Toast notifications ── */}
      <Toast toasts={toasts} />
    </div>
  );
};

export default Users;
