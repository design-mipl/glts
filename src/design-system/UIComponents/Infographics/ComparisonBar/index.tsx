import type { FC } from 'react';
import { useEffect, useState } from 'react';
import type { SxProps, Theme } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

interface ComparisonBarProps {
  leftLabel: string;
  rightLabel: string;
  leftValue: number;
  rightValue: number;
  leftColor?: string; // default primary
  rightColor?: string; // default secondary
  height?: number; // default 8px
  showLabels?: boolean;
  showValues?: boolean;
  showPercentages?: boolean;
  animated?: boolean;
  sx?: SxProps<Theme>;
}

const ComparisonBar: FC<ComparisonBarProps> = ({
  leftLabel,
  rightLabel,
  leftValue,
  rightValue,
  leftColor,
  rightColor,
  height = 8,
  showLabels = true,
  showValues = true,
  showPercentages = true,
  animated = true,
  sx,
}) => {
  const theme = useTheme();
  
  const total = leftValue + rightValue;
  const leftPercentTarget = total > 0 ? (leftValue / total) * 100 : 50;
  
  // Start from center (50/50) if animated, or jump to target
  const [leftPercent, setLeftPercent] = useState(animated ? 50 : leftPercentTarget);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setLeftPercent(leftPercentTarget);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setLeftPercent(leftPercentTarget);
    }
  }, [leftPercentTarget, animated]);

  // Use provided colors or fallback to theme primary/secondary
  const lColor = leftColor || theme.palette.primary.main;
  // If no secondary color in theme, use another primary variant or warning
  const rColor = rightColor || theme.palette.secondary?.main || theme.palette.info.main;

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {showLabels && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'flex-end' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary, lineHeight: 1.2 }}>
              {leftLabel}
            </Typography>
            {showValues && (
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                {leftValue.toLocaleString()}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary, lineHeight: 1.2 }}>
              {rightLabel}
            </Typography>
            {showValues && (
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                {rightValue.toLocaleString()}
              </Typography>
            )}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          height,
          width: '100%',
          display: 'flex',
          borderRadius: '9999px',
          overflow: 'hidden',
          backgroundColor: alpha(theme.palette.divider, 0.1),
        }}
      >
        <Box
          sx={{
            width: `${leftPercent}%`,
            height: '100%',
            backgroundColor: lColor,
            transition: animated ? 'width 1s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
          }}
        />
        <Box
          sx={{
            flex: 1,
            height: '100%',
            backgroundColor: rColor,
            transition: animated ? 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
          }}
        />
      </Box>

      {showPercentages && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 600, fontSize: '10px' }}>
            {leftPercentTarget.toFixed(0)}%
          </Typography>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 600, fontSize: '10px' }}>
            {(100 - leftPercentTarget).toFixed(0)}%
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ComparisonBar;
