import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ValidationMessage } from "@/components/atoms/ValidationMessage"

export function FormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  validationMessage,
  isValid,
  required = false,
  maxLength,
  autoComplete,
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-foreground/90">
          {label}
        </Label>
      )}
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        className="bg-background/50 border-input/50 focus-visible:ring-blue-500"
        {...props}
      />
      <ValidationMessage message={validationMessage} isValid={isValid} />
    </div>
  )
}


