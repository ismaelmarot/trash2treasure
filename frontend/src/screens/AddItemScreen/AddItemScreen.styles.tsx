import styled from 'styled-components'
import { flex, size } from '@/mixins'
import { COLORS } from '@/constants'

export const Container = styled.div`
    ${flex('column','center','center')}
    padding: 20px;
    background: ${COLORS.white};
    min-height: calc(100vh - 80px);
`

export const Card = styled.div`
    background: ${COLORS.allWhite};
    padding: 35px;
    border-radius: 28px;
    width: 100%;
    max-width: 600px;
    box-shadow: 0 4px 20px ${COLORS.shadow};
`

export const Title = styled.h1`
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 8px;
    color: ${COLORS.black};
`

export const Subtitle = styled.p`
    color: ${COLORS.greyDark};
    margin-bottom: 32px;
    font-size: 15px;
`

export const SuccessView = styled.div`
    ${flex('column','center','center')}
    padding: 40px 0;
    text-align: center;
`

export const SuccessIcon = styled.div`
    font-size: 64px;
    margin-bottom: 24px;
    animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    
    @keyframes pop {
        0% { transform: scale(0); }
        100% { transform: scale(1); }
    }
`

export const SuccessText = styled.p`
    margin-top: 20px;
    font-size: 14px;
    color: ${COLORS.info};
    font-weight: 500;
`

export const Form = styled.form`
    ${flex('column','center','center')}
    gap: 24px;
`

export const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`

export const Label = styled.label<{ required?: boolean }>`
    font-size: 10px;
    font-weight: 600;
    margin-top: 2rem;
    color: ${COLORS.black};
    text-align: center;
    
    ${({ required }) => required && `
        &::after {
            content: ' *';
            color: ${COLORS.danger};
        }
    `}
`;

export const Input = styled.input`
    padding: 14px 0px 14px 30px;
    border-radius: 35px;
    border: 1px solid ${COLORS.grey};
    font-size: 16px;
    background: #fbfbfd;
    transition: all 0.2s ease;
    
    &:focus {
        border-color: ${COLORS.info};
        outline: none;
        box-shadow: 0 0 0 4px ${COLORS.shadow};
    }
`

export const TextArea = styled.textarea`
    padding: 14px 30px;
    border-radius: 35px;
    min-height: 10rem;
    border: 1px solid ${COLORS.grey};
    font-size: 16px;
    font-family: inherit;
    background: #fbfbfd;
    resize: none;
    
    &:focus {
        border-color: ${COLORS.info};
        outline: none;
        box-shadow: 0 0 0 4px ${COLORS.shadow};
  }
`

export const Select = styled.select`
    padding: 14px 40px 14px 20px;
    border-radius: 35px;
    border: 1px solid ${COLORS.grey};
    font-size: 16px;
    background: ${COLORS.allWhite} url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="%23666" d="M6 8L1 3h10z"/></svg>') no-repeat right 15px center;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
`

export const ImageContainer = styled.div`
    ${size('100%','220px')}
    border-radius: 35px;
    border: 1px solid ${COLORS.grey};
    background: ${COLORS.white};
    overflow: hidden;
    position: relative;
`

export const OptionsContainer = styled.div`
    ${flex('row','center','center')}
    ${size('100%','100%')}
`

export const OptionButton = styled.button`
    ${flex('column','center','center')}
    flex: 1;
    gap: 12px;
    height: 100%;
    border: none;
    background: none;
    cursor: pointer;
    color: ${COLORS.greyDark};
    font-size: 14px;
    font-family: inherit;
    transition: background 0.2s ease;
    
    &:hover {
        background: ${COLORS.grey};
        color: ${COLORS.info};
    }
`

export const IconText = styled.span`
    font-size: 32px;
`

export const DividerVertical = styled.div`
    ${size('1px','80%')}
    background: ${COLORS.grey};
`

export const PreviewWrapper = styled.div`
    ${size('100%','100%')}
    position: relative;
