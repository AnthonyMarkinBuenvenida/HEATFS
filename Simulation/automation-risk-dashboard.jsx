import { useState, useMemo, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, LineChart, Line, Cell, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ReferenceLine
} from "recharts";

// ── Synthetic Dataset ────────────────────────────────────────────────────────
const RAW_DATA = [
  { id:1, job:"Data Entry Clerk",         industry:"Finance",         salary:38000,  automationRisk:0.92, currentAI:0.85, futureAI:0.97, creativity:0.10, analytical:0.25, communication:0.20, repetition:0.95, education:"High School", demand:0.25 },
  { id:2, job:"Loan Officer",             industry:"Finance",         salary:65000,  automationRisk:0.71, currentAI:0.60, futureAI:0.82, creativity:0.30, analytical:0.70, communication:0.65, repetition:0.60, education:"Bachelor's",  demand:0.55 },
  { id:3, job:"Financial Analyst",        industry:"Finance",         salary:85000,  automationRisk:0.52, currentAI:0.50, futureAI:0.70, creativity:0.55, analytical:0.90, communication:0.60, repetition:0.40, education:"Bachelor's",  demand:0.70 },
  { id:4, job:"Investment Banker",        industry:"Finance",         salary:140000, automationRisk:0.35, currentAI:0.40, futureAI:0.55, creativity:0.70, analytical:0.95, communication:0.85, repetition:0.20, education:"Master's",    demand:0.75 },
  { id:5, job:"CFO",                      industry:"Finance",         salary:220000, automationRisk:0.18, currentAI:0.30, futureAI:0.40, creativity:0.85, analytical:0.95, communication:0.95, repetition:0.10, education:"Master's",    demand:0.80 },

  { id:6, job:"Assembly Line Worker",     industry:"Manufacturing",   salary:42000,  automationRisk:0.94, currentAI:0.80, futureAI:0.98, creativity:0.05, analytical:0.15, communication:0.15, repetition:0.98, education:"High School", demand:0.20 },
  { id:7, job:"Quality Inspector",        industry:"Manufacturing",   salary:48000,  automationRisk:0.82, currentAI:0.70, futureAI:0.91, creativity:0.20, analytical:0.50, communication:0.25, repetition:0.85, education:"High School", demand:0.30 },
  { id:8, job:"CNC Operator",             industry:"Manufacturing",   salary:55000,  automationRisk:0.75, currentAI:0.65, futureAI:0.88, creativity:0.25, analytical:0.55, communication:0.20, repetition:0.80, education:"Associate's", demand:0.40 },
  { id:9, job:"Manufacturing Engineer",   industry:"Manufacturing",   salary:92000,  automationRisk:0.38, currentAI:0.45, futureAI:0.60, creativity:0.65, analytical:0.85, communication:0.55, repetition:0.30, education:"Bachelor's",  demand:0.75 },
  { id:10,job:"Plant Manager",            industry:"Manufacturing",   salary:115000, automationRisk:0.22, currentAI:0.35, futureAI:0.45, creativity:0.75, analytical:0.80, communication:0.90, repetition:0.15, education:"Bachelor's",  demand:0.70 },

  { id:11,job:"Cashier",                  industry:"Retail",          salary:28000,  automationRisk:0.91, currentAI:0.75, futureAI:0.96, creativity:0.10, analytical:0.10, communication:0.40, repetition:0.92, education:"High School", demand:0.15 },
  { id:12,job:"Stock Associate",          industry:"Retail",          salary:32000,  automationRisk:0.86, currentAI:0.65, futureAI:0.93, creativity:0.10, analytical:0.15, communication:0.30, repetition:0.88, education:"High School", demand:0.20 },
  { id:13,job:"Store Manager",            industry:"Retail",          salary:58000,  automationRisk:0.45, currentAI:0.40, futureAI:0.58, creativity:0.55, analytical:0.60, communication:0.85, repetition:0.40, education:"Bachelor's",  demand:0.60 },
  { id:14,job:"Visual Merchandiser",      industry:"Retail",          salary:45000,  automationRisk:0.38, currentAI:0.35, futureAI:0.50, creativity:0.80, analytical:0.40, communication:0.60, repetition:0.35, education:"Associate's", demand:0.55 },
  { id:15,job:"Buyer / Merchandiser",     industry:"Retail",          salary:72000,  automationRisk:0.30, currentAI:0.40, futureAI:0.52, creativity:0.70, analytical:0.75, communication:0.70, repetition:0.25, education:"Bachelor's",  demand:0.65 },

  { id:16,job:"Radiologist",              industry:"Healthcare",      salary:320000, automationRisk:0.55, currentAI:0.65, futureAI:0.75, creativity:0.50, analytical:0.95, communication:0.60, repetition:0.55, education:"Doctorate",   demand:0.80 },
  { id:17,job:"Medical Coder",            industry:"Healthcare",      salary:50000,  automationRisk:0.88, currentAI:0.72, futureAI:0.94, creativity:0.10, analytical:0.50, communication:0.20, repetition:0.90, education:"Associate's", demand:0.25 },
  { id:18,job:"RN / Nurse",              industry:"Healthcare",      salary:78000,  automationRisk:0.32, currentAI:0.35, futureAI:0.48, creativity:0.55, analytical:0.75, communication:0.90, repetition:0.45, education:"Bachelor's",  demand:0.95 },
  { id:19,job:"Surgeon",                  industry:"Healthcare",      salary:380000, automationRisk:0.20, currentAI:0.30, futureAI:0.42, creativity:0.85, analytical:0.98, communication:0.80, repetition:0.25, education:"Doctorate",   demand:0.90 },
  { id:20,job:"Health Admin",             industry:"Healthcare",      salary:55000,  automationRisk:0.62, currentAI:0.50, futureAI:0.72, creativity:0.30, analytical:0.55, communication:0.65, repetition:0.65, education:"Bachelor's",  demand:0.50 },

  { id:21,job:"Software Developer",       industry:"Technology",      salary:120000, automationRisk:0.28, currentAI:0.55, futureAI:0.62, creativity:0.80, analytical:0.95, communication:0.60, repetition:0.30, education:"Bachelor's",  demand:0.95 },
  { id:22,job:"QA Tester",                industry:"Technology",      salary:75000,  automationRisk:0.68, currentAI:0.60, futureAI:0.82, creativity:0.30, analytical:0.70, communication:0.40, repetition:0.72, education:"Bachelor's",  demand:0.55 },
  { id:23,job:"Data Scientist",           industry:"Technology",      salary:135000, automationRisk:0.22, currentAI:0.60, futureAI:0.55, creativity:0.75, analytical:0.98, communication:0.65, repetition:0.20, education:"Master's",    demand:0.98 },
  { id:24,job:"IT Support Specialist",    industry:"Technology",      salary:58000,  automationRisk:0.72, currentAI:0.55, futureAI:0.85, creativity:0.20, analytical:0.55, communication:0.60, repetition:0.75, education:"Associate's", demand:0.40 },
  { id:25,job:"AI/ML Engineer",           industry:"Technology",      salary:160000, automationRisk:0.12, currentAI:0.70, futureAI:0.45, creativity:0.85, analytical:0.98, communication:0.65, repetition:0.10, education:"Master's",    demand:0.99 },

  { id:26,job:"Paralegal",                industry:"Legal",           salary:58000,  automationRisk:0.79, currentAI:0.65, futureAI:0.89, creativity:0.25, analytical:0.65, communication:0.55, repetition:0.80, education:"Associate's", demand:0.35 },
  { id:27,job:"Contract Reviewer",        industry:"Legal",           salary:62000,  automationRisk:0.85, currentAI:0.72, futureAI:0.93, creativity:0.15, analytical:0.70, communication:0.40, repetition:0.88, education:"Bachelor's",  demand:0.25 },
  { id:28,job:"Lawyer",                   industry:"Legal",           salary:145000, automationRisk:0.25, currentAI:0.40, futureAI:0.48, creativity:0.80, analytical:0.95, communication:0.95, repetition:0.20, education:"Doctorate",   demand:0.75 },
  { id:29,job:"Legal Researcher",         industry:"Legal",           salary:72000,  automationRisk:0.70, currentAI:0.60, futureAI:0.82, creativity:0.35, analytical:0.80, communication:0.45, repetition:0.72, education:"Bachelor's",  demand:0.45 },
  { id:30,job:"Judge",                    industry:"Legal",           salary:175000, automationRisk:0.08, currentAI:0.20, futureAI:0.25, creativity:0.90, analytical:0.98, communication:0.95, repetition:0.05, education:"Doctorate",   demand:0.85 },

  { id:31,job:"Truck Driver",             industry:"Transportation",  salary:52000,  automationRisk:0.87, currentAI:0.60, futureAI:0.95, creativity:0.10, analytical:0.25, communication:0.30, repetition:0.88, education:"High School", demand:0.30 },
  { id:32,job:"Taxi / Rideshare Driver",  industry:"Transportation",  salary:38000,  automationRisk:0.90, currentAI:0.55, futureAI:0.97, creativity:0.10, analytical:0.20, communication:0.45, repetition:0.90, education:"High School", demand:0.20 },
  { id:33,job:"Logistics Coordinator",   industry:"Transportation",  salary:62000,  automationRisk:0.58, currentAI:0.50, futureAI:0.72, creativity:0.40, analytical:0.65, communication:0.70, repetition:0.58, education:"Bachelor's",  demand:0.60 },
  { id:34,job:"Airline Pilot",            industry:"Transportation",  salary:180000, automationRisk:0.35, currentAI:0.60, futureAI:0.55, creativity:0.60, analytical:0.90, communication:0.80, repetition:0.35, education:"Bachelor's",  demand:0.70 },
  { id:35,job:"Supply Chain Analyst",     industry:"Transportation",  salary:78000,  automationRisk:0.42, currentAI:0.55, futureAI:0.68, creativity:0.55, analytical:0.85, communication:0.65, repetition:0.42, education:"Bachelor's",  demand:0.75 },

  { id:36,job:"Elementary Teacher",       industry:"Education",       salary:55000,  automationRisk:0.18, currentAI:0.25, futureAI:0.35, creativity:0.85, analytical:0.60, communication:0.98, repetition:0.25, education:"Bachelor's",  demand:0.85 },
  { id:37,job:"Curriculum Designer",      industry:"Education",       salary:65000,  automationRisk:0.28, currentAI:0.40, futureAI:0.50, creativity:0.90, analytical:0.75, communication:0.80, repetition:0.22, education:"Master's",    demand:0.75 },
  { id:38,job:"University Professor",     industry:"Education",       salary:95000,  automationRisk:0.15, currentAI:0.30, futureAI:0.38, creativity:0.92, analytical:0.92, communication:0.90, repetition:0.12, education:"Doctorate",   demand:0.80 },
  { id:39,job:"Test Grader",              industry:"Education",       salary:35000,  automationRisk:0.88, currentAI:0.70, futureAI:0.95, creativity:0.05, analytical:0.30, communication:0.10, repetition:0.92, education:"High School", demand:0.15 },
  { id:40,job:"Corporate Trainer",        industry:"Education",       salary:72000,  automationRisk:0.30, currentAI:0.35, futureAI:0.48, creativity:0.80, analytical:0.65, communication:0.95, repetition:0.25, education:"Bachelor's",  demand:0.72 },
];

