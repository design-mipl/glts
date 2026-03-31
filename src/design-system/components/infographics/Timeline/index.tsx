import type { FC, ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';
import { Box, Typography, Skeleton } from '@mui/material';
import { useTheme, alpha, keyframes } from '@mui/material/styles';
import {
  Timeline as MuiTimeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import dayjs from 'dayjs';

const pulse = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(99, 102, 241, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
`;

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: string | Date;
  icon?: ReactNode;
  color?: string;
  status?: 'completed' | 'active' | 'pending' | 'error';
  metadata?: Record<string, string>;
  actions?: ReactNode;
}

interface TimelineProps {
  items: TimelineEvent[];
  orientation?: 'vertical' | 'horizontal';
  variant?: 'default' | 'outlined' | 'minimal';
  alternating?: boolean; // alternate left/right (vertical only)
  loading?: boolean;
  sx?: SxProps<Theme>;
}

const Timeline: FC<TimelineProps> = ({
  items,
  orientation = 'vertical',
  variant = 'default',
  alternating = false,
  loading = false,
  sx,
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box sx={{ p: 2, ...sx }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Skeleton variant="circular" width={24} height={24} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="text" width="60%" height={20} />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return theme.palette.success.main;
      case 'active': return theme.palette.primary.main;
      case 'error': return theme.palette.error.main;
      case 'pending':
      default: return theme.palette.text.disabled;
    }
  };

  const isVertical = orientation === 'vertical';

  return (
    <MuiTimeline
      position={alternating && isVertical ? 'alternate' : 'right'}
      sx={{
        p: 0,
        m: 0,
        ...(isVertical ? {
          // Vertical styles
          [`& .MuiTimelineItem-root:before`]: {
            display: alternating ? 'block' : 'none',
          },
        } : {
          // Horizontal styles (CSS hacks for MUI Timeline)
          flexDirection: 'row',
          overflowX: 'auto',
          pb: 2,
          minHeight: 200,
          [`& .MuiTimelineItem-root`]: {
            flexDirection: 'column',
            minWidth: 200,
            '&:before': { display: 'none' },
          },
          [`& .MuiTimelineSeparator-root`]: {
            flexDirection: 'row',
            width: '100%',
          },
          [`& .MuiTimelineConnector-root`]: {
            width: '100%',
            height: '2px',
          },
          [`& .MuiTimelineContent-root`]: {
            textAlign: 'center',
            minWidth: 'auto',
            width: '100%',
            px: 1,
          },
          [`& .MuiTimelineOppositeContent-root`]: {
            textAlign: 'center',
            mb: 1,
            width: '100%',
            minWidth: 'auto',
          },
        }),
        ...sx,
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const itemColor = item.color || getStatusColor(item.status);
        const isActive = item.status === 'active';

        return (
          <TimelineItem key={item.id}>
            <TimelineOppositeContent
              sx={{ 
                m: 'auto 0', 
                color: theme.palette.text.secondary,
                fontSize: '12px',
                ...(isVertical && !alternating ? { display: 'none' } : {})
              }}
            >
              {dayjs(item.date).format('MMM D, YYYY')}
            </TimelineOppositeContent>
            
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  backgroundColor: itemColor,
                  boxShadow: 'none',
                  ...(isActive && {
                    animation: `${pulse} 2s infinite`,
                  }),
                }}
                variant="filled"
              >
                {item.icon}
              </TimelineDot>
              {!isLast && <TimelineConnector sx={{ backgroundColor: alpha(theme.palette.divider, 0.5) }} />}
            </TimelineSeparator>
            
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Box
                sx={{
                  p: variant === 'minimal' ? 0.5 : 2,
                  borderRadius: '8px',
                  backgroundColor: variant === 'default' ? (theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.5) : theme.palette.background.paper) : 'transparent',
                  border: variant === 'outlined' ? `1px solid ${theme.palette.divider}` : 'none',
                  ...(variant === 'default' && {
                    boxShadow: theme.palette.mode === 'dark' ? 'none' : theme.shadows[1],
                    border: theme.palette.mode === 'dark' ? `1px solid ${theme.palette.divider}` : 'none',
                  }),
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, display: 'block' }}>
                  {item.title}
                </Typography>
                
                {isVertical && !alternating && (
                  <Typography variant="caption" sx={{ color: theme.palette.text.disabled, mb: 0.5, display: 'block' }}>
                    {dayjs(item.date).format('MMM D, YYYY')}
                  </Typography>
                )}

                {item.description && (
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mt: 0.5, fontSize: '13px' }}>
                    {item.description}
                  </Typography>
                )}
                
                {item.metadata && Object.keys(item.metadata).length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: isVertical ? 'flex-start' : 'center' }}>
                    {Object.entries(item.metadata).map(([key, value]) => (
                      <Box key={key} sx={{ textAlign: 'left' }}>
                        <Typography variant="caption" sx={{ color: theme.palette.text.disabled, display: 'block', lineHeight: 1 }}>
                          {key}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                          {value}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
                
                {item.actions && <Box sx={{ mt: 1.5 }}>{item.actions}</Box>}
              </Box>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </MuiTimeline>
  );
};

export default Timeline;