`

export const PreviewImage = styled.img`
    ${size('100%','100%')}
    display: block;
    object-fit: cover;
`

export const RemoveImage = styled.button`
    ${flex('column','center','center')}
    ${size('30px','30px')}
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    font-size: 20px;
    cursor: pointer;
    border-radius: 15px;
    background: ${COLORS.greyDark};
    color: ${COLORS.allWhite};
`

export const MapWrapper = styled.div`
    ${size('100%','240px')}
    border-radius: 35px;
    overflow: hidden;
    border: 1px solid ${COLORS.grey};
    position: relative;
    z-index: 1;

    .leaflet-control-zoom {
        border: none;
    }

    .leaflet-control-zoom.leaflet-bar {
        border: none;
        box-shadow: none;
    }

    .leaflet-control-zoom.leaflet-bar a {
        ${size('34px','34px')}
        font-size: 18px;
        line-height: 34px;
        border: 1px solid ${COLORS.grey};
        box-shadow: 0 2px 8px ${COLORS.shadow};
        color: ${COLORS.black};
        background: ${COLORS.allWhite};

        &:hover {
            color: ${COLORS.allWhite};
            background-color: ${COLORS.info} !important;
        }
    }

    .leaflet-control-zoom-in {
        border-top-left-radius: 50% !important;
        border-top-right-radius: 50% !important;
    }

    .leaflet-control-zoom-out {
        border-bottom-left-radius: 50% !important;
        border-bottom-right-radius: 50% !important;
    }
`

export const LocateMeButton = styled.button`
    ${flex('column','center','center')}
    ${size('40px','40px')}
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    border: 1px solid ${COLORS.greyDark};
    border-radius: 35px;
    background: ${COLORS.allWhite};
    box-shadow: 0 2px 8px ${COLORS.shadow};
    font-size: 20px;
    cursor: pointer;
    
    &:hover {
        background: ${COLORS.info};
    }
`

export const CoordsText = styled.p`
    font-size: 11px;
    color: ${COLORS.greyDark};
    text-align: right;
    padding-right: 1rem;
    width: 100%;
`

export const HiddenInput = styled.input`
    display: none;
`

export const ErrorMessage = styled.p`
    color: ${COLORS.danger};
    font-size: 14px;
    background: ${COLORS.allWhite};
    padding: 12px;
    border-radius: 10px;
    border: 1px solid ${COLORS.shadow};
`

export const ContainerSubmitButton = styled.div`
    ${flex('column','center','center')};
    margin: 2.5rem 0 0rem;
`

export const SubmitButton = styled.button`
    background: ${COLORS.info};
    color: ${COLORS.allWhite};
    border: none;
    padding: 18px;
    border-radius: 35px;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
        background: ${COLORS.info};
        transform: translateY(-1px);
        box-shadow: 0 4px 12px ${COLORS.shadow};
    }

    &:active {
        transform: translateY(0);
    }
    
    &:disabled {
        background: #d2d2d7;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
`

export const CameraModal = styled.div`
    ${flex('column','center','center')}
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${COLORS.black};
    z-index: 3000;
`

export const CameraViewWrapper = styled.div`
    ${flex('column','center','center')}
    position: relative;
    ${size('100%','100%')}
    max-width: 500px;
`

export const VideoFeed = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

export const CameraControls = styled.div`
    ${flex('row','center','space-between')}
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 120px;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(10px);
    padding: 0 40px;
`

export const CaptureButton = styled.button`
    ${flex('column','center','center')}
    ${size('70px','70px')}
    border-radius: 50%;
    border: 4px solid white;
    background: none;
    padding: 4px;
    cursor: pointer;
    
    &:active {
        transform: scale(0.92);
    }
`

export const CaptureInner = styled.div`
    ${size('100%','100%')}
    border-radius: 50%;
    background: ${COLORS.allWhite};
    `

export const CancelCapture = styled.button`
    background: none;
    border: none;
    color: ${COLORS.allWhite};
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
`