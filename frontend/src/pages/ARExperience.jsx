import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";
import api from "../utils/axios.js";
import toast from "react-hot-toast";

const ARExperience = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const viewerRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const streamRef = React.useRef(null);

  useEffect(() => {
    // Add event listener for model-viewer load event
    const viewer = viewerRef.current;
    const handleLoad = () => {
      console.log("Model loaded successfully");
      setModelLoaded(true);
    };

    if (viewer) {
      viewer.addEventListener("load", handleLoad);
    }

    return () => {
      if (viewer) {
        viewer.removeEventListener("load", handleLoad);
      }
    };
  }, [selectedProduct]);

  useEffect(() => {
    const startCamera = async () => {
      if (cameraActive) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          toast.error("Camera access denied or unavailable.");
          setCameraActive(false);
        }
      } else {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      }
    };
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraActive]);

  useEffect(() => {
    // Dynamically load the model-viewer script if not already present
    if (!document.querySelector('script[type="module"][src*="model-viewer"]')) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js";
      document.head.appendChild(script);
    }

    const fetchAllModels = async () => {
      try {
        // Fetch products that have AR models
        const productRes = await api.get("/products");
        const productModels = productRes.data
          .filter((p) => p.arModel?.url)
          .map((p) => ({
            ...p,
            name: `${p.name} (Product)`,
            sourceUrl: p.arModel.url,
            isProduct: true,
          }));

        // Fetch standalone models
        const standaloneRes = await api.get("/ar-models");
        const standaloneModels = standaloneRes.data.map((m) => ({
          ...m,
          name: m.name,
          sourceUrl: m.model.url,
          isProduct: false,
        }));

        const allModels = [...productModels, ...standaloneModels];
        setProducts(allModels);
        
        // Default to first available model or Shiba
        if (allModels.length > 0) {
          setSelectedProduct(allModels[0]);
        } else {
          // Fallback to default Shiba if no models are found
          setSelectedProduct({
            _id: "default-shiba",
            name: "Shiba Inu (Default)",
            description: "The Shiba Inu is a Japanese breed of hunting dog.",
            sourceUrl: "/models/shiba.glb"
          });
        }
      } catch (err) {
        console.error("Failed to load models:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllModels();
  }, []);

  const handleProductChange = (p) => {
    if (p._id === selectedProduct?._id) return;
    setModelLoaded(false);
    setSelectedProduct(p);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Interactive <span className="text-brand-600">AR Experience</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Visualize our supplements and dog breeds in your own space using Augmented Reality. 
            Rotate, zoom, and place models anywhere.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Viewer */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 min-h-[400px]">
              <div className="relative aspect-square w-full sm:aspect-video">
                {cameraActive && (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover z-0"
                  />
                )}
                <model-viewer
                  ref={viewerRef}
                  key={selectedProduct?._id || "none"}
                  src={selectedProduct?.sourceUrl || "/models/shiba.glb"}
                  ios-src=""
                  poster="/images/placeholder-model.png"
                  alt={`A 3D model of ${selectedProduct?.name || "a product"}`}
                  shadow-intensity="1"
                  camera-controls
                  auto-rotate
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  className="h-full w-full"
                  style={{ 
                    backgroundColor: "transparent", 
                    "--poster-color": "transparent",
                    width: '100%',
                    height: '100%',
                    display: 'block'
                  }}
                  touch-action="pan-y"
                >
                  {/* Custom AR Button */}
                  <button
                    slot="ar-button"
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-8 py-4 font-bold text-white shadow-2xl transition-all hover:bg-brand-700 hover:scale-110 active:scale-95 flex items-center gap-3 z-10 animate-bounce-subtle"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    View in Your Camera
                  </button>

                  {/* Desktop Camera Toggle */}
                  <div className="absolute top-6 right-6 z-10">
                    <button
                      onClick={() => setCameraActive(!cameraActive)}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold shadow-lg transition-all ${cameraActive ? 'bg-red-500 text-white' : 'bg-white text-slate-900 dark:bg-slate-800 dark:text-white'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {cameraActive ? 'Turn Off Camera' : 'Live Camera View'}
                    </button>
                  </div>

                  {!modelLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/50 backdrop-blur-sm dark:bg-slate-800/50">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
                      <p className="mt-4 font-bold text-brand-600 animate-pulse">Initializing 3D Space...</p>
                    </div>
                  )}
                </model-viewer>
              </div>

              {/* Interaction Guide */}
              <div className="border-t border-slate-100 bg-slate-50/50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
                <h3 className="mb-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  How to interact:
                </h3>
                <div className="grid grid-cols-1 gap-4 text-sm text-slate-600 dark:text-slate-400 sm:grid-cols-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-800">☝️</div>
                    <span><b>Rotate:</b> Drag with one finger/mouse</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-800">✌️</div>
                    <span><b>Zoom:</b> Pinch or use scroll wheel</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-slate-800">📱</div>
                    <span><b>AR:</b> Open on mobile for AR mode</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-xl font-extrabold text-slate-900 dark:text-white">Select Model</h2>
              
              <div className="mb-8 space-y-2">
                {products.map(p => (
                  <button
                    key={p._id}
                    onClick={() => handleProductChange(p)}
                    className={`w-full flex items-center justify-between rounded-2xl p-4 transition-all ${selectedProduct?._id === p._id ? 'bg-brand-500 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'}`}
                  >
                    <span className="font-bold">{p.name}</span>
                    {selectedProduct?._id === p._id && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>

              <h2 className="mb-4 text-xl font-extrabold text-slate-900 dark:text-white">Model Details</h2>
              <div className="mb-6 rounded-2xl bg-brand-50 p-4 dark:bg-brand-900/20">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Selected</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{selectedProduct?.name}</p>
              </div>
              <p className="mb-6 text-slate-600 dark:text-slate-400 leading-relaxed">
                {selectedProduct?.description}
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Model Format</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-100">GLB / glTF 2.0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Polygon Count</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">~15k (Optimized)</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Textured</span>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">YES</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl dark:bg-slate-800">
              <h2 className="mb-4 text-xl font-bold">Why AR?</h2>
              <p className="mb-6 text-slate-400 text-sm leading-relaxed">
                Check how large a dog crate will be, or see the scale of our bulk supplement buckets in your kitchen before you buy!
              </p>
              <Link
                to="/store/products"
                className="group flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-6 py-4 font-bold transition-all hover:bg-brand-700 active:scale-95"
              >
                Go to Store
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARExperience;
