import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';

type TableHeader<T> = {
  label: string;
  key: keyof T;
};

type TableProps<T> = {
  headers: TableHeader<T>[];
  rows: T[];
  renderActions?: (row: T, rowIndex: number) => React.ReactNode;
};

function BasicTable<T>({ headers, rows, renderActions }: TableProps<T>) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={index} align='center' sx={{ fontWeight: 'bold' }}>
                {header.label}
              </TableCell>
            ))}
              <TableCell align='center' sx={{ fontWeight: 'bold' }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map((header, colIndex) => (
                <TableCell key={colIndex} align='center'>
                  {String(row[header.key])}
                </TableCell>
              ))}
                <TableCell align='right'>
                  {renderActions ? renderActions(row, rowIndex) : null}
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BasicTable;
