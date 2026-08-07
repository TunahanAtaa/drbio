import os

file_path = "/home/tuno/Belgeler/drbio/dr-bio-frontend/src/pages/AdminDashboard.jsx"
with open(file_path, "r") as f:
    content = f.read()

# Fix fetchData
old_fetch = """        if (usersRes.data && Array.isArray(usersRes.data) && usersRes.data.length > 0) {
          setUsersList(usersRes.data);
        } else {
          setUsersList(defaultAdminUsers);
        }

        if (refsRes.data && Array.isArray(refsRes.data) && refsRes.data.length > 0) {
          setReferences(refsRes.data);
        } else {
          setReferences(defaultReferences);
        }

        setTotalReports(reportsRes.data && Array.isArray(reportsRes.data) ? reportsRes.data.length : 142);
      } catch (err) {
        console.warn('Backend verileri çekilemedi veya yetki yetersiz, demo veriler ile devam ediliyor:', err);
        setUsersList(defaultAdminUsers);
        setReferences(defaultReferences);
        setTotalReports(142);
      }"""

new_fetch = """        if (usersRes.data && Array.isArray(usersRes.data)) {
          setUsersList(usersRes.data);
        }

        if (refsRes.data && Array.isArray(refsRes.data)) {
          const mappedRefs = refsRes.data.map(r => ({
            id: r.id,
            name: r.parameterName || '',
            min: r.minValue || '',
            max: r.maxValue || '',
            unit: r.unit || '',
            category: 'Biyokimya',
            text: r.lowRecommendation || r.normalRecommendation || ''
          }));
          setReferences(mappedRefs);
        }

        setTotalReports(reportsRes.data && Array.isArray(reportsRes.data) ? reportsRes.data.length : 0);
      } catch (err) {
        console.error('Backend verileri çekilemedi:', err);
        setErrorData('Veriler yüklenemedi, sunucu ile iletişim kurulamadı. Lütfen tekrar deneyiniz.');
      }"""
      
content = content.replace(old_fetch, new_fetch)

# Fix saveReferences
old_save = """  const saveReferences = async (refData, isEdit) => {
    try {
      if (isEdit) {
        const res = await api.put(`/reference-values/${refData.id}`, refData);
        setReferences(references.map(r => r.id === res.data.id ? res.data : r));
      } else {
        const res = await api.post('/reference-values', refData);
        setReferences([res.data, ...references]);
      }
    } catch (error) {
      console.error("Referans kaydedilemedi", error);
    }
  };"""

new_save = """  const saveReferences = async (refData, isEdit) => {
    try {
      const backendPayload = {
        parameterName: refData.name,
        minValue: parseFloat(refData.min) || null,
        maxValue: parseFloat(refData.max) || null,
        unit: refData.unit,
        lowRecommendation: refData.text,
        highRecommendation: refData.text,
        normalRecommendation: 'Normal'
      };

      if (isEdit) {
        const res = await api.put(`/reference-values/${refData.id}`, backendPayload);
        const updatedRef = {
          id: res.data.id,
          name: res.data.parameterName || '',
          min: res.data.minValue || '',
          max: res.data.maxValue || '',
          unit: res.data.unit || '',
          category: 'Biyokimya',
          text: res.data.lowRecommendation || res.data.normalRecommendation || ''
        };
        setReferences(references.map(r => r.id === updatedRef.id ? updatedRef : r));
      } else {
        const res = await api.post('/reference-values', backendPayload);
        const newRef = {
          id: res.data.id,
          name: res.data.parameterName || '',
          min: res.data.minValue || '',
          max: res.data.maxValue || '',
          unit: res.data.unit || '',
          category: 'Biyokimya',
          text: res.data.lowRecommendation || res.data.normalRecommendation || ''
        };
        setReferences([newRef, ...references]);
      }
    } catch (error) {
      console.error("Referans kaydedilemedi", error);
    }
  };"""
  
content = content.replace(old_save, new_save)

# Fix filteredUsers mapping and filteredReferences safely
content = content.replace("r.name.toLowerCase()", "(r.name || r.parameterName || '').toLowerCase()")
content = content.replace("r.category.toLowerCase()", "(r.category || '').toLowerCase()")
content = content.replace("u.name.toLowerCase()", "(u.name || u.fullName || '').toLowerCase()")
content = content.replace("u.email.toLowerCase()", "(u.email || '').toLowerCase()")

with open(file_path, "w") as f:
    f.write(content)

print("Replaced successfully")
