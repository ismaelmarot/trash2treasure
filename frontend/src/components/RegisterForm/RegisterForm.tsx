import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRegister } from '@/hooks'
import { PasswordValidation } from '@/components'
import { ICONS } from '@/constants'
import { 
    InputGroup,
    Input,
    Label,
    PasswordWrapper,
    ToggleButton,
    SubmitButton,
    ErrorMessage
} from './RegisterForm.styles'

export function RegisterForm() {
    const { t } = useTranslation();
    const { 
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        error,
        handleSubmit,
        validations
    } = useRegister()

    const navigate = useNavigate()

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        handleSubmit(e, navigate)
    }

    return (
        <form onSubmit={onSubmit}>
        <InputGroup>
            <Label>{t('auth.name')}</Label>
            <Input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('auth.namePlaceholder')}
            required
            />
        </InputGroup>

        <InputGroup>
            <Label>{t('auth.email')}</Label>
            <Input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.emailPlaceholder')}
            required
            />
        </InputGroup>

        <InputGroup>
            <Label>{t('auth.password')}</Label>
            <PasswordWrapper>
            <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordMinLength')}
                required
            />
            <ToggleButton
                type='button'
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? <ICONS.eyeOpen /> : <ICONS.eyeClosed />}
            </ToggleButton>
            </PasswordWrapper>

            <PasswordValidation validations={validations} />
        </InputGroup>

        <InputGroup>
            <Label>{t('auth.confirmPassword')}</Label>
            <PasswordWrapper>
            <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                required
            />
            <ToggleButton
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
                {showConfirmPassword ? <ICONS.eyeOpen /> : <ICONS.eyeClosed />}
            </ToggleButton>
            </PasswordWrapper>
        </InputGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        <SubmitButton type='submit'>{t('auth.register')}</SubmitButton>
        </form>
    )
}
