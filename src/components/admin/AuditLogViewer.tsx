import React, { useState } from 'react';
import { Activity, Shield, Download, RefreshCw, Filter } from 'lucide-react';
import { AuditLog } from '../../types';
import { dbService } from '../../services/db';

interface AuditLogViewerProps {
  logs: AuditLog[];
  adminEmail: string;
  onRefresh: () => void;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  logs,
  adminEmail,
  onRefresh,
}) => {
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const filteredLogs = logs.filter((log) => {
    if (filterAction === 'ALL') return true;
    return log.action === filterAction;
  });

  const handleExportBackup = () => {
    const json = dbService.exportDataAsJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alfalah-database-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#073D32] font-bengali flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#075B46]" />
            <span>প্রশাসনিক অডিট লগ ও ইতিহাস (Audit Trail & Activity Logs)</span>
          </h2>
          <p className="text-xs text-gray-500 font-bengali mt-0.5">
            সদস্য, পেমেন্ট ও নীতিমালার সকল পরিবর্তন ও সম্পাদনার অপরিবর্তনীয় রেকর্ড
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportBackup}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors font-english"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Full JSON Backup</span>
          </button>
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            title="রিফ্রেশ"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-gray-200 shadow-sm text-xs font-bengali">
        <Filter className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-500">কার্যক্রম ফিল্টার:</span>
        {(['ALL', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'] as const).map((act) => (
          <button
            key={act}
            onClick={() => setFilterAction(act)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              filterAction === act
                ? 'bg-[#075B46] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {act}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 font-bold text-gray-700 uppercase tracking-wider font-english">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Table</th>
                <th className="py-3 px-4">Admin Email</th>
                <th className="py-3 px-4">Description / Summary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((log) => {
                const actionBadgeClass =
                  log.action === 'CREATE'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : log.action === 'UPDATE'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : log.action === 'DELETE'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200';

                return (
                  <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-english text-gray-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${actionBadgeClass}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-english text-gray-600 font-semibold whitespace-nowrap">
                      {log.affected_table}
                    </td>
                    <td className="py-3 px-4 font-english text-gray-700">
                      {log.admin_email}
                    </td>
                    <td className="py-3 px-4 font-bengali text-gray-900 font-medium max-w-md">
                      {log.summary}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
