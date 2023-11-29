<<<<<<< HEAD
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { userState } from '../../atom/userAtom';
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
=======
import { signIn } from 'next-auth/react'; // Importe useSession
import Head from 'next/head';
import { Button, Divider, Grid, Text, TextInput } from '@mantine/core'
import { IconBrandGoogle, IconMail } from '@tabler/icons-react'
import imgSignIn from '../../public/signin.svg'
import Image from 'next/image'
import { useMediaQuery } from '@mantine/hooks';
export default function Login() {
>>>>>>> 8b6781fe0a38a8763b57cb3b6cdfb971f9746ebc

  const matches = useMediaQuery("(max-width: 991px)");

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: 'http://localhost:3000/aluno/dashboard'})
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
    <Head>
        <title>Login | GUIA</title>
      </Head>
    <Grid style={{ display: 'flex', alignItems: 'center', height: '100vh'}}>
      {!matches ? (<Grid.Col span={{ base: 12, md: 6}} p={100} >
          <Image src={imgSignIn} layout='responsive'/>
      </Grid.Col>) : null}
      
      <Grid.Col span={{ base: 12, md: 6, sm: 12}} p={100} style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: '20px'}}>
          <Text fw={700} size='22px' style={{ textAlign: 'center'}}> Use suas informações para embarcar rumo ao sucesso! 🚀 </Text>
          <Button variant='default' size='lg' fullWidth leftSection={<IconBrandGoogle size={24} />} onClick={handleGoogleSignIn}>Entrar com o Google</Button>
          <Divider my="xs" label="Entrar com e-mail" labelPosition="center" />
          <TextInput w='100%' size='lg' leftSection={<IconMail size={20} />} placeholder='Seu email'/>
          <Button variant='gradient' size='lg' gradient={{ from: 'lime', to: 'green', deg: 90 }} fullWidth>ENTRAR</Button>
      </Grid.Col>
    </Grid>
    </>
  );
}
