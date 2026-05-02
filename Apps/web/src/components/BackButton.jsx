import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

const BackButton = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => navigate(-1)}
      className={`group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200 ${className}`}
    >
      <div className="w-8 h-8 rounded-full bg-secondary/50 group-hover:bg-primary/10 flex items-center justify-center transition-all duration-200">
        <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
      </div>
      <span className="text-sm font-medium">Back</span>
    </Button>
  );
};

export default BackButton;
