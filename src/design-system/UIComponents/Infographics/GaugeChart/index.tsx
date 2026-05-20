import type { FC } from 'react';
import { useEffect, useState } from 'react';
import type { SxProps, Theme } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface GaugeChartProps {
  value: number; // current value
  min?: number; // default 0
  max?: number; // default 100
  size?: number; // diameter, default 200
  thickness?: number; // default 20
  color?: string; // defaults to primary
  ranges?: {
    from: number;
    to: number;
    color: string;
    label?: string;
  }[];
  label?: string;
  valueFormat?: (v: number) => string;
  animated?: boolean;
  sx?: SxProps<Theme>;
}

const GaugeChart: FC<GaugeChartProps> = ({
  value,
  min = 0,
  max = 100,
  size = 200,
  thickness = 20,
  color,
  ranges,
  label,
  valueFormat,
  animated = true,
  sx,
}) => {
  const theme = useTheme();
  // Animation value starts at min
  const [displayValue, setDisplayValue] = useState(animated ? min : value);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated, min]);

  const radius = size / 2 - thickness;
  const cx = size / 2;
  const cy = size / 2 + size * 0.15; // Shifted down to fit more of the labels/value

  const polarToCartesian = (centerX: number, centerY: number, r: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + r * Math.cos(angleInRadians),
      y: centerY + r * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, r, endAngle);
    const end = polarToCartesian(x, y, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    const d = [
      'M', start.x, start.y,
      'A', r, r, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');
    return d;
  };

  // 180-degree arc from bottom-left to bottom-right
  const startAngle = -180;
  const endAngle = 0;
  
  const percentage = Math.min(1, Math.max(0, (displayValue - min) / (max - min)));
  const currentAngle = startAngle + percentage * 180;

  const activeColor = color || theme.palette.primary.main;
  const trackColor = theme.palette.divider;

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: size,
        height: size * 0.7,
        overflow: 'hidden',
        ...sx,
      }}
    >
      <svg width={size} height={size * 0.8} style={{ overflow: 'visible' }}>
        {/* Track Arc */}
        <path
          d={describeArc(cx, cy, radius, startAngle, endAngle)}
          fill="none"
          stroke={trackColor}
          strokeWidth={thickness}
          strokeLinecap="round"
        />

        {/* Ranges (if provided) */}
        {ranges?.map((range, i) => {
          const rStart = startAngle + (Math.max(min, range.from) - min) / (max - min) * 180;
          const rEnd = startAngle + (Math.min(max, range.to) - min) / (max - min) * 180;
          return (
            <path
              key={i}
              d={describeArc(cx, cy, radius, rStart, rEnd)}
              fill="none"
              stroke={range.color}
              strokeWidth={thickness}
              // Neutralize caps to prevent overlap inside ranges
            />
          );
        })}

        {/* Progress Arc (only if no ranges) */}
        {!ranges && (
          <path
            d={describeArc(cx, cy, radius, startAngle, currentAngle)}
            fill="none"
            stroke={activeColor}
            strokeWidth={thickness}
            strokeLinecap="round"
            style={{
              transition: animated ? 'all 1s ease-out' : 'none',
            }}
          />
        )}

        {/* Needle */}
        <g
          style={{
            transform: `rotate(${currentAngle}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: animated ? 'transform 1s ease-out' : 'none',
          }}
        >
          {/* Main needle */}
          <line
            x1={cx}
            y1={cy}
            x2={cx + radius} // Shorten needle slightly
            y2={cy}
            stroke={theme.palette.text.primary}
            strokeWidth={3}
            strokeLinecap="round"
          />
          {/* Needle pivot */}
          <circle cx={cx} cy={cy} r={5} fill={theme.palette.text.primary} />
          <circle cx={cx} cy={cy} r={2} fill={theme.palette.background.paper} />
        </g>
      </svg>

      <Box
        sx={{
          position: 'absolute',
          bottom: 15, // Corrected position to sit in the center of the arc
          left: 0,
          right: 0,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700, 
            color: theme.palette.text.primary,
            fontSize: `${size * 0.16}px`,
            lineHeight: 1,
          }}
        >
          {valueFormat ? valueFormat(value) : Math.round(value)}
        </Typography>
        {label && (
          <Typography 
            variant="caption" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontWeight: 500,
              mt: 0.5,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: `${Math.max(10, size * 0.05)}px`
            }}
          >
            {label}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default GaugeChart;
