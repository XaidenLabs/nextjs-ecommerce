"use client";

import { useRef, useState, useEffect, useCallback } from "react";
// @ts-ignore
import fabricLoader from "fabric";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Handle both CommonJS { fabric: ... } and ES module exports
const fabric = (fabricLoader as any).fabric ? (fabricLoader as any).fabric : fabricLoader;

interface CanvasStudioProps {
    imageUrl?: string;
    onSave: (design: string, designBack?: string) => void;
}

const CanvasStudio: React.FC<CanvasStudioProps> = ({ imageUrl, onSave }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [canvas, setCanvas] = useState<any>(null); // fabric.Canvas
    const [textInput, setTextInput] = useState("");
    const [textColor, setTextColor] = useState("#000000");
    const [fontFamily, setFontFamily] = useState("Arial");
    const [fontSize, setFontSize] = useState(20);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [currentView, setCurrentView] = useState<'front' | 'back'>('front');
    const [frontDesign, setFrontDesign] = useState<any>(null); // Store JSON state
    const [backDesign, setBackDesign] = useState<any>(null);   // Store JSON state

    // Initialize canvas
    useEffect(() => {
        if (canvasRef.current) {
            const initCanvas = new fabric.Canvas(canvasRef.current, {
                height: 500,
                width: 500,
                backgroundColor: "#fff",
            });

            initCanvas.on('selection:created', updateControls);
            initCanvas.on('selection:updated', updateControls);
            initCanvas.on('selection:cleared', resetControls);

            setCanvas(initCanvas);

            return () => {
                initCanvas.dispose();
            }
        }
    }, [canvasRef]); // Removed imageUrl from dependencies

    const updateControls = (e: any) => {
        const activeObj = e.selected?.[0];
        if (activeObj && activeObj.type === 'text') {
            setTextColor(activeObj.fill as string);
            setFontFamily(activeObj.fontFamily as string);
            setFontSize(activeObj.fontSize as number);
        }
    };

    const resetControls = () => {
        setTextColor("#000000");
        setFontFamily("Arial");
        setFontSize(20);
    };

    // Load/Save state when switching views or mounting
    useEffect(() => {
        if (!canvas) return;

        // Clear canvas
        canvas.clear();
        canvas.setBackgroundColor("#fff", canvas.renderAll.bind(canvas));

        const designToLoad = currentView === 'front' ? frontDesign : backDesign;

        if (designToLoad) {
            canvas.loadFromJSON(designToLoad, () => {
                canvas.renderAll();
            });
        } else {
            // If no design state, load base image.
            if (imageUrl) {
                fabric.Image.fromURL(imageUrl, (img: any) => {
                    img.set({
                        originX: 'left',
                        originY: 'top'
                    });
                    const scale = Math.min(500 / (img.width || 500), 500 / (img.height || 500));
                    img.scale(scale);
                    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
                }, { crossOrigin: 'anonymous' });
            }
        }

    }, [currentView, canvas, imageUrl, frontDesign, backDesign]); // Added design dependencies to ensure re-render on state change

    const switchView = (view: 'front' | 'back') => {
        if (!canvas) return;

        // Save current canvas state to the corresponding design state
        const json = canvas.toJSON();
        if (currentView === 'front') {
            setFrontDesign(json);
        } else {
            setBackDesign(json);
        }

        setCurrentView(view);
    };

    const addText = () => {
        if (canvas && textInput) {
            const text = new fabric.Text(textInput, {
                left: 100,
                top: 100,
                fontFamily: fontFamily,
                fill: textColor,
                fontSize: fontSize
            });
            canvas.add(text);
            canvas.setActiveObject(text);
            setTextInput("");
        }
    };

    const updateActiveObject = (key: string, value: any) => {
        if (canvas) {
            const activeObj = canvas.getActiveObject();
            if (activeObj && activeObj.type === 'text') {
                activeObj.set(key, value);
                canvas.requestRenderAll();
            }
        }
    };

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        setTextColor(color);
        updateActiveObject('fill', color);
    };

    const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const font = e.target.value;
        setFontFamily(font);
        updateActiveObject('fontFamily', font);
    };

    const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const size = parseInt(e.target.value);
        setFontSize(size);
        updateActiveObject('fontSize', size);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && canvas) {
            const reader = new FileReader();
            reader.onload = (f) => {
                const data = f.target?.result as string;
                fabric.Image.fromURL(data, (img: any) => {
                    img.scale(0.5);
                    canvas.add(img);
                    canvas.setActiveObject(img);
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const deleteSelected = () => {
        if (canvas) {
            const activeObjects = canvas.getActiveObjects();
            if (activeObjects.length) {
                canvas.discardActiveObject();
                activeObjects.forEach((obj: any) => {
                    canvas.remove(obj);
                });
            }
        }
    }

    const saveDesign = useCallback(async () => {
        if (!canvas) return;

        // First, save the current canvas state to its corresponding design state
        const currentJson = canvas.toJSON();
        if (currentView === 'front') {
            setFrontDesign(currentJson);
        } else {
            setBackDesign(currentJson);
        }

        // Create a temporary off-screen canvas to generate images for both sides
        const tempCanvasElement = document.createElement('canvas');
        const tempFabricCanvas = new fabric.Canvas(tempCanvasElement, {
            height: 500,
            width: 500,
            backgroundColor: "#fff",
        });

        let frontDataUrl: string | undefined;
        let backDataUrl: string | undefined;

        // Generate front design image
        if (frontDesign || (currentView === 'front' && currentJson)) {
            const design = currentView === 'front' ? currentJson : frontDesign;
            await new Promise<void>(resolve => {
                tempFabricCanvas.clear();
                tempFabricCanvas.setBackgroundColor("#fff", () => {
                    if (imageUrl) {
                        fabric.Image.fromURL(imageUrl, (img: any) => {
                            img.set({ originX: 'left', originY: 'top' });
                            const scale = Math.min(500 / (img.width || 500), 500 / (img.height || 500));
                            img.scale(scale);
                            tempFabricCanvas.setBackgroundImage(img, () => {
                                tempFabricCanvas.loadFromJSON(design, () => {
                                    frontDataUrl = tempFabricCanvas.toDataURL({ format: 'png', quality: 1 });
                                    resolve();
                                });
                            });
                        }, { crossOrigin: 'anonymous' });
                    } else {
                        tempFabricCanvas.loadFromJSON(design, () => {
                            frontDataUrl = tempFabricCanvas.toDataURL({ format: 'png', quality: 1 });
                            resolve();
                        });
                    }
                });
            });
        }

        // Generate back design image
        if (backDesign || (currentView === 'back' && currentJson)) {
            const design = currentView === 'back' ? currentJson : backDesign;
            await new Promise<void>(resolve => {
                tempFabricCanvas.clear();
                tempFabricCanvas.setBackgroundColor("#fff", () => {
                    if (imageUrl) { // Assuming same background image for back for now
                        fabric.Image.fromURL(imageUrl, (img: any) => {
                            img.set({ originX: 'left', originY: 'top' });
                            const scale = Math.min(500 / (img.width || 500), 500 / (img.height || 500));
                            img.scale(scale);
                            tempFabricCanvas.setBackgroundImage(img, () => {
                                tempFabricCanvas.loadFromJSON(design, () => {
                                    backDataUrl = tempFabricCanvas.toDataURL({ format: 'png', quality: 1 });
                                    resolve();
                                });
                            });
                        }, { crossOrigin: 'anonymous' });
                    } else {
                        tempFabricCanvas.loadFromJSON(design, () => {
                            backDataUrl = tempFabricCanvas.toDataURL({ format: 'png', quality: 1 });
                            resolve();
                        });
                    }
                });
            });
        }

        tempFabricCanvas.dispose(); // Clean up the temporary canvas

        // Call onSave with both data URLs
        onSave(frontDataUrl || '', backDataUrl); // Pass empty string if front is not defined
    }, [canvas, currentView, frontDesign, backDesign, imageUrl, onSave]);


    return (
        <div className="flex flex-col gap-4 p-4 border rounded-lg bg-white">
            {/* View Switcher */}
            <div className="flex gap-2 justify-center mb-2">
                <Button
                    variant={currentView === 'front' ? "default" : "outline"}
                    onClick={() => switchView('front')}
                >
                    Front View
                </Button>
                <Button
                    variant={currentView === 'back' ? "default" : "outline"}
                    onClick={() => switchView('back')}
                >
                    Back View
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                {/* ... existing controls ... */}
                <div className="flex flex-col gap-2 col-span-2">
                    <label className="font-semibold text-sm">Add Text</label>
                    <div className="flex gap-2">
                        <Input
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            placeholder="Enter text..."
                        />
                        <Button onClick={addText} variant="secondary">Add</Button>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm">Text Color</label>
                    <input
                        type="color"
                        value={textColor}
                        onChange={handleColorChange}
                        className="w-full h-10 cursor-pointer border rounded"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm">Font Family</label>
                    <select
                        value={fontFamily}
                        onChange={handleFontChange}
                        className="border rounded px-2 py-2 text-sm w-full"
                    >
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Verdana">Verdana</option>
                    </select>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm">Font Size: {fontSize}px</label>
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={fontSize}
                        onChange={handleSizeChange}
                        className="w-full cursor-pointer"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-sm">Upload Image</label>
                    <Input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                    />
                </div>
            </div>

            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Canvas ({currentView === 'front' ? "Front" : "Back"})</h3>
                <Button variant="destructive" size="sm" onClick={deleteSelected}>Delete Selected</Button>
            </div>

            <div className="border border-gray-300 self-center">
                <canvas ref={canvasRef} />
            </div>

            <div className="flex justify-end mt-4">
                <Button onClick={saveDesign} className="bg-black text-white">Save Design & Add to Cart</Button>
            </div>
        </div>
    );
};

export default CanvasStudio;
