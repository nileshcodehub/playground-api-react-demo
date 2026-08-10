/**
 * DataTable — generic, reusable data table.
 *
 * Props:
 *   columns  {Array}   – Column definitions (see below)
 *   data     {Array}   – Row data array
 *   keyField {string}  – Field name used as React key (default "id")
 *   loading  {boolean} – Show skeleton/spinner when true
 *   empty    {string}  – Empty-state message (default "No records found.")
 *   className {string} – Extra classes for the outer wrapper
 *
 * Column definition shape:
 *   {
 *     key:       string,            // unique column key
 *     header:    string,            // header label
 *     width:     string,            // CSS flex/grid width token e.g. "2fr", "1.5fr", "auto"
 *     align:     "left"|"right"|"center",  // default "left"
 *     render:    (row) => ReactNode // custom cell renderer (optional)
 *     className: string             // extra classes for the <td> cell (optional)
 *   }
 */

function Spinner({ className = "" }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  );
}

const ALIGN_CLASSES = {
  left:   "text-left",
  center: "text-center",
  right:  "text-right",
};

/**
 * Build a CSS grid-template-columns string from the columns array.
 * e.g. ["2fr", "1.5fr", "2fr", "auto"] → "2fr 1.5fr 2fr auto"
 */
const buildGridCols = (columns) =>
  columns.map((c) => c.width ?? "1fr").join(" ");

const DataTable = ({
  columns = [],
  data = [],
  keyField = "id",
  loading = false,
  empty = "No records found.",
  className = "",
}) => {
  const gridTemplate = buildGridCols(columns);

  const rowGrid = {
    display: "grid",
    gridTemplateColumns: gridTemplate,
    alignItems: "center",
  };

  return (
    <div className={`rounded-2xl border border-[#1f2937] overflow-hidden bg-[#111827] shadow-xl ${className}`}>
      {/* ── Header ── */}
      <div
        className="hidden md:grid gap-x-4 px-5 py-3 bg-[#0b0f19] border-b border-[#1f2937] text-[11px] font-bold uppercase tracking-wider text-gray-500"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {columns.map((col) => (
          <span
            key={col.key}
            className={ALIGN_CLASSES[col.align ?? "left"]}
          >
            {col.header}
          </span>
        ))}
      </div>

      {/* ── Body ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-500">
          <Spinner className="w-6 h-6 text-indigo-400" />
          <span className="text-sm">Loading…</span>
        </div>
      ) : data.length === 0 ? (
        <div className="py-20 text-center text-gray-500 text-sm">{empty}</div>
      ) : (
        <ul className="divide-y divide-[#1f2937]">
          {data.map((row) => (
            <li
              key={row[keyField]}
              className="group hover:bg-[#0d1526] transition-colors"
            >
              {/* Desktop: grid row (same template as header) */}
              <div
                className="hidden md:grid gap-x-4 px-5 py-4 items-center"
                style={rowGrid}
              >
                {columns.map((col) => (
                  <div
                    key={col.key}
                    className={`min-w-0 ${ALIGN_CLASSES[col.align ?? "left"]} ${col.className ?? ""}`}
                  >
                    {col.render ? col.render(row) : (
                      <span className="text-sm text-gray-300 truncate block">
                        {row[col.key]}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile: stacked card (first column full width, rest below) */}
              <div className="md:hidden px-4 py-3 space-y-1">
                {columns.map((col, i) => (
                  <div key={col.key} className={i === 0 ? "" : "flex items-center gap-2"}>
                    {i !== 0 && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600 w-20 shrink-0">
                        {col.header}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      {col.render ? col.render(row) : (
                        <span className="text-sm text-gray-300 truncate block">
                          {row[col.key]}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DataTable;
