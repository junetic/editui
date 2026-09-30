export interface CompareRow {
  label: string;
  cells: string[];
}

export function CompareTable({ columns, rows }: { columns: string[]; rows: CompareRow[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-card">
            <th className="px-4 py-3 font-medium" scope="col">
              <span className="sr-only">Compared</span>
            </th>
            {columns.map((column) => (
              <th key={column} className="px-4 py-3 font-medium" scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-line last:border-b-0">
              <th className="px-4 py-3 align-top font-medium" scope="row">
                {row.label}
              </th>
              {row.cells.map((cell) => (
                <td key={cell} className="px-4 py-3 align-top leading-6 text-muted">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