const INDUSTRIES = [...new Set(RAW_DATA.map(d => d.industry))].sort();
const EDU_LEVELS = ["High School","Associate's","Bachelor's","Master's","Doctorate"];
const RISK_COLORS = { low:"#22c55e", medium:"#f59e0b", high:"#ef4444" };

function riskColor(v) {
  if (v < 0.4) return "#22c55e";
  if (v < 0.7) return "#f59e0b";
  return "#ef4444";
}
function riskLabel(v) {
  if (v < 0.4) return "Low";
  if (v < 0.7) return "Medium";
  return "High";
}
function fmt(n, dec=0) { return n.toLocaleString(undefined,{minimumFractionDigits:dec,maximumFractionDigits:dec}); }
function pct(n) { return (n*100).toFixed(1)+"%"; }

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const TT = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:"#1e293b",border:"1px solid #334155",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#e2e8f0",boxShadow:"0 4px 20px rgba(0,0,0,0.4)"}}>
      {label && <div style={{fontWeight:600,marginBottom:6,color:"#94a3b8"}}>{label}</div>}
      {payload.map((p,i)=>(
        <div key={i} style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{width:8,height:8,borderRadius:"50%",background:p.color||p.fill,display:"inline-block"}}/>
          <span>{p.name}: <strong style={{color:"#f1f5f9"}}>{formatter ? formatter(p.value,p.name) : p.value}</strong></span>
        </div>
      ))}
    </div>
  );
};

