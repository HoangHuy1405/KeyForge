import { Box, Card, CardContent, Typography } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

interface ProductDescriptionProps {
  description?: string | null;
}

/**
 * Displays the product description (HTML from WYSIWYG editor)
 */
export default function ProductDescription({ description }: ProductDescriptionProps) {
  if (!description) {
    return null;
  }

  return (
    <Card
      elevation={0}
      sx={{
        backgroundImage:
          'linear-gradient(to bottom right, #eff6ff, #ffffff, #f5f3ff)',
        borderRadius: '12px',
        border: '1px solid #75757536',
      }}
    >
      <Box className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DescriptionOutlinedIcon sx={{ color: 'primary.main' }} />
          Product Description
        </Typography>
      </Box>
      <CardContent sx={{ p: 4 }}>
        <Box
          sx={{
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              marginTop: 2,
              marginBottom: 1,
              fontWeight: 600,
            },
            '& p': {
              marginBottom: 1.5,
              lineHeight: 1.7,
            },
            '& ul, & ol': {
              paddingLeft: 3,
              marginBottom: 1.5,
            },
            '& li': {
              marginBottom: 0.5,
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'underline',
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 1,
              marginY: 2,
            },
            '& table': {
              width: '100%',
              borderCollapse: 'collapse',
              marginY: 2,
            },
            '& th, & td': {
              border: '1px solid',
              borderColor: 'divider',
              padding: 1,
            },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              paddingLeft: 2,
              marginY: 2,
              fontStyle: 'italic',
              color: 'text.secondary',
            },
            '& code': {
              backgroundColor: 'grey.100',
              padding: '2px 6px',
              borderRadius: 1,
              fontFamily: 'monospace',
            },
            '& pre': {
              backgroundColor: 'grey.100',
              padding: 2,
              borderRadius: 1,
              overflow: 'auto',
            },
          }}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </CardContent>
    </Card>
  );
}
