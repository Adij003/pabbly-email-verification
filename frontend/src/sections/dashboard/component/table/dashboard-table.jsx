// components/DashboardTable/index.jsx
import { toast } from 'sonner';
import { useTheme } from '@emotion/react';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import {
  Tab,
  Box,
  Tabs,
  Card,
  Table,
  Button,
  Dialog,
  Divider,
  Tooltip,
  MenuList,
  MenuItem,
  TableBody,
  CardHeader,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/theme/styles';
import { fetchEmailLists } from 'src/redux/slice/emailVerificationSlice'
import { DASHBOARD_STATUS_OPTIONS } from 'src/_mock/_table/_apptable/_dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomPopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import {
  useTable,
  rowInPage,
  TableNoData,
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { MoveToFolderPopover } from 'src/sections/dialog-boxes/move-to-folder-dailog';

import { DashboardTableRow } from './dashboard-table-row';
import { DashboardTableToolbar } from './dashboard-table-toolbar';
import { DashboardTableFiltersResult } from './dashboard-table-filters-result';


// constants/table.js
const STATUS_OPTIONS = [
  { value: 'all', label: 'All', tooltip: 'View all email lists that have been uploaded.' },
  ...DASHBOARD_STATUS_OPTIONS,
];

const TABLE_HEAD = [
  {
    id: 'emailListName',
    label: 'Status/Name/Date',
    width: 400,
    whiteSpace: 'nowrap',
    tooltip: 'View email verification status, email list name and upload date.',
  },
  {
    id: 'creditsConsumed',
    label: 'Credits Consumed',
    width: 400,
    whiteSpace: 'nowrap',
    tooltip:
      'View the number of email addresses in the uploaded email list and the verification credits used.',
  },
  {
    id: 'action',
    label: 'Action',
    width: 300,
    whiteSpace: 'nowrap',
    align: 'right',
    tooltip: 'View option to start email verification and download the verification report.',
  },
  { id: '', width: 10 },
];


function applyFilter({ inputData, comparator, filters }) {
  const { status, name } = filters;

  let filteredData = [...inputData];

  if (name) {
    filteredData = filteredData.filter((item) =>
      item.emailListName.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== 'all') {
    filteredData = filteredData.filter((item) => item.status === status);
  }

  const stabilizedThis = filteredData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

 
export function DashboardTable() {
  const theme = useTheme();
  const { emailLists, pagination, isLoading, isError } = useSelector((state) => state.emailVerification); 
  const [tableData, setTableData] = useState([]);
  const { currentPage, totalPages, totalItems, itemsPerPage} = pagination;

  const table = useTable({ 
    defaultOrderBy: 'orderNumber',
    defaultRowsPerPage: itemsPerPage,
    defaultcurrentPage: currentPage,
  });

  const dispatch = useDispatch();

  // Effect Hooks
  useEffect(() => {
    dispatch(fetchEmailLists({
      type: "bulk",
      page: table.page + 1,
      limit: table.rowsPerPage
    }));    
  }, [dispatch, table.page, table.rowsPerPage]);

  const filters = useSetState({
    name: '',
    status: 'all',
  });

  const [processingRowId, setProcessingRowId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const confirmDelete = useBoolean();
  const isStartVerification = useSelector((state) => state.fileUpload.isStartVerification);
  const isVerificationCompleted = useSelector((state) => state.fileUpload.isVerificationCompleted);

  const [creditDialogOpen, setCreditDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setCreditDialogOpen(false);
  };

  const handleBuyCredits = () => {
    // Handle buy credits action
    setCreditDialogOpen(false);
    // Optionally navigate to credits purchase page
    // navigate('/credits/purchase');
  };



  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  const handleOpenPopover = (event, row) => {
    if (row.status !== 'processing') {
      setAnchorEl(event.currentTarget);
      setSelectedRow(row);
    }
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleConfirmDelete = () => {
    confirmDelete.onTrue();
    handleClosePopover();
  };

  const handleDelete = () => {
    confirmDelete.onFalse();

    toast.success(`Email list deleted successfully.`, {
      style: {
        marginTop: '15px',
      },
    });
  };

  // Computed values
  const dataFiltered = applyFilter({
    inputData: emailLists,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(emailLists, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name ||
    filters.state.status !== 'all' ||
    (!!filters.state.startDate && !!filters.state.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;
  const [openMoveFolder, setOpenMoveFolder] = useState(false);

  // Add this handler in DashboardTrashTable component
  const handleMoveToFolder = () => {
    setOpenMoveFolder(true);
    handleClosePopover();
  };

  let timeout;
  const handleFilterApply = (search) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      dispatch(fetchEmailLists({
        type: "bulk",
        page: table.page + 1,
        limit: table.rowsPerPage,
        search: search.search
      }));

    }, 1000); // 500ms delay
  };

  return (
    <Card>
      <CardHeader
        title={
          <Box display="inline-block">
            <Tooltip title="Folder Name: Home" arrow placement="top">
              <Typography variant="h6" sx={{overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: {xs:"200px", md:"500px"},}}>Home</Typography>
            </Tooltip>
          </Box>
        }
        subheader="Verify and manage all your uploaded email lists here."
        sx={{ pb: 3 }}
      />
      <Divider />

      <Tabs
        value={filters.state.status}
        onChange={handleFilterStatus}
        sx={{
          px: 2.5,
          boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
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
                  (tab.value === 'completed' && 'success') ||
                  (tab.value === 'verifying' && 'info') ||
                  (tab.value === 'ready' && 'warning') ||
                  (tab.value === 'pending' && 'info') ||

                  'default'
                }
              >
                {['completed', 'processing', 'verifying', 'ready', 'pending'].includes(tab.value)
                  ? emailLists.filter((user) => user.status === tab.value).length
                  : emailLists.length}
              </Label>
            }
          />
        ))}
      </Tabs>

      <DashboardTableToolbar
        filters={filters}
        onResetPage={table.onResetPage}
        numSelected={table.selected.length}
        onApplyFilter={handleFilterApply}
      />

      {canReset && (
        <DashboardTableFiltersResult
          filters={filters}
          totalResults={dataFiltered.length}
          onResetPage={table.onResetPage}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}

      <Box sx={{ position: 'relative' }}>
        {/* <DashboardTableSelectedAction
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={dataFiltered.length}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              dataFiltered.map((row) => row.id)
            )
          }
        /> */}
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'}>
            <TableHeadCustom
              showCheckbox
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
              {
              // dataFiltered
              //   .slice(
              //     table.page * table.rowsPerPage,
              //     table.page * table.rowsPerPage + table.rowsPerPage
              //   )
                emailLists.map((row, index) => (
                  <DashboardTableRow
                    key={row._id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    onOpenPopover={(event) => handleOpenPopover(event, row)}
                    dashboardTableIndex={table.page * table.rowsPerPage + index}
                    // onStartVerification={() => handleStartVerification(row.id)}
                    isProcessing={processingRowId === row.id && isStartVerification}
                    isCompleted={processingRowId === row.id && isVerificationCompleted}
                  />
                ))}

              {/* <TableEmptyRows
                height={table.dense ? 56 : 56 + 20}
                emptyRows={emptyRows(table.page, table.rowsPerPage, emailLists.length)}
              /> */}

              {emailLists.length === 0 ? (
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

      <CustomPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          {selectedRow && selectedRow.status !== 'processing' && (
            <>
              {/* <Tooltip title="Move to folder" arrow placement="left">
                <MenuItem onClick={handleMoveToFolder}>
                  <Iconify icon="fluent:folder-move-16-filled" />
                  Move to folder 
                </MenuItem>
              </Tooltip>
              <Divider style={{ borderStyle: 'dashed' }} /> */}
              <Tooltip title="Delete email list." arrow placement="left">
                <MenuItem onClick={handleConfirmDelete} sx={{ color: 'error.main' }}>
                  <Iconify icon="solar:trash-bin-trash-bold" />
                  Delete
                </MenuItem>
              </Tooltip>
            </>
          )}
        </MenuList>
      </CustomPopover>
      <MoveToFolderPopover
        open={openMoveFolder}
        onClose={() => {
          setOpenMoveFolder(false);
          setSelectedRow(null);
        }}
      />
      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title="Do you really want to delete the email list?"
        // content="Note that when an email list is deleted it is moved to the trash folder."
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />

      <Dialog open={creditDialogOpen} onClose={handleDialogClose} maxWidth="xs" fullWidth>
        <DialogTitle
          sx={{
            fontWeight: 'bold',
            pb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {/* <Iconify icon="mdi:credit-card-outline" /> */}
          Upgrade
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2">
            You don&apos;t have enough credits to verify the email list. Please purchase more
            credits to start email verification.
          </Typography>

          {/* <Box sx={{ bgcolor: 'background.neutral', p: 2, borderRadius: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              • Credits required: 250
              <br />• Available credits: 0
            </Typography>
          </Box> */}
        </DialogContent>

        <DialogActions sx={{ pb: 3, gap: 1 }}>
          <Button
            target="blank"
            href="https://www.pabbly.com/email-list-cleaning/#pricing"
            color="primary"
            variant="contained"
            // startIcon={<Iconify icon="mdi:cart-outline" />}
          >
            Upgrade Now
          </Button>
          <Button onClick={handleDialogClose} color="inherit" variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    
      <TablePaginationCustom
        page={table.page}
        count={totalItems}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onChangeDense={table.onChangeDense}
        onRowsPerPageChange={table.onChangeRowsPerPage}

      />
    </Card>
  );
}
