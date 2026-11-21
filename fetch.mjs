import fs from 'node:fs';
const URL='https://www.easeinfra.com/live-steel-prices-in-ahmedabad';
const file='data/rates.json';
const db=JSON.parse(fs.readFileSync(file,'utf8'));
db.last_checked=new Date().toISOString();
try{
 const response=await fetch(URL,{headers:{'User-Agent':'Mozilla/5.0 (compatible; SteelRateMonitor/1.0)','Accept':'text/html'},signal:AbortSignal.timeout(25000)});
 if(!response.ok)throw Error('HTTP '+response.status);
 const html=await response.text();
 const text=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ');
 // Strict extraction: only Ahmedabad-specific rows and explicit MT prices. Avoid accidental mismatches.
 const regex=/(MS Channel|MS Angle|MS Beam|HR Coil|CR Coil|MS Pipe)\s+Ahmedabad\s+(.{3,110}?)\s+₹\s*([\d,]+)\s*\/\s*MT/gi;
 let match,found=[];
 while((match=regex.exec(text))!==null){let [_,name,size,p]=match;let mt=Number(p.replace(/,/g,''));if(mt<10000||mt>250000)continue;let category={'MS Channel':'C Channel','MS Angle':'MS Angle','MS Pipe':'MS Pipe'}[name];if(!category)continue;found.push({collected_at:db.last_checked,category,size:size.trim().slice(0,100),price_kg:mt/1000,source_date:null,source_url:URL});}
 // Some website formats put Ahmedabad after grade. No guesswork: leave unavailable instead.
 const unique=new Map(found.map(r=>[r.category+'|'+r.size,r]));found=[...unique.values()];
 if(!found.length)throw Error('No matching verified Ahmedabad rows in HTML; site layout or dynamic rendering may differ');
 for(let r of found){let prev=db.records.filter(x=>x.category===r.category&&x.size===r.size).at(-1);if(!prev||prev.price_kg!==r.price_kg)db.records.push(r)}
 db.last_status=`Fetched ${found.length} rates; ${db.records.length} stored observations`;
}catch(e){db.last_status='Fetch failed: '+e.message;console.error(db.last_status)}
fs.writeFileSync(file,JSON.stringify(db,null,2)+'\n');
