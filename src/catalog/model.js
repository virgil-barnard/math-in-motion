/* Pure catalog policy. Relationships are suggestions, never access locks. */
const CatalogModel = (() => {
  function ordered(catalog){
    const output=[],seen=new Set();
    function visit(item){if(seen.has(item.id))return;seen.add(item.id);for(const id of item.builds_on)visit(catalog.find(x=>x.id===id));output.push(item);}
    for(const item of [...catalog].sort((a,b)=>a.order-b.order||a.id.localeCompare(b.id)))visit(item);
    return output;
  }
  function layout(catalog,page,width){
    const entries=ordered(catalog).slice(page*9,page*9+9),ids=new Set(entries.map(x=>x.id)),depth=new Map(),rows=[],columns=width<360?2:3;
    for(const item of entries){let d=Math.max(-1,...item.builds_on.filter(id=>ids.has(id)).map(id=>depth.get(id)??0))+1;while((rows[d]?.length||0)>=columns)d++;(rows[d]??=[]).push(item);depth.set(item.id,d);}
    const nodes=[];rows.forEach((row,d)=>row.forEach((item,i)=>nodes.push({id:item.id,x:width*(i+1)/(row.length+1),y:66+d*114})));
    const height=Math.max(320,132+(rows.length-1)*114),byId=new Map(nodes.map(n=>[n.id,n])),edges=[];
    for(const item of entries){for(const from of item.builds_on)if(ids.has(from))edges.push({from,to:item.id,type:'builds_on'});for(const other of item.related)if(ids.has(other)&&item.id<other)edges.push({from:item.id,to:other,type:'related'});}
    return{nodes,edges,height,byId,pages:Math.ceil(catalog.length/9)};
  }
  return{ordered,layout};
})();
if(typeof module!=='undefined')module.exports=CatalogModel;
