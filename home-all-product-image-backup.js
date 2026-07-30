// home-all-product-image-backup.js V24 MASTER - All Home + Upcoming + Past Present Image WITH URL Download - OLD CODE SAVE WITH
/*
⚠️ OLD CODE BACKUP - backup.js 4-jagah - SAFE - DNA - DELETE NAHI
function backupAllProducts(products){ localStorage.setItem('santram_products_v1', JSON.stringify(products)); }
OLD BACKUP END
*/
console.log("✅ home-all-product-image-backup.js V24 MASTER - Home + Upcoming + Past Present WITH URL Download");

window.SANTRA_MASTER_KEY = 'santra_master_all_products_with_images_v24';
window.SANTRA_MASTER_KEYS = ['santra_master_all_products_with_images_v24','santram_products_v1','santram_products_backup','santra_6way_backup','santra_all_products_cache','allProductsCache','allProducts'];

window.isValidHttpImage=window.isValidHttpImage||function(u){ if(!u||typeof u!=='string') return false; let s=u.trim(); if(s==""||s=="N/A") return false; if(s.startsWith('blob:')) return false; if(s.includes('[object Object]')) return false; return s.startsWith('http'); };

window.getBestImageAny = function(p){
  if(!p) return "";
  let keys=['image','imageUrl','httpsUrl','thumbnail','photo','img','productImage','mainImage','imgbb','cloudinary','lux','imageURL'];
  for(let k of keys){ if(p[k]&&window.isValidHttpImage(p[k])) return p[k].trim(); }
  if(p.httpsUrls&&p.httpsUrls[0]&&window.isValidHttpImage(p.httpsUrls[0])) return p.httpsUrls[0];
  if(p.images&&p.images[0]){ let u=typeof p.images[0]==='string'?p.images[0]:p.images[0].url; if(window.isValidHttpImage(u)) return u; }
  return "";
};

