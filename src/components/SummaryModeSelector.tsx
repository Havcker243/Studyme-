
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SummaryModeSelectorProps {
  mode: string;
  onChange: (mode: string) => void;
}

const SummaryModeSelector: React.FC<SummaryModeSelectorProps> = ({ 
  mode, 
  onChange 
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-3">Summary Type</h3>
      <RadioGroup 
        value={mode} 
        onValueChange={onChange}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="brief" id="brief" />
          <Label 
            htmlFor="brief" 
            className="cursor-pointer"
          >
            Brief Summary
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="detailed" id="detailed" />
          <Label 
            htmlFor="detailed" 
            className="cursor-pointer"
          >
            Detailed Explanation
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default SummaryModeSelector;
