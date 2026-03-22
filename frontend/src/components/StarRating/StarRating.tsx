import { COLORS } from '@/constants'

interface StarRatingProps {
  total: number
  filled: number
  maxStars?: number
  size?: number
}

export function StarRating({ total, filled, maxStars = 6, size = 20 }: StarRatingProps) {
  const rows = Math.ceil(total / maxStars)
  const filledRows = Math.floor(filled / maxStars)
  const remainingFilled = filled % maxStars

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
      {Array.from({ length: rows }).map((_, rowIndex) => {
        const starsInRow = rowIndex === rows - 1 
          ? total % maxStars || maxStars 
          : maxStars
        
        const filledInRow = rowIndex < filledRows 
          ? starsInRow 
          : rowIndex === filledRows 
            ? remainingFilled 
            : 0

        return (
          <div key={rowIndex} style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: starsInRow }).map((_, starIndex) => (
              <span
                key={starIndex}
                style={{
                  fontSize: `${size}px`,
                  color: starIndex < filledInRow ? COLORS.primaryDark : '#e0e0e0',
                  transition: 'color 0.3s ease'
                }}
              >
                ★
              </span>
            ))}
          </div>
        )
      })}
      <div style={{ 
        fontSize: '12px', 
        color: '#666', 
        marginTop: '4px',
        fontWeight: '500'
      }}>
        {filled} / {total}
      </div>
    </div>
  )
}
