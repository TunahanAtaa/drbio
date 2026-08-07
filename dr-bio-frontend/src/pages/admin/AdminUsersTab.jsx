import React from 'react';
import { createPortal } from 'react-dom';
import { UserPlus, Search, Shield, Eye, Trash2, X, UserCheck, Scale, Stethoscope } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';

const AdminUsersTab = ({
  filteredUsers = [],
  userSearch = '',
  setUserSearch,
  toggleUserStatus,
  handleDeleteUser,
  handleChangeRole,
  selectedUserDetail,
  setSelectedUserDetail,
  getGenderStyles,
  userModalOpen,
  setUserModalOpen,
  newUserFormData,
  setNewUserFormData,
  handleAddUserSubmit,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200">Kullanıcı Yönetimi</h2>
          <p className="text-xs font-bold text-slate-400 mt-1">Sistemde kayıtlı tüm hasta ve yönetici hesaplarının kontrolü ve detay incelemesi</p>
        </div>

        <Button
          onClick={() => setUserModalOpen(true)}
          variant="primary"
          size="md"
          className="self-start md:self-auto space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Yeni Kullanıcı Ekle</span>
        </Button>
      </div>

      {/* Arama Çubuğu */}
      <Card padding="p-4" rounded="rounded-3xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
          <Input
            type="text"
            placeholder="Kullanıcı adı veya e-posta adresi ara..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="pl-11 py-2.5 text-xs"
          />
        </div>
      </Card>

      {/* Kullanıcı Kartları Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => {
          const gStyle = getGenderStyles(user.healthProfile?.gender);
          return (
            <Card 
              key={user.id}
              padding="p-6"
              rounded="rounded-3xl"
              className="flex flex-col justify-between space-y-4 relative group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${gStyle.avatarBg} rounded-2xl flex items-center justify-center font-black text-lg shadow-sm`}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-black text-slate-800 dark:text-slate-200 text-sm">{user.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${gStyle.badgeBg}`}>
                          {gStyle.label}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-400 truncate max-w-[180px]">{user.email}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    user.role === 'ADMIN' 
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800' 
                      : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                  }`}>
                    {user.role === 'ADMIN' ? 'YÖNETİCİ' : 'HASTA'}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-theme-bg p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="block text-[9px] font-black text-slate-400 uppercase">Yaş</span>
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300">{user.healthProfile?.age || '28'}</span>
                  </div>
                  <div className="bg-theme-bg p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="block text-[9px] font-black text-slate-400 uppercase">Boy</span>
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300">{user.healthProfile?.height || '175'} cm</span>
                  </div>
                  <div className="bg-theme-bg p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="block text-[9px] font-black text-slate-400 uppercase">Kilo</span>
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300">{user.healthProfile?.weight || '68'} kg</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setSelectedUserDetail(user)}
                    className="p-2 bg-theme-bg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition flex items-center space-x-1 text-xs font-bold"
                    title="Detay İncele"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>İncele</span>
                  </button>

                  <select
                    value={user.role}
                    onChange={(e) => handleChangeRole(user.id, e.target.value)}
                    className="px-2 py-1.5 bg-theme-bg border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black text-slate-700 dark:text-slate-300 cursor-pointer focus:outline-none"
                  >
                    <option value="PATIENT">Hasta</option>
                    <option value="ADMIN">Yönetici</option>
                  </select>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => toggleUserStatus(user.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black transition ${
                      user.status === 'ACTIVE'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100'
                    }`}
                  >
                    {user.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}
                  </button>

                  <button
                    onClick={() => handleDeleteUser(user.id, user.name)}
                    className="p-1.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 rounded-xl transition"
                    title="Kullanıcıyı Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* --- KULLANICI DETAY İNCELEME MODALI --- */}
      {selectedUserDetail && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-theme-card w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl border-theme-border space-y-6 max-h-[90vh] overflow-y-auto">
            {(() => {
              const gStyle = getGenderStyles(selectedUserDetail.healthProfile?.gender);
              return (
                <>
                  <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 ${gStyle.avatarBg} rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm`}>
                        {selectedUserDetail.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200">{selectedUserDetail.name}</h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${gStyle.badgeBg}`}>
                            {gStyle.label}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-400">{selectedUserDetail.email}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedUserDetail(null)} 
                      className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* 1. Temel Hesap Bilgileri */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                      <UserCheck className="w-4 h-4 text-red-600" />
                      <span>Hesap ve İletişim Bilgileri</span>
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-theme-bg p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Kullanıcı Rolü</span>
                        <span className="text-sm font-black text-slate-800 dark:text-slate-200">
                          {selectedUserDetail.role === 'ADMIN' ? 'Yönetici' : 'Hasta'}
                        </span>
                      </div>
                      <div className="bg-theme-bg p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Kayıt Tarihi</span>
                        <span className="text-sm font-black text-slate-800 dark:text-slate-200">{selectedUserDetail.regDate || '2026-08-01'}</span>
                      </div>
                      <div className="bg-theme-bg p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Hesap Durumu</span>
                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{selectedUserDetail.status}</span>
                      </div>
                      <div className="bg-theme-bg p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Kimlik Doğrulama</span>
                        <span className="text-sm font-black text-blue-600 dark:text-blue-400">E-Posta Doğrulanmış</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Fiziksel Bilgiler */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                      <Scale className="w-4 h-4 text-red-600" />
                      <span>Fiziksel Özellikler & Ölçümler</span>
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-theme-bg p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Yaş</span>
                        <span className="text-base font-black text-slate-800 dark:text-slate-200">{selectedUserDetail.healthProfile?.age || '28'} Yaş</span>
                      </div>
                      <div className="bg-theme-bg p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Boy</span>
                        <span className="text-base font-black text-slate-800 dark:text-slate-200">{selectedUserDetail.healthProfile?.height || '175'} cm</span>
                      </div>
                      <div className="bg-theme-bg p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">Kilo</span>
                        <span className="text-base font-black text-slate-800 dark:text-slate-200">{selectedUserDetail.healthProfile?.weight || '68'} kg</span>
                      </div>
                      <div className="bg-theme-bg p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <span className="block text-[10px] font-black text-slate-400 uppercase">VKİ (İndeks)</span>
                        <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                          {(() => {
                            const h = parseFloat(selectedUserDetail.healthProfile?.height || 175) / 100;
                            const w = parseFloat(selectedUserDetail.healthProfile?.weight || 68);
                            const bmi = (w / (h * h)).toFixed(1);
                            return `${bmi} (Normal)`;
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Button */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                    <Button variant="secondary" onClick={() => setSelectedUserDetail(null)}>
                      Kapat
                    </Button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>,
        document.body
      )}

      {/* --- KULLANICI EKLE MODAL --- */}
      {userModalOpen && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-theme-card w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border-theme-border space-y-5">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-200">Yeni Kullanıcı Oluştur</h3>
              <button onClick={() => setUserModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Ad Soyad</label>
                <Input
                  type="text" required
                  placeholder="Ahmet Yılmaz"
                  value={newUserFormData.name}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, name: e.target.value })}
                  className="py-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">E-posta Adresi</label>
                <Input
                  type="email" required
                  placeholder="ahmet@ornek.com"
                  value={newUserFormData.email}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, email: e.target.value })}
                  className="py-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Şifre</label>
                <Input
                  type="password" required
                  placeholder="••••••••"
                  value={newUserFormData.password}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, password: e.target.value })}
                  className="py-3 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Rol</label>
                <Select
                  value={newUserFormData.role}
                  onChange={(e) => setNewUserFormData({ ...newUserFormData, role: e.target.value })}
                  className="py-3 text-xs"
                >
                  <option value="PATIENT">Hasta</option>
                  <option value="ADMIN">Yönetici (Admin)</option>
                </Select>
              </div>

              <div className="pt-2 flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 py-3.5 text-xs"
                >
                  Kullanıcıyı Kaydet
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setUserModalOpen(false)}
                  className="px-5 py-3.5 text-xs"
                >
                  İptal
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default AdminUsersTab;
