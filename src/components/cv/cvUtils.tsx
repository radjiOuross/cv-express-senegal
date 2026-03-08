import { FormData, AIData } from "@/types/cv";
import { CVCustomization, getDensityStyles, getPhotoStyle } from "@/types/customization";

interface Props {
  formData: FormData;
  aiData: AIData | null;
  customization: CVCustomization;
}

// Renders skills based on chosen style
export const renderSkills = (skills: string[], style: CVCustomization["skillStyle"], primaryColor: string) => {
  switch (style) {
    case "bars":
      return skills.map((s, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 10, marginBottom: 3 }}>{s}</div>
          <div style={{ height: 4, backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${65 + (i * 7) % 35}%`, backgroundColor: primaryColor, borderRadius: 2 }} />
          </div>
        </div>
      ));
    case "dots":
      return skills.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 10 }}>{s}</span>
          <div style={{ display: "flex", gap: 3 }}>
            {[1, 2, 3, 4, 5].map(d => (
              <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: d <= 3 + (i % 2) ? primaryColor : "#ddd" }} />
            ))}
          </div>
        </div>
      ));
    case "pills":
      return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {skills.map((s, i) => (
            <span key={i} style={{ backgroundColor: `${primaryColor}15`, color: primaryColor, padding: "4px 10px", borderRadius: 16, fontSize: 9, fontWeight: 500 }}>{s}</span>
          ))}
        </div>
      );
    case "percent":
      return skills.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 10 }}>{s}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: primaryColor }}>{65 + (i * 7) % 35}%</span>
        </div>
      ));
    case "text":
    default:
      return skills.map((s, i) => (
        <div key={i} style={{ fontSize: 10, marginBottom: 4 }}>• {s}</div>
      ));
  }
};

// Check if a section is visible
export const isSectionVisible = (sectionId: string, customization: CVCustomization) => {
  const section = customization.sectionOrder.find(s => s.id === sectionId);
  return section ? section.visible : true;
};

// Get ordered visible sections
export const getOrderedSections = (customization: CVCustomization) => {
  return customization.sectionOrder.filter(s => s.visible).map(s => s.id);
};

export { getDensityStyles, getPhotoStyle };
