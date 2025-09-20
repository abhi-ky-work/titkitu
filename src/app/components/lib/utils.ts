// Simple className utility function without external dependencies
export function cn(...inputs) {
  return inputs
    .flat()
    .filter(Boolean)
    .join(" ");
}