export function ValidationMessage({ message, isValid, className, ...props }) {
  if (!message) return null

  return (
    <p
      className={`text-sm mt-1 ${
        isValid === false
          ? "text-red-400"
          : isValid === true
          ? "text-green-400"
          : "text-muted-foreground"
      } ${className || ""}`}
      {...props}
    >
      {message}
    </p>
  )
}


