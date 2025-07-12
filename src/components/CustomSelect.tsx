import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: () => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: boolean;
  disabled?: boolean;
}

export default function CustomSelect({
  name,
  value,
  onChange,
  onBlur,
  options,
  placeholder = "Select an option...",
  required = false,
  className = "",
  error = false,
  disabled = false
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    options.find(opt => opt.value === value) ?? null
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelectedOption(options.find(opt => opt.value === value) ?? null);
  }, [value, options]);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    
    // Create a synthetic event to match the expected onChange signature
    const syntheticEvent = {
      target: {
        name,
        value: option.value
      }
    } as React.ChangeEvent<HTMLSelectElement>;
    
    onChange(syntheticEvent);
  };

  const baseClasses = "w-full border-4 rounded-2xl px-4 pr-12 py-3 text-lg bg-white focus:outline-none transition-all appearance-none cursor-pointer";
  const borderClasses = error 
    ? "[border-color:#f87171] focus:[border-color:#f87171] focus:[box-shadow:0_0_0_2px_#f87171]" 
    : "[border-color:#0088ff] focus:[border-color:#0088ff] focus:[box-shadow:0_0_0_2px_#0088ff]";
  const textClasses = selectedOption ? "text-black" : "text-gray-400";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div
        className={`${baseClasses} ${borderClasses} ${textClasses} ${disabledClasses}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onBlur={onBlur}
      >
        <span className="block truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        
        {/* Custom dropdown arrow */}
        <span className="pointer-events-none absolute right-6 top-1/2 transform -translate-y-1/2">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          >
            <path d="M6 8L10 12L14 8" stroke="#a3a3a3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>

      {/* Dropdown options */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border-4 border-gray-200 rounded-2xl shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedOption?.value === option.value ? 'bg-blue-50 text-blue-600' : 'text-black'
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {/* Hidden select for form submission */}
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="sr-only"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
} 