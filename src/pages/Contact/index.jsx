// src/pages/Contact/index.jsx
/* eslint-disable */
import { useState } from "react";
import "./style.scss";

const WaSvg = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Contact() {
  const [form,      setForm]      = useState({ name:"", phone:"", message:"" });
  const [submitted, setSubmitted] = useState(false);
  const [errors,    setErrors]    = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Naam zaroori hai";
    if (!form.phone.trim())   e.phone   = "Phone number zaroori hai";
    else if (!/^\d{10}$/.test(form.phone.trim())) e.phone = "10 digit number daalo";
    if (!form.message.trim()) e.message = "Message likhna zaroori hai";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    const text = encodeURIComponent(
      `Namaste! Main ${form.name} hun.\nPhone: ${form.phone}\n\n${form.message}`
    );
    window.open(`https://wa.me/916206869543?text=${text}`, "_blank");
    setSubmitted(true);
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="contactPage">

      <div className="ctPageHeader">
        <div className="ctPageHeaderInner">
          <div className="breadcrumb">🏠 Home › Contact</div>
          <h1 className="ctPageTitle">Humse Baat Karein 💬</h1>
          <p className="ctPageSubtitle">Sawaal ho, order karna ho ya koi bhi kaam — hum yahan hain!</p>
        </div>
      </div>

      <div className="ctLayout">

        <div className="ctInfoCol">
          <div className="ctStoreCard">
            <div className="ctStoreEmoji">🏪</div>
            <h2 className="ctStoreName">SL Cart</h2>
            <p className="ctStoreTagline">Apna Local Store — Sab Kuch Ek Jagah!</p>
          </div>

          <div className="ctDetailsList">
            <a href="https://wa.me/916206869543" target="_blank" rel="noreferrer" className="ctDetailItem ctDetailWa">
              <div className="ctDetailIcon ctDetailIconWa"><WaSvg size={22} /></div>
              <div className="ctDetailText">
                <div className="ctDetailLabel">WhatsApp</div>
                <div className="ctDetailValue">+91 6206869543</div>
                <div className="ctDetailHint">Turant reply payen!</div>
              </div>
              <div className="ctDetailArrow">→</div>
            </a>
            {[
              { icon:"📞", label:"Phone",         value:"+91 62068 69543",              hint:"Mon–Sat, 9am–8pm" },
              { icon:"📍", label:"Address",        value:"Middle School Gali, AmbedkarNagar", hint:"Sangatpar Bakhtiyarpur (Patna)" },
              { icon:"🕐", label:"Shop Timings",   value:"6:00 AM – 8:00 PM",           hint:"Monday to Sunday" },
              { icon:"📧", label:"Email",          value:"slcart26@gmail.com",           hint:"Reply within 24 hours" },
            ].map(item => (
              <div key={item.label} className="ctDetailItem">
                <div className="ctDetailIcon">{item.icon}</div>
                <div className="ctDetailText">
                  <div className="ctDetailLabel">{item.label}</div>
                  <div className="ctDetailValue">{item.value}</div>
                  <div className="ctDetailHint">{item.hint}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="ctQuickServices">
            <div className="ctQuickTitle">⚡ Quick Services</div>
            <div className="ctQuickGrid">
              {[
                { icon:"🖨️", label:"Printing" },
                { icon:"🏛️", label:"PAN/Aadhaar" },
                { icon:"🚆", label:"Railway" },
                { icon:"📄", label:"Resume" },
                { icon:"📝", label:"Exam Form" },
                { icon:"🧵", label:"Tailoring" },
              ].map(s => (
                <div key={s.label} className="ctQuickItem">
                  <span>{s.icon}</span><span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ctFormCol">
          {!submitted ? (
            <div className="ctFormCard">
              <h2 className="ctFormTitle">Message Dalein 📩</h2>
              <p className="ctFormSubtitle">Form bhare — WhatsApp pe seedha message chala jaayega!</p>
              <div className="ctFormFields">
                <div className="ctField">
                  <label className="ctLabel">Aapka Naam *</label>
                  <input type="text" placeholder="Jaise: Rahul Kumar"
                    value={form.name} onChange={e => handleChange("name", e.target.value)}
                    className={`ctInput ${errors.name ? "ctInputError" : ""}`} />
                  {errors.name && <span className="ctError">{errors.name}</span>}
                </div>
                <div className="ctField">
                  <label className="ctLabel">Phone Number *</label>
                  <div className="ctPhoneRow">
                    <span className="ctPhonePrefix">🇮🇳 +91</span>
                    <input type="tel" placeholder="10 digit number"
                      value={form.phone}
                      onChange={e => handleChange("phone", e.target.value.replace(/\D/g,"").slice(0,10))}
                      className={`ctInput ctInputPhone ${errors.phone ? "ctInputError" : ""}`} />
                  </div>
                  {errors.phone && <span className="ctError">{errors.phone}</span>}
                </div>
                <div className="ctField">
                  <label className="ctLabel">Message *</label>
                  <textarea placeholder="Kya chahiye? Order, service, ya koi sawaal..."
                    value={form.message} onChange={e => handleChange("message", e.target.value)}
                    className={`ctInput ctTextarea ${errors.message ? "ctInputError" : ""}`} rows={4} />
                  {errors.message && <span className="ctError">{errors.message}</span>}
                </div>
                <button className="ctSubmitBtn" onClick={handleSubmit}>
                  <WaSvg size={18} /> WhatsApp pe Bhejo
                </button>
              </div>
            </div>
          ) : (
            <div className="ctSuccessCard">
              <div className="ctSuccessEmoji">🎉</div>
              <h2 className="ctSuccessTitle">Message Send Ho Gaya!</h2>
              <p className="ctSuccessText">WhatsApp khul gaya hai — message bhej do! Hum jald reply karenge.</p>
              <button className="ctSuccessReset"
                onClick={() => { setSubmitted(false); setForm({ name:"", phone:"", message:"" }); }}>
                Naya Message Bheje
              </button>
            </div>
          )}

          <div className="ctMapCard">
            <div className="ctMapHeader">
              <span>📍 Hamari Location</span>
              <a href="https://maps.google.com/?q=Bakhtiyarpur+Patna+Bihar"
                target="_blank" rel="noreferrer" className="ctMapLink">
                Google Maps pe Dekhein →
              </a>
            </div>
            <div className="ctMapPlaceholder">
              <div className="ctMapPin">📍</div>
              <div className="ctMapText">
                <strong>SL Cart</strong>
                <span>Middle school gali, AmbedkarNagar</span>
                <span>Sangatpar Bakhtiyarpur, Patna, Bihar</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ctWaStrip">
        <div className="ctWaStripInner">
          <div className="ctWaStripText">
            <div className="ctWaStripTitle">Seedha WhatsApp Karein! ⚡</div>
            <div className="ctWaStripSub">Sabse fast tarika — turat reply milega</div>
          </div>
          <a href="https://wa.me/916206869543" target="_blank" rel="noreferrer" className="ctWaStripBtn">
            <WaSvg size={20} /> Chat Now
          </a>
        </div>
      </div>

      <a href="https://wa.me/916206869543" target="_blank" rel="noreferrer" className="floatingWa">
        <div className="floatingPulse" />
        <WaSvg size={28} />
      </a>
    </div>
  );
}