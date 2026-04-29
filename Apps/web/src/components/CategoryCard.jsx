import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CategoryCard = ({ category, onClick, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-muted rounded-2xl p-8 hover:bg-accent transition-all duration-300 h-full flex flex-col">
        <div className="mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
            <span className="text-3xl font-bold text-primary group-hover:text-primary-foreground">
              {category.name.charAt(0)}
            </span>
          </div>
        </div>
        <h3 className="text-2xl font-semibold mb-3 font-serif">{category.name}</h3>
        {category.description && (
          <p className="text-muted-foreground mb-6 leading-relaxed max-w-none flex-1">
            {category.description}
          </p>
        )}
        <Button variant="ghost" className="w-fit group-hover:text-primary transition-colors duration-200">
          Explore
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
        </Button>
      </div>
    </motion.div>
  );
};

export default CategoryCard;