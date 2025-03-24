import React, { useState } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LoadActionEnum, LoadFormData } from "@/models";

interface NewLoadProps {
  submitHandler: (arg: LoadFormData) => void;
  loadAction: LoadActionEnum;
  loadRequest?: any;
}

const NewLoadForm = ({
  submitHandler,
  loadAction,
  loadRequest,
}: NewLoadProps) => {
  const initalFormData: LoadFormData =
    loadAction === LoadActionEnum.UPDATE_LOAD
      ? {
          ...loadRequest,
          legDate: new Date(loadRequest.legDate),
        }
      : {
          vendorName: "",
          type: "",
          legDate: null,
          deleted: false,
        };
  // Form state
  const [formData, setFormData] = useState<LoadFormData>(initalFormData);

  const labelHeader =
    loadAction === LoadActionEnum.NEW_LOAD ? "Create New Load" : "Update Load";

  // Handle input changes
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof LoadFormData]: value,
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      deleted: event.target.checked,
    }));
  };

  // Handle date change
  const handleDateChange = (newValue: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      legDate: newValue,
    }));
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Basic validation
    if (!formData.vendorName || !formData.type || !formData.legDate) {
      alert("Please fill in all required fields");
      return;
    }
    console.log("Form submitted:", formData);
    submitHandler(formData);
    // Add your API call or logic here
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          maxWidth: 500,
          margin: "auto",
          padding: 3,
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 1,
          display: "flex",
          flexDirection: "column",
          rowGap: "1.5 rem",
        }}
      >
        <Typography variant="h5" gutterBottom align="center">
          {labelHeader}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Vendor Name */}
            <TextField
              label="Vendor Name"
              name="vendorName"
              value={formData.vendorName}
              onChange={handleChange}
              fullWidth
              required
              variant="outlined"
            />

            {/* Type Dropdown */}
            <FormControl fullWidth required>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Type"
              >
                <MenuItem value="">Select a type</MenuItem>
                <MenuItem value="Dry Box">Dry Box</MenuItem>
                <MenuItem value="Tanker">Tanker</MenuItem>
                <MenuItem value="Flatbed">Flatbed</MenuItem>
              </Select>
            </FormControl>

            {/* Leg Date */}
            <DateTimePicker
              label="Leg Date"
              value={formData.legDate}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField {...params} fullWidth required />
              )}
            />

            {/* Deleted Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  name="deleted"
                  checked={formData.deleted}
                  onChange={handleCheckboxChange}
                />
              }
              label="Deleted"
            />

            {/* Submit Button */}
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </LocalizationProvider>
  );
};

export default NewLoadForm;
