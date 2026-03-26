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
    position: relative;
`

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
`

export const CloseButton = styled.button`
    ${flex('column','center','center')}
    ${size('36px','36px')}
    border: none;
    border-radius: 50%;
    background: ${COLORS.grey};
    color: ${COLORS.black};
    cursor: pointer;
    font-size: 18px;
    font-weight: 600;

    &:hover {
        background: ${COLORS.greyDark};
    }
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
`

export const Input = styled.input`
    padding: 14px 0px 14px 30px;
    border-radius: 35px;
    border: 1px solid ${COLORS.grey};
    font-size: 16px;
    background: #fbfbfd;

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
    background: ${COLORS.allWhite};
    cursor: pointer;
    width: 100%;
`

export const CategorySelectWrapper = styled.div`
    position: relative;
    width: 100%;
`

export const CategoryIcon = styled.span`
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    pointer-events: none;
`

export const CategorySelect = styled.select`
    padding: 14px 40px 14px 50px;
    border-radius: 35px;
    border: 1px solid ${COLORS.grey};
    font-size: 16px;
    background: #fbfbfd;
    cursor: pointer;
    width: 100%;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23999' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 20px center;

    &:focus {
        border-color: ${COLORS.info};
        outline: none;
        box-shadow: 0 0 0 4px ${COLORS.shadow};
    }
`

/* =========================
   📸 IMAGE
========================= */

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

export const OptionButton = styled.button.attrs({
  type: 'button'
})`
    ${flex('column','center','center')}
    flex: 1;
    gap: 12px;
    height: 100%;
    border: none;
    background: none;
    cursor: pointer;
    color: ${COLORS.greyDark};
    font-size: 14px;

    &:hover {
        background: ${COLORS.grey};
        color: ${COLORS.info};
    }
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
    object-fit: cover;
`

export const RemoveImage = styled.button.attrs({
  type: 'button'
})`
    ${flex('column','center','center')}
    ${size('30px','30px')}
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    border-radius: 15px;
    background: ${COLORS.greyDark};
    color: ${COLORS.allWhite};
    cursor: pointer;
`

/* =========================
   🗺 MAP
========================= */

export const MapWrapper = styled.div`
    ${size('100%','240px')}
    border-radius: 35px;
    overflow: hidden;
    border: 1px solid ${COLORS.grey};
    position: relative;
`

export const LocateMeButton = styled.button.attrs({type: 'button'})`
    ${flex('column','center','center')}
    ${size('40px','40px')}
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    border-radius: 50%;
    background: ${COLORS.allWhite};
    cursor: pointer;
`

export const CoordsText = styled.p`
    font-size: 11px;
    color: ${COLORS.greyDark};
    text-align: right;
    width: 100%;
    padding-right: 2rem;
`

/* =========================
   ⚠️ FORM
========================= */

export const HiddenInput = styled.input`
    display: none;
`

export const ErrorMessage = styled.p`
    color: ${COLORS.danger};
`

export const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-top: 3rem;
    width: 100%;
`

export const PublishButton = styled.button`
    width: 100%;
    max-width: 320px;
    padding: 16px;
    background: ${COLORS.info};
    color: ${COLORS.allWhite};
    border: none;
    border-radius: 35px;
    font-size: 17px;
    font-weight: 600;
`

export const CancelButton = styled.button`
    width: 100%;
    max-width: 320px;
    margin-top: .8rem;
    padding: 12px;
    background: transparent;
    color: ${COLORS.greyDark};
    border: none;
    font-size: 15px;
`

/* =========================
   📷 CAMERA
========================= */

export const CameraModal = styled.div`
    position: fixed;
    inset: 0;
    background: ${COLORS.black};
    z-index: 3000;
`

export const CameraViewWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100dvh;
`

export const VideoFeed = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
`

export const CameraControls = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
`

export const CaptureButton = styled.button.attrs({
  type: 'button'
})`
    ${size('70px','70px')}
    border-radius: 50%;
`

export const CaptureInner = styled.div`
    ${size('100%','100%')}
    border-radius: 50%;
    background: white;
`

export const CancelCapture = styled.button.attrs({
  type: 'button'
})`
    color: white;
`
