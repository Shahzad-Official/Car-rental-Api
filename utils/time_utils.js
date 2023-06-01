function daysToMilliseconds(days) {
    // 👇️        hour  min  sec  ms
    return days * 24 * 60 * 60 * 1000;
  };

 function isEmptyObject(obj){
  
    return (Object.keys(obj).length === 0||Object.values(obj)[0]==="");
  };

  module.exports={
    daysToMilliseconds,
    isEmptyObject,
  }