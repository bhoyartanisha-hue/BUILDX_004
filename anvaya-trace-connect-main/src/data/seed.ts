import type { Asset, Cluster, Complaint, RoadSegment } from "./types";

const timeline = (resolved = false) => [
  { status: "received" as const, at: "18 Sep 2026 · 08:42", department: "NMC Command Centre", detail: "Report received and location validated.", complete: true },
  { status: "classified" as const, at: "18 Sep 2026 · 08:44", department: "Automated triage", detail: "Water leakage · high urgency · severity 86.", complete: true },
  { status: "routed" as const, at: "18 Sep 2026 · 09:10", department: "Water Works", detail: "Routed to Dharampeth zone engineer.", complete: true },
  { status: "assigned" as const, at: "18 Sep 2026 · 10:25", department: "Water Works", detail: "Assigned to Orange City Civil Works.", complete: true },
  { status: "progress" as const, at: "19 Sep 2026 · 07:30", department: "Field team", detail: "Valve isolated; damaged joint being replaced.", complete: true },
  { status: "resolved" as const, at: resolved ? "20 Sep 2026 · 16:05" : "Awaiting field verification", department: "Quality inspection", detail: resolved ? "Pressure restored and road surface reinstated." : "Resolution evidence pending.", complete: resolved },
];

export const complaints: Complaint[] = [
  { id:"ANV-NGP-260918-1047", title:"Major pipeline leak near Shankar Nagar", description:"Water is flowing continuously from below the road near the metro pillar and the surface is sinking.", language:"en", category:"Water leakage", department:"Water Works", urgency:"Immediate", severity:92, severityBand:"critical", status:"progress", zone:"Dharampeth", ward:"Ward 15", location:[21.1322,79.0587], createdAt:"18 Sep 2026", source:"Mobile web", contractor:"Orange City Civil Works", verified:true, clusterId:"CL-014", roadSegmentId:"RD-104", timeline:timeline(false) },
  { id:"ANV-NGP-260917-0981", title:"खड्ड्यामुळे वाहतूक धोकादायक", description:"रामदासपेठ येथे मोठा खड्डा आहे. पावसात दिसत नाही.", language:"mr", category:"Pothole", department:"Public Works", urgency:"High", severity:84, severityBand:"critical", status:"assigned", zone:"Dharampeth", ward:"Ward 16", location:[21.1371,79.0712], createdAt:"17 Sep 2026", source:"Ward kiosk", contractor:"BuildRight Infra", verified:false, clusterId:"CL-009", roadSegmentId:"RD-221", timeline:timeline(false) },
  { id:"ANV-NGP-260916-0914", title:"Streetlight circuit failure", description:"Seven streetlights are dark along Central Avenue from Gandhi Putla square.", language:"en", category:"Streetlight", department:"Electrical", urgency:"High", severity:71, severityBand:"medium", status:"progress", zone:"Gandhibagh", ward:"Ward 19", location:[21.1516,79.1064], createdAt:"16 Sep 2026", source:"Call centre", contractor:"Vidarbha Electricals", verified:true, clusterId:"CL-021", timeline:timeline(false) },
  { id:"ANV-NGP-260913-0762", title:"सीवर चेंबर ओवरफ्लो", description:"मानेवाड़ा रोड पर चेंबर से गंदा पानी बह रहा है।", language:"hi", category:"Sewer overflow", department:"Sewerage", urgency:"Immediate", severity:88, severityBand:"critical", status:"resolved", zone:"Hanuman Nagar", ward:"Ward 34", location:[21.1017,79.0981], createdAt:"13 Sep 2026", source:"WhatsApp", contractor:"CleanFlow Services", verified:true, clusterId:"CL-032", roadSegmentId:"RD-318", timeline:timeline(true) },
  { id:"ANV-NGP-260910-0633", title:"Low water pressure", description:"Low pressure every morning across three lanes in Laxmi Nagar.", language:"en", category:"Water supply", department:"Water Works", urgency:"Routine", severity:46, severityBand:"medium", status:"resolved", zone:"Laxmi Nagar", ward:"Ward 37", location:[21.1168,79.0611], createdAt:"10 Sep 2026", source:"Mobile web", contractor:"Orange City Civil Works", verified:true, clusterId:"CL-014", timeline:timeline(true) },
];

