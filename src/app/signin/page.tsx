import AuthLayout from '../(auth)/layout'
import LoginPage from '../(auth)/login/page'

export default function SignInPage() {
  return (
    <AuthLayout>
      <LoginPage />
    </AuthLayout>
  )
}
