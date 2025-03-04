import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { Tab, Tabs, Divider, Tooltip, CardHeader, Typography } from '@mui/material';

import { useSetState } from 'src/hooks/use-set-state';

import { fIsBetween } from 'src/utils/format-time';

import { varAlpha } from 'src/theme/styles';
import { CREDIT_STATUS_OPTIONS } from 'src/_mock/_table/_admintable/_credit';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import {
  useTable,
  rowInPage,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { CreditTableRow } from './credit-table-row';
import { CreditTableToolbar } from './credit-table-toolbar';
import { CreditTableFiltersResult } from './credit-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All', tooltip: 'All uploaded lists.' },
  ...CREDIT_STATUS_OPTIONS,
];
const TABLE_HEAD = [
  {
    id: 'date',
    label: 'Log Date',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: 'Date and time when the email verification action occurred.',
  },

  {
    id: 'message',
    label: 'Message',
    width: 'flex',
    whiteSpace: 'nowrap',
    tooltip: 'Description of the email verification action or status update.',
  },

  {
    id: 'action',
    label: 'Action',
    width: 'flex',
    whiteSpace: 'nowrap',
    align: 'left',
    tooltip: 'Details for the action happened to list.',
  },
  {
    id: 'status',
    label: 'Status',
    width: 'flex',
    whiteSpace: 'nowrap',
    align: 'right',
    tooltip: 'Current state of the email verification credits.',
  },
  { id: '', width: 10 },
];

const dataOn = [
  {
    dateCreatedOn: 'Oct 23, 2024 17:45:32',
    message: 'Used in verifying "SampleImport_(3)   " list',
    action: 'Verifying List',
    credits: 'Consumed',
    noOfCredits: 9,
    status: 'verified',
  },
  {
    dateCreatedOn: 'Oct 23, 2024 17:45:32',
    message: 'Used in verifying "SampleImport_(3)   " list',
    action: 'Verifying List',
    credits: 'Consumed',
    noOfCredits: 9,
    status: 'verified',
  },
  {
    dateCreatedOn: 'Oct 23, 2024 17:45:32',
    message: 'Used in verifying "SampleImport_(3)   " list',
    action: 'Verifying List',
    credits: 'Consumed',
    noOfCredits: 7,
    status: 'processing',
  },
  {
    dateCreatedOn: 'Oct 23, 2024 17:45:32',
    message: 'Used in verifying email: ankit.mandli1@pabbly.com',
    action: 'Verified Email',
    credits: 'Consumed',
    noOfCredits: 20,
    status: 'verified',
  },
  {
    dateCreatedOn: 'Oct 23, 2024 17:45:32',
    message: 'Email credits added by Admin',
    action: 'Added',
    credits: 'Alloted',
    noOfCredits: 100,
    status: 'unverified',
  },
];

// ----------------------------------------------------------------------

export function CreditTable() {
  const table = useTable({ defaultOrderBy: 'orderNumber' });

  const [tableData, setTableData] = useState(dataOn);

  const filters = useSetState({
    name: '',
    status: 'all',
  });

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  return (
    <Card>
      <CardHeader
        title={
          <Box display="inline-block">
            <Tooltip
              arrow
              placement="top"
              disableInteractive
              title="View all the email verification logs here."
            >
              <Typography variant="h6">Email Verification Logs</Typography>
            </Tooltip>
          </Box>
        }
        sx={{ pb: 3 }}
      />
      <Divider />
      <Tabs
        value={filters.state.status}
        onChange={handleFilterStatus}
        sx={{
          px: 2.5,
          boxShadow: (theme) =>
            `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
        }}
      >
        {STATUS_OPTIONS.map((tab) => (
          <Tab
            key={tab.value}
            iconPosition="end"
            value={tab.value}
            label={
              <Tooltip disableInteractive placement="top" arrow title={tab.tooltip}>
                <span>{tab.label}</span>
              </Tooltip>
            }
            icon={
              <Label
                variant={
                  ((tab.value === 'all' || tab.value === filters.state.status) && 'filled') ||
                  'soft'
                }
                color={
                  (tab.value === 'verified' && 'success') ||
                  (tab.value === 'processing' && 'info') ||
                  (tab.value === 'unverified' && 'error') ||
                  'default'
                }
              >
                {['verified', 'processing', 'unverified'].includes(tab.value)
                  ? tableData.filter((user) => user.status === tab.value).length
                  : tableData.length}
              </Label>
            }
          />
        ))}
      </Tabs>
      <CreditTableToolbar filters={filters} onResetPage={table.onResetPage} />

      {canReset && (
        <CreditTableFiltersResult
          filters={filters}
          totalResults={dataFiltered.length}
          onResetPage={table.onResetPage}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <Box sx={{ position: 'relative' }}>
        <Scrollbar
        //  sx={{ minHeight: 444 }}
        >
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              showCheckbox={false}
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.id)
                )
              }
            />

            <TableBody>
              {dataInPage
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row, index) => (
                  <CreditTableRow
                    key={index}
                    row={row}
                    selected={table.selected.includes(row.id)}
                  />
                ))}

              <TableEmptyRows
                height={table.dense ? 56 : 56 + 20}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataOn.length)}
              />
              {tableData.length === 0 ? (
                <TableNoData
                  title="Not Data Found"
                  description="No data found in the table"
                  notFound={notFound}
                />
              ) : (
                <TableNoData
                  title="Not Search Found"
                  description={`No search found with keyword "${filters.state.name}"`}
                  notFound={notFound}
                />
              )}
            </TableBody>
          </Table>
        </Scrollbar>
      </Box>

      <TablePaginationCustom
        page={table.page}
        count={dataFiltered.length}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { status, name, startDate, endDate } = filters;

  let filteredData = inputData;

  // Filter by message (name)
  if (name) {
    filteredData = filteredData.filter(
      (order) => order.message && order.message.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Filter by status
  if (status !== 'all') {
    filteredData = filteredData.filter((order) => order.status === status);
  }

  // Filter by date range
  if (!dateError) {
    if (startDate && endDate) {
      filteredData = filteredData.filter((order) =>
        fIsBetween(new Date(order.dateCreatedOn), startDate, endDate)
      );
    }
  }

  return filteredData;
}
