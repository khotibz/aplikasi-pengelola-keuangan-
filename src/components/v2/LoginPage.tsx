import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Wallet, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string, name: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userName = name || email.split('@')[0] || 'Pengguna';
    onLogin(email, password, userName);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-gray-900 mb-2">
            Pengelola Keuangan v2.0
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Kelola keuangan dengan lebih pintar
          </p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-2">
            <CardTitle>Selamat Datang Kembali</CardTitle>
            <CardDescription>
              Masuk untuk melanjutkan ke dashboard Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nama</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nama Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11"
                />
              </div>
              <Button type="submit" className="w-full h-11">
                Masuk ke Dashboard
              </Button>
              <div className="text-center">
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Lupa kata sandi?
                </a>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          Belum punya akun?{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Daftar sekarang
          </a>
        </p>
      </div>
    </div>
  );
}