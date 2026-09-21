const fs = require('fs');

let content = fs.readFileSync('src/context/EditorContext.tsx', 'utf-8');

// 1. Update imports
content = content.replace(
  /import \{\n  loadPersistedState,\n  useEditorPersistence,\n  clearPersistedState,\n\} from "\.\.\/lib\/useLocalStorage";/g,
  `import {\n  loadPersistedStateAsync,\n  useEditorPersistence,\n  clearPersistedStateAsync,\n} from "../lib/useLocalStorage";`
);

// 2. Replace lines from `const persistedState = loadPersistedState();` to the end of state declarations
const searchStr = `// Load persisted state once on module load
const persistedState = loadPersistedState();

// Initialize projects from persisted state or create default
const getInitialProjects = (): Project[] => {
  if (persistedState?.projects && persistedState.projects.length > 0) {
    return persistedState.projects.map(normalizeProject);
  }
  return [createDefaultProject()];
};

const getInitialActiveProjectId = (projects: Project[]): string => {
  if (persistedState?.activeProjectId) {
    // Verify the project exists
    const exists = projects.some((p) => p.id === persistedState.activeProjectId);
    if (exists) return persistedState.activeProjectId;
  }
  return projects[0]?.id || generateId();
};

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  // Project state
  const [projects, setProjects] = useState<Project[]>(getInitialProjects);
  const [activeProjectId, setActiveProjectId] = useState(() =>
    getInitialActiveProjectId(projects),
  );

  // Get active project
  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[0];

  // Initialize state from persisted values or defaults
  const [isFontPickerOpen, setIsFontPickerOpen] = useState(false);
  const [isStarModalOpen, setIsStarModalOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceIdState] = useState(
    activeProject.selectedDeviceId,
  );
  const [selectedColorId, setSelectedColorIdState] = useState(
    activeProject.selectedColorId,
  );
  const [exportSizeId, setExportSizeIdState] = useState(
    activeProject.exportSizeId,
  );
  const [screenshots, setScreenshotsState] = useState<Screenshot[]>(
    activeProject.screenshots,
  );
  const [activeScreenshotId, setActiveScreenshotIdState] = useState(
    activeProject.activeScreenshotId,
  );
  const [headlineFontSize, setHeadlineFontSizeState] = useState(
    activeProject.headlineFontSize,
  );
  const [subheadlineFontSize, setSubheadlineFontSizeState] = useState(
    activeProject.subheadlineFontSize,
  );`;

const replaceStr = `export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  // Project state
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState("");

  // Initialize state from persisted values or defaults
  const [isFontPickerOpen, setIsFontPickerOpen] = useState(false);
  const [isStarModalOpen, setIsStarModalOpen] = useState(false);
  const [selectedDeviceId, setSelectedDeviceIdState] = useState("");
  const [selectedColorId, setSelectedColorIdState] = useState("");
  const [exportSizeId, setExportSizeIdState] = useState("");
  const [screenshots, setScreenshotsState] = useState<Screenshot[]>([]);
  const [activeScreenshotId, setActiveScreenshotIdState] = useState("");
  const [headlineFontSize, setHeadlineFontSizeState] = useState(72);
  const [subheadlineFontSize, setSubheadlineFontSizeState] = useState(42);

  useEffect(() => {
    let isMounted = true;
    loadPersistedStateAsync().then((state) => {
      if (!isMounted) return;
      let initialProjects = [createDefaultProject()];
      if (state?.projects && state.projects.length > 0) {
        initialProjects = state.projects.map(normalizeProject);
      }
      let initialActiveId = initialProjects[0].id;
      if (state?.activeProjectId && initialProjects.some((p) => p.id === state.activeProjectId)) {
        initialActiveId = state.activeProjectId;
      }
      
      const pActiveProject = initialProjects.find((p) => p.id === initialActiveId) || initialProjects[0];

      setProjects(initialProjects);
      setActiveProjectId(initialActiveId);
      setSelectedDeviceIdState(pActiveProject.selectedDeviceId);
      setSelectedColorIdState(pActiveProject.selectedColorId);
      setExportSizeIdState(pActiveProject.exportSizeId);
      setScreenshotsState(pActiveProject.screenshots);
      setActiveScreenshotIdState(pActiveProject.activeScreenshotId);
      setHeadlineFontSizeState(pActiveProject.headlineFontSize);
      setSubheadlineFontSizeState(pActiveProject.subheadlineFontSize);
      
      setIsLoaded(true);
    });
    return () => { isMounted = false; };
  }, []);

  // Get active project
  const activeProject =
    projects.find((p) => p.id === activeProjectId) || projects[0];`;

content = content.replace(searchStr, replaceStr);

// 3. Update useEditorPersistence call
content = content.replace(
  `useEditorPersistence({
    projects,
    activeProjectId,
  });`,
  `useEditorPersistence({
    projects,
    activeProjectId,
    isLoaded,
  });`
);

// 4. Update clearPersistedState
content = content.replace(
  `clearPersistedState();`,
  `clearPersistedStateAsync();`
);

// 5. Add loading screen if !isLoaded
content = content.replace(
  `return (
    <EditorContext.Provider`,
  `if (!isLoaded) {
    return (
      <div className="flex flex-col h-screen bg-[#0a0a0a] text-white overflow-hidden items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-zinc-800 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-400 mt-4">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <EditorContext.Provider`
);

fs.writeFileSync('src/context/EditorContext.tsx', content, 'utf-8');
console.log("Updated EditorContext.tsx");
