import React from 'react';
import { Logistic } from '../../../services/interfaces/productInterfaces';
import { Box, Card, CardContent, Chip } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BoltIcon from '@mui/icons-material/Bolt';
import GppGoodIcon from '@mui/icons-material/GppGood';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface props {
  logistics: Logistic;
}

export default function ShippingDetails({ logistics }: props) {
  return (
    <div className="mb-16">
      <Card
        elevation={0}
        sx={{
          backgroundImage:
            'linear-gradient(to bottom right, #eff6ff, #ffffff, #f5f3ff)',
          borderRadius: '12px',
          border: '1px solid #75757536',
        }}
      >
        <Box className="border-b bg-gradient-to-r from-green-50 to-emerald-50 p-8">
          <h2 className="flex items-center gap-2">
            <LocalShippingIcon className="h-5 w-5 text-green-600" />
            Shipping & Returns Policy
          </h2>
        </Box>
        <CardContent className="mt-2">
          <div className="grid grid-cols-1 gap-12 p-4 lg:grid-cols-2">
            {/* Shipping Options */}
            <div className="space-y-6">
              <div>
                <h4 className="mb-6 flex items-center gap-2 text-slate-700">
                  <Inventory2OutlinedIcon className="h-4 w-4" />
                  Available Shipping Options
                </h4>
                <div className="space-y-4">
                  <div className="rounded-lg border bg-gradient-to-r from-gray-50 to-slate-50 p-4 transition-shadow hover:shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AccessTimeIcon className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">Economy Shipping</span>
                      </div>
                      {!logistics.shipping.economy && (
                        <Chip
                          label="Not supported"
                          className="bg-green-100 text-green-800"
                        />
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      7-10 business days
                    </p>
                  </div>
                  <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-cyan-50 p-4 transition-shadow hover:shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LocalShippingIcon className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Standard Shipping</span>
                      </div>
                      {!logistics.shipping.regular && (
                        <Chip
                          label="Not supported"
                          className="bg-green-100 text-green-800"
                        />
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      3-5 business days
                    </p>
                  </div>
                  <div className="rounded-lg border bg-gradient-to-r from-purple-50 to-pink-50 p-4 transition-shadow hover:shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BoltIcon className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">Express Shipping</span>
                      </div>
                      {!logistics.shipping.fast && (
                        <Chip
                          label="Not supported"
                          className="bg-green-100 text-green-800"
                        />
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      1-2 business days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Returns Policy */}
            <div className="space-y-6">
              <div>
                <h4 className="mb-6 flex items-center gap-2 text-slate-700">
                  <GppGoodIcon className="h-4 w-4" />
                  Return & Exchange Policy
                </h4>
                <div className="space-y-4">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">
                        30-Day Returns
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      Full refund for unused items in original packaging
                    </p>
                  </div>

                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <GppGoodIcon className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        Free Return Shipping
                      </span>
                    </div>
                    <p className="text-sm text-blue-700">
                      For defective or damaged products
                    </p>
                  </div>

                  <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <AccessTimeIcon className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-orange-800">
                        Quick Processing
                      </span>
                    </div>
                    <p className="text-sm text-orange-700">
                      3-5 business days after we receive your return
                    </p>
                  </div>

                  <div className="mt-4 rounded-lg bg-gray-50 p-3">
                    <p className="text-muted-foreground text-xs">
                      <strong>Note:</strong> Items must be returned in original
                      packaging with all accessories and documentation included.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
