import Content from '@components/Content';
import Footer from '@components/Footer';
import Header from '@components/Header';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from 'src/db/Firebase';

const AuditServices = ({ hakkimda }) => (
  <div className="bg-[#1f1f1f] py-8">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl text-white font-bold mb-8">İzlenebilirlik Denetimi Danışmanlığı</h2>
      {hakkimda?.metin ? (
        <p className="text-white mb-8" dangerouslySetInnerHTML={{ __html: hakkimda.metin }} />
      ) : (
        <p className="text-white mb-8">Yükleniyor...</p>
      )}
    </div>
  </div>
);

const ServicesList = ({ title, items }) => (
  <div className="pb-8 text-white bg-[#1f1f1f]">
    <h3 className="text-2xl font-semibold mb-6">{title}</h3>
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-center">
          <span className="w-2 h-2 bg-[#12a6a6] rounded-full mr-3"></span>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const ContactSection = () => (
  <div className="bg-[#303030] text-white py-12">
    <div className="container mx-auto px-4 text-center">
      <h3 className="text-2xl font-bold mb-6">İletişim</h3>
      <div className="space-y-4">
        <p className="text-xl">ŞİMDİ ARAYIN +90 543 966 30 69</p>
        <p className="text-xl">WHATSAPP +90 543 966 30 69</p>
      </div>
    </div>
  </div>
);

const FAQSection = () => (
  <div className="bg-[#1f1f1f] py-16">
    <div className="container text-white mx-auto px-4">
      <h3 className="text-2xl font-bold mb-8">Sıkça Sorulan Sorular (S.S.S.)</h3>
      <div className="space-y-6 text-[#12a6a6]">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h4 className="font-semibold mb-2">Eğitimleriniz sertifikalı eğitimler mi ?</h4>
          <p className="text-gray-600">Evet, tüm eğitimlerimiz sertifikalıdır.</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h4 className="font-semibold mb-2">Özel levha baskısı yapıyor musunuz ?</h4>
          <p className="text-gray-600">Evet, özel tasarım levha baskısı hizmeti sunuyoruz.</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h4 className="font-semibold mb-2">Kimler yangın eğitimi verebilir ?</h4>
          <p className="text-gray-600">Yetkilendirilmiş uzman eğitmenlerimiz tarafından eğitimler verilmektedir.</p>
        </div>
      </div>
    </div>
  </div>
);

const ProductsSection = () => (
  <div className="pb-8 bg-[#1f1f1f] text-white">
    <div className="container mx-auto px-4">
      <h3 className="text-2xl font-bold mb-8">Ürün ve Hizmetlerimiz</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          "Zemin çizgileri",
          "Ecza dolapları",
          "Fosforlu zemin çizgileri",
          "Çıkış armatörleri",
          "Giriş çıkış levhaları",
          "Kaydırmaz bantlar",
          "Yalıtkan paspaslar",
          "Acil durum lambaları"
        ].map((item, index) => (
          <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            {item}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const Danismanlik = () => {
  const [hakkimda, setHakkimda] = useState(null);

  useEffect(() => {
    const fetchHakkimda = async () => {
      const docRef = doc(db, 'kurumsal', 'hakkimizda');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setHakkimda(docSnap.data());
      }
    };
    fetchHakkimda();
  }, []);

  const auditProcesses = [
    "Marka Denetimleri ( Inditex, Primark, C&A, H&M, Puma)",
    "Amfori BSCI",
    "Sedex",
    "ICS",
    "Disney Fama",
    "SLCP",
    "Organik sertifika denetimleri (OCS, GOTS,RCS,GRS)",
    "ISO Belgelendirme"
  ];

  const services = [
    "İş Güvenliği ve İş Yeri Hekimi Hizmeti",
    "Fenni Muayeneler ve Ortam Ölçümleri Hizmetleri",
    "Mobil Sağlık Hizmetleri",
    "İlkyardımcı Belgelendirme Hizmetleri",
    "Hijyen Belgesi ve Portör Muayenesi Hizmeti"
  ];

  return (
    <div>
      <Header />
      <Content
        baslik={"DANIŞMANLIK"}
        aciklama={"Çağan Yangın Sistemleri ve Güvenlik Ekipmanları"}
      />
      <div className="bg-[#1f1f1f]">
        <AuditServices hakkimda={hakkimda} />
        <div className="container mx-auto px-4">
          <ServicesList title="Denetim Süreçleri" items={auditProcesses} />
          <ServicesList title="Verilen Hizmetler" items={services} />
        </div>
        <ContactSection />
        <FAQSection />
        <ProductsSection />
      </div>
      <Footer />
    </div>
  );
};

export default Danismanlik;
