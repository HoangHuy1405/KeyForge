import { LocationOnOutlined } from '@mui/icons-material'
import { Box, Card } from '@mui/material'
import React from 'react'

export default function UserAddressCard() {
    return (
        <Card>
            <Box className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 p-8">
                <h2 className="flex items-center gap-2">
                    <LocationOnOutlined className="h-5 w-5 text-blue-600" />
                    Address
                </h2>
            </Box>
        </Card>
    )
}
