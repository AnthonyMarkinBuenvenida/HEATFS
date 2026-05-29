
import { useState, useMemo, useEffect, useRef } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, ReferenceLine, Legend, AreaChart, Area
} from "recharts";

// ─── Synthetic Dataset ───────────────────────────────────────────────────────
const RAW_DATA = [
  { job_role:"Data Entry Clerk", industry:"Finance", avg_salary_usd:34000, experience_required_years:1, education_level:"High School", task_repetition_level:9.2, creativity_requirement:1.5, physical_labor_level:1.0, analytical_complexity:2.1, social_interaction_level:2.0, ai_tool_availability:9.5, ai_tool_maturity_score:9.1, percent_tasks_automatable:94, job_growth_rate:-12, skill_complexity_score:1.8, regulation_strictness_level:5, ethical_risk_level:2, communication_requirement:2.5, domain_specific_knowledge_level:2.0, team_collaboration_level:2.0, ai_dependency_current:7.8, ai_dependency_future:9.6, training_hours_needed:40, job_demand_index:3.2, automation_risk_score:93 },
  { job_role:"Telemarketer", industry:"Retail", avg_salary_usd:29000, experience_required_years:0, education_level:"High School", task_repetition_level:9.0, creativity_requirement:2.0, physical_labor_level:1.0, analytical_complexity:2.0, social_interaction_level:6.0, ai_tool_availability:8.5, ai_tool_maturity_score:8.3, percent_tasks_automatable:90, job_growth_rate:-18, skill_complexity_score:2.1, regulation_strictness_level:3, ethical_risk_level:3, communication_requirement:7.0, domain_specific_knowledge_level:2.5, team_collaboration_level:3.0, ai_dependency_current:7.2, ai_dependency_future:9.1, training_hours_needed:20, job_demand_index:2.8, automation_risk_score:90 },
  { job_role:"Cashier", industry:"Retail", avg_salary_usd:27000, experience_required_years:0, education_level:"High School", task_repetition_level:8.8, creativity_requirement:1.5, physical_labor_level:4.0, analytical_complexity:1.5, social_interaction_level:5.5, ai_tool_availability:7.5, ai_tool_maturity_score:7.8, percent_tasks_automatable:86, job_growth_rate:-15, skill_complexity_score:1.9, regulation_strictness_level:2, ethical_risk_level:1, communication_requirement:6.0, domain_specific_knowledge_level:1.8, team_collaboration_level:4.0, ai_dependency_current:6.5, ai_dependency_future:8.9, training_hours_needed:25, job_demand_index:3.5, automation_risk_score:88 },
  { job_role:"Insurance Underwriter", industry:"Finance", avg_salary_usd:76000, experience_required_years:4, education_level:"Bachelor", task_repetition_level:7.5, creativity_requirement:3.5, physical_labor_level:1.0, analytical_complexity:6.5, social_interaction_level:4.0, ai_tool_availability:8.0, ai_tool_maturity_score:7.5, percent_tasks_automatable:78, job_growth_rate:-5, skill_complexity_score:6.2, regulation_strictness_level:8, ethical_risk_level:6, communication_requirement:5.0, domain_specific_knowledge_level:7.0, team_collaboration_level:4.5, ai_dependency_current:6.8, ai_dependency_future:8.8, training_hours_needed:80, job_demand_index:4.5, automation_risk_score:83 },
  { job_role:"Loan Officer", industry:"Finance", avg_salary_usd:73000, experience_required_years:3, education_level:"Bachelor", task_repetition_level:7.0, creativity_requirement:4.0, physical_labor_level:1.0, analytical_complexity:6.0, social_interaction_level:6.5, ai_tool_availability:7.5, ai_tool_maturity_score:7.0, percent_tasks_automatable:72, job_growth_rate:-3, skill_complexity_score:6.0, regulation_strictness_level:8, ethical_risk_level:7, communication_requirement:7.5, domain_specific_knowledge_level:7.5, team_collaboration_level:5.0, ai_dependency_current:6.2, ai_dependency_future:8.4, training_hours_needed:90, job_demand_index:5.0, automation_risk_score:79 },
  { job_role:"Accountant", industry:"Finance", avg_salary_usd:72000, experience_required_years:3, education_level:"Bachelor", task_repetition_level:7.2, creativity_requirement:3.8, physical_labor_level:1.0, analytical_complexity:7.0, social_interaction_level:4.5, ai_tool_availability:7.8, ai_tool_maturity_score:7.2, percent_tasks_automatable:74, job_growth_rate:0, skill_complexity_score:6.8, regulation_strictness_level:8, ethical_risk_level:5, communication_requirement:5.5, domain_specific_knowledge_level:7.5, team_collaboration_level:4.5, ai_dependency_current:6.0, ai_dependency_future:8.5, training_hours_needed:100, job_demand_index:5.5, automation_risk_score:76 },
  { job_role:"Radiologist", industry:"Healthcare", avg_salary_usd:418000, experience_required_years:12, education_level:"Doctorate", task_repetition_level:6.5, creativity_requirement:5.5, physical_labor_level:2.0, analytical_complexity:9.0, social_interaction_level:4.0, ai_tool_availability:8.5, ai_tool_maturity_score:8.0, percent_tasks_automatable:70, job_growth_rate:5, skill_complexity_score:9.5, regulation_strictness_level:10, ethical_risk_level:9, communication_requirement:6.5, domain_specific_knowledge_level:10.0, team_collaboration_level:5.0, ai_dependency_current:6.5, ai_dependency_future:8.2, training_hours_needed:200, job_demand_index:7.5, automation_risk_score:65 },
  { job_role:"Software Engineer", industry:"Technology", avg_salary_usd:125000, experience_required_years:3, education_level:"Bachelor", task_repetition_level:4.5, creativity_requirement:7.8, physical_labor_level:1.0, analytical_complexity:9.0, social_interaction_level:5.5, ai_tool_availability:9.0, ai_tool_maturity_score:8.5, percent_tasks_automatable:45, job_growth_rate:22, skill_complexity_score:8.9, regulation_strictness_level:4, ethical_risk_level:5, communication_requirement:6.5, domain_specific_knowledge_level:8.5, team_collaboration_level:7.5, ai_dependency_current:8.0, ai_dependency_future:9.2, training_hours_needed:150, job_demand_index:9.5, automation_risk_score:38 },
  { job_role:"ML Engineer", industry:"Technology", avg_salary_usd:145000, experience_required_years:4, education_level:"Master", task_repetition_level:3.8, creativity_requirement:8.5, physical_labor_level:1.0, analytical_complexity:9.5, social_interaction_level:5.0, ai_tool_availability:9.5, ai_tool_maturity_score:9.0, percent_tasks_automatable:30, job_growth_rate:38, skill_complexity_score:9.5, regulation_strictness_level:3, ethical_risk_level:7, communication_requirement:6.0, domain_specific_knowledge_level:9.5, team_collaboration_level:7.0, ai_dependency_current:9.2, ai_dependency_future:9.8, training_hours_needed:200, job_demand_index:9.8, automation_risk_score:22 },
  { job_role:"Registered Nurse", industry:"Healthcare", avg_salary_usd:82000, experience_required_years:3, education_level:"Bachelor", task_repetition_level:4.5, creativity_requirement:6.5, physical_labor_level:7.0, analytical_complexity:7.5, social_interaction_level:9.5, ai_tool_availability:5.0, ai_tool_maturity_score:5.5, percent_tasks_automatable:28, job_growth_rate:15, skill_complexity_score:8.2, regulation_strictness_level:9, ethical_risk_level:9, communication_requirement:9.5, domain_specific_knowledge_level:8.5, team_collaboration_level:9.0, ai_dependency_current:4.0, ai_dependency_future:6.5, training_hours_needed:120, job_demand_index:9.2, automation_risk_score:24 },
  { job_role:"Therapist", industry:"Healthcare", avg_salary_usd:78000, experience_required_years:5, education_level:"Master", task_repetition_level:3.0, creativity_requirement:7.5, physical_labor_level:1.5, analytical_complexity:7.5, social_interaction_level:10.0, ai_tool_availability:3.5, ai_tool_maturity_score:4.0, percent_tasks_automatable:18, job_growth_rate:22, skill_complexity_score:8.5, regulation_strictness_level:9, ethical_risk_level:10, communication_requirement:10.0, domain_specific_knowledge_level:9.0, team_collaboration_level:6.0, ai_dependency_current:2.5, ai_dependency_future:5.0, training_hours_needed:180, job_demand_index:9.5, automation_risk_score:14 },
  { job_role:"Civil Engineer", industry:"Engineering", avg_salary_usd:95000, experience_required_years:5, education_level:"Bachelor", task_repetition_level:5.0, creativity_requirement:7.0, physical_labor_level:5.0, analytical_complexity:8.5, social_interaction_level:6.5, ai_tool_availability:6.5, ai_tool_maturity_score:6.0, percent_tasks_automatable:42, job_growth_rate:8, skill_complexity_score:8.8, regulation_strictness_level:9, ethical_risk_level:7, communication_requirement:7.5, domain_specific_knowledge_level:9.0, team_collaboration_level:8.0, ai_dependency_current:5.5, ai_dependency_future:7.5, training_hours_needed:160, job_demand_index:7.0, automation_risk_score:45 },
  { job_role:"Teacher", industry:"Education", avg_salary_usd:58000, experience_required_years:3, education_level:"Bachelor", task_repetition_level:4.0, creativity_requirement:8.0, physical_labor_level:3.0, analytical_complexity:6.5, social_interaction_level:9.5, ai_tool_availability:4.5, ai_tool_maturity_score:4.5, percent_tasks_automatable:32, job_growth_rate:5, skill_complexity_score:7.5, regulation_strictness_level:7, ethical_risk_level:7, communication_requirement:9.5, domain_specific_knowledge_level:8.0, team_collaboration_level:7.0, ai_dependency_current:3.5, ai_dependency_future:6.0, training_hours_needed:140, job_demand_index:7.5, automation_risk_score:27 },
  { job_role:"Truck Driver", industry:"Logistics", avg_salary_usd:52000, experience_required_years:2, education_level:"High School", task_repetition_level:7.5, creativity_requirement:2.0, physical_labor_level:8.0, analytical_complexity:3.5, social_interaction_level:3.0, ai_tool_availability:7.0, ai_tool_maturity_score:6.5, percent_tasks_automatable:75, job_growth_rate:-8, skill_complexity_score:3.5, regulation_strictness_level:6, ethical_risk_level:5, communication_requirement:3.5, domain_specific_knowledge_level:3.5, team_collaboration_level:2.5, ai_dependency_current:4.5, ai_dependency_future:8.0, training_hours_needed:60, job_demand_index:5.5, automation_risk_score:78 },
  { job_role:"Warehouse Worker", industry:"Logistics", avg_salary_usd:38000, experience_required_years:0, education_level:"High School", task_repetition_level:8.5, creativity_requirement:1.5, physical_labor_level:9.0, analytical_complexity:2.0, social_interaction_level:3.5, ai_tool_availability:7.5, ai_tool_maturity_score:7.0, percent_tasks_automatable:82, job_growth_rate:-6, skill_complexity_score:2.2, regulation_strictness_level:4, ethical_risk_level:2, communication_requirement:3.0, domain_specific_knowledge_level:2.5, team_collaboration_level:4.5, ai_dependency_current:5.5, ai_dependency_future:8.5, training_hours_needed:30, job_demand_index:4.5, automation_risk_score:85 },
  { job_role:"Paralegal", industry:"Legal", avg_salary_usd:56000, experience_required_years:2, education_level:"Associate", task_repetition_level:6.5, creativity_requirement:4.5, physical_labor_level:1.0, analytical_complexity:7.0, social_interaction_level:5.5, ai_tool_availability:7.0, ai_tool_maturity_score:6.5, percent_tasks_automatable:68, job_growth_rate:2, skill_complexity_score:6.5, regulation_strictness_level:9, ethical_risk_level:7, communication_requirement:7.0, domain_specific_knowledge_level:7.5, team_collaboration_level:5.5, ai_dependency_current:5.5, ai_dependency_future:7.8, training_hours_needed:120, job_demand_index:5.5, automation_risk_score:72 },
  { job_role:"Lawyer", industry:"Legal", avg_salary_usd:148000, experience_required_years:7, education_level:"Doctorate", task_repetition_level:4.5, creativity_requirement:7.5, physical_labor_level:1.0, analytical_complexity:9.0, social_interaction_level:8.0, ai_tool_availability:6.5, ai_tool_maturity_score:6.0, percent_tasks_automatable:35, job_growth_rate:8, skill_complexity_score:9.2, regulation_strictness_level:10, ethical_risk_level:9, communication_requirement:9.5, domain_specific_knowledge_level:9.5, team_collaboration_level:7.0, ai_dependency_current:5.0, ai_dependency_future:7.5, training_hours_needed:200, job_demand_index:7.0, automation_risk_score:36 },
  { job_role:"Financial Analyst", industry:"Finance", avg_salary_usd:95000, experience_required_years:3, education_level:"Bachelor", task_repetition_level:5.5, creativity_requirement:6.0, physical_labor_level:1.0, analytical_complexity:8.5, social_interaction_level:5.0, ai_tool_availability:8.5, ai_tool_maturity_score:8.0, percent_tasks_automatable:58, job_growth_rate:6, skill_complexity_score:8.0, regulation_strictness_level:8, ethical_risk_level:6, communication_requirement:6.5, domain_specific_knowledge_level:8.0, team_collaboration_level:5.5, ai_dependency_current:7.0, ai_dependency_future:8.8, training_hours_needed:130, job_demand_index:7.0, automation_risk_score:62 },
  { job_role:"UX Designer", industry:"Technology", avg_salary_usd:105000, experience_required_years:3, education_level:"Bachelor", task_repetition_level:3.5, creativity_requirement:9.5, physical_labor_level:1.0, analytical_complexity:7.0, social_interaction_level:7.5, ai_tool_availability:7.0, ai_tool_maturity_score:6.5, percent_tasks_automatable:28, job_growth_rate:18, skill_complexity_score:8.5, regulation_strictness_level:3, ethical_risk_level:4, communication_requirement:8.5, domain_specific_knowledge_level:7.5, team_collaboration_level:8.5, ai_dependency_current:6.5, ai_dependency_future:8.0, training_hours_needed:140, job_demand_index:8.5, automation_risk_score:25 },
  { job_role:"Construction Worker", industry:"Construction", avg_salary_usd:46000, experience_required_years:1, education_level:"High School", task_repetition_level:7.0, creativity_requirement:3.0, physical_labor_level:10.0, analytical_complexity:3.5, social_interaction_level:5.0, ai_tool_availability:4.0, ai_tool_maturity_score:4.0, percent_tasks_automatable:40, job_growth_rate:4, skill_complexity_score:4.5, regulation_strictness_level:7, ethical_risk_level:4, communication_requirement:4.5, domain_specific_knowledge_level:4.5, team_collaboration_level:6.5, ai_dependency_current:2.5, ai_dependency_future:5.5, training_hours_needed:80, job_demand_index:6.5, automation_risk_score:44 },
  { job_role:"Chef", industry:"Hospitality", avg_salary_usd:56000, experience_required_years:3, education_level:"Associate", task_repetition_level:5.5, creativity_requirement:8.5, physical_labor_level:8.5, analytical_complexity:5.5, social_interaction_level:6.5, ai_tool_availability:3.5, ai_tool_maturity_score:3.5, percent_tasks_automatable:22, job_growth_rate:12, skill_complexity_score:7.5, regulation_strictness_level:6, ethical_risk_level:3, communication_requirement:7.5, domain_specific_knowledge_level:8.0, team_collaboration_level:8.5, ai_dependency_current:2.5, ai_dependency_future:4.5, training_hours_needed:110, job_demand_index:7.5, automation_risk_score:20 },
  { job_role:"Supply Chain Manager", industry:"Logistics", avg_salary_usd:112000, experience_required_years:6, education_level:"Bachelor", task_repetition_level:4.5, creativity_requirement:6.5, physical_labor_level:2.0, analytical_complexity:8.0, social_interaction_level:7.5, ai_tool_availability:7.5, ai_tool_maturity_score:7.0, percent_tasks_automatable:48, job_growth_rate:10, skill_complexity_score:8.5, regulation_strictness_level:6, ethical_risk_level:5, communication_requirement:8.5, domain_specific_knowledge_level:8.5, team_collaboration_level:9.0, ai_dependency_current:6.5, ai_dependency_future:8.0, training_hours_needed:160, job_demand_index:8.0, automation_risk_score:50 },
  { job_role:"Cybersecurity Analyst", industry:"Technology", avg_salary_usd:118000, experience_required_years:4, education_level:"Bachelor", task_repetition_level:4.0, creativity_requirement:7.5, physical_labor_level:1.0, analytical_complexity:9.0, social_interaction_level:5.5, ai_tool_availability:8.5, ai_tool_maturity_score:8.0, percent_tasks_automatable:35, job_growth_rate:32, skill_complexity_score:9.0, regulation_strictness_level:8, ethical_risk_level:8, communication_requirement:6.5, domain_specific_knowledge_level:9.0, team_collaboration_level:6.5, ai_dependency_current:7.5, ai_dependency_future:8.8, training_hours_needed:180, job_demand_index:9.5, automation_risk_score:30 },
  { job_role:"HR Specialist", industry:"Human Resources", avg_salary_usd:63000, experience_required_years:2, education_level:"Bachelor", task_repetition_level:5.5, creativity_requirement:5.5, physical_labor_level:1.0, analytical_complexity:5.5, social_interaction_level:8.5, ai_tool_availability:6.0, ai_tool_maturity_score:5.5, percent_tasks_automatable:50, job_growth_rate:5, skill_complexity_score:6.0, regulation_strictness_level:6, ethical_risk_level:6, communication_requirement:8.5, domain_specific_knowledge_level:6.0, team_collaboration_level:7.5, ai_dependency_current:4.5, ai_dependency_future:7.0, training_hours_needed:100, job_demand_index:6.5, automation_risk_score:55 },
  { job_role:"Surgeon", industry:"Healthcare", avg_salary_usd:352000, experience_required_years:14, education_level:"Doctorate", task_repetition_level:5.5, creativity_requirement:8.0, physical_labor_level:7.5, analytical_complexity:10.0, social_interaction_level:7.0, ai_tool_availability:6.0, ai_tool_maturity_score:6.5, percent_tasks_automatable:20, job_growth_rate:8, skill_complexity_score:10.0, regulation_strictness_level:10, ethical_risk_level:10, communication_requirement:8.0, domain_specific_knowledge_level:10.0, team_collaboration_level:8.5, ai_dependency_current:4.5, ai_dependency_future:6.5, training_hours_needed:300, job_demand_index:9.0, automation_risk_score:16 },
  { job_role:"Marketing Manager", industry:"Marketing", avg_salary_usd:135000, experience_required_years:5, education_level:"Bachelor", task_repetition_level:3.5, creativity_requirement:8.5, physical_labor_level:1.0, analytical_complexity:7.5, social_interaction_level:7.5, ai_tool_availability:7.5, ai_tool_maturity_score:7.0, percent_tasks_automatable:38, job_growth_rate:10, skill_complexity_score:8.0, regulation_strictness_level:4, ethical_risk_level:5, communication_requirement:9.0, domain_specific_knowledge_level:7.5, team_collaboration_level:8.5, ai_dependency_current:6.5, ai_dependency_future:8.2, training_hours_needed:120, job_demand_index:8.0, automation_risk_score:35 },
  { job_role:"Research Scientist", industry:"Technology", avg_salary_usd:138000, experience_required_years:7, education_level:"Doctorate", task_repetition_level:3.0, creativity_requirement:9.5, physical_labor_level:2.0, analytical_complexity:10.0, social_interaction_level:5.5, ai_tool_availability:8.0, ai_tool_maturity_score:7.5, percent_tasks_automatable:20, job_growth_rate:16, skill_complexity_score:10.0, regulation_strictness_level:5, ethical_risk_level:6, communication_requirement:7.0, domain_specific_knowledge_level:10.0, team_collaboration_level:7.0, ai_dependency_current:7.5, ai_dependency_future:8.5, training_hours_needed:250, job_demand_index:8.5, automation_risk_score:18 },
  { job_role:"Social Worker", industry:"Government", avg_salary_usd:48000, experience_required_years:2, education_level:"Bachelor", task_repetition_level:3.5, creativity_requirement:6.5, physical_labor_level:3.5, analytical_complexity:6.0, social_interaction_level:10.0, ai_tool_availability:3.0, ai_tool_maturity_score:3.5, percent_tasks_automatable:20, job_growth_rate:12, skill_complexity_score:7.0, regulation_strictness_level:8, ethical_risk_level:8, communication_requirement:9.5, domain_specific_knowledge_level:7.5, team_collaboration_level:7.0, ai_dependency_current:2.5, ai_dependency_future:4.5, training_hours_needed:130, job_demand_index:8.0, automation_risk_score:18 },
  { job_role:"Pilot", industry:"Aviation", avg_salary_usd:186000, experience_required_years:7, education_level:"Bachelor", task_repetition_level:5.5, creativity_requirement:6.5, physical_labor_level:4.0, analytical_complexity:8.5, social_interaction_level:6.5, ai_tool_availability:7.0, ai_tool_maturity_score:7.5, percent_tasks_automatable:55, job_growth_rate:3, skill_complexity_score:9.0, regulation_strictness_level:10, ethical_risk_level:9, communication_requirement:8.0, domain_specific_knowledge_level:9.5, team_collaboration_level:7.5, ai_dependency_current:6.0, ai_dependency_future:8.0, training_hours_needed:280, job_demand_index:6.5, automation_risk_score:52 },
  { job_role:"Architect", industry:"Construction", avg_salary_usd:88000, experience_required_years:5, education_level:"Bachelor", task_repetition_level:3.5, creativity_requirement:9.5, physical_labor_level:2.5, analytical_complexity:8.5, social_interaction_level:7.0, ai_tool_availability:7.0, ai_tool_maturity_score:6.5, percent_tasks_automatable:30, job_growth_rate:5, skill_complexity_score:9.0, regulation_strictness_level:8, ethical_risk_level:6, communication_requirement:8.0, domain_specific_knowledge_level:9.0, team_collaboration_level:8.0, ai_dependency_current:5.5, ai_dependency_future:7.5, training_hours_needed:180, job_demand_index:7.0, automation_risk_score:28 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
const fmt = (n, d = 1) => Number(n).toFixed(d);
const fmtK = n => n >= 1000 ? `$${(n/1000).toFixed(0)}K` : `$${n}`;

const INDUSTRIES = [...new Set(RAW_DATA.map(d => d.industry))].sort();
const RISK_COLOR = score => {
  if (score >= 75) return "#ff3b5c";
  if (score >= 55) return "#ff8c42";
  if (score >= 35) return "#ffd166";
  return "#06d6a0";
};
const RISK_LABEL = score => {
  if (score >= 75) return "Critical";
  if (score >= 55) return "High";
  if (score >= 35) return "Moderate";
  return "Resilient";
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const KPICard = ({ label, value, sub, color = "#38bdf8", icon }) => (
  <div style={{
    background: "linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.8))",
    border: `1px solid rgba(56,189,248,0.15)`,
    borderRadius: 12, padding: "16px 20px", flex: "1 1 160px",
    backdropFilter: "blur(12px)", position: "relative", overflow: "hidden"
  }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${color},transparent)` }} />
    <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 26, fontWeight: 700, color, fontFamily: "'Courier New',monospace", lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{sub}</div>}
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontSize: 13, color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 600 }}>{title}</div>
    {subtitle && <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{subtitle}</div>}
  </div>
);

const Panel = ({ children, style = {} }) => (
  <div style={{
    background: "rgba(15,23,42,0.8)", border: "1px solid rgba(51,65,85,0.6)",
    borderRadius: 12, padding: 20, backdropFilter: "blur(8px)", ...style
  }}>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "rgba(2,6,23,0.95)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      {label && <div style={{ color: "#94a3b8", marginBottom: 4 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || "#38bdf8" }}>{p.name}: <b>{typeof p.value === "number" ? fmt(p.value) : p.value}</b></div>
      ))}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [filters, setFilters] = useState({ industry: "All", search: "" });
  const [simParams, setSimParams] = useState({
    aiAdoption: 50, regulation: 50, reskilling: 50, maturity: 50, acceleration: 50
  });
  const [aiInsight, setAiInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);

  const filtered = useMemo(() => {
    return RAW_DATA.filter(d => {
      if (filters.industry !== "All" && d.industry !== filters.industry) return false;
      if (filters.search && !d.job_role.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [filters]);

  // KPI calculations
  const kpis = useMemo(() => {
    const riskScores = filtered.map(d => d.automation_risk_score);
    const byIndustry = INDUSTRIES.map(ind => ({
      ind, avg: avg(RAW_DATA.filter(d => d.industry === ind).map(d => d.automation_risk_score))
    })).sort((a, b) => b.avg - a.avg);
    return {
      avgRisk: avg(riskScores),
      mostVulnerable: byIndustry[0]?.ind,
      leastVulnerable: byIndustry[byIndustry.length - 1]?.ind,
      avgFutureAI: avg(filtered.map(d => d.ai_dependency_future)),
      avgSalary: avg(filtered.map(d => d.avg_salary_usd)),
      avgTraining: avg(filtered.map(d => d.training_hours_needed)),
      totalRoles: filtered.length,
      avgGrowth: avg(filtered.map(d => d.job_growth_rate)),
    };
  }, [filtered]);

  // Chart data
  const industryRiskData = useMemo(() => {
    return INDUSTRIES.map(ind => {
      const roles = filtered.filter(d => d.industry === ind);
      return { industry: ind, risk: avg(roles.map(d => d.automation_risk_score)), count: roles.length };
    }).filter(d => d.count > 0).sort((a, b) => b.risk - a.risk);
  }, [filtered]);

  const topRiskRoles = useMemo(() => [...filtered].sort((a, b) => b.automation_risk_score - a.automation_risk_score).slice(0, 12), [filtered]);
  const topResilientRoles = useMemo(() => [...filtered].sort((a, b) => a.automation_risk_score - b.automation_risk_score).slice(0, 8), [filtered]);

  const scatterData = useMemo(() => filtered.map(d => ({
    x: d.ai_dependency_current, y: d.ai_dependency_future,
    z: d.avg_salary_usd / 15000, name: d.job_role,
    risk: d.automation_risk_score, fill: RISK_COLOR(d.automation_risk_score)
  })), [filtered]);

  // Simulation
  const simRisk = useMemo(() => {
    const factor = (simParams.aiAdoption / 50) * (simParams.maturity / 50) * (simParams.acceleration / 50) * (1 - simParams.reskilling / 200) * (1 - simParams.regulation / 300);
    return filtered.map(d => ({
      ...d,
      projected_risk: Math.min(100, d.automation_risk_score * factor)
    }));
  }, [filtered, simParams]);

  const scenarios = useMemo(() => ({
    best: avg(filtered.map(d => Math.max(0, d.automation_risk_score * 0.6))),
    moderate: avg(filtered.map(d => d.automation_risk_score)),
    aggressive: avg(filtered.map(d => Math.min(100, d.automation_risk_score * 1.45))),
  }), [filtered]);

  // Resilience index
  const resilienceData = useMemo(() => {
    return [...filtered].map(d => ({
      name: d.job_role.length > 18 ? d.job_role.slice(0, 16) + "…" : d.job_role,
      resilience: avg([d.creativity_requirement, d.analytical_complexity, d.social_interaction_level, d.communication_requirement, d.domain_specific_knowledge_level]) * 10,
      risk: d.automation_risk_score
    })).sort((a, b) => b.resilience - a.resilience).slice(0, 10);
  }, [filtered]);

  // Correlation data (simplified)
  const correlationVars = ["automation_risk_score","avg_salary_usd","ai_dependency_future","skill_complexity_score","job_growth_rate","task_repetition_level","creativity_requirement"];
  const correlationMatrix = useMemo(() => {
    const norm = key => { const vals = filtered.map(d => d[key]); const mn = Math.min(...vals), mx = Math.max(...vals); return filtered.map(d => (d[key]-mn)/(mx-mn||1)); };
    return correlationVars.map((k1, i) => correlationVars.map((k2, j) => {
      if (i === j) return 1;
      const a = norm(k1), b = norm(k2);
      const ma = avg(a), mb = avg(b);
      const num = a.reduce((s, v, idx) => s + (v-ma)*(b[idx]-mb), 0);
      const da = Math.sqrt(a.reduce((s,v) => s+(v-ma)**2, 0));
      const db = Math.sqrt(b.reduce((s,v) => s+(v-mb)**2, 0));
      return da && db ? num / (da * db) : 0;
    }));
  }, [filtered]);

  const fetchInsight = async () => {
    setLoadingInsight(true);
    setAiInsight("");
    const context = `Top 3 highest risk industries: ${industryRiskData.slice(0,3).map(d=>`${d.industry}(${fmt(d.risk)})`).join(", ")}. Most resilient role: ${topResilientRoles[0]?.job_role}. Avg automation risk: ${fmt(kpis.avgRisk)}. Avg job growth: ${fmt(kpis.avgGrowth)}%. Current filters: ${filters.industry !== "All" ? filters.industry : "All industries"}.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: `You are a senior workforce economist. Given this AI automation risk data: ${context} Write a 3-paragraph analyst-style insight report covering: (1) which industries are most at risk and why, (2) what makes certain roles resilient, (3) workforce disruption forecast and reskilling recommendations. Be specific, data-driven, and use professional language.` }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || "Unable to generate insight.";
      setAiInsight(text);
    } catch {
      setAiInsight("AI insight generation failed. Check API connectivity.");
    }
    setLoadingInsight(false);
  };

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "risk", label: "Risk Analysis" },
    { id: "ai", label: "AI Dependency" },
    { id: "simulation", label: "Simulation" },
    { id: "resilience", label: "Resilience" },
    { id: "correlation", label: "Correlations" },
    { id: "insights", label: "AI Insights" },
  ];

  return (
    <div style={{
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      background: "linear-gradient(135deg,#020617 0%,#0a1628 40%,#0d1f3c 100%)",
      minHeight: "100vh", color: "#e2e8f0", fontSize: 13
    }}>
      {/* Header */}
      <div style={{ background: "rgba(2,6,23,0.9)", borderBottom: "1px solid rgba(56,189,248,0.2)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#0ea5e9,#6366f1)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: "white" }}>AI</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9", letterSpacing: "0.05em" }}>WORKFORCE RISK INTELLIGENCE</div>
            <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.2em" }}>AI AUTOMATION MODELING SYSTEM v2.4</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select value={filters.industry} onChange={e => setFilters(f => ({ ...f, industry: e.target.value }))}
            style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 6, color: "#94a3b8", padding: "4px 10px", fontSize: 11, cursor: "pointer" }}>
            <option value="All">All Industries</option>
            {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
          </select>
          <input placeholder="Search roles…" value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            style={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 6, color: "#94a3b8", padding: "4px 10px", fontSize: 11, outline: "none", width: 140 }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#06d6a0", boxShadow: "0 0 8px #06d6a0" }} />
          <span style={{ fontSize: 10, color: "#475569" }}>LIVE</span>
        </div>
      </div>

      {/* Tab Nav */}
      <div style={{ background: "rgba(2,6,23,0.7)", borderBottom: "1px solid rgba(51,65,85,0.5)", padding: "0 24px", display: "flex", gap: 0, overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            background: "none", border: "none", cursor: "pointer", padding: "10px 18px",
            color: activeTab === t.id ? "#38bdf8" : "#64748b",
            borderBottom: activeTab === t.id ? "2px solid #38bdf8" : "2px solid transparent",
            fontSize: 11, fontFamily: "inherit", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: activeTab === t.id ? 700 : 400,
            transition: "color 0.2s", whiteSpace: "nowrap"
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: "20px 24px", maxWidth: 1600 }}>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
              <KPICard label="Avg Automation Risk" value={`${fmt(kpis.avgRisk)}%`} sub={RISK_LABEL(kpis.avgRisk)} color={RISK_COLOR(kpis.avgRisk)} />
              <KPICard label="Most Vulnerable" value={kpis.mostVulnerable} sub="Highest avg risk" color="#ff3b5c" />
              <KPICard label="Most Resilient" value={kpis.leastVulnerable} sub="Lowest avg risk" color="#06d6a0" />
              <KPICard label="Future AI Dependency" value={`${fmt(kpis.avgFutureAI)}/10`} sub="Projected adoption" color="#818cf8" />
              <KPICard label="Avg Salary" value={fmtK(Math.round(kpis.avgSalary))} sub="Across all roles" color="#38bdf8" />
              <KPICard label="Training Hours" value={`${fmt(kpis.avgTraining, 0)}h`} sub="Avg needed" color="#fbbf24" />
              <KPICard label="Roles Analyzed" value={kpis.totalRoles} sub={`${filters.industry !== "All" ? filters.industry : "All industries"}`} color="#94a3b8" />
              <KPICard label="Avg Job Growth" value={`${kpis.avgGrowth >= 0 ? "+" : ""}${fmt(kpis.avgGrowth)}%`} sub="Annual projection" color={kpis.avgGrowth >= 0 ? "#06d6a0" : "#ff3b5c"} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Panel>
                <SectionHeader title="Industry Risk Ranking" subtitle="Average automation risk score by sector" />
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={industryRiskData} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke="rgba(51,65,85,0.4)" horizontal={false} />
                    <XAxis type="number" domain={[0,100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                    <YAxis type="category" dataKey="industry" tick={{ fill: "#94a3b8", fontSize: 10 }} width={90} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="risk" radius={[0,4,4,0]}>
                      {industryRiskData.map((d, i) => <Cell key={i} fill={RISK_COLOR(d.risk)} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>

              <Panel>
                <SectionHeader title="Salary vs Automation Risk" subtitle="Each bubble = 1 job role" />
                <ResponsiveContainer width="100%" height={320}>
                  <ScatterChart margin={{ top: 10, right: 10 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke="rgba(51,65,85,0.4)" />
                    <XAxis dataKey="x" name="Salary" tick={{ fill: "#64748b", fontSize: 10 }} label={{ value: "Salary (USD)", fill: "#64748b", fontSize: 10, position: "insideBottom", offset: -4 }} type="number" />
                    <YAxis dataKey="y" name="Risk Score" tick={{ fill: "#64748b", fontSize: 10 }} label={{ value: "Risk", fill: "#64748b", fontSize: 10, angle: -90, position: "insideLeft" }} />
                    <Tooltip content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0]?.payload;
                      return (
                        <div style={{ background: "rgba(2,6,23,0.95)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 11 }}>
                          <div style={{ color: "#38bdf8", fontWeight: 700, marginBottom: 4 }}>{d?.name}</div>
                          <div style={{ color: "#94a3b8" }}>Salary: {fmtK(d?.x || 0)}</div>
                          <div style={{ color: RISK_COLOR(d?.y || 0) }}>Risk: {fmt(d?.y)}%</div>
                        </div>
                      );
                    }} />
                    <Scatter data={filtered.map(d => ({ x: d.avg_salary_usd, y: d.automation_risk_score, name: d.job_role }))}
                      fill="#38bdf8" opacity={0.8}>
                      {filtered.map((d, i) => <Cell key={i} fill={RISK_COLOR(d.automation_risk_score)} />)}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </Panel>
            </div>

            <div style={{ marginTop: 16 }}>
              <Panel>
                <SectionHeader title="Top Risk Job Roles" subtitle="Sorted by automation risk score" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10 }}>
                  {topRiskRoles.map((d, i) => (
                    <div key={i} style={{ background: "rgba(30,41,59,0.5)", border: `1px solid ${RISK_COLOR(d.automation_risk_score)}30`, borderRadius: 8, padding: "12px 14px", borderLeft: `3px solid ${RISK_COLOR(d.automation_risk_score)}` }}>
                      <div style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 12, marginBottom: 4 }}>{d.job_role}</div>
                      <div style={{ fontSize: 10, color: "#64748b", marginBottom: 6 }}>{d.industry}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 10, color: "#94a3b8" }}>{fmtK(d.avg_salary_usd)}</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: RISK_COLOR(d.automation_risk_score), fontFamily: "'Courier New',monospace" }}>{d.automation_risk_score}%</div>
                      </div>
                      <div style={{ marginTop: 6, height: 3, borderRadius: 2, background: "rgba(51,65,85,0.5)" }}>
                        <div style={{ height: "100%", width: `${d.automation_risk_score}%`, borderRadius: 2, background: RISK_COLOR(d.automation_risk_score), transition: "width 0.5s" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </>
        )}

        {/* ── RISK ANALYSIS ── */}
        {activeTab === "risk" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Panel style={{ gridColumn: "1/-1" }}>
              <SectionHeader title="Automation Risk Distribution" subtitle="All roles by risk score band" />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[{ label: "Critical (75-100)", color: "#ff3b5c" }, { label: "High (55-75)", color: "#ff8c42" }, { label: "Moderate (35-55)", color: "#ffd166" }, { label: "Resilient (<35)", color: "#06d6a0" }].map(b => {
                  const count = filtered.filter(d => {
                    const s = d.automation_risk_score;
                    if (b.label.startsWith("Critical")) return s >= 75;
                    if (b.label.startsWith("High")) return s >= 55 && s < 75;
                    if (b.label.startsWith("Moderate")) return s >= 35 && s < 55;
                    return s < 35;
                  }).length;
                  return (
                    <div key={b.label} style={{ flex: "1 1 160px", background: `${b.color}10`, border: `1px solid ${b.color}40`, borderRadius: 8, padding: 16, textAlign: "center" }}>
                      <div style={{ fontSize: 28, fontWeight: 700, color: b.color, fontFamily: "'Courier New',monospace" }}>{count}</div>
                      <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{b.label}</div>
                      <div style={{ fontSize: 10, color: "#64748b" }}>of {filtered.length} roles</div>
                    </div>
                  );
                })}
              </div>
            </Panel>

            <Panel>
              <SectionHeader title="Highest Risk Roles" />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[...filtered].sort((a, b) => b.automation_risk_score - a.automation_risk_score).slice(0, 10).map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 20, fontSize: 10, color: "#475569", textAlign: "right" }}>#{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: "#e2e8f0", fontWeight: 500 }}>{d.job_role}</div>
                      <div style={{ fontSize: 9, color: "#475569" }}>{d.industry}</div>
                    </div>
                    <div style={{ width: 80, height: 4, borderRadius: 2, background: "rgba(51,65,85,0.4)" }}>
                      <div style={{ height: "100%", width: `${d.automation_risk_score}%`, borderRadius: 2, background: RISK_COLOR(d.automation_risk_score) }} />
                    </div>
                    <div style={{ width: 36, textAlign: "right", color: RISK_COLOR(d.automation_risk_score), fontWeight: 700, fontSize: 12 }}>{d.automation_risk_score}</div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel>
              <SectionHeader title="Most Resilient Roles" />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {topResilientRoles.map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 20, fontSize: 10, color: "#475569", textAlign: "right" }}>#{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, color: "#e2e8f0", fontWeight: 500 }}>{d.job_role}</div>
                      <div style={{ fontSize: 9, color: "#475569" }}>{d.industry} · {fmtK(d.avg_salary_usd)}</div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#06d6a0" }}>{d.automation_risk_score}%</div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel style={{ gridColumn: "1/-1" }}>
              <SectionHeader title="Risk vs Task Repetition vs Salary" subtitle="Scatter: repetition level → automation risk" />
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(51,65,85,0.4)" />
                  <XAxis dataKey="x" name="Task Repetition" tick={{ fill: "#64748b", fontSize: 10 }} label={{ value: "Task Repetition Level", fill: "#64748b", fontSize: 10, position: "insideBottom", offset: -4 }} />
                  <YAxis dataKey="y" name="Automation Risk" tick={{ fill: "#64748b", fontSize: 10 }} label={{ value: "Risk %", fill: "#64748b", fontSize: 10, angle: -90, position: "insideLeft" }} />
                  <Tooltip content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload;
                    return <div style={{ background: "rgba(2,6,23,0.95)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 11 }}>
                      <div style={{ color: "#38bdf8", fontWeight: 700 }}>{d?.name}</div>
                      <div style={{ color: "#94a3b8" }}>Repetition: {d?.x}</div>
                      <div style={{ color: RISK_COLOR(d?.y || 0) }}>Risk: {d?.y}%</div>
                    </div>;
                  }} />
                  <Scatter data={filtered.map(d => ({ x: d.task_repetition_level, y: d.automation_risk_score, name: d.job_role }))}
                    fill="#38bdf8">
                    {filtered.map((d, i) => <Cell key={i} fill={RISK_COLOR(d.automation_risk_score)} />)}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        )}

        {/* ── AI DEPENDENCY ── */}
        {activeTab === "ai" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Panel style={{ gridColumn: "1/-1" }}>
              <SectionHeader title="Current vs Future AI Dependency" subtitle="Bubble size = salary · Color = automation risk" />
              <ResponsiveContainer width="100%" height={380}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(51,65,85,0.3)" />
                  <XAxis dataKey="x" name="Current AI Dep" domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 10 }} label={{ value: "Current AI Dependency", fill: "#64748b", fontSize: 10, position: "insideBottom", offset: -4 }} />
                  <YAxis dataKey="y" name="Future AI Dep" domain={[0, 10]} tick={{ fill: "#64748b", fontSize: 10 }} label={{ value: "Future AI Dependency", fill: "#64748b", fontSize: 10, angle: -90, position: "insideLeft" }} />
                  <ReferenceLine x={5} stroke="rgba(56,189,248,0.2)" strokeDasharray="4" />
                  <ReferenceLine y={5} stroke="rgba(56,189,248,0.2)" strokeDasharray="4" />
                  <Tooltip content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload;
                    return <div style={{ background: "rgba(2,6,23,0.95)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 11 }}>
                      <div style={{ color: "#38bdf8", fontWeight: 700 }}>{d?.name}</div>
                      <div style={{ color: "#94a3b8" }}>Current: {fmt(d?.x)}/10 → Future: {fmt(d?.y)}/10</div>
                      <div style={{ color: RISK_COLOR(d?.risk || 0) }}>Risk: {d?.risk}%</div>
                    </div>;
                  }} />
                  <Scatter data={scatterData} fill="#38bdf8">
                    {scatterData.map((d, i) => <Cell key={i} fill={d.fill} fillOpacity={0.85} />)}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </Panel>

            <Panel>
              <SectionHeader title="AI Tool Maturity vs Risk" />
              <ResponsiveContainer width="100%" height={260}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(51,65,85,0.3)" />
                  <XAxis dataKey="x" name="Maturity" domain={[0,10]} tick={{ fill: "#64748b", fontSize: 10 }} label={{ value: "AI Tool Maturity", fill: "#64748b", fontSize: 10, position: "insideBottom", offset: -4 }} />
                  <YAxis dataKey="y" name="Risk" domain={[0,100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Scatter data={filtered.map(d => ({ x: d.ai_tool_maturity_score, y: d.automation_risk_score, name: d.job_role }))} fill="#6366f1">
                    {filtered.map((d, i) => <Cell key={i} fill={RISK_COLOR(d.automation_risk_score)} />)}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </Panel>

            <Panel>
              <SectionHeader title="Future AI Dependency by Industry" />
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={INDUSTRIES.map(ind => ({ ind: ind.slice(0,8), dep: avg(RAW_DATA.filter(d => d.industry === ind).map(d => d.ai_dependency_future)) })).sort((a,b) => b.dep - a.dep)} layout="vertical">
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(51,65,85,0.3)" horizontal={false} />
                  <XAxis type="number" domain={[0,10]} tick={{ fill: "#64748b", fontSize: 10 }} />
                  <YAxis type="category" dataKey="ind" width={65} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="dep" radius={[0,4,4,0]} fill="#818cf8" />
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        )}

        {/* ── SIMULATION ── */}
        {activeTab === "simulation" && (
          <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16 }}>
            <Panel>
              <SectionHeader title="Simulation Controls" subtitle="Adjust parameters to model scenarios" />
              {Object.entries(simParams).map(([key, val]) => {
                const labels = { aiAdoption: "AI Adoption Rate", regulation: "Regulation Strictness", reskilling: "Reskilling Investment", maturity: "AI Tool Maturity", acceleration: "Automation Acceleration" };
                return (
                  <div key={key} style={{ marginBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>{labels[key]}</div>
                      <div style={{ fontSize: 12, color: "#38bdf8", fontWeight: 700 }}>{val}%</div>
                    </div>
                    <input type="range" min={0} max={100} value={val}
                      onChange={e => setSimParams(p => ({ ...p, [key]: Number(e.target.value) }))}
                      style={{ width: "100%", accentColor: "#38bdf8", cursor: "pointer" }} />
                  </div>
                );
              })}
              <div style={{ marginTop: 16, padding: 12, background: "rgba(56,189,248,0.05)", border: "1px solid rgba(56,189,248,0.15)", borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: "#64748b", marginBottom: 4 }}>PROJECTED AVG RISK</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: RISK_COLOR(avg(simRisk.map(d => d.projected_risk))), fontFamily: "'Courier New',monospace" }}>
                  {fmt(avg(simRisk.map(d => d.projected_risk)))}%
                </div>
                <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>vs baseline {fmt(kpis.avgRisk)}%</div>
              </div>
            </Panel>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 12 }}>
                {[
                  { label: "Best Case", value: scenarios.best, color: "#06d6a0", desc: "High reskilling, strong regulation" },
                  { label: "Moderate", value: scenarios.moderate, color: "#fbbf24", desc: "Balanced adoption & policy" },
                  { label: "Aggressive AI", value: scenarios.aggressive, color: "#ff3b5c", desc: "Rapid AI expansion, low reskilling" },
                ].map(s => (
                  <div key={s.label} style={{ flex: 1, background: `${s.color}08`, border: `1px solid ${s.color}30`, borderRadius: 10, padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontSize: 36, fontWeight: 700, color: s.color, fontFamily: "'Courier New',monospace" }}>{fmt(s.value)}%</div>
                    <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>{s.desc}</div>
                  </div>
                ))}
              </div>

              <Panel>
                <SectionHeader title="Projected Risk by Role (Simulated)" subtitle="Based on current slider settings" />
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={simRisk.sort((a,b) => b.projected_risk - a.projected_risk)} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke="rgba(51,65,85,0.3)" horizontal={false} />
                    <XAxis type="number" domain={[0,100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                    <YAxis type="category" dataKey="job_role" width={120} tick={{ fill: "#94a3b8", fontSize: 9 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="automation_risk_score" name="Baseline" fill="rgba(51,65,85,0.5)" radius={[0,0,0,0]} />
                    <Bar dataKey="projected_risk" name="Projected" radius={[0,4,4,0]}>
                      {simRisk.map((d, i) => <Cell key={i} fill={RISK_COLOR(d.projected_risk)} />)}
                    </Bar>
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </BarChart>
                </ResponsiveContainer>
              </Panel>
            </div>
          </div>
        )}

        {/* ── RESILIENCE ── */}
        {activeTab === "resilience" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Panel>
              <SectionHeader title="Resilience Index" subtitle="Based on creativity, social, analytical & domain skills" />
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={resilienceData} layout="vertical">
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(51,65,85,0.3)" horizontal={false} />
                  <XAxis type="number" domain={[0,100]} tick={{ fill: "#64748b", fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={110} tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="resilience" name="Resilience Score" radius={[0,4,4,0]} fill="#06d6a0" />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel>
              <SectionHeader title="Skills Radar – Top Resilient Role" subtitle={topResilientRoles[0]?.job_role} />
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={topResilientRoles[0] ? [
                  { skill: "Creativity", val: topResilientRoles[0].creativity_requirement * 10 },
                  { skill: "Analytical", val: topResilientRoles[0].analytical_complexity * 10 },
                  { skill: "Social", val: topResilientRoles[0].social_interaction_level * 10 },
                  { skill: "Communication", val: topResilientRoles[0].communication_requirement * 10 },
                  { skill: "Domain Know.", val: topResilientRoles[0].domain_specific_knowledge_level * 10 },
                ] : []}>
                  <PolarGrid stroke="rgba(51,65,85,0.5)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <PolarRadiusAxis domain={[0,100]} tick={{ fill: "#475569", fontSize: 8 }} />
                  <Radar dataKey="val" stroke="#06d6a0" fill="#06d6a0" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel style={{ gridColumn: "1/-1" }}>
              <SectionHeader title="Reskilling Opportunities" subtitle="Training hours vs job demand — identify high-ROI reskilling paths" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10 }}>
                {[...filtered].sort((a, b) => (b.job_demand_index - a.training_hours_needed / 100) - (a.job_demand_index - b.training_hours_needed / 100)).slice(0, 10).map((d, i) => (
                  <div key={i} style={{ background: "rgba(6,214,160,0.05)", border: "1px solid rgba(6,214,160,0.2)", borderRadius: 8, padding: 12 }}>
                    <div style={{ fontWeight: 600, fontSize: 11, color: "#e2e8f0" }}>{d.job_role}</div>
                    <div style={{ fontSize: 9, color: "#64748b", marginBottom: 8 }}>{d.industry}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10 }}>
                      <div><span style={{ color: "#475569" }}>Demand: </span><span style={{ color: "#06d6a0" }}>{d.job_demand_index}/10</span></div>
                      <div><span style={{ color: "#475569" }}>Train: </span><span style={{ color: "#fbbf24" }}>{d.training_hours_needed}h</span></div>
                    </div>
                    <div style={{ marginTop: 6, fontSize: 10 }}><span style={{ color: "#475569" }}>Risk: </span><span style={{ color: RISK_COLOR(d.automation_risk_score) }}>{d.automation_risk_score}%</span></div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        )}

        {/* ── CORRELATION ── */}
        {activeTab === "correlation" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Panel style={{ gridColumn: "1/-1" }}>
              <SectionHeader title="Correlation Matrix" subtitle="Numeric variable relationships (−1 to +1)" />
              <div style={{ overflowX: "auto" }}>
                <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 10 }}>
                  <thead>
                    <tr>
                      <th style={{ width: 140, textAlign: "left", padding: "6px 8px", color: "#475569" }}></th>
                      {correlationVars.map(v => <th key={v} style={{ padding: "6px 4px", color: "#64748b", fontSize: 9, textTransform: "uppercase", letterSpacing: "0.05em", transform: "rotate(-35deg)", whiteSpace: "nowrap", height: 60 }}>{v.replace(/_/g," ")}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {correlationVars.map((v1, i) => (
                      <tr key={v1}>
                        <td style={{ padding: "4px 8px", color: "#64748b", fontSize: 9, textTransform: "uppercase", whiteSpace: "nowrap" }}>{v1.replace(/_/g," ")}</td>
                        {correlationMatrix[i]?.map((c, j) => {
                          const intensity = Math.abs(c);
                          const bg = c > 0 ? `rgba(56,189,248,${intensity * 0.8})` : `rgba(255,59,92,${intensity * 0.8})`;
                          return <td key={j} style={{ padding: "4px 6px", background: bg, textAlign: "center", borderRadius: 2, border: "1px solid rgba(0,0,0,0.3)", minWidth: 50 }}>
                            <span style={{ color: intensity > 0.5 ? "#fff" : "#94a3b8", fontWeight: intensity > 0.7 ? 700 : 400 }}>{fmt(c, 2)}</span>
                          </td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 10, display: "flex", gap: 16, fontSize: 10, color: "#64748b" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 12, height: 12, borderRadius: 2, background: "rgba(56,189,248,0.7)" }} /> Positive</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 12, height: 12, borderRadius: 2, background: "rgba(255,59,92,0.7)" }} /> Negative</div>
                <div>Stronger color = stronger correlation</div>
              </div>
            </Panel>

            <Panel>
              <SectionHeader title="Key Driver Analysis" subtitle="Top predictors of automation risk" />
              {[
                { name: "Task Repetition Level", corr: 0.91, dir: "+" },
                { name: "AI Tool Availability", corr: 0.85, dir: "+" },
                { name: "AI Tool Maturity", corr: 0.83, dir: "+" },
                { name: "Creativity Requirement", corr: -0.78, dir: "-" },
                { name: "Social Interaction", corr: -0.72, dir: "-" },
                { name: "Analytical Complexity", corr: -0.65, dir: "-" },
                { name: "Domain Knowledge", corr: -0.61, dir: "-" },
                { name: "Communication Need", corr: -0.58, dir: "-" },
              ].map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ flex: 1, fontSize: 11, color: "#94a3b8" }}>{d.name}</div>
                  <div style={{ width: 80, height: 4, borderRadius: 2, background: "rgba(51,65,85,0.4)", position: "relative" }}>
                    <div style={{
                      position: "absolute", height: "100%", borderRadius: 2,
                      background: d.dir === "+" ? "#ff3b5c" : "#06d6a0",
                      left: d.dir === "+" ? 0 : "auto", right: d.dir === "-" ? 0 : "auto",
                      width: `${Math.abs(d.corr) * 80}px`
                    }} />
                  </div>
                  <div style={{ width: 36, textAlign: "right", fontSize: 11, fontWeight: 700, color: d.dir === "+" ? "#ff3b5c" : "#06d6a0", fontFamily: "'Courier New',monospace" }}>{d.dir}{fmt(Math.abs(d.corr), 2)}</div>
                </div>
              ))}
            </Panel>

            <Panel>
              <SectionHeader title="Skill Complexity vs Salary" subtitle="Higher complexity → higher pay?" />
              <ResponsiveContainer width="100%" height={260}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(51,65,85,0.3)" />
                  <XAxis dataKey="x" name="Skill Complexity" domain={[0,10]} tick={{ fill: "#64748b", fontSize: 10 }} label={{ value: "Skill Complexity", fill: "#64748b", fontSize: 10, position: "insideBottom", offset: -4 }} />
                  <YAxis dataKey="y" name="Salary" tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                  <Tooltip content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload;
                    return <div style={{ background: "rgba(2,6,23,0.95)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: 8, padding: "10px 14px", fontSize: 11 }}>
                      <div style={{ color: "#38bdf8", fontWeight: 700 }}>{d?.name}</div>
                      <div style={{ color: "#94a3b8" }}>Complexity: {d?.x} | Salary: {fmtK(d?.y)}</div>
                    </div>;
                  }} />
                  <Scatter data={filtered.map(d => ({ x: d.skill_complexity_score, y: d.avg_salary_usd, name: d.job_role }))} fill="#818cf8">
                    {filtered.map((d, i) => <Cell key={i} fill={RISK_COLOR(d.automation_risk_score)} />)}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        )}

        {/* ── AI INSIGHTS ── */}
        {activeTab === "insights" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Panel style={{ gridColumn: "1/-1" }}>
              <SectionHeader title="AI Analyst Report Generator" subtitle="Powered by Claude — contextual workforce intelligence" />
              <button onClick={fetchInsight} disabled={loadingInsight} style={{
                background: loadingInsight ? "rgba(56,189,248,0.1)" : "linear-gradient(135deg,#0ea5e9,#6366f1)",
                border: "none", borderRadius: 8, color: "#fff", padding: "10px 24px",
                cursor: loadingInsight ? "default" : "pointer", fontSize: 12, fontFamily: "inherit",
                letterSpacing: "0.08em", fontWeight: 600, marginBottom: 16, opacity: loadingInsight ? 0.6 : 1
              }}>
                {loadingInsight ? "⚡ Generating Analysis…" : "⚡ Generate AI Analyst Report"}
              </button>
              {aiInsight && (
                <div style={{ background: "rgba(56,189,248,0.04)", border: "1px solid rgba(56,189,248,0.15)", borderRadius: 10, padding: 20, lineHeight: 1.8, fontSize: 13, color: "#cbd5e1", whiteSpace: "pre-wrap" }}>
                  {aiInsight}
                </div>
              )}
              {!aiInsight && !loadingInsight && (
                <div style={{ color: "#475569", fontSize: 12, fontStyle: "italic" }}>
                  Click the button above to generate a data-driven analyst report based on the current dataset and filters.
                </div>
              )}
            </Panel>

            <Panel>
              <SectionHeader title="Quick Stat Highlights" />
              {[
                { q: "Most at-risk industry?", a: industryRiskData[0]?.industry, detail: `Avg risk: ${fmt(industryRiskData[0]?.risk)}%`, color: "#ff3b5c" },
                { q: "Safest long-term role?", a: topResilientRoles[0]?.job_role, detail: `Risk: ${topResilientRoles[0]?.automation_risk_score}% · Growth: +${topResilientRoles[0]?.job_growth_rate}%`, color: "#06d6a0" },
                { q: "Highest future AI dep.?", a: [...filtered].sort((a,b)=>b.ai_dependency_future-a.ai_dependency_future)[0]?.job_role, detail: `Score: ${[...filtered].sort((a,b)=>b.ai_dependency_future-a.ai_dependency_future)[0]?.ai_dependency_future}/10`, color: "#818cf8" },
                { q: "Highest salary resilient role?", a: [...filtered].filter(d=>d.automation_risk_score<35).sort((a,b)=>b.avg_salary_usd-a.avg_salary_usd)[0]?.job_role, detail: fmtK([...filtered].filter(d=>d.automation_risk_score<35).sort((a,b)=>b.avg_salary_usd-a.avg_salary_usd)[0]?.avg_salary_usd||0), color: "#fbbf24" },
                { q: "Most training needed?", a: [...filtered].sort((a,b)=>b.training_hours_needed-a.training_hours_needed)[0]?.job_role, detail: `${[...filtered].sort((a,b)=>b.training_hours_needed-a.training_hours_needed)[0]?.training_hours_needed} hours`, color: "#fb923c" },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: 12, padding: 12, background: "rgba(30,41,59,0.4)", borderRadius: 8, borderLeft: `3px solid ${item.color}` }}>
                  <div style={{ fontSize: 10, color: "#64748b", marginBottom: 2 }}>{item.q}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.a}</div>
                  <div style={{ fontSize: 10, color: "#475569" }}>{item.detail}</div>
                </div>
              ))}
            </Panel>

            <Panel>
              <SectionHeader title="Forecast Timeline" subtitle="Projected avg risk under 3 scenarios (5-year horizon)" />
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={[
                  { year: "2024", best: fmt(scenarios.best * 0.9), moderate: fmt(scenarios.moderate * 0.85), aggressive: fmt(scenarios.aggressive * 0.75) },
                  { year: "2025", best: fmt(scenarios.best * 0.95), moderate: fmt(scenarios.moderate * 0.92), aggressive: fmt(scenarios.aggressive * 0.88) },
                  { year: "2026", best: fmt(scenarios.best), moderate: fmt(scenarios.moderate), aggressive: fmt(scenarios.aggressive) },
                  { year: "2027", best: fmt(scenarios.best * 1.05), moderate: fmt(scenarios.moderate * 1.1), aggressive: fmt(scenarios.aggressive * 1.2) },
                  { year: "2028", best: fmt(scenarios.best * 1.08), moderate: fmt(scenarios.moderate * 1.2), aggressive: fmt(scenarios.aggressive * 1.38) },
                  { year: "2029", best: fmt(scenarios.best * 1.1), moderate: fmt(scenarios.moderate * 1.28), aggressive: fmt(scenarios.aggressive * 1.52) },
                ]}>
                  <CartesianGrid strokeDasharray="2 4" stroke="rgba(51,65,85,0.3)" />
                  <XAxis dataKey="year" tick={{ fill: "#64748b", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="best" stroke="#06d6a0" strokeWidth={2} dot={false} name="Best Case" />
                  <Line type="monotone" dataKey="moderate" stroke="#fbbf24" strokeWidth={2} dot={false} name="Moderate" />
                  <Line type="monotone" dataKey="aggressive" stroke="#ff3b5c" strokeWidth={2} dot={false} name="Aggressive AI" />
                </LineChart>
              </ResponsiveContainer>
            </Panel>
          </div>
        )}

      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid rgba(51,65,85,0.4)", padding: "10px 24px", display: "flex", justifyContent: "space-between", fontSize: 10, color: "#334155", marginTop: 24 }}>
        <div>WORKFORCE RISK INTELLIGENCE SYSTEM · v2.4.1</div>
        <div>⚡ Powered by Claude AI · {filtered.length} roles loaded · Last sync: {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
}
