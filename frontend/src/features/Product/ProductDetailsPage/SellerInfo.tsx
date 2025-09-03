import * as React from 'react';
import {
  Box,
  Card,
  Avatar,
  Typography,
  Button,
  Stack,
  useTheme,
  Chip,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneCallbackOutlinedIcon from '@mui/icons-material/PhoneCallbackOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';

export type SellerInfo = {
  id: string;
  username: string;
  email: string;
  phoneNum: string;
  avatarUrl: string;
};

type SellerInformationCardProps = {
  seller: SellerInfo;
  onContactSeller?: () => void;
  onViewStore?: () => void;
  title?: string;
};

export default function SellerInfo({ seller }: SellerInformationCardProps) {
  const rating = 4.6;
  const totalSales = 1231;
  const responseTime = '< 1 day';
  const memberSince = '2018';

  return (
    <Card
      elevation={0}
      sx={{
        backgroundImage:
          'linear-gradient(to bottom right, #eff6ff, #ffffff, #f5f3ff)',
        padding: 3,
        borderRadius: '12px',
        border: '1px solid #75757536',
      }}
    >
      <Box mb={2}>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2">
            <InfoOutlinedIcon className="h-5 w-5 text-blue-600" />
            Seller Information
          </h2>
          <Chip label="Verified Seller" variant="outlined"></Chip>
        </div>
      </Box>
      <Box>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Seller Profile */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center space-y-4 rounded-xl border bg-white p-6 text-center shadow-sm">
              <Avatar
                className="h-40 w-40 border-4 border-white shadow-lg"
                src={seller.avatarUrl}
                alt={seller.username}
                sx={{ width: 64, height: 64 }}
              />
              <div>
                <h3 className="text-lg">{seller.username}</h3>
                <p className="text-muted-foreground text-sm">
                  @{seller.username}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <StarOutlinedIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{rating}</span>
                <span className="text-muted-foreground text-xs">
                  ({totalSales} sales)
                </span>
              </div>
            </div>
          </div>

          {/* Contact & Stats */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-2">
            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-base">
                <ChatBubbleOutlineOutlinedIcon className="h-4 w-4 text-blue-600" />
                Contact Information
              </h4>
              <div className="grid grid-rows-2 gap-3 space-y-1">
                <div className="flex items-center gap-3 rounded-lg border bg-white p-3 transition-shadow hover:shadow-sm">
                  <EmailOutlinedIcon className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-muted-foreground text-xs">Email</p>
                    <p className="text-sm">{seller.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border bg-white p-3 transition-shadow hover:shadow-sm">
                  <PhoneCallbackOutlinedIcon className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-muted-foreground text-xs">Phone</p>
                    <p className="text-sm">{seller.phoneNum}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Stats */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-base">
                <Inventory2OutlinedIcon className="h-4 w-4 text-green-600" />
                Seller Stats
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border bg-white p-3 text-center">
                  <p className="text-xl">{totalSales}</p>
                  <p className="text-muted-foreground text-xs">Total Sales</p>
                </div>
                <div className="rounded-lg border bg-white p-3 text-center">
                  <p className="text-xl">{responseTime}</p>
                  <p className="text-muted-foreground text-xs">Response Time</p>
                </div>
                <div className="rounded-lg border bg-white p-3 text-center">
                  <p className="text-xl">{rating}</p>
                  <p className="text-muted-foreground text-xs">Rating</p>
                </div>
                <div className="rounded-lg border bg-white p-3 text-center">
                  <p className="text-xl">{memberSince}</p>
                  <p className="text-muted-foreground text-xs">Member Since</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button className="flex-1" variant="contained" color="inherit">
            <ChatBubbleOutlineOutlinedIcon className="mr-2 h-4 w-4" />
            Contact Seller
          </Button>
          <Button variant="contained">
            <PublicOutlinedIcon className="mr-2 h-4 w-4" />
            View Store
          </Button>
        </div>
      </Box>
    </Card>
  );
}

/** Helper: contact info row */
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{
        p: 1.25,
        bgcolor: 'background.paper',
        borderRadius: 1.5,
        border: `1px solid ${theme.palette.divider}`,
        transition: 'box-shadow .2s ease',
        '&:hover': { boxShadow: theme.shadows[1] },
      }}
    >
      <Box sx={{ display: 'grid', placeItems: 'center' }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2">{value}</Typography>
      </Box>
    </Stack>
  );
}
