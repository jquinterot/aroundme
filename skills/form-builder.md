---
name: form-builder
description: Build multi-step forms with validation, address search, and map selection. Use for event/place/activity creation flows.
---

This skill guides form creation in the AroundMe application, especially multi-step creation forms.

## Form Pages

- `src/app/create-event/` - Event creation (3 steps)
- `src/app/submit-place/` - Place submission (2 steps)
- `src/app/create-activity/` - Activity creation (single page)

## Multi-Step Form Pattern

### State Management

```typescript
const [currentStep, setCurrentStep] = useState(1);
const [formData, setFormData] = useState({
  title: '',
  description: '',
  category: '',
  // ... other fields
});

const updateField = (field: string, value: string | number | boolean) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};
```

### Step Components

```typescript
// Step 1: Basic Info
function StepBasicInfo({ formData, cities, onUpdate, onNext }) {
  const isValid = formData.title && formData.category && formData.cityId;

  return (
    <div className="space-y-6">
      <FormInput
        label="Title"
        value={formData.title}
        onChange={(value) => onUpdate('title', value)}
        required
        testId="event-title-input"
      />
      
      <FormSelect
        label="City"
        value={formData.cityId}
        onChange={(value) => onUpdate('cityId', value)}
        options={cities.map(c => ({ value: c.slug, label: c.name }))}
      />
      
      <CategorySelector
        label="Category"
        value={formData.category}
        onChange={(value) => onUpdate('category', value)}
        options={EVENT_CATEGORY_OPTIONS}
      />
      
      <FormButton onClick={onNext} disabled={!isValid}>
        Continue
      </FormButton>
    </div>
  );
}
```

### Form Stepper

```typescript
<FormStepper
  totalSteps={3}
  currentStep={currentStep}
  colorScheme="indigo"
  stepLabels={['Info', 'Date', 'Location']}
/>
```

## Form Components

### FormInput

```typescript
<FormInput
  label="Event Title"
  type="text"
  value={formData.title}
  onChange={(value) => updateField('title', value)}
  placeholder="Give your event a catchy title"
  required
  helperText="Choose a clear, descriptive title"
  maxLength={100}
  testId="event-title-input"
/>
```

### FormSelect

```typescript
<FormSelect
  label="City"
  value={formData.cityId}
  onChange={(value) => updateField('cityId', value)}
  options={cities.map(c => ({ value: c.slug, label: c.name }))}
  required
/>
```

### CategorySelector

```typescript
<CategorySelector
  label="Category"
  value={formData.category}
  onChange={(value) => updateField('category', value)}
  options={EVENT_CATEGORY_OPTIONS}
  colorScheme="indigo"  // or 'teal' or 'amber'
  testId="event-category"
/>
```

### ToggleOption

```typescript
<ToggleOption
  options={[
    { value: true, label: 'Free', icon: '🎉', description: 'Free Event' },
    { value: false, label: 'Paid', icon: '💰', description: 'Paid Event' },
  ]}
  selected={formData.isFree}
  onChange={(value) => updateField('isFree', value)}
/>
```

### DateTimeInput

```typescript
<DateTimeInput
  label="Start Date"
  dateValue={formData.startDate}
  timeValue={formData.startTime}
  onDateChange={(value) => updateField('startDate', value)}
  onTimeChange={(value) => updateField('startTime', value)}
  required
  helperText="When does the event begin?"
/>
```

### FormNavigation

```typescript
<FormNavigation
  onBack={onBack}
  onNext={onNext}
  nextLabel="Continue to Location"
  backLabel="Back"
  isNextDisabled={!isValid}
/>
```

## Location Section

```typescript
<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    Venue Address <span className="text-red-500">*</span>
  </label>
  <AddressSearchInput
    value={formData.venueAddress}
    onChange={(value) => updateField('venueAddress', value)}
    onLocationSelect={(lat, lng, address) => {
      updateField('venueLat', lat);
      updateField('venueLng', lng);
      updateField('venueAddress', address);
    }}
    placeholder="Search for an address..."
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
    Pin Location
  </label>
  <LocationPicker
    lat={formData.venueLat || 0}
    lng={formData.venueLng || 0}
    onLocationChange={(lat, lng, address) => {
      updateField('venueLat', lat);
      updateField('venueLng', lng);
      if (address) updateField('venueAddress', address);
    }}
  />
</div>
```

## Form Submission

```typescript
const handleSubmit = async () => {
  setIsLoading(true);
  
  try {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        tags: formData.tags || '',
        price: formData.isFree ? 0 : parseFloat(formData.price),
      }),
    });

    const data = await response.json();

    if (data.success) {
      router.push(`/event/${data.data.id}`);
    } else {
      setError(data.error);
    }
  } catch (err) {
    setError('Something went wrong');
  } finally {
    setIsLoading(false);
  }
};
```

## Validation

### Client-side
```typescript
const isValid = formData.title && 
  formData.category && 
  formData.description &&
  formData.cityId &&
  formData.venueName &&
  formData.venueAddress;
```

### Server-side
```typescript
const validation = await validateRequestBody(
  request,
  createEventValidationRules(),
  'POST /api/events'
);

if (!validation.success) {
  return errorResponse(
    formatValidationErrors(validation.errors),
    400,
    'VALIDATION_ERROR'
  );
}
```

## Form Section Pattern

```typescript
<FormSection title="Location & Pricing">
  <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2 mb-4">
    Where will your event take place?
  </p>
  
  {/* Form fields */}
  
  <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
    <div className="flex items-start gap-3">
      <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-indigo-700 dark:text-indigo-300">
        Helpful tip here
      </p>
    </div>
  </div>
</FormSection>
```

## Category Options

```typescript
// src/lib/constants.ts
export const EVENT_CATEGORY_OPTIONS = [
  { value: 'music', label: 'Music', icon: '🎵' },
  { value: 'food', label: 'Food', icon: '🍔' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'art', label: 'Art', icon: '🎨' },
  { value: 'tech', label: 'Tech', icon: '💻' },
  { value: 'community', label: 'Community', icon: '👥' },
  { value: 'nightlife', label: 'Nightlife', icon: '🌙' },
  { value: 'outdoor', label: 'Outdoor', icon: '🌳' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'other', label: 'Other', icon: '✨' },
];

export const PLACE_CATEGORY_OPTIONS = [
  { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { value: 'cafe', label: 'Cafe', icon: '☕' },
  { value: 'bar', label: 'Bar', icon: '🍸' },
  // ... etc
];
```

## Checklist

- [ ] Step components separated
- [ ] FormStepper for progress
- [ ] Validation on each step
- [ ] Helper text on fields
- [ ] Character limits on textareas
- [ ] Address search integrated
- [ ] Location picker integrated
- [ ] Proper loading state
- [ ] Error handling
- [ ] Test IDs on all inputs
