// components/CheckboxFilterSection.tsx
import * as React from 'react';
import {
  Box,
  Checkbox,
  Stack,
  Typography,
  FormControlLabel,
  useTheme,
} from '@mui/material';

type Props = {
  title: string;
  idPrefix: string; // e.g. "category", "location", "brand"
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  maxHeight?: number; // default 120
};

const safeId = (prefix: string, value: string) =>
  `${prefix}-${value}`.replace(/\s+/g, '-').toLowerCase();

export default function CheckboxFilterSection({
  title,
  idPrefix,
  options,
  selected,
  onToggle,
  maxHeight = 120,
}: Props) {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="body2" fontWeight={600} mb={1}>
        {title}
      </Typography>

      <Box sx={{ maxHeight, overflowY: 'auto' }}>
        <Stack>
          {options.map((opt) => {
            const checked = selected.includes(opt);
            const id = safeId(idPrefix, opt);

            return (
              <FormControlLabel
                key={opt}
                sx={{ m: 0, alignItems: 'center' }}
                label={<Typography sx={{ fontSize: 14 }}>{opt}</Typography>}
                control={
                  <Checkbox
                    id={id}
                    checked={checked}
                    onChange={() => onToggle(opt)}
                    size="small"
                    sx={{
                      '& .MuiSvgIcon-root': {
                        borderRadius: 1,
                        backgroundColor: theme.palette.input_background,
                      },
                      '&.Mui-checked .MuiSvgIcon-root': {
                        borderRadius: 1,
                        backgroundColor: theme.palette.input_background,
                        color: '#3a3a3a',
                      },
                    }}
                  />
                }
              />
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