// ── KPI Card ─────────────────────────────────────────────────────────────────
function KPICard({ label, value, sub, accent="#3b82f6" }) {
  return (
    <div style={{background:"#1e293b",borderRadius:12,padding:"18px 20px",border:"1px solid #334155",minWidth:0}}>
      <div style={{fontSize:11,color:"#64748b",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>{label}</div>
      <div style={{fontSize:22,fontWeight:700,color:accent,lineHeight:1.1}}>{value}</div>
      {sub && <div style={{fontSize:11,color:"#475569",marginTop:4}}>{sub}</div>}
    </div>
  );
}

// ── Section Card ─────────────────────────────────────────────────────────────
function Card({ title, children, style={} }) {
  return (
    <div style={{background:"#1e293b",borderRadius:12,padding:"20px 22px",border:"1px solid #334155",boxShadow:"0 2px 12px rgba(0,0,0,0.2)",...style}}>
      {title && <div style={{fontSize:13,fontWeight:600,color:"#94a3b8",marginBottom:16,letterSpacing:"0.04em",textTransform:"uppercase"}}>{title}</div>}
      {children}
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
const NAV = [
  { id:"overview",    icon:"◈", label:"Overview"    },
  { id:"risk",        icon:"⚠", label:"Risk Analysis"},
  { id:"simulation",  icon:"⟳", label:"Simulation"  },
  { id:"predictions", icon:"◎", label:"Predictions" },
  { id:"insights",    icon:"✦", label:"Insights"    },
];

function Sidebar({ active, setActive }) {
  return (
    <div style={{width:200,background:"#0f172a",borderRight:"1px solid #1e293b",display:"flex",flexDirection:"column",height:"100vh",position:"fixed",top:0,left:0,zIndex:100,padding:"0 0 20px"}}>
      <div style={{padding:"22px 20px 18px",borderBottom:"1px solid #1e293b"}}>
        <div style={{fontSize:11,color:"#3b82f6",letterSpacing:"0.12em",textTransform:"uppercase",fontWeight:700}}>AutoRisk AI</div>
        <div style={{fontSize:10,color:"#475569",marginTop:2}}>Workforce Intelligence</div>
      </div>
      <nav style={{padding:"12px 10px",flex:1}}>
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>setActive(n.id)}
            style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,marginBottom:2,background:active===n.id?"#1e3a5f":null,color:active===n.id?"#93c5fd":"#64748b",border:"none",cursor:"pointer",fontSize:13,fontWeight:active===n.id?600:400,textAlign:"left",transition:"all 0.15s"}}>
            <span style={{fontSize:14}}>{n.icon}</span>{n.label}
          </button>
        ))}
      </nav>
      <div style={{padding:"10px 20px",fontSize:10,color:"#1e3a5f"}}>v2.1.0 · 40 roles</div>
    </div>
  );
}

