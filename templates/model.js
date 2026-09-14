/* Replace this seed movement with the lesson's exact mathematical model. */
const LessonModel = {
  create:()=>({version:1,progress:0}),
  restore:v=>v?.version===1&&Number.isFinite(v.progress)&&v.progress>=0&&v.progress<=1?{version:1,progress:v.progress}:{version:1,progress:0}
};
if(typeof module!=='undefined')module.exports=LessonModel;
