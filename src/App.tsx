// @ts-nocheck
import "./App.css";
import { Excalidraw, MainMenu, WelcomeScreen, serializeAsJSON } from "@excalidraw/excalidraw";
import { useEffect, useState } from "react";
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { save, open } from '@tauri-apps/plugin-dialog';


const createExcalidrawJSON = (excalidrawRef: any) => {
  const eScene = excalidrawRef.getSceneElements();
  const eState = excalidrawRef.getAppState();
  const eFiles = excalidrawRef.getFiles();

  return serializeAsJSON(eScene, eState, eFiles, "local");
};

function App() {

  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  useEffect(() => {
    window.EXCALIDRAW_ASSET_PATH = "/dist/";
    window.EXCALIDRAW_EXPORT_SOURCE = "Excalitaur";
  }, []);

  const handleSave = async () => {
    const jsonData = createExcalidrawJSON(excalidrawAPI);

    const selectedPath = await save({
      filters: [
        {
          name: "Excalidraw Files",
          extensions: ["excalidraw"],
        },
        {
          name: "JSON Files",
          extensions: ["json"],
        },
      ],
    });

    if (selectedPath) {
      await writeTextFile(selectedPath, jsonData);

      console.log("Excalidraw scene saved to:", selectedPath);
    }
  };

  const handleRestore = async () => {
    const selectedPath = await open({
      filters: [
        {
          name: "Excalidraw Files",
          extensions: ["excalidraw"],
        },
        {
          name: "JSON Files",
          extensions: ["json"],
        },
      ],
    });

    if (selectedPath) {
      const fileContent = await readTextFile(selectedPath);
      const loadedData = JSON.parse(fileContent);

      excalidrawAPI.resetScene();
      excalidrawAPI.updateScene({elements: loadedData.elements, appState: loadedData.appState});

      console.log("Excalidraw scene restored from:", selectedPath);
    }
  };

  return (
      <div className="ec">
        <Excalidraw excalidrawAPI={(api)=> setExcalidrawAPI(api)}>
          <MainMenu>
            <MainMenu.Item onSelect={handleSave}>Save to disk</MainMenu.Item>
            <MainMenu.Separator />
            <MainMenu.Item onSelect={handleRestore}>Restore from disk</MainMenu.Item>
          </MainMenu>
          <WelcomeScreen />
        </Excalidraw>
      </div>
  );
}

export default App;
