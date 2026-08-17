import { useState, useEffect } from 'react';
import { subscribeToApiLogs } from '@/api/client';

export function LiveApiInspector() {
  const [logs, setLogs] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToApiLogs((newLog) => {
      setLogs((prev) => [newLog, ...prev].slice(0, 20));
    });
    return unsubscribe;
  }, []);

  const latestLog = logs[0];

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
    if (status >= 400 && status < 500) return 'text-emerald-400 bg-amber-500/15 border-emerald-500/30';
    if (status >= 500) return 'text-rose-400 bg-rose-500/15 border-rose-500/30';
    return 'text-slate-400 bg-slate-500/15 border-slate-500/30';
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'POST': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'PUT': return 'text-emerald-400 bg-amber-500/10 border-emerald-500/20';
      case 'PATCH': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'DELETE': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <>
      {/* Floating Bottom Dock */}
      <div className="fixed bottom-3 right-3 z-50 max-w-xl w-full px-2 pointer-events-none">
        <div className="bg-[#10141d]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-3 pointer-events-auto transition-all">
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-bold text-white tracking-wide shrink-0">
                Live API Inspector
              </span>

              {latestLog ? (
                <div className="flex items-center gap-1.5 min-w-0 truncate font-mono text-[11px] text-slate-300">
                  <span className={`px-1.5 py-0.5 rounded border font-bold ${getMethodColor(latestLog.method)}`}>
                    {latestLog.method}
                  </span>
                  <span className="truncate">{latestLog.url.replace(/^https?:\/\/[^/]+/, '')}</span>
                  <span className={`px-1.5 py-0.5 rounded border font-bold ${getStatusColor(latestLog.status)}`}>
                    {latestLog.status}
                  </span>
                  <span className="text-slate-400 font-sans">
                    {latestLog.timeMs}ms
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 text-[11px] truncate">
                  Ready • Interact with the app to see live HTTP calls
                </span>
              )}
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-[11px] font-bold transition-colors cursor-pointer shrink-0"
            >
              {isExpanded ? 'Hide Logs' : `Logs (${logs.length})`}
            </button>
          </div>

          {/* Expanded Drawer */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-white/10 space-y-2 max-h-72 overflow-y-auto font-mono text-xs">
              {logs.length === 0 ? (
                <p className="text-slate-400 text-center py-4 text-[11px] font-sans">
                  No requests sent yet. Click any button or load data to inspect calls.
                </p>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="flex items-center justify-between p-2 rounded-xl bg-black/40 hover:bg-white/5 border border-white/5 transition-colors cursor-pointer text-[11px]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`px-1.5 py-0.5 rounded border font-bold ${getMethodColor(log.method)}`}>
                        {log.method}
                      </span>
                      <span className="text-slate-200 truncate select-all">
                        {log.url.replace(/^https?:\/\/[^/]+/, '')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className={`px-1.5 py-0.5 rounded border font-bold ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        {log.timeMs}ms
                      </span>
                      <span className="text-[10px] text-emerald-400 font-sans">Inspect →</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Detail Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#12151d] border border-white/10 rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className={`px-2 py-0.5 rounded border font-bold ${getMethodColor(selectedLog.method)}`}>
                  {selectedLog.method}
                </span>
                <span className="text-white font-bold truncate select-all">
                  {selectedLog.url}
                </span>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className={`px-2 py-0.5 rounded border font-bold ${getStatusColor(selectedLog.status)}`}>
                HTTP {selectedLog.status}
              </span>
              <span className="text-slate-300">
                Duration: <strong className="text-white">{selectedLog.timeMs}ms</strong>
              </span>
              <span className="text-slate-400">
                Time: {selectedLog.timestamp}
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto flex-1 text-xs">
              {selectedLog.requestBody && (
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                    Request Body Sent
                  </span>
                  <pre className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-emerald-300 overflow-x-auto">
                    {JSON.stringify(selectedLog.requestBody, null, 2)}
                  </pre>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  Response Payload Received from Playground API
                </span>
                <pre className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-slate-200 overflow-x-auto max-h-72">
                  {JSON.stringify(selectedLog.responseBody, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LiveApiInspector;
