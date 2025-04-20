import React from 'react';
import { motion } from 'framer-motion';
import { Typography, Box } from '@mui/material';

interface TextAnimationProps {
  text: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2';
  color?: string;
  delay?: number;
  duration?: number;
  type?: 'reveal' | 'typewriter' | 'fade' | 'highlight';
}

const TextAnimation: React.FC<TextAnimationProps> = ({
  text,
  variant = 'h4',
  color,
  delay = 0,
  duration = 0.5,
  type = 'typewriter'
}) => {
  // Split text into words for word-by-word animation
  const words = text.split(' ');
  
  // Split text into characters for typewriter effect
  const characters = text.split('');
  
  // Animation variants for different effects
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      }
    }
  };

  const wordVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      }
    }
  };
  
  const characterVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
      }
    }
  };
  
  const highlightVariants = {
    hidden: { opacity: 1, scale: 1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: delay,
      }
    }
  };

  const highlightCharVariants = {
    hidden: { color: 'inherit', textShadow: 'none' },
    visible: { 
      color: color || '#3f51b5',
      textShadow: '0 0 8px rgba(63, 81, 181, 0.3)',
      transition: { 
        duration: 0.2, 
        yoyo: 1, 
        repeat: 1 
      }
    }
  };

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: duration,
        delay: delay,
      }
    }
  };

  const revealVariants = {
    hidden: { width: 0, opacity: 1 },
    visible: {
      width: '100%',
      opacity: 1,
      transition: {
        duration: duration,
        delay: delay,
      }
    }
  };

  // Render based on animation type
  const renderAnimation = () => {
    switch (type) {
      case 'typewriter':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'inline-block' }}
          >
            {characters.map((char, index) => (
              <motion.span
                key={`char-${index}`}
                variants={characterVariants}
                style={{ 
                  display: 'inline-block',
                  color: color || 'inherit',
                  marginRight: char === ' ' ? '0.25em' : undefined,
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.div>
        );
        
      case 'highlight':
        return (
          <motion.div
            variants={highlightVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'inline-block' }}
          >
            {characters.map((char, index) => (
              <motion.span
                key={`highlight-${index}`}
                variants={highlightCharVariants}
                style={{ 
                  display: 'inline-block',
                  marginRight: char === ' ' ? '0.25em' : undefined,
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.div>
        );
        
      case 'fade':
        return (
          <motion.div
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            style={{ 
              display: 'inline-block',
              color: color || 'inherit',
            }}
          >
            {text}
          </motion.div>
        );
        
      case 'reveal':
        return (
          <Box sx={{ position: 'relative', display: 'inline-block', overflow: 'hidden' }}>
            <Typography 
              variant={variant} 
              component="div"
              sx={{ 
                color: color || 'inherit',
                visibility: 'hidden'
              }}
            >
              {text}
            </Typography>
            <Box sx={{ position: 'absolute', top: 0, left: 0 }}>
              <motion.div
                variants={revealVariants}
                initial="hidden"
                animate="visible"
                style={{ overflow: 'hidden' }}
              >
                <Typography 
                  variant={variant} 
                  component="div" 
                  sx={{ color: color || 'inherit', whiteSpace: 'nowrap' }}
                >
                  {text}
                </Typography>
              </motion.div>
            </Box>
          </Box>
        );
        
      default:
        // Default to word-by-word animation
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'inline-flex', flexWrap: 'wrap' }}
          >
            {words.map((word, index) => (
              <motion.span
                key={`word-${index}`}
                variants={wordVariants}
                style={{ 
                  display: 'inline-block',
                  marginRight: '0.25em',
                  marginBottom: '0.15em',
                  color: color || 'inherit',
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
        );
    }
  };

  return (
    <Typography 
      variant={variant} 
      component="div" 
      sx={{ 
        display: 'inline-block',
        '& > div': {
          display: 'inline-block',
        }
      }}
    >
      {renderAnimation()}
    </Typography>
  );
};

export default TextAnimation; 