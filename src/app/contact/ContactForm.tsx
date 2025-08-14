import React, { useState } from 'react';
import { ChevronsUpDown, ArrowUpCircle } from 'lucide-react';
import { Combobox } from '../../components/ui/combobox';
import { DatePicker } from '../../components/ui/date-picker';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Command, CommandList, CommandEmpty, CommandGroup, CommandItem } from '../../components/ui/command';

const PROJECT_TYPES = [
  { value: 'Commercial Spot', label: 'Commercial Spot' },
  { value: 'Intro/Preintro', label: 'Intro/Preintro' },
  { value: 'Overlay', label: 'Overlay' },
  { value: 'Social Media Content', label: 'Social Media Content' },
];
const SEQUENCE_LENGTHS = [
  { value: '<45s', label: '<45s' },
  { value: '1-2min', label: '1-2min' },
  { value: '>2min', label: '>2min' },
  { value: 'custom', label: 'Custom...' },
];
const ASSETS_OPTIONS = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];

interface FormState {
  name: string;
  email: string;
  telephone: string;
  company: string;
  projectType: string;
  sequenceLength: string;
  deadline: string;
  assets: string;
  description: string;
}

const initialState: FormState = {
  name: '',
  email: '',
  telephone: '',
  company: '',
  projectType: '',
  sequenceLength: '',
  deadline: '',
  assets: '',
  description: '',
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [flashFields, setFlashFields] = useState<string[]>([]);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [customSequenceLength, setCustomSequenceLength] = useState('');
  const [showCustomSequenceInput, setShowCustomSequenceInput] = useState(false);
  const [customDropdownOpen, setCustomDropdownOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const stringValue = String(value || '');
    
    // Special validation for telephone field
    if (name === 'telephone') {
      // Only allow numbers, +, -, and /
      const phoneRegex = /^[0-9+\-/]*$/;
      if (stringValue === '' || phoneRegex.test(stringValue)) {
        setForm({ ...form, [name]: stringValue });
      }
    } else {
      setForm({ ...form, [name]: stringValue });
    }
    setMissingFields(prev => prev.filter(f => f !== name));
    setFlashFields(prev => prev.filter(f => f !== name));
  };

  const handleComboboxChange = (name: string, value: string) => {
    if (name === 'sequenceLength' && value === 'custom') {
      setShowCustomSequenceInput(true);
      // Restore previous custom value if any
      setForm({ ...form, [name]: customSequenceLength });
    } else {
      setForm({ ...form, [name]: value });
      if (name === 'sequenceLength') {
        setShowCustomSequenceInput(false);
        // Only clear customSequenceLength if a non-custom option is chosen
        if (value !== 'custom') setCustomSequenceLength('');
      }
    }
    setMissingFields(prev => prev.filter(f => f !== name));
    setFlashFields(prev => prev.filter(f => f !== name));
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const dateString = date.toISOString().split('T')[0] ?? '';
      setForm({ ...form, deadline: dateString });
    } else {
      setForm({ ...form, deadline: '' });
    }
    setMissingFields(prev => prev.filter(f => f !== 'deadline'));
    setFlashFields(prev => prev.filter(f => f !== 'deadline'));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailBlur = () => {
    if (form.email && !validateEmail(form.email)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handleCustomSequenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomSequenceLength(value);
    setForm({ ...form, sequenceLength: value });
    setMissingFields(prev => prev.filter(f => f !== 'sequenceLength'));
    setFlashFields(prev => prev.filter(f => f !== 'sequenceLength'));
  };





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    const missingFields = [];
    if (!form.name) missingFields.push('name');
    if (!form.email) missingFields.push('email');
    if (!form.projectType) missingFields.push('projectType');
    if (!form.sequenceLength) missingFields.push('sequenceLength');
    if (!form.deadline) missingFields.push('deadline');
    if (!form.assets) missingFields.push('assets');
    if (!form.description) missingFields.push('description');
    if (missingFields.length > 0) {
      setMissingFields(missingFields);
      setFlashFields(missingFields);
      setTimeout(() => setFlashFields([]), 5000);
      return;
    }
    
    // Validate email format
    if (!validateEmail(form.email)) {
      setError('Please enter a valid email address.');
      setEmailError('Please enter a valid email address.');
      setFlashFields(['email']);
      setTimeout(() => setFlashFields([]), 15000);
      return;
    }
    
    // Clear any email-specific errors
    setEmailError('');
    setSubmitting(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm(initialState);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const data = await res.json() as { error?: string };
        setError(data.error ?? 'Failed to send.');
      }
    } catch {
      setError('Failed to send.');
    } finally {
      setSubmitting(false);
      setTimeout(() => setFlashFields([]), 15000);
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center px-4 md:px-8 lg:px-0 pb-8">
      <div className="w-full max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} noValidate className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 px-4 md:px-8 lg:px-0">
          {/* Name */}
          <div className="col-span-1 md:col-span-1 flex flex-col">
            <label className="block font-bold mb-1 text-lg pl-4">Name</label>
            <div className="relative">
              <input 
                name="name" 
                value={form.name} 
                onChange={handleChange} 
                onBlur={() => setFlashFields(prev => prev.filter(f => f !== 'name'))}
                required 
                maxLength={50} 
                className={`w-full border-4 rounded-2xl px-4 py-3 text-lg placeholder-gray-400 focus:outline-none transition-all ${
                  flashFields.includes('name') ? '[border-color:#f87171] focus:[border-color:#f87171] focus:[box-shadow:0_0_0_2px_#f87171]' : '[border-color:#0189ff] focus:[border-color:#0189ff] focus:[box-shadow:0_0_0_2px_#0189ff]'
                }`} 
                placeholder="Your name" 
              />
              {form.name.length >= 40 && <div className="text-sm text-gray-500 mt-1">{form.name.length}/50</div>}
              {missingFields.includes('name') && <div className="text-red-600 font-bold text-xs absolute -bottom-5 right-2">This field is required.</div>}
            </div>
          </div>
          {/* Email */}
          <div className="col-span-1 md:col-span-1 flex flex-col">
            <label className="block font-bold mb-1 text-lg pl-4">E-Mail</label>
            <div className="relative">
              <input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange} 
                onBlur={() => { handleEmailBlur(); setFlashFields(prev => prev.filter(f => f !== 'email')); }}
                required 
                maxLength={100} 
                className={`w-full border-4 rounded-2xl px-4 py-3 text-lg placeholder-gray-400 focus:outline-none transition-all ${
                  flashFields.includes('email') ? '[border-color:#f87171] focus:[border-color:#f87171] focus:[box-shadow:0_0_0_2px_#f87171]' : '[border-color:#0189ff] focus:[border-color:#0189ff] focus:[box-shadow:0_0_0_2px_#0189ff]'
                }`} 
                placeholder="Your E-Mail address" 
              />
              {emailError && <div className="text-sm text-red-500 mt-1">{emailError}</div>}
              {form.email.length >= 80 && !emailError && <div className="text-sm text-gray-500 mt-1">{form.email.length}/100</div>}
              {missingFields.includes('email') && <div className="text-red-600 font-bold text-xs absolute -bottom-5 right-2">This field is required.</div>}
            </div>
          </div>
          {/* Telephone (optional) */}
          <div className="col-span-1 md:col-span-1 flex flex-col">
            <label className="block font-bold mb-1 text-lg pl-4">Telephone</label>
            <div className="relative">
              <input name="telephone" value={form.telephone} onChange={handleChange} maxLength={20} className="w-full border-4 [border-color:#a3a3a3] rounded-2xl px-4 py-3 text-lg placeholder-gray-400 focus:outline-none focus:[border-color:#a3a3a3] focus:[box-shadow:0_0_0_2px_#a3a3a3] transition-all" placeholder="OPTIONAL - Your contact phonenumber" />
              {form.telephone.length >= 16 && <div className="text-sm text-gray-500 mt-1">{form.telephone.length}/20</div>}
              {missingFields.includes('telephone') && <div className="text-red-600 font-bold text-xs absolute -bottom-5 right-2">This field is required.</div>}
            </div>
          </div>
          {/* Company (optional) */}
          <div className="col-span-1 md:col-span-1 flex flex-col">
            <label className="block font-bold mb-1 text-lg pl-4">Company</label>
            <div className="relative">
              <input name="company" value={form.company} onChange={handleChange} maxLength={100} className="w-full border-4 [border-color:#a3a3a3] rounded-2xl px-4 py-3 text-lg placeholder-gray-400 focus:outline-none focus:[border-color:#a3a3a3] focus:[box-shadow:0_0_0_2px_#a3a3a3] transition-all" placeholder="OPTIONAL - Commissioned by ..." />
              {form.company.length >= 80 && <div className="text-sm text-gray-500 mt-1">{form.company.length}/100</div>}
              {missingFields.includes('company') && <div className="text-red-600 font-bold text-xs absolute -bottom-5 right-2">This field is required.</div>}
            </div>
          </div>
          {/* Project Type */}
          <div className="col-span-1 md:col-span-1 flex flex-col">
            <label className="block font-bold mb-1 text-lg pl-4">Project Type</label>
            <div className="relative w-full">
              <Combobox
                options={PROJECT_TYPES}
                value={form.projectType}
                onValueChange={(value) => handleComboboxChange('projectType', value)}
                placeholder="Please select a project type..."
                error={flashFields.includes('projectType')}
              />
              {missingFields.includes('projectType') && <div className="text-red-600 font-bold text-xs absolute -bottom-5 right-2">This field is required.</div>}
            </div>
          </div>
          {/* Sequence Length */}
          <div className="col-span-1 md:col-span-1 flex flex-col">
            <label className="block font-bold mb-1 text-lg pl-4">Sequence length</label>
            <div className="relative w-full">
              {!showCustomSequenceInput ? (
                <Combobox
                  options={SEQUENCE_LENGTHS}
                  value={form.sequenceLength}
                  onValueChange={(value) => handleComboboxChange('sequenceLength', value)}
                  placeholder="Please select sequence length..."
                  error={flashFields.includes('sequenceLength')}
                />
              ) : (
                <div className="w-full">
                  <Popover open={customDropdownOpen} onOpenChange={setCustomDropdownOpen}>
                    <PopoverTrigger asChild>
                      <div className="relative w-full">
                        <input
                          name="customSequenceLength"
                          value={customSequenceLength}
                          onChange={handleCustomSequenceChange}
                          onBlur={() => setFlashFields(prev => prev.filter(f => f !== 'sequenceLength'))}
                          required
                          maxLength={10}
                          className={`w-full border-4 rounded-2xl px-4 py-3 text-lg placeholder-gray-400 focus:outline-none transition-all pr-12 ${
                            flashFields.includes('sequenceLength') ? '[border-color:#f87171] focus:[border-color:#f87171] focus:[box-shadow:0_0_0_2px_#f87171]' : '[border-color:#0189ff] focus:[border-color:#0189ff] focus:[box-shadow:0_0_0_2px_#0189ff]'
                          }`}
                          placeholder="Enter custom sequence length..."
                          onClick={e => e.stopPropagation()}
                        />
                        {customSequenceLength.length >= 7 && (
                          <div className={`text-sm mt-1 pl-2 ${customSequenceLength.length === 10 ? 'text-red-500' : 'text-gray-500'}`}>{customSequenceLength.length}/10</div>
                        )}
                        <button
                          type="button"
                          className="absolute right-6 top-1/2 transform -translate-y-1/2 h-4 w-4 shrink-0 z-10"
                          tabIndex={-1}
                          onClick={e => { e.stopPropagation(); setCustomDropdownOpen(v => !v); }}
                        >
                          <ChevronsUpDown
                            className={`h-4 w-4 ${customSequenceLength.length > 0 ? 'opacity-50' : 'opacity-20'}`}
                          />
                        </button>
                        {/* Overlay a transparent div over the icon area to act as PopoverTrigger, but only the icon click toggles */}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-white border-4 border-gray-200 rounded-2xl shadow-lg z-50" align="start">
                      <Command>
                        <CommandList>
                          <CommandEmpty>No option found.</CommandEmpty>
                          <CommandGroup>
                            {SEQUENCE_LENGTHS.map((option) => {
                              const isCustomOption = option.value === 'custom';
                              const isSelected = isCustomOption ? showCustomSequenceInput : form.sequenceLength === option.value;
                              return (
                                <CommandItem
                                  key={option.value}
                                  value={option.value}
                                  onSelect={(currentValue) => {
                                    setCustomDropdownOpen(false);
                                    handleComboboxChange('sequenceLength', currentValue);
                                  }}
                                  className={`cursor-pointer transition-colors hover:bg-gray-50${isSelected ? ' bg-brand-light text-brand-dark' : ''}`}
                                >
                                  {option.label}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
              {missingFields.includes('sequenceLength') && <div className="text-red-600 font-bold text-xs absolute -bottom-5 right-2">This field is required.</div>}
            </div>
          </div>
          {/* Deadline */}
          <div className="col-span-1 md:col-span-1 flex flex-col">
            <label className="block font-bold mb-1 text-lg pl-4">Deadline</label>
            <div className="relative">
              <DatePicker
                date={selectedDate}
                onDateChange={handleDateChange}
                placeholder="Select deadline..."
                error={flashFields.includes('deadline')}
                minDate={(function() {
                  const minDate = new Date();
                  minDate.setDate(minDate.getDate() + 12);
                  return minDate;
                })()}
              />

              {missingFields.includes('deadline') && <div className="text-red-600 font-bold text-xs absolute -bottom-5 right-2">This field is required.</div>}
            </div>
          </div>
          {/* Any Assets */}
          <div className="col-span-1 md:col-span-1 flex flex-col">
            <label className="block font-bold mb-1 text-lg pl-4">Any Assets?</label>
            <div className="relative w-full">
              <Combobox
                options={ASSETS_OPTIONS}
                value={form.assets}
                onValueChange={(value) => handleComboboxChange('assets', value)}
                placeholder="Please select yes or no..."
                error={flashFields.includes('assets')}
              />
              {missingFields.includes('assets') && <div className="text-red-600 font-bold text-xs absolute -bottom-5 right-2">This field is required.</div>}
            </div>
          </div>
          {/* Project Description */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-center">
            <div className="w-full max-w-md relative">
              <label className="block font-bold mb-1 text-lg pl-4">Project description</label>
              <div className="relative w-full">
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange} 
                  onBlur={() => setFlashFields(prev => prev.filter(f => f !== 'description'))}
                  required 
                  maxLength={2000} 
                  className={`w-full border-4 rounded-2xl px-4 py-3 text-lg min-h-[120px] placeholder-transparent focus:outline-none focus:[border-color:#0189ff] focus:[box-shadow:0_0_0_2px_#0189ff] transition-all resize-y bg-transparent ${
                    flashFields.includes('description') ? '[border-color:#f87171] focus:[border-color:#f87171] focus:[box-shadow:0_0_0_2px_#f87171]' : '[border-color:#0189ff] focus:[border-color:#0189ff] focus:[box-shadow:0_0_0_2px_#0189ff]'
                  }`} 
                  placeholder="A detailed description about your project" 
                  id="project-description-textarea"
                />
                {form.description === '' && (
                  <span className="pointer-events-none absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 text-lg select-none whitespace-pre-line text-center w-[90%]">
                    A detailed description about your project
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="text-sm text-gray-500">{form.description.length}/2000</div>
                {missingFields.includes('description') && <div className="text-red-600 font-bold text-xs ml-2">This field is required.</div>}
              </div>
            </div>
          </div>
          {/* Submit Button & Confirmation */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-center mt-0">
            <p className="text-2xl font-black mb-0 leading-tight">All set?</p>
            <p className="text-2xl font-black -mt-2 mb-0.5 leading-tight">Let´s bring your project to life</p>
            <div className="text-sm text-gray-500 mt-2">Send it off!</div>
            <button
              type="submit"
              aria-label="Send message"
              disabled={submitting}
              className="w-20 h-20 flex items-center justify-center transition-colors mb-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-none bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-brand/40 rounded-full"
            >
              <ArrowUpCircle size={56} strokeWidth={2.5} className="text-brand hover:text-brand-dark" />
            </button>
            {success && <div className="mt-4 text-green-600 font-bold text-xl">Email sent successfully!</div>}
            {error && <div className="mt-4 text-red-600 font-bold text-xl">{error}</div>}
          </div>
        </form>
      </div>
    </div>
  );
} 