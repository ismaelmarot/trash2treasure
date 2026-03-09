import type { SizeValue } from '../types'

export function formatSize(value: SizeValue): string {
    if (typeof value === 'number') {
        return `${value}px`;
    }
    return value;
}

export function size(width?: SizeValue, height?: SizeValue): string {
    return `
        width: ${width ? formatSize(width) : 'auto'};
        height: ${height ? formatSize(height) : 'auto'};
    `
}