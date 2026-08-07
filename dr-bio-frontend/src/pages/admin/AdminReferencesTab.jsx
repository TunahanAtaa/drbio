import React from 'react';
import { createPortal } from 'react-dom';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Textarea from '../../components/ui/Textarea';
import Card from '../../components/ui/Card';

const AdminReferencesTab = ({
  filteredReferences = [],
  refSearch = '',
  setRefSearch,
  handleOpenRefModal,
  handleDeleteRef,
  refModalOpen,
  setRefModalOpen,
  editingRef,
  refFormData,
  setRefFormData,
  handleSaveRef,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200">Referans Kütüphanesi</h2>
          <p className="text-xs font-bold text-slate-400 mt-1">Tahlil parametrelerinin alt/üst sınırları ve otomatik yapay zeka öneri metinleri</p>
        </div>

        <Button
          onClick={() => handleOpenRefModal()}
          variant="primary"
          size="md"
          className="self-start md:self-auto space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Parametre Ekle</span>
        </Button>
      </div>

      {/* Arama Çubuğu */}
      <Card padding="p-4" rounded="rounded-3xl">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400" />
          <Input
            type="text"
            placeholder="Parametre adı veya kategori ara (Örn. Hemoglobin, Biyokimya)..."
            value={refSearch}
            onChange={(e) => setRefSearch(e.target.value)}
            className="pl-11 py-2.5 text-xs"
          />
        </div>
      </Card>

      {/* Referans Kartları Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReferences.map((ref) => (
          <Card 
            key={ref.id}
            padding="p-6"
            rounded="rounded-3xl"
            className="flex flex-col justify-between space-y-4 relative group"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="px-3 py-1 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {ref.category || 'Tahlil'}
                </span>
                
                <div className="flex items-center space-x-1">
                  <button 
                    onClick={() => handleOpenRefModal(ref)}
                    className="p-2 bg-theme-bg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition"
                    title="Düzenle"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteRef(ref.id)}
                    className="p-2 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 rounded-xl transition"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mb-1">{ref.name}</h3>

              <div className="inline-flex items-center space-x-2 bg-theme-bg px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs font-black text-slate-700 dark:text-slate-300 my-2">
                <span>Referans:</span>
                <span className="text-red-600 dark:text-red-400">{ref.min} - {ref.max} {ref.unit}</span>
              </div>

              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed mt-2 bg-theme-bg p-3 rounded-2xl">
                <span className="font-black text-slate-700 dark:text-slate-300 block mb-0.5">Otomatik AI Öneri Metni:</span>
                {ref.text}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* --- REFERANS EKLE / DÜZENLE MODAL --- */}
      {refModalOpen && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-theme-card w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border-theme-border space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-200">
                {editingRef ? 'Parametre Düzenle' : 'Yeni Parametre Ekle'}
              </h3>
              <button onClick={() => setRefModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRef} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Parametre Adı</label>
                <Input
                  type="text" required
                  placeholder="Örn: Hemoglobin (HGB)"
                  value={refFormData.name}
                  onChange={(e) => setRefFormData({ ...refFormData, name: e.target.value })}
                  className="py-3 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Min Ref</label>
                  <Input
                    type="text" required
                    placeholder="13.5"
                    value={refFormData.min}
                    onChange={(e) => setRefFormData({ ...refFormData, min: e.target.value })}
                    className="px-3 py-3 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Max Ref</label>
                  <Input
                    type="text" required
                    placeholder="17.5"
                    value={refFormData.max}
                    onChange={(e) => setRefFormData({ ...refFormData, max: e.target.value })}
                    className="px-3 py-3 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Birim</label>
                  <Input
                    type="text" required
                    placeholder="g/dL"
                    value={refFormData.unit}
                    onChange={(e) => setRefFormData({ ...refFormData, unit: e.target.value })}
                    className="px-3 py-3 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Kategori</label>
                <Select
                  value={refFormData.category}
                  onChange={(e) => setRefFormData({ ...refFormData, category: e.target.value })}
                  className="py-3 text-xs"
                >
                  <option value="Kan Sayımı">Kan Sayımı</option>
                  <option value="Biyokimya">Biyokimya</option>
                  <option value="Vitamin">Vitamin & Mineral</option>
                  <option value="Karaciğer">Karaciğer</option>
                  <option value="Hormon">Hormon</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Otomatik AI Öneri Metni</label>
                <Textarea
                  required rows="3"
                  placeholder="Parametre anormal çıktığında hastaya sunulacak öneri metni..."
                  value={refFormData.text}
                  onChange={(e) => setRefFormData({ ...refFormData, text: e.target.value })}
                  className="py-3 text-xs"
                ></Textarea>
              </div>

              <div className="pt-2 flex gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1 py-3.5 text-xs"
                >
                  Kaydet
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setRefModalOpen(false)}
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

export default AdminReferencesTab;
