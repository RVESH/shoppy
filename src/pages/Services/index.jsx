import { useState, useEffect } from "react";
import { fetchProducts } from "../../api/api.js";
import "./style.scss";

const subCatIcons = {
  "Printing & Xerox":      "🖨️",
  "Government Services":   "🏛️",
  "Travel & Exam Services":"🚆",
  "Professional Services": "💼",
  "Stitching Services":    "🧵",
};

const WaSvg = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const ServiceCard = ({ service }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`serviceCard ${expanded ? "serviceCardExpanded" : ""}`}>
      <div className="scTop">
        <div className="scIconBox">{subCatIcons[service.subCategory] || "🛠️"}</div>
        <div className="scMeta">
          <div className="scSubCat">{service.subCategory}</div>
          <h3 className="scName">{service.name}</h3>
          <div className="scRating">
            {"★".repeat(Math.floor(service.rating))}
            {"☆".repeat(5 - Math.floor(service.rating))}
            <span className="scRatingNum">({service.rating})</span>
          </div>
        </div>
      </div>
      <div className="scPriceRow">
        <div className="scPrice">
          ₹{service.price}
          {service.priceType === "variable" && <span className="scOnwards">+</span>}
        </div>
        <div className="scPriceType">
          {service.priceType === "variable" ? "Variable Price" : "Fixed Price"}
        </div>
        {service.deliveryAvailable && (
          <div className="scDelivery">🚚 Online Delivery</div>
        )}
      </div>
      <p className="scDesc">{service.description}</p>
      <div className="scTime">
        🕐 <strong>Processing:</strong> {service.processingTime}
      </div>
      {service.documentsRequired?.length > 0 && (
        <>
          <button className="scDocsToggle" onClick={() => setExpanded((e) => !e)}>
            📋 Documents Required
            <span className={`scDocsArrow ${expanded ? "scDocsArrowOpen" : ""}`}>▼</span>
          </button>
          {expanded && (
            <div className="scDocsList">
              {service.documentsRequired.map((doc, i) => (
                <div key={i} className="scDocItem">
                  <span className="scDocDot">✓</span>{doc}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <div className="scActions">
        <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="scWaBtn">
          <WaSvg size={16} /> Book on WhatsApp
        </a>
        <div className="scWalkIn">🏪 Walk-in Available</div>
      </div>
    </div>
  );
};

export default function Services() {
  // ✅ CHANGE 1: data/index.js import hataya — ab API se aayega
  const [services, setServices]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeSubCat, setActiveSubCat] = useState("All");

  // ✅ CHANGE 2: useEffect add kiya — service-hub category fetch karo
  useEffect(() => {
    async function loadServices() {
      try {
        const data = await fetchProducts({ category: "service-hub" });
        setServices(data);
      } catch (err) {
        console.error("Services load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  // ✅ CHANGE 3: subCategories ab state se compute ho rahi hain
  const subCategories = [...new Set(services.map((s) => s.subCategory))];

  const filtered = activeSubCat === "All"
    ? services
    : services.filter((s) => s.subCategory === activeSubCat);

  return (
    <div className="servicesPage">

      <div className="srvPageHeader">
        <div className="srvPageHeaderInner">
          <div className="breadcrumb">🏠 Home &rsaquo; Services</div>
          <h1 className="srvPageTitle">Digital Seva Hub 🖨️</h1>
          <p className="srvPageSubtitle">
            PAN card se resume tak — sab kuch ek hi jagah, turat service!
          </p>
          <div className="srvStats">
            {[
              { num: services.length,      label: "Total Services" },
              { num: subCategories.length, label: "Categories" },
              { num: "100%",               label: "Satisfaction" },
            ].map((s) => (
              <div key={s.label} className="srvStatItem">
                <div className="srvStatNum">{s.num}</div>
                <div className="srvStatLabel">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="howItWorks">
        <div className="howItWorksInner">
          <h2 className="howTitle">Kaise Kaam Karta Hai? 🤔</h2>
          <div className="howSteps">
            {[
              { icon: "📱", step: "1", title: "WhatsApp Karo",       desc: "Apni zaroorat batao" },
              { icon: "📋", step: "2", title: "Documents Lao",       desc: "Zaroori documents ready rakho" },
              { icon: "⚡", step: "3", title: "Kaam Ho Jaata Hai",   desc: "Same day processing" },
              { icon: "✅", step: "4", title: "Done!",               desc: "Delivery ya walk-in pe lo" },
            ].map((s) => (
              <div key={s.step} className="howStep">
                <div className="howStepIcon">{s.icon}</div>
                <div className="howStepNum">Step {s.step}</div>
                <div className="howStepTitle">{s.title}</div>
                <div className="howStepDesc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="srvFilterBar">
        <div className="srvFilterBarInner">
          <button
            className={`srvFilterBtn ${activeSubCat === "All" ? "srvFilterBtnActive" : ""}`}
            onClick={() => setActiveSubCat("All")}
          >
            🗂️ All Services <span className="srvFilterCount">{services.length}</span>
          </button>
          {subCategories.map((sub) => {
            const count = services.filter((s) => s.subCategory === sub).length;
            return (
              <button
                key={sub}
                className={`srvFilterBtn ${activeSubCat === sub ? "srvFilterBtnActive" : ""}`}
                onClick={() => setActiveSubCat(sub)}
              >
                {subCatIcons[sub] || "🛠️"} {sub}
                <span className="srvFilterCount">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ✅ CHANGE 4: Loading state add kiya */}
      <div className="srvGrid">
        <div className="srvGridInner">
          <div className="srvResultInfo">
            <strong>{filtered.length}</strong> services available
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "#78716c" }}>
              ⏳ Services load ho rahi hain...
            </div>
          ) : (
            <div className="servicesGrid">
              {filtered.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          )}
        </div>
      </div>






      <div className="srvCta">
        <div className="srvCtaInner">
          <div className="srvCtaEmoji">💬</div>
          <h2 className="srvCtaTitle">Koi Custom Service Chahiye?</h2>
          <p className="srvCtaSubtitle">
            List mein nahi hai? Koi baat nahi — WhatsApp pe poochho!
          </p>
          <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="srvCtaWaBtn">
            <WaSvg size={20} /> WhatsApp pe Poochho
          </a>
        </div>
      </div>

    </div>
  );
}