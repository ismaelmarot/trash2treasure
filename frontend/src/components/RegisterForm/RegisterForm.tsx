import { useNavigate } from 'react-router-dom'
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
            <Label>Nombre</Label>
            <Input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre completo"
            required
            />
        </InputGroup>

        <InputGroup>
            <Label>Email</Label>
            <Input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
            />
        </InputGroup>

        <InputGroup>
            <Label>Contraseña</Label>
            <PasswordWrapper>
            <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
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
            <Label>Confirmar Contraseña</Label>
            <PasswordWrapper>
            <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
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
        <SubmitButton type='submit'>Registrarse</SubmitButton>
        </form>
    )
}