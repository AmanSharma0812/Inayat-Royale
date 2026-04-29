import React from 'react';
import { motion } from 'framer-motion';

const TrustBadge = ({ icon: Icon, title, description, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center group"
    >
      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors duration-300">
        <Icon className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-lg font-semibold mb-2 font-serif">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-none">{description}</p>
    </motion.div>
  );
};

export default TrustBadge;