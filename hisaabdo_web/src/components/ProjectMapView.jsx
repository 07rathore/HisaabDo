import React, { useState, useMemo, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  Search,
  Filter,
  Layers,
  ShieldAlert,
  ArrowUpRight,
  Eye,
  FileText,
  Sparkles,
  IndianRupee,
  Navigation,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Calendar,
  Camera,
  Maximize2,
  RotateCcw,
  MapPin
} from 'lucide-react';

const STATE_VIEWPORTS = {
  "All India": { lat: 22.9734, lng: 79.6569, zoom: 4.5 },
  "Andhra Pradesh": { lat: 15.9129, lng: 79.7400, zoom: 7 },
  "Arunachal Pradesh": { lat: 28.2180, lng: 94.7278, zoom: 7 },
  "Assam": { lat: 26.2006, lng: 92.9376, zoom: 7 },
  "Bihar": { lat: 25.0961, lng: 85.3131, zoom: 7 },
  "Chhattisgarh": { lat: 21.2787, lng: 81.8661, zoom: 7 },
  "Delhi": { lat: 28.7041, lng: 77.1025, zoom: 10 },
  "Goa": { lat: 15.2993, lng: 74.1240, zoom: 9 },
  "Gujarat": { lat: 22.2587, lng: 71.1924, zoom: 7 },
  "Haryana": { lat: 29.0588, lng: 76.0856, zoom: 7 },
  "Himachal Pradesh": { lat: 31.1048, lng: 77.1734, zoom: 7 },
  "Jammu and Kashmir": { lat: 33.7782, lng: 76.5762, zoom: 7 },
  "Jharkhand": { lat: 23.6102, lng: 85.2799, zoom: 7 },
  "Karnataka": { lat: 15.3173, lng: 75.7139, zoom: 7 },
  "Kerala": { lat: 10.8505, lng: 76.2711, zoom: 7 },
  "Madhya Pradesh": { lat: 22.9734, lng: 78.6569, zoom: 7 },
  "Maharashtra": { lat: 19.7515, lng: 75.7139, zoom: 7 },
  "Manipur": { lat: 24.6637, lng: 93.9063, zoom: 8 },
  "Meghalaya": { lat: 25.4670, lng: 91.3662, zoom: 8 },
  "Mizoram": { lat: 23.1645, lng: 92.9376, zoom: 8 },
  "Nagaland": { lat: 26.1584, lng: 94.5624, zoom: 8 },
  "Odisha": { lat: 20.9517, lng: 85.0985, zoom: 7 },
  "Punjab": { lat: 31.1471, lng: 75.3412, zoom: 7 },
  "Rajasthan": { lat: 27.0238, lng: 74.2179, zoom: 6.5 },
  "Sikkim": { lat: 27.5330, lng: 88.5122, zoom: 8 },
  "Tamil Nadu": { lat: 11.1271, lng: 78.6569, zoom: 7 },
  "Telangana": { lat: 18.1124, lng: 79.0193, zoom: 7 },
  "Tripura": { lat: 23.9408, lng: 91.9882, zoom: 8 },
  "Uttar Pradesh": { lat: 26.8467, lng: 80.9462, zoom: 6.5 },
  "Uttarakhand": { lat: 30.0668, lng: 79.0193, zoom: 7 },
  "West Bengal": { lat: 22.9868, lng: 87.8550, zoom: 7 }
};

const getProjectCoordinates = (proj) => {
  if (Array.isArray(proj?.coordinates) && proj.coordinates.length === 2 && Number.isFinite(proj.coordinates[0]) && Number.isFinite(proj.coordinates[1])) {
    return [proj.coordinates[0], proj.coordinates[1]];
  }

  const stateCenter = STATE_VIEWPORTS[proj?.state] || STATE_VIEWPORTS['All India'];
  const seedText = `${proj?.work_id || proj?.mp || proj?.constituency || 'india'}${proj?.state || 'all'}`;
  let hash = 0;
  for (let i = 0; i < seedText.length; i += 1) {
    hash = (hash * 31 + seedText.charCodeAt(i)) >>> 0;
  }
  const jitterLat = (((hash % 1000) / 1000) - 0.5) * 0.6;
  const jitterLng = (((hash % 2000) / 2000) - 0.5) * 0.8;

  return [stateCenter.lat + jitterLat, stateCenter.lng + jitterLng];
};

