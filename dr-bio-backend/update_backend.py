file_path = "/home/tuno/Belgeler/drbio/dr-bio-backend/src/main/java/com/drbio/config/DataSeeder.java"

new_code = """package com.drbio.config;

import com.drbio.domain.report.entity.MedicalReport;
import com.drbio.domain.report.entity.MedicalReportItem;
import com.drbio.domain.report.entity.ReferenceValue;
import com.drbio.domain.report.entity.ReportStatus;
import com.drbio.domain.report.entity.ValueStatus;
import com.drbio.domain.report.repository.MedicalReportRepository;
import com.drbio.domain.report.repository.ReferenceValueRepository;
import com.drbio.domain.user.entity.Gender;
import com.drbio.domain.user.entity.Role;
import com.drbio.domain.user.entity.User;
import com.drbio.domain.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final UserRepository userRepository;
    private final ReferenceValueRepository referenceValueRepository;
    private final MedicalReportRepository medicalReportRepository;
    private final PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedData() {
        // DİKKAT: Bu blok test/örnek veri seed etmek içindir, PROD ortamında kapatılmalıdır.
        
        // --- 1. Referans Değerleri Seeding ---
        if (referenceValueRepository.count() == 0) {
            seedReferenceValues();
            log.info("DataSeeder: Örnek referans değerleri eklendi.");
        }

        // --- 2. Kullanıcılar Seeding ---
        User admin = createOrUpdateUser("admin@drbio.com", "admin123", "Sistem Yöneticisi", Gender.MALE, LocalDate.of(1985, 1, 15), Role.ADMIN);
        
        if (userRepository.count() <= 1) { // Sadece admin varsa veya boşsa
            User patient1 = createOrUpdateUser("ali.yilmaz@ornek.com", "test1234", "Ali Yılmaz", Gender.MALE, LocalDate.of(1975, 4, 12), Role.PATIENT);
            User patient2 = createOrUpdateUser("ayse.kaya@ornek.com", "test1234", "Ayşe Kaya", Gender.FEMALE, LocalDate.of(1990, 8, 23), Role.PATIENT);
            User patient3 = createOrUpdateUser("mehmet.can@ornek.com", "test1234", "Mehmet Can", Gender.MALE, LocalDate.of(1982, 11, 5), Role.PATIENT);
            User patient4 = createOrUpdateUser("hasta@drbio.com", "hasta123", "Test Hastası", Gender.FEMALE, LocalDate.of(1995, 5, 20), Role.PATIENT);
            
            log.info("DataSeeder: Örnek hastalar eklendi.");

            // --- 3. Tıbbi Raporlar Seeding ---
            if (medicalReportRepository.count() == 0) {
                seedMedicalReports(patient1, patient2, patient4);
                log.info("DataSeeder: Örnek tıbbi raporlar eklendi.");
            }
        }
        
        log.info("DataSeeder: Test/örnek veriler kontrol edildi.");
    }

    private void seedReferenceValues() {
        referenceValueRepository.save(ReferenceValue.builder().parameterName("Hemoglobin (HGB)").unit("g/dL").minValue(13.5).maxValue(17.5)
                .lowRecommendation("Kansızlık belirtisi olabilir. Demir açısından zengin besinler tüketin, dahiliye uzmanına danışın.")
                .highRecommendation("Kanın normalden yoğun olduğunu gösterebilir. Bol su tüketin.")
                .normalRecommendation("Hemoglobin seviyeniz normal.").build());
        referenceValueRepository.save(ReferenceValue.builder().parameterName("Demir").unit("µg/dL").minValue(60.0).maxValue(170.0)
                .lowRecommendation("Demir eksikliği anemisine yol açabilir. Et, baklagil ve koyu yeşil yapraklı sebzeler tüketin.")
                .highRecommendation("Vücutta demir birikimi olabilir (Hemokromatoz vb.). Doktorunuza başvurun.")
                .normalRecommendation("Demir seviyeniz normal.").build());
        referenceValueRepository.save(ReferenceValue.builder().parameterName("Ferritin").unit("ng/mL").minValue(30.0).maxValue(400.0)
                .lowRecommendation("Demir depolarınız azalmış. Takviye gerekebilir.")
                .highRecommendation("Enfeksiyon veya karaciğer sorunlarına işaret edebilir.")
                .normalRecommendation("Ferritin seviyeniz normal.").build());
        referenceValueRepository.save(ReferenceValue.builder().parameterName("Vitamin D (25-OH)").unit("ng/mL").minValue(30.0).maxValue(100.0)
                .lowRecommendation("D vitamini eksikliği kemik sağlığını etkiler. Güneşlenin ve takviye alın.")
                .highRecommendation("D vitamini toksisitesi olabilir. Takviye alımını durdurun.")
                .normalRecommendation("D vitamini seviyeniz normal.").build());
        referenceValueRepository.save(ReferenceValue.builder().parameterName("Glukoz (Açlık)").unit("mg/dL").minValue(70.0).maxValue(100.0)
                .lowRecommendation("Hipoglisemi (düşük şeker). Öğün atlamamaya özen gösterin.")
                .highRecommendation("Diyabet veya insülin direnci riski. Şekerli gıdalardan uzak durun.")
                .normalRecommendation("Açlık kan şekeriniz normal.").build());
        referenceValueRepository.save(ReferenceValue.builder().parameterName("LDL Kolesterol").unit("mg/dL").minValue(0.0).maxValue(130.0)
                .lowRecommendation("Genelde iyi bir durumdur.")
                .highRecommendation("Kalp ve damar hastalıkları riski artabilir. Doymuş yağ tüketimini azaltın.")
                .normalRecommendation("LDL kolesterolünüz normal.").build());
        referenceValueRepository.save(ReferenceValue.builder().parameterName("HDL Kolesterol").unit("mg/dL").minValue(40.0).maxValue(100.0)
                .lowRecommendation("İyi kolesterolünüz düşük. Egzersiz yapın ve sağlıklı yağlar tüketin.")
                .highRecommendation("Genelde kalp sağlığı için iyidir.")
                .normalRecommendation("HDL kolesterolünüz normal.").build());
        referenceValueRepository.save(ReferenceValue.builder().parameterName("TSH").unit("mIU/L").minValue(0.4).maxValue(4.0)
                .lowRecommendation("Tiroid beziniz çok çalışıyor (Hipertiroidi) olabilir. Endokrinolojiye başvurun.")
                .highRecommendation("Tiroid beziniz az çalışıyor (Hipotiroidi) olabilir.")
                .normalRecommendation("TSH seviyeniz normal.").build());
    }

    private User createOrUpdateUser(String email, String password, String fullName, Gender gender, LocalDate birthDate, Role role) {
        Optional<User> existing = userRepository.findByEmail(email);
        if (existing.isPresent()) {
            User user = existing.get();
            if (!passwordEncoder.matches(password, user.getPasswordHash())) {
                user.setPasswordHash(passwordEncoder.encode(password));
                userRepository.save(user);
            }
            return user;
        } else {
            User user = User.builder()
                    .email(email)
                    .passwordHash(passwordEncoder.encode(password))
                    .fullName(fullName)
                    .gender(gender)
                    .birthDate(birthDate)
                    .role(role)
                    .build();
            return userRepository.save(user);
        }
    }

    private void seedMedicalReports(User patient1, User patient2, User patient3) {
        // Patient 1 - Ali Yılmaz (Diyabet riski ve Yüksek LDL)
        MedicalReport report1 = MedicalReport.builder()
                .user(patient1)
                .filePath("/dummy/path/report1.pdf")
                .status(ReportStatus.COMPLETED)
                .reportDate(LocalDate.now().minusDays(5))
                .build();
        report1.getItems().add(MedicalReportItem.builder().report(report1).parameterName("Glukoz (Açlık)").value(115.0).unit("mg/dL").referenceRange("70-100").valueStatus(ValueStatus.HIGH).build());
        report1.getItems().add(MedicalReportItem.builder().report(report1).parameterName("LDL Kolesterol").value(160.0).unit("mg/dL").referenceRange("0-130").valueStatus(ValueStatus.HIGH).build());
        report1.getItems().add(MedicalReportItem.builder().report(report1).parameterName("Hemoglobin (HGB)").value(15.2).unit("g/dL").referenceRange("13.5-17.5").valueStatus(ValueStatus.NORMAL).build());
        medicalReportRepository.save(report1);

        // Patient 2 - Ayşe Kaya (Demir ve D Vitamini Eksikliği)
        MedicalReport report2 = MedicalReport.builder()
                .user(patient2)
                .filePath("/dummy/path/report2.pdf")
                .status(ReportStatus.COMPLETED)
                .reportDate(LocalDate.now().minusDays(10))
                .build();
        report2.getItems().add(MedicalReportItem.builder().report(report2).parameterName("Demir").value(45.0).unit("µg/dL").referenceRange("60-170").valueStatus(ValueStatus.LOW).build());
        report2.getItems().add(MedicalReportItem.builder().report(report2).parameterName("Ferritin").value(15.0).unit("ng/mL").referenceRange("30-400").valueStatus(ValueStatus.LOW).build());
        report2.getItems().add(MedicalReportItem.builder().report(report2).parameterName("Vitamin D (25-OH)").value(12.0).unit("ng/mL").referenceRange("30-100").valueStatus(ValueStatus.LOW).build());
        report2.getItems().add(MedicalReportItem.builder().report(report2).parameterName("TSH").value(2.1).unit("mIU/L").referenceRange("0.4-4.0").valueStatus(ValueStatus.NORMAL).build());
        medicalReportRepository.save(report2);

        // Patient 3 - Test Hastası (Normal Rapor)
        MedicalReport report3 = MedicalReport.builder()
                .user(patient3)
                .filePath("/dummy/path/report3.pdf")
                .status(ReportStatus.COMPLETED)
                .reportDate(LocalDate.now().minusDays(2))
                .build();
        report3.getItems().add(MedicalReportItem.builder().report(report3).parameterName("Glukoz (Açlık)").value(85.0).unit("mg/dL").referenceRange("70-100").valueStatus(ValueStatus.NORMAL).build());
        report3.getItems().add(MedicalReportItem.builder().report(report3).parameterName("Hemoglobin (HGB)").value(14.0).unit("g/dL").referenceRange("13.5-17.5").valueStatus(ValueStatus.NORMAL).build());
        report3.getItems().add(MedicalReportItem.builder().report(report3).parameterName("TSH").value(1.5).unit("mIU/L").referenceRange("0.4-4.0").valueStatus(ValueStatus.NORMAL).build());
        medicalReportRepository.save(report3);
    }
}
"""

with open(file_path, "w") as f:
    f.write(new_code)
print("DataSeeder updated successfully")
