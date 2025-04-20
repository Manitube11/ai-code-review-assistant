import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Divider } from '@mui/material';
import { ReviewSuggestion } from '../api/reviewApi';

// Map severity to colors
const severityColorMap: Record<string, string> = {
  'low': 'success',
  'medium': 'warning',
  'high': 'error',
  'critical': 'error',
};

// Map category to labels
const categoryLabels: Record<string, string> = {
  'lint': 'Lint',
  'security': 'Security',
  'performance': 'Performance',
  'style': 'Style',
  'refactor': 'Refactor',
  'documentation': 'Docs',
  'test': 'Testing',
};

interface SuggestionCardProps {
  suggestion: ReviewSuggestion;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion }) => {
  const severityColor = severityColorMap[suggestion.severity.toLowerCase()] || 'default';
  const categoryLabel = categoryLabels[suggestion.category.toLowerCase()] || suggestion.category;
  
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" component="div" fontWeight="bold">
            Lines {suggestion.line_start}-{suggestion.line_end}
          </Typography>
          <Box>
            <Chip 
              label={suggestion.severity.toUpperCase()} 
              color={severityColor as any}
              size="small"
              sx={{ mr: 1 }}
            />
            <Chip 
              label={categoryLabel} 
              variant="outlined"
              size="small"
            />
          </Box>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        <Typography variant="body1" component="div" sx={{ mt: 1 }}>
          {suggestion.message}
        </Typography>
        
        {suggestion.suggested_fix && (
          <Box mt={2} p={1} bgcolor="rgba(0, 0, 0, 0.04)" borderRadius={1}>
            <Typography variant="subtitle2" component="div" color="text.secondary">
              Suggested Fix:
            </Typography>
            <Typography variant="body2" component="div" sx={{ mt: 0.5, fontFamily: 'monospace' }}>
              {suggestion.suggested_fix}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SuggestionCard; 