export const serializeJSON = function (data) {
  return Object.keys(data).map(function (keyName) {
    return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
  }).join('&');
}
export const getWeekNumber = function(){
  Date.prototype.getWeekOfMonth = function() {
    var firstWeekday = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
    var offsetDate = this.getDate() + firstWeekday - 1;
    return Math.floor(offsetDate / 7);
  }
  const d = new Date();
  return d.getWeekOfMonth();
}
export const str_pad  = function(pad, str, padLeft) {
  if (typeof str === 'undefined') 
    return pad;
  if (padLeft) {
    return (pad + str).slice(-pad.length);
  } else {
    return (str + pad).substring(0, pad.length);
  }
}
export const formatJSDate = function(date=null,formatFrom='',formatTo=''){
	
	var dt = date==null? new Date() : new Date(date);
	
  //console.log('date=',dt);
	var [d,m,y,h,mn,s] = [dt.getDate(),dt.getMonth(),dt.getFullYear(),dt.getHours(),dt.getMinutes(),dt.getSeconds()];
	
	//m+=1;
  d = d<10? '0'+d:d;
  h = h<10? '0'+h:h;
	if(formatFrom!=''){
		var month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		// var D = 'Mon';
		// var M = 'JAN';
		
		//dd-mm-yyyy
		//dd/mm/yyyy
		//MM dd, yyyy
		//alert(d+"-"+m+"-"+y);
    if(formatFrom.indexOf('F')>=0){
      formatFrom = formatFrom.replace('F',month_names[m]);
    }else{
      formatFrom = formatFrom.replace('MMM',month_names_short[m]);
    }
		
		formatFrom = formatFrom.replace('dd',d);
		formatFrom = formatFrom.replace('y',y);
		return formatFrom;
	} else {
    
    m+=1;
   
    m = m<10? '0'+m:m;
    
		var current_date = d + "-" + m + "-" + y + " " + h + ":" + mn;
		
    return current_date;
	}
    return null;
}
export const isValidPanCardNo = function (pan_value) {
  var pan_value = pan_value.toUpperCase();
  var reg = /^[a-zA-Z]{3}[PCHFATBLJG]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$/;
  var pan = {
    C: "Company",
    P: "Personal",
    H: "Hindu Undivided Family (HUF)",
    F: "Firm",
    A: "Association of Persons (AOP)",
    T: "AOP (Trust)",
    B: "Body of Individuals 		(BOI)",
    L: "Local Authority",
    J: "Artificial Juridical Person",
    G: "Govt"
  };
  pan = pan[pan_value[3]];
 
  if (pan_value.match(reg)) {
    return true;
  } else {
    return false;
  }
}
