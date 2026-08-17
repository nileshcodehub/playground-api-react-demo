import { TableSkeletonRows } from "@/components/Skeletons";

const ALIGN_CLASSES = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const buildGridCols = (columns) =>
  columns.map((c) => c.width ?? "1fr").join(" ");

const DataTable = ({
  columns = [],
  data = [],
  keyField = "id",
  loading = false,
  skeletonRows = 10,
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
    <div
      className={`rounded-2xl border border-white/10 overflow-hidden bg-[#12151d] shadow-xl ${className}`}
    >
      {/* ── Header ── */}
      <div
        className="hidden md:grid gap-x-4 px-5 py-3.5 bg-[#0c0e14] border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-400"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {columns.map((col) => (
          <span key={col.key} className={ALIGN_CLASSES[col.align ?? "left"]}>
            {col.header}
          </span>
        ))}
      </div>

      {/* ── Body ── */}
      {loading ? (
        <TableSkeletonRows columns={columns} rows={skeletonRows} />
      ) : data.length === 0 ? (
        <div className="py-20 text-center text-slate-400 text-sm">{empty}</div>
      ) : (
        <ul className="divide-y divide-white/5">
          {data.map((row) => (
            <li
              key={row[keyField]}
              className="group hover:bg-white/3 transition-colors"
            >
              {/* Desktop: grid row */}
              <div
                className="hidden md:grid gap-x-4 px-5 py-4 items-center"
                style={rowGrid}
              >
                {columns.map((col) => (
                  <div
                    key={col.key}
                    className={`min-w-0 ${ALIGN_CLASSES[col.align ?? "left"]} ${col.className ?? ""}`}
                  >
                    {col.render ? (
                      col.render(row)
                    ) : (
                      <span className="text-sm text-slate-300 truncate block">
                        {row[col.key]}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile: stacked card */}
              <div className="md:hidden px-4 py-3.5 space-y-2">
                {columns.map((col, i) => (
                  <div
                    key={col.key}
                    className={i === 0 ? "" : "flex items-center gap-2"}
                  >
                    {i !== 0 && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 w-20 shrink-0">
                        {col.header}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      {col.render ? (
                        col.render(row)
                      ) : (
                        <span className="text-sm text-slate-300 truncate block">
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
