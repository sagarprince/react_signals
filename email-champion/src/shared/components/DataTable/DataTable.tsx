import { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './DataTable.module.scss';

export interface TableColumn {
  label: string;
  key: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  headerClassName?: string;
  cellClassName?: string;
  render?: (data: any) => ReactNode;
  component?: (data: any) => ReactNode;
}

export interface TableRow {
  [key: string]: any;
}

export interface TableProps {
  columns: TableColumn[];
  rows: TableRow[];
  noResultsMessage?: any;
  isLoading?: boolean;
  className?: any;
  rowClassName?: (data: TableRow) => string;
  cellClassName?: (data: any, column: TableColumn) => string;
}

export const DataTable: React.FC<TableProps> = ({ columns, rows, noResultsMessage, isLoading, className, rowClassName, cellClassName }) => {
  return (
    <div className={styles.table_wrap}>
      <table
        className={clsx({
          [styles.table]: true,
          [className]: typeof className !== 'undefined',
        })}
      >
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.headerClassName} style={{ width: column.width, textAlign: column.align }}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        {rows.length > 0 && (
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowClassName ? rowClassName(row) : ''}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cellClassName ? cellClassName(row[column.key], column) : column.cellClassName}
                    style={{ textAlign: column.align }}
                  >
                    {column.render ? column.render(row[column.key]) : column.component ? column.component(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        )}
        {rows.length === 0 && (
          <tbody>
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', height: '350px' }}>
                {noResultsMessage || 'No Results Found...'}
              </td>
            </tr>
          </tbody>
        )}
      </table>
      {isLoading && (
        <div className={styles.table_loader}>
          <div className='loader hour-glass'></div>
        </div>
      )}
    </div>
  );
};
