import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  Database,
  Download,
  Upload,
  Trash2,
  User,
  Mail,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';
import { clearAllData } from '../../utils/localStorage';

interface SettingsPageProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function SettingsPage({ darkMode, toggleDarkMode }: SettingsPageProps) {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [goalReminders, setGoalReminders] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleClearAllData = () => {
    if (showDeleteConfirm) {
      clearAllData();
      alert('Semua data telah dihapus. Halaman akan dimuat ulang.');
      window.location.reload();
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000);
    }
  };

  return (
    <div className="p-6 space-y-6 dark:bg-gray-900">
      {/* Header */}
      <div>
        <h1 className="text-gray-900 dark:text-white">Pengaturan</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Kelola preferensi dan pengaturan aplikasi Anda
        </p>
      </div>

      {/* Appearance */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Tampilan</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Sesuaikan tampilan aplikasi sesuai preferensi Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-600" />
              )}
              <div>
                <p className="text-gray-900 dark:text-white">Mode Gelap</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Aktifkan tema gelap untuk kenyamanan mata
                </p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Notifikasi</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Atur pengingat dan notifikasi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-gray-900 dark:text-white">Notifikasi Push</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Terima notifikasi langsung di aplikasi
                </p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-gray-900 dark:text-white">Notifikasi Email</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Terima laporan bulanan via email
                </p>
              </div>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>

          <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="text-gray-900 dark:text-white">Peringatan Budget</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Dapatkan peringatan saat mendekati limit budget
                </p>
              </div>
            </div>
            <Switch checked={budgetAlerts} onCheckedChange={setBudgetAlerts} />
          </div>

          <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-gray-900 dark:text-white">Pengingat Target</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ingatkan progress target keuangan
                </p>
              </div>
            </div>
            <Switch checked={goalReminders} onCheckedChange={setGoalReminders} />
          </div>
        </CardContent>
      </Card>

      {/* Account */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Akun</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Kelola informasi akun Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="dark:text-white">Nama Lengkap</Label>
            <Input 
              placeholder="Masukkan nama lengkap"
              className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="dark:text-white">Email</Label>
            <Input 
              type="email"
              placeholder="nama@email.com"
              className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"
            />
          </div>
          <Button>Simpan Perubahan</Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Keamanan</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Atur keamanan akun Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start">
            <Lock className="w-4 h-4 mr-2" />
            Ubah Kata Sandi
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Shield className="w-4 h-4 mr-2" />
            Autentikasi Dua Faktor
          </Button>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Manajemen Data</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Import, export, dan kelola data Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export Data (CSV)
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Button>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white">Zona Berbahaya</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">
                  Tindakan ini akan menghapus semua data Anda dan tidak dapat dibatalkan
                </p>
                <Button variant="destructive" size="sm" onClick={handleClearAllData}>
                  {showDeleteConfirm ? 'Konfirmasi Hapus' : 'Hapus Semua Data'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Tentang Aplikasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Versi</span>
            <span className="text-gray-900 dark:text-white">2.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Build</span>
            <span className="text-gray-900 dark:text-white">2025.11.22</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Status</span>
            <span className="text-green-600 dark:text-green-400">Aktif</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}