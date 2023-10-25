import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react'; // Importe useSession

export default function Login() {
  const router = useRouter();
  const { data: session, status } = useSession(); // Use useSession para verificar a sessão

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: 'http://localhost:3000/aluno/dashboard' });
    } catch (error) {
      console.error(error);
    }
  };

  // Verifique se há uma sessão ativa
  if (status === 'authenticated') {
    // Se o usuário estiver autenticado, redirecione para a página "aluno/dashboard"
    router.push('/aluno/dashboard');
    return null; // Você pode retornar null ou qualquer outra coisa aqui
  }

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleGoogleSignIn}>Sign In with Google</button>
    </div>
  );
}
