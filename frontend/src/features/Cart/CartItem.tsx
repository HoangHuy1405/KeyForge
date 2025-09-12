import { useState } from 'react';
import {
  Box,
  Paper,
  Checkbox,
  IconButton,
  TextField,
  Typography,
  Button,
  Stack,
  useTheme,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import {
  CartItemData,
  decreaseItemQuantity,
  deleteItem,
  increaseItemQuantity,
  setItemSelected,
} from '../../redux/slice/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useCartActions } from '../../hooks/useCartActions';
import { isFavorite, toggleFavorite } from '../../redux/slice/favoriteSlice';
import { mapFromCartItemToProductFavorite } from '../Product/productMappers';
import { useAppSelector } from '../../hooks/hooks';
import QuantityControl from '../../components/QuantityControl';

interface CartItemProps {
  item: CartItemData;
}

export function CartItem({ item }: CartItemProps) {
  const theme = useTheme();
  const { handleRemoveItem } = useCartActions();
  const dispatch = useDispatch();
  const isFav = useAppSelector(isFavorite(item.id));

  const totalPrice = item.unitPrice * item.quantity;

  return (
    <Paper
      elevation={2}
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        {/* Checkbox */}
        <Checkbox
          checked={item.selected}
          onChange={(e) => dispatch(setItemSelected(item.id))}
          sx={{
            flexShrink: 0,
            color: '#9e9e9e', // grey for border & unchecked state
            '&.Mui-checked': {
              color: '#000000', // black when checked
            },
            '& .MuiSvgIcon-root': {
              backgroundColor: '#ffffff', // always white background
              borderRadius: '4px',
            },
          }}
        />

        {/* Product Info */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          flex={1}
          minWidth={0}
        >
          <Box
            sx={{
              flexShrink: 0,
              width: 64,
              height: 64,
              borderRadius: 1,
              overflow: 'hidden',
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1, maxWidth: 200 }}>
            <Typography
              variant="subtitle1"
              title={item.name} // tooltip shows full name
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
              }}
            >
              {item.name}
            </Typography>
          </Box>
        </Stack>

        {/* Unit Price */}
        <Box sx={{ textAlign: 'right', minWidth: 80, flexShrink: 0 }}>
          <Typography variant="body1">${item.unitPrice.toFixed(2)}</Typography>
        </Box>

        {/* Quantity Controls */}
        {/* <Box sx={{ flexShrink: 0 }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <IconButton
              size="small"
              onClick={() => dispatch(decreaseItemQuantity(item.id))}
              disabled={item.quantity < 1}
              color="inherit"
              sx={{
                width: 32,
                height: 32,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
              }}
            >
              <RemoveIcon fontSize="inherit" />
            </IconButton>

            <TextField
              type="number"
              value={item.quantity}
              disabled={true}
              size="small"
              sx={{
                width: 40,
                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                  {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                '& input[type=number]': {
                  MozAppearance: 'textfield',
                },
                '& .MuiOutlinedInput-root': {
                  height: 32,
                },
              }}
            />

            <IconButton
              size="small"
              onClick={() => dispatch(increaseItemQuantity(item.id))}
              disabled={item.quantity < 1}
              color="inherit"
              sx={{
                width: 32,
                height: 32,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
              }}
            >
              <AddIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        </Box> */}
        <QuantityControl
          value={item.quantity}
          min={1}
          max={99}
          onDecrease={() => dispatch(decreaseItemQuantity(item.id))}
          onIncrease={() => dispatch(increaseItemQuantity(item.id))}
          // disabled={itemIsLocked} // optional
          size="small"
        />

        {/* Total Price */}
        <Box sx={{ textAlign: 'right', minWidth: 80, flexShrink: 0 }}>
          <Typography variant="body1">${totalPrice.toFixed(2)}</Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ flexShrink: 0 }}>
          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              onClick={() =>
                dispatch(toggleFavorite(mapFromCartItemToProductFavorite(item)))
              }
              sx={{
                width: 32,
                height: 32,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
              }}
            >
              {isFav ? (
                <FavoriteIcon fontSize="small" sx={{ color: 'error.main' }} />
              ) : (
                <FavoriteBorderIcon
                  fontSize="small"
                  sx={{ color: 'grey.700' }}
                />
              )}
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleRemoveItem(item.id)}
              sx={{
                width: 32,
                height: 32,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                color: (theme) => theme.palette.error.main,
                '&:hover': { color: (theme) => theme.palette.error.main },
              }}
            >
              <DeleteOutlineIcon fontSize="inherit" />
            </IconButton>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
