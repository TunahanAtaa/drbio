import os

file_path = "/home/tuno/Belgeler/drbio/dr-bio-frontend/src/pages/AdminDashboard.jsx"
with open(file_path, "r") as f:
    content = f.read()

old_fetch_refs = """        if (refsRes.data && Array.isArray(refsRes.data)) {
          setReferences(refsRes.data);
        }"""
        
new_fetch_refs = """        if (refsRes.data && Array.isArray(refsRes.data)) {
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
        }"""

old_save_refs = """  const saveReferences = async (refData, isEdit) => {
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

new_save_refs = """  const saveReferences = async (refData, isEdit) => {
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

content = content.replace(old_fetch_refs, new_fetch_refs)
content = content.replace(old_save_refs, new_save_refs)

with open(file_path, "w") as f:
    f.write(content)

print("Replaced successfully")