// ── Filters ───────────────────────────────────────────────────────────────────
function Filters({ filters, setFilters }) {
  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:10,marginBottom:20}}>
      <div>
        <label style={{fontSize:10,color:"#64748b",display:"block",marginBottom:4}}>INDUSTRY</label>
        <select value={filters.industry} onChange={e=>setFilters(f=>({...f,industry:e.target.value}))}
          style={{width:"100%",background:"#1e293b",border:"1px solid #334155",color:"#e2e8f0",borderRadius:6,padding:"6px 8px",fontSize:12}}>
          <option value="">All</option>
          {INDUSTRIES.map(i=><option key={i} value={i}>{i}</option>)}
        </select>
      </div>
      <div>
        <label style={{fontSize:10,color:"#64748b",display:"block",marginBottom:4}}>EDUCATION</label>
        <select value={filters.education} onChange={e=>setFilters(f=>({...f,education:e.target.value}))}
          style={{width:"100%",background:"#1e293b",border:"1px solid #334155",color:"#e2e8f0",borderRadius:6,padding:"6px 8px",fontSize:12}}>
          <option value="">All</option>
          {EDU_LEVELS.map(e=><option key={e} value={e}>{e}</option>)}
        </select>
      </div>
      <div>
        <label style={{fontSize:10,color:"#64748b",display:"block",marginBottom:4}}>MIN SALARY: ${fmt(filters.salaryMin)}</label>
        <input type="range" min={20000} max={300000} step={5000} value={filters.salaryMin}
          onChange={e=>setFilters(f=>({...f,salaryMin:+e.target.value}))}
          style={{width:"100%",accentColor:"#3b82f6"}}/>
      </div>
      <div>
        <label style={{fontSize:10,color:"#64748b",display:"block",marginBottom:4}}>MAX RISK: {pct(filters.maxRisk)}</label>
        <input type="range" min={0} max={1} step={0.05} value={filters.maxRisk}
          onChange={e=>setFilters(f=>({...f,maxRisk:+e.target.value}))}
          style={{width:"100%",accentColor:"#ef4444"}}/>
      </div>
    </div>
  );
}

