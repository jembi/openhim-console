import React, { useState } from 'react';
import { sub } from 'date-fns';
import { Box, Radio, RadioGroup, FormControlLabel, TextField, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import { Stack } from '@mui/system';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { TimeSeriesScale } from '../../types';
import { getTimeDiffScale } from '../../utils';

export type BasicFilterData = {
  period: TimeSeriesScale;
  from: Date;
  until: Date;
  option: BasicFilterOption;
}

export type BasicFilterProps = {
  value?: BasicFilterData;
  onChange: (data: BasicFilterData) => unknown;
}

export type BasicFilterOption = '1h' | '1d' | '1w' | '1m' | '1y' | '5y' | 'custom';


function unwrapFilterDataOrDefault(value?: BasicFilterData): BasicFilterData {
  if (!value) {
    const now = new Date();
    return {
      period: TimeSeriesScale.minute,
      from: sub(now, { hours: 1 }),
      until: now,
    	option: '1h',
    };
  }

  return value;
}

function FilterComponent(props: BasicFilterProps) {
  const initData = unwrapFilterDataOrDefault(props.value);
  const [selectedOption, setSelectedOption] = useState<BasicFilterOption>(initData.option);
  const [breakdown, setBreakdown] = useState(initData.period);
  const [fromDate, setFromDate] = useState<Date>(initData.from);
  const [untilDate, setUntilDate] = useState<Date>(initData.until);

  React.useEffect(() => {
    
  }, []);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOption = (event.target as HTMLInputElement).value as BasicFilterOption;
    const now = new Date();

    setSelectedOption(selectedOption);

    if (selectedOption === 'custom') {
      return;
    }

    let from = now;

    switch (selectedOption) {
      case '1h':
        from = sub(from, { hours: 1 });
        break;
      case '1d':
        from = sub(from, { days: 1 });
        break;
      case '1w':
        from = sub(from, { weeks: 1 });
        break;
      case '1m':
        from = sub(from, { months: 1 });
        break;
      case '1y':
        from = sub(from, { years: 1 });
        break;
      case '5y':
        from = sub(from, { years: 5 });
        break;
    }
    
    const data: BasicFilterData = {
      period: optionToPeriod(selectedOption),
      from,
      until: now,
      option: selectedOption,
    }

    setFromDate(data.from);
    setUntilDate(data.until);

    props.onChange(data);
  };

  const handleBreakdownChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBreakdown(event.target.value as TimeSeriesScale);
  };

  const handleFromDateChange = (date: Date) => {
    setFromDate(date);
  };

  const handleUntilDateChange = (date: Date) => {
    setUntilDate(date);
  };

  const handleApplyFilters = () => {
    const data: BasicFilterData = {
      period: optionToPeriod(selectedOption),
      from: new Date(fromDate),
      until: new Date(untilDate),
      option: selectedOption,
    }

    props.onChange(data);
  };

  const optionToPeriod = (option: BasicFilterOption): TimeSeriesScale => {
    switch (option) {
      case '1h': return TimeSeriesScale.minute;
      case '1d': return TimeSeriesScale.hour;
      case '1w': return TimeSeriesScale.day;
      case '1m': return TimeSeriesScale.day;
      case '1y': return TimeSeriesScale.month;
      case '5y': return TimeSeriesScale.year;
      default:
        return getTimeDiffScale(fromDate, untilDate).scale;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ padding: 2, backgroundColor: '#fff', borderRadius: 1, boxShadow: 1 }}>
        <RadioGroup row value={selectedOption} onChange={handleOptionChange}>
          <FormControlLabel value="1h" control={<Radio />} label="1h" />
          <FormControlLabel value="1d" control={<Radio />} label="1d" />
          <FormControlLabel value="1w" control={<Radio />} label="1w" />
          <FormControlLabel value="1m" control={<Radio />} label="1m" />
          <FormControlLabel value="1y" control={<Radio />} label="1y" />
          <FormControlLabel value="5y" control={<Radio />} label="5y" />
          <FormControlLabel value="custom" control={<Radio />} label="Custom" />
        </RadioGroup>
        {selectedOption === 'custom' && (
          <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="breakdown-label">Breakdown</InputLabel>
              <Select
                labelId="breakdown-label"
                value={breakdown}
                onChange={handleBreakdownChange}
                label="Breakdown"
              >
                <MenuItem value={TimeSeriesScale.hour}>Hour</MenuItem>
                <MenuItem value={TimeSeriesScale.day}>Day</MenuItem>
                <MenuItem value={TimeSeriesScale.week}>Week</MenuItem>
                <MenuItem value={TimeSeriesScale.month}>Month</MenuItem>
                <MenuItem value={TimeSeriesScale.year}>Year</MenuItem>
              </Select>
            </FormControl>
            <DateTimePicker
              label="From"
              disableFuture
              value={fromDate}
              onChange={handleFromDateChange}
            />
            <DateTimePicker
              label="Until"
              disableFuture
              value={untilDate}
              onChange={handleUntilDateChange}
            />
            <Button variant="contained" color="primary" onClick={handleApplyFilters} sx={{ alignSelf: 'flex-end' }}>
              Apply
            </Button>
          </Stack>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default FilterComponent;
