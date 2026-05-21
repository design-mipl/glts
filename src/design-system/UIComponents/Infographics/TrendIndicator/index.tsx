import type { FC } from 'react';
import type { SxProps, Theme } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BORDER_RADIUS } from '../../../tokens';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendIndicatorProps {
  value: number;
  label?: string;
  format?: 'percent' | 'number' | 'currency';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showBackground?: boolean;
  invertColors?: boolean;
  sx?: SxProps<Theme>;
}

const TrendIndicator: FC<TrendIndicatorProps> = ({
  value,
  label,
  format = 'percent',
  size = 'md',
  showIcon = true,
  showBackground = false,
  invertColors = false,
  sx,
}) => {
  const theme = useTheme();

  const isPositive = value > 0;
  const isNegative = value < 0;
  let color = theme.palette.text.secondary;
  if (isPositive) {
    color = invertColors ? theme.palette.error.main : theme.palette.success.main;
  } else if (isNegative) {
    color = invertColors ? theme.palette.success.main : theme.palette.error.main;
  }

  const getFormatValue = () => {
    const absValue = Math.abs(value);
    if (format === 'percent') return `${absValue}%`;
    if (format === 'currency') return `$${absValue.toLocaleString()}`;
    return absValue.toLocaleString();
  };

  const getIcon = () => {
    if (!showIcon) return null;
    const iconSize = size === 'sm' ? 14 : size === 'md' ? 16 : 18;

    if (isPositive) return <TrendingUp size={iconSize} style={{ marginRight: 4 }} />;
    if (isNegative) return <TrendingDown size={iconSize} style={{ marginRight: 4 }} />;
    return <Minus size={iconSize} style={{ marginRight: 4 }} />;
  };

  const fontSize = size === 'sm' ? '11px' : size === 'md' ? '12px' : '14px';

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: showBackground ? '2px 8px' : 0,
        borderRadius: showBackground ? BORDER_RADIUS.xs : 0,
        backgroundColor: showBackground ? `${color}1A` : 'transparent',
        color,
        ...sx,
      }}
    >
      {getIcon()}
      <Typography
        variant="caption"
        sx={{
          fontSize,
          fontWeight: 600,
          lineHeight: 1,
        }}
      >
        {isPositive ? '+' : isNegative ? '-' : ''}
        {getFormatValue()}
      </Typography>
      {label && (
        <Typography
          variant="caption"
          sx={{
            ml: 0.5,
            fontSize,
            color: theme.palette.text.secondary,
            fontWeight: 400,
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
};

export default TrendIndicator;
