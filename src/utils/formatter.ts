export const formatDollarAmount = (value: number | string, maximumFractionDigits: number = 2): string => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numericValue)) {
    console.warn(`Invalid input for formatDollarAmount: ${value}`);
    return '$0.00';
  }

  return `$${numericValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits,
  })}`;
};
