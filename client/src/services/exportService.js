/**
 * Export expenses array to CSV and trigger download
 */
export function exportToCSV(expenses, filename = 'expenses.csv') {
  if (!expenses.length) return;

  const headers = ['Date', 'Title', 'Category', 'Amount', 'Notes'];
  const rows = expenses.map((e) => [
    new Date(e.date).toLocaleDateString(),
    `"${(e.title || '').replace(/"/g, '""')}"`,
    e.category || '',
    e.amount?.toFixed(2) || '0.00',
    `"${(e.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
