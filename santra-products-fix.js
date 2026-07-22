// SANTRA MALL - ONE LINE FIX - Past Present Future
(function(){
  const BACKUP = [
    {productCode:"1QKtQOMjANBjpy9Dp4VB",name:"Frock",price:450,image:""},
    {productCode:"D4UgWRNLagZMMsTSZeIM",name:"Blue Denim Jeans",price:1499,image:"https://via.placeholder.com/300x300"},
    {productCode:"MNJoFdR0G7fMHwdkV0P6",name:"Lux soap",price:150,image:""},
    {productCode:"Q2v160asfdFWllanFe5A",name:"Gallery",price:600,image:""},
    {productCode:"T5gCcmOBNkCKQVYlvSnm",name:"Frock below 14 year age",price:450,image:""},
    {productCode:"cuPi3WhNupWuDnRglvyA",name:"Frock",price:300,image:"https://res.cloudinary.com/deiwof8v5/image/upload/v1783343815/santra-mall/products/phyftrgav193qtlezoju.jpg"},
    {productCode:"ezs0l2i9OBPRjCQOolaL",name:"Fashion",price:999,image:""},
    {productCode:"fCawrEJjpEoRkB0M5Ztu",name:"Frock",price:450,image:""},
    {productCode:"oZYr3yMAMzV4ZzKelTrE",name:"Frocks",price:500,image:""},
    {productCode:"uPjvg1QpZpCze8hRxlcG",name:"Combo soap",price:450,image:""}
  ];

  function isBroken(img){
    return!img || img=="" || img.startsWith("blob:") || img.includes("placeholder");
  }

  function fixProducts(){
    document.querySelectorAll('.product,.product-card, [class*="product"]').forEach(card=>{
      let imgEl = card.querySelector('img');
      if(!imgEl) return;
      let src = imgEl.getAttribute('src') || "";
      if(isBroken(src)){
        let code = imgEl.getAttribute('data-code') || "";
        let backup = BACKUP.find(b => b.productCode === code);
        if(backup && backup.image && backup.image.startsWith("http")){
          imgEl.src = backup.image;
        } else {
          if(!imgEl.src.includes("No+Photo")){
            imgEl.src = "https://via.placeholder.com/300x300?text=No+Photo+Available";
          }
        }
      }
    });
    // Double rokne ka logic
    let seen = {};
    document.querySelectorAll('.product,.product-card').forEach(c=>{
      let code = c.querySelector('img')?.getAttribute('data-code') || c.innerText.substring(0,25);
      if(seen[code]){ c.style.display='none'; }
      else seen[code]=true;
    });
  }

  window.addEventListener('load', ()=>{
    setTimeout(fixProducts, 1000);
    setInterval(fixProducts, 2000);
  });
})();