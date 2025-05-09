import { useDispatch } from 'react-redux';
import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';

import { Box, Tooltip, IconButton, Typography } from '@mui/material';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from '../iconify';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

const FileUpload = forwardRef(
  (
    {
      fileName,
      fileErrorMessage,
      placeholder,
      error,
      disabled,
      sx,
      onFileUpload,
      selectedFile,
      uploadInformation,
      allowedFileTypes,
      setAlertState,
      onSampleFileClick,
      ...other
    },
    ref
  ) => {
    const [localSelectedFile, setLocalSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    useImperativeHandle(ref, () => ({
      resetFile: () => {
        setLocalSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
    }));

    const handleAlertClose = () => {
      setAlertState((prev) => ({ ...prev, open: false }));
    };

    const validateFile = (file) => {
      if (file.size > MAX_FILE_SIZE) {
        setAlertState({
          open: true,
          color: 'error',
          title: 'Error',
          message: 'The selected file exceeds the maximum size limit of 10MB',
          status: 'Please choose a smaller file',
        });
        setTimeout(() => {
          handleAlertClose();
        }, 3000);
        return false;
      }
      if (allowedFileTypes && !allowedFileTypes.includes(file.type)) {
        setErrorMessage(
          <Typography fontSize="14px" color="error">
            Upload Error: Please ensure you upload a valid CSV file.
          </Typography>
        );
        return false;
      }
      return true;
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        if (!validateFile(file)) {
          event.target.value = '';
          return;
        }

        setErrorMessage(null);
        setLocalSelectedFile(file);

        let progress = 0;

        const uploadSimulation = setInterval(() => {
          progress += 5;
          if (progress >= 100) {
            clearInterval(uploadSimulation);
            
          }
        }, 500);
        onFileUpload(file);
      }
      event.target.value = '';
    };

    const handleButtonClick = (event) => {
      event.preventDefault();
      fileInputRef.current.click();
    };

    const handleDragOver = (event) => {
      event.preventDefault();
    };

    const handleDrop = (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) {
        if (!validateFile(file)) {
          return;
        }
        setErrorMessage(null);
        setLocalSelectedFile(file);
        onFileUpload(file);
      }
    };

    const renderUploadInformation = () => {
      if (uploadInformation.includes('Sample File')) {
        return (
          <span>
            <Box display="flex" justifyContent="center" gap={0.6}>
              <Typography sx={{ cursor: 'pointer' }}>Choose a file</Typography>
              or drag it here.
            </Box>
            {/* <Typography fontSize="12px">Allowed: .csv files</Typography>
            <Typography fontSize="12px">Max file size: 10 MB</Typography>
            <Typography fontSize="12px"> </Typography>  */}
          </span>
        );
      }
      return uploadInformation;
    };

    return (
      <>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={allowedFileTypes.join(',')}
          style={{ display: 'none' }}
          {...other}
        />
        <Box
          onClick={handleButtonClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          sx={{
            cursor: 'pointer',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 20px 20px 20px',
            borderRadius: 1,
            alignItems: 'center',
            color: 'text.disabled',
            justifyContent: 'center',
            bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            border: (theme) =>
              `dashed 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
            ...(disabled && { opacity: 0.48, pointerEvents: 'none' }),
            ...(error && {
              color: 'error.main',
              borderColor: 'grey',
              bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            }),
          }}
        >
          <Tooltip title="Choose or drag a file here." arrow placement="top">
            <IconButton size="large" component="span" disabled={disabled}>
              <Iconify width={32} icon="eva:cloud-upload-fill" />
            </IconButton>
          </Tooltip>

          <Typography
            variant="span"
            sx={{
              width: '100%',
              wordBreak: 'break-all',
              whiteSpace: 'normal',
              textAlign: 'center',
            }}
          >
            {renderUploadInformation()}
          </Typography>

          {errorMessage && (
            <Typography
              fontSize="12px"
              sx={{
                color: 'error.main',
                textAlign: 'center',
                mt: 1,
                fontSize: '12px',
              }}
            >
              {errorMessage}
            </Typography>
          )}

          {(selectedFile || localSelectedFile) && (
            <Typography
              variant="body1"
              sx={{
                width: '100%',
                wordBreak: 'break-all',
                whiteSpace: 'normal',
                textAlign: 'center',
              }}
            >
              Selected file: {selectedFile ? selectedFile.name : localSelectedFile.name}
            </Typography>
          )}
        </Box>
      </>
    );
  }
);

export default FileUpload;
