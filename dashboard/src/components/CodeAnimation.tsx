import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, useTheme, Typography } from '@mui/material';

interface CodeAnimationProps {
  size?: 'small' | 'medium' | 'large';
}

const codeSnippet = `
function analyzeCode(code) {
  // AI Code Review
  const issues = [];
  const suggestions = [];
  
  // Analyze syntax
  checkSyntax(code);
  
  // Find best practices
  findBestPractices(code);
  
  // Suggest improvements
  suggestImprovements(code);
  
  return {
    issues,
    suggestions,
    summary: generateSummary()
  };
}
`;

const CodeAnimation: React.FC<CodeAnimationProps> = ({ size = 'medium' }) => {
  const theme = useTheme();
  
  // Determine dimensions based on size prop
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 300, height: 200, fontSize: 10 };
      case 'large':
        return { width: 600, height: 400, fontSize: 16 };
      default:
        return { width: 450, height: 300, fontSize: 14 };
    }
  };
  
  const { width, height, fontSize } = getDimensions();
  
  // Split code into lines for animation
  const codeLines = codeSnippet.trim().split('\\n');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };
  
  const lineVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };
  
  // Cursor animation
  const cursorVariants = {
    blink: {
      opacity: [0, 1, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: 'loop' as const
      }
    }
  };

  return (
    <Box 
      sx={{
        width,
        height,
        bgcolor: '#1e1e3f',
        borderRadius: 2,
        padding: 2,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        fontFamily: 'monospace',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '24px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
        }
      }}
    >
      <Box sx={{ position: 'absolute', top: '4px', left: '10px', display: 'flex', gap: '6px' }}>
        <Box component="span" sx={{ width: '12px', height: '12px', borderRadius: '50%', bgcolor: '#ff5f56', display: 'block' }} />
        <Box component="span" sx={{ width: '12px', height: '12px', borderRadius: '50%', bgcolor: '#ffbd2e', display: 'block' }} />
        <Box component="span" sx={{ width: '12px', height: '12px', borderRadius: '50%', bgcolor: '#27c93f', display: 'block' }} />
      </Box>
      
      <Typography 
        variant="caption" 
        sx={{ 
          position: 'absolute', 
          top: '4px', 
          left: 0, 
          right: 0, 
          textAlign: 'center',
          color: 'rgba(255,255,255,0.6)',
          fontSize: '12px',
        }}
      >
        AI Code Review Analysis
      </Typography>
      
      <Box sx={{ pt: 2 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {codeLines.map((line, index) => (
            <motion.div 
              key={index}
              variants={lineVariants}
              style={{ 
                color: line.includes('//') ? '#7fdbca' : '#fff',
                marginBottom: '4px',
                fontSize: fontSize,
                display: 'flex',
              }}
            >
              <Box 
                component="span" 
                sx={{ 
                  color: 'rgba(255,255,255,0.4)', 
                  width: '24px', 
                  textAlign: 'right', 
                  marginRight: '8px',
                  userSelect: 'none'
                }}
              >
                {index + 1}
              </Box>
              <Box component="span" sx={{ color: line.includes('function') ? '#82aaff' : 'inherit' }}>
                {line.includes('function') && (
                  <Box component="span" sx={{ color: '#82aaff' }}>function </Box>
                )}
                {line.includes('const ') && (
                  <Box component="span" sx={{ color: '#82aaff' }}>const </Box>
                )}
                {line.replace('function ', '').replace('const ', '')}
              </Box>
              {index === codeLines.length - 1 && (
                <motion.span
                  variants={cursorVariants}
                  animate="blink"
                  style={{ 
                    display: 'inline-block', 
                    width: '2px', 
                    height: '14px', 
                    backgroundColor: '#fff',
                    marginLeft: '4px'
                  }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </Box>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.5 }}
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          background: theme.palette.primary.main,
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: theme.typography.fontFamily,
        }}
      >
        Analysis Complete
      </motion.div>
    </Box>
  );
};

export default CodeAnimation; 