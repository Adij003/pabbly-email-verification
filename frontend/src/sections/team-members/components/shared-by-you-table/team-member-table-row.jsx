import dayjs from 'dayjs';
import React, { useState } from 'react';

import {
  Box,
  Stack,
  Tooltip,
  Divider,
  TableRow,
  Checkbox,
  MenuList,
  MenuItem,
  TableCell,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { CustomPopover } from 'src/components/custom-popover';

import { TeamMemberDialog } from '../../hooks/add-team-member';

export function SharedbyYouTeamMemberTableRow({ row, selected, onSelectRow, serialNumber }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const [openTeamMemberDialog, setOpenTeamMemberDialog] = useState(false);

  const handleClosePopover = () => setAnchorEl(null);
  const handleOpenConfirmDelete = () => {
    handleClosePopover();
  };

  const getTooltip = (type, rowData) => {
    const tooltips = {
      folder: `Folder Name: ${rowData.folders_you_shared}`,
      sharedOn: `Folder Shared On: ${rowData.updatedAt} (UTC+05:30) Asia/Kolkata`,
      permission:
        row.permissionType === 'write'
          ? 'Team members can upload email lists, start verification, and download verification reports. They cannot create new folders, delete folders, or remove email lists.'
          : 'Team members can only download verification reports.',
    };
    return tooltips[type];
  };

  const handleOpenTeamMemberDialog = () => {
    setOpenTeamMemberDialog(true);
    handleClosePopover();
  };

  const handleCloseTeamMemberDialog = () => {
    setOpenTeamMemberDialog(false);
  };

  return (
    <>
      <TableRow hover selected={selected} sx={{ '&:hover .copy-button': { opacity: 1 } }}>
        {/* Checkbox */}
        <TableCell padding="checkbox">
          <Tooltip title="Select" arrow placement="top" disableInteractive>
            <Checkbox
              checked={selected}
              onClick={onSelectRow}
              inputProps={{ 'aria-label': 'Row checkbox' }}
            />
          </Tooltip>
        </TableCell>

        {/* Shared On */}
        <TableCell width={400} align="left">
          <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            sx={{
              width: '200px',
              typography: 'body2',
              flex: '1 1 auto',
              alignItems: 'flex-start',
            }}
          >
            <Tooltip title={getTooltip('sharedOn', row)} arrow placement="top" disableInteractive>
            <span>
            {dayjs(row.shared_on).format('MMM DD, YY HH:mm:ss')}
            </span>
            </Tooltip>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Stack
              sx={{
                // color: '#078dee',
                typography: 'body2',
                flex: '1 1 auto',
                alignItems: 'flex-start',
              }}
            >
              <Box
                component="span"
                sx={{
                  maxWidth: { xs: '530px', md: '800px' },
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <Tooltip title={`Email: ${row.email}`} placement="top" arrow>
                  <span>
                  {row.email}
                  </span>
                  </Tooltip>
              </Box>
              <Box
                component="span"
                sx={{
                  color: 'text.disabled',
                  maxWidth: {
                    xs: '250px', // For extra small screens
                    sm: '650px', // For small screens
                    md: '700px', // For medium screens
                    lg: '750px', // For large screens
                    xl: '950px', // For extra large screens
                  },
                  display: 'inline-block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              />
              
            </Stack>
          </Stack>
        </TableCell>
        {/* Workflows */}
        {/* <TableCell width={400}>
          <Box
            sx={{
              width: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Tooltip title={getTooltip('folder', row)} arrow placement="top" disableInteractive>
              {row.folders_you_shared}
            </Tooltip>
          </Box>
        </TableCell> */}

        {/* Permission */}
        <TableCell>
          <Stack
            sx={{
              // width: '200px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'end',
              alignContent: 'flex-end',
            }}
          >
            <Tooltip title={getTooltip('permission', row)} arrow placement="top" disableInteractive>
              <span>
              {row.permissionType}
              </span>
            </Tooltip>
          </Stack>
        </TableCell>

        {/* Options */}
        {/* <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Click to see options." arrow placement="top" disableInteractive>
            <IconButton onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Tooltip>
        </TableCell> */}
      </TableRow>

      {/* Popover */}
      <CustomPopover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleClosePopover}>
        <MenuList>
          <Tooltip
            title="Update access to shared folder."
            arrow
            placement="left"
            disableInteractive
          >
            <MenuItem onClick={handleOpenTeamMemberDialog}>
              <Iconify icon="solar:pen-bold" />
              Update Access
            </MenuItem>
          </Tooltip>
          <Divider style={{ borderStyle: 'dashed' }} />
          <Tooltip
            title="Remove access to shared folder."
            arrow
            placement="left"
            disableInteractive
          >
            <MenuItem onClick={handleOpenConfirmDelete} sx={{ color: 'error.main' }}>
              <Iconify icon="solar:trash-bin-trash-bold" />
              Remove Access
            </MenuItem>
          </Tooltip>
        </MenuList>
      </CustomPopover>

      <TeamMemberDialog
        open={openTeamMemberDialog}
        onClose={handleCloseTeamMemberDialog}
        currentMember={row} // Pass the current row data to the dialog
      />
    </>
  );
}
