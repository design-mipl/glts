import type { FC } from 'react';
import type { SxProps, Theme } from '@mui/material';
import { Box, Skeleton, useTheme, alpha } from '@mui/material';
import { Treemap as RechartsTreemap, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface TreeMapNode {
  name: string;
  value: number;
  color?: string;
  children?: TreeMapNode[];
  [key: string]: any;
}

interface TreeMapProps {
  data: TreeMapNode[];
  height?: number;
  colorScale?: string[];
  showLabels?: boolean;
  showValues?: boolean;
  onItemClick?: (item: TreeMapNode) => void;
  valueFormat?: (v: number) => string;
  loading?: boolean;
  sx?: SxProps<Theme>;
}

const TreeMap: FC<TreeMapProps> = ({
  data,
  height = 300,
  colorScale: customColorScale,
  showLabels = true,
  showValues = true,
  onItemClick,
  valueFormat,
  loading = false,
  sx,
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={height} 
        sx={{ borderRadius: '8px', ...sx }} 
      />
    );
  }

  const defaultColorScale = [
    theme.palette.primary.main,
    theme.palette.primary.light,
    theme.palette.primary.dark,
    alpha(theme.palette.primary.main, 0.7),
    alpha(theme.palette.primary.main, 0.5),
  ];

  const colors = customColorScale || defaultColorScale;

  const CustomContent = (props: any) => {
    const { x, y, width, height, index, name, value } = props;
    
    // Hide labels if cell too small (< 40px) as per requirements
    // though width/height check here is simple
    const isTooSmall = width < 40 || height < 30;
    
    // Assign color based on index if not provided in node
    const nodeColor = props.color || colors[index % colors.length];

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: nodeColor,
            stroke: theme.palette.background.paper,
            strokeWidth: 1,
            cursor: onItemClick ? 'pointer' : 'default',
            rx: 4,
            opacity: 0.9,
            transition: 'all 0.2s ease',
          }}
          onClick={() => onItemClick?.(props)}
          onMouseEnter={(e: any) => {
            e.target.style.opacity = 1;
            e.target.style.filter = 'brightness(1.1)';
          }}
          onMouseLeave={(e: any) => {
            e.target.style.opacity = 0.9;
            e.target.style.filter = 'none';
          }}
        />
        {showLabels && !isTooSmall && (
          <text
            x={x + width / 2}
            y={y + height / 2 - (showValues ? 6 : 0)}
            textAnchor="middle"
            fill={theme.palette.primary.contrastText}
            fontSize={12}
            fontWeight={600}
            dominantBaseline="central"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {name}
          </text>
        )}
        {showValues && !isTooSmall && height > 45 && (
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            fill={theme.palette.primary.contrastText}
            fontSize={10}
            fontWeight={400}
            dominantBaseline="central"
            style={{ pointerEvents: 'none', userSelect: 'none', opacity: 0.9 }}
          >
            {valueFormat ? valueFormat(value) : value.toLocaleString()}
          </text>
        )}
      </g>
    );
  };

  return (
    <Box sx={{ width: '100%', height, ...sx }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsTreemap
          data={data}
          dataKey="value"
          aspectRatio={4 / 3}
          stroke={theme.palette.background.paper}
          content={<CustomContent />}
        >
          <RechartsTooltip 
            contentStyle={{ 
              backgroundColor: theme.palette.background.paper, 
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: theme.shadows[2]
            }} 
          />
        </RechartsTreemap>
      </ResponsiveContainer>
    </Box>
  );
};

export default TreeMap;
