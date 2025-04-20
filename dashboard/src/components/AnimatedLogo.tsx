import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';

const logoVariants = {
  hidden: { 
    opacity: 0,
    y: -50 
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { 
      type: 'spring',
      stiffness: 300,
      damping: 30,
      delay: 0.2
    }
  }
};

const textContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.6
    }
  }
};

const letterVariants = {
  hidden: {
    opacity: 0,
    y: 50
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 15
    }
  }
};

interface AnimatedLogoProps {
  size?: 'small' | 'medium' | 'large';
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ size = 'medium' }) => {
  const logoText = "AI Code Review";
  
  let iconSize;
  let fontSize;
  
  switch (size) {
    case 'small':
      iconSize = 40;
      fontSize = '1.5rem';
      break;
    case 'large':
      iconSize = 90;
      fontSize = '3rem';
      break;
    default:
      iconSize = 60;
      fontSize = '2.2rem';
  }
  
  return (
    <Box 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      flexDirection="column"
      sx={{ overflow: 'hidden' }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={logoVariants}
      >
        <Box 
          sx={{ 
            width: iconSize, 
            height: iconSize, 
            borderRadius: '50%', 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            boxShadow: '0 8px 20px rgba(33, 150, 243, 0.3)',
            position: 'relative'
          }}
        >
          <Typography variant="h4" component="div" sx={{ color: '#fff', fontWeight: 'bold' }}>
            AI
          </Typography>
          <motion.div
            animate={{ 
              rotate: 360,
              transition: { 
                duration: 20, 
                repeat: Infinity, 
                ease: "linear" 
              }
            }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '2px dashed rgba(255,255,255,0.5)'
            }}
          />
        </Box>
      </motion.div>
      
      <motion.div
        variants={textContainer}
        initial="hidden"
        animate="visible"
      >
        <Box display="flex" justifyContent="center">
          {logoText.split('').map((letter, index) => (
            <motion.div key={index} variants={letterVariants}>
              <Typography
                variant={size === 'large' ? 'h2' : 'h4'}
                component="span"
                sx={{
                  display: 'inline-block',
                  fontSize,
                  fontWeight: 700,
                  color: letter === ' ' ? 'transparent' : '#1976d2',
                  mx: letter === ' ' ? 1 : 0.2,
                }}
              >
                {letter}
              </Typography>
            </motion.div>
          ))}
        </Box>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { delay: 1.8, duration: 0.8 }
        }}
      >
        <Typography 
          variant="subtitle1" 
          component="div"
          align="center"
          sx={{ 
            mt: 1, 
            color: 'text.secondary',
            fontStyle: 'italic',
            fontSize: size === 'small' ? '0.8rem' : '1rem'
          }}
        >
          Elevate your code quality with AI
        </Typography>
      </motion.div>
    </Box>
  );
};

export default AnimatedLogo; 