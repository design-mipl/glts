import type { FC, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { SxProps, Theme } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface ProgressRingProps {
  value: number; // 0-100
  size?: number; // diameter px, default 120
  thickness?: number; // stroke width, default 8
  color?: string; // defaults to primary.main
  trackColor?: string; // bg ring color
  label?: string; // center bottom text
  children?: ReactNode; // center content
  showValue?: boolean; // show % in center
  animated?: boolean; // animate on mount
  sx?: SxProps<Theme>;
}

const ProgressRing: FC<ProgressRingProps> = ({
  value,
  size = 120,
  thickness = 8,
  color,
  trackColor,
  label,
  children,
  showValue = false,
  animated = true,
  sx,
}) => {
  const theme = useTheme();
  // Start with full offset for animation
  const radius = (size - thickness) / 2;
  const circumference = radius * 2 * Math.PI;
  const [offset, setOffset] = useState(circumference);

  const safeValue = Math.min(100, Math.max(0, value));
  const targetOffset = circumference - (safeValue / 100) * circumference;

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setOffset(targetOffset);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setOffset(targetOffset);
    }
  }, [targetOffset, animated]);

  const activeColor = color || theme.palette.primary.main;
  const inactiveColor = trackColor || theme.palette.divider;

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        ...sx,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={inactiveColor}
          strokeWidth={thickness}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={activeColor}
          strokeWidth={thickness}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: animated ? 'stroke-dashoffset 1s ease-out' : 'none',
          }}
        />
      </svg>

      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
          px: thickness,
        }}
      >
        {showValue && !children && (
          <Typography
            variant="h4"
            component="div"
            sx={{ 
              fontWeight: 700, 
              color: theme.palette.text.primary,
              fontSize: `${size * 0.2}px`,
              lineHeight: 1,
            }}
          >
            {Math.round(safeValue)}%
          </Typography>
        )}
        {children}
        {label && (
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
              mt: showValue || children ? 0.5 : 0,
              maxWidth: size - thickness * 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: `${Math.max(10, size * 0.08)}px`,
            }}
          >
            {label}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProgressRing;
