'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface QueryResult {
  columns: string[];
  values: unknown[][];
  rowCount: number;
}

interface ResultsTableProps {
  result: QueryResult;
}

export function ResultsTable({ result }: ResultsTableProps) {
  if (result.rowCount === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No results found
      </div>
    );
  }

  return (
    <div className="overflow-auto max-h-[400px] border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {result.columns.map((col, i) => (
              <TableHead key={i} className="font-semibold">
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.values.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>
                  {cell === null ? <span className="text-muted-foreground">NULL</span> : String(cell)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}