// MASTER DOWNLOAD - All Home page product + upcoming image + past present + Firestore + RTDB
window.downloadAllHomeProducts = async function(){
  try{
    let allMap = {}; // id -> product with best image

    // 1. Local 10 jagah se - Past Present
    ["santram_products_v1","santram_products_backup","santra_6way_backup","sm","santra_all_products_cache","allProductsCache","santra_all_products","allProducts","santra_products","products_temp","santra_master_all_products_with_images_v24"].forEach(function(k){
      try{
        let v=localStorage.getItem(k)||sessionStorage.getItem(k);
        if(!v) return;
        let arr=JSON.parse(v);
        if(!Array.isArray(arr)) arr=Object.values(arr);
        arr.forEach(function(p){
          if(!p||!(p.id||p.code)) return;
          let id=(p.id||p.code).toString().trim().toLowerCase().split('_')[0].split('-')[0];
          if(!id) return;
          let best=window.getBestImageAny(p);
          if(!best) return;
          if(!allMap[id]||!window.isValidHttpImage(allMap[id].image)) allMap[id]={...p, id:id, image:best, imageUrl:best, httpsUrl:best, masterImage:best, imageWithUrl:best};
        });
      }catch(e){}
    });

    // 2. window.allProducts - Home page ke live products
    if(window.allProducts&&Array.isArray(window.allProducts)){
      window.allProducts.forEach(function(p){
        let id=(p.id||"").toString().trim().toLowerCase().split('_')[0].split('-')[0];
        let best=window.getBestImageAny(p);
        if(id&&best){ allMap[id]={...p, id:id, image:best, imageUrl:best, httpsUrl:best, masterImage:best, imageWithUrl:best}; }
      });
    }

    // 3. Firestore - products + all_products_backup + product_images_backup + upcoming_products
    if(window.db){
      let collections=['products','all_products_backup','product_images_backup','upcoming_products','home_products'];
      for(let col of collections){
        try{
          let snap=await window.db.collection(col).limit(500).get();
          snap.forEach(function(doc){
            let p=doc.data(); if(!p) return;
            let id=(p.id||doc.id||"").toString().trim().toLowerCase().split('_')[0].split('-')[0];
            let best=window.getBestImageAny(p);
            if(id&&best&&!allMap[id]) allMap[id]={...p, id:id, image:best, imageUrl:best, httpsUrl:best, masterImage:best, imageWithUrl:best, source:col};
            if(id&&best&&allMap[id]&&!window.isValidHttpImage(allMap[id].image)) allMap[id].image=best;
          });
        }catch(e){}
      }
    }

    // 4. RTDB - products
    if(window.rtdb){
      try{
        let snap=await window.rtdb.ref('products').limitToLast(500).once('value');
        if(snap.exists()){
          let val=snap.val();
          Object.values(val).forEach(function(p){
            let id=(p.id||"").toString().trim().toLowerCase().split('_')[0].split('-')[0];
            let best=window.getBestImageAny(p);
            if(id&&best&&!allMap[id]) allMap[id]={...p, id:id, image:best, imageUrl:best, masterImage:best};
          });
        }
      }catch(e){}
    }

    let finalArray=Object.values(allMap);
    // Ek file me save - MASTER FILE - Image WITH URL
    let masterData=JSON.stringify(finalArray);
    window.SANTRA_MASTER_KEYS.forEach(function(k){ try{ localStorage.setItem(k, masterData); }catch(e){} try{ sessionStorage.setItem(k, masterData); }catch(e){} });
    localStorage.setItem(window.SANTRA_MASTER_KEY, masterData);

    console.log("✅ MASTER DOWNLOAD - Home + Upcoming + Past Present = "+finalArray.length+" products WITH URL saved in ONE FILE - "+window.SANTRA_MASTER_KEY);

    // Auto download JSON file - ek hi file banegi
    try{
      if(location.href.includes('admin')||location.href.includes('home')||document.getElementById('downloadMasterBtn')){
        // sirf admin me auto download
        if(location.href.includes('admin')){
          let blob=new Blob([masterData],{type:'application/json'});
          let a=document.createElement('a');
          a.href=URL.createObjectURL(blob);
          a.download='santra_MASTER_all_products_with_images_'+new Date().toISOString().slice(0,10)+'.json';
          a.click();
        }
      }
    }catch(e){}

    return finalArray;
  }catch(err){ console.error("MASTER DOWNLOAD ERROR", err); return []; }
};

// Add to Cart ke liye Preview Image - Image With URL se save hoga
window.getMasterPreviewImage = function(productId, productName){
  if(!productId&&!productName) return "";
  let id=(productId||"").toString().trim().toLowerCase().split('_')[0].split('-')[0];
  let name=(productName||"").toLowerCase().split(' ')[0];
  try{
    for(let key of window.SANTRA_MASTER_KEYS){
      let v=localStorage.getItem(key)||sessionStorage.getItem(key);
      if(!v) continue;
      let arr=JSON.parse(v);
      let fd=arr.find(function(x){ return (x.id||"").toString().trim().toLowerCase().split('_')[0].split('-')[0]===id; });
      if(!fd&&name) fd=arr.find(function(x){ return String(x.name||"").toLowerCase().includes(name); });
      if(fd){
        let best=window.getBestImageAny(fd)||fd.masterImage||fd.imageWithUrl||"";
        if(window.isValidHttpImage(best)) return best;
      }
    }
  }catch(e){}
  return "";
};

// Auto run - Home page + Cart page dono me
document.addEventListener('DOMContentLoaded', function(){
  setTimeout(function(){ window.downloadAllHomeProducts(); }, 3000);
  setTimeout(function(){ window.downloadAllHomeProducts(); }, 8000);
});

console.log("home-all-product-image-backup.js V24 MASTER - LAST LINE OK - Ek file me Image WITH URL Download");