function exchange(id){
			var ie=document.all&&!window.opera? document.all : 0
			var frmObj=ie? ie[id] : document.getElementById(id)
			var toObj=ie? ie[id+'b'] : document.getElementById(id+'b')
			toObj.style.width=frmObj.offsetWidth+7+'px'
			frmObj.style.display='none';
			toObj.style.display='inline';
			toObj.value=frmObj.innerHTML
			toObj.focus();
			toObj.select();
		}
		function exchangeBack(id){
			var ie=document.all&&!window.opera? document.all : 0
			var frmObj=ie? ie[id] : document.getElementById(id)
			var toObj=ie? ie[id.substr(0,id.length - 1)] : document.getElementById(id.substr(0,id.length - 1))
			frmObj.style.display='none';
			toObj.style.display='inline';
			console.log(frmObj.innerHTML);
			toObj.innerHTML=frmObj.value;
		}