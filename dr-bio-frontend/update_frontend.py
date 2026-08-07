import re

file_path = "/home/tuno/Belgeler/drbio/dr-bio-frontend/src/pages/AdminDashboard.jsx"
with open(file_path, "r") as f:
    content = f.read()

# Remove defaultAdminUsers
content = re.sub(r"const defaultAdminUsers = \[.*?\];\n", "", content, flags=re.DOTALL)

# Remove defaultReferences
content = re.sub(r"const defaultReferences = \[.*?\];\n", "", content, flags=re.DOTALL)

# Update fetchData
old_fetch = """  // Verileri Backend'den Çek
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      setErrorData('');

      try {
        const [usersRes, refsRes, reportsRes] = await Promise.all([
          api.get('/users'),
          api.get('/reference-values'),
          api.get('/reports/all')
        ]);
        
        if (usersRes.data && Array.isArray(usersRes.data) && usersRes.data.length > 0) {
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
        // Fallback to local default data so Admin Dashboard always functions seamlessly
        setUsersList(defaultAdminUsers);
        setReferences(defaultReferences);
        setTotalReports(142);
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchData();
  }, [currentTab]);"""

new_fetch = """  // Verileri Backend'den Çek
  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      setErrorData('');

      try {
        const [usersRes, refsRes, reportsRes] = await Promise.all([
          api.get('/users'),
          api.get('/reference-values'),
          api.get('/reports/all')
        ]);
        
        if (usersRes.data && Array.isArray(usersRes.data)) {
          setUsersList(usersRes.data);
        }

        if (refsRes.data && Array.isArray(refsRes.data)) {
          setReferences(refsRes.data);
        }

        setTotalReports(reportsRes.data && Array.isArray(reportsRes.data) ? reportsRes.data.length : 0);
      } catch (err) {
        console.error('Backend verileri çekilemedi:', err);
        setErrorData('Veriler yüklenemedi, sunucu ile iletişim kurulamadı. Lütfen tekrar deneyiniz.');
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchData();
  }, [currentTab]);"""

content = content.replace(old_fetch, new_fetch)

# In handleResetAllData, change setUsersList(defaultAdminUsers) to setUsersList([])
content = content.replace("setUsersList(defaultAdminUsers);", "setUsersList([]);")

with open(file_path, "w") as f:
    f.write(content)
print("Updated successfully")