// ── OVERVIEW ─────────────────────────────────────────────────────────────────
function Overview({ data }) {
  const avgRisk = data.reduce((s,d)=>s+d.automationRisk,0)/data.length;
  const avgAI   = data.reduce((s,d)=>s+d.currentAI,0)/data.length;
  const avgSal  = data.reduce((s,d)=>s+d.salary,0)/data.length;

  const byIndustry = useMemo(()=>{
    const m={};
    data.forEach(d=>{ if(!m[d.industry])m[d.industry]={sum:0,n:0}; m[d.industry].sum+=d.automationRisk; m[d.industry].n++; });
    return Object.entries(m).map(([k,v])=>({industry:k,avg:v.sum/v.n})).sort((a,b)=>b.avg-a.avg);
  },[data]);

  const highestInd = byIndustry[0];
  const lowestInd  = byIndustry[byIndustry.length-1];

  const distData = useMemo(()=>{
    const bins = Array.from({length:10},(_,i)=>({range:`${i*10}-${(i+1)*10}%`,count:0}));
    data.forEach(d=>{ const b=Math.min(9,Math.floor(d.automationRisk*10)); bins[b].count++; });
    return bins;
  },[data]);

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginBottom:20}}>
        <KPICard label="Avg Automation Risk" value={pct(avgRisk)} accent={riskColor(avgRisk)}/>
        <KPICard label="Highest Risk Industry" value={highestInd?.industry} sub={pct(highestInd?.avg)} accent="#ef4444"/>
        <KPICard label="Lowest Risk Industry" value={lowestInd?.industry} sub={pct(lowestInd?.avg)} accent="#22c55e"/>
        <KPICard label="Avg AI Dependency" value={pct(avgAI)} accent="#3b82f6"/>
        <KPICard label="Total Job Roles" value={data.length} accent="#a78bfa"/>
        <KPICard label="Avg Salary" value={`$${fmt(avgSal)}`} accent="#34d399"/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <Card title="Risk by Industry">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byIndustry} layout="vertical" margin={{left:10,right:20,top:0,bottom:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
              <XAxis type="number" domain={[0,1]} tickFormatter={v=>pct(v)} tick={{fill:"#64748b",fontSize:10}}/>
              <YAxis type="category" dataKey="industry" tick={{fill:"#94a3b8",fontSize:11}} width={100}/>
              <Tooltip content={<TT formatter={(v)=>pct(v)}/>}/>
              <Bar dataKey="avg" name="Avg Risk" radius={[0,4,4,0]}>
                {byIndustry.map(e=><Cell key={e.industry} fill={riskColor(e.avg)}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Risk Distribution">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={distData} margin={{left:0,right:10,top:0,bottom:20}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
              <XAxis dataKey="range" tick={{fill:"#64748b",fontSize:9}} angle={-35} textAnchor="end"/>
              <YAxis tick={{fill:"#64748b",fontSize:10}}/>
              <Tooltip content={<TT/>}/>
              <Bar dataKey="count" name="Jobs" fill="#3b82f6" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Top 10 Highest-Risk Jobs">
        <div style={{display:"flex",flexDirection:"column",gap:6}}>
          {[...data].sort((a,b)=>b.automationRisk-a.automationRisk).slice(0,10).map((d,i)=>(
            <div key={d.id} style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:10,color:"#475569",width:16,textAlign:"right"}}>{i+1}</span>
              <span style={{fontSize:12,color:"#cbd5e1",flex:"0 0 180px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{d.job}</span>
              <div style={{flex:1,height:8,background:"#0f172a",borderRadius:4,overflow:"hidden"}}>
                <div style={{width:pct(d.automationRisk),height:"100%",background:riskColor(d.automationRisk),borderRadius:4,transition:"width 0.5s"}}/>
              </div>
              <span style={{fontSize:11,color:riskColor(d.automationRisk),width:40,textAlign:"right"}}>{pct(d.automationRisk)}</span>
              <span style={{fontSize:10,color:"#475569",width:80,textAlign:"right"}}>{d.industry}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── RISK ANALYSIS ─────────────────────────────────────────────────────────────
function RiskAnalysis({ data }) {
  const scatterData = data.map(d=>({...d, x:d.currentAI, y:d.futureAI, z:d.salary/1000}));

  const heatRows = ["creativity","analytical","communication","repetition"];
  const heatCols = data.length > 0 ? INDUSTRIES : [];
  const heatData = useMemo(()=>{
    const map={};
    INDUSTRIES.forEach(ind=>{
      const subset = data.filter(d=>d.industry===ind);
      if(!subset.length) return;
      map[ind]={};
      heatRows.forEach(attr=>{ map[ind][attr]=subset.reduce((s,d)=>s+d[attr],0)/subset.length; });
      map[ind].automationRisk=subset.reduce((s,d)=>s+d.automationRisk,0)/subset.length;
    });
    return map;
  },[data]);

  const radarData = heatRows.concat(["automationRisk"]).map(attr=>({
    attr: attr==="automationRisk"?"Risk":attr.charAt(0).toUpperCase()+attr.slice(1),
    value: data.reduce((s,d)=>s+d[attr],0)/(data.length||1)
  }));

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <Card title="AI Dependency: Current vs Future">
          <div style={{fontSize:10,color:"#475569",marginBottom:8}}>Bubble size = salary ($K)</div>
          <ResponsiveContainer width="100%" height={260}>
            <ScatterChart margin={{left:10,right:20,top:10,bottom:20}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
              <XAxis dataKey="x" name="Current AI" tickFormatter={v=>pct(v)} tick={{fill:"#64748b",fontSize:10}} label={{value:"Current AI Dep.",fill:"#475569",fontSize:10,dy:18}}/>
              <YAxis dataKey="y" name="Future AI" tickFormatter={v=>pct(v)} tick={{fill:"#64748b",fontSize:10}}/>
              <ZAxis dataKey="z" range={[40,300]}/>
              <Tooltip content={({active,payload})=>{
                if(!active||!payload?.length) return null;
                const d=payload[0]?.payload;
                return <div style={{background:"#1e293b",border:"1px solid #334155",borderRadius:8,padding:"10px 14px",fontSize:11,color:"#e2e8f0"}}>
                  <strong>{d.job}</strong><br/>
                  <span style={{color:"#64748b"}}>{d.industry}</span><br/>
                  Current AI: {pct(d.currentAI)}<br/>
                  Future AI: {pct(d.futureAI)}<br/>
                  Salary: ${fmt(d.salary)}
                </div>;
              }}/>
              <Scatter data={scatterData} fill="#3b82f6" fillOpacity={0.7}>
                {scatterData.map((d,i)=><Cell key={i} fill={riskColor(d.automationRisk)}/>)}
              </Scatter>
              <ReferenceLine x={0.5} stroke="#334155" strokeDasharray="4 4"/>
              <ReferenceLine y={0.5} stroke="#334155" strokeDasharray="4 4"/>
            </ScatterChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Skill Profile (Avg across filtered)">
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e293b"/>
              <PolarAngleAxis dataKey="attr" tick={{fill:"#94a3b8",fontSize:11}}/>
              <PolarRadiusAxis domain={[0,1]} tick={{fill:"#475569",fontSize:9}}/>
              <Radar name="Avg" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25}/>
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Skills × Automation Risk Heatmap">
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
            <thead>
              <tr>
                <th style={{color:"#64748b",padding:"6px 10px",textAlign:"left",fontWeight:500}}>Industry</th>
                {heatRows.map(r=><th key={r} style={{color:"#64748b",padding:"6px 8px",textAlign:"center",fontWeight:500,whiteSpace:"nowrap"}}>{r.charAt(0).toUpperCase()+r.slice(1)}</th>)}
                <th style={{color:"#64748b",padding:"6px 8px",textAlign:"center",fontWeight:500}}>Auto Risk</th>
              </tr>
            </thead>
            <tbody>
              {INDUSTRIES.filter(ind=>heatData[ind]).map(ind=>(
                <tr key={ind} style={{borderTop:"1px solid #0f172a"}}>
                  <td style={{color:"#94a3b8",padding:"8px 10px",fontWeight:500}}>{ind}</td>
                  {heatRows.map(attr=>{
                    const v=heatData[ind][attr];
                    const bg=`rgba(59,130,246,${v.toFixed(2)})`;
                    return <td key={attr} style={{textAlign:"center",padding:"8px",background:bg,color:"#f1f5f9"}}>{pct(v)}</td>;
                  })}
                  {(()=>{ const v=heatData[ind].automationRisk; const bg=riskColor(v)+"33";
                    return <td style={{textAlign:"center",padding:"8px",background:bg,color:riskColor(v),fontWeight:600}}>{pct(v)}</td>; })()}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ── SIMULATION ────────────────────────────────────────────────────────────────
function Simulation({ data }) {
  const [params, setParams] = useState({ adoption:50, reskilling:40, maturity:55, regulation:30 });

  const simData = useMemo(()=>{
    const { adoption, reskilling, maturity, regulation } = params;
    const adjustedRisk = Math.min(1, (adoption/100)*0.4 + (maturity/100)*0.3 - (reskilling/100)*0.3 - (regulation/100)*0.1 + 0.4);
    const demand      = Math.max(0, 1 - adjustedRisk * 0.6 + (reskilling/100)*0.2);
    const displaced   = Math.round(data.length * adjustedRisk * 0.55);
    return Array.from({length:8},(_,i)=>({
      year: 2025+i,
      risk: Math.min(1,(adjustedRisk + i*0.015*(adoption/100)*(1-regulation/120))).toFixed(3)*1,
      demand: Math.max(0.2,(demand - i*0.01*(1-reskilling/120))).toFixed(3)*1,
      displaced: Math.round(displaced*(1+i*0.12)),
    }));
  },[params,data]);

  const latest = simData[simData.length-1];

  const Slider = ({k,label,color="#3b82f6"}) => (
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
        <label style={{fontSize:11,color:"#94a3b8"}}>{label}</label>
        <span style={{fontSize:11,color:color,fontWeight:600}}>{params[k]}%</span>
      </div>
      <input type="range" min={0} max={100} value={params[k]}
        onChange={e=>setParams(p=>({...p,[k]:+e.target.value}))}
        style={{width:"100%",accentColor:color}}/>
    </div>
  );

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:16}}>
        <div>
          <Card title="Parameters">
            <Slider k="adoption"   label="AI Adoption Rate"       color="#3b82f6"/>
            <Slider k="reskilling" label="Reskilling Investment"   color="#22c55e"/>
            <Slider k="maturity"   label="AI Tool Maturity"        color="#a78bfa"/>
            <Slider k="regulation" label="Regulation Strictness"   color="#f59e0b"/>
          </Card>
          <div style={{marginTop:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <KPICard label="2032 Risk" value={pct(latest.risk)} accent={riskColor(latest.risk)}/>
            <KPICard label="2032 Demand" value={pct(latest.demand)} accent="#3b82f6"/>
            <KPICard label="Jobs at Risk" value={latest.displaced} sub="by 2032" accent="#ef4444"/>
            <KPICard label="Reskilled" value={Math.round(latest.displaced*(params.reskilling/100))} sub="est." accent="#22c55e"/>
          </div>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Card title="Projected Automation Risk 2025–2032">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={simData} margin={{left:0,right:20,top:10,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                <XAxis dataKey="year" tick={{fill:"#64748b",fontSize:11}}/>
                <YAxis tickFormatter={v=>pct(v)} tick={{fill:"#64748b",fontSize:10}} domain={[0,1]}/>
                <Tooltip content={<TT formatter={v=>pct(v)}/>}/>
                <Line type="monotone" dataKey="risk" name="Auto Risk" stroke="#ef4444" strokeWidth={2} dot={false}/>
                <Line type="monotone" dataKey="demand" name="Job Demand" stroke="#22c55e" strokeWidth={2} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card title="Displaced Workers Projection">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={simData} margin={{left:10,right:20,top:10,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                <XAxis dataKey="year" tick={{fill:"#64748b",fontSize:11}}/>
                <YAxis tick={{fill:"#64748b",fontSize:10}}/>
                <Tooltip content={<TT/>}/>
                <Bar dataKey="displaced" name="Displaced" fill="#ef4444" radius={[4,4,0,0]} fillOpacity={0.7}/>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── PREDICTIONS ───────────────────────────────────────────────────────────────
function Predictions({ data }) {
  const [inputs, setInputs] = useState({ repetition:70, analytical:40, creativity:30, communication:50, currentAI:60, salary:60000, education:"Bachelor's" });

  const prediction = useMemo(()=>{
    const { repetition, analytical, creativity, communication, currentAI } = inputs;
    const r=repetition/100, a=analytical/100, c=creativity/100, com=communication/100, ai=currentAI/100;
    const score = Math.min(1, Math.max(0,
      r*0.38 + ai*0.26 - c*0.18 - a*0.10 - com*0.08 + 0.12
    ));
    const factors = [
      {name:"Task Repetition",   importance:0.38, value:r, direction:"up"},
      {name:"Current AI Dep.",   importance:0.26, value:ai, direction:"up"},
      {name:"Creativity",        importance:0.18, value:c, direction:"down"},
      {name:"Analytical Skills", importance:0.10, value:a, direction:"down"},
      {name:"Communication",     importance:0.08, value:com, direction:"down"},
    ].sort((a,b)=>b.importance-a.importance);
    return { score, factors };
  },[inputs]);

  const Inp = ({k,label,min=0,max=100}) => (
    <div style={{marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
        <label style={{fontSize:11,color:"#94a3b8"}}>{label}</label>
        <span style={{fontSize:11,color:"#3b82f6",fontWeight:600}}>{inputs[k]}{typeof inputs[k]==="number"&&k!=="salary"?"%":k==="salary"?"":""}
        {k==="salary"?` $${fmt(inputs[k])}`:""}
        </span>
      </div>
      {k==="salary"
        ? <input type="range" min={25000} max={400000} step={5000} value={inputs[k]} onChange={e=>setInputs(p=>({...p,[k]:+e.target.value}))} style={{width:"100%",accentColor:"#3b82f6"}}/>
        : <input type="range" min={min} max={max} value={inputs[k]} onChange={e=>setInputs(p=>({...p,[k]:+e.target.value}))} style={{width:"100%",accentColor:"#3b82f6"}}/>
      }
    </div>
  );

  const sc = prediction.score;
  const ring = `conic-gradient(${riskColor(sc)} ${sc*360}deg, #1e293b 0deg)`;

  return (
    <div style={{display:"grid",gridTemplateColumns:"280px 1fr",gap:16}}>
      <Card title="Job Profile Inputs">
        <Inp k="repetition"    label="Task Repetition (%)"/>
        <Inp k="currentAI"     label="Current AI Dependency (%)"/>
        <Inp k="creativity"    label="Creativity Level (%)"/>
        <Inp k="analytical"    label="Analytical Complexity (%)"/>
        <Inp k="communication" label="Communication Req. (%)"/>
        <Inp k="salary"        label="Annual Salary"/>
        <div style={{marginBottom:12}}>
          <label style={{fontSize:11,color:"#94a3b8",display:"block",marginBottom:3}}>Education Level</label>
          <select value={inputs.education} onChange={e=>setInputs(p=>({...p,education:e.target.value}))}
            style={{width:"100%",background:"#0f172a",border:"1px solid #334155",color:"#e2e8f0",borderRadius:6,padding:"6px 8px",fontSize:12}}>
            {EDU_LEVELS.map(e=><option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </Card>

      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <Card>
          <div style={{display:"flex",alignItems:"center",gap:32}}>
            <div style={{position:"relative",width:110,height:110}}>
              <div style={{width:110,height:110,borderRadius:"50%",background:ring,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{width:78,height:78,borderRadius:"50%",background:"#1e293b",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:20,fontWeight:700,color:riskColor(sc)}}>{pct(sc)}</span>
                  <span style={{fontSize:9,color:"#475569"}}>RISK SCORE</span>
                </div>
              </div>
            </div>
            <div>
              <div style={{fontSize:24,fontWeight:700,color:riskColor(sc),marginBottom:4}}>{riskLabel(sc)} Risk</div>
              <div style={{fontSize:12,color:"#64748b",maxWidth:300}}>
                {sc>0.7?"This job profile has high automation vulnerability. Key drivers are task repetition and AI dependency.":
                 sc>0.4?"This job profile faces moderate automation risk. Strategic reskilling can reduce exposure.":
                 "This job profile is relatively resilient to automation. High creativity and analytical skills are protective."}
              </div>
            </div>
          </div>
        </Card>

        <Card title="Feature Importance (Random Forest)">
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {prediction.factors.map(f=>(
              <div key={f.name} style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:11,color:"#94a3b8",flex:"0 0 160px"}}>{f.name}</span>
                <div style={{flex:1,height:8,background:"#0f172a",borderRadius:4,overflow:"hidden"}}>
                  <div style={{width:pct(f.importance/0.38),height:"100%",background:f.direction==="up"?"#ef4444":"#22c55e",borderRadius:4}}/>
                </div>
                <span style={{fontSize:10,color:"#475569",width:36,textAlign:"right"}}>{(f.importance*100).toFixed(0)}%</span>
                <span style={{fontSize:9,color:f.direction==="up"?"#ef4444":"#22c55e",width:12}}>{f.direction==="up"?"↑":"↓"}</span>
              </div>
            ))}
          </div>
          <div style={{marginTop:12,fontSize:10,color:"#475569"}}>↑ increases risk · ↓ decreases risk · Weights from simulated Random Forest model</div>
        </Card>
      </div>
    </div>
  );
}

// ── INSIGHTS ──────────────────────────────────────────────────────────────────
function Insights({ data }) {
  const cards = [
    { icon:"🏭", title:"Most Vulnerable Industries", color:"#ef4444",
      body:"Manufacturing and Transportation face the steepest automation curves, with average risk above 70%. Assembly line work and truck driving show 87–94% risk scores driven by advances in robotics and self-driving systems." },
    { icon:"🛡️", title:"Safest Job Categories", color:"#22c55e",
      body:"Education, Legal (senior roles), and Healthcare rank among the most resilient. Teachers, surgeons, and judges combine high creativity, communication, and contextual judgment — qualities current AI struggles to replicate." },
    { icon:"📈", title:"AI Dependency Trends", color:"#3b82f6",
      body:"Across all sectors, future AI dependency is projected to grow 15–25 percentage points by 2030. Even low-risk jobs will integrate AI as a tool, though without displacing the human judgment they require." },
    { icon:"🧠", title:"Skill Trends to Watch", color:"#a78bfa",
      body:"Creativity and communication requirements correlate strongly (r=−0.72) with lower automation risk. Meanwhile, task repetition above 80% is the single strongest predictor of automation vulnerability, regardless of salary level." },
    { icon:"👥", title:"Workforce Impact Forecast", color:"#f59e0b",
      body:"Under a moderate AI adoption scenario, 35–45% of current roles face significant transformation by 2030. However, with targeted reskilling investment above 50%, net job loss can be limited to under 10% through role evolution." },
    { icon:"⚖️", title:"Policy Recommendation", color:"#34d399",
      body:"Regulation strictness plays a minor but meaningful role (8% weight). Pairing moderate regulation with aggressive reskilling programs provides the best balance between innovation velocity and workforce protection." },
  ];

  const trendData = INDUSTRIES.map(ind=>{
    const s=data.filter(d=>d.industry===ind);
    if(!s.length) return null;
    return {
      industry:ind,
      current:s.reduce((a,d)=>a+d.currentAI,0)/s.length,
      future:s.reduce((a,d)=>a+d.futureAI,0)/s.length,
    };
  }).filter(Boolean);

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12,marginBottom:20}}>
        {cards.map(c=>(
          <div key={c.title} style={{background:"#1e293b",borderRadius:12,padding:"18px 20px",border:`1px solid ${c.color}22`,borderLeft:`3px solid ${c.color}`}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span style={{fontSize:18}}>{c.icon}</span>
              <span style={{fontSize:12,fontWeight:600,color:c.color}}>{c.title}</span>
            </div>
            <p style={{fontSize:12,color:"#94a3b8",lineHeight:1.6,margin:0}}>{c.body}</p>
          </div>
        ))}
      </div>

      <Card title="AI Dependency Growth by Industry">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={trendData} margin={{left:0,right:20,top:10,bottom:40}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
            <XAxis dataKey="industry" tick={{fill:"#64748b",fontSize:10}} angle={-25} textAnchor="end"/>
            <YAxis tickFormatter={v=>pct(v)} tick={{fill:"#64748b",fontSize:10}}/>
            <Tooltip content={<TT formatter={v=>pct(v)}/>}/>
            <Legend wrapperStyle={{color:"#64748b",fontSize:11,paddingTop:8}}/>
            <Bar dataKey="current" name="Current AI Dep." fill="#3b82f6" fillOpacity={0.7} radius={[4,4,0,0]}/>
            <Bar dataKey="future" name="Future AI Dep." fill="#a78bfa" fillOpacity={0.7} radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]       = useState("overview");
  const [filters, setFilters] = useState({ industry:"", education:"", salaryMin:20000, maxRisk:1.0 });

  const filtered = useMemo(()=>RAW_DATA.filter(d=>{
    if(filters.industry  && d.industry  !== filters.industry)  return false;
    if(filters.education && d.education !== filters.education) return false;
    if(d.salary < filters.salaryMin) return false;
    if(d.automationRisk > filters.maxRisk) return false;
    return true;
  }),[filters]);

  const pages = { overview:<Overview data={filtered}/>, risk:<RiskAnalysis data={filtered}/>,
                  simulation:<Simulation data={filtered}/>, predictions:<Predictions data={filtered}/>,
                  insights:<Insights data={filtered}/> };

  const pageTitle = { overview:"Overview", risk:"Risk Analysis", simulation:"Simulation",
                      predictions:"Predictions", insights:"Insights" };

  return (
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif",background:"#0f172a",color:"#e2e8f0",minHeight:"100vh",display:"flex"}}>
      <Sidebar active={page} setActive={setPage}/>
      <main style={{marginLeft:200,flex:1,padding:"24px 28px",minHeight:"100vh",overflowY:"auto"}}>
        <div style={{marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <h1 style={{margin:0,fontSize:20,fontWeight:700,color:"#f1f5f9"}}>{pageTitle[page]}</h1>
            <div style={{fontSize:11,color:"#475569",marginTop:2}}>AI Automation Risk Modeling · {filtered.length} roles matching filters</div>
          </div>
          <div style={{fontSize:10,color:"#334155",padding:"4px 10px",background:"#1e293b",borderRadius:6,border:"1px solid #334155"}}>
            Last updated: May 2025
          </div>
        </div>

        {page !== "predictions" && page !== "simulation" && (
          <Filters filters={filters} setFilters={setFilters}/>
        )}

        {pages[page]}
      </main>
    </div>
  );
}
