import type { AlignItems, FlexDirection, JustifyContent } from '../types'

export const flex = (
    direction: FlexDirection = 'row',
    align: AlignItems = 'stretch',
    justify: JustifyContent = 'flex-start'
) => `
    display: flex;
    flex-direction: ${direction};
    align-items: ${align};
    justify-content: ${justify};
`