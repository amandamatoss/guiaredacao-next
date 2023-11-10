import { signIn } from 'next-auth/react'; // Importe useSession
import Head from 'next/head';
import { Button, Divider, Grid, Text, TextInput } from '@mantine/core'
import { IconBrandGoogle, IconMail } from '@tabler/icons-react'
import imgSignIn from '../../public/signin.svg'
import Image from 'next/image'
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
export default function Login() {

  const matches = useMediaQuery("(max-width: 991px)");
  const [emailValue, setEmailValue] = useState('')

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
          <TextInput w='100%' size='lg' leftSection={<IconMail size={20} />} placeholder='Seu email' value={emailValue} onChange={(e) => setEmailValue(e.target.value)}/>
          <Button variant='gradient' size='lg' gradient={{ from: 'lime', to: 'green', deg: 90 }} fullWidth>ENTRAR</Button>
      </Grid.Col>
    </Grid>
    </>
  );
}
