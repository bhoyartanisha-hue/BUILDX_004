import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { clusters, roadSegments, utilityGeoJson } from "@/data/seed";
import { Link } from "@tanstack/react-router";

const marker=(className:string,label:string)=>L.divIcon({className:"",html:`<span class="map-marker ${className}" aria-label="${label}"></span>`,iconSize:[22,22],iconAnchor:[11,11]});
export default function InfrastructureMap({official=false}:{official?:boolean}){
  return <MapContainer center={[21.132,79.079]} zoom={13} scrollWheelZoom className="h-[480px] w-full" aria-label="Nagpur civic infrastructure map">
    <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
    <GeoJSON data={utilityGeoJson} pointToLayer={(feature,latlng)=>L.marker(latlng,{icon:marker("marker-chamber",String(feature.properties?.name??"Infrastructure chamber"))})} style={feature=>({color:feature?.properties.kind==="trunk"?"#C1443A":feature?.properties.kind==="connection"?"#D9A441":"#2E8B8B",weight:feature?.properties.kind==="trunk"?6:3,dashArray:"10 8",className:"pipeline-flow"})} onEachFeature={(feature,layer)=>layer.bindPopup(`<strong>${feature.properties.name}</strong><br/>${feature.properties.kind}`)}/>
    {clusters.map(cluster=><Marker key={cluster.id} position={cluster.location} icon={marker(cluster.severity==="critical"?"marker-critical":cluster.severity==="resolved"?"marker-resolved":"marker-medium",`${cluster.name}, ${cluster.count} reports`)}><Popup><strong>{cluster.name}</strong><br/>{cluster.count} linked reports · {cluster.zone}</Popup></Marker>)}
    {roadSegments.map(segment=><Marker key={segment.id} position={segment.location} icon={marker("marker-road",`${segment.name}, health ${segment.healthScore}`)}><Popup><strong>{segment.name}</strong><br/>Health score {segment.healthScore}/100<br/><Link to="/roads/$roadId" params={{roadId:segment.id}} className="font-semibold text-chamber-dark">Open connected record</Link></Popup></Marker>)}
    {official&&clusters.map(cluster=><GeoJSON key={`zone-${cluster.id}`} data={{type:"Feature",properties:{},geometry:{type:"Point",coordinates:[cluster.location[1],cluster.location[0]]}}}/>) }
  </MapContainer>
}