export const clusters: Cluster[] = [
  { id:"CL-014", name:"West trunk pressure loss", count:7, category:"Water network", zone:"Dharampeth", location:[21.127,79.061], severity:"critical" },
  { id:"CL-009", name:"Ramdas Peth surface failure", count:5, category:"Road surface", zone:"Dharampeth", location:[21.139,79.073], severity:"medium" },
  { id:"CL-021", name:"Central Avenue lighting circuit", count:9, category:"Electrical", zone:"Gandhibagh", location:[21.151,79.104], severity:"medium" },
  { id:"CL-032", name:"Manewada sewer surcharge", count:4, category:"Sewerage", zone:"Hanuman Nagar", location:[21.103,79.096], severity:"resolved" },
];

export const roadSegments: RoadSegment[] = [
  { id:"RD-104", name:"Shankar Nagar Main Road · 0.8 km", zone:"Dharampeth", healthScore:42, location:[21.1322,79.0587], expenditure:1840000, prediction:"High likelihood of surface settlement within 45 days. Coordinate pipe-joint replacement before resurfacing.", repairs:[{date:"Jun 2026",work:"Emergency trench reinstatement",cost:420000,contractor:"BuildRight Infra"},{date:"Nov 2025",work:"150 mm valve replacement",cost:680000,contractor:"Orange City Civil Works"},{date:"Aug 2024",work:"Monsoon patch repair",cost:210000,contractor:"BuildRight Infra"}]},
  { id:"RD-221", name:"Ramdas Peth Canal Road · 1.2 km", zone:"Dharampeth", healthScore:58, location:[21.1371,79.0712], expenditure:1270000, prediction:"Moderate pothole recurrence risk after heavy rainfall. Inspect drainage crossfall within 30 days.", repairs:[{date:"Jul 2026",work:"Pothole patching",cost:270000,contractor:"BuildRight Infra"},{date:"Jan 2025",work:"Drain edge repair",cost:390000,contractor:"CivicBuild Co."}]},
  { id:"RD-318", name:"Manewada Ring Road · 1.6 km", zone:"Hanuman Nagar", healthScore:76, location:[21.1017,79.0981], expenditure:930000, prediction:"Stable after sewer chamber rehabilitation. Reinspect before the 2027 monsoon.", repairs:[{date:"Sep 2026",work:"Chamber rehabilitation",cost:510000,contractor:"CleanFlow Services"},{date:"May 2025",work:"Surface renewal",cost:420000,contractor:"CivicBuild Co."}]},
];

export const assets: Asset[] = [
  { id:"SL-DH-00418", type:"LED streetlight · 90W", zone:"Dharampeth", installed:"12 Mar 2019", expires:"12 Mar 2026", status:"overdue" },
  { id:"WR-GB-00172", type:"11kV aerial wire · 85m", zone:"Gandhibagh", installed:"08 Jul 2017", expires:"08 Jul 2027", status:"due" },
  { id:"SL-HN-00904", type:"LED streetlight · 60W", zone:"Hanuman Nagar", installed:"21 Jan 2023", expires:"21 Jan 2030", status:"active" },
  { id:"WR-LN-00211", type:"LT underground cable · 120m", zone:"Laxmi Nagar", installed:"03 Sep 2014", expires:"03 Sep 2024", status:"overdue" },
  { id:"SL-GB-00677", type:"High-mast luminaire", zone:"Gandhibagh", installed:"18 Nov 2021", expires:"18 Nov 2028", status:"active" },
];

export const utilityGeoJson = {
  type:"FeatureCollection" as const,
  features:[
    { type:"Feature" as const, properties:{kind:"trunk",name:"Penchar–Dharampeth 600 mm trunk"}, geometry:{type:"LineString" as const,coordinates:[[79.043,21.143],[79.052,21.137],[79.061,21.129],[79.072,21.121]]}},
    { type:"Feature" as const, properties:{kind:"connection",name:"Shankar Nagar distribution branch"}, geometry:{type:"LineString" as const,coordinates:[[79.052,21.137],[79.0587,21.1322],[79.067,21.134]]}},
    { type:"Feature" as const, properties:{kind:"connection",name:"Ramdas Peth distribution branch"}, geometry:{type:"LineString" as const,coordinates:[[79.061,21.129],[79.0712,21.1371],[79.081,21.141]]}},
    ...[[79.052,21.137],[79.061,21.129],[79.0712,21.1371],[79.0981,21.1017]].map((coordinates,index)=>({type:"Feature" as const,properties:{kind:"chamber",name:`Inspection chamber C-${index+11}`},geometry:{type:"Point" as const,coordinates}})),
  ]
};
