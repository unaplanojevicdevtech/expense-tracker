import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  Typography,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useState } from 'react';

type TableHeader<T> = {
  label: string;
  key: keyof T;
};

type TableProps<T> = {
  headers: TableHeader<T>[];
  rows: T[];
  renderActions?: (row: T, rowIndex: number) => React.ReactNode;
};

function BasicTable<T extends { amount?: number; currency?: string }>(
  { headers, rows, renderActions }: TableProps<T>
) {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Only sort if the column is 'amount'
  const sortedRows = [...rows].sort((a, b) => {
    if (typeof a.amount === 'number' && typeof b.amount === 'number') {
      return sortDirection === 'asc'
        ? a.amount - b.amount
        : b.amount - a.amount;
    }
    return 0;
  });

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell
                key={index}
                align='center'
                sx={{ 
                  fontWeight: 'bold', 
                  cursor: header.key === 'amount' ? 'pointer' : 'default' 
                }}
                onClick={() => {
                  if (header.key === 'amount') {
                    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
                  }
                }}
              >
                {header.label}
                {header.key === 'amount' && (
                  sortDirection === 'asc'
                    ? <ArrowDownwardIcon fontSize="small" sx={{ verticalAlign: 'middle', ml: 0.8 }} />
                    : <ArrowUpwardIcon fontSize="small" sx={{ verticalAlign: 'middle', ml: 0.8 }} />
                )}
              </TableCell>
            ))}
            <TableCell align='center' sx={{ fontWeight: 'bold' }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.length > 0 ? (
            sortedRows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <TableCell
                    key={colIndex}
                    align='center'
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: 150,
                    }}
                  >
                    {String(row[header.key])}
                  </TableCell>
                ))}
                <TableCell align='right'>
                  {renderActions ? renderActions(row, rowIndex) : null}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={headers.length + 1}
                sx={{
                  height: '200px',
                  padding: 0,
                  borderBottom: 'none',
                }}
              >
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography>No data available</Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BasicTable;
