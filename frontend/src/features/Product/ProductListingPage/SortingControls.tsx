import * as React from 'react';
import {
  Paper,
  Stack,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';

export type SortOption =
  | 'relevance'
  | 'inventory.price,asc'
  | 'inventory.price,desc'
  | 'newest'
  | 'top-sales';
export type ViewMode = 'grid' | 'list';

interface SortingControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalResults: number;
}

export function SortingControls({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalResults,
}: SortingControlsProps) {
  const theme = useTheme();

  const handleSortChange = (e: SelectChangeEvent) =>
    onSortChange(e.target.value as SortOption);

  const handleViewChange = (
    _e: React.MouseEvent<HTMLElement>,
    next: ViewMode | null,
  ) => {
    if (next) onViewModeChange(next);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        py: 2,
        px: 4,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Typography color="text.secondary">
        {totalResults.toLocaleString()} products found
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center">
        {/* Sort by */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Sort by:
          </Typography>
          <FormControl size="small">
            <Select
              value={sortBy}
              onChange={handleSortChange}
              sx={{
                width: 160, // ~ w-40
                bgcolor: 'background.default', // ~ bg-gray-50
                borderRadius: 1.5,
                '& .MuiOutlinedInput-notchedOutline': { border: 0 }, // border-0
              }}
            >
              <MenuItem value="relevance">Relevance</MenuItem>
              <MenuItem value="inventory.price,asc">
                Price: Low to High
              </MenuItem>
              <MenuItem value="inventory.price,desc">
                Price: High to Low
              </MenuItem>
              <MenuItem value="createdAt,desc">Latest</MenuItem>
              <MenuItem value="top-sales">Top Sales</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* View mode toggles */}
        <Box sx={{ bgcolor: 'background.default', p: 0.5, borderRadius: 1.5 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                p: 0.5,
                minWidth: 32,
                height: 32, // ~ size-8
                border: 0,
                '&.Mui-selected': {
                  background: (theme) => theme.palette.gradient,
                  color: 'primary.contrastText',
                  '&:hover': { opacity: 0.8 },
                },
              },
            }}
          >
            <ToggleButton value="grid" aria-label="Grid view">
              <GridViewRoundedIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="list" aria-label="List view">
              <ViewListRoundedIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Stack>
    </Paper>
  );
}
