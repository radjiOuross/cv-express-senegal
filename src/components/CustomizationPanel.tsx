import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Type, LayoutList, SlidersHorizontal, Camera, Star, X, RotateCcw, Check, Eye, EyeOff, GripVertical } from "lucide-react";
import {
  CVCustomization, COLOR_PRESETS, FONT_PRESETS, DEFAULT_CUSTOMIZATION,
  DEFAULT_SECTIONS, loadGoogleFont, SectionItem
} from "@/types/customization";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  open: boolean;
  onClose: () => void;
  customization: CVCustomization;
  onChange: (c: CVCustomization) => void;
}

const SortableRow = ({ item, onToggle }: { item: SectionItem; onToggle: () => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 py-2 px-2 rounded-lg bg-card border border-border mb-1.5">
      <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
        <GripVertical className="w-4 h-4" />
      </button>
      <span className="flex-1 text-xs text-foreground">{item.label}</span>
      <button onClick={onToggle} className="text-muted-foreground hover:text-foreground">
        {item.visible ? <Eye className="w-4 h-4 text-primary" /> : <EyeOff className="w-4 h-4" />}
      </button>
    </div>
  );
};

const CustomizationPanel = ({ open, onClose, customization, onChange }: Props) => {
  const [activeTab, setActiveTab] = useState<string>("colors");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const update = (partial: Partial<CVCustomization>) => {
    onChange({ ...customization, ...partial });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = customization.sectionOrder.findIndex(s => s.id === active.id);
    const newIndex = customization.sectionOrder.findIndex(s => s.id === over.id);
    update({ sectionOrder: arrayMove(customization.sectionOrder, oldIndex, newIndex) });
  };

  const toggleSection = (id: string) => {
    update({
      sectionOrder: customization.sectionOrder.map(s =>
        s.id === id ? { ...s, visible: !s.visible } : s
      )
    });
  };

  const selectFont = (f: typeof FONT_PRESETS[number]) => {
    loadGoogleFont(f.display);
    loadGoogleFont(f.body);
    update({ font: { display: f.display, body: f.body, label: f.label } });
  };

  const reset = () => onChange({ ...DEFAULT_CUSTOMIZATION, sectionOrder: [...DEFAULT_SECTIONS] });

  const tabs = [
    { id: "colors", icon: Palette, label: "Couleurs" },
    { id: "fonts", icon: Type, label: "Polices" },
    { id: "layout", icon: LayoutList, label: "Sections" },
    { id: "density", icon: SlidersHorizontal, label: "Densité" },
    { id: "photo", icon: Camera, label: "Photo" },
    { id: "skills", icon: Star, label: "Compétences" },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed left-0 top-0 bottom-0 z-50 w-[300px] bg-background border-r border-border shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              🎨 Personnaliser
            </h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-2 border-b border-border overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all flex-shrink-0 ${
                  activeTab === t.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* COLORS */}
            {activeTab === "colors" && (
              <>
                <div>
                  <h3 className="text-xs font-semibold text-foreground mb-3">Palette de couleurs</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {COLOR_PRESETS.map(p => {
                      const isActive = customization.colors.primary === p.primary && customization.colors.secondary === p.secondary;
                      return (
                        <button
                          key={p.name}
                          onClick={() => update({ colors: { primary: p.primary, secondary: p.secondary } })}
                          className={`relative flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all ${
                            isActive ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <div className="flex gap-0.5">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.primary }} />
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.secondary }} />
                          </div>
                          <span className="text-[9px] text-muted-foreground">{p.name}</span>
                          {isActive && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-primary-foreground" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1.5 block">Couleur principale</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customization.colors.primary}
                        onChange={e => update({ colors: { ...customization.colors, primary: e.target.value } })}
                        className="w-8 h-8 rounded border border-border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customization.colors.primary}
                        onChange={e => update({ colors: { ...customization.colors, primary: e.target.value } })}
                        className="flex-1 bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1.5 block">Couleur secondaire</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customization.colors.secondary}
                        onChange={e => update({ colors: { ...customization.colors, secondary: e.target.value } })}
                        className="w-8 h-8 rounded border border-border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customization.colors.secondary}
                        onChange={e => update({ colors: { ...customization.colors, secondary: e.target.value } })}
                        className="flex-1 bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground font-mono"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* FONTS */}
            {activeTab === "fonts" && (
              <div>
                <h3 className="text-xs font-semibold text-foreground mb-3">Style de police</h3>
                <div className="space-y-2">
                  {FONT_PRESETS.map(f => {
                    const isActive = customization.font.label === f.label;
                    return (
                      <button
                        key={f.label}
                        onClick={() => selectFont(f)}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${
                          isActive ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <div className="text-[10px] text-muted-foreground mb-1">{f.label}</div>
                        <div className="text-foreground text-sm font-semibold" style={{ fontFamily: `'${f.display}', serif` }}>
                          Amadou Diallo
                        </div>
                        <div className="text-muted-foreground text-xs" style={{ fontFamily: `'${f.body}', sans-serif` }}>
                          Développeur Web
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* LAYOUT / SECTIONS */}
            {activeTab === "layout" && (
              <div>
                <h3 className="text-xs font-semibold text-foreground mb-3">Ordre des sections</h3>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={customization.sectionOrder.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    {customization.sectionOrder.map(item => (
                      <SortableRow key={item.id} item={item} onToggle={() => toggleSection(item.id)} />
                    ))}
                  </SortableContext>
                </DndContext>
              </div>
            )}

            {/* DENSITY */}
            {activeTab === "density" && (
              <div>
                <h3 className="text-xs font-semibold text-foreground mb-3">Densité du contenu</h3>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-2">
                  <span>Compact</span>
                  <span>Aéré</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={customization.density}
                  onChange={e => update({ density: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
                  {[1, 2, 3, 4, 5].map(n => (
                    <span key={n} className={customization.density === n ? "text-primary font-bold" : ""}>{n}</span>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-4 bg-card rounded-lg p-2.5 border border-border">
                  💡 Mode Compact = fait tenir ton CV sur 1 page
                </p>
              </div>
            )}

            {/* PHOTO */}
            {activeTab === "photo" && (
              <div>
                <h3 className="text-xs font-semibold text-foreground mb-3">Style de la photo</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {([
                    { id: "circle" as const, icon: "⭕", label: "Cercle" },
                    { id: "rounded" as const, icon: "⬜", label: "Carré arrondi" },
                    { id: "hexagon" as const, icon: "🔷", label: "Hexagone" },
                    { id: "none" as const, icon: "✖️", label: "Sans photo" },
                  ]).map(s => (
                    <button
                      key={s.id}
                      onClick={() => update({ photoStyle: s.id })}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${
                        customization.photoStyle === s.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <span className="text-xl">{s.icon}</span>
                      <span className="text-[10px] text-foreground">{s.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between py-2 px-3 bg-card rounded-lg border border-border">
                  <span className="text-xs text-foreground">Bordure colorée</span>
                  <button
                    onClick={() => update({ photoBorder: !customization.photoBorder })}
                    className={`w-10 h-5 rounded-full transition-all relative ${
                      customization.photoBorder ? "bg-primary" : "bg-secondary"
                    }`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                      customization.photoBorder ? "left-5" : "left-0.5"
                    }`} />
                  </button>
                </div>
              </div>
            )}

            {/* SKILLS */}
            {activeTab === "skills" && (
              <div>
                <h3 className="text-xs font-semibold text-foreground mb-3">Affichage des compétences</h3>
                <div className="space-y-2">
                  {([
                    { id: "bars" as const, preview: "████░", label: "Barres de progression" },
                    { id: "dots" as const, preview: "●●●●○", label: "Points (5 niveaux)" },
                    { id: "pills" as const, preview: "[Tag]", label: "Pills colorées" },
                    { id: "percent" as const, preview: "90%", label: "Pourcentages" },
                    { id: "text" as const, preview: "• txt", label: "Texte simple" },
                  ]).map(s => (
                    <button
                      key={s.id}
                      onClick={() => update({ skillStyle: s.id })}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        customization.skillStyle === s.id ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <span className="text-sm font-mono w-12 text-center text-muted-foreground">{s.preview}</span>
                      <span className="text-xs text-foreground">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border flex gap-2">
            <button onClick={reset} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:brightness-110">
              <RotateCcw className="w-3.5 h-3.5" /> Réinitialiser
            </button>
            <button onClick={onClose} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:brightness-110">
              <Check className="w-3.5 h-3.5" /> Appliquer
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomizationPanel;
