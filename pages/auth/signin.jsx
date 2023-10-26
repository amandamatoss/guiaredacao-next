import { signIn } from 'next-auth/react'; // Importe useSession

export default function Login() {

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: 'http://localhost:3000/aluno/dashboard'})
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleGoogleSignIn}>Sign In with Google</button>
    </div>
  );
}
