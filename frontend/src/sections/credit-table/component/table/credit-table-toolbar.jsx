import React, { useState } from 'react';
import { useTheme } from '@emotion/react';

import {
  Box,
  Stack,
  Button,
  Popover,
  Tooltip,
  MenuItem,
  MenuList,
  TextField,
  Typography,
  FormControl,  
  Autocomplete,
  useMediaQuery,
  InputAdornment,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

export function CreditTableToolbar({ filters, onResetPage, publish, onChangePublish, onApplyFilter, onApplySearch, onRefresh }) {
  const theme = useTheme();
  const isBelow600px = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  const status = ['single', 'bulk', 'all'];

  const [setSearch] = useState("")

  const handlePopoverClose = () => setAnchorEl(null);

  const handleFilterName = (event) => {
    onResetPage();
    const newSearchValue = event.target.value;
    filters.setState({ name: newSearchValue });
    setSearch(filters)
    onApplySearch({search: newSearchValue})
  };

  const [isFilterApplied, setFilterApplied] = useState(false); // Local filter state

  const [selectedstatus, setselectedstatus] = useState(null);

  const [selectedFolder, setSelectedFolder] = useState(null);

  const handleFilterIconClick = (e) => {
    e.stopPropagation();
    if (isFilterApplied) {
      handleFilterClose();
      resetFilters();
      setFilterApplied(false);
    }
  };

  const hasAnyFilterSelected = Boolean(selectedstatus) || Boolean(selectedFolder);

  const resetFilters = () => {
    setselectedstatus(null);
    setSelectedFolder(null);
    setFilterApplied(false);
  };

  const handleFilterButtonClick = (e) => {
    if (!isFilterApplied || e.target.tagName !== 'svg') {
      setFilterAnchorEl(e.currentTarget);
    }
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleApplyFilter = () => {
    const newStatus = selectedstatus;
    filters.state.status = newStatus;
    if(onApplyFilter){
      onApplyFilter({selectedstatus})
      handleFilterClose()
    }
  };

  const buttonStyle = {
    color: isFilterApplied ? '#fff' : theme.palette.primary.main,
    fontSize: '15px',
    height: '48px',
    textTransform: 'none',
    padding: '16px',
    width: isFilterApplied ? '156px' : '104.34px',
    position: 'relative',
    '& .MuiButton-startIcon': {
      pointerEvents: 'auto',
      marginRight: '8px',
      display: 'flex',
    },
    '&:hover': {
      backgroundColor: isFilterApplied ? theme.palette.primary.main : '#ECF6FE',
    },
  };

  const handleRefreshEmailList = () => {
    onRefresh()
  }

  return (
    <>
      <Stack
        spacing={2}
        alignItems="center"
        direction={isBelow600px ? 'column' : 'row'}
        sx={{ p: 2.5, width: '100%', gap: 1 }}
      >
        <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            value={filters.state.name}
            onChange={handleFilterName}
            placeholder="Search by email, email list name..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: 'row',
            width: isBelow600px ? '100%' : 'auto',
            justifyContent: 'flex-end',
          }}
        >
          <Tooltip
            title={
              isFilterApplied
                ? "Click the 'X' to clear all applied filters."
                : 'Filter your email verification logs.'
            }
            arrow
            placement="top"
          >
            <Button
              sx={buttonStyle}
              variant={isFilterApplied ? 'contained' : ''}
              color="primary"
              startIcon={!isFilterApplied && <Iconify icon="mdi:filter" />}
              endIcon={
                isFilterApplied && (
                  <Box
                    component="span"
                    onClick={handleFilterIconClick}
                    sx={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify
                      icon="uil:times"
                      style={{
                        width: 22,
                        height: 22,
                        cursor: 'pointer',
                      }}
                    />
                  </Box>
                )
              }
              onClick={handleFilterButtonClick}
            >
              {isFilterApplied ? 'Filter Applied' : 'Filters'}
            </Button>
          </Tooltip>
          <Tooltip title="Click here to refresh data." arrow placement="top">
          <Button
            sx={{
              whiteSpace: 'nowrap',
            }}
            size="large"
            color="primary"
            onClick={handleRefreshEmailList}
          >
            <Iconify
              icon="tabler:refresh"
              sx={{ width: '24px', height: '24px', color: 'primary' }}
              cursor="pointer"
            />
          </Button>
        </Tooltip>
        </Box>
      </Stack>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuList>
          {[
            { value: 'published', label: 'Move list', icon: 'fluent:folder-move-16-filled' },
            {
              value: 'draft',
              label: 'Enable list',
              icon: 'line-md:switch-off-filled-to-switch-filled-transition',
            },
            {
              value: 'published',
              label: 'Disable list',
              icon: 'line-md:switch-filled-to-switch-off-filled-transition',
            },
            { value: 'draft', label: 'Delete list', icon: 'solar:trash-bin-trash-bold' },
          ].map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === publish}
              onClick={() => {
                handlePopoverClose();
                onChangePublish(option.value);
              }}
            >
              {option.icon && (
                <Iconify
                  icon={option.icon}
                  width={20}
                  height={20}
                  sx={{ mr: 2, color: 'inherit' }}
                />
              )}
              {option.label}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>

      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box
          sx={{
            width: {
              xs: '100%',
              sm: '100%',
              md: 650,
            },
            flexDirection: {
              xs: 'column',
              sm: 'column',
              md: 'row',
            },
          }}
        >
          <Box
            sx={{
              borderBottom: '1px dashed #919eab33',
              p: 2,
              display: 'flex',
              height: '100%',
              width: '100%',
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: '600' }}>
                <Tooltip title="Filter your email verification logs." arrow placement="top">
                  <span> Filter Action</span>
                </Tooltip>
              </Typography>
            </Box>
            <Iconify
              icon="uil:times"
              onClick={handleFilterClose}
              style={{
                width: 20,
                height: 20,
                cursor: 'pointer',
                color: '#637381',
              }}
            />
          </Box>

          <Box
            sx={{
              p: '16px 16px 0px 16px',
              gap: 2,
              flexDirection: {
                xs: 'column',
                sm: 'column',
                md: 'row',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: {
                  xs: 'column',
                  sm: 'column',
                  md: 'row',
                },
                gap: 2,
                mb: 2,
              }}
            >
              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 }, justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '14px', fontWeight: '600' }}>
                  <Tooltip
                    title=" Filter logs by selecting a status to view only the logs with specific status."
                    arrow
                    placement="top"
                  >
                    <span>Status</span>
                  </Tooltip>
                </Typography>
              </FormControl>

              <FormControl
                fullWidth
                sx={{
                  mb: { xs: 2, sm: 2, md: 0 },
                  width: { xs: '100%', sm: '100%', md: '390px' },
                }}
              >
                <TextField
                  id="select-currency-label-x"
                  variant="outlined"
                  fullWidth
                  label="Equals to"
                  disabled
                  size="small"
                />
              </FormControl>

              <FormControl fullWidth sx={{ mb: { xs: 2, sm: 2, md: 0 } }}>
                <Autocomplete
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: '14px',
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '14px',
                    },
                  }}
                  size="small"
                  options={status}
                  value={selectedstatus}
                  onChange={(event, newValue) => setselectedstatus(newValue)}
                  renderInput={(params) => <TextField {...params} label="Select" />}
                />
              </FormControl>
            </Box>
          </Box>

          <Box
            sx={{
              p: 2,
              gap: 2,
              display: 'flex',
              justifyContent: 'flex-end',
              borderTop: '1px dashed #919eab33',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyFilter}
              disabled={!hasAnyFilterSelected}
            >
              Apply Filter
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}
