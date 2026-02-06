import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NumberInputProps {
  digitCount: number;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  digitCount,
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder,
  autoFocus = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d?$/.test(digit)) return;

    const newValue = value.split('');
    newValue[index] = digit;

    // Pad with empty strings if necessary
    while (newValue.length < digitCount) {
      newValue.push('');
    }

    onChange(newValue.join(''));

    // Auto-focus next input
    if (digit && index < digitCount - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter') {
      onSubmit();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < digitCount - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, digitCount);
    onChange(pastedData);

    // Focus the next empty input or last input
    const nextEmptyIndex = pastedData.length < digitCount ? pastedData.length : digitCount - 1;
    inputRefs.current[nextEmptyIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: digitCount }).map((_, index) => (
        <motion.input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          placeholder={placeholder?.[index] || '0'}
          className={`w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-mono font-bold
            bg-slate-900 border-2 rounded-lg transition-all
            ${disabled ? 'opacity-50 cursor-not-allowed border-slate-700' : 'border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30'}
            outline-none`}
          whileFocus={{ scale: 1.05 }}
        />
      ))}
    </div>
  );
};
