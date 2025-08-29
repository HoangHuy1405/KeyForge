// ResultsFooter.tsx
import * as React from 'react';
import { Box, Stack, Typography, Pagination } from '@mui/material';

export interface Meta {
  page: number; // 0-based
  pageSize: number;
  pages: number; // total pages
  total: number; // total items
}

interface ResultsFooterProps {
  meta: Meta;
  /** Called with 0-based page index */
  onPageChange: (pageZeroBased: number) => void;
  className?: string; // optional if you're mixing Tailwind
}

export default function ResultsFooter({
  meta,
  onPageChange,
  className,
}: ResultsFooterProps) {
  const start = meta.total === 0 ? 0 : meta.page * meta.pageSize + 1;
  const end = Math.min(meta.total, (meta.page + 1) * meta.pageSize);

  return (
    <Box
      className={className}
      sx={{
        mt: 3,
        pt: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack direction="column" alignItems="center" spacing={1.5}>
        <Typography variant="body2" color="text.secondary">
          Showing {start.toLocaleString()}–{end.toLocaleString()} of{' '}
          {meta.total.toLocaleString()} products
        </Typography>

        {meta.pages > 1 && (
          <Pagination
            count={meta.pages} // total pages from server
            page={meta.page + 1} // convert to 1-based for UI
            onChange={(_, uiPage) => onPageChange(uiPage - 1)}
            color="primary"
            shape="rounded"
            siblingCount={1}
            boundaryCount={1}
            showFirstButton
            showLastButton
          />
        )}
      </Stack>
    </Box>
  );
}
