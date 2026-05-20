import type { FC } from 'react';
import type { SxProps, Theme } from '@mui/material';
import { Box, Typography, Tooltip, Skeleton } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import dayjs from 'dayjs';

interface HeatmapItem {
  date: string; // ISO date string
  value: number;
  label?: string; // tooltip text
}

interface HeatmapProps {
  data: HeatmapItem[];
  startDate?: Date;
  endDate?: Date;
  colorScale?: string[]; // 5 colors light→dark
  emptyColor?: string;
  cellSize?: number; // default 12px
  cellGap?: number; // default 2px
  showMonthLabels?: boolean;
  showDayLabels?: boolean;
  tooltipFormat?: (item: HeatmapItem) => string;
  loading?: boolean;
  sx?: SxProps<Theme>;
}

const Heatmap: FC<HeatmapProps> = ({
  data,
  startDate,
  endDate,
  colorScale: customColorScale,
  emptyColor,
  cellSize = 12,
  cellGap = 2,
  showMonthLabels = true,
  showDayLabels = true,
  tooltipFormat,
  loading = false,
  sx,
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', gap: cellGap, ...sx }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <Box key={i} sx={{ display: 'flex', flexDirection: 'column', gap: cellGap }}>
            {Array.from({ length: 7 }).map((_, j) => (
              <Skeleton key={j} variant="rectangular" width={cellSize} height={cellSize} sx={{ borderRadius: '2px' }} />
            ))}
          </Box>
        ))}
      </Box>
    );
  }

  const end = endDate ? dayjs(endDate) : dayjs();
  const start = startDate ? dayjs(startDate) : end.subtract(1, 'year').add(1, 'day');

  // Generate grid mapping
  const days = [];
  let current = start.startOf('day');
  while (current.isBefore(end) || current.isSame(end, 'day')) {
    days.push(current);
    current = current.add(1, 'day');
  }

  const dataMap = new Map<string, HeatmapItem>();
  data.forEach(item => {
    dataMap.set(dayjs(item.date).format('YYYY-MM-DD'), item);
  });

  // Default color scale: 5 shades of primary
  const defaultColorScale = [
    alpha(theme.palette.primary.main, 0.2),
    alpha(theme.palette.primary.main, 0.4),
    alpha(theme.palette.primary.main, 0.6),
    alpha(theme.palette.primary.main, 0.8),
    theme.palette.primary.main,
  ];

  const colors = customColorScale || defaultColorScale;
  const inactiveCellColor = emptyColor || (theme.palette.mode === 'dark' ? alpha(theme.palette.divider, 0.5) : alpha(theme.palette.divider, 0.3));

  const getColor = (value: number) => {
    if (value <= 0) return inactiveCellColor;
    // Map value to scale (assuming values are small integers or we use buckets)
    // For this implementation, we'll use value as direct index clamped to scale size
    const index = Math.min(Math.floor(value), colors.length - 1);
    return colors[index];
  };

  // Group columns (weeks)
  const columns: dayjs.Dayjs[][] = [];
  let currentColumn: dayjs.Dayjs[] = [];

  // Padding for the first week
  const firstDay = days[0].day(); // 0: Sun, 1: Mon, etc.
  for (let i = 0; i < firstDay; i++) {
    currentColumn.push(null as any);
  }

  days.forEach(day => {
    if (currentColumn.length === 7) {
      columns.push(currentColumn);
      currentColumn = [];
    }
    currentColumn.push(day);
  });

  if (currentColumn.length > 0) {
    while (currentColumn.length < 7) {
      currentColumn.push(null as any);
    }
    columns.push(currentColumn);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', ...sx }}>
      <Box sx={{ display: 'flex', gap: cellGap, position: 'relative' }}>
        {/* Day Labels (Left) */}
        {showDayLabels && (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: cellGap, 
              pr: 1, 
              pt: showMonthLabels ? 4 : 0,
              flexShrink: 0 
            }}
          >
            {['Mon', 'Wed', 'Fri'].map((day, i) => (
              <Typography 
                key={day} 
                variant="caption" 
                sx={{ 
                  fontSize: '9px', 
                  height: cellSize, 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: theme.palette.text.secondary,
                  // Positions Mon at row 1, Wed at row 3, Fri at row 5
                  mt: i === 0 ? (cellSize + cellGap) : (cellSize + cellGap) * 1
                }}
              >
                {day}
              </Typography>
            ))}
          </Box>
        )}

        {/* Grid and Month Labels */}
        <Box sx={{ display: 'flex', gap: cellGap, overflowX: 'auto', pb: 1 }}>
          {columns.map((column, colIndex) => {
            const firstValidDay = column.find(d => d);
            const isFirstDayOfMonth = firstValidDay && firstValidDay.date() <= 7;
            const monthLabel = isFirstDayOfMonth ? firstValidDay.format('MMM') : '';

            return (
              <Box key={colIndex} sx={{ display: 'flex', flexDirection: 'column', gap: cellGap }}>
                {showMonthLabels && (
                  <Box sx={{ height: 16, mb: 0.5 }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontSize: '10px', 
                        color: theme.palette.text.secondary,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {monthLabel}
                    </Typography>
                  </Box>
                )}
                {column.map((day, rowIndex) => {
                  if (!day) return <Box key={rowIndex} sx={{ width: cellSize, height: cellSize }} />;
                  
                  const dateStr = day.format('YYYY-MM-DD');
                  const item = dataMap.get(dateStr);
                  const value = item ? item.value : 0;
                  const label = item?.label || (tooltipFormat ? tooltipFormat(item || { date: dateStr, value: 0 }) : `${value} units on ${day.format('MMM D, YYYY')}`);

                  return (
                    <Tooltip key={rowIndex} title={label} arrow placement="top" disableInteractive>
                      <Box
                        sx={{
                          width: cellSize,
                          height: cellSize,
                          backgroundColor: getColor(value),
                          borderRadius: '2px',
                          transition: theme.transitions.create(['background-color', 'outline'], { duration: 100 }),
                          '&:hover': {
                            outline: `1px solid ${theme.palette.text.primary}`,
                            outlineOffset: '1px',
                            zIndex: 1,
                          }
                        }}
                      />
                    </Tooltip>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default Heatmap;
