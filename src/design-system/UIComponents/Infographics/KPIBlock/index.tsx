import type { FC } from 'react';
import type { SxProps, Theme } from '@mui/material';
import { Box, Typography, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TrendIndicator from '../TrendIndicator';

interface KPIBlockProps {
  label: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  prefix?: string;
  suffix?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  description?: string;
  loading?: boolean;
  sx?: SxProps<Theme>;
}

const KPIBlock: FC<KPIBlockProps> = ({
  label,
  value,
  delta,
  deltaLabel,
  prefix,
  suffix,
  size = 'md',
  color: accentColor,
  description,
  loading = false,
  sx,
}) => {
  const theme = useTheme();

  const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;

  const valueVariant = size === 'sm' ? 'h4' : size === 'md' ? 'h3' : 'h2';
  const labelVariant = size === 'sm' ? 'caption' : size === 'md' ? 'body2' : 'body1';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', ...sx }}>
        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={20} sx={{ mb: 1 }} />
        {description && <Skeleton variant="text" width="90%" height={16} />}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        ...sx,
      }}
    >
      <Typography
        variant={labelVariant}
        sx={{
          color: theme.palette.text.secondary,
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant={valueVariant}
        component="div"
        sx={{
          color: accentColor || theme.palette.text.primary,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'baseline',
          gap: 0.25,
        }}
      >
        {prefix && (
          <Typography
            component="span"
            variant="inherit"
            sx={{ fontSize: '0.6em', opacity: 0.8 }}
          >
            {prefix}
          </Typography>
        )}
        {formattedValue}
        {suffix && (
          <Typography
            component="span"
            variant="inherit"
            sx={{ fontSize: '0.6em', opacity: 0.8 }}
          >
            {suffix}
          </Typography>
        )}
      </Typography>

      {delta !== undefined && (
        <TrendIndicator 
          value={delta} 
          label={deltaLabel} 
          size={size === 'sm' ? 'sm' : 'md'} 
          showBackground={true}
          sx={{ mt: 0.5 }}
        />
      )}

      {description && (
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            mt: 1,
            lineHeight: 1.4,
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
};

export default KPIBlock;
