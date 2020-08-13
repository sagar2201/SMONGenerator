function PPTGenerator(){return{oResultSet:{},iDateIndex:0,iTimeIndex:0,iAppServerIndex:0,iMeasuresIndex:0,aDataSet:[],init:function(){this.oResultSet={},this.iDateIndex=0,this.iTimeIndex=0,this.iAppServerIndex=0,this.iMeasuresIndex=0,this.aDataSet=[]},setDataPayload:function(){let e=document.querySelector("#dataSet").value;if(""===e.trim())throw new Error("- No input -");this.aDataSet=e.split(/\r\n|\n|\r/)},setMeasuresIndex:function(){for(this.iMeasuresIndex=0;this.iMeasuresIndex<this.aDataSet.length&&-1===this.aDataSet[this.iMeasuresIndex].indexOf("AS Instance")&&-1===this.aDataSet[this.iMeasuresIndex].indexOf("Server Name");this.iMeasuresIndex++);if(this.iMeasuresIndex===this.aDataSet.length)throw new Error("- Invalid input; no AS Instance or Server Name found in dataset -")},buildEmptyResultSet:function(){const e=this.aDataSet[this.iMeasuresIndex].split("|").map(e=>e.trim());if(e.length<3)throw new Error("- Invalid input; Measures parsing failed - ");for(let t=0;t<e.length;t++){const s=e[t];s&&""!==s&&("date"==s.toLowerCase()&&0===this.iDateIndex?this.iDateIndex=t:"time"==s.toLowerCase()&&0===this.iTimeIndex?this.iTimeIndex=t:"as instance"==s.toLowerCase()&&0===this.iAppServerIndex?this.iAppServerIndex=t:"server name"==s.toLowerCase()&&0===this.iAppServerIndex?this.iAppServerIndex=t:this.oResultSet[s]?this.oResultSet[s+"-1"]={index:t}:this.oResultSet[s]={index:t})}if(0===this.iTimeIndex||0===this.iAppServerIndex)throw new Error("- Cannot find index for Time or App Server in DataSet -")},fillResultSet:function(){let e,t=Object.keys(this.oResultSet);if(this.iMeasuresIndex+2>this.aDataSet.length)throw new Error("- No lines after the measures -");for(let s=this.iMeasuresIndex+2;s<this.aDataSet.length;s++)if(!((e=this.aDataSet[s].split("|")).length<2)&&"Global Data"!==e[this.iAppServerIndex].trim())for(let s=0;s<t.length;s++){let i=this.oResultSet[t[s]];i[e[this.iAppServerIndex]]||(i[e[this.iAppServerIndex]]={TimeStamps:[],Values:[]});let n=i[e[this.iAppServerIndex]];if(n.TimeStamps.push(e[this.iTimeIndex]),sCurrentLineValue=e[i.index],sCurrentLineValue=parseInt(sCurrentLineValue.replace(/,/g,"").replace(/\./g,"")),isNaN(sCurrentLineValue))throw new Error("Encountred a value that is not a number");n.Values.push(sCurrentLineValue)}},processDataSet:function(){this.init(),this.updateButton("Validating Input...",!0),this.setDataPayload(),this.setMeasuresIndex(),this.buildEmptyResultSet(),this.fillResultSet()},beginProcessing:function(){try{this.processDataSet(),this.buildPPT()}catch(e){throw this.updateButton("Generate Report",!1),this.updateInformationProvider(e),e}},buildPPT:function(){let e=new PptxGenJS,t=Object.keys(this.oResultSet);-1!==t.indexOf("Sessions")&&(t=t.filter(e=>"Sessions"!==e),t=["Sessions",...t]),-1!==t.indexOf("Logins")&&(t=t.filter(e=>"Logins"!==e),t=["Logins",...t]);for(let i=0;i<t.length;i++){let n,r=this.oResultSet[t[i]];if(!r.index)continue;let a=e.addSlide();a.addText(this.getFriendlyText(t[i]),{x:.5,y:.7,w:8,fontSize:24}),a.addText("--- Add Analysis Here ---",{x:.5,y:4.25,w:8,h:.5,isTextBox:!0,line:{pt:"2",color:"A9A9A9"},fontSize:20});let o=Object.keys(r),u=[];for(let e=0;e<o.length;e++){let t=o[e],s=r[t];if(s.TimeStamps&&s.Values){const e=s.TimeStamps[0],i=s.TimeStamps[s.TimeStamps.length-1];if(3!==e.split(":").length||3!==i.split(":").length)throw new Error("Calculated timestamps are invalid!");const r=new Date,a=new Date;r.setHours(e.split(":")[0]),r.setMinutes(e.split(":")[1]),r.setSeconds(e.split(":")[2]),a.setHours(i.split(":")[0]),a.setMinutes(i.split(":")[1]),a.setSeconds(i.split(":")[2]),r>a&&(s.TimeStamps.reverse(),s.Values.reverse());let o=Math.min(...s.Values);(!n||o<n)&&(n=o),u.push({name:t,labels:s.TimeStamps,values:s.Values})}}var s={x:.5,y:1,w:8,h:3,lineSize:1,lineDataSymbol:"none",lineSmooth:!0,showLegend:!0,legendPos:"r",catGridLine:{color:"D8D8D8",style:"none",size:1},valGridLine:{color:"D8D8D8",style:"dash",size:1}};n<10&&(s.valAxisMinVal=0),a.addChart(e.ChartType.line,u,s)}this.updateButton("Generating file...",!0);var i=this;e.writeFile("SDF SMON Report").then(function(e){i.updateButton("Generate Report",!1),i.updateInformationProvider("Saved! File Name: "+e,!0)})},updateButton:function(e,t){let s=document.querySelector("#reportGenerateButton");s.textContent=e,s.disabled=t},updateInformationProvider:function(e,t){document.querySelector("#successMessageHolder").innerText=e,t&&setTimeout(function(){document.querySelector("#successMessageHolder").innerText=""},4e3)},getFriendlyText:function(e){switch(e){case"Act. WPs":return"Number of Active Work Processes";case"Dia.WPs":return"Number of Active Dialog Work Processes";case"RFC WPs":return"Number of available WPs for RFCs";case"CPU Usr":return"CPU Utilization (User)";case"CPU Sys":return"CPU Utilization (System)";case"CPU Idle":return"CPU Utilization (Idle)";case"CPU.":return"CPUs Consumed";case"Ava.":return"Available CPUs";case"Rea.":return"Ready Time in %";case"Ste.":return"Steal Time in Seconds";case"Paging in":return"Paging in (% of RAM per hour)";case"Paging out":return"Paging out  (% of RAM per hour)";case"Free Mem.":return"Free Memory in % of RAM";case"FreeMem":return"Free Memory (MB)";case"Free(+FS)":return"Free Memory MB (incl. Filesystem Cache)";case"EM alloc.":return"Allocated Extended Memory in MB";case"EM attach.":return"Attached Extended Memory in MB";case"Heap Memor":return"Heap Memory in MB";case"Pri.":return"Priv Modes";case"Dia.":return"Dialog Queue Length";case"Ave.":return"Average Load last 20s";case"Ave.-1":return"Average Load last 60s";case"Upd.":return"Update Queue Length";case"Enq.":return"Enqueue Queue Length";case"Logins":return"Number of logins";case"Sessions":return"Number of sessions";case"Em global":return"Extended Memory Global";default:return e}}}}