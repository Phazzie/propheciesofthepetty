import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  level: number;
  show: boolean;
  onClose: () => void;
}

const levelMessages = {
  3: "Now we're talking... the shade is starting to show!",
  4: "Oh honey, your judgment is *chef's kiss*",
  7: "Yass! You've achieved passing shade!",
  8: "The elegance! The devastation!",
  9: "They won't even feel this shade till next week",
  10: "Transcendent levels of passive aggression achieved!"
};

const ShadeCelebration: React.FC<Props> = ({ level, show, onClose }) => {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed bottom-4 right-4 bg-purple-600 text-white px-6 py-4 rounded-lg shadow-lg"
          style={{ zIndex: 50 }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">✨</span>
              <div>
                <p className="font-medium">Level {level} Achieved!</p>
                <p className="text-sm text-purple-100">{levelMessages[level as keyof typeof levelMessages]}</p>
              </div>
              <span className="text-xl">💅</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShadeCelebration;