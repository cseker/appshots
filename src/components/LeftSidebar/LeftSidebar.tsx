/**
 * LeftSidebar Component
 *
 * Main sidebar containing project switcher, device selection and export options.
 *
 * Features:
 * - Project management (create, switch, rename, delete)
 * - Device model selection
 * - Device color selection
 * - Export size selection
 * - Export all screenshots button
 */

import { useEditor } from "../../context/EditorContext";
import { devices, exportSizes } from "../../constants";
import { SidebarHeader } from "./SidebarHeader";
import { DeviceSection } from "./DeviceSection";
import { ExportSection } from "./ExportSection";
import { ProjectSwitcher } from "../ProjectSwitcher";
import { STYLES } from "./constants";

/**
 * LeftSidebar - Main settings sidebar
 *
 * Provides controls for project management, device selection,
 * color options, and export functionality.
 *
 * @example
 * <LeftSidebar />
 */
interface LeftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeftSidebar = ({ isOpen, onClose }: LeftSidebarProps) => {
  const {
    selectedDeviceId,
    setSelectedDeviceId,
    selectedColorId,
    setSelectedColorId,
    selectedDevice,
    exportSizeId,
    setExportSizeId,
    handleExport,
    screenshots,
  } = useEditor();

  // Handle device selection with default color
  const handleDeviceSelect = (deviceId: string, defaultColorId: string) => {
    setSelectedDeviceId(deviceId);
    setSelectedColorId(defaultColorId);
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[90] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} 
        onClick={onClose} 
      />

      {/* Drawer */}
      <aside className={`${STYLES.sidebar} ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="relative">
          <SidebarHeader />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

      {/* Project Switcher */}
      <div className="px-4 pb-4 border-b border-zinc-800">
        <ProjectSwitcher />
      </div>

      <div className={STYLES.content}>
        <DeviceSection
          devices={devices}
          selectedDeviceId={selectedDeviceId}
          selectedColorId={selectedColorId}
          selectedDevice={selectedDevice}
          onDeviceSelect={handleDeviceSelect}
          onColorSelect={setSelectedColorId}
        />

        <ExportSection
          exportSizes={exportSizes}
          selectedSizeId={exportSizeId}
          screenshotCount={screenshots.length}
          onSizeSelect={setExportSizeId}
          onExport={handleExport}
        />
      </div>
    </aside>
    </>
  );
};
