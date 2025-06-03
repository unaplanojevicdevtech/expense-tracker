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
};

function BasicTable<T>({ headers, rows }: TableProps<T>) {
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default BasicTable;
