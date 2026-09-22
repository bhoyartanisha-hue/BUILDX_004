import type { Complaint } from "@/data/types";
// Local TF-IDF keeps the demo-critical duplicate warning available without a network dependency.
const tokens=(text:string)=>text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu," ").split(/\s+/).filter(word=>word.length>2);
export function findSimilarComplaints(input:string,items:Complaint[],limit=3){
  const documents=[input,...items.map(item=>`${item.title} ${item.description} ${item.category}`)].map(tokens);
  const vocabulary=[...new Set(documents.flat())];
  const vectors=documents.map(words=>vocabulary.map(term=>{const tf=words.filter(word=>word===term).length/Math.max(words.length,1);const df=documents.filter(doc=>doc.includes(term)).length;return tf*Math.log((documents.length+1)/(df+1));}));
  const cosine=(a:number[],b:number[])=>{const dot=a.reduce((sum,value,index)=>sum+value*(b[index]??0),0);const norm=(v:number[])=>Math.sqrt(v.reduce((sum,value)=>sum+value*value,0));return dot/(norm(a)*norm(b)||1)};
  return items.map((item,index)=>({item,score:cosine(vectors[0]??[],vectors[index+1]??[])})).filter(match=>match.score>.03).sort((a,b)=>b.score-a.score).slice(0,limit);
}