export default function ProjectMapView({ data, onSelectProject, onGenerateDossier, onNavigateTab }) {
  const projects = data?.projects || [];

  const [selectedState, setSelectedState] = useState('All India');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProject, setActiveProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  // Distinct states list
  const statesList = useMemo(() => {
    const set = new Set();
    projects.forEach(p => { if (p.state) set.add(p.state); });
    return ['All India', ...Array.from(set).sort()];
  }, [projects]);

  // Filter projects based on state, risk, search
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (selectedState !== 'All India' && p.state !== selectedState) return false;
      if (selectedRisk !== 'ALL' && p.risk_level !== selectedRisk) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchMp = p.mp?.toLowerCase().includes(q);
        const matchConst = p.constituency?.toLowerCase().includes(q);
        const matchDesc = p.description?.toLowerCase().includes(q);
        const matchWid = p.work_id?.toLowerCase().includes(q);
        if (!matchMp && !matchConst && !matchDesc && !matchWid) return false;
      }
      return true;
    });
  }, [projects, selectedState, selectedRisk, searchQuery]);

  // Subset of pins to plot on the map for top performance
  const mapPins = useMemo(() => {
    return filteredProjects.slice(0, 75);
  }, [filteredProjects]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, currentPage]);
  const paginationItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = [1];
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    if (start > 2) pages.push('ellipsis-left');
    for (let page = start; page <= end; page += 1) {
      if (page !== 1 && page !== totalPages) {
        pages.push(page);
      }
    }
    if (end < totalPages - 1) pages.push('ellipsis-right');
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedState, selectedRisk]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [22.9734, 79.6569],
        zoom: 4.5,
        minZoom: 4,
        maxZoom: 14,
        zoomControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
        maxZoom: 18
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map viewport when selected state changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const vp = STATE_VIEWPORTS[selectedState] || STATE_VIEWPORTS["All India"];
    mapInstanceRef.current.invalidateSize();
    mapInstanceRef.current.flyTo([vp.lat, vp.lng], vp.zoom, {
      duration: 1.2
    });
  }, [selectedState]);

  // Render project markers on map
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const layer = markersLayerRef.current;
    layer.clearLayers();

    mapPins.forEach((proj) => {
      const coords = getProjectCoordinates(proj);
      const isCritical = proj.risk_level === 'CRITICAL';
      const isHigh = proj.risk_level === 'HIGH';
      const isMedium = proj.risk_level === 'MEDIUM';

      const color = isCritical ? '#ef4444' : isHigh ? '#f97316' : isMedium ? '#f59e0b' : '#10b981';
      const fillColor = isCritical ? '#fee2e2' : isHigh ? '#ffedd5' : isMedium ? '#fef3c7' : '#d1fae5';

      const circle = L.circleMarker(coords, {
        radius: isCritical ? 9 : 7,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.85
      });

      const popupContent = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 11px; min-width: 190px; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-family: monospace; font-weight: 700; color: #475569;">${proj.work_id}</span>
            <span style="font-weight: 800; padding: 1px 6px; border-radius: 4px; background: ${fillColor}; color: ${color}; font-size: 10px;">
              ${proj.risk_score}/100
            </span>
          </div>
          <div style="font-weight: 700; color: #0f172a; margin-bottom: 4px; line-height: 1.3;">
            ${(proj.description || '').slice(0, 60)}...
          </div>
          <div style="color: #64748b; font-size: 10px; margin-bottom: 2px;">
            MP: <strong>${proj.mp || 'N/A'}</strong>
          </div>
          <div style="color: #64748b; font-size: 10px; margin-bottom: 4px;">
            ${proj.constituency}, ${proj.state}
          </div>
          <div style="font-weight: 800; color: #1e293b; font-family: monospace; font-size: 12px; margin-bottom: 6px;">
            ₹${(proj.disbursed_amount || 0).toLocaleString('en-IN')}
          </div>
          <button
            id="btn-popup-${proj.work_id}"
            style="width: 100%; background: #4f46e5; color: #ffffff; border: none; border-radius: 6px; padding: 5px; font-weight: 700; font-size: 10px; cursor: pointer;"
          >
            Inspect Project Forensic &rarr;
          </button>
        </div>
      `;

      circle.bindPopup(popupContent);

      circle.on('popupopen', () => {
        const btn = document.getElementById(`btn-popup-${proj.work_id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectProject(proj);
          };
        }
      });

      circle.on('click', () => {
        setActiveProject(proj);
      });

      layer.addLayer(circle);
    });
  }, [mapPins, onSelectProject]);

  // Center on project when clicked in list
  const handleSelectProjectFromList = (proj) => {
    setActiveProject(proj);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
      if (proj.coordinates) {
        mapInstanceRef.current.flyTo(proj.coordinates, 9, {
          duration: 1
        });
      }
    }
  };

  const handleResetMap = () => {
    setSelectedState('All India');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([22.9734, 79.6569], 4.5);
    }
  };

  const pageLinks = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'duplicates', label: 'Duplicate Detection' },
    { key: 'citizen', label: 'Citizen Portal' },
    { key: 'roads', label: 'Roads Analysis' },
    { key: 'risk_analysis', label: 'MP Risk' },
    { key: 'geometric', label: 'Geometric Analysis' },
    { key: 'action_center', label: 'Action Center' },
    { key: 'reports', label: 'Reports' },
    { key: 'settings', label: 'Settings' },
  ];

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes pageReveal {
          0% { opacity: 0; transform: translateY(8px) scale(0.985); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes pageButtonGlow {
          0% { box-shadow: 0 0 0 rgba(79, 70, 229, 0.0); }
          50% { box-shadow: 0 0 18px rgba(79, 70, 229, 0.18); }
          100% { box-shadow: 0 0 0 rgba(79, 70, 229, 0.0); }
        }
      `}</style>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Projects & Locality Map
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time geospatial intelligence, locality clustering, and project-level site inspection.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleResetMap}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset All-India View
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-3 rounded-2xl shadow-xs">
        <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Quick navigation</div>
        <div className="flex flex-wrap gap-2">
          {pageLinks.map((page) => (
            <button
              key={page.key}
              onClick={() => onNavigateTab && onNavigateTab(page.key)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:border-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              {page.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search MP, constituency, work ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {statesList.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500">Risk:</span>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Risk Tiers</option>
              <option value="CRITICAL">🔴 Critical Only</option>
              <option value="HIGH">🟠 High Risk</option>
              <option value="MEDIUM">🟡 Medium Risk</option>
              <option value="LOW">🟢 Low Risk</option>
            </select>
          </div>
        </div>

        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Showing <span className="font-bold text-indigo-600 dark:text-indigo-400">{filteredProjects.length.toLocaleString('en-IN')}</span> projects in region
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800 rounded-2xl p-4 shadow-xs">
            {activeProject ? (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Selected project</div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">{activeProject.description}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{activeProject.mp} • {activeProject.constituency}, {activeProject.state}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${activeProject.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300'}`}>
                      {activeProject.risk_level} • {activeProject.risk_score}
                    </span>
                    <div className="mt-2 font-mono text-sm font-black text-slate-900 dark:text-white">₹{(activeProject.disbursed_amount || 0).toLocaleString('en-IN')}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-[11px]">
                  <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5">
                    <div className="text-slate-400 uppercase font-bold">Work ID</div>
                    <div className="mt-1 font-mono font-black text-slate-900 dark:text-white">{activeProject.work_id}</div>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5">
                    <div className="text-slate-400 uppercase font-bold">Category</div>
                    <div className="mt-1 font-semibold text-slate-900 dark:text-white">{activeProject.category || 'Infrastructure'}</div>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5">
                    <div className="text-slate-400 uppercase font-bold">Citizen Reports</div>
                    <div className="mt-1 font-semibold text-emerald-700 dark:text-emerald-400">{activeProject.citizen_reports ?? 3}</div>
                  </div>
                  <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2.5">
                    <div className="text-slate-400 uppercase font-bold">Status</div>
                    <div className="mt-1 font-semibold text-slate-900 dark:text-white">{activeProject.completion_date || 'Verified'}</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Select a project from the queue to see its full forensic detail here.
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs p-3">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Project Queue</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Priority works</h3>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{filteredProjects.length} listed</span>
            </div>

            <div
              className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1"
              style={{ animation: 'pageReveal 0.22s ease-out' }}
            >
              {paginatedProjects.map((p) => {
                const isSelected = activeProject?.work_id === p.work_id;
                const isCrit = p.risk_level === 'CRITICAL';
                const isHi = p.risk_level === 'HIGH';

                return (
                  <div
                    key={p.work_id}
                    onClick={() => {
                      setActiveProject(p);
                      onSelectProject(p);
                    }}
                    className={`p-3.5 rounded-xl border transition-all duration-200 ease-out cursor-pointer transform hover:-translate-y-0.5 hover:shadow-md ${
                      isSelected
                        ? 'bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-slate-400 font-bold">{p.work_id}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                            isCrit ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                            isHi ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' :
                            'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {p.risk_level} ({p.risk_score})
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">{p.description}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{p.mp} • {p.constituency}, {p.state}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-xs text-slate-900 dark:text-white">₹{p.disbursed_amount?.toLocaleString('en-IN')}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 border-t border-slate-200 dark:border-slate-800 pt-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-[10px] font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-700 active:scale-[0.98]"
                  >
                    Prev
                  </button>

                  {paginationItems.map((pageNo, index) => {
                    if (pageNo === 'ellipsis-left' || pageNo === 'ellipsis-right') {
                      return (
                        <span
                          key={`${pageNo}-${index}`}
                          className="px-1 text-[11px] font-bold text-slate-400"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={pageNo}
                        onClick={() => setCurrentPage(pageNo)}
                        className={`min-w-[2rem] px-2 py-1.5 rounded-md border text-[10px] font-bold transition-all duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.96] ${
                          currentPage === pageNo
                            ? 'border-indigo-500 bg-gradient-to-b from-indigo-600 to-indigo-500 text-white shadow-md animate-[pageButtonGlow_0.5s_ease-out]'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:border-indigo-300 hover:text-indigo-700'
                        }`}
                      >
                        {pageNo}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-[10px] font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 transition-all duration-200 hover:border-indigo-300 hover:text-indigo-700 active:scale-[0.98]"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Locality GIS</span>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                {selectedState} Live Map
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Crit</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> High</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low</span>
            </div>
          </div>

          <div className="relative w-full h-[360px] rounded-[22px] overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.08),_transparent_35%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.12),_transparent_35%),linear-gradient(135deg,_#0f172a_0%,_#111827_100%)] shadow-[0_18px_40px_rgba(15,23,42,0.08)] z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-indigo-100/30 dark:from-slate-800/10 dark:via-transparent dark:to-slate-900/10 pointer-events-none" />
            <div ref={mapContainerRef} className="leaflet-map-container relative z-0 w-full h-full" style={{ minHeight: '360px', height: '360px', background: '#e2e8f0' }}></div>
            <div className="absolute bottom-2 left-2 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-sm pointer-events-none">
              Map sync • click marker
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2">
            <span>{mapPins.length} pins plotted</span>
            <span>OpenStreetMap tiles</span>
          </div>
        </div>
      </div>
    </div>
  );
}
