'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { DiscordLogoIcon, GitHubLogoIcon } from '@radix-ui/react-icons';

export function Signup() {
  const { replace, refresh } = useRouter();
  const supabase = createClientComponentClient();

  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    setError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    replace('/');
    refresh();

    toast({
      title: 'Success',
      description: 'You have successfully signed up.',
    });
  };

  const handleSocialSignUp = async (provider: 'discord' | 'github') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto p-6 bg-zinc-900 rounded-lg shadow-lg">
      <h1 className="text-xl font-semibold text-white mb-2">Sign Up</h1>
      <p className="text-sm text-gray-400 mb-6">Create your ByteBin account today</p>

      <div className="flex gap-4 w-full mb-6">
        <Button
          onClick={() => handleSocialSignUp('discord')}
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white"
        >
          <DiscordLogoIcon className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => handleSocialSignUp('github')}
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white"
        >
          <GitHubLogoIcon className="w-4 h-4" />
        </Button>
      </div>

      <div className="w-full space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-400 pl-10"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-400 pl-10"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="password"
            placeholder="Your Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-400 pl-10"
          />
        </div>

        <Button
          onClick={handleSignUp}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Sign up
        </Button>
      </div>

      <div className="mt-4 text-center">
        <div className="text-sm text-gray-400">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-emerald-500 hover:text-emerald-400">
            Sign in
          </Link>
        </div>
      </div>

      {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
    </div>
  );
}
