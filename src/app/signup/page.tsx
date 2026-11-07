import AuthLayout from '../(auth)/layout'
import RegisterPage from '../(auth)/register/page'

export default function SignUpPage() {
  return (
    <AuthLayout>
      <RegisterPage />
    </AuthLayout>
  )
}